#!/usr/bin/env python3
import hashlib
import json
import os
import re
import subprocess
from pathlib import Path

import numpy as np
import torch
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "assets/audio"
CURRICULUM_FILE = ROOT / "learn/content.js"
MANIFEST_FILE = ROOT / "learn/audio-manifest.json"
SCRIPT_FILE = ROOT / "learn/learn.js"
SAMPLE_RATE = 24000
VOICES = {"female": "af_sarah", "male": "am_liam"}
SOUNDS = {
    "a": "ˈæ", "b": "bˈə", "c": "kˈə", "d": "dˈə", "e": "ˈɛ", "f": "fˈə",
    "g": "ɡˈə", "h": "hˈə", "i": "ˈɪ", "j": "dʒˈə", "k": "kˈə", "l": "lˈə",
    "m": "mˈə", "n": "nˈə", "o": "ˈɑ", "p": "pˈə", "q": "kwˈə", "r": "ɹˈə",
    "s": "sˈə", "t": "tˈə", "u": "ˈʌ", "v": "vˈə", "w": "wˈə",
    "x": "ˈɛks", "y": "jˈə", "z": "zˈə",
}
LETTER_NAMES = {
    "a": "ay", "b": "bee", "c": "see", "d": "dee", "e": "ee", "f": "eff",
    "g": "jee", "h": "aitch", "i": "eye", "j": "jay", "k": "kay", "l": "ell",
    "m": "em", "n": "en", "o": "oh", "p": "pee", "q": "cue", "r": "ar",
    "s": "ess", "t": "tee", "u": "you", "v": "vee", "w": "double you",
    "x": "ex", "y": "why", "z": "zee",
}
PRONUNCIATIONS = {
    "fish": "fˈɪʃ", "frog": "fɹˈɑɡ", "flower": "flˈaʊɚ",
    "carrot": "kˈæɹət", "drum": "dɹˈʌm", "egg": "ˈɛɡ",
    "elephant": "ˈɛləfənt", "fox": "fˈɑks", "igloo": "ˈɪɡlu",
    "ox": "ˈɑks", "snake": "snˈeɪk",
}
SPECIAL_SPEECH = {
    "My name is ______.": "My name is.",
    "Can I have _____, please?": "Can I have, please?",
}
def load_curriculum():
    raw = CURRICULUM_FILE.read_text(encoding="utf-8")
    found = re.search(r"window\.RVU_CURRICULUM=(\{[\s\S]*\});\s*$", raw)
    if not found:
        raise RuntimeError("Cannot decode published lesson curriculum")
    return json.loads(found.group(1))

def align_manifest(manifest, curriculum):
    records = manifest["recordings"]
    for lesson in curriculum["alphabet"]:
        lid = lesson["id"]
        words = [row for row in records if row["lesson"] == lid and row["type"] == "word"]
        sentences = [row for row in records if row["lesson"] == lid and row["type"] == "alphabet-sentence"]
        if len(words) != len(lesson["words"]) or len(sentences) < len(lesson["sentences"]):
            raise RuntimeError("Record slot mismatch for letter " + lid)
        for row, text in zip(words, lesson["words"]):
            row["text"] = text
        for row, text in zip(sentences, lesson["sentences"]):
            row["text"] = text
        for extra in sentences[len(lesson["sentences"]):]:
            extra["type"] = "review-sentence"
            extra["text"] = "This is an x-ray." if lid == "x" else extra["text"]
    for lesson in curriculum["sentences"]:
        old = [row["text"] for row in records if row["lesson"] == lesson["id"] and row["type"] == "everyday-sentence"]
        if old != lesson["sentences"]:
            raise RuntimeError("Everyday sentence mismatch for " + lesson["id"])
    words = {(r["lesson"], r["text"]) for r in records if r["type"] == "word"}
    expected = {(l["id"], w) for l in curriculum["alphabet"] for w in l["words"]}
    if words != expected or len(records) != 244:
        raise RuntimeError("Recorded vocabulary does not match all 101 book words")
    for row in records:
        row.pop("pronunciationStatus", None)
    manifest["version"] = 6
    manifest["status"] = "partially-reviewed-not-final"
    manifest["voiceLibrary"] = {
        "source": "Kokoro English American synthetic voices",
        "female": VOICES["female"],
        "male": VOICES["male"],
        "automatedVerification": "basic waveform, MP3 and curriculum integrity",
        "humanPronunciationSignoff": False,
    }
    manifest["requiredRecordings"] = len(records)
    manifest["pronunciationQA"]["humanSignoffComplete"] = False
    return records

