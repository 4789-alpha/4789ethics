#!/bin/sh
# Automatic module integration for the 4789 project.
set -e

# Key disclaimers
echo "Diese Struktur wird ohne Gew\u00e4hrleistung bereitgestellt. Fehler oder Auslassungen sind m\u00f6glich."
echo "Die Nutzung erfolgt auf eigene Verantwortung. Weder Signature 4789 noch die Maintainer haften f\u00fcr Folgen oder Anspr\u00fcche."
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

echo "Bundling interface modules..."
npm run bundle-interface

echo "Updating HTML references..."
node tools/unify-html.js

echo "Module setup complete."
