from __future__ import annotations

import hashlib
from datetime import datetime, timezone

from .schemas import EvidenceItem

STOP_WORDS = {
    'and', 'are', 'does', 'for', 'from', 'how', 'is', 'of', 'or', 'the',
    'this', 'what', 'when', 'where', 'which', 'who', 'with',
}


BASE_DOCUMENTS = [
    {
        'title': 'HTTP status semantics',
        'source': 'MDN',
        'content': 'HTTP 404 means the resource was not found or is unreachable in the current context.',
        'metadata': {'kind': 'status_code'},
    },
    {
        'title': 'POST /users API contract',
        'source': 'Internal API specification',
        'content': 'The /users endpoint accepts email, name, and role and returns a JSON object with id and created_at.',
        'metadata': {'kind': 'api_contract'},
    },
    {
        'title': 'Budget policy',
        'source': 'Finance policy',
        'content': 'Quarterly budget is capped at ₹10L for trial programs and ₹12L for expansion budgets.',
        'metadata': {'kind': 'policy'},
    },
]


def _token_score(query: str, text: str) -> int:
    query_terms = {
        part.lower().strip('.,:;!?()[]{}')
        for part in query.replace('-', ' ').split()
        if len(part) > 2 and part.lower().strip('.,:;!?()[]{}') not in STOP_WORDS
    }
    text_terms = {
        part.lower().strip('.,:;!?()[]{}')
        for part in text.replace('-', ' ').split()
        if len(part) > 2 and part.lower().strip('.,:;!?()[]{}') not in STOP_WORDS
    }
    return len(query_terms.intersection(text_terms))


def semantic_search(task: str, limit: int = 4) -> list[EvidenceItem]:
    hits: list[EvidenceItem] = []
    for document in BASE_DOCUMENTS:
        score = _token_score(task, document['content'])
        if score == 0:
            continue
        hits.append(
            EvidenceItem(
                title=document['title'],
                source=document['source'],
                content=document['content'],
                confidence=min(0.99, 0.7 + (score * 0.08)),
                timestamp=datetime.now(timezone.utc),
                metadata=document['metadata'],
            )
        )
    hits.sort(key=lambda item: item.confidence, reverse=True)
    return hits[:limit]


def embed_document(text: str) -> list[float]:
    digest = hashlib.sha256(text.encode()).digest()
    return [((byte / 255) * 2) - 1 for byte in digest[:16]]
