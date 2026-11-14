#!/usr/bin/env python3
"""Generate 101 transparent, emoji-style 3D picture stickers (not text emoji).
Fluent Emoji 3D artwork © Microsoft, MIT license. Original vector pictograms fill gaps.
"""
import io,json,re,time,urllib.error,urllib.request
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/stickers'
GLYPHS={
'apple':'🍎','ant':'🐜','airplane':'✈️','alligator':'🐊',
'ball':'⚽','bear':'🐻','banana':'🍌','boat':'⛵',
'cat':'🐈','car':'🚗','cake':'🎂','carrot':'🥕',
'door':'🚪','dog':'🐕','duck':'🦆','drum':'🥁',
'egg':'🥚','elephant':'🐘','envelope':'✉️',
'fish':'🐟','flower':'🌼','frog':'🐸','fox':'🦊',
'goat':'🐐','grapes':'🍇','guitar':'🎸','gift':'🎁',
'hat':'🎩','house':'🏠','horse':'🐎','hand':'✋',
'ice cream':'🍦','insect':'🐛','iguana':'🦎',
'juice':'🧃','jacket':'🧥','jeep':'🚙',
'kite':'🪁','key':'🔑','king':'🤴','kitten':'🐈',
'leaf':'🍃','lion':'🦁','lemon':'🍋','moon':'🌙',
'monkey':'🐒','milk':'🥛','mouse':'🐁','nest':'🪺',
'nurse':'👩‍⚕️','nose':'👃','owl':'🦉','ox':'🐂',
'orange':'🍊','octopus':'🐙','pencil':'✏️','panda':'🐼',
'pig':'🐖','pizza':'🍕','queen':'👸',
'rainbow':'🌈','rabbit':'🐇','robot':'🤖','rose':'🌹',
'sun':'☀️','star':'⭐','strawberry':'🍓','snake':'🐍',
'tree':'🌳','tiger':'🐅','train':'🚂','turtle':'🐢',
'up':'⬆️','umbrella':'☂️','uncle':'👨','van':'🚐',
'vase':'🏺','violin':'🎻','whale':'🐋','window':'🪟',
'watch':'⌚','watermelon':'🍉','x-ray':'🩻',
'yo-yo':'🪀','yellow':'🟡','zebra':'🦓'
}
CUSTOM={'engine','igloo','jellyfish','lamp','net','quail','quilt','under','vegetables','xylophone','yak','yogurt','zoo','zipper','zero'}
COLORS=['#f5d66e','#f4ad77','#84cbbb','#8dbde0','#c4a4e2']
def custom_art(w):
  im=Image.new('RGBA',(192,192),(0,0,0,0))
  sh=Image.new('RGBA',(192,192));sd=ImageDraw.Draw(sh)
  sd.ellipse((43,158,155,175),fill=(15,50,37,44))
  im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(7)))
  d=ImageDraw.Draw(im)
  box=lambda xy,c,r=8:d.rounded_rectangle(xy,radius=r,fill=c)
  dot=lambda xy,c:d.ellipse(xy,fill=c)
  if w=='igloo':
    dot((30,45,161,173),'#d8eef8');d.pieslice((30,45,161,183),180,360,fill='#bde8f5')
    box((42,106,149,154),'#e8f9ff');dot((74,108,116,168),'#7699b0')
    d.arc((35,49,157,178),180,350,fill='#fff',width=5)
  elif w=='quilt':
    box((24,36,171,160),'#659abe',19)
    for y in range(3):
      for x in range(3):box((32+44*x,45+36*y,72+44*x,78+36*y),COLORS[(x+y*2)%5],7)
    d.line((26,40,165,151),fill='#fff7cf',width=4)
  elif w=='xylophone':
    for x in range(7):box((34+x*19,60+x*3,50+x*19,132),COLORS[x%5],5)
    d.line((34,152,155,68),fill='#8e623c',width=8);dot((143,58,163,80),'#e9b37e')
  elif w=='quail':
    dot((34,67,150,150),'#af8865');dot((85,40,153,108),'#d5ae7f')
    dot((130,65,140,75),'#1f2820');d.polygon([(146,81),(173,88),(146,99)],fill='#f4c969')
    d.arc((55,96,141,152),182,355,fill='#f5dfbe',width=9)
  elif w=='under':
    box((24,47,166,73),'#c2945e');box((42,69,54,164),'#95704c',5)
    box((139,69,151,164),'#95704c',5);dot((68,102,128,160),'#f5cf61')
    d.arc((73,115,125,153),2,175,fill='#ea937d',width=5)
  elif w=='engine':
    box((27,75,158,139),'#409eaf',12);box((101,51,147,91),'#deeff9')
    box((41,56,87,98),'#e5b66c')
    for x in [57,125]:dot((x-17,123,x+18,158),'#394a60');dot((x-9,131,x+9,149),'#c3e1e6')
  elif w=='lamp':
    d.polygon([(65,42),(126,42),(145,111),(48,111)],fill='#f5dc85')
    box((91,109,103,147),'#667f92',4);box((54,145,138,161),'#54778b')
    d.line((65,47,128,47),fill='#fff8da',width=6)
  elif w=='net':
    box((35,60,157,154),'#dce8f2')
    for x in range(42,157,14):d.line((x,64,x,154),fill='#7394a9',width=3)
    for y in range(67,154,14):d.line((38,y,155,y),fill='#7394a9',width=3)
    box((28,55,166,68),'#b78856')
  elif w=='vegetables':
    for x,c in [(56,'#ed955e'),(100,'#eac66e'),(137,'#76b87b')]:
      dot((x-23,84,x+18,147),c);d.polygon([(x-10,91),(x-1,51),(x+13,87)],fill='#479d68')
    d.arc((25,110,166,171),0,180,fill='#a5d69e',width=10)
  elif w=='yak':
    dot((30,70,158,150),'#715442');dot((89,60,166,129),'#947256')
    d.arc((75,35,114,87),170,350,fill='#e0ceb0',width=11)
    d.arc((143,34,181,91),190,365,fill='#e0ceb0',width=11)
    dot((129,86,142,98),'#27251e');dot((105,120,139,143),'#c7a47d')
    for x in (55,120):box((x,135,x+14,171),'#5c4234')
  elif w=='yogurt':
    d.polygon([(36,80),(161,80),(144,158),(54,158)],fill='#a2d9e8')
    dot((35,64,163,104),'#ecf9fc');dot((62,59,143,89),'#fffefa')
    dot((81,56,108,82),'#e88090');box((104,40,115,109),'#b7cede')
  elif w=='zoo':
    d.arc((27,23,166,161),180,360,fill='#83b987',width=15)
    box((35,92,157,157),'#9ed39d',15);dot((55,99,112,145),'#deb987')
    dot((100,84,157,140),'#a4bb7b');d.line((45,48,148,48),fill='#e9cb6e',width=10)
  elif w=='zipper':
    box((66,29,128,160),'#7abbdc',12)
    for y in range(41,151,14):box((89,y,104,y+9),'#ffe5a8',2)
    box((78,89,112,133),'#e8ae65');dot((89,97,103,110),'#fff5d9')
  elif w=='zero':
    font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',133)
    d.text((41,14),'0',font=font,fill='#b98448',stroke_width=5,stroke_fill='#a16a42')
    d.text((38,10),'0',font=font,fill='#f4d083',stroke_width=2,stroke_fill='#fff3c8')
  elif w=='jellyfish':
    dot((48,38,151,130),'#d89cdb');d.pieslice((48,37,151,157),180,360,fill='#d79fe5')
    d.arc((49,59,151,140),180,359,fill='#f3dcf7',width=7)
    for x in range(59,154,17):d.arc((x,112,x+18,170),0,180,fill='#a46fc3',width=6)
    dot((89,77,96,84),'#503a66');dot((112,77,119,84),'#503a66')
  return im
