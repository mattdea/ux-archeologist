#!/bin/sh
# Shrinks Level 4 photos wider or taller than 750px to 750px (2x the 375pt
# feed column), keeping each file's own JPEG quality, capped at 80.
# Run after adding photos, e.g. after scripts/recover-instagram-2016.py.
#   scripts/shrink-feed-photos.sh            # all of assets/feed
#   scripts/shrink-feed-photos.sh some/dir   # one folder
set -e
root="${1:-assets/feed}"
find "$root" -name '*.jpg' -not -path '*/raw/*' | while read -r f; do
  size=$(magick identify -format '%w %h %Q' "$f")
  set -- $size
  if [ "$1" -gt 750 ] || [ "$2" -gt 750 ]; then
    q=$3; [ "$q" -gt 80 ] && q=80
    magick "$f" -resize '750x750>' -quality "$q" -sampling-factor 4:2:0 -interlace JPEG "$f"
    echo "shrunk $f"
  fi
done
