#!/usr/bin/env python3
"""Fetch and analyze webpage content, returning an anonymized word-frequency model."""
import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser

import requests


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)

    def get_text(self):
        return " ".join(self.parts)


def fetch_html(url):
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.text


def sanitize(text):
    # replace emails and long numbers
    text = re.sub(r"[\w.-]+@[\w.-]+", "[EMAIL]", text)
    text = re.sub(r"\b\d{4,}\b", "[NUMBER]", text)
    return text


def build_model(text):
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    counts = Counter(words)
    return counts.most_common(20)


def main():
    if len(sys.argv) < 2:
        print("Usage: web_analyzer.py <url>")
        return
    url = sys.argv[1]
    html = fetch_html(url)
    parser = TextExtractor()
    parser.feed(html)
    clean = sanitize(parser.get_text())
    model = build_model(clean)
    result = {"url": url, "top_words": model}
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    # Use in accordance with LICENSE.txt and DISCLAIMERS.md
    main()

