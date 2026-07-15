from typing import Literal

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_VERSION: str = "0.1.0-dev"
    ENVIRONMENT: str = "development"

    DATABASE_URL: str = "sqlite:///./dev.db"
    JWT_SECRET: str = "dev-secret-change-me"
    ACCESS_TTL_MIN: int = 15

    COOKIE_NAME: str = "access_token"
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: Literal["lax", "strict", "none"] = "lax"
    COOKIE_DOMAIN: str = ""
    COOKIE_PATH: str = "/"

    FRONTEND_ORIGINS: str = (
        "http://127.0.0.1:5173,"
        "http://localhost:5173,"
        "http://localhost:3000"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip().rstrip("/")
            for origin in self.FRONTEND_ORIGINS.split(",")
            if origin.strip()
        ]

    @property
    def cookie_domain(self) -> str | None:
        domain = self.COOKIE_DOMAIN.strip()
        return domain or None

    @model_validator(mode="after")
    def validate_security_settings(self):
        environment = self.ENVIRONMENT.strip().lower()
        is_production = environment in {
            "production",
            "prod",
            "staging",
        }

        if self.COOKIE_SAMESITE == "none" and not self.COOKIE_SECURE:
            raise ValueError(
                "COOKIE_SAMESITE='none' requiere COOKIE_SECURE=true."
            )

        if is_production:
            if len(self.JWT_SECRET) < 32:
                raise ValueError(
                    "JWT_SECRET debe tener al menos 32 caracteres en producción."
                )

            if self.JWT_SECRET == "dev-secret-change-me":
                raise ValueError(
                    "JWT_SECRET no puede conservar el valor de desarrollo "
                    "en producción."
                )

            if not self.COOKIE_SECURE:
                raise ValueError(
                    "COOKIE_SECURE debe ser true en producción."
                )

        return self


settings = Settings()
