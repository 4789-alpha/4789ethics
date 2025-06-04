#!/usr/bin/env python3
"""Check connectivity to the local or remote 4789 LLM API."""
import json
from api_example import load_llm_config, call_llm


def main():
    import sys
    prompt = ' '.join(sys.argv[1:]) or 'Ping'
    try:
        result = call_llm(prompt, load_llm_config())
        print(json.dumps(result, indent=2))
        print('API reachable.')
    except Exception as exc:
        print('API request failed:', exc)
        exit(1)


if __name__ == '__main__':
    main()