def speech_text(record):
    text = record["text"]
    if record["type"] == "letter-name":
        return LETTER_NAMES[record["lesson"]]
    if record["type"] == "letter-sound":
        return "[" + text + "](/" + SOUNDS[record["lesson"]] + "/)"
    if record["type"] == "word" and text in PRONUNCIATIONS:
        return "[" + text + "](/" + PRONUNCIATIONS[text] + "/)"
    return SPECIAL_SPEECH.get(text, text)

def synthesize(pipeline, text, voice):
    chunks = list(pipeline(text, voice=voice, speed=0.96))
    samples = [np.asarray(chunk.audio, dtype=np.float32).flatten()
               for chunk in chunks if chunk.audio is not None]
    if not samples:
        raise RuntimeError("Empty synthesized output for " + text)
    joined = np.concatenate(samples)
    duration = len(joined) / SAMPLE_RATE
    peak = float(np.max(np.abs(joined)))
    rms = float(np.sqrt(np.mean(joined * joined)))
    if not np.all(np.isfinite(joined)) or not (0.12 < duration < 13.5) or peak < 0.025 or rms < 0.002:
        raise RuntimeError(f"Unusable synthetic audio: {text} duration={duration:.3f} peak={peak:.3f} rms={rms:.3f}")
    return joined

def write_mp3(path, samples):
    path.parent.mkdir(parents=True, exist_ok=True)
    command = [
        "ffmpeg", "-hide_banner", "-nostdin", "-loglevel", "error",
        "-f", "f32le", "-ar", str(SAMPLE_RATE), "-ac", "1", "-i", "pipe:0",
        "-af", "highpass=f=65,lowpass=f=10200,loudnorm=I=-18:TP=-2.5:LRA=8",
        "-codec:a", "libmp3lame", "-b:a", "96k", "-ar", "24000", "-ac", "1",
        "-y", str(path)
    ]
    subprocess.run(command, input=samples.tobytes(), check=True, capture_output=True)
    size = path.stat().st_size
    info = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path)
    ], check=True, capture_output=True, text=True)
    duration = float(info.stdout.strip())
    if not (0.12 < duration < 14) or size < 2400:
        raise RuntimeError(f"Invalid MP3 {path}: {size} bytes, {duration:.3f} seconds")
    return {"bytes": size, "duration": round(duration, 3), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}

