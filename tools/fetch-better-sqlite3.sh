#!/bin/sh
# Download the better-sqlite3 archive for offline installation.
set -e

# Disclaimers
echo "Diese Struktur wird ohne Gewährleistung bereitgestellt. Fehler oder Auslassungen sind möglich."
echo "Die Nutzung erfolgt auf eigene Verantwortung. Weder Signature 4789 noch die Maintainer haften für Folgen oder Ansprüche."
echo "4789 ist ein Standard für Verantwortung, keine Person und kein Glaubenssystem."
echo "Nutzung nur reflektiert und mit Konsequenz, niemals zur Manipulation oder unkontrollierten Automatisierung."

# Always run from repository root
cd "$(dirname "$0")/.."

version=$(node -p "require('./package.json').dependencies['better-sqlite3']")
# Strip leading ^ if present
version=${version#^}

npm pack "better-sqlite3@$version"
mkdir -p downloads
mv "better-sqlite3-$version.tgz" "downloads/better-sqlite3-$version.tgz"

echo "Archive stored at downloads/better-sqlite3-$version.tgz"
