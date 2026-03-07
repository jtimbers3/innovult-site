import argparse
import json
import mimetypes
import re
from datetime import datetime
from pathlib import Path

import requests
from dateutil import parser as dtparser
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/photoslibrary.readonly"]


def slugify(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "album"


def get_service(client_secret: Path, token_path: Path):
    creds = None
    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(client_secret), SCOPES)
            creds = flow.run_local_server(port=0)
        token_path.parent.mkdir(parents=True, exist_ok=True)
        token_path.write_text(creds.to_json(), encoding="utf-8")
    return build("photoslibrary", "v1", credentials=creds, static_discovery=False)


def find_album_id(service, album_title: str) -> str:
    page_token = None
    while True:
        resp = service.albums().list(pageSize=50, pageToken=page_token).execute()
        for a in resp.get("albums", []):
            if a.get("title", "").strip().lower() == album_title.strip().lower():
                return a["id"]
        page_token = resp.get("nextPageToken")
        if not page_token:
            break
    raise ValueError(f"Album not found: {album_title}")


def parse_date(d: str):
    if not d:
        return None
    dt = dtparser.parse(d)
    return dt


def date_range_filter(start_dt, end_dt):
    if not start_dt and not end_dt:
        return None
    start = start_dt or datetime(1970, 1, 1)
    end = end_dt or datetime.utcnow()
    return {
        "ranges": [
            {
                "startDate": {"year": start.year, "month": start.month, "day": start.day},
                "endDate": {"year": end.year, "month": end.month, "day": end.day},
            }
        ]
    }


def file_ext_for_item(item):
    mime = item.get("mimeType", "")
    ext = mimetypes.guess_extension(mime) or ""
    if ext == ".jpe":
        ext = ".jpg"
    return ext or ".bin"


def download_item(item, out_dir: Path):
    media_id = item["id"]
    base_url = item["baseUrl"]
    mime = item.get("mimeType", "")
    is_video = mime.startswith("video/")
    url = f"{base_url}=dv" if is_video else f"{base_url}=d"

    filename = item.get("filename")
    if not filename:
        filename = media_id + file_ext_for_item(item)

    safe_name = re.sub(r"[^A-Za-z0-9._-]+", "_", filename)
    out_path = out_dir / safe_name

    if out_path.exists() and out_path.stat().st_size > 0:
        return out_path

    with requests.get(url, stream=True, timeout=120) as r:
        r.raise_for_status()
        with out_path.open("wb") as f:
            for chunk in r.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    f.write(chunk)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--album", required=True)
    ap.add_argument("--start", default=None, help="e.g. 2024-01-01")
    ap.add_argument("--end", default=None, help="e.g. 2025-12-31")
    ap.add_argument("--client-secret", default="secrets/client_secret.json")
    ap.add_argument("--token", default="secrets/token.json")
    ap.add_argument("--downloads-root", default="downloads")
    args = ap.parse_args()

    album_slug = slugify(args.album)
    out_dir = Path(args.downloads_root) / album_slug
    out_dir.mkdir(parents=True, exist_ok=True)

    service = get_service(Path(args.client_secret), Path(args.token))
    album_id = find_album_id(service, args.album)

    start_dt = parse_date(args.start)
    end_dt = parse_date(args.end)

    page_token = None
    all_meta = []

    while True:
        body = {"albumId": album_id, "pageSize": 100}
        if page_token:
            body["pageToken"] = page_token
        dr = date_range_filter(start_dt, end_dt)
        if dr:
            body["filters"] = {"dateFilter": dr}

        resp = service.mediaItems().search(body=body).execute()
        items = resp.get("mediaItems", [])

        for item in items:
            try:
                local_path = download_item(item, out_dir)
                md = {
                    "id": item.get("id"),
                    "filename": item.get("filename"),
                    "mimeType": item.get("mimeType"),
                    "creationTime": item.get("mediaMetadata", {}).get("creationTime"),
                    "width": item.get("mediaMetadata", {}).get("width"),
                    "height": item.get("mediaMetadata", {}).get("height"),
                    "localPath": str(local_path),
                }
                all_meta.append(md)
                print(f"Downloaded: {local_path.name}")
            except Exception as e:
                print(f"Failed {item.get('filename', item.get('id'))}: {e}")

        page_token = resp.get("nextPageToken")
        if not page_token:
            break

    meta_path = out_dir / "metadata.json"
    meta_path.write_text(json.dumps(all_meta, indent=2), encoding="utf-8")
    print(f"\nDone. {len(all_meta)} items downloaded")
    print(f"Metadata: {meta_path}")


if __name__ == "__main__":
    main()