def update_source(manifest):
    raw = SCRIPT_FILE.read_text(encoding="utf-8")
    rows = [[r["type"], r["lesson"], r["text"]] for r in manifest["recordings"]]
    new = re.sub(r"(?m)^const AUDIO_ROWS=\[\[.*\]\];$", "const AUDIO_ROWS=" + json.dumps(rows, ensure_ascii=False, separators=(",", ":")) + ";", raw, count=1)
    if new == raw:
        raise RuntimeError("AUDIO_ROWS is missing or unchanged")
    new = new.replace("const REPORTED_WRONG_WORD_AUDIO=new Set(['fish','fork']);",
                      "const REPORTED_WRONG_WORD_AUDIO=new Set([]);")
    if new == raw:
        raise RuntimeError("Source was not rebuilt")
    SCRIPT_FILE.write_text(new, encoding="utf-8")
    MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def update_tests():
    tests = ROOT / "tests"
    p = tests / "illustration-and-audio-gap.test.mjs"
    txt = p.read_text(encoding="utf-8")
    txt = re.sub(r"assert\.deepEqual\(missing,\[[\s\S]*?\]\.sort\(\)\);", "assert.deepEqual(missing,[]);", txt, count=1)
    p.write_text(txt, encoding="utf-8")
    p = tests / "quality-gates.test.mjs"
    txt = p.read_text(encoding="utf-8")
    txt = txt.replace(r"/REPORTED_WRONG_WORD_AUDIO=new Set\(\['fish','fork'\]\)/",
                      r"/REPORTED_WRONG_WORD_AUDIO=new Set\(\[\]\)/")
    p.write_text(txt, encoding="utf-8")
    p = tests / "full-repository-assets.test.mjs"
    txt = p.read_text(encoding="utf-8")
    txt = txt.replace("['fish','fork']);", "[]);")
    p.write_text(txt, encoding="utf-8")
    p = tests / "audio-review.test.mjs"
    p.write_text("""import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const js=readFileSync('learn/learn.js','utf8');
const manifest=JSON.parse(readFileSync('learn/audio-manifest.json','utf8'));
test('all approved book words and E pronunciation rows have paired recordings without missing/blocked buttons',()=>{
 assert.match(js,/REPORTED_WRONG_WORD_AUDIO=new Set\\(\\[\\]\\)/);
 const rows=JSON.parse(js.match(/^const AUDIO_ROWS=(\\[\\[.*\\]\\]);$/m)[1]);
 assert.deepEqual(rows,manifest.recordings.map(row=>[row.type,row.lesson,row.text]));
 const wordRows=manifest.recordings.filter(row=>row.type==='word');
 assert.equal(wordRows.length,101);
 for(const row of manifest.recordings)for(const voice of ['female','male'])assert.ok(existsSync('.'+row.voices[voice]));
 for(const index of [28,29])assert.equal(manifest.recordings[index].lesson,'e');
 assert.equal(manifest.pronunciationQA.humanSignoffComplete,false);
});
""", encoding="utf-8")
    for path in (ROOT / "learn/media-sw.js", ROOT / "scripts/media-browser-smoke.mjs",
                 ROOT / "tests/persistent-media-cache.test.mjs"):
        src = path.read_text(encoding="utf-8")
        if "rvu-kids-media-v2" not in src:
            raise RuntimeError("Media cache version mismatch in " + str(path))
        path.write_text(src.replace("rvu-kids-media-v2", "rvu-kids-media-v3"), encoding="utf-8")

def main():
    torch.set_num_threads(2)
    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    records = align_manifest(manifest, load_curriculum())
    pipeline = KPipeline(lang_code="a", device="cpu")
    report = []
    for index, record in enumerate(records):
        text = speech_text(record)
        for gender, voice_id in VOICES.items():
            audio = synthesize(pipeline, text, voice_id)
            path = AUDIO / gender / f"{index:03}.mp3"
            meta = write_mp3(path, audio)
            report.append({"index": index, "lesson": record["lesson"], "type": record["type"],
                           "text": record["text"], "voice": gender, "voiceId": voice_id, **meta})
        print(f"{index+1:03}/244 {record['type']:19} {record['lesson']:16} {record['text']}", flush=True)
    if len(report) != 488 or len({r["sha256"] for r in report}) != 488:
        raise RuntimeError("The audio library is incomplete or contains duplicate clips")
    update_source(manifest)
    update_tests()
    out = ROOT / "audio-build"
    out.mkdir(exist_ok=True)
    (out / "report.json").write_text(json.dumps({
        "recordings": len(report), "status": "NEEDS_HUMAN_LISTENING",
        "maleVoice": VOICES["male"], "femaleVoice": VOICES["female"], "files": report
    }, indent=2) + "\n", encoding="utf-8")
    print("488 regenerated, mapped, and checked; human listening approval remains pending.", flush=True)

if __name__ == "__main__":
    main()
