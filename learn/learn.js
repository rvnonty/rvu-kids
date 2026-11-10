'use strict';
const C=window.RVU_CURRICULUM;
if(!C)throw Error('Curriculum unavailable');
const alphabet=C.alphabet,units=C.sentences;
const ALL_WORDS=alphabet.flatMap(lesson=>lesson.words);
const AUDIO_ROWS=[["letter-name","a","A","/assets/audio/female/000.mp3","/assets/audio/male/000.mp3"],["letter-sound","a","A","/assets/audio/female/001.mp3","/assets/audio/male/001.mp3"],["word","a","apple","/assets/audio/female/002.mp3","/assets/audio/male/002.mp3"],["word","a","ant","/assets/audio/female/003.mp3","/assets/audio/male/003.mp3"],["word","a","airplane","/assets/audio/female/004.mp3","/assets/audio/male/004.mp3"],["word","a","alligator","/assets/audio/female/005.mp3","/assets/audio/male/005.mp3"],["alphabet-sentence","a","I see an apple.","/assets/audio/female/006.mp3","/assets/audio/male/006.mp3"],["letter-name","b","B","/assets/audio/female/007.mp3","/assets/audio/male/007.mp3"],["letter-sound","b","B","/assets/audio/female/008.mp3","/assets/audio/male/008.mp3"],["word","b","ball","/assets/audio/female/009.mp3","/assets/audio/male/009.mp3"],["word","b","bear","/assets/audio/female/010.mp3","/assets/audio/male/010.mp3"],["word","b","banana","/assets/audio/female/011.mp3","/assets/audio/male/011.mp3"],["word","b","boat","/assets/audio/female/012.mp3","/assets/audio/male/012.mp3"],["alphabet-sentence","b","I see a ball.","/assets/audio/female/013.mp3","/assets/audio/male/013.mp3"],["letter-name","c","C","/assets/audio/female/014.mp3","/assets/audio/male/014.mp3"],["letter-sound","c","C","/assets/audio/female/015.mp3","/assets/audio/male/015.mp3"],["word","c","cat","/assets/audio/female/016.mp3","/assets/audio/male/016.mp3"],["word","c","car","/assets/audio/female/017.mp3","/assets/audio/male/017.mp3"],["word","c","cake","/assets/audio/female/018.mp3","/assets/audio/male/018.mp3"],["word","c","cup","/assets/audio/female/019.mp3","/assets/audio/male/019.mp3"],["alphabet-sentence","c","This is a cat.","/assets/audio/female/020.mp3","/assets/audio/male/020.mp3"],["letter-name","d","D","/assets/audio/female/021.mp3","/assets/audio/male/021.mp3"],["letter-sound","d","D","/assets/audio/female/022.mp3","/assets/audio/male/022.mp3"],["word","d","dog","/assets/audio/female/023.mp3","/assets/audio/male/023.mp3"],["word","d","duck","/assets/audio/female/024.mp3","/assets/audio/male/024.mp3"],["word","d","doll","/assets/audio/female/025.mp3","/assets/audio/male/025.mp3"],["word","d","door","/assets/audio/female/026.mp3","/assets/audio/male/026.mp3"],["alphabet-sentence","d","I see a dog.","/assets/audio/female/027.mp3","/assets/audio/male/027.mp3"],["letter-name","e","E","/assets/audio/female/028.mp3","/assets/audio/male/028.mp3"],["letter-sound","e","E","/assets/audio/female/029.mp3","/assets/audio/male/029.mp3"],["word","e","elephant","/assets/audio/female/030.mp3","/assets/audio/male/030.mp3"],["word","e","egg","/assets/audio/female/031.mp3","/assets/audio/male/031.mp3"],["word","e","ear","/assets/audio/female/032.mp3","/assets/audio/male/032.mp3"],["word","e","elbow","/assets/audio/female/033.mp3","/assets/audio/male/033.mp3"],["alphabet-sentence","e","This is an elephant.","/assets/audio/female/034.mp3","/assets/audio/male/034.mp3"],["letter-name","f","F","/assets/audio/female/035.mp3","/assets/audio/male/035.mp3"],["letter-sound","f","F","/assets/audio/female/036.mp3","/assets/audio/male/036.mp3"],["word","f","fish","/assets/audio/female/037.mp3","/assets/audio/male/037.mp3"],["word","f","frog","/assets/audio/female/038.mp3","/assets/audio/male/038.mp3"],["word","f","flower","/assets/audio/female/039.mp3","/assets/audio/male/039.mp3"],["word","f","fork","/assets/audio/female/040.mp3","/assets/audio/male/040.mp3"],["alphabet-sentence","f","I see a fish.","/assets/audio/female/041.mp3","/assets/audio/male/041.mp3"],["letter-name","g","G","/assets/audio/female/042.mp3","/assets/audio/male/042.mp3"],["letter-sound","g","G","/assets/audio/female/043.mp3","/assets/audio/male/043.mp3"],["word","g","goat","/assets/audio/female/044.mp3","/assets/audio/male/044.mp3"],["word","g","grapes","/assets/audio/female/045.mp3","/assets/audio/male/045.mp3"],["word","g","gift","/assets/audio/female/046.mp3","/assets/audio/male/046.mp3"],["word","g","guitar","/assets/audio/female/047.mp3","/assets/audio/male/047.mp3"],["alphabet-sentence","g","This is a goat.","/assets/audio/female/048.mp3","/assets/audio/male/048.mp3"],["letter-name","h","H","/assets/audio/female/049.mp3","/assets/audio/male/049.mp3"],["letter-sound","h","H","/assets/audio/female/050.mp3","/assets/audio/male/050.mp3"],["word","h","hat","/assets/audio/female/051.mp3","/assets/audio/male/051.mp3"],["word","h","house","/assets/audio/female/052.mp3","/assets/audio/male/052.mp3"],["word","h","horse","/assets/audio/female/053.mp3","/assets/audio/male/053.mp3"],["word","h","hand","/assets/audio/female/054.mp3","/assets/audio/male/054.mp3"],["alphabet-sentence","h","I see a hat.","/assets/audio/female/055.mp3","/assets/audio/male/055.mp3"],["letter-name","i","I","/assets/audio/female/056.mp3","/assets/audio/male/056.mp3"],["letter-sound","i","I","/assets/audio/female/057.mp3","/assets/audio/male/057.mp3"],["word","i","island","/assets/audio/female/058.mp3","/assets/audio/male/058.mp3"],["word","i","iguana","/assets/audio/female/059.mp3","/assets/audio/male/059.mp3"],["word","i","ice cream","/assets/audio/female/060.mp3","/assets/audio/male/060.mp3"],["word","i","insect","/assets/audio/female/061.mp3","/assets/audio/male/061.mp3"],["alphabet-sentence","i","I see an iguana.","/assets/audio/female/062.mp3","/assets/audio/male/062.mp3"],["letter-name","j","J","/assets/audio/female/063.mp3","/assets/audio/male/063.mp3"],["letter-sound","j","J","/assets/audio/female/064.mp3","/assets/audio/male/064.mp3"],["word","j","juice","/assets/audio/female/065.mp3","/assets/audio/male/065.mp3"],["word","j","jacket","/assets/audio/female/066.mp3","/assets/audio/male/066.mp3"],["word","j","jellyfish","/assets/audio/female/067.mp3","/assets/audio/male/067.mp3"],["word","j","jam","/assets/audio/female/068.mp3","/assets/audio/male/068.mp3"],["alphabet-sentence","j","This is a jacket.","/assets/audio/female/069.mp3","/assets/audio/male/069.mp3"],["letter-name","k","K","/assets/audio/female/070.mp3","/assets/audio/male/070.mp3"],["letter-sound","k","K","/assets/audio/female/071.mp3","/assets/audio/male/071.mp3"],["word","k","kite","/assets/audio/female/072.mp3","/assets/audio/male/072.mp3"],["word","k","key","/assets/audio/female/073.mp3","/assets/audio/male/073.mp3"],["word","k","kitten","/assets/audio/female/074.mp3","/assets/audio/male/074.mp3"],["word","k","kangaroo","/assets/audio/female/075.mp3","/assets/audio/male/075.mp3"],["alphabet-sentence","k","I see a kite.","/assets/audio/female/076.mp3","/assets/audio/male/076.mp3"],["letter-name","l","L","/assets/audio/female/077.mp3","/assets/audio/male/077.mp3"],["letter-sound","l","L","/assets/audio/female/078.mp3","/assets/audio/male/078.mp3"],["word","l","lion","/assets/audio/female/079.mp3","/assets/audio/male/079.mp3"],["word","l","lemon","/assets/audio/female/080.mp3","/assets/audio/male/080.mp3"],["word","l","leaf","/assets/audio/female/081.mp3","/assets/audio/male/081.mp3"],["word","l","lamp","/assets/audio/female/082.mp3","/assets/audio/male/082.mp3"],["alphabet-sentence","l","This is a lion.","/assets/audio/female/083.mp3","/assets/audio/male/083.mp3"],["letter-name","m","M","/assets/audio/female/084.mp3","/assets/audio/male/084.mp3"],["letter-sound","m","M","/assets/audio/female/085.mp3","/assets/audio/male/085.mp3"],["word","m","moon","/assets/audio/female/086.mp3","/assets/audio/male/086.mp3"],["word","m","milk","/assets/audio/female/087.mp3","/assets/audio/male/087.mp3"],["word","m","monkey","/assets/audio/female/088.mp3","/assets/audio/male/088.mp3"],["word","m","mouse","/assets/audio/female/089.mp3","/assets/audio/male/089.mp3"],["alphabet-sentence","m","This is a monkey.","/assets/audio/female/090.mp3","/assets/audio/male/090.mp3"],["letter-name","n","N","/assets/audio/female/091.mp3","/assets/audio/male/091.mp3"],["letter-sound","n","N","/assets/audio/female/092.mp3","/assets/audio/male/092.mp3"],["word","n","nest","/assets/audio/female/093.mp3","/assets/audio/male/093.mp3"],["word","n","nose","/assets/audio/female/094.mp3","/assets/audio/male/094.mp3"],["word","n","net","/assets/audio/female/095.mp3","/assets/audio/male/095.mp3"],["word","n","night","/assets/audio/female/096.mp3","/assets/audio/male/096.mp3"],["alphabet-sentence","n","I see a nest.","/assets/audio/female/097.mp3","/assets/audio/male/097.mp3"],["letter-name","o","O","/assets/audio/female/098.mp3","/assets/audio/male/098.mp3"],["letter-sound","o","O","/assets/audio/female/099.mp3","/assets/audio/male/099.mp3"],["word","o","orange","/assets/audio/female/100.mp3","/assets/audio/male/100.mp3"],["word","o","octopus","/assets/audio/female/101.mp3","/assets/audio/male/101.mp3"],["word","o","ocean","/assets/audio/female/102.mp3","/assets/audio/male/102.mp3"],["word","o","otter","/assets/audio/female/103.mp3","/assets/audio/male/103.mp3"],["alphabet-sentence","o","I see an octopus.","/assets/audio/female/104.mp3","/assets/audio/male/104.mp3"],["letter-name","p","P","/assets/audio/female/105.mp3","/assets/audio/male/105.mp3"],["letter-sound","p","P","/assets/audio/female/106.mp3","/assets/audio/male/106.mp3"],["word","p","pig","/assets/audio/female/107.mp3","/assets/audio/male/107.mp3"],["word","p","pen","/assets/audio/female/108.mp3","/assets/audio/male/108.mp3"],["word","p","pizza","/assets/audio/female/109.mp3","/assets/audio/male/109.mp3"],["word","p","panda","/assets/audio/female/110.mp3","/assets/audio/male/110.mp3"],["alphabet-sentence","p","This is a panda.","/assets/audio/female/111.mp3","/assets/audio/male/111.mp3"],["letter-name","q","Q","/assets/audio/female/112.mp3","/assets/audio/male/112.mp3"],["letter-sound","q","Q","/assets/audio/female/113.mp3","/assets/audio/male/113.mp3"],["word","q","queen","/assets/audio/female/114.mp3","/assets/audio/male/114.mp3"],["word","q","quilt","/assets/audio/female/115.mp3","/assets/audio/male/115.mp3"],["word","q","quail","/assets/audio/female/116.mp3","/assets/audio/male/116.mp3"],["alphabet-sentence","q","This is a queen.","/assets/audio/female/117.mp3","/assets/audio/male/117.mp3"],["letter-name","r","R","/assets/audio/female/118.mp3","/assets/audio/male/118.mp3"],["letter-sound","r","R","/assets/audio/female/119.mp3","/assets/audio/male/119.mp3"],["word","r","rabbit","/assets/audio/female/120.mp3","/assets/audio/male/120.mp3"],["word","r","robot","/assets/audio/female/121.mp3","/assets/audio/male/121.mp3"],["word","r","rain","/assets/audio/female/122.mp3","/assets/audio/male/122.mp3"],["word","r","rainbow","/assets/audio/female/123.mp3","/assets/audio/male/123.mp3"],["alphabet-sentence","r","I see a rainbow.","/assets/audio/female/124.mp3","/assets/audio/male/124.mp3"],["letter-name","s","S","/assets/audio/female/125.mp3","/assets/audio/male/125.mp3"],["letter-sound","s","S","/assets/audio/female/126.mp3","/assets/audio/male/126.mp3"],["word","s","sun","/assets/audio/female/127.mp3","/assets/audio/male/127.mp3"],["word","s","star","/assets/audio/female/128.mp3","/assets/audio/male/128.mp3"],["word","s","sock","/assets/audio/female/129.mp3","/assets/audio/male/129.mp3"],["word","s","spoon","/assets/audio/female/130.mp3","/assets/audio/male/130.mp3"],["alphabet-sentence","s","This is a star.","/assets/audio/female/131.mp3","/assets/audio/male/131.mp3"],["letter-name","t","T","/assets/audio/female/132.mp3","/assets/audio/male/132.mp3"],["letter-sound","t","T","/assets/audio/female/133.mp3","/assets/audio/male/133.mp3"],["word","t","tiger","/assets/audio/female/134.mp3","/assets/audio/male/134.mp3"],["word","t","train","/assets/audio/female/135.mp3","/assets/audio/male/135.mp3"],["word","t","tree","/assets/audio/female/136.mp3","/assets/audio/male/136.mp3"],["word","t","turtle","/assets/audio/female/137.mp3","/assets/audio/male/137.mp3"],["alphabet-sentence","t","I see a train.","/assets/audio/female/138.mp3","/assets/audio/male/138.mp3"],["letter-name","u","U","/assets/audio/female/139.mp3","/assets/audio/male/139.mp3"],["letter-sound","u","U","/assets/audio/female/140.mp3","/assets/audio/male/140.mp3"],["word","u","umbrella","/assets/audio/female/141.mp3","/assets/audio/male/141.mp3"],["word","u","uncle","/assets/audio/female/142.mp3","/assets/audio/male/142.mp3"],["word","u","up","/assets/audio/female/143.mp3","/assets/audio/male/143.mp3"],["word","u","under","/assets/audio/female/144.mp3","/assets/audio/male/144.mp3"],["alphabet-sentence","u","This is an umbrella.","/assets/audio/female/145.mp3","/assets/audio/male/145.mp3"],["letter-name","v","V","/assets/audio/female/146.mp3","/assets/audio/male/146.mp3"],["letter-sound","v","V","/assets/audio/female/147.mp3","/assets/audio/male/147.mp3"],["word","v","van","/assets/audio/female/148.mp3","/assets/audio/male/148.mp3"],["word","v","vase","/assets/audio/female/149.mp3","/assets/audio/male/149.mp3"],["word","v","violin","/assets/audio/female/150.mp3","/assets/audio/male/150.mp3"],["word","v","vegetables","/assets/audio/female/151.mp3","/assets/audio/male/151.mp3"],["alphabet-sentence","v","This is a van.","/assets/audio/female/152.mp3","/assets/audio/male/152.mp3"],["letter-name","w","W","/assets/audio/female/153.mp3","/assets/audio/male/153.mp3"],["letter-sound","w","W","/assets/audio/female/154.mp3","/assets/audio/male/154.mp3"],["word","w","whale","/assets/audio/female/155.mp3","/assets/audio/male/155.mp3"],["word","w","watermelon","/assets/audio/female/156.mp3","/assets/audio/male/156.mp3"],["word","w","window","/assets/audio/female/157.mp3","/assets/audio/male/157.mp3"],["word","w","watch","/assets/audio/female/158.mp3","/assets/audio/male/158.mp3"],["alphabet-sentence","w","I see a whale.","/assets/audio/female/159.mp3","/assets/audio/male/159.mp3"],["letter-name","x","X","/assets/audio/female/160.mp3","/assets/audio/male/160.mp3"],["letter-sound","x","X","/assets/audio/female/161.mp3","/assets/audio/male/161.mp3"],["word","x","x-ray","/assets/audio/female/162.mp3","/assets/audio/male/162.mp3"],["word","x","xylophone","/assets/audio/female/163.mp3","/assets/audio/male/163.mp3"],["alphabet-sentence","x","This is an x-ray.","/assets/audio/female/164.mp3","/assets/audio/male/164.mp3"],["alphabet-sentence","x","This is a xylophone.","/assets/audio/female/165.mp3","/assets/audio/male/165.mp3"],["letter-name","y","Y","/assets/audio/female/166.mp3","/assets/audio/male/166.mp3"],["letter-sound","y","Y","/assets/audio/female/167.mp3","/assets/audio/male/167.mp3"],["word","y","yo-yo","/assets/audio/female/168.mp3","/assets/audio/male/168.mp3"],["word","y","yogurt","/assets/audio/female/169.mp3","/assets/audio/male/169.mp3"],["word","y","yellow","/assets/audio/female/170.mp3","/assets/audio/male/170.mp3"],["word","y","yak","/assets/audio/female/171.mp3","/assets/audio/male/171.mp3"],["alphabet-sentence","y","This is a yo-yo.","/assets/audio/female/172.mp3","/assets/audio/male/172.mp3"],["letter-name","z","Z","/assets/audio/female/173.mp3","/assets/audio/male/173.mp3"],["letter-sound","z","Z","/assets/audio/female/174.mp3","/assets/audio/male/174.mp3"],["word","z","zebra","/assets/audio/female/175.mp3","/assets/audio/male/175.mp3"],["word","z","zoo","/assets/audio/female/176.mp3","/assets/audio/male/176.mp3"],["word","z","zipper","/assets/audio/female/177.mp3","/assets/audio/male/177.mp3"],["word","z","zero","/assets/audio/female/178.mp3","/assets/audio/male/178.mp3"],["alphabet-sentence","z","This is a zebra.","/assets/audio/female/179.mp3","/assets/audio/male/179.mp3"],["everyday-sentence","feelings","I'm happy.","/assets/audio/female/180.mp3","/assets/audio/male/180.mp3"],["everyday-sentence","feelings","I'm sad.","/assets/audio/female/181.mp3","/assets/audio/male/181.mp3"],["everyday-sentence","feelings","I'm angry.","/assets/audio/female/182.mp3","/assets/audio/male/182.mp3"],["everyday-sentence","feelings","I'm scared.","/assets/audio/female/183.mp3","/assets/audio/male/183.mp3"],["everyday-sentence","hungry","I'm hungry.","/assets/audio/female/184.mp3","/assets/audio/male/184.mp3"],["everyday-sentence","hungry","Can I have a snack, please?","/assets/audio/female/185.mp3","/assets/audio/male/185.mp3"],["everyday-sentence","thirsty","I'm thirsty.","/assets/audio/female/186.mp3","/assets/audio/male/186.mp3"],["everyday-sentence","thirsty","Can I have some water, please?","/assets/audio/female/187.mp3","/assets/audio/male/187.mp3"],["everyday-sentence","bathroom","I need to go to the bathroom.","/assets/audio/female/188.mp3","/assets/audio/male/188.mp3"],["everyday-sentence","bathroom","Can I go to the bathroom, please?","/assets/audio/female/189.mp3","/assets/audio/male/189.mp3"],["everyday-sentence","bathroom","I wash my hands.","/assets/audio/female/190.mp3","/assets/audio/male/190.mp3"],["everyday-sentence","my-family","This is my family.","/assets/audio/female/191.mp3","/assets/audio/male/191.mp3"],["everyday-sentence","my-family","This is my mom.","/assets/audio/female/192.mp3","/assets/audio/male/192.mp3"],["everyday-sentence","my-family","This is my dad.","/assets/audio/female/193.mp3","/assets/audio/male/193.mp3"],["everyday-sentence","my-family","This is my brother.","/assets/audio/female/194.mp3","/assets/audio/male/194.mp3"],["everyday-sentence","my-family","This is my sister.","/assets/audio/female/195.mp3","/assets/audio/male/195.mp3"],["everyday-sentence","hello-about-me","Hello!","/assets/audio/female/196.mp3","/assets/audio/male/196.mp3"],["everyday-sentence","hello-about-me","My name is ______.","/assets/audio/female/197.mp3","/assets/audio/male/197.mp3"],["everyday-sentence","hello-about-me","What's your name?","/assets/audio/female/198.mp3","/assets/audio/male/198.mp3"],["everyday-sentence","hello-about-me","Goodbye!","/assets/audio/female/199.mp3","/assets/audio/male/199.mp3"],["everyday-sentence","at-school","I'm at school.","/assets/audio/female/200.mp3","/assets/audio/male/200.mp3"],["everyday-sentence","at-school","This is my teacher.","/assets/audio/female/201.mp3","/assets/audio/male/201.mp3"],["everyday-sentence","at-school","I have a book.","/assets/audio/female/202.mp3","/assets/audio/male/202.mp3"],["everyday-sentence","at-school","I have a pencil.","/assets/audio/female/203.mp3","/assets/audio/male/203.mp3"],["everyday-sentence","can-i-have","Can I have _____, please?","/assets/audio/female/204.mp3","/assets/audio/male/204.mp3"],["everyday-sentence","can-i-have","Can I have the ball, please?","/assets/audio/female/205.mp3","/assets/audio/male/205.mp3"],["everyday-sentence","can-i-have","Can I have the book, please?","/assets/audio/female/206.mp3","/assets/audio/male/206.mp3"],["everyday-sentence","can-i-have","Can I have some water, please?","/assets/audio/female/207.mp3","/assets/audio/male/207.mp3"],["everyday-sentence","likes-and-dislikes","I like pizza.","/assets/audio/female/208.mp3","/assets/audio/male/208.mp3"],["everyday-sentence","likes-and-dislikes","I like bananas.","/assets/audio/female/209.mp3","/assets/audio/male/209.mp3"],["everyday-sentence","likes-and-dislikes","I don't like milk.","/assets/audio/female/210.mp3","/assets/audio/male/210.mp3"],["everyday-sentence","likes-and-dislikes","I don't like yogurt.","/assets/audio/female/211.mp3","/assets/audio/male/211.mp3"],["everyday-sentence","can-you-help","Can you help me, please?","/assets/audio/female/212.mp3","/assets/audio/male/212.mp3"],["everyday-sentence","can-you-help","I don't understand.","/assets/audio/female/213.mp3","/assets/audio/male/213.mp3"],["everyday-sentence","can-you-help","Say it again, please.","/assets/audio/female/214.mp3","/assets/audio/male/214.mp3"],["everyday-sentence","can-you-help","Please open the box.","/assets/audio/female/215.mp3","/assets/audio/male/215.mp3"],["everyday-sentence","can-you-help","Please close the door.","/assets/audio/female/216.mp3","/assets/audio/male/216.mp3"],["everyday-sentence","polite-words","Please.","/assets/audio/female/217.mp3","/assets/audio/male/217.mp3"],["everyday-sentence","polite-words","Thank you.","/assets/audio/female/218.mp3","/assets/audio/male/218.mp3"],["everyday-sentence","polite-words","I'm sorry.","/assets/audio/female/219.mp3","/assets/audio/male/219.mp3"],["everyday-sentence","polite-words","Excuse me.","/assets/audio/female/220.mp3","/assets/audio/male/220.mp3"],["everyday-sentence","polite-words","You're welcome.","/assets/audio/female/221.mp3","/assets/audio/male/221.mp3"],["everyday-sentence","lets-play","Let's play.","/assets/audio/female/222.mp3","/assets/audio/male/222.mp3"],["everyday-sentence","lets-play","Can I play with you?","/assets/audio/female/223.mp3","/assets/audio/male/223.mp3"],["everyday-sentence","lets-play","My turn.","/assets/audio/female/224.mp3","/assets/audio/male/224.mp3"],["everyday-sentence","lets-play","Your turn.","/assets/audio/female/225.mp3","/assets/audio/male/225.mp3"],["everyday-sentence","lets-play","Let's share.","/assets/audio/female/226.mp3","/assets/audio/male/226.mp3"],["everyday-sentence","my-body","My head hurts.","/assets/audio/female/227.mp3","/assets/audio/male/227.mp3"],["everyday-sentence","my-body","My tummy hurts.","/assets/audio/female/228.mp3","/assets/audio/male/228.mp3"],["everyday-sentence","my-body","My hand hurts.","/assets/audio/female/229.mp3","/assets/audio/male/229.mp3"],["everyday-sentence","my-body","I'm tired.","/assets/audio/female/230.mp3","/assets/audio/male/230.mp3"],["everyday-sentence","my-body","I'm sick.","/assets/audio/female/231.mp3","/assets/audio/male/231.mp3"],["everyday-sentence","daily-routine","I wake up.","/assets/audio/female/232.mp3","/assets/audio/male/232.mp3"],["everyday-sentence","daily-routine","I brush my teeth.","/assets/audio/female/233.mp3","/assets/audio/male/233.mp3"],["everyday-sentence","daily-routine","I get dressed.","/assets/audio/female/234.mp3","/assets/audio/male/234.mp3"],["everyday-sentence","daily-routine","I eat breakfast.","/assets/audio/female/235.mp3","/assets/audio/male/235.mp3"],["everyday-sentence","daily-routine","I go to school.","/assets/audio/female/236.mp3","/assets/audio/male/236.mp3"],["everyday-sentence","daily-routine","I go to bed.","/assets/audio/female/237.mp3","/assets/audio/male/237.mp3"],["everyday-sentence","stay-safe","Stop.","/assets/audio/female/238.mp3","/assets/audio/male/238.mp3"],["everyday-sentence","stay-safe","Wait.","/assets/audio/female/239.mp3","/assets/audio/male/239.mp3"],["everyday-sentence","stay-safe","No, thank you.","/assets/audio/female/240.mp3","/assets/audio/male/240.mp3"],["everyday-sentence","stay-safe","Help me, please.","/assets/audio/female/241.mp3","/assets/audio/male/241.mp3"],["everyday-sentence","stay-safe","I need my mom.","/assets/audio/female/242.mp3","/assets/audio/male/242.mp3"],["everyday-sentence","stay-safe","I need my dad.","/assets/audio/female/243.mp3","/assets/audio/male/243.mp3"]];
const icons={
apple:'🍎',ant:'🐜',airplane:'✈️',alligator:'🐊',ball:'⚽',bear:'🐻',banana:'🍌',boat:'⛵',
cat:'🐱',car:'🚗',cake:'🎂',cup:'🥤',dog:'🐶',duck:'🦆',doll:'🪆',door:'🚪',
elephant:'🐘',egg:'🥚',ear:'👂',elbow:'💪',fish:'🐟',frog:'🐸',flower:'🌻',fork:'🍴',
goat:'🐐',grapes:'🍇',gift:'🎁',guitar:'🎸',hat:'👒',house:'🏠',horse:'🐴',hand:'✋',
island:'🏝️',iguana:'🦎','ice cream':'🍦',insect:'🐞',juice:'🧃',jacket:'🧥',jellyfish:'🪼',jam:'🍯',
kite:'🪁',key:'🔑',kitten:'🐈',kangaroo:'🦘',lion:'🦁',lemon:'🍋',leaf:'🍃',lamp:'💡',
moon:'🌙',milk:'🥛',monkey:'🐒',mouse:'🐁',nest:'🪺',nose:'👃',net:'🥅',night:'🌌',
orange:'🍊',octopus:'🐙',ocean:'🌊',otter:'🦦',pig:'🐷',pen:'🖊️',pizza:'🍕',panda:'🐼',
queen:'👑',quilt:'🧵',quail:'',rabbit:'🐇',robot:'🤖',rain:'🌧️',rainbow:'🌈',
sun:'☀️',star:'⭐',sock:'🧦',spoon:'🥄',tiger:'🐯',train:'🚂',tree:'🌳',turtle:'🐢',
umbrella:'☂️',uncle:'',up:'⬆️',under:'⬇️',van:'🚐',vase:'🏺',violin:'🎻',vegetables:'🥦',
whale:'🐳',watermelon:'🍉',window:'🪟',watch:'⌚','x-ray':'🩻',xylophone:'', 'yo-yo':'🪀',
yogurt:'🥣',yellow:'🟡',yak:'',zebra:'🦓',zoo:'',zipper:'🤐',zero:'0️⃣',
bathroom:'🚻',wash:'🫧',hands:'👐',family:'👨‍👩‍👧‍👦',mom:'👩',dad:'👨',
brother:'👦',sister:'👧',teacher:'👩‍🏫',book:'📖',pencil:'✏️',school:'🏫',water:'💧'
};
const i18n={
ar:{hub:'التعلّم',preview:'المعاينة',book:'الكتاب',listen:'الاستماع',alph:'الحروف والكلمات',sent:'Everyday English — الجمل',words:'كلمات الدرس',sentences:'جمل الدرس',pages:'أرقام الصفحات المطبوعة في الكتاب',say:'اسم الحرف في الكتاب',sound:'صوت الحرف',hint:'اسم الحرف مختلف عن صوته، اسمع الاتنين.',remember:'اختبار صغير',question:'اضغط على الكلمة المطلوبة',correct:'إجابة صحيحة!',retry:'جرّب تاني',next:'التالي',prev:'السابق',all:'كل الحروف',allSent:'كل الوحدات',buy:'اطلب الكتاب',practice:'شوف واسمع وكرر مع ولي الأمر',learn:'مكتبة التعلّم',units:'الوحدات',previewPages:'صفحات مختارة',live:'المحتوى مطابق للمنهج المعتمد',learning:'اتعلّم مع كتابك',childHint:'استخدم الصور مع الكتاب الأصلي لتثبيت معنى الكلمات.',sample:'لمن يشاهد النموذج فقط',castWelcome:'صحابك في مغامرة التعلّم!',more:'افتح الوحدة التالية',begin:'ابدأ',switch:'English'},
en:{hub:'Learning Hub',preview:'Preview',book:'The Book',listen:'Audio',alph:'Alphabet & Words',sent:'Everyday English — Sentences',words:'Lesson Words',sentences:'Target Sentences',pages:'Printed page numbers in your book',say:'Letter name in the book',sound:'Letter sound',hint:'The letter name is different from its phonics sound. Listen to both.',remember:'A little word check',question:'Choose the requested word',correct:'Well done!',retry:'Try again',next:'Next',prev:'Previous',all:'All letters',allSent:'All units',buy:'Order the Book',practice:'Look, say and practice with a parent',learn:'Learning Hub',units:'Units',previewPages:'Selected pages',live:'Matches the approved curriculum',learning:'Learn alongside your book',childHint:'Use the illustrations alongside the printed book to learn each word.',sample:'Preview only',castWelcome:'Your friends on every adventure!',more:'Open the next lesson',begin:'Start',switch:'العربية'}
};
const getParam=new URLSearchParams(location.search).get('lang');
let lang=getParam==='en'||getParam==='ar'?getParam:(sessionStorage.getItem('rvu-lang')||'ar');
sessionStorage.setItem('rvu-lang',lang);
const t=k=>i18n[lang][k]||k;
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
function link(url,text,cls){const a=el('a',cls,text);a.href=url;return a}
function renderNavLang(){
 const nav=document.querySelector('.sitebar nav');if(!nav)return;
 const sw=el('button','lang-switch',t('switch'));sw.type='button';sw.setAttribute('aria-label',lang==='ar'?'Switch to English':'التغيير إلى العربية');sw.addEventListener('click',()=>{const next=lang==='ar'?'en':'ar';sessionStorage.setItem('rvu-lang',next);const url=new URL(location.href);url.searchParams.set('lang',next);location.assign(url.href)});nav.append(sw);
 document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 const v=nav.querySelectorAll('a');
 if(v.length>=3){v[0].textContent=t('hub');v[1].textContent=t('preview');v[2].textContent=t('book')}
}
function urlLetter(a){return '/learn/alphabet/'+a.id+'/'}
function urlUnit(u){return '/learn/sentences/'+u.id+'/'}
function escaped(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function cardLetter(a){
 const z=link(urlLetter(a),undefined,'tile-letter');z.innerHTML='<strong>'+a.letter+'</strong><small>'+a.letter.toLowerCase()+'</small>';z.setAttribute('aria-label','Letter '+a.letter);return z
}
function printedPages(pages){return pages.map(page=>page-3)}
function cardUnit(u,i){
 const a=link(urlUnit(u),undefined,'unit-card');a.innerHTML='<small>UNIT '+String(i+1).padStart(2,'0')+' · '+(lang==='ar'?'صفحات ':'PAGES ')+printedPages(u.pages).join('–')+'</small><h3 dir="ltr" lang="en">'+escaped(u.title)+'</h3><p>'+escaped(lang==='ar'?u.titleAr:'A lesson from your book')+'</p><span class="tile-arrow">↗</span>';return a;
}
function hub(){
 const grid=document.querySelector('#letter-grid');if(grid){grid.replaceChildren();alphabet.forEach(a=>grid.append(cardLetter(a)))}
 const unitsGrid=document.querySelector('#unit-grid');if(unitsGrid){unitsGrid.replaceChildren();units.forEach((u,i)=>unitsGrid.append(cardUnit(u,i)))}
}

const illustratedWords=new Set(ALL_WORDS);
const voiceRows=new Map(AUDIO_ROWS.map(r=>[r[0]+'|'+r[1]+'|'+r[2],r.slice(3)]));
const REPORTED_WRONG_WORD_AUDIO=new Set(['fish','fork']); // protect children until reviewed
let preferredVoice=localStorage.getItem('rvu-voice')==='male'?'male':'female';
let currentAudio=null;
function voicePicker(){
 const section=el('section','voice-picker');
 section.append(el('span','voice-label',lang==='ar'?'اختار الصوت':'Choose voice'));
 [['female','👧 بنت','👧 Girl'],['male','👦 ولد','👦 Boy']].forEach(([id,ar,en])=>{
  const b=el('button','voice-choice',lang==='ar'?ar:en);b.type='button';b.dataset.voice=id;
  b.setAttribute('aria-pressed',String(preferredVoice===id));
  b.addEventListener('click',()=>{preferredVoice=id;localStorage.setItem('rvu-voice',id);
   if(currentAudio){currentAudio.pause();currentAudio=null}
   document.querySelectorAll('[data-voice]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.voice===id)));
  });section.append(b)
 });return section;
}
function playButton(type,lesson,value){
 const urls=voiceRows.get(type+'|'+lesson+'|'+value);if(!urls)return null;
 const b=el('button','audio-play',lang==='ar'?'🔊 اسمع':'🔊 Listen');b.type='button';
 b.setAttribute('aria-label',(lang==='ar'?'استمع إلى ':'Listen to ')+value);
 b.addEventListener('click',()=>{
   if(currentAudio){currentAudio.pause();currentAudio=null}
   if(type==='word'&&REPORTED_WRONG_WORD_AUDIO.has(value)){
     b.textContent=lang==='ar'?'النطق قيد التصحيح':'Pronunciation being corrected';
     b.setAttribute('aria-label',b.textContent+' — '+value);
     return;
   }
   const url=urls[preferredVoice==='male'?1:0];
   const player=new Audio(url);player.preload='none';currentAudio=player;b.classList.add('audio-playing');
   const restore=()=>b.classList.remove('audio-playing');
   player.addEventListener('ended',restore,{once:true});player.addEventListener('error',restore,{once:true});
   player.play().catch(()=>{restore();b.textContent=lang==='ar'?'جرّب تاني':'Retry audio'});
 });
 return b;
}
function renderWordCard(word,lesson,i){
 const card=el('article','word-card');
 const zoom=el('button','word-zoom');zoom.type='button';
 zoom.setAttribute('aria-label',(lang==='ar'?'تكبير صورة ':'Enlarge picture of ')+word);
 zoom.setAttribute('aria-pressed','false');zoom.append(wordVisual(word));
 zoom.addEventListener('click',()=>{const enlarged=zoom.classList.toggle('zoomed');zoom.setAttribute('aria-pressed',String(enlarged))});
 card.append(zoom);
 const label=el('strong','english-word',word);label.lang='en';label.dir='ltr';card.append(label);
 const play=playButton('word',lesson,word);if(play)card.append(play);
 card.append(el('span','word-counter',String(i+1).padStart(2,'0')));
 return card;
}
function wordLibrary(){
 const root=document.getElementById('word-library');if(!root)return;
 root.replaceChildren(
  el('h1',null,lang==='ar'?'كلمات الكتاب حسب الصفحات والحروف':'Book words by page and letter'),
  el('p','word-help',lang==='ar'?'كل صفحتين متقابلتين لهما نفس كلمات الحرف. اختار حرف أو رقم أي صفحة من الصفحتين علشان تسمع الكلمات وتشوف صورها.':'Facing pages share one set of letter words. Choose a letter or either printed page number to view its vocabulary.'),
  voicePicker()
 );
 const picker=el('section','spread-picker');
 const control=el('div','spread-controls');
 const letterControl=el('label','spread-field');
 letterControl.append(el('span',null,lang==='ar'?'اختار الحرف والصفحتين':'Choose letter and facing pages'));
 const letterSelect=el('select','spread-select');
 letterSelect.id='letter-spread-select';
 for(const item of alphabet){
  const option=el('option',null,(lang==='ar'?'حرف ':'Letter ')+item.letter+' — '+(lang==='ar'?'صفحتا ':'Pages ')+printedPages(item.pages).join('–'));
  option.value=item.id;letterSelect.append(option);
 }
 letterControl.append(letterSelect);control.append(letterControl);
 const numberControl=el('label','spread-field');
 numberControl.append(el('span',null,lang==='ar'?'أو اكتب رقم الصفحة':'Or enter a page number'));
 const pageInput=el('input','spread-page-number');pageInput.type='number';
 pageInput.min='1';pageInput.max='52';pageInput.step='1';pageInput.inputMode='numeric';
 pageInput.id='printed-page-input';pageInput.placeholder='1–52';
 numberControl.append(pageInput);control.append(numberControl);
 const go=el('button','spread-go',lang==='ar'?'اعرض الصفحة':'Show page');go.type='button';control.append(go);
 picker.append(control);
 const message=el('p','spread-message');message.setAttribute('role','status');message.setAttribute('aria-live','polite');picker.append(message);
 const letters=el('div','spread-letter-tiles');
 letters.setAttribute('aria-label',lang==='ar'?'اختيار سريع للحروف':'Quick letter selection');
 const tiles=new Map();
 for(const item of alphabet){
  const b=el('button','spread-letter-button');
  b.type='button';b.dataset.letter=item.id;
  b.append(el('strong',null,item.letter),el('small',null,printedPages(item.pages).join('–')));
  b.setAttribute('aria-label',(lang==='ar'?'حرف ':'Letter ')+item.letter+' — '+(lang==='ar'?'صفحتا ':'Pages ')+printedPages(item.pages).join(' و '));
  letters.append(b);tiles.set(item.id,b);
 }
 picker.append(letters);root.append(picker);
 const display=el('section','spread-result');display.id='selected-book-spread';root.append(display);
 const initialHash=()=>decodeURIComponent(location.hash.replace(/^#/,'')).toLowerCase();
 function showSpread(id,changeHash=true){
  const item=alphabet.find(a=>a.id===id);if(!item)return;
  const pages=printedPages(item.pages);
  letterSelect.value=item.id;
  pageInput.value=String(pages[0]);
  message.textContent='';
  for(const [key,b] of tiles)b.setAttribute('aria-pressed',String(key===id));
  display.replaceChildren();
  const heading=el('h2','spread-title',(lang==='ar'?'حرف ':'Letter ')+item.letter+' — '+(lang==='ar'?'الصفحتان ':'Pages ')+pages.join('–'));
  heading.id='spread-heading';display.append(heading);
  const info=el('p','spread-intro',lang==='ar'?'الكلمات الموجودة في الصفحتين '+pages.join(' و ')+':':'Vocabulary shared by pages '+pages.join(' & ')+':');
  display.append(info);
  const grid=el('div','word-grid library-grid');
  item.words.forEach((word,i)=>grid.append(renderWordCard(word,item.id,i)));
  display.append(grid);
  const lesson=link(urlLetter(item),lang==='ar'?'افتح درس حرف '+item.letter+' كاملًا':'Open the complete '+item.letter+' lesson','spread-lesson-link');
  display.append(lesson);
  if(changeHash)history.replaceState(null,'','#letter-'+item.id);
 }
 letterSelect.addEventListener('change',()=>showSpread(letterSelect.value));
 for(const item of alphabet)tiles.get(item.id).addEventListener('click',()=>showSpread(item.id));
 function selectByPage(){
  const n=Number(pageInput.value);
  const item=alphabet.find(a=>printedPages(a.pages).includes(n));
  if(!Number.isInteger(n)||!item){
   message.textContent=lang==='ar'?'اختار رقم صفحة من 1 إلى 52.':'Enter a page number from 1 to 52.';
   return;
  }
  showSpread(item.id);
 }
 go.addEventListener('click',selectByPage);
 pageInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();selectByPage()}});
 window.addEventListener('hashchange',()=>{
  const match=/^letter-([a-z])$/.exec(initialHash());
  if(match)showSpread(match[1],false);
 });
 const match=/^letter-([a-z])$/.exec(initialHash());
 const pageQuery=new URLSearchParams(location.search).get('page');
 const byPage=alphabet.find(a=>printedPages(a.pages).includes(Number(pageQuery)));
 showSpread(match?.[1]||byPage?.id||'a',false);
}

function wordVisual(w){
 const box=el('div','word-visual story-visual');
 if(illustratedWords.has(w)){
  const image=el('img','word-image');image.src='/assets/words/'+w.replaceAll(' ','-')+'.svg';
  image.alt=w;image.loading='lazy';image.decoding='async';image.width=192;image.height=192;box.append(image);
 }else{box.append(el('span','word-icon',icons[w]||w[0].toUpperCase()))}
 return box;
}
function createCast(compact=false){
 const cast=el('div','storybook-cast'+(compact?' compact-cast':''));
 cast.setAttribute('aria-label',lang==='ar'?'أبطال RVU Kids من الغلاف الأصلي':'Original RVU Kids book characters');
 for(const [type,arLabel,enLabel] of [
  ['boy','الولد صاحب الهودي الأزرق','The boy in his blue hoodie'],
  ['lizard','الليزرد الزرقاء الكيوت','The cute blue lizard'],
  ['girl','البنت بفستانها الوردي','The girl in her pink dress']
 ]){
  const portrait=el('span','character-portrait '+type);
  portrait.setAttribute('role','img');
  portrait.setAttribute('aria-label',lang==='ar'?arLabel:enLabel);
  cast.append(portrait);
 }
 const caption=el('span','cast-note',t('castWelcome'));cast.append(caption);
 return cast;
}
function decorateLearning(){
 const staticCast=document.querySelector('.hero .storybook-cast');
 if(staticCast){
  const label=staticCast.querySelector('[data-storybook-cast-caption]');if(label)label.textContent=t('castWelcome');
  return;
 }
 if(document.body.dataset.page==='alphabet-index'){
  const hero=document.querySelector('.hero');if(hero)hero.append(createCast());
 }
}
function lessonBreadcrumb(target){
 const c=el('nav','crumbs');c.setAttribute('aria-label','Breadcrumb');c.append(link('/', 'RVU Kids'));c.append(document.createTextNode(' / '));c.append(link('/learn/',t('hub')));c.append(document.createTextNode(' / '+target));return c
}
function lessonTemplate(type,d,idx){
 const root=document.querySelector('#lesson-root');root.replaceChildren();
 const head=el('section','lesson-top');head.append(lessonBreadcrumb(type==='alphabet'?t('alph'):t('sent')));
 const shell=el('div','lesson-card');
 shell.style.setProperty('--rvu-lesson-accent',['#fdd76b','#97d6c6','#f3aca5','#8fc5e6','#e0c2f3','#ecc686'][idx%6]);
 const caption=el('span','lesson-kicker',(type==='alphabet'?'ALPHABET & WORDS':'EVERYDAY ENGLISH')+' · '+t('pages')+': '+printedPages(d.pages).join('–'));
 const heading=el('h1','lesson-title',type==='alphabet'?d.letter+' '+d.letter.toLowerCase():d.title);heading.dir='ltr';heading.lang='en';
 const sub=el('p','lesson-sub',type==='alphabet'?(lang==='ar'?'حرف '+d.letter:'Letter '+d.letter):(lang==='ar'?d.titleAr:'Unit '+String(idx+1).padStart(2,'0')));
 shell.append(caption,heading,sub,createCast(true),voicePicker());
  if(type==='alphabet'){
   const pages=printedPages(d.pages);
   const jump=link('/learn/words/#letter-'+d.id,
     lang==='ar'?'شوف كلمات الصفحتين '+pages.join('–')+' بالصور':'See pictures for pages '+pages.join('–'),
     'spread-lesson-link');
   shell.append(jump);
  }
 if(type==='alphabet'){
  if(d.id==='a'||d.id==='m'){const page=el('img','real-page');page.src=d.id==='a'?'/assets/letter-a.webp':'/assets/letter-m.webp';page.alt='Actual teaching page from Rvu Alphabet Book — letter '+d.letter;page.loading='lazy';shell.append(page)}
  const syll=el('div','letter-name');syll.append(el('span',null,t('say')+': '));const b=el('b',null,d.letterName);b.dir='ltr';syll.append(b);const nameSound=playButton('letter-name',d.id,d.letter);if(nameSound)syll.append(nameSound);shell.append(syll);const phonics=playButton('letter-sound',d.id,d.letter);if(phonics){const line=el('div','phonics-line');line.append(el('span',null,t('sound')+': '),phonics);shell.append(line)}
  shell.append(el('p','phonics-note',t('hint')));
 }
 const title=el('h2','minor-heading',type==='alphabet'?t('words'):t('sentences'));shell.append(title);
 if(type==='alphabet'){
  const g=el('div','word-grid');d.words.forEach((w,i)=>g.append(renderWordCard(w,d.id,i)));shell.append(g)
 }else{
  if(d.id==='feelings'){const image=el('img','real-page');image.src='/assets/feelings.webp';image.alt='Actual feelings page from Rvu Alphabet Book';image.loading='lazy';shell.append(image)}
  if(d.words.length){const labels=el('div','support-words');labels.append(el('p',null,lang==='ar'?'كلمات موجودة في الدرس:':'Vocabulary in this lesson:'));d.words.forEach(w=>{const word=el('span',null,w);word.lang='en';word.dir='ltr';labels.append(word)});shell.append(labels)}
 }
 if(d.sentences?.length){if(type==='alphabet')shell.append(el('h2','minor-heading',t('sentences')));const g=el('div','phrase-grid');d.sentences.forEach((s,i)=>{const c=el('div','phrase-card');c.append(el('span','number',String(i+1).padStart(2,'0')));const p=el('strong','phrase-text',s);p.lang='en';p.dir='ltr';c.append(p);const play=playButton(type==='alphabet'?'alphabet-sentence':'everyday-sentence',d.id,s);if(play)c.append(play);g.append(c)});shell.append(g)}
 // Mini-games are loaded only on an individual lesson. Core content still works if the optional code fails.
 const gameMount=el('div','rvu-game-mount');shell.append(gameMount);
 if(!document.querySelector('link[data-rvu-game-style]')){
   const sheet=el('link');sheet.rel='stylesheet';sheet.href='/learn/activities.css';
   sheet.dataset.rvuGameStyle='true';document.head.append(sheet);
 }
 import('/learn/activities.mjs').then(module=>{
   module.mountActivities(gameMount,{type,lesson:d,lang,playButton,wordVisual});
 }).catch(()=>{gameMount.remove()});
 const prev=type==='alphabet'?alphabet[idx-1]:units[idx-1],next=type==='alphabet'?alphabet[idx+1]:units[idx+1];
 const nav=el('nav','lesson-nav');nav.setAttribute('aria-label','Lesson navigation');nav.append(link(prev?(type==='alphabet'?urlLetter(prev):urlUnit(prev)):(type==='alphabet'?'/learn/alphabet/':'/learn/sentences/'),'← '+(prev?(type==='alphabet'?prev.letter:prev.title):t('learn'))));nav.append(link(type==='alphabet'?'/learn/alphabet/':'/learn/sentences/',type==='alphabet'?t('all'):t('allSent')));nav.append(link(next?(type==='alphabet'?urlLetter(next):urlUnit(next)):(type==='alphabet'?'/learn/sentences/':'/learn/'),(next?(type==='alphabet'?next.letter:next.title):t('learn'))+' →'));shell.append(nav);
 head.append(shell);root.append(head)
}

function lessons(){
 const path=location.pathname.split('/').filter(Boolean);
 if(path[1]==='alphabet'&&path[2]){const idx=alphabet.findIndex(l=>l.id===path[2]);if(idx>=0){lessonTemplate('alphabet',alphabet[idx],idx);return}}
 if(path[1]==='sentences'&&path[2]){const idx=units.findIndex(u=>u.id===path[2]);if(idx>=0){lessonTemplate('sentences',units[idx],idx);return}}
 if(path[1]==='sentences'&&!path[2]){const root=document.querySelector('#lesson-root');root.innerHTML='<section class="hero compact"><span class="eyebrow">Everyday English</span><h1>'+t('sent')+'</h1><p>'+t('practice')+'</p></section>';const g=el('div','unit-grid');units.forEach((u,i)=>g.append(cardUnit(u,i)));root.append(g);return}
 const root=document.querySelector('#lesson-root');root.innerHTML='<section class="lesson-card"><h1>Lesson not found</h1><a href="/learn/">Learning Hub</a></section>';
}
function preview(){
 const figs=[...document.querySelectorAll('.preview-five figure')];
 let index=0;const dlg=el('dialog','page-dialog');const btn=el('button','dialog-close','×');btn.type='button';btn.setAttribute('aria-label','Close preview');const image=el('img','dialog-image');const cap=el('p','dialog-caption');const controls=el('div','dialog-controls');const prev=el('button','button ghost','←');const next=el('button','button ghost','→');prev.type='button';next.type='button';controls.append(prev,next);dlg.append(btn,image,cap,controls);document.body.append(dlg);
 function show(i){index=(i+figs.length)%figs.length;image.classList.remove('page-turn');image.src=figs[index].querySelector('img').src;image.alt=figs[index].querySelector('img').alt;cap.textContent=(index+1)+' / '+figs.length+' — '+figs[index].querySelector('figcaption').textContent;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){void image.offsetWidth;image.classList.add('page-turn')}}
 btn.addEventListener('click',()=>dlg.close());dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));dlg.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(index+1);else if(e.key==='ArrowLeft')show(index-1)});
 figs.forEach((figure,i)=>{figure.tabIndex=0;figure.setAttribute('role','button');figure.setAttribute('aria-label','Preview page '+(i+1));const open=()=>{show(i);dlg.showModal()};figure.addEventListener('click',open);figure.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})})
}

