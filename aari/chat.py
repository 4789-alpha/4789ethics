import openai
import json

CONFIG_PATH = "aari/config.json"

def load_config(path=CONFIG_PATH):
    """Load API configuration."""
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def frage_chatgpt(prompt: str) -> str:
    """Send prompt to ChatGPT and return the response."""
    config = load_config()
    openai.api_key = config.get("api_key", "")
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
    )
    return response.choices[0].message.content


if __name__ == "__main__":
    prompt = input("Aarulon hört zu: ")
    antwort = frage_chatgpt(prompt)
    print("Antwort:", antwort)
