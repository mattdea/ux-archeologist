# trace2.py grid.txt out.png r0 r1 c0 c1 — like trace.py, for windows that are
# a rectangle with rounded/shaped corners: the side frames are the outermost
# columns that are black on every middle row; corner rows (solid black at the
# top and bottom) are shaped by their first/last doubled pixel.
import sys, zlib, struct
g = [l for l in open(sys.argv[1]).read().split('\n') if l]
r0, r1, c0, c1 = map(int, sys.argv[3:7])
rows = [g[r][c0:c1] for r in range(r0, r1)]
n = len(rows); w = len(rows[0])
def dbl(line):
    lo = next((i for i in range(len(line)-1) if line[i] == line[i+1]), None)
    if lo is None: return None
    hi = next(i for i in range(len(line)-1, 0, -1) if line[i] == line[i-1])
    return lo, hi
D = [dbl(l) for l in rows]
filled = [i for i, d in enumerate(D) if d and d[1] - d[0] > w // 2]
top, bot = filled[0], filled[-1]
mid = range(top + (bot - top) // 4, bot - (bot - top) // 4)
frameL = min(c for c in range(w) if all(rows[i][c] == '#' for i in mid))
frameR = max(c for c in range(w) if all(rows[i][c] == '#' for i in mid))
B = [None] * n
for order in (range(top, bot + 1), range(bot, top - 1, -1)):
    for i in order:
        lo, hi = D[i]
        if lo <= frameL and hi >= frameR: break
        # a desktop pixel can pair with the frame: never go past the sides
        B[i] = (max(lo, frameL), min(hi, frameR))
for i in range(top, bot + 1):
    if B[i] is None: B[i] = (frameL, frameR)
W, H = frameR - frameL + 1, bot - top + 1
raw = b''; txt = []
for i in range(top, bot + 1):
    lo, hi = B[i]; raw += b'\x00'; t = ''
    for c in range(frameL, frameR + 1):
        inside = lo <= c <= hi
        raw += (b'\x00\x00\x00\xff' if rows[i][c] == '#' else b'\xff\xff\xff\xff') if inside else b'\x00\x00\x00\x00'
        t += rows[i][c] if inside else ' '
    txt.append(t)
def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
open(sys.argv[2], 'wb').write(png)
open(sys.argv[2] + '.txt', 'w').write('\n'.join(txt) + '\n')
print('box rows', r0 + top, r0 + bot, 'cols', c0 + frameL, c0 + frameR, 'size', W, 'x', H)
