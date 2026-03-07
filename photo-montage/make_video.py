import argparse
import re
import subprocess
from pathlib import Path


def slugify(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "album"


def run(cmd):
    print("\n>>", " ".join(cmd))
    subprocess.run(cmd, check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--album", required=True)
    ap.add_argument("--start", default=None)
    ap.add_argument("--end", default=None)
    ap.add_argument("--max-items", type=int, default=90)
    ap.add_argument("--keep-percent", type=float, default=0.35)
    ap.add_argument("--out", required=True)
    ap.add_argument("--music", default=None)
    ap.add_argument("--client-secret", default="secrets/client_secret.json")
    ap.add_argument("--token", default="secrets/token.json")
    args = ap.parse_args()

    album_slug = slugify(args.album)
    metadata_path = Path("downloads") / album_slug / "metadata.json"
    selected_manifest = Path("work") / album_slug / "selected_manifest.json"

    pull_cmd = [
        "python", "google_photos_pull.py",
        "--album", args.album,
        "--client-secret", args.client_secret,
        "--token", args.token,
    ]
    if args.start:
        pull_cmd += ["--start", args.start]
    if args.end:
        pull_cmd += ["--end", args.end]

    run(pull_cmd)

    select_cmd = [
        "python", "select_best.py",
        "--metadata", str(metadata_path),
        "--max-items", str(args.max_items),
        "--keep-percent", str(args.keep_percent),
    ]
    if args.start:
        select_cmd += ["--start", args.start]
    if args.end:
        select_cmd += ["--end", args.end]

    run(select_cmd)

    render_cmd = [
        "python", "render_montage.py",
        "--manifest", str(selected_manifest),
        "--out", args.out,
    ]
    if args.music:
        render_cmd += ["--music", args.music]

    run(render_cmd)
    print("\nAll done.")


if __name__ == "__main__":
    main()
