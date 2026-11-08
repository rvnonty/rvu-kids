#!/usr/bin/env python3
"""Create review-only US-English neural voice clips, one female and one male per curriculum item.

The result is *synthetic*, not human voice-actor recordings. It never changes
learn/audio-manifest.json or the child-facing audio-off release gate.
"""
from __future__ import annotations

import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path
from collections import Counter

os.environ.setdefault("HF_HUB_DISABLE_PROGRESS_BARS", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

import numpy as np
import torch
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "learn/audio-manifest.json"
OUTPUT = ROOT / "audio-review"
AUDIO = OUTPUT / "neural"
SAMPLE_RATE = 24000
VOICE_IDS = {
    "female": "af_heart",    # American English (female-presenting)
    "male": "am_michael",   # American English (male-presenting)
}
COUNTS = {
    "letter-name": 26,
    "letter-sound": 26,
    "word": 101,
    "alphabet-sentence": 27,
    "everyday-sentence": 64,
}

# IPA pronunciation hints for *letter names*, not spelling-as-article TTS.
LETTER_NAMES = {
    "a": "ˈeɪ", "b": "bˈi", "c": "sˈi", "d": "dˈi", "e": "ˈi",
    "f": "ˈɛf", "g": "dʒˈi", "h": "ˈeɪtʃ", "i": "ˈaɪ", "j": "dʒˈeɪ",
    "k": "kˈeɪ", "l": "ˈɛl", "m": "ˈɛm", "n": "ˈɛn", "o": "ˈoʊ",
    "p": "pˈi", "q": "kjˈu", "r": "ˈɑɹ", "s": "ˈɛs", "t": "tˈi",
    "u": "jˈu", "v": "vˈi", "w": "dˈʌbəl jˈu", "x": "ˈɛks",
    "y": "wˈaɪ", "z": "zˈi",
}

# These are provisional *isolated phonemes* with educator review explicitly required.
# Some consonants may sound artificially short or require a professionally recorded take.
PHONICS = {
    "a": "æ", "b": "b", "c": "k", "d": "d", "e": "ɛ",
    "f": "f", "g": "ɡ", "h": "h", "i": "ɪ", "j": "dʒ",
    "k": "k", "l": "l", "m": "m", "n": "n", "o": "ɑ",
    "p": "p", "q": "kw", "r": "ɹ", "s": "s", "t": "t",
    "u": "ʌ", "v": "v", "w": "w", "x": "ks", "y": "j", "z": "z",
}
EXEMPLARS = {
    "a": "apple", "b": "ball", "c": "cat", "d": "dog", "e": "elephant",
    "f": "fish", "g": "goat", "h": "hat", "i": "insect", "j": "juice",
    "k": "kite", "l": "lion", "m": "moon", "n": "nest", "o": "octopus",
    "p": "pig", "q": "queen", "r": "rabbit", "s": "sun", "t": "tiger",
    "u": "umbrella", "v": "van", "w": "whale", "x": "box", "y": "yogurt", "z": "zebra",
}


def candidate_texts(record: dict) -> list[tuple[str, str]]:
    kind = record["type"]
    text = record["text"]
    letter = record["lesson"].lower()
    if kind == "letter-name":
        return [(f'[{text}](/{LETTER_NAMES[letter]}/)', "letter name IPA")]
    if kind == "letter-sound":
        return [
            (f'[sound](/{PHONICS[letter]}/)', "isolated phoneme; phonics review essential"),
            (f"The first sound in {EXEMPLARS[letter]}.", "fallback explanatory sound cue; NOT an isolated phoneme"),
        ]
    if text == "My name is ______.":
        return [("My name is...", "blank rendered as a pause")]
    if text == "Can I have _____, please?":
        return [("Can I have... please?", "blank rendered as a pause")]
    return [(text, "")]


def synthesize(pipeline: KPipeline, text: str, voice: str) -> np.ndarray:
    segments = []
    for _, _, audio in pipeline(text, voice=voice, speed=0.91, split_pattern=r"\n+"):
        a = np.asarray(audio, dtype=np.float32).reshape(-1)
        if a.size:
            segments.append(a)
    if not segments:
        raise ValueError("No audio segments")
    wave = np.concatenate(segments)
    duration = wave.size / SAMPLE_RATE
    peak = float(np.max(np.abs(wave)))
    if not np.all(np.isfinite(wave)) or duration < 0.16 or duration > 35.0 or peak < 0.015:
        raise ValueError(f"Unsafe audio: duration={duration:.2f}s, peak={peak:.4f}")
    return wave


def encode(wave: np.ndarray, destination: Path) -> tuple[int, str, float]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    command = [
        "ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error",
        "-f", "f32le", "-ar", str(SAMPLE_RATE), "-ac", "1", "-i", "pipe:0",
        "-af", "highpass=f=80,lowpass=f=10500,loudnorm=I=-18:TP=-3:LRA=8,apad=pad_dur=0.18",
        "-ar", str(SAMPLE_RATE), "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "64k",
        "-y", str(destination),
    ]
    subprocess.run(command, input=wave.tobytes(), check=True, capture_output=True)
    payload = destination.read_bytes()
    if len(payload) < 2300:
        raise ValueError(f"MP3 too small: {destination}")
    check = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(destination),
    ], check=True, capture_output=True, text=True)
    duration = float(check.stdout.strip())
    if duration < 0.16 or duration > 36:
        raise ValueError(f"MP3 duration invalid: {destination} {duration}")
    return len(payload), hashlib.sha256(payload).hexdigest(), round(duration, 2)


