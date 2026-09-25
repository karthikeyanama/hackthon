from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, Field

from .rag import semantic_search
from .schemas import EvidenceItem, RiskWarning, VerificationResult
from .verification import (
    detect_contradictions,
    detect_risks,
    extract_claims,
    hallucination_score,
    run_api_verification,
    run_code_verification,
    run_fact_verification,
    run_math_verification,
)


class AgentState(BaseModel):
    task: str
    evidence: list[EvidenceItem] = Field(default_factory=list)
    claims: list[str] = Field(default_factory=list)
    revisions: int = 0
    confidence: float = 0.0
    verification_results: list[VerificationResult] = Field(default_factory=list)
    contradictions: list[str] = Field(default_factory=list)
    decision: str = 'pending'
    warnings: list[RiskWarning] = Field(default_factory=list)


def planner_agent(task: str) -> dict[str, Any]:
    sub_tasks = [
        'understand scope',
        'retrieve evidence',
        'validate tool output',
        'check contradictions',
        'determine final accept or reject decision',
    ]
    return {'task': task, 'sub_tasks': sub_tasks, 'ambiguity': 'low'}


def research_agent(task: str) -> list[EvidenceItem]:
    return semantic_search(task, limit=4)


def tool_agent(task: str) -> dict[str, Any]:
    url_match = re.search(r'https?://\S+', task)
    code_match = re.search(r'```python\s*(.*?)```', task, re.S)
    return {
        'endpoint': url_match.group(0) if url_match else None,
        'code': code_match.group(1) if code_match else None,
        'tool_summary': 'API endpoint and code validation have been prepared for checking.',
    }


async def verifier_agent(task: str, evidence: list[EvidenceItem], tool_info: dict[str, Any]) -> list[VerificationResult]:
    claims = extract_claims(task)
    if tool_info.get('endpoint'):
        claims = [
            claim for claim in claims
            if not re.search(r'\bverify whether\b|\bexplain what it returns\b', claim, re.IGNORECASE)
        ]
    list_results = run_fact_verification(claims, evidence)
    list_results.append(run_math_verification(task))
    list_results.append(run_code_verification(tool_info.get('code')))
    list_results.append(await run_api_verification(tool_info.get('endpoint')))
    return list_results


def critic_agent(verification_results: list[VerificationResult], task: str) -> list[str]:
    issues = [item.reason for item in verification_results if not item.passed]
    if not issues:
        return []
    return issues


def decision_engine(state: AgentState) -> str:
    failed = [item for item in state.verification_results if not item.passed]
    if not failed and not state.contradictions:
        return 'accept'
    if state.revisions >= 2:
        return 'reject'
    return 'revise'


def finalizer_agent(state: AgentState) -> dict[str, Any]:
    if state.decision == 'accept':
        answer = (
            'The live checks support this request. The verified observations are shown below. '
            'Reachability does not prove that a website is safe, official, or malware-free.'
        )
    elif state.decision == 'reject':
        answer = (
            'The request could not be verified. VeriMind will not invent an answer when live checks '
            'fail or the available evidence is insufficient.'
        )
    else:
        answer = (
            'The request needs revision because one or more checks did not agree. '
            'Review the failed verification results before relying on the output.'
        )
    return {
        'answer': answer,
        'decision': state.decision,
        'confidence': round(state.confidence, 3),
        'evidence': state.evidence,
        'verification_results': state.verification_results,
        'warnings': state.warnings,
    }


async def run_reasoning_workflow(task: str) -> dict[str, Any]:
    state = AgentState(task=task)
    plan = planner_agent(task)
    state.evidence = research_agent(task)
    state.claims = extract_claims(task)
    state.warnings = detect_risks(task)
    state.contradictions = detect_contradictions(state.claims)
    tool_info = tool_agent(task)
    state.verification_results = await verifier_agent(task, state.evidence, tool_info)
    if tool_info.get('endpoint'):
        endpoint_result = next(
            (item for item in state.verification_results if item.claim == tool_info['endpoint']),
            None,
        )
        if endpoint_result:
            state.evidence.append(
                EvidenceItem(
                    title='Live endpoint observation',
                    source=tool_info['endpoint'],
                    content=endpoint_result.reason,
                    confidence=endpoint_result.confidence,
                    metadata={'kind': 'live_http_check'},
                )
            )

    while state.revisions < 3:
        failed = [item for item in state.verification_results if not item.passed]
        if not failed and not state.contradictions:
            break
        state.revisions += 1
        state.decision = 'revise'
        if state.revisions >= 3:
            state.decision = 'reject'
            break
        state.evidence = research_agent(task)
        state.verification_results = await verifier_agent(task, state.evidence, tool_info)
        state.contradictions = detect_contradictions(state.claims)

    if state.decision != 'reject':
        state.decision = decision_engine(state)

    confidence = 0.0
    if state.verification_results:
        passed = sum(1 for item in state.verification_results if item.passed)
        confidence = passed / len(state.verification_results)
    state.confidence = confidence
    state.warnings = detect_risks(task)
    if not tool_info.get('endpoint') and not state.claims:
        state.warnings.append(
            RiskWarning(
                type='insufficient_input',
                message='No verifiable claim, URL, calculation, or code block was detected.',
                severity='medium',
            )
        )

    output = finalizer_agent(state)
    output['score'] = hallucination_score(state.claims, state.verification_results)
    output['revisions'] = state.revisions
    output['timestamp'] = datetime.now(timezone.utc).isoformat()
    return output
