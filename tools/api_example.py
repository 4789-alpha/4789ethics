#!/usr/bin/env python3
"""Minimal API client using requests for the 4789 LLM."""
import os
import json
import requests

CONFIG_PATH = os.path.join(os.path.dirname(__file__), '..', 'app', 'llm_config.yaml')


def load_llm_config(path=CONFIG_PATH):
    cfg = {}
    level0 = None
    level1 = None
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip() or line.strip().startswith('#'):
                continue
            indent = len(line) - len(line.lstrip(' '))
            line = line.rstrip()
            if indent == 0:
                key = line.rstrip(':')
                level0 = key
                cfg[level0] = {}
            elif indent == 2:
                if line.strip().endswith(':'):
                    key = line.strip()[:-1]
                    cfg[level0][key] = {}
                    level1 = key
                else:
                    k, v = line.strip().split(':', 1)
                    val = v.strip().strip('"')
                    if val == 'null':
                        val = None
                    cfg[level0][k.strip()] = val
            elif indent == 4 and level1:
                k, v = line.strip().split(':', 1)
                val = v.strip().strip('"')
                cfg[level0][level1][k.strip()] = val
    return cfg.get('llm', cfg)


def call_llm(prompt, config=None):
    cfg = config or load_llm_config()
    url = cfg.get('url')
    headers = cfg.get('headers', {})
    payload = {
        'model': cfg.get('model'),
        'prompt': prompt,
    }
    response = requests.post(url, json=payload, headers=headers, timeout=int(cfg.get('timeout', 10)))
    response.raise_for_status()
    return response.json()


def main():
    import sys
    prompt = ' '.join(sys.argv[1:]) or 'Explain responsibility briefly.'
    try:
        result = call_llm(prompt)
        print(json.dumps(result, indent=2))
    except Exception as exc:
        print('API request failed:', exc)


if __name__ == '__main__':
    main()
