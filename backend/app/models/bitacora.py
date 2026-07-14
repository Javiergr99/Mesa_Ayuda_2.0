from __future__ import annotations

from datetime import date, datetime, time as time_type, timezone
from typing import List, Optional

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Bitacora(Base):
    __tablename__ = "bitacoras"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    folio: Mapped[str] = mapped_column(String(50), unique=True, index=True)

    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    primer_apellido: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    segundo_apellido: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    correo: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    telefono: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)

    estado: Mapped[str] = mapped_column(String(80), nullable=False)
    instancia: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    hora: Mapped[time_type] = mapped_column(Time, nullable=False)

    tipo_caso: Mapped[str] = mapped_column(String(150), nullable=False)
    atendido_por: Mapped[str] = mapped_column(String(200), nullable=False)
    observaciones: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    estatus: Mapped[str] = mapped_column(String(80), nullable=False)
    tipo_registro: Mapped[str] = mapped_column(String(150), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        default=None,
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=True,
    )

    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    usuario: Mapped["User"] = relationship(back_populates="bitacoras")

    archivos: Mapped[List["ArchivoBitacora"]] = relationship(
        back_populates="bitacora",
        cascade="all, delete-orphan",
    )