from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class EvidenceItem(BaseModel):
    title: str
    source: str
    content: str
    confidence: float = Field(ge=0.0, le=1.0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict[str, Any] = Field(default_factory=dict)


class VerificationResult(BaseModel):
    claim: str
    passed: bool
    reason: str
    confidence: float = Field(ge=0.0, le=1.0)
    status: str = "supported"


class RiskWarning(BaseModel):
    type: str
    message: str
    severity: str


class ChatRequest(BaseModel):
    task: str = Field(..., min_length=3)
    session_id: str | None = None


class ChatResponse(BaseModel):
    session_id: str
    decision: str
    confidence: float
    answer: str
    evidence: list[EvidenceItem]
    verification_results: list[VerificationResult]
    warnings: list[RiskWarning]
    revision_count: int


class SessionRecord(BaseModel):
    id: str
    task: str
    status: str
    created_at: datetime


class EvaluationMetric(BaseModel):
    scenario: str
    generation_quality: float
    verification_quality: float
    hallucination_detection: float
    contradiction_recall: float
    revision_success: float
    rejection_accuracy: float
