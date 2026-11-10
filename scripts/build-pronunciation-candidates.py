#!/usr/bin/env python3
"""Create isolated PHONETIC correction candidates only (not published).

These remain synthetic, not human voice actor recordings.
Only edits known F-word risk cases. All changes require listening approval.
"""
import hashlib
import json
import os
import subprocess
from pathlib import Path

os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
import numpy as np
import torch
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "audio-qa"
MANIFEST = json.loads((ROOT / "learn/audio-manifest.json").read_text(encoding="utf-8"))
PHONEMES = {
    "fish": "fˈɪʃ",
    "frog": "fɹˈɑɡ",
    "flower": "flˈaʊɚ",
    "fork": "fˈɔɹk",
}
VOICE_IDS = {"female": "af_sarah", "male": "am_liam"}
WAVE_RATE = 24000

def create_file(text, phonemes, voice_id, path, pipeline):
    phonetic_markup = f"[{text}](/{phonemes}/)"
    chunks = list(pipeline(phonetic_markup, voice=voice_id, speed=1.0))
    if len(chunks) != 1 or chunks[0].audio is None:
        raise ValueError(f"Not a single utterance for {text} and {voice_id}")
    parsed = chunks[0].phonemes
    if not parsed or parsed.lstrip("ˈˌ").startswith("v") or not parsed.lstrip("ˈˌ").startswith("f"):
        raise ValueError(f"Wrong synthesized phoneme sequence for {text}: {parsed}")
    samples = np.asarray(chunks[0].audio, dtype=np.float32).reshape(-1)
    if not np.isfinite(samples).all() or np.max(np.abs(samples)) < 0.02 or not (0.18 < len(samples) / WAVE_RATE < 8):
        raise ValueError(f"Invalid candidate sound for {text} / {voice_id}")
    path.parent.mkdir(parents=True, exist_ok=True)
    command = [
        "ffmpeg", "-nostdin", "-loglevel", "error", "-f", "f32le",
        "-ar", str(WAVE_RATE), "-ac", "1", "-i", "pipe:0",
        "-af", "highpass=f=70,lowpass=f=10700,loudnorm=I=-18:TP=-3:LRA=7",
        "-codec:a", "libmp3lame", "-b:a", "96k", "-ar", "24000", "-ac", "1",
        "-y", str(path)
    ]
    subprocess.run(command, input=samples.tobytes(), capture_output=True, check=True)
    clip = path.read_bytes()
    duration = float(subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path)
    ], capture_output=True, text=True, check=True).stdout.strip())
    if duration < 0.18 or duration > 8.0 or len(clip) < 3500:
        raise ValueError(f"Decoded MP3 check failed {path} duration={duration}")
    return {"phonemes_emitted": parsed, "duration_seconds": round(duration, 3),
            "bytes": len(clip), "sha256": hashlib.sha256(clip).hexdigest()}

def main():
    torch.set_num_threads(2)
    engine = KPipeline(lang_code="a", device="cpu")
    out = []
    for index, record in enumerate(MANIFEST["recordings"]):
        if record["type"] != "word" or record["text"] not in PHONEMES:
            continue
        for voice, voice_id in VOICE_IDS.items():
            target = OUT / "candidates" / voice / f"{index:03}.mp3"
            meta = create_file(record["text"], PHONEMES[record["text"]], voice_id, target, engine)
            out.append({
                "index": index, "voice": voice, "word": record["text"],
                "candidate_asset": str(target.relative_to(ROOT)),
                "phonemes": PHONEMES[record["text"]], "voice_id": voice_id,
                "review_status": "NEEDS_HUMAN_LISTENING", **meta
            })
            print(f"Created {voice} candidate for {record['text']} / {index:03}", flush=True)
    if len(out) != len(PHONEMES) * 2:
        raise ValueError(f"Expected 8 candidate recordings, got {len(out)}")
    OUT.mkdir(exist_ok=True)
    (OUT / "candidates.json").write_text(json.dumps(out, indent=2, ensure_ascii=False)+"\n", encoding="utf-8")
    print("Created review-only candidates; 0 public files changed, 0 human approvals.", flush=True)

if __name__ == "__main__":
    main()
