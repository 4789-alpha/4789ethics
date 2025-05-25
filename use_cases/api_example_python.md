# API Example with Python Requests

`tools/api_example.py` demonstrates how to send a prompt to the local 4789 LLM.
It reads the endpoint from `app/llm_config.yaml` and prints the JSON response.

Run:

```bash
python3 tools/api_example.py "Your prompt here"
```

Ensure the configured API server is reachable. Offline environments may skip network calls.
