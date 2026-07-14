from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.bitacora import Bitacora


def generar_folio(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    prefix = f"BIT-{year}-"

    last_folio: Optional[str] = (
        db.query(Bitacora.folio)
        .filter(Bitacora.folio.like(f"{prefix}%"))
        .order_by(Bitacora.folio.desc())
        .limit(1)
        .scalar()
    )

    if last_folio:
        try:
            last_seq = int(last_folio.split("-")[-1])
        except ValueError:
            last_seq = 0
    else:
        last_seq = 0

    return f"{prefix}{(last_seq + 1):05d}"


def crear_bitacora(db: Session, payload, current_user):
    folio = generar_folio(db)

    nueva = Bitacora(
        folio=folio,
        usuario_id=current_user.id,
        **payload.model_dump(),
    )

    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


def listar_bitacoras_usuario(db: Session, user_id: int):
    return (
        db.query(Bitacora)
        .filter(Bitacora.usuario_id == user_id)
        .order_by(Bitacora.created_at.desc())
        .all()
    )


def obtener_bitacora_usuario(db: Session, bitacora_id: int, user_id: int):
    bitacora = (
        db.query(Bitacora)
        .filter(Bitacora.id == bitacora_id, Bitacora.usuario_id == user_id)
        .first()
    )
    if not bitacora:
        raise HTTPException(status_code=404, detail="Bitácora no encontrada")
    return bitacora


def actualizar_bitacora_usuario(db: Session, bitacora_id: int, user_id: int, payload):
    bitacora = obtener_bitacora_usuario(db, bitacora_id, user_id)

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(bitacora, field, value)

    bitacora.updated_at = datetime.now(timezone.utc)
    db.add(bitacora)
    db.commit()
    db.refresh(bitacora)
    return bitacora


def eliminar_bitacora_usuario(db: Session, bitacora_id: int, user_id: int):
    bitacora = obtener_bitacora_usuario(db, bitacora_id, user_id)
    db.delete(bitacora)
    db.commit()
    return True