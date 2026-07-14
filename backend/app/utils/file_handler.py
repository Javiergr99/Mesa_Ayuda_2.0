from datetime import datetime, timezone
from pathlib import Path
import os


UPLOAD_DIR = Path("uploads") / "bitacoras"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def ensure_bitacora_dir(bitacora_id: int) -> Path:
    bit_dir = UPLOAD_DIR / str(bitacora_id)
    bit_dir.mkdir(parents=True, exist_ok=True)
    return bit_dir


def build_stored_name(filename: str) -> tuple[str, str]:
    safe_name = os.path.basename(filename or "archivo")
    ts = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
    stored_name = f"{ts}_{safe_name}"
    return safe_name, stored_name