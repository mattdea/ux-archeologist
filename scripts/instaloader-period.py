#!/opt/homebrew/opt/instaloader/libexec/bin/python
"""Download one Instagram account's posts from a date window with Instaloader.

    scripts/instaloader-period.py thejoshuatreehouse
    scripts/instaloader-period.py thejoshuatreehouse --since 2016-01-01 --until 2016-05-10

Needs a saved Instaloader session. Log in once, in your own terminal:

    instaloader --login YOUR_USERNAME

Files land in assets/feed/instaloader/<handle>/ (gitignored), one
<shortcode>.jpg per photo (carousels get _1, _2 ...) plus <shortcode>.json
with the caption, like count and date. Re-running skips files already there.

Instagram lists posts newest first, so the script has to page past every
post newer than --until before it reaches the window. It downloads nothing
until then and stops at the first post older than --since.
"""

import argparse
from datetime import datetime, timezone
from pathlib import Path

import instaloader

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "feed" / "instaloader"


def day(s):
    return datetime.strptime(s, "%Y-%m-%d").replace(tzinfo=timezone.utc)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("handle")
    ap.add_argument("--since", type=day, default=day("2016-03-10"))
    ap.add_argument("--until", type=day, default=day("2016-05-11"),
                    help="exclusive; default 2016-05-11 keeps all of 10 May")
    ap.add_argument("--login", default="undiesbro")
    args = ap.parse_args()

    L = instaloader.Instaloader(
        dirname_pattern=str(OUT / "{target}"),
        filename_pattern="{shortcode}",
        download_videos=False,
        download_video_thumbnails=True,
        download_comments=False,
        save_metadata=True,
        compress_json=False,
        post_metadata_txt_pattern="",
    )
    L.load_session_from_file(args.login)

    profile = instaloader.Profile.from_username(L.context, args.handle)
    print(f"{profile.username}: {profile.mediacount} posts total; "
          f"window {args.since:%Y-%m-%d} to {args.until:%Y-%m-%d} (exclusive)")

    got = 0
    for post in profile.get_posts():
        when = post.date_utc.replace(tzinfo=timezone.utc)
        if when >= args.until:
            continue
        if when < args.since:
            if post.is_pinned:  # pinned posts sit out of order at the top
                continue
            break
        L.download_post(post, target=profile.username)
        got += 1
    print(f"done: {got} posts in {OUT / profile.username}")


if __name__ == "__main__":
    main()
