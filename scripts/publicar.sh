#!/usr/bin/env bash
# Construye el sitio y sube dist/ a la rama `publicado` (la que Hostinger clona en public_html).
# Agrega un commit nuevo; nunca reescribe la historia de la rama.
set -euo pipefail
cd "$(dirname "$0")/.."
node build.mjs
RAIZ="$(pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
URL="$(git remote get-url origin)"
if git ls-remote --exit-code --heads origin publicado >/dev/null 2>&1; then
  git clone -q --depth 1 --branch publicado "$URL" "$TMP/pub"
else
  git init -q -b publicado "$TMP/pub"
  git -C "$TMP/pub" remote add origin "$URL"
fi
find "$TMP/pub" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -a "$RAIZ/dist/." "$TMP/pub/"
cd "$TMP/pub"
git add -A
if git diff --cached --quiet; then echo "Sin cambios que publicar."; exit 0; fi
git -c user.name="ecoems.net" -c user.email="noreply@anthropic.com" commit -q -m "Publicar $(date -u +%Y-%m-%dT%H:%MZ) desde $(git -C "$RAIZ" rev-parse --short HEAD)"
git push -q origin publicado
echo "Publicado en la rama publicado."
