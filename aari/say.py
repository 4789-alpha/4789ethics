import pyttsx3


def spreche(text: str) -> None:
    """Vocalize text using the default speech engine."""
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()
