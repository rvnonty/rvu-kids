#!/usr/bin/env python3
"""Rebuild all 244 mapped utterances with two playful US English neural voices.
Automated integrity checking is not human pronunciation certification.
"""
from __future__ import annotations
import importlib.util,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VOICES={'female':'af_heart','male':'am_puck'}
def source_module(path,name):
    spec=importlib.util.spec_from_file_location(name,str(path))
    module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module
def swap_once(path,a,b):
    text=path.read_text(encoding='utf-8')
    if text.count(a)!=1:raise RuntimeError('Expected one release token '+a+' in '+str(path))
    path.write_text(text.replace(a,b),encoding='utf-8')
def main():
    lib=source_module(ROOT/'scripts/rebuild-voice-library.py','rvu_original_audio')
    cleaner=source_module(ROOT/'scripts/trim-and-level-audio.py','rvu_trim_audio')
    lib.VOICES=VOICES
    lib.torch.set_num_threads(2)
    manifest_path=ROOT/'learn/audio-manifest.json'
    manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
    records=lib.align_manifest(manifest,lib.load_curriculum())
    if len(records)!=244:raise RuntimeError('Expected all 244 lesson recordings')
    js=(ROOT/'learn/learn.js').read_text(encoding='utf-8')
    old_rows=json.loads(re.search(r'(?m)^const AUDIO_ROWS=(\[\[.*\]\]);$',js).group(1))
    if old_rows!=[[r['type'],r['lesson'],r['text']] for r in records]:
        raise RuntimeError('Curriculum ordering mismatch; refusing to replace spoken clips')
    pipeline=lib.KPipeline(lang_code='a',device='cpu')
    report=[]
    for i,rec in enumerate(records):
        phrase=lib.speech_text(rec)
        for gender,voice in VOICES.items():
            samples=lib.synthesize(pipeline,phrase,voice)
            clean,lead,tail,gain=cleaner.trim(samples)
            dst=ROOT/'assets/audio'/gender/f'{i:03}.mp3'
            meta=lib.write_mp3(dst,clean)
            report.append({'id':i,'text':rec['text'],'type':rec['type'],
                           'lesson':rec['lesson'],'voice':gender,'engineVoice':voice,
                           'trimHead':lead,'trimTail':tail,'gain':gain,**meta})
        print(f'{i+1:03}/244 {rec["type"]:18} {rec["lesson"]:16} {rec["text"]}',flush=True)
    if len(report)!=488 or len({x['sha256'] for x in report})!=488:
        raise RuntimeError('Missing or duplicated speech clip')
    manifest['version']=7
    manifest['status']='partially-reviewed-not-final'
    manifest['voiceLibrary']={
        'source':'Kokoro 82M US English',
        'female':VOICES['female'],'male':VOICES['male'],
        'character':'warm/playful, perceived age not independently verified',
        'automatedVerification':'transcript mapping, waveforms, MP3 decoding, individual clipping and normalization',
        'humanPronunciationSignoff':False
    }
    manifest['pronunciationQA']['humanSignoffComplete']=False
    manifest['pronunciationQA']['knownConcerns']=[
       'Full listening review of all 488 recordings is pending',
       'Check word Fish initial f, short E vowel, stress and consonant endings',
       'Young voice perception is subjective and not guaranteed'
    ]
    manifest['processingQA']={
        'stage':'new consistent warm female and playful male speech, trimmed and leveled',
        'filesValidated':488,'humanListeningApproved':False,
        'phonemeValidation':'still requires listening'
    }
    manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    for path in ['learn/media-sw.js','scripts/media-browser-smoke.mjs','tests/persistent-media-cache.test.mjs']:
        swap_once(ROOT/path,'rvu-kids-media-v4','rvu-kids-media-v5')
    swap_once(ROOT/'learn/learn.js','?v=20261114-clean','?v=20261114-youth')
    swap_once(ROOT/'app.js','?v=20261114-clean','?v=20261114-youth')
    docs=ROOT/'docs/audio-review.md'
    txt=docs.read_text(encoding='utf-8')
    txt=txt.replace('female af_sarah','female af_heart').replace('male am_liam','male am_puck')
    txt+='\n## American voice refresh — 14 November 2026\n'
    txt+='Rebuilt all 244 lines as a warm female af_heart and a playful male am_puck, '
    txt+='then trimmed and normalized 488 MP3 tracks. Human listening approval remains pending.\n'
    docs.write_text(txt,encoding='utf-8')
    out=ROOT/'audio-build';out.mkdir(exist_ok=True)
    (out/'youthful-voice-report.json').write_text(json.dumps({
      'status':'NEEDS_HUMAN_LISTENING','voices':VOICES,
      'fileCount':len(report),'files':report},indent=2)+'\n',encoding='utf-8')
    print('488 fresh MP3s verified in the new US English voices; human listening still pending.',flush=True)
if __name__=='__main__':main()