def fetch_art(g):
  key='-'.join(format(ord(c),'04x') for c in g)
  candidates=[key,key.replace('-fe0f',''),key+'-fe0f']
  for stem in dict.fromkeys(candidates):
    url='https://raw.githubusercontent.com/shuding/fluentui-emoji-unicode/main/assets/'+stem+'_3d.png'
    for attempt in range(2):
      try:
        request=urllib.request.Request(url,headers={'User-Agent':'RVUKids-AssetBuilder/1.0'})
        with urllib.request.urlopen(request,timeout=18) as response:raw=response.read(400000)
        return Image.open(io.BytesIO(raw)).convert('RGBA'),stem
      except urllib.error.HTTPError as ex:
        if ex.code==404:break
        if attempt:raise
      except Exception:
        if attempt:raise
        time.sleep(0.5)
  raise RuntimeError('Missing 3D illustration for '+g)
def main():
  js=(ROOT/'learn/learn.js').read_text(encoding='utf-8')
  match=re.search(r'(?m)^const AUDIO_ROWS=(\[\[.*\]\]);$',js)
  if not match:raise RuntimeError('Audio manifest rows not found')
  vocab={entry[2] for entry in json.loads(match.group(1)) if entry[0]=='word'}
  if len(vocab)!=101 or vocab!=(set(GLYPHS)|CUSTOM):
    raise RuntimeError('101-word manifest mismatch '+repr(vocab.symmetric_difference(set(GLYPHS)|CUSTOM)))
  OUT.mkdir(parents=True,exist_ok=True)
  records=[]
  for index,word in enumerate(sorted(vocab)):
    if word in CUSTOM:image=custom_art(word);kind='original'
    else:image,stem=fetch_art(GLYPHS[word]);kind='Fluent-3D:'+stem
    bound=image.getchannel('A').getbbox()
    if not bound:raise RuntimeError('Image is empty '+word)
    image=image.crop(bound);image.thumbnail((176,176),Image.Resampling.LANCZOS)
    output=Image.new('RGBA',(192,192),(0,0,0,0))
    output.alpha_composite(image,((192-image.width)//2,(192-image.height)//2))
    name=word.replace(' ','-')+'.webp'
    output.save(OUT/name,'WEBP',quality=84,method=6)
    check=Image.open(OUT/name)
    if check.mode!='RGBA' or check.size!=(192,192):raise RuntimeError('Invalid WebP '+name)
    size=(OUT/name).stat().st_size
    if not 300<size<80000:raise RuntimeError('Bad sticker size '+name+': '+str(size))
    records.append({'word':word,'file':name,'bytes':size,'artwork':kind})
    print(f'{index+1:3}/101 {word:17} {size:6}B {kind}',flush=True)
  (OUT/'manifest.json').write_text(json.dumps({'format':'transparent WebP 192x192','source':'Microsoft Fluent Emoji 3D (MIT), and RVU original pictograms','license':'https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE','items':records},indent=2,ensure_ascii=False)+'\n')
  print('All 101 transparent word illustrations generated.',flush=True)
if __name__=='__main__':main()
