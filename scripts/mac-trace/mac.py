import sys
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from dumplib import load
f, out = sys.argv[1], sys.argv[2]
w,h,bpp,rows = load(f)
def first_run(seq):
    n=0
    for v in seq:
        if v==seq[0]: n+=1
        else: break
    return n
px = int(sys.argv[3]) if len(sys.argv) > 3 else 2
py = int(sys.argv[4]) if len(sys.argv) > 4 else 2
sx = (px + first_run([rows[py][x*bpp] < 128 for x in range(px, w)])) % 3
sy = (py + first_run([rows[y][px*bpp] < 128 for y in range(py, h)])) % 3
lines=[]
y = sy + 1
while y < h:
    x = sx + 1; line=''
    while x < w:
        line += '#' if rows[y][x*bpp] < 128 else '.'
        x += 3
    lines.append(line); y += 3
open(out,'w').write('\n'.join(lines)+'\n')
print(out, len(lines[0]), 'x', len(lines))
