# API Example with Python Requests

`tools/api_example.py` demonstrates how to send a prompt to the local 4789 LLM.
It reads the endpoint from `app/llm_config.yaml` and prints the JSON response.

Run:

```bash
python3 tools/api_example.py "Your prompt here"
```

Ensure the configured API server is reachable. Offline environments may skip network calls.

For a quick connectivity check you can run:

```bash
python3 tools/check_api.py
```

This script loads the same configuration and reports whether the LLM API responds.

## Azure AI Inference Example

If you have a GitHub personal access token, you can call the Azure-hosted models.

1. Install the SDK:

   ```bash
   pip install azure-ai-inference
   ```

2. Export your token so the client can pick it up:

   ```bash
   export GITHUB_TOKEN=<your-token>
   ```

3. Run a basic sample:

   ```python
   import os
   from azure.ai.inference import ChatCompletionsClient
   from azure.ai.inference.models import SystemMessage, UserMessage
   from azure.core.credentials import AzureKeyCredential

   client = ChatCompletionsClient(
       endpoint="https://models.github.ai/inference",
       credential=AzureKeyCredential(os.environ["GITHUB_TOKEN"]),
   )

   response = client.complete(
       messages=[
           SystemMessage("You are a helpful assistant."),
           UserMessage("What is the capital of France?"),
       ],
       model="openai/gpt-4.1",
   )

   print(response.choices[0].message.content)
   ```

This uses your exported token to authenticate the request and prints the model's reply.
