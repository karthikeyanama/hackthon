from functools import lru_cache
from typing import Any

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "VeriMind AI"
    environment: str = "development"
    gemini_api_key: str | None = Field(default=None, alias="GEMINI_API_KEY")
    database_url: str = Field(default="postgresql://postgres:postgres@db:5432/verimind", alias="DATABASE_URL")
    supabase_url: str | None = Field(default=None, alias="SUPABASE_URL")
    supabase_key: str | None = Field(default=None, alias="SUPABASE_KEY")

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    @property
    def is_prod(self) -> bool:
        return self.environment == 'production'


@lru_cache
def get_settings() -> Settings:
    return Settings()
