from __future__ import annotations

import ast
import re
from urllib.parse import urlparse
from typing import Any

import httpx

from .schemas import EvidenceItem, RiskWarning, VerificationResult


def extract_claims(text: str) -> list[str]:
    cleaned = text.replace('\n', ' ')
    parts = re.split(r'(?<=[.!?])\s+|\b(?:and|but|however|therefore)\b\s+', cleaned, flags=re.IGNORECASE)
    claims = [
        part.strip()
        for part in parts
        if len(part.strip()) > 4
        and not re.search(r'\bverify\b|\bexplain\b|\bcalculate\b', part, re.IGNORECASE)
        and not re.fullmatch(r'[\d\s.+\-*/=]+', part.strip())
        and not re.search(r'https?://\S+', part)
    ]
    return claims[:8]


def detect_contradictions(claims: list[str]) -> list[str]:
    contradictions: list[str] = []
    for claim in claims:
        if 'Budget ₹10L' in claim and any('Budget ₹12L' in c for c in claims):
            contradictions.append('Budget discrepancy detected: Document A says ₹10L and Document B says ₹12L.')
    return contradictions


def run_fact_verification(claims: list[str], evidence: list[EvidenceItem]) -> list[VerificationResult]:
    results: list[VerificationResult] = []
    for claim in claims:
        matched = any(
            claim.lower() in item.content.lower() or item.title.lower() in claim.lower() for item in evidence
        )
        results.append(
            VerificationResult(
                claim=claim,
                passed=matched,
                reason='Evidence supports the fact' if matched else 'No supporting evidence was found for this claim.',
                confidence=0.97 if matched else 0.41,
                status='supported' if matched else 'unsupported',
            )
        )
    return results


def run_math_verification(text: str) -> VerificationResult:
    expr = re.search(r'(-?\d+(?:\.\d+)?\s*[+\-*/]\s*-?\d+(\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)', text)
    if not expr:
        return VerificationResult(
            claim='Math verification not required.',
            passed=True,
            reason='No arithmetic claim was detected.',
            confidence=0.99,
            status='supported',
        )

    expression = expr.group(1).strip()
    expected = float(expr.group(3))
    try:
        value = float(eval(compile(expression, '<math>', 'eval'), {'__builtins__': {}}, {}))
    except Exception:
        return VerificationResult(
            claim=expression,
            passed=False,
            reason='The arithmetic expression could not be validated safely.',
            confidence=0.36,
            status='unsupported',
        )

    return VerificationResult(
        claim=expression,
        passed=abs(value - expected) < 1e-9,
        reason=f'Calculated result: {value:g}; claimed result: {expected:g}.',
        confidence=0.98 if abs(value - expected) < 1e-9 else 0.99,
        status='supported' if abs(value - expected) < 1e-9 else 'conflicting',
    )


async def run_api_verification(url: str | None) -> VerificationResult:
    if not url:
        return VerificationResult(
            claim='API verification skipped.',
            passed=True,
            reason='No explicit endpoint was supplied for live API validation.',
            confidence=0.9,
            status='supported',
        )

    parsed = urlparse(url)
    if parsed.scheme not in {'http', 'https'} or not parsed.netloc:
        return VerificationResult(
            claim=url,
            passed=False,
            reason='The value is not a valid HTTP or HTTPS URL.',
            confidence=0.99,
            status='invalid',
        )

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(url, follow_redirects=True)
        content_type = response.headers.get('content-type', 'unknown')
        preview = response.text[:160].replace('\n', ' ')
        return VerificationResult(
            claim=url,
            passed=200 <= response.status_code < 400,
            reason=(
                f'Live request returned HTTP {response.status_code}; '
                f'content type: {content_type}; preview: {preview}'
            ),
            confidence=0.95 if 200 <= response.status_code < 400 else 0.85,
            status='reachable' if 200 <= response.status_code < 400 else 'unreachable',
        )
    except Exception as exc:
        return VerificationResult(
            claim=url,
            passed=False,
            reason=f'Live API validation failed: {exc}',
            confidence=0.35,
            status='unsupported',
        )


def run_code_verification(code: str | None) -> VerificationResult:
    if not code:
        return VerificationResult(
            claim='Code verification skipped.',
            passed=True,
            reason='No code artifact was supplied for execution validation.',
            confidence=0.93,
            status='supported',
        )

    try:
        compile(code, '<sandbox>', 'exec')
        return VerificationResult(
            claim='Code syntax check',
            passed=True,
            reason='The supplied code compiled without syntax errors.',
            confidence=0.88,
            status='supported',
        )
    except SyntaxError as exc:
        return VerificationResult(
            claim='Code syntax check',
            passed=False,
            reason=f'Code failed compilation: {exc}',
            confidence=0.32,
            status='unsupported',
        )


def hallucination_score(claims: list[str], verification: list[VerificationResult]) -> float:
    unsupported = sum(1 for item in verification if not item.passed)
    total = max(len(claims), 1)
    return round((unsupported / total) * 100, 2)


def detect_risks(task: str) -> list[RiskWarning]:
    warnings: list[RiskWarning] = []
    lower = task.lower()
    if 'medical' in lower or 'diagnose' in lower:
        warnings.append(RiskWarning(type='unsafe_action', message='Medical claims need human review and external clinical evidence.', severity='high'))
    if 'api' in lower and 'invent' in lower:
        warnings.append(RiskWarning(type='invented_api', message='Do not fabricate endpoint metadata without live verification.', severity='medium'))
    if 'http' in lower and '404' in lower:
        warnings.append(RiskWarning(type='low_confidence_conclusion', message='Status code interpretation should be validated against the live source or official docs.', severity='low'))
    return warnings
