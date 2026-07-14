from datetime import date, datetime, time as time_type
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class BitacoraBase(BaseModel):
    nombre: str
    primer_apellido: Optional[str] = None
    segundo_apellido: Optional[str] = None
    correo: Optional[EmailStr] = None
    telefono: Optional[str] = None

    estado: str
    instancia: Optional[str] = None

    fecha: date
    hora: time_type

    tipo_caso: str
    atendido_por: str
    observaciones: Optional[str] = None

    estatus: str
    tipo_registro: str


class BitacoraCreate(BitacoraBase):
    pass


class BitacoraUpdate(BaseModel):
    nombre: Optional[str] = None
    primer_apellido: Optional[str] = None
    segundo_apellido: Optional[str] = None
    correo: Optional[EmailStr] = None
    telefono: Optional[str] = None
    estado: Optional[str] = None
    instancia: Optional[str] = None
    fecha: Optional[date] = None
    hora: Optional[time_type] = None
    tipo_caso: Optional[str] = None
    atendido_por: Optional[str] = None
    observaciones: Optional[str] = None
    estatus: Optional[str] = None
    tipo_registro: Optional[str] = None


class BitacoraOut(BitacoraBase):
    id: int
    folio: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    usuario_id: int

    model_config = ConfigDict(from_attributes=True)