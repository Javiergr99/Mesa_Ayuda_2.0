from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    model_validator,
)

from app.schemas.user import UserOut


class RegisterIn(BaseModel):
    email: EmailStr
    username: str = Field(
        min_length=3,
        max_length=80,
    )
    password: str = Field(
        min_length=8,
        max_length=256,
    )


class LoginIn(BaseModel):
    username: str | None = Field(
        default=None,
        min_length=1,
        max_length=80,
    )
    email: EmailStr | None = None
    password: str = Field(
        min_length=1,
        max_length=256,
    )

    @model_validator(mode="after")
    def validate_identifier(self):
        username = (self.username or "").strip()

        if not username and self.email is None:
            raise ValueError(
                "Debes proporcionar username o email."
            )

        self.username = username or None
        return self

    @property
    def identifier(self) -> str:
        if self.username:
            return self.username

        return str(self.email or "").strip()


class LoginResponse(BaseModel):
    ok: bool = True
    user: UserOut


class TokenPayload(BaseModel):
    sub: str
    exp: int
    iat: int | None = None