def main() -> None:
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    records = source.get("recordings", [])
    if source.get("requiredRecordings") != 244 or len(records) != 244:
        raise ValueError("Source curriculum is not 244 entries")
    if Counter(r["type"] for r in records) != COUNTS:
        raise ValueError("Source curriculum type distribution changed")

    torch.set_num_threads(2)
    pipeline = KPipeline(lang_code="a")
    staged = [{key: r[key] for key in ("type", "lesson", "text")} for r in records]
    for r in staged:
        r.update(voices={}, status="pending-human-review",
                 notes="Phonics educator review required" if r["type"] == "letter-sound" else "")

    for voice_label, voice_id in VOICE_IDS.items():
        print(f"Generating {voice_label}: {voice_id} / {len(staged)} recordings", flush=True)
        for idx, record in enumerate(staged):
            errors: list[str] = []
            for text, note in candidate_texts(record):
                try:
                    wave = synthesize(pipeline, text, voice_id)
                    destination = AUDIO / voice_label / f"{idx:03d}.mp3"
                    size, digest, duration = encode(wave, destination)
                    record["voices"][voice_label] = {
                        "asset": f"/audio-review/neural/{voice_label}/{idx:03d}.mp3",
                        "voice_id": voice_id,
                        "technical_status": "passed",
                        "duration_seconds": duration,
                        "bytes": size,
                        "sha256": digest,
                        "synthesis_text": text,
                        "notes": note,
                        "review_status": "pending-human-review",
                    }
                    break
                except Exception as exc:
                    errors.append(f"{type(exc).__name__}: {exc}")
            else:
                raise RuntimeError(f"Synthesis failed for {idx} / {voice_label} / {record['text']}: {errors}")
            if (idx + 1) % 25 == 0:
                print(f"  {voice_label}: {idx+1}/244", flush=True)

    output = {
        "version": 3,
        "locale": "en-US",
        "source": "learn/audio-manifest.json",
        "engine": "Kokoro-82M, Apache-2.0",
        "voices": VOICE_IDS,
        "requiredRecordings": 244,
        "status": "awaiting-qualified-pronunciation-review",
        "notForPublicPlayback": True,
        "recordings": staged,
    }
    assert len(staged) == 244
    assert all(len(r["voices"]) == 2 for r in staged)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "neural-manifest.json").write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print("Finished: 488 natural-style SYNTHETIC US-English recordings, 0 human approved.", flush=True)


if __name__ == "__main__":
    main()
