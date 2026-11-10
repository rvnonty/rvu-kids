#!/usr/bin/env python3
"""Research-only contextual American neural TTS for F-initial words.

Generate a word naturally within a sentence, crop using the model's token
timestamps, then score *isolated word* audibility with ASR.
This generates synthetic audio, NOT recordings of human speakers.
No production audio assets are modified by this script.
"""
import json, re, subprocess, hashlib
from pathlib import Path

import numpy as np
import torch
from kokoro import KPipeline
from faster_whisper import WhisperModel

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/"audio-context-lab"
SAMPLE_RATE=24000
WORDS={
  "fish":"fˈɪʃ",
  "frog":"fɹˈɑɡ",
  "flower":"flˈaʊɚ",
  "fork":"fˈɔɹk",
}
VOICES={"female":["af_heart","af_sarah"],"male":["am_michael","am_eric"]}
CONTEXTS=[
  "Please say [{word}](/{phone}/).",
  "The word is [{word}](/{phone}/).",
]
def clean(s):
  return re.sub("[^a-z]","",s.lower())
def synthesize(pipeline,prompt,word):
  results=list(pipeline(prompt,voice=cur_voice,speed=1.02))
  if len(results)!=1 or results[0].audio is None:raise RuntimeError("unexpected segmentation")
  r=results[0]
  matching=[t for t in (r.tokens or []) if clean(t.text)==clean(word)]
  if len(matching)!=1:raise RuntimeError("word target does not align to one model token")
  t=matching[0]
  if t.start_ts is None or t.end_ts is None:raise RuntimeError("token timestamps unavailable")
  a=np.asarray(r.audio,dtype=np.float32).reshape(-1)
  start=max(0,int((t.start_ts-0.07)*SAMPLE_RATE))
  stop=min(len(a),int((t.end_ts+0.06)*SAMPLE_RATE))
  if stop<=start or not (0.12< (stop-start)/SAMPLE_RATE <4.0):raise RuntimeError("crop invalid")
  clip=a[start:stop]
  if not np.isfinite(clip).all() or float(np.max(np.abs(clip)))<0.014:raise RuntimeError("invalid amplitude")
  return clip,r.phonemes,(round(t.start_ts,3),round(t.end_ts,3))
def save(clip,path):
  path.parent.mkdir(parents=True,exist_ok=True)
  subprocess.run([
   "ffmpeg","-nostdin","-loglevel","error","-f","f32le","-ar","24000","-ac","1","-i","pipe:0",
   "-af","highpass=f=70,lowpass=f=10700,loudnorm=I=-18:TP=-3:LRA=7",
   "-codec:a","libmp3lame","-b:a","96k","-ar","24000","-ac","1","-y",str(path)
  ],input=clip.tobytes(),capture_output=True,check=True)
  data=path.read_bytes()
  if len(data)<1900:raise RuntimeError("mp3 too short")
  return hashlib.sha256(data).hexdigest()
def recognize(model,path):
  segments,_=model.transcribe(str(path),language="en",beam_size=4,temperature=0.,condition_on_previous_text=False,vad_filter=False)
  return " ".join(seg.text.strip() for seg in segments).strip()
if __name__=="__main__":
  torch.set_num_threads(2)
  pipeline=KPipeline(lang_code="a",device="cpu")
  asr=WhisperModel("base.en",device="cpu",compute_type="int8",cpu_threads=4)
  rows=[]
  for word,phone in WORDS.items():
    for sex,voices in VOICES.items():
      for voice in voices:
        for idx,template in enumerate(CONTEXTS):
          prompt=template.format(word=word,phone=phone)
          path=OUT/"candidates"/word/sex/f"{voice}-{idx+1}.mp3"
          cur_voice=voice
          try:
            clip,emitted,bounds=synthesize(pipeline,prompt,word)
            sha=save(clip,path)
            recognized=recognize(asr,path)
            good=clean(recognized)==clean(word)
            rows.append({"word":word,"voice_gender":sex,"model_voice":voice,"context":idx+1,
              "recognized":recognized,"asr_exact_match":good,"phonetic_target":phone,
              "emitted":emitted,"start_end_seconds":bounds,
              "filename":str(path.relative_to(OUT)),"sha256":sha})
          except Exception as e:
            rows.append({"word":word,"voice_gender":sex,"model_voice":voice,"context":idx+1,"error":str(e),"asr_exact_match":False})
          print(rows[-1],flush=True)
  OUT.mkdir(exist_ok=True)
  (OUT/"matrix.json").write_text(json.dumps({"warning":"Synthetic previews. ASR cannot validate human voice or subtle F/V phonetic contrast.","results":rows},indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
  passed=sum(1 for r in rows if r["asr_exact_match"])
  print(f"MATRIX COMPLETED {passed}/{len(rows)} ASR exact matches. Human voice auditions needed.")
