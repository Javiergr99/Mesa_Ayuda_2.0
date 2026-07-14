from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.core.security import hash_password, verify_password
from app.models.user import User


def register_user(db: Session, payload):
    if db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(status_code=409, detail="Email ya registrado")

    if db.scalar(select(User).where(User.username == payload.username)):
        raise HTTPException(status_code=409, detail="Usuario ya registrado")

    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(payload.password),
    )

    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError as e:
        db.rollback()
        msg = str(e.orig) if hasattr(e, "orig") else str(e)

        if "users.email" in msg or "UNIQUE constraint failed: users.email" in msg:
            raise HTTPException(status_code=409, detail="Email ya registrado")
        if "users.username" in msg or "UNIQUE constraint failed: users.username" in msg:
            raise HTTPException(status_code=409, detail="Usuario ya registrado")

        raise HTTPException(status_code=400, detail="Datos inválidos") from e

    return user


def authenticate_user(db: Session, identifier: str, password: str):
    user = db.scalar(select(User).where(User.username == identifier))
    if not user:
        user = db.scalar(select(User).where(User.email == identifier))

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    return user