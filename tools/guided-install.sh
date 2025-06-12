#!/bin/sh
# Guided installation helper for Ethics Structure 4789
set -e

# Basic disclaimers
echo "Diese Struktur wird ohne Gewährleistung bereitgestellt. Fehler oder Auslassungen sind möglich."
echo "Die Nutzung erfolgt auf eigene Verantwortung. Weder Signature 4789 noch die Maintainer haften für Folgen oder Anspr\u00fcche."
echo "4789 ist ein Standard f\u00fcr Verantwortung, keine Person und kein Glaubenssystem."
echo "Nutzung nur reflektiert und mit Konsequenz, niemals zur Manipulation oder unkontrollierten Automatisierung."

printf "Fortfahren? (yes/no) "
read answer
answer=$(printf "%s" "$answer" | tr '[:upper:]' '[:lower:]')
case "$answer" in
  yes|y|ja|j|si|sí|sim|oui|da|hai|ok|okay) ;;
  *) echo "Abbruch."; exit 1;;
esac

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
if [ "$answer" = "yes" ]; then
  pip install -r requirements.txt
fi

printf "Offline-Konfiguration starten? (yes/no) "
read answer
if [ "$answer" = "yes" ]; then
  python3 install.py
fi

printf "Optionale Daten abrufen? (yes/no) "
read answer
if [ "$answer" = "yes" ]; then
  node tools/currency-sync.js
  node tools/fetch-wiki-images.js
fi

echo "Installation abgeschlossen."
