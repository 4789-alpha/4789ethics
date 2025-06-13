"""Basic shard and reconstruction logic for MYRIA data vaults."""
from pathlib import Path
import hashlib


def split_file(path: str, shard_size: int = 1024):
    """Split a file into shards of given size."""
    data = Path(path).read_bytes()
    return [data[i:i + shard_size] for i in range(0, len(data), shard_size)]


def assemble_shards(shards, dest: str):
    """Reassemble shards into a file."""
    data = b"".join(shards)
    Path(dest).write_bytes(data)


def shard_id(content: bytes) -> str:
    """Return a deterministic ID for a shard."""
    return hashlib.sha256(content).hexdigest()
