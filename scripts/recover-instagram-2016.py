#!/usr/bin/env python3
"""
Recover real spring-2016 Instagram profiles and photos from the Wayback Machine.

For each handle, every archived capture of instagram.com/<handle>/ in the date
range is fetched. In 2016 a profile page embedded `window._sharedData` with the
account's bio, counts and its 24 most recent posts (caption, likes, comments,
date, photo URL). Posts are unioned across captures, then each photo is pulled
from the archive at full size.

Output (under --out, default assets/feed/archive/, which is gitignored):
  <handle>/profile.json   account + posts (see MANIFEST below)
  <handle>/avatar.jpg     profile picture
  <handle>/<code>.jpg     one photo per post
  index.json              list of handles with counts

Re-running is safe: existing files are kept, missing ones are fetched.

Speed: the Wayback Machine serves about one request per second and stalls
parallel connections, so downloads run one at a time. Budget roughly two
minutes per account (6 captures, ~40 photos).

Usage:
  scripts/recover-instagram-2016.py natgeo humansofny
  scripts/recover-instagram-2016.py --list handles.txt --from 20160301 --to 20160510
"""

import argparse
import json
import re
import subprocess
import sys
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

WAYBACK = 'https://web.archive.org'
SHARED = re.compile(r'window\._sharedData\s*=\s*(\{.*?\});\s*</script>', re.S)


def get(url, binary=False, tries=3, timeout=45):
    """GET via curl with retries and backoff (Wayback rate-limits and stalls).
    curl rather than urllib: Python's HTTP client can hang on macOS proxy
    lookups and inside sandboxes, while curl gets through."""
    last = None
    for attempt in range(tries):
        r = subprocess.run(
            # curl's default User-Agent: the Wayback Machine stalls custom ones on image URLs
            ['curl', '-sL', '--max-time', str(timeout), '-w', '\n%{http_code} %{content_type}', url],
            capture_output=True)
        body, _, trailer = r.stdout.rpartition(b'\n')
        parts = trailer.decode('ascii', 'ignore').split(' ', 1)
        code, ctype = (parts + [''])[:2]
        if r.returncode == 0 and code.startswith('2') and body:
            return (body if binary else body.decode('utf-8', 'ignore')), ctype
        last = f'curl exit {r.returncode}, HTTP {code or "?"}'
        time.sleep(2 * (attempt + 1))
    raise RuntimeError(f'{url}: {last}')


def captures(handle, start, end, max_captures):
    q = urllib.parse.urlencode({
        'url': f'instagram.com/{handle}/', 'from': start, 'to': end,
        'filter': 'statuscode:200', 'fl': 'timestamp,length', 'collapse': 'timestamp:8',
    })
    body, _ = get(f'{WAYBACK}/cdx/search/cdx?{q}')
    rows = [l.split() for l in body.strip().splitlines() if l.strip()]
    # Only full pages (small ones are redirects or login walls)
    ts = [r[0] for r in rows if len(r) == 2 and r[1].isdigit() and int(r[1]) > 20000]
    if len(ts) > max_captures:  # spread evenly across the range
        step = len(ts) / max_captures
        ts = [ts[int(i * step)] for i in range(max_captures)]
    return ts


def parse_profile(html):
    m = SHARED.search(html)
    if not m:
        return None
    try:
        data = json.loads(m.group(1))
        return data['entry_data']['ProfilePage'][0]['user']
    except (KeyError, IndexError, ValueError):
        return None


def fetch_capture(handle, ts):
    html, _ = get(f'{WAYBACK}/web/{ts}id_/https://www.instagram.com/{handle}/')
    return parse_profile(html)


def download_image(url, ts, dest):
    """Save an archived image; tries the capture's own time, then any 2016 copy."""
    if dest.exists() and dest.stat().st_size > 5000:
        return 'kept'
    # One try per stamp with a short timeout: a photo that never archived
    # otherwise costs minutes of retries.
    for stamp in (ts, '2016'):
        try:
            data, ctype = get(f'{WAYBACK}/web/{stamp}id_/{url}', binary=True, tries=1, timeout=25)
        except RuntimeError:
            continue
        if 'image' in ctype and len(data) > 5000:
            dest.write_bytes(data)
            return 'ok'
    return 'missing'


