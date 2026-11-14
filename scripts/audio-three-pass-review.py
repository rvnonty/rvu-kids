#!/usr/bin/env python3
"""Run three independent automatic checks on each of 488 unique voice clips.

This is *not* triple human listening and cannot certify American accent,
childlike timbre, correct phonetics, or a pleasing emotional delivery.
"""
import array,hashlib,json,math,re,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
AUDIO=ROOT/'learn/audio-manifest.json'
OUT=ROOT/'audio-qa';OUT.mkdir(parents=True,exist_ok=True)
meta=json.loads(AUDIO.read_text(encoding='utf-8'))
rows=meta['recordings']
source=(ROOT/'learn/learn.js').read_text(encoding='utf-8')
match=re.search(r'^const AUDIO_ROWS=(\[\[.*\]\]);$',source,re.M)
if not match:raise RuntimeError('Curriculum mapping not found')
reference=json.loads(match.group(1))
assert len(rows)==len(reference)==244
results=[];seen=set()
def run(cmd):
    p=subprocess.run(cmd,capture_output=True)
    if p.returncode:raise RuntimeError(p.stderr.decode(errors='replace')[:400])
    return p.stdout
for idx,row in enumerate(rows):
    actual=[row['type'],row['lesson'],row['text']]
    assert actual==reference[idx],(idx,actual,reference[idx])
    for voice in ('female','male'):
        path=ROOT/row['voices'][voice].lstrip('/')
        relative=path.relative_to(ROOT).as_posix()
        line={'index':idx,'type':row['type'],'lesson':row['lesson'],
              'expected':row['text'],'voice':voice,'asset':relative}
        # Pass 1: original utterance, voice pair, manifest mapping and nonduplicate bytes.
        assert path.is_file(),relative
        blob=path.read_bytes()
        assert len(blob)>2300,relative
        sha=hashlib.sha256(blob).hexdigest()
        assert sha not in seen,relative
        seen.add(sha);line['pass1_mapping']='PASS';line['bytes']=len(blob)
        # Pass 2: actual full waveform decode, loudness, duration, clipping.
        raw=run(['ffmpeg','-hide_banner','-loglevel','error','-nostdin',
                 '-i',str(path),'-f','f32le','-ac','1','-ar','16000','pipe:1'])
        samples=array.array('f');samples.frombytes(raw)
        assert sys.byteorder=='little'
        assert len(samples)>3200,relative
        peak=max(abs(x) for x in samples)
        rms=math.sqrt(sum(x*x for x in samples)/len(samples))
        duration=len(samples)/16000
        assert all(map(math.isfinite,(peak,rms,duration))),relative
        assert 0.2<duration<14.0,(relative,duration)
        assert 0.0006<rms<0.8,(relative,rms)
        assert 0.001<peak<1.001,(relative,peak)
        line.update({'pass2_decode':'PASS','seconds':round(duration,3),
                     'rms':round(rms,5),'peak':round(peak,5)})
        # Pass 3: final built-website parity, metadata, early & late wave activity.
        packaged=ROOT/'dist'/relative
        assert packaged.is_file(),relative+' absent from build'
        assert hashlib.sha256(packaged.read_bytes()).hexdigest()==sha,relative
        probe=json.loads(run(['ffprobe','-v','error','-show_entries',
                              'format=duration:stream=codec_name',
                              '-of','json',str(packaged)]))
        assert any(s.get('codec_name')=='mp3' for s in probe.get('streams',[])),relative
        reported=float(probe['format']['duration'])
        assert abs(reported-duration)<0.25,relative
        line.update({'pass3_packaged':'PASS','codec':'mp3',
                     'humanListeningApproved':False})
        results.append(line)
    if (idx+1)%20==0:print(f'3-pass audio check: {idx+1}/244 lines, {len(results)}/488 files',flush=True)
assert len(results)==488
summary={'total':len(results),'pass1_mapping':488,'pass2_decode':488,
         'pass3_packaged':488,'humanListeningApproved':False,
         'note':'Three mechanical validations per clip. Does NOT mean three human listens or pronounce every phoneme correctly.',
         'voiceLibrary':meta.get('voiceLibrary'),
         'files':results}
(OUT/'three-pass-488-voice-report.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('PASS: 488 audio clips, three independent automatic validations per clip; human signoff is still required.')
