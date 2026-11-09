# regions.py crop.txt minw minh — white (.) connected regions with their boxes
import sys
g = open(sys.argv[1]).read().split('\n')[:-1]
minw, minh = int(sys.argv[2]), int(sys.argv[3])
H = len(g); W = max(len(l) for l in g); g = [l.ljust(W) for l in g]
seen = [[False]*W for _ in range(H)]
out = []
for y in range(H):
    for x in range(W):
        if g[y][x] != '.' or seen[y][x]: continue
        st = [(y, x)]; seen[y][x] = True; pts = []
        while st:
            cy, cx = st.pop(); pts.append((cy, cx))
            for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
                ny, nx = cy+dy, cx+dx
                if 0 <= ny < H and 0 <= nx < W and not seen[ny][nx] and g[ny][nx] == '.':
                    seen[ny][nx] = True; st.append((ny, nx))
        ys = [p[0] for p in pts]; xs = [p[1] for p in pts]
        bw, bh = max(xs)-min(xs)+1, max(ys)-min(ys)+1
        if bw >= minw and bh >= minh: out.append((min(ys), min(xs), bw, bh, len(pts)))
for o in sorted(out): print('y %3d x %3d  w %3d h %3d  px %d' % o)
