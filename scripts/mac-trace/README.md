# mac-trace

Turns the System 1 screenshots in `docs/reference/mac system 1/` (3 screen
pixels per Mac pixel) into Mac-pixel art for Level 1. Standard library only.

```bash
# 1. screenshot -> grid of Mac pixels ('#' black, '.' white); the last two
#    arguments are a point on the desktop pattern, to find the pixel grid
python3 mac.py macsystem100012.png /tmp/m12.txt 400 400
# 2. crop a window out of the grid -> 1-bit PNG, transparent outside the
#    frame, plus a .txt copy; prints the box it found
python3 trace2.py /tmp/m12.txt ../../assets/mac/da/calculator.png 80 290 195 335
# 3. white areas (keys, displays) and their boxes, for laying controls over the art
python3 regions.py ../../assets/mac/da/calculator.png.txt 8 8
```

`dumplib.py` is a minimal PNG decoder (8-bit, non-interlaced) shared by the others.
