#!/usr/bin/env python3
"""sfd2ttf.py font.sfd pixel-size family out.ttf

Turns one bitmap strike of a FontForge .sfd (as in github.com/JohnDDuncanIII/
macfonts, Apple's classic Mac fonts) into a TrueType font whose glyphs are
the bitmap's pixels as squares, like jcs's Geneva-9.ttf: one font pixel is
1/size em, so at font-size = size × (CSS px per Mac pixel) every pixel lands
on one Mac pixel. Standard library only. Characters are mapped from Mac OS
Roman to Unicode.
"""
import base64, struct, sys, time

UNIT = 100          # font units per pixel


def read_strike(path, size):
    lines = open(path, encoding='latin-1').read().split('\n')
    start = next(i for i, l in enumerate(lines) if l.startswith(f'BitmapFont: {size} '))
    _, _, nglyphs, ascent, descent, _depth = lines[start].split()[:6]
    glyphs = {}
    i = start + 1
    while not lines[i].startswith('EndBitmapFont'):
        if lines[i].startswith('BDFChar:'):
            _, gid, enc, adv, xmin, xmax, ymin, ymax = lines[i].split()[:8]
            data, i = '', i + 1
            while i < len(lines) and not lines[i].startswith(('BDFChar:', 'EndBitmapFont')):
                data += lines[i].strip(); i += 1
            enc, adv, xmin, xmax, ymin, ymax = map(int, (enc, adv, xmin, xmax, ymin, ymax))
            w, h = xmax - xmin + 1, ymax - ymin + 1
            raw = base64.a85decode(data) if data else b''
            stride = (w + 7) // 8
            rows = []
            for r in range(h):
                bits = raw[r * stride:(r + 1) * stride].ljust(stride, b'\0')
                rows.append([(bits[c // 8] >> (7 - c % 8)) & 1 for c in range(w)])
            glyphs[enc] = dict(adv=adv, xmin=xmin, ymax=ymax, rows=rows)
            continue
        i += 1
    return int(ascent), int(descent), glyphs


def glyph_data(g):
    """One rectangle contour per run of black pixels; clockwise (y up)."""
    contours = []
    for r, row in enumerate(g['rows']):
        y1 = (g['ymax'] - r + 1) * UNIT; y0 = y1 - UNIT
        c = 0
        while c < len(row):
            if not row[c]: c += 1; continue
            s = c
            while c < len(row) and row[c]: c += 1
            x0, x1 = (g['xmin'] + s) * UNIT, (g['xmin'] + c) * UNIT
            contours.append([(x0, y0), (x0, y1), (x1, y1), (x1, y0)])
    if not contours:
        return b'', (0, 0, 0, 0), 0, 0
    pts = [p for ct in contours for p in ct]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    bbox = (min(xs), min(ys), max(xs), max(ys))
    out = struct.pack('>hhhhh', len(contours), *bbox)
    end = -1
    for ct in contours:
        end += len(ct); out += struct.pack('>H', end)
    out += struct.pack('>H', 0)                      # no instructions
    out += bytes([1]) * len(pts)                     # all on-curve, 16-bit deltas
    px = py = 0
    xd, yd = b'', b''
    for x, y in pts:
        xd += struct.pack('>h', x - px); yd += struct.pack('>h', y - py); px, py = x, y
    out += xd + yd
    if len(out) % 2: out += b'\0'
    return out, bbox, len(pts), len(contours)


def checksum(data):
    data += b'\0' * (-len(data) % 4)
    return sum(struct.unpack(f'>{len(data) // 4}I', data)) & 0xffffffff


def build(sfd, size, family, out):
    ascent, descent, glyphs = read_strike(sfd, size)
    # glyph 0 .notdef, then characters in Mac Roman order that map to Unicode
    chars = []
    for enc in sorted(glyphs):
        if enc < 32: continue
        try: u = ord(bytes([enc]).decode('mac_roman'))
        except Exception: continue
        chars.append((u, glyphs[enc]))
    if not any(u == 32 for u, _ in chars):
        chars.append((32, dict(adv=4, xmin=0, ymax=0, rows=[])))
    chars.sort()
    order = [dict(adv=0, xmin=0, ymax=0, rows=[])] + [g for _, g in chars]
    cmap_pairs = [(u, i + 1) for i, (u, _) in enumerate(chars)]

    glyf, loca, hmtx = b'', [0], b''
    gb = [0, 0, 0, 0]; maxp_pts = maxp_ct = 0; adv_max = 0; min_lsb = 0; min_rsb = 0; max_ext = 0
    for g in order:
        data, bbox, npts, nct = glyph_data(g)
        glyf += data; loca.append(len(glyf))
        adv = g['adv'] * UNIT; adv_max = max(adv_max, adv)
        lsb = bbox[0] if data else 0
        hmtx += struct.pack('>Hh', adv, lsb)
        if data:
            gb = [min(gb[0], bbox[0]), min(gb[1], bbox[1]), max(gb[2], bbox[2]), max(gb[3], bbox[3])]
            min_lsb = min(min_lsb, bbox[0]); min_rsb = min(min_rsb, adv - bbox[2]); max_ext = max(max_ext, bbox[2])
        maxp_pts = max(maxp_pts, npts); maxp_ct = max(maxp_ct, nct)
    n = len(order)
    upm = size * UNIT
    asc, dsc = ascent * UNIT, descent * UNIT

    head = struct.pack('>IIIIHHqqhhhhHHhhh', 0x00010000, 0x00010000, 0, 0x5F0F3CF5, 0b1011, upm,
                       0, 0, *gb, 0, 8, 2, 1, 0)
    hhea = struct.pack('>Ihhh H hhh hhh hhhh hH', 0x00010000, asc, -dsc, 0, adv_max, min_lsb, min_rsb, max_ext,
                       1, 0, 0, 0, 0, 0, 0, 0, n)
    maxp = struct.pack('>IHHHHHHHHHHHHHH', 0x00010000, n, maxp_pts, maxp_ct, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0)
    loca_t = b''.join(struct.pack('>I', o) for o in loca)
    first, last = cmap_pairs[0][0], cmap_pairs[-1][0]
    os2 = struct.pack('>HhHHHhhhhhhhhhhh10s4I4sHHHhhhHHII',
                      1, adv_max // 2, 400, 5, 0, upm // 2, upm // 2, 0, 0, upm // 2, upm // 2, 0, 0,
                      UNIT, asc // 2, 0, b'\0' * 10, 1, 0, 0, 0, b'none', 0x40, first, min(last, 0xFFFF),
                      asc, -dsc, 0, asc, dsc, 1, 0)
    # cmap format 4, one segment per character plus the 0xFFFF terminator
    segs = [(u, u, g) for u, g in cmap_pairs] + [(0xFFFF, 0xFFFF, 0)]
    sc = len(segs)
    sr = 2 * (2 ** (sc.bit_length() - 1)); es = sr.bit_length() - 2; rs = 2 * sc - sr
    ends = b''.join(struct.pack('>H', e) for _, e, _ in segs)
    starts = b''.join(struct.pack('>H', s) for s, _, _ in segs)
    deltas = b''.join(struct.pack('>h', ((g - s) + 0x8000) % 0x10000 - 0x8000) if g else struct.pack('>h', 1) for s, _, g in segs)
    ranges = b'\0\0' * sc
    sub = struct.pack('>HHHHHHH', 4, 16 + 8 * sc, 0, 2 * sc, sr, es, rs) + ends + b'\0\0' + starts + deltas + ranges
    cmap = struct.pack('>HHHHI', 0, 1, 3, 1, 12) + sub
    names = {1: family, 2: 'Regular', 3: family, 4: family, 5: 'Version 1.0', 6: family.replace(' ', '')}
    recs, strs = b'', b''
    for nid, s in names.items():
        b = s.encode('utf-16-be'); recs += struct.pack('>HHHHHH', 3, 1, 0x409, nid, len(b), len(strs)); strs += b
    name = struct.pack('>HHH', 0, len(names), 6 + 12 * len(names)) + recs + strs
    post = struct.pack('>IIhhIIIII', 0x00030000, 0, -UNIT, UNIT, 0, 0, 0, 0, 0)

    tables = {'OS/2': os2, 'cmap': cmap, 'glyf': glyf, 'head': head, 'hhea': hhea, 'hmtx': hmtx,
              'loca': loca_t, 'maxp': maxp, 'name': name, 'post': post}
    tags = sorted(tables)
    nt = len(tags); sr = 16 * (2 ** (nt.bit_length() - 1)); es = (nt.bit_length() - 1); rs = 16 * nt - sr
    offset = 12 + 16 * nt
    dir_, body = b'', b''
    for t in tags:
        d = tables[t]
        dir_ += struct.pack('>4sIII', t.encode(), checksum(d), offset + len(body), len(d))
        body += d + b'\0' * (-len(d) % 4)
    font = struct.pack('>IHHHH', 0x00010000, nt, sr, es, rs) + dir_ + body
    # head.checkSumAdjustment
    hoff = offset + sum(len(tables[t]) + (-len(tables[t]) % 4) for t in tags[:tags.index('head')])
    adj = (0xB1B0AFBA - checksum(font)) & 0xffffffff
    font = font[:hoff + 8] + struct.pack('>I', adj) + font[hoff + 12:]
    open(out, 'wb').write(font)
    print(f'{out}: {n} glyphs, em {size} px, ascent {ascent}, descent {descent}')


if __name__ == '__main__':
    build(sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4])
