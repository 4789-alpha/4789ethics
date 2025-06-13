#!/bin/sh
# Guided installation helper for Ethics Structure 4789
set -e

# Always operate from the repository root so relative paths work regardless
# of the current directory.
cd "$(dirname "$0")/.."

# Basic disclaimers
echo "Diese Struktur wird ohne Gewährleistung bereitgestellt. Fehler oder Auslassungen sind möglich."
echo "Die Nutzung erfolgt auf eigene Verantwortung. Weder Signature 4789 noch die Maintainer haften für Folgen oder Anspr\u00fcche."
echo "4789 ist ein Standard f\u00fcr Verantwortung, keine Person und kein Glaubenssystem."
echo "Nutzung nur reflektiert und mit Konsequenz, niemals zur Manipulation oder unkontrollierten Automatisierung."

# Helper to detect affirmative answers in multiple languages
is_yes() {
  case "$(printf "%s" "$1" | tr '[:upper:]' '[:lower:]')" in
    yes|y|ja|j|si|sí|sim|oui|da|hai|ok|okay) return 0 ;;
    *) return 1 ;;
  esac
}

printf "Fortfahren? (yes/no) "
read answer
if ! is_yes "$answer"; then
  echo "Abbruch."
  exit 1
fi

need_node() {
  echo "Node.js 18+ wird ben\u00f6tigt."
  if [ "$(uname)" = "Darwin" ]; then
    if command -v brew >/dev/null 2>&1; then
      echo "Installing Node.js via Homebrew..."
      brew install node@18
      brew link --force --overwrite node@18
    else
      echo "Homebrew fehlt. Bitte Node.js manuell installieren."
      exit 1
    fi
  elif [ -f /etc/debian_version ]; then
    echo "Installing Node.js via apt..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
  else
    echo "Automatic Node.js installation nicht unterst\u00fctzt."
    exit 1
  fi
}

if command -v node >/dev/null 2>&1; then
  ver=$(node -v | cut -c2- | cut -d. -f1)
  if [ "$ver" -lt 18 ]; then
    need_node
  fi
else
  need_node
fi

echo "Installing npm dependencies..."
npm install

printf "Python-Abh\u00e4ngigkeiten installieren? (yes/no) "
read answer
if is_yes "$answer"; then
  pip install -r requirements.txt
fi

printf "Offline-Konfiguration starten? (yes/no) "
read answer
if is_yes "$answer"; then
  python3 install.py
fi

printf "Optionale Daten abrufen? (yes/no) "
read answer
if is_yes "$answer"; then
  node tools/currency-sync.js
  node tools/fetch-wiki-images.js
fi

echo "Installation abgeschlossen."
