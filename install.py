#!/usr/bin/env python3
"""Offline setup helper for the 4789 interface."""
import os
import re
import sys

SETTINGS_FILE = os.path.join('app', 'app_settings.yaml')


def prompt(msg, default=None):
    if default is not None:
        msg = f"{msg} [{default}] "
    else:
        msg = f"{msg} "
    ans = input(msg).strip()
    return ans if ans else default


def read_current(key, default):
    if not os.path.exists(SETTINGS_FILE):
        return default
    with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
        data = f.read()
    m = re.search(rf"{re.escape(key)}:\s*([^\n]+)", data)
    if m:
        val = m.group(1).strip().strip('"')
        return val
    return default


def is_simple(value: str) -> bool:
    return value.lower() in {"true", "false"} or value.isdigit()


def update_yaml_value(key, value):
    if value is None:
        return
    lines = []
    found = False
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
            lines = f.read().splitlines()
    for i, line in enumerate(lines):
        if line.strip().startswith(f"{key}:"):
            indent = line[: len(line) - len(line.lstrip())]
            val = value if is_simple(value) else f'"{value}"'
            lines[i] = f"{indent}{key}: {val}"
            found = True
            break
    if not found:
        val = value if is_simple(value) else f'"{value}"'
        if not any(l.strip().startswith('app:') for l in lines):
            lines.insert(0, 'app:')
        lines.append(f"  {key}: {val}")
    with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines) + "\n")


def main():
    if any(a in ('-h', '--help') for a in sys.argv[1:]):
        print('Usage: install.py')
        print('Interactive setup for 4789 interface settings.')
        sys.exit(0)
    lang = prompt("Default interface language", read_current("default_language", "auto"))
    port = prompt("Interface port", read_current("interface_port", "8080"))
    offline = prompt("Offline mode (true/false)", read_current("offline_mode", "true"))
    update_yaml_value("default_language", lang)
    update_yaml_value("interface_port", port)
    update_yaml_value("offline_mode", offline)
    print(f"Updated {SETTINGS_FILE}")


if __name__ == "__main__":
    main()
