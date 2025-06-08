#!/usr/bin/env python3
"""Simple text-to-speech helper for 4789ethics."""
import sys

try:
    import pyttsx3
except ImportError:  # pragma: no cover - optional dependency
    print("pyttsx3 not installed. Please install it with 'pip install pyttsx3'.")
    sys.exit(1)

engine = pyttsx3.init()
text = " ".join(sys.argv[1:]).strip()
if not text:
    print("Usage: text_to_speech.py <text>")
    sys.exit(1)

engine.say(text)
engine.runAndWait()
