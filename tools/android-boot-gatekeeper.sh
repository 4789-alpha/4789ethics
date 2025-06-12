#!/bin/sh
# Android boot helper for the 4789 gatekeeper.
# Copy this file to ~/.termux/boot/ and make it executable.

echo "Diese Struktur wird ohne Gewährleistung bereitgestellt."
echo "Die Nutzung erfolgt auf eigene Verantwortung."
echo "4789 ist ein Standard für Verantwortung, keine Person und kein Glaubenssystem."
echo "Nutzung nur reflektiert und mit Konsequenz, niemals zur Manipulation oder unkontrollierten Automatisierung."

DIR="${GATEKEEPER_DIR:-$HOME/gatekeeper}"
cd "$DIR" 2>/dev/null || exit 0

TOKEN=""
[ -f temp_token.txt ] && TOKEN="$(cat temp_token.txt)"

if [ -f gatekeeper.js ]; then
  node gatekeeper.js "$TOKEN" >> gatekeeper_boot.log 2>&1 &
else
  node tools/start-server.js index.html >> gatekeeper_boot.log 2>&1 &
fi
