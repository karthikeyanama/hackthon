# VeriMind AI architecture

## System flow

1. User submits a request to the frontend.
2. The backend receives the task and stores a session record.
3. Planner decomposes the task and identifies required evidence.
4. Research retrieves supporting evidence and rankings.
5. Tool execution validates API or code operations.
6. Verifier checks claims, math, API status, and syntax.
7. Critic reviews contradictions and unsupported assertions.
8. Decision engine either accepts, revises, or rejects the result.
9. Finalizer returns the verified answer and audit record.

## Verification gates

- Fact verification compares extracted claims against retrieved evidence.
- Math verification recomputes arithmetic expressions.
- API verification performs live HTTP validation when a URL is provided.
- Code verification performs a compile check.
- Contradiction detection compares claims for inconsistency.
- Hallucination score summarises unsupported claims.

## Deployment model

- Frontend: Vercel
- Backend: Railway
- Database: Supabase with pgvector
- Sandbox: Docker

## Compliance notes

The architecture intentionally prevents agents from validating their own work. Every important answer must pass through the independent verification step before it is delivered to the user.
