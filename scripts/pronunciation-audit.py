#!/usr/bin/env python3
"""Automated pronunciation triage for the 101 English words x 2 existing voices.

ASR is a screening tool, NOT proof of a native accent or natural human voice.
Never marks any recording as human-reviewed.
"""
import csv
import json
import re
from pathlib import Path
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / "learn/audio-manifest.json").read_text(encoding="utf-8"))
OUT = ROOT / "audio-qa"
OUT.mkdir(exist_ok=True)

def normalized(text):
    return re.sub(r"[^a-z0-9]", "", text.lower())

def read_voice(model, asset):
    file = ROOT / asset.lstrip("/")
    if not file.is_file() or file.stat().st_size < 2200:
        return {"recognized": "", "status": "missing-or-empty", "avg_logprob": None}
    try:
        segments, _ = model.transcribe(
            str(file), language="en", beam_size=4, temperature=0.0,
            condition_on_previous_text=False, vad_filter=False,
        )
        parts = list(segments)
        heard = " ".join(seg.text.strip() for seg in parts).strip()
        logprobs = [seg.avg_logprob for seg in parts]
        return {
            "recognized": heard,
            "avg_logprob": round(sum(logprobs) / len(logprobs), 3) if logprobs else None,
        }
    except Exception as exc:
        return {"recognized": "", "status": "transcription-error", "reason": str(exc)}

def evaluate(source, observed):
    expected = normalized(source)
    heard = normalized(observed.get("recognized", ""))
    if observed.get("status"):
        return observed["status"]
    if not heard:
        return "blank-transcript-needs-review"
    if heard != expected:
        return "different-word-or-extra-vocalization-needs-review"
    return "asr-text-match-only-not-human-approved"

records = MANIFEST["recordings"]
assert len(records) == 244
words = [(i, r) for i, r in enumerate(records) if r["type"] == "word"]
assert len(words) == 101

model = WhisperModel("base.en", device="cpu", compute_type="int8", cpu_threads=4)
rows = []
for i, rec in words:
    for voice in ("female", "male"):
        original = read_voice(model, rec["voices"][voice])
        status = evaluate(rec["text"], original)
        rows.append({
            "index": i, "lesson": rec["lesson"], "expected": rec["text"],
            "voice": voice, "original_asset": rec["voices"][voice],
            "recognized": original["recognized"],
            "avg_logprob": original.get("avg_logprob"),
            "status": status,
            "human_review_required": True,
            "reported_issue": rec["text"] == "fish",
        })
        print(f"{len(rows):03d}/202 {voice:6} {rec['text']:16} => {original['recognized']!r} [{status}]", flush=True)

candidate_manifest = OUT / "candidates.json"
if candidate_manifest.exists():
    candidate_data = json.loads(candidate_manifest.read_text(encoding="utf-8"))
    for row in rows:
        target = next((x for x in candidate_data if x["index"] == row["index"] and x["voice"] == row["voice"]), None)
        if target:
            candidate = read_voice(model, target["candidate_asset"])
            row["candidate_asset"] = target["candidate_asset"]
            row["candidate_text"] = candidate["recognized"]
            row["candidate_status"] = evaluate(row["expected"], candidate)
            row["candidate_phonemes"] = target["phonemes"]

with (OUT / "pronunciation-report.csv").open("w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=list(dict.fromkeys(k for row in rows for k in row)))
    writer.writeheader()
    writer.writerows(rows)
from collections import Counter
counts = Counter(row["status"] for row in rows)
report = {
    "scope": "101 curriculum words x 2 voices",
    "total_files": len(rows), "checks": dict(counts),
    "human_reviewed": 0, "verified_human_speech": False,
    "warning": "Whisper matching is not reliable evidence of accurate pronunciation or human timbre. Every candidate must be listened to by an American-English educator before replacing production audio.",
    "rows": rows,
}
(OUT / "pronunciation-report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False)+"\n", encoding="utf-8")
print(json.dumps({"total": len(rows), "status": dict(counts)}, indent=2))
