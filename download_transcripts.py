import os
import sys
import json
import urllib.request
from youtube_transcript_api import YouTubeTranscriptApi

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

VIDEO_IDS = [
    "864K3aevimY",
    "LIPJnGj6qv8",
    "bOInc_rTczQ",
    "BWENXwIAmIQ",
    "O9jZhGH5e8g",
    "I3hQkQaLd14",
    "A1iyDa37COE",
    "nXpxihyVJPY",
    "4oXH2EJvOpg",
    "ksNmw65q4iM",
    "VEeQBSpxL9M",
    "t_0CxFQk6A8",
    "kXyKtL54BN0",
    "9oobzdnZkaE",
    "gnVskPRghyo",
    "Qz2lnoWws3U",
    "jbC1B4Lz4J4",
    "Z-EMgd4tN2I",
    "jKFu55ZcLR4",
    "6sfwbJcYk28",
    "rddtxTpLFPQ",
    "-485UDocH1A",
    "PJ8_9S_6kKo",
    "8xU-iDrRun4",
    "XEyyKae9rjQ",
    "ZOpqpMKKTmc",
    "SRZgDzspVH4",
    "81oPdM_AvZA",
    "YoCNYFm0QlQ",
    "4Xgba8ZugOg",
    "ZypotY5Wtr4",
    "M31z2p34ynM",
    "_7V8IsbKv2s",
    "C_Z8Ia-zPUE",
    "old9SpWJUKo",
    "-yu83GFS3-Q",
    "_IYliKtuHBk",
    "61Z8TzMQePk",
    "EdXYHtBaPzI"
]

def get_video_title(video_id):
    try:
        url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            return data.get('title', f"Video STIFIn {video_id}")
    except Exception as e:
        return f"Video STIFIn {video_id}"

def fetch_transcript(video_id):
    api = YouTubeTranscriptApi()
    try:
        transcript_obj = api.fetch(video_id, languages=['id', 'en', 'id-ID', 'en-US'])
        return ' '.join(s.text for s in transcript_obj)
    except Exception:
        try:
            transcript_list = api.list(video_id)
            for t in transcript_list:
                try:
                    fetched = t.fetch()
                    return ' '.join(s.text for s in fetched)
                except Exception:
                    continue
        except Exception as e:
            return None
    return None

def main():
    os.makedirs("docs/transkrip_youtube", exist_ok=True)
    all_transcripts_text = []

    print(f"Mengunduh transkrip untuk {len(VIDEO_IDS)} video...")
    success_count = 0
    fail_count = 0

    for idx, vid in enumerate(VIDEO_IDS, 1):
        title = get_video_title(vid)
        url = f"https://www.youtube.com/watch?v={vid}"
        print(f"[{idx}/{len(VIDEO_IDS)}] {title} ({vid})...")

        text = fetch_transcript(vid)
        if text:
            clean_text = ' '.join(text.split())
            entry = f"=== JUDUL VIDEO: {title} ===\nURL: {url}\nID VIDEO: {vid}\nTRANSKRIP:\n{clean_text}\n\n"
            
            single_path = f"docs/transkrip_youtube/{vid}.txt"
            with open(single_path, "w", encoding="utf-8") as f:
                f.write(entry)
            
            all_transcripts_text.append(entry)
            success_count += 1
            print(f"  [OK] Berhasil ({len(clean_text)} karakter)")
        else:
            print(f"  [FAIL] Gagal mendapatkan transkrip untuk {vid}")
            fail_count += 1

    consolidated_path = "docs/koleksi_transkrip_youtube_stifin.txt"
    with open(consolidated_path, "w", encoding="utf-8") as f:
        f.write("\n".join(all_transcripts_text))

    print(f"\nSelesai! Berhasil: {success_count}, Gagal: {fail_count}")
    print(f"File kompilasi disimpan di: {consolidated_path}")

if __name__ == "__main__":
    main()
