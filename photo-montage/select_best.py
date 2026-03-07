import argparse
import json
import math
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image
from dateutil import parser as dtparser


def parse_date(d):
    if not d:
        return None
    return dtparser.parse(d)


def in_window(creation_time, start, end):
    if not creation_time:
        return True
    dt = dtparser.parse(creation_time)
    if start and dt < start:
        return False
    if end and dt > end:
        return False
    return True


def image_score(path: Path):
    try:
        with Image.open(path) as img:
            arr = np.asarray(img.convert("L"), dtype=np.float32)
            h, w = arr.shape[:2]
            resolution = (w * h) / 1_000_000.0
            gx = np.diff(arr, axis=1)
            gy = np.diff(arr, axis=0)
            sharpness = float(np.var(gx) + np.var(gy))
            brightness = float(np.mean(arr))

            brightness_penalty = abs(brightness - 145.0) / 145.0
            score = (resolution * 2.2) + (math.log1p(sharpness) * 2.0) - (brightness_penalty * 1.5)
            return score
    except Exception:
        return -1e9


def video_score(meta):
    w = float(meta.get("width") or 0)
    h = float(meta.get("height") or 0)
    resolution = (w * h) / 1_000_000.0
    # Favor higher-res clips; duration trimming is handled in render stage.
    return resolution * 3.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--metadata", required=True)
    ap.add_argument("--start", default=None)
    ap.add_argument("--end", default=None)
    ap.add_argument("--max-items", type=int, default=80)
    ap.add_argument("--keep-percent", type=float, default=0.35)
    ap.add_argument("--work-dir", default="work")
    args = ap.parse_args()

    metadata_path = Path(args.metadata)
    items = json.loads(metadata_path.read_text(encoding="utf-8"))

    start = parse_date(args.start)
    end = parse_date(args.end)

    scored = []
    for item in items:
        if not in_window(item.get("creationTime"), start, end):
            continue

        p = Path(item["localPath"])
        mime = (item.get("mimeType") or "").lower()
        if mime.startswith("image/"):
            score = image_score(p)
        elif mime.startswith("video/"):
            score = video_score(item)
        else:
            continue

        if score < -1e8:
            continue

        item_copy = dict(item)
        item_copy["score"] = score
        scored.append(item_copy)

    scored.sort(key=lambda x: x["score"], reverse=True)

    target = min(args.max_items, max(1, int(len(scored) * args.keep_percent)))
    selected = scored[:target]

    # Simple variety: sort selected chronologically for nicer storytelling.
    def dt_key(x):
        c = x.get("creationTime")
        return dtparser.parse(c) if c else datetime.max

    selected.sort(key=dt_key)

    album_slug = metadata_path.parent.name
    out_dir = Path(args.work_dir) / album_slug
    out_dir.mkdir(parents=True, exist_ok=True)

    manifest_path = out_dir / "selected_manifest.json"
    manifest_path.write_text(json.dumps(selected, indent=2), encoding="utf-8")

    txt_path = out_dir / "selected_paths.txt"
    txt_path.write_text("\n".join(x["localPath"] for x in selected), encoding="utf-8")

    print(f"Selected {len(selected)} / {len(scored)} scored items")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
