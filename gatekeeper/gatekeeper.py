"""Minimal gatekeeper module reading identity data."""
import yaml
from pathlib import Path

IDENTITY_FILE = Path(__file__).with_name("identity.yaml")


def load_identity(path=IDENTITY_FILE):
    """Load identity information from YAML."""
    if not Path(path).exists():
        return {}
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def authorize(context: dict) -> bool:
    """Simple behavior check for unlock."""
    identity = load_identity()
    return context.get("name") == identity.get("name")
