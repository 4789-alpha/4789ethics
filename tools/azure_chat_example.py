#!/usr/bin/env python3
"""Sample Azure Chat Completion call using the GitHub endpoint."""
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

ENDPOINT = "https://models.github.ai/inference"
MODEL = "openai/gpt-4.1"


def main():
    token = os.environ["GITHUB_TOKEN"]
    client = ChatCompletionsClient(
        endpoint=ENDPOINT,
        credential=AzureKeyCredential(token),
    )
    response = client.complete(
        messages=[
            SystemMessage("You are a helpful assistant."),
            UserMessage("What is the capital of France?"),
        ],
        temperature=1.0,
        top_p=1.0,
        model=MODEL,
    )
    print(response.choices[0].message.content)


if __name__ == "__main__":
    main()
