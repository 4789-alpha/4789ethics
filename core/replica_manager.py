"""Simple replication manager for distributed shards."""
from pathlib import Path
import shutil


class ReplicaManager:
    """Replicates shards across given directories."""

    def __init__(self, replica_paths):
        self.paths = [Path(p) for p in replica_paths]
        for p in self.paths:
            p.mkdir(parents=True, exist_ok=True)

    def replicate(self, shard_path: str):
        source = Path(shard_path)
        for p in self.paths:
            shutil.copy2(source, p / source.name)
