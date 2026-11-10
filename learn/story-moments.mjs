/* Mini-stories: answers are exact approved Everyday English lines from content.js.
   Visual prompts are original UI scenes based on the book's existing subjects. */
export const STORY_MOMENTS=Object.freeze({
 'polite-words':[
  {id:'borrow',scene:'park',object:'ball',actor:'boy',friend:'girl',
   ar:'عايز تستعير الكرة بأدب. إيه الكلمة المناسبة؟',en:'You would like to borrow the ball. What do you say?',
   answer:'Please.',choices:['Please.','Excuse me.','You\'re welcome.']},
  {id:'gift',scene:'garden',object:'gift',actor:'girl',friend:'boy',
   ar:'صاحبك جاب لك هدية. تقوله إيه؟',en:'Your friend gives you a gift. What do you say?',
   answer:'Thank you.',choices:['Thank you.','Please.','I\'m sorry.']},
  {id:'sorry',scene:'playground',object:'hand',actor:'boy',friend:'girl',
   ar:'خبطت في صاحبك بالغلط. تعتذر إزاي؟',en:'You accidentally bump into a friend. What do you say?',
   answer:"I'm sorry.",choices:["I'm sorry.",'Excuse me.','Thank you.']}
 ],
 'can-i-have':[
  {id:'ask-ball',scene:'playground',object:'ball',actor:'girl',friend:'boy',
   ar:'عايز الكرة علشان تلعب. إيه الجملة اللي تطلب بيها بأدب؟',en:'You want the ball to play. How do you ask politely?',
   answer:'Can I have the ball, please?',choices:['Can I have the ball, please?','Can I have the book, please?','Can I have some water, please?']},
  {id:'ask-book',scene:'school',object:'book',actor:'boy',friend:'girl',
   ar:'عايز كتاب. اختار الطلب المناسب.',en:'You would like a book. Choose the right request.',
   answer:'Can I have the book, please?',choices:['Can I have the book, please?','Can I have the ball, please?','Can I have some water, please?']},
  {id:'ask-water',scene:'home',object:'cup',actor:'girl',friend:'lizard',
   ar:'عطشان وعايز ميّه. تقول إيه؟',en:'You are thirsty and would like water. What do you say?',
   answer:'Can I have some water, please?',choices:['Can I have some water, please?','Can I have the book, please?','Can I have the ball, please?']}
 ],
 'can-you-help':[
  {id:'help',scene:'home',object:'door',actor:'boy',friend:'girl',
   ar:'في حاجة مش عارف تعملها لوحدك. تطلب المساعدة إزاي؟',en:'Something is difficult to do alone. How do you ask for help?',
   answer:'Can you help me, please?',choices:['Can you help me, please?', "I don't understand.",'Say it again, please.']},
  {id:'understand',scene:'school',object:'book',actor:'girl',friend:'boy',
   ar:'الشرح مش واضح ليك. تقول إيه؟',en:'The explanation is confusing. What do you say?',
   answer:"I don't understand.",choices:["I don't understand.",'Please open the box.','Can you help me, please?']},
  {id:'repeat',scene:'school',object:'teacher',actor:'boy',friend:'girl',
   ar:'محتاج تسمع الكلام مرة تانية. تطلب إزاي؟',en:'You need to hear the words again. What do you say?',
   answer:'Say it again, please.',choices:['Say it again, please.','Please close the door.',"I don't understand."]}
 ],
 'at-school':[
  {id:'arrive',scene:'school',object:'school',actor:'boy',friend:'girl',
   ar:'وصلت المدرسة. إيه الجملة اللي بتقول أنت فين؟',en:'You arrived at school. Which sentence tells where you are?',
   answer:"I'm at school.",choices:["I'm at school.",'This is my teacher.','I have a book.']},
  {id:'teacher',scene:'school',object:'teacher',actor:'girl',friend:'boy',
   ar:'بتعرّف صاحبك على المعلمة. تقول إيه؟',en:'Introduce your teacher to a friend. What do you say?',
   answer:'This is my teacher.',choices:['This is my teacher.','I have a pencil.',"I'm at school."]},
  {id:'book',scene:'classroom',object:'book',actor:'boy',friend:'girl',
   ar:'معاك كتاب وعايز توصف اللي في إيدك. تقول إيه؟',en:'You are holding a book. Which sentence describes it?',
   answer:'I have a book.',choices:['I have a book.','I have a pencil.','This is my teacher.']}
 ]
});
export function approvedMoments(unit){
 const moments=STORY_MOMENTS[unit?.id]||[];
 const approved=new Set(unit?.sentences||[]);
 return moments.filter(m=>approved.has(m.answer)&&m.choices.length===3&&
  m.choices.includes(m.answer)&&m.choices.every(choice=>approved.has(choice)));
}
