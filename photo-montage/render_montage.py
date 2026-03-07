import argparse
import json
import shlex
import subprocess
from pathlib import Path


def run(cmd):
    print(" ".join(shlex.quote(c) for c in cmd))
    subprocess.run(cmd, check=True)


def ffmpeg_image_clip(src, out, seconds=3.2, fps=30, w=1920, h=1080):
    total_frames = int(seconds * fps)
    vf = (
        f"scale={w}:{h}:force_original_aspect_ratio=decrease,"
        f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,"
        f"zoompan=z='min(zoom+0.0009,1.08)':d={total_frames}:s={w}x{h},"
        f"fps={fps},format=yuv420p"
    )
    cmd = [
        "ffmpeg", "-y", "-loop", "1", "-t", str(seconds), "-i", str(src),
        "-vf", vf,
        "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", str(out)
    ]
    run(cmd)


def ffmpeg_video_clip(src, out, seconds=6.0, fps=30, w=1920, h=1080):
    vf = f"scale={w}:{h}:force_original_aspect_ratio=decrease,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,fps={fps},format=yuv420p"
    cmd = [
        "ffmpeg", "-y", "-i", str(src), "-t", str(seconds),
        "-vf", vf,
        "-c:v", "libx264", "-c:a", "aac", "-ar", "48000", "-b:a", "128k", str(out)
    ]
    run(cmd)


def apply_fades(src, out, duration, fade=0.35):
    st = max(0.0, duration - fade)
    vf = f"fade=t=in:st=0:d={fade},fade=t=out:st={st}:d={fade}"
    af = f"afade=t=in:st=0:d={fade},afade=t=out:st={st}:d={fade}"
    cmd = [
        "ffmpeg", "-y", "-i", str(src),
        "-vf", vf, "-af", af,
        "-c:v", "libx264", "-c:a", "aac", "-ar", "48000", "-b:a", "128k", str(out)
    ]
    run(cmd)


def concat_clips(clips, out_path):
    list_path = out_path.parent / "concat_list.txt"
    list_path.write_text("\n".join("file '{}'".format(str(c).replace("'", "''")) for c in clips), encoding="utf-8")
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_path),
        "-c", "copy", str(out_path)
    ]
    run(cmd)


def overlay_music(video_in, music_in, out):
    cmd = [
        "ffmpeg", "-y", "-stream_loop", "-1", "-i", str(music_in), "-i", str(video_in),
        "-filter_complex", "[0:a]volume=0.24[a0];[1:a]volume=1.0[a1];[a1][a0]amix=inputs=2:duration=first:dropout_transition=2[aout]",
        "-map", "1:v", "-map", "[aout]", "-c:v", "copy", "-c:a", "aac", "-shortest", str(out)
    ]
    run(cmd)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--music", default=None)
    ap.add_argument("--img-seconds", type=float, default=3.2)
    ap.add_argument("--video-seconds", type=float, default=6.0)
    args = ap.parse_args()

    manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    temp_dir = out_path.parent / (out_path.stem + "_temp")
    temp_dir.mkdir(parents=True, exist_ok=True)

    clips = []
    for i, item in enumerate(manifest, start=1):
        src = Path(item["localPath"])
        mime = (item.get("mimeType") or "").lower()
        raw_clip = temp_dir / f"clip_{i:04d}_raw.mp4"
        faded_clip = temp_dir / f"clip_{i:04d}.mp4"

        if mime.startswith("image/"):
            ffmpeg_image_clip(src, raw_clip, seconds=args.img_seconds)
            apply_fades(raw_clip, faded_clip, duration=args.img_seconds)
        elif mime.startswith("video/"):
            ffmpeg_video_clip(src, raw_clip, seconds=args.video_seconds)
            apply_fades(raw_clip, faded_clip, duration=args.video_seconds)
        else:
            continue
        clips.append(faded_clip)

    base_out = out_path.parent / f"{out_path.stem}.base.mp4"
    concat_clips(clips, base_out)

    if args.music:
        overlay_music(base_out, Path(args.music), out_path)
    else:
        base_out.replace(out_path)

    print(f"Done: {out_path}")


if __name__ == "__main__":
    main()
