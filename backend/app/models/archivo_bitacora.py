from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class ArchivoBitacora(Base):
    __tablename__ = "bitacora_archivos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bitacora_id: Mapped[int] = mapped_column(Integer, ForeignKey("bitacoras.id"), nullable=False)

    original_name: Mapped[str] = mapped_column(String(255), nullable=False)
    stored_name: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    bitacora: Mapped["Bitacora"] = relationship(back_populates="archivos")