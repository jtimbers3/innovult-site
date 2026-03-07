# Google Photos Best-Of Montage Builder

This pipeline pulls media from a Google Photos album (optionally filtered by date range), ranks "best" items, and renders a single polished MP4.

## What this does

1. Connects to your Google Photos account (OAuth, read-only)
2. Pulls photos/videos from a selected album
3. Filters by time window (optional)
4. Scores + keeps best items (quality/clarity/resolution + basic variety)
5. Renders a final 1080p video montage with smooth fades

## One-time setup

1. Install FFmpeg and confirm `ffmpeg` + `ffprobe` work in terminal
2. Create Google OAuth Desktop credentials JSON and save as:
   - `secrets/client_secret.json`
3. Create virtualenv and install deps:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run

### Option A: Single-click Windows launcher

Double-click:

- `run_montage.bat`

It will prompt you for album/date/output and then run everything.

### Option B: Command line

```bash
python make_video.py \
  --album "Video - Mom" \
  --start "2023-01-01" \
  --end "2025-12-31" \
  --max-items 90 \
  --out output/mom-highlight.mp4
```

Optional music overlay:

```bash
python make_video.py --album "Video - Mom" --out output/mom-highlight.mp4 --music "assets/song.mp3"
```

## Output folders

- `downloads/<album_slug>/` raw media + metadata
- `work/<album_slug>/` curated list + temp clips
- `output/*.mp4` final video

## Notes

- Person detection is best done in Google Photos UI. Put that person into a dedicated album first.
- The API cannot reliably do face-person queries directly like the app UI.
- "Best" selection is heuristic; you can review and tweak `work/<album>/selected_manifest.json` before rendering.