def recover(handle, out, start, end, max_captures, workers):
    d = out / handle
    d.mkdir(parents=True, exist_ok=True)
    print(f'{handle}: looking up captures...', flush=True)
    ts_list = captures(handle, start, end, max_captures)
    print(f'{handle}: {len(ts_list)} captures', flush=True)
    if not ts_list:
        print(f'{handle}: no captures in range', flush=True)
        return None

    user, posts = None, {}
    for ts in ts_list:
        print(f'  {handle} page {ts}', flush=True)
        try:
            u = fetch_capture(handle, ts)
        except RuntimeError as e:
            print(f'  {handle} {ts}: {e}', flush=True)
            continue
        if not u:
            continue
        user = u  # keep the latest capture's bio and counts (list is chronological)
        for n in u.get('media', {}).get('nodes', []):
            code = n.get('code')
            if not code:
                continue
            posts.setdefault(code, {
                'code': code,
                'date': int(n.get('date') or 0),
                'caption': n.get('caption') or '',
                'likes': (n.get('likes') or {}).get('count', 0),
                'comments': (n.get('comments') or {}).get('count', 0),
                'is_video': bool(n.get('is_video')),
                'display_src': n.get('display_src'),
                'thumbnail_src': n.get('thumbnail_src'),
                'captured_at': ts,
            })
    if not user:
        print(f'{handle}: captures had no profile data', flush=True)
        return None

    # Photos, newest first
    ordered = sorted(posts.values(), key=lambda p: -p['date'])
    jobs = [(p, d / f"{p['code']}.jpg") for p in ordered]
    print(f'  {handle}: {len(jobs)} photos to fetch', flush=True)

    def fetch_job(j):
        p, path = j
        res = download_image(p['display_src'], p['captured_at'], path) if p['display_src'] else 'missing'
        if res == 'missing' and p.get('thumbnail_src'):
            res = download_image(p['thumbnail_src'], p['captured_at'], path)
        return res

    # Sequential by default (the archive stalls parallel connections). If the
    # first several photos are all missing, the account's images were never
    # archived: stop early instead of spending a minute per photo on 404s.
    GIVE_UP_AFTER = 6
    results = []
    if workers <= 1:
        for i, j in enumerate(jobs, 1):
            if i > GIVE_UP_AFTER and not any(r != 'missing' for r in results):
                print(f'  {handle}: photos not archived, skipping the rest', flush=True)
                results += ['missing'] * (len(jobs) - len(results))
                break
            results.append(fetch_job(j))
            if i % 10 == 0 or i == len(jobs):
                print(f'  {handle}: {i}/{len(jobs)} photos', flush=True)
    else:
        with ThreadPoolExecutor(max_workers=workers) as ex:
            results = list(ex.map(fetch_job, jobs))
    for (p, path), res in zip(jobs, results):
        p['file'] = path.name if res != 'missing' else None
    avatar = 'missing'
    if user.get('profile_pic_url'):
        avatar = download_image(user['profile_pic_url'], ts_list[-1], d / 'avatar.jpg')

    manifest = {
        # MANIFEST
        'handle': user['username'],
        'full_name': user.get('full_name') or '',
        'biography': user.get('biography') or '',
        'external_url': user.get('external_url'),
        'is_verified': bool(user.get('is_verified')),
        'followers': (user.get('followed_by') or {}).get('count', 0),
        'following': (user.get('follows') or {}).get('count', 0),
        'posts_count': (user.get('media') or {}).get('count', 0),
        'profile_pic': 'avatar.jpg' if avatar != 'missing' else None,
        'captured_at': ts_list[-1],
        'captures_used': ts_list,
        'source': f'{WAYBACK}/web/{ts_list[-1]}/https://www.instagram.com/{handle}/',
        'posts': [{k: v for k, v in p.items() if k not in ('display_src', 'thumbnail_src')} for p in ordered],
    }
    (d / 'profile.json').write_text(json.dumps(manifest, indent=1, ensure_ascii=False))
    have = sum(1 for p in ordered if p['file'])
    print(f'{handle}: {len(ts_list)} captures, {len(ordered)} posts, {have} photos, avatar {avatar}', flush=True)
    return {'handle': handle, 'posts': len(ordered), 'photos': have}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('handles', nargs='*')
    ap.add_argument('--list', help='file with one handle per line')
    ap.add_argument('--from', dest='start', default='20160301')
    ap.add_argument('--to', dest='end', default='20160510')
    ap.add_argument('--out', default='assets/feed/archive')
    ap.add_argument('--max-captures', type=int, default=6, help='captures per handle (spread over the range)')
    ap.add_argument('--workers', type=int, default=1,
                    help='parallel image downloads. Keep at 1: the Wayback Machine stalls parallel '
                         'connections from one address instead of refusing them')
    a = ap.parse_args()

    handles = [h.strip().lstrip('@') for h in a.handles]
    if a.list:
        handles += [l.strip().lstrip('@') for l in Path(a.list).read_text().splitlines() if l.strip() and not l.startswith('#')]
    if not handles:
        ap.error('give handles or --list')

    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    index_path = out / 'index.json'
    index = {e['handle']: e for e in json.loads(index_path.read_text())} if index_path.exists() else {}
    for h in handles:
        try:
            r = recover(h, out, a.start, a.end, a.max_captures, a.workers)
        except Exception as e:  # noqa: BLE001
            print(f'{h}: failed: {e}', flush=True)
            r = None
        if r:
            index[h] = r
            index_path.write_text(json.dumps(sorted(index.values(), key=lambda e: e['handle']), indent=1))
    print(f'done: {len(index)} accounts, {sum(e["photos"] for e in index.values())} photos', flush=True)


if __name__ == '__main__':
    sys.exit(main())
