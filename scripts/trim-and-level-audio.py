#!/usr/bin/env python3
"""One-time, conservative audio cleanup: trim empty tails without cutting phonemes."""
import hashlib,json,subprocess
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
MANIFEST=ROOT/'learn/audio-manifest.json'
RATE=24000
STEP=240
def pcm(path):
    p=subprocess.run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-i',str(path),'-f','f32le','-ac','1','-ar',str(RATE),'pipe:1'],capture_output=True,check=True)
    x=np.frombuffer(p.stdout,dtype='<f4').copy()
    if x.size<7200 or not np.isfinite(x).all():raise RuntimeError('Invalid decoded audio: '+str(path))
    return x
def trim(x):
    energy=np.array([float(np.sqrt(np.mean(x[k:k+STEP]**2))) for k in range(0,len(x)-STEP,STEP)])
    limit=max(.00055,.014*float(np.percentile(energy,95)))
    active=np.flatnonzero(energy>limit)
    if not len(active):raise RuntimeError('Silence-only audio')
    first=max(0,(int(active[0])-10)*STEP)
    last=min(len(x),(int(active[-1])+13)*STEP)
    # Include 100 ms before and 130 ms after active speech; avoid destroying consonants.
    if last-first<RATE*.32:raise RuntimeError('Speech too short after trimming')
    new=x[first:last].copy()
    active_rms=float(np.sqrt(np.mean(new*new)))
    gain=max(.82,min(1.12,.096/max(active_rms,0.0001)))
    gain=min(gain,.88/max(float(np.max(np.abs(new))),0.0001))
    new*=gain
    fade_in=min(360,len(new)//6)
    fade_out=min(600,len(new)//6)
    new[:fade_in]*=np.linspace(.3,1,fade_in,dtype=np.float32)
    new[-fade_out:]*=np.linspace(1,0,fade_out,dtype=np.float32)
    if np.max(np.abs(new))>.9 or not np.isfinite(new).all():raise RuntimeError('Invalid audio peak')
    return new,round(first/RATE,3),round((len(x)-last)/RATE,3),round(gain,3)
def encode(dst,samples):
    temp=dst.with_name(dst.stem+'.clean.tmp.mp3')
    p=subprocess.run(['ffmpeg','-y','-nostdin','-hide_banner','-loglevel','error','-f','f32le','-ar',str(RATE),'-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','96k','-ar',str(RATE),'-ac','1',str(temp)],input=samples.astype('<f4').tobytes(),capture_output=True)
    if p.returncode:raise RuntimeError('Failed '+str(dst)+': '+p.stderr.decode(errors='replace')[:300])
    info=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(temp)],capture_output=True,text=True,check=True)
    duration=float(info.stdout.strip())
    if not (.32<=duration<=14) or temp.stat().st_size<2300:raise RuntimeError('Bad MP3 after cleanup '+str(dst))
    subprocess.run(['ffmpeg','-v','error','-nostdin','-i',str(temp),'-f','null','-'],check=True,capture_output=True)
    temp.replace(dst)
    return duration
def main():
    manifest=json.loads(MANIFEST.read_text())
    rows=manifest['recordings']
    if len(rows)!=244:raise RuntimeError('Expected 244 voice rows')
    inventory=[]
    for i,record in enumerate(rows):
        for gender in ('female','male'):
            rel=record['voices'][gender]
            path=ROOT/rel.lstrip('/')
            if path.name!=f'{i:03}.mp3':raise RuntimeError('Index mismatch '+rel)
            raw=pcm(path);clean,lead,tail,gain=trim(raw);duration=encode(path,clean)
            inventory.append({'id':i,'voice':gender,'label':record['text'],'leadRemoved':lead,'tailRemoved':tail,'gain':gain,'duration':round(duration,3),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
        print(f'{i+1:03}/244 {record["type"]:20} {record["text"]}',flush=True)
    if len(inventory)!=488 or len({x['sha256'] for x in inventory})!=488:
        raise RuntimeError('Every MP3 must be present and unique')
    manifest['processingQA']={'stage':'conservative non-destructive speech-boundary cleanup, gentle fades, leveled RMS','filesValidated':488,'humanListeningApproved':False,'phonemeValidation':'still requires listening'}
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    out=ROOT/'audio-build';out.mkdir(exist_ok=True)
    (out/'trim-report.json').write_text(json.dumps({'files':inventory,'humanApproval':False},indent=2)+'\n')
    print('488 normalized/trimmed files validated; human pronunciation approval remains pending.')
if __name__=='__main__':main()
