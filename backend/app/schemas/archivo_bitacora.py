from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ArchivoOut(BaseModel):
    id: int
    original_name: str
    stored_name: str
    content_type: Optional[str]
    size_bytes: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)