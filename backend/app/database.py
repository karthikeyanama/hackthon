from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

from .config import get_settings


class Base(DeclarativeBase):
    pass


settings = get_settings()
engine = create_engine(settings.database_url, future=True)


def init_db() -> None:
    # This project uses a modular database layer ready for PostgreSQL and pgvector integration.
    return None