function translateStatic(){
 if(lang!=='en')return;
 if(document.body.dataset.page==='alphabet-index'){
  const hero=document.querySelector('.hero');if(hero){hero.querySelector('h1').innerHTML='Every letter.<br><em>Its own little world.</em>';hero.querySelector('p').textContent='Explore A–Z and the exact words and sentences from Rvu Alphabet Book. Listen to the approved American-English audio inside lessons.';const a=hero.querySelectorAll('.hero-actions a');if(a[0])a[0].textContent='Back to Learning Hub';if(a[1])a[1].textContent='Book Preview'}
  const title=document.querySelector('#letters-title');if(title)title.textContent='Choose a letter';const cta=document.querySelector('.cta');if(cta){cta.querySelector('h2').textContent='200 EGP + shipping by governorate';cta.querySelector('p').textContent='96 printed pages, made to order.';cta.querySelector('a').textContent='Order the book'}
 }
 if(document.body.dataset.page==='hub'){
  const title=document.querySelector('[data-play-title]');if(title)title.textContent='Four playful games in every lesson!';
  const summary=document.querySelector('[data-play-description]');if(summary)summary.textContent='Practise real-life situations, word order, pictures and listening. Correct answers bring gentle stars and cheerful celebrations.';
  const button=document.querySelector('[data-play-link]');if(button)button.textContent='Try the polite words game 🎉';
  const title=document.querySelector('[data-hub-parent-title]');if(title)title.textContent='Using the book with a child aged 3–6?';
  const help=document.querySelector('[data-hub-parent-text]');if(help)help.textContent='See our short parent guide for age-appropriate, low-pressure activities.';
  const parentLink=document.querySelector('[data-hub-parent-link]');if(parentLink)parentLink.textContent='Parent guide ↗';
  const hero=document.querySelector('.hero');if(hero){hero.querySelector('h1').innerHTML='A book to hold.<br><em>A world to explore.</em>';hero.querySelector('p').textContent='Discover letter lessons and Everyday English alongside the printed Rvu Alphabet Book. The learning paths are ready; American English audio is ready to play in every lesson.';const a=hero.querySelectorAll('.hero-actions a');if(a[0])a[0].textContent='Explore Lessons';if(a[1])a[1].textContent='Preview Five Real Pages'}
  const cards=document.querySelectorAll('.path-card');if(cards[0]){cards[0].querySelector('small').textContent='LEARNING PATH 01';cards[0].querySelector('p').textContent='26 individual A–Z lessons with the exact words from the approved book.'}if(cards[1]){cards[1].querySelector('small').textContent='LEARNING PATH 02';cards[1].querySelector('p').textContent='15 separate units about everyday communication, organized around the printed book.'}
  const hs=document.querySelectorAll('.section-head h2');if(hs[0])hs[0].textContent='Choose a letter';if(hs[1])hs[1].textContent='Everyday conversations';
  const cta=document.querySelector('.cta');if(cta){cta.querySelector('h2').textContent='200 EGP + shipping by governorate';cta.querySelector('p').textContent='96 printed pages, made to order, for children ages 3–6.';cta.querySelector('a').textContent='Order the book'}
 }
 if(document.body.dataset.page==='preview'){
  const hero=document.querySelector('.hero');if(hero){hero.querySelector('h1').innerHTML='Five real pages.<br><em>A closer look inside.</em>';hero.querySelector('p').textContent='Five individual physical pages at most—not five double-page spreads. These are selected pages from the actual book.'}
  const captions=['The book cover','Letter A — illustrated words','Letter A — tracing and writing','Everyday English','Letter M — moon, milk, monkey, mouse'];document.querySelectorAll('.preview-five figcaption').forEach((n,i)=>n.textContent=captions[i]);
  const cta=document.querySelector('.cta');if(cta){cta.querySelector('h2').textContent='200 EGP + shipping by governorate';cta.querySelector('p').textContent='96 pages. Printed on demand in Mit Ghamr, Egypt.';cta.querySelector('a').textContent='Order your copy'}
 }
 if(location.pathname.startsWith('/books/alphabet/')){
  const badges=['pages','alphabet lessons','Everyday English units','years'];document.querySelectorAll('.feature-strip article span').forEach((n,i)=>n.textContent=badges[i]||'');
  const head=document.querySelector('.section .section-head h2');if(head)head.textContent='A printed workbook connected to digital learning';
  const sections=[['See','Illustrated scenes help children connect letters, words and meaning.'],['Try','Trace, write, match, choose and review inside the printed book.'],['Keep learning','Explore our Alphabet and Everyday English lessons. Choose either American voice and press Listen.']];document.querySelectorAll('.three article').forEach((article,i)=>{if(sections[i]){article.querySelector('h3').textContent=sections[i][0];article.querySelector('p').textContent=sections[i][1]}});
  const h=document.querySelector('.product-copy');if(h){const paras=h.querySelectorAll('p');if(paras[0])paras[0].textContent='A colorful 96-page workbook for ages 3–6, combining letters, handwriting, activities, and Everyday English.';if(paras[1])paras[1].textContent='Shipping is calculated by governorate. Printing takes approximately one day after payment verification.';const links=h.querySelectorAll('.hero-actions a');if(links[0])links[0].textContent='Order the Book';if(links[1])links[1].textContent='Preview Five Pages';if(links[2])links[2].textContent='Explore Learning Hub'}
  const c=document.querySelector('.cta');if(c){c.querySelector('h2').textContent='Made especially for your child';c.querySelector('p').textContent='Printing starts only after we verify payment.';c.querySelector('a').textContent='Start your order'}
 }
}

renderNavLang();
translateStatic();
decorateLearning();
const p=document.body.dataset.page;if(p==='hub'||p==='alphabet-index')hub();if(p==='lesson')lessons();if(p==='words')wordLibrary();if(p==='preview')preview();
function enableStoryMotion(){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
 const targets=[...document.querySelectorAll('.word-card,.unit-card,.tile-letter,.path-card,.preview-five figure,.story-character')];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('story-visible');observer.unobserve(entry.target)}}},{threshold:0.07,rootMargin:'0px 0px 36px 0px'});
 for(const target of targets){target.classList.add('story-reveal');observer.observe(target)}
}
enableStoryMotion();
