"""Simple speech input using the speech_recognition package."""

import speech_recognition as sr


def hoere() -> str:
    """Capture audio from the microphone and return recognized text."""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Sprechen...")
        audio = recognizer.listen(source)
    try:
        return recognizer.recognize_google(audio, language="de-DE")
    except sr.UnknownValueError:
        return ""
    except sr.RequestError as exc:
        raise RuntimeError(f"Recognition request failed: {exc}")
