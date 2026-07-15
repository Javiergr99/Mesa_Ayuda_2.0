from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
)
from app.models.user import User


def register_user(db: Session, payload):
    if db.scalar(
        select(User).where(
            User.email == payload.email
        )
    ):
        raise HTTPException(
            status_code=409,
            detail="Email ya registrado",
        )

    if db.scalar(
        select(User).where(
            User.username == payload.username
        )
    ):
        raise HTTPException(
            status_code=409,
            detail="Usuario ya registrado",
        )

    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(
            payload.password
        ),
    )

    db.add(user)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError as error:
        db.rollback()

        message = (
            str(error.orig)
            if hasattr(error, "orig")
            else str(error)
        )

        if (
            "users.email" in message
            or "UNIQUE constraint failed: users.email"
            in message
        ):
            raise HTTPException(
                status_code=409,
                detail="Email ya registrado",
            ) from error

        if (
            "users.username" in message
            or "UNIQUE constraint failed: users.username"
            in message
        ):
            raise HTTPException(
                status_code=409,
                detail="Usuario ya registrado",
            ) from error

        raise HTTPException(
            status_code=400,
            detail="Datos inválidos",
        ) from error

    return user


def authenticate_user(
    db: Session,
    identifier: str,
    password: str,
):
    user = db.scalar(
        select(User).where(
            User.username == identifier
        )
    )

    if not user:
        user = db.scalar(
            select(User).where(
                User.email == identifier
            )
        )

    valid_credentials = (
        user is not None
        and user.is_active
        and verify_password(
            password,
            user.password_hash,
        )
    )

    if not valid_credentials:
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas",
        )

    return user
