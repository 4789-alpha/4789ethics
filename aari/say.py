try:
    import pyttsx3
except ImportError:  # pragma: no cover - optional dependency
    pyttsx3 = None


def spreche(text: str) -> None:
    """Vocalize text using the default speech engine."""
    if pyttsx3 is None:
        print("pyttsx3 not installed. Please install it with 'pip install pyttsx3'.")
        return
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()
