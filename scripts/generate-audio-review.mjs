// US-English audio drafts ONLY. Does not activate the website.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const source = JSON.parse(await readFile('learn/audio-manifest.json', 'utf8'));
if (source.requiredRecordings !== 244 || source.recordings?.length !== 244) {
  throw Error('Curriculum changed: regenerate/review track inventory before producing audio.');
}
const phonics = {
  a:'[[a]]',b:'[[b@]]',c:'[[k@]]',d:'[[d@]]',e:'[[E]]',
  f:'[[f@]]',g:'[[g@]]',h:'[[h@]]',i:'[[I]]',j:'[[dZ@]]',
  k:'[[k@]]',l:'[[l@]]',m:'[[m@]]',n:'[[n@]]',o:'[[0]]',
  p:'[[p@]]',q:'[[kw@]]',r:'[[r@]]',s:'[[s@]]',t:'[[t@]]',
  u:'[[V]]',v:'[[v@]]',w:'[[w@]]',x:'[[ks@]]',y:'[[j@]]',z:'[[z@]]'
};
const root='audio-review'; const names = new Map(); const recorded=[];
function run(command,args,input) {
  const proc=spawnSync(command,args,{input,encoding:null,maxBuffer:8*1024*1024});
  if(proc.status!==0) throw Error(command+' '+args.join(' ')+'\n'+(proc.stderr||'').toString());
  return proc.stdout;
}
function safe(s) {return s.toLowerCase().replace(/['’]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}
function speechFor(r) {
  if(r.type==='letter-sound') return phonics[r.lesson];
  if(r.type==='everyday-sentence' && r.text==='My name is ______.') return 'My name is...';
  if(r.type==='everyday-sentence' && r.text==='Can I have _____, please?') return 'Can I have... please?';
  return r.text;
}
for(const r of source.recordings) {
  const key=r.type+'/'+r.lesson; const n=(names.get(key)||0)+1; names.set(key,n);
  const name = r.type==='letter-name'||r.type==='letter-sound'
    ? r.lesson
    : r.type==='word' ? r.lesson+'-'+safe(r.text) : r.lesson+'-'+String(n).padStart(2,'0');
  const rel='learn/audio/'+r.type+'/'+name+'.mp3';
  const path=join(root,rel);
  await mkdir(join(root,'learn/audio',r.type),{recursive:true});
  const speaking=speechFor(r);
  const notes=r.type==='letter-sound'
    ? 'CRITICAL: provisional phonics may contain an auxiliary vowel. Human phonics approval/re-recording required.'
    : speaking!==r.text ? 'Blank template adapted to a pause; teacher review required.' : '';
  const wav=run('espeak',['-v','en-us','-s',String(r.type==='letter-name'||r.type==='letter-sound'?108:122),'-a','135','--stdout',speaking]);
  const encoded=run('ffmpeg',['-nostdin','-hide_banner','-loglevel','error','-i','pipe:0','-ar','24000','-ac','1','-af','highpass=f=95,lowpass=f=9000,loudnorm=I=-18:TP=-3:LRA=8,apad=pad_dur=0.19','-codec:a','libmp3lame','-b:a','64k','-f','mp3','pipe:1'],wav);
  await writeFile(path,encoded);
  const duration=Number(run('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path]).toString().trim());
  if(!Number.isFinite(duration)||duration<=0.15||duration>35||encoded.length<3500)throw Error('Invalid track '+rel);
  recorded.push({...r,asset:'/'+rel,synthesis_text:speaking,notes,duration_seconds:+duration.toFixed(2),bytes:encoded.length,sha256:createHash('sha256').update(encoded).digest('hex'),technical_status:'passed',review_status:'pending-human-review',human_reviewer:'',human_review_date:''});
}
if(recorded.length!==244||new Set(recorded.map(r=>r.asset)).size!==244)throw Error('Missing/duplicate tracks');
const counts=Object.groupBy(recorded,r=>r.type);
const expected={'letter-name':26,'letter-sound':26,'word':101,'alphabet-sentence':27,'everyday-sentence':64};
for(const [k,v] of Object.entries(expected))if(counts[k]?.length!==v)throw Error('Wrong recording count for '+k);
const manifest={version:2,locale:'en-US',status:'awaiting-human-approval',notForPublicPlayback:true,requiredRecordings:244,productionVoice:'eSpeak en-us TTS draft',recordings:recorded};
await writeFile(join(root,'learn/audio-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const quote=x=>'"'+String(x??'').replaceAll('"','""')+'"';
const csv=[['id','type','lesson','text','asset','duration_seconds','review_status','notes'],...recorded.map((r,i)=>[i+1,r.type,r.lesson,r.text,r.asset,r.duration_seconds,r.review_status,r.notes])].map(row=>row.map(quote).join(',')).join('\r\n');
await writeFile(join(root,'review-checklist.csv'),'\ufeff'+csv);
await writeFile(join(root,'README.txt'),[
  'RVU Kids - Review-only audio synthesis (244 tracks).',
  'No lesson buttons are activated by this generator.',
  'Files are eSpeak en-US synthetic drafts, NOT native-speaker-approved educational recordings.',
  'A qualified American-English/phonics reviewer must listen to all 244 tracks,',
  'replace incorrect/robotic/inappropriate recordings, and document approval before public use.',
  'The 26 phonics files especially require separate educator approval.',
  'The blank sentence templates also require teacher review.',
  'All records remain pending-human-review and notForPublicPlayback=true.'
].join('\n')+'\n');
console.log('Created '+recorded.length+' staged MP3 drafts. Human-approved: 0. Publicly enabled: false.');
