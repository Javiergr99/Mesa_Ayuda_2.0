from typing import Optional

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class CatEstado(Base):
    __tablename__ = "cat_estado"

    id_estado: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    clave_estado: Mapped[Optional[str]] = mapped_column(String(2))
    nombre: Mapped[Optional[str]] = mapped_column(String(255))
    x: Mapped[Optional[str]] = mapped_column(String(255))
    y: Mapped[Optional[str]] = mapped_column(String(255))


class CatMunicipioOld(Base):
    __tablename__ = "cat_municipio_old"

    id_municipio: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    clave_estado: Mapped[Optional[str]] = mapped_column(String(2))
    clave_municipio: Mapped[Optional[str]] = mapped_column(String(3))
    clave: Mapped[Optional[str]] = mapped_column(String(5))
    nombre: Mapped[Optional[str]] = mapped_column(String(255))
    x: Mapped[Optional[str]] = mapped_column(String(255))
    y: Mapped[Optional[str]] = mapped_column(String(255))


class CatTipoCaso(Base):
    __tablename__ = "cat_tipo_caso"

    id_tipo_caso: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    descripcion: Mapped[Optional[str]] = mapped_column(String(255))
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class CatEstatusBitacora(Base):
    __tablename__ = "cat_estatus_bitacora"

    id_estatus: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False)
    orden: Mapped[Optional[int]] = mapped_column(Integer)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class CatTipoRegistro(Base):
    __tablename__ = "cat_tipo_registro"

    id_tipo_registro: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    clave: Mapped[str] = mapped_column(String(10), nullable=False)
    nombre: Mapped[str] = mapped_column(String(255), nullable=False)
    descripcion: Mapped[Optional[str]] = mapped_column(String(255))
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class CatPersonaAtendio(Base):
    __tablename__ = "cat_persona_atendio"

    id_persona_atendio: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre_completo: Mapped[str] = mapped_column(String(200), nullable=False)
    correo: Mapped[Optional[str]] = mapped_column(String(150))
    puesto: Mapped[Optional[str]] = mapped_column(String(150))
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)