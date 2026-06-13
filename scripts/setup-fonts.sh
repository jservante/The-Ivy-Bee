#!/usr/bin/env bash
# Registers the bundled premium fonts (Playfair Display, Cormorant Garamond,
# Jost) so the SVG renderer can use them. Run once per fresh environment.
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/fonts"
DEST="${HOME}/.local/share/fonts/ivybee"
mkdir -p "$DEST"
cp "$DIR"/*.ttf "$DEST"/ 2>/dev/null || true
fc-cache -f >/dev/null 2>&1 || true
echo "Ivy Bee fonts registered:"
fc-list | grep -iE "playfair|jost|cormorant" | sed 's/:.*//' | sort -u
