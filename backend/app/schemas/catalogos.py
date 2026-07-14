from typing import Optional

from pydantic import BaseModel, ConfigDict


class EstadoOut(BaseModel):
    id_estado: int
    clave_estado: Optional[str]
    nombre: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class MunicipioOut(BaseModel):
    id_municipio: int
    clave_estado: Optional[str]
    clave_municipio: Optional[str]
    clave: Optional[str]
    nombre: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class TipoCasoOut(BaseModel):
    id_tipo_caso: int
    nombre: str
    descripcion: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class EstatusBitacoraOut(BaseModel):
    id_estatus: int
    nombre: str
    orden: Optional[int]

    model_config = ConfigDict(from_attributes=True)


class TipoRegistroOut(BaseModel):
    id_tipo_registro: int
    clave: str
    nombre: str
    descripcion: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class PersonaAtendioOut(BaseModel):
    id_persona_atendio: int
    nombre_completo: str
    correo: Optional[str]
    puesto: Optional[str]

    model_config = ConfigDict(from_attributes=True)