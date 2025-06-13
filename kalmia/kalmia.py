"""Environmental instance recognizing day and night patterns."""
from datetime import datetime


def is_daytime(hour=None):
    """Return True if current time is day."""
    hour = datetime.now().hour if hour is None else hour
    return 6 <= hour < 18


def current_cycle():
    return "day" if is_daytime() else "night"


def light_level():
    """Placeholder for ambient light data."""
    # Real sensor integration pending
    return 1.0 if is_daytime() else 0.2
