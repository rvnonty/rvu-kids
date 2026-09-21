'use strict';
const translations={
ar:{
skip:'انتقل للمحتوى',navBook:'الكتاب',navLearn:'التعلّم',navPreview:'المعاينة',eyebrow:'RVU Kids · دليل الأهل',
title:'ابدأوا بصورة. وكملوا على مهلكم.',intro:'نفس الكتاب يناسب أعمار مختلفة. اختار النشاط حسب استعداد طفلك، مش عدد الصفحات اللي لازم تخلصوها.',
start:'اختار عمر طفلك ↓',visitHub:'افتح مكتبة التعلّم ↗',withYou:'مغامرتكم سوا أحلى!',
ageLabel:'خطوات بسيطة',agesTitle:'هتستخدم الكتاب إزاي؟',agesIntro:'الأعمار إرشادية؛ لو طفلك محتاج يبدأ بصورة أو جاهز للكتابة قبل كده، امشوا حسب قدرته.',
youngerTitle:'شوف وسمّي والعب',youngerIntro:'خلي الكتاب حكاية قصيرة بالصور، مش واجب كتابة.',
younger1:'اختاروا صورة واحدة أو صورتين، وقول اسم الشيء ببطء.',younger2:'اسأل: «فين التفاحة؟» وسيبه يشاور أو يختار.',younger3:'كرروا الكلمة في لعبة بسيطة، ووقفوا لما يفقد اهتمامه.',
example:'مثال من حرف A',youngerSample:'شاوروا على الصور وقولوا الكلمات مع بعض.',
olderTitle:'شوف واكتب واستخدم الجملة',olderIntro:'زوّد التتبّع والاختيار والجمل البسيطة، حسب استعداد الطفل.',
older1:'اتعرفوا على الحرف والكلمات من الرسومات.',older2:'خليه يجرّب تتبّع الحرف أو كتابة جزء صغير من النشاط.',older3:'اقرأوا الجملة واستخدموها في موقف بسيط، وارجعوا لها بعدين.',
olderSample:'تتبّع حرف A ثم قول الجملة مع الصورة.',
routineEyebrow:'من غير ضغط',routineTitle:'جلسة صغيرة تكفي.',routineIntro:'جرّبوا 5–10 دقايق أو أقل حسب تركيز طفلك؛ مش لازم تخلصوا درس كامل في مرة واحدة.',
r1Title:'شوفوا',r1Text:'افتحوا مشهد أو صفحة واحدة واتكلموا عن الصورة.',
r2Title:'قولوا',r2Text:'اختاروا كلمة أو جملة واقرأوها مع بعض.',
r3Title:'جرّبوا',r3Text:'شاوروا، اختاروا أو اكتبوا حسب العمر والاستعداد.',
r4Title:'ارجعوا لها',r4Text:'اسأل عن الكلمة تاني في وقت مختلف واحتفل بالمحاولة.',
gentle:'لو طفلك اتلخبط، ساعده من غير اختبار أو مقارنة. المهم يحب يرجع للكتاب.',
nextEyebrow:'جرّبوا دلوقتي',nextTitle:'ابدأوا بحرف A أو مشاعرنا.',nextText:'استخدموا صور الكتاب مع الكلمات والجمل الموجودة في مكتبة التعلّم. تسجيلات النطق الأمريكي قيد التجهيز ومش متاحة للاستماع حاليًا.',
linkA:'درس حرف A ↗',linkFeelings:'درس المشاعر ↗',linkOrder:'اطلب الكتاب ↗',footerBook:'ارجع للكتاب ↗'
},
en:{
skip:'Skip to content',navBook:'The Book',navLearn:'Learning Hub',navPreview:'Preview',eyebrow:'RVU Kids · Parent Guide',
title:'Start with a picture. Take it at your child’s pace.',intro:'One book can work for different ages. Follow your child’s readiness, not a page-count target.',
start:'Find your child’s age ↓',visitHub:'Explore the Learning Hub ↗',withYou:'Every adventure is better together!',
ageLabel:'Two easy starting points',agesTitle:'How can we use the book?',agesIntro:'Ages are a guide, not a test. Start with pictures or add writing whenever your child is ready.',
youngerTitle:'Look, name and play',youngerIntro:'Make it a short picture story, not a handwriting assignment.',
younger1:'Pick one or two pictures and slowly name what you see.',younger2:'Ask “Where is the apple?” and let your child point or choose.',younger3:'Repeat the word through a little game; stop when interest fades.',
example:'Letter A example',youngerSample:'Point to the pictures and say the words together.',
olderTitle:'Look, write and use a sentence',olderIntro:'Add tracing, choices and easy sentences when your child is ready.',
older1:'Recognize the letter and words in their illustrated scene.',older2:'Try tracing the letter or writing a small part of the activity.',older3:'Read a sentence, use it in a simple situation and revisit it later.',
olderSample:'Trace the letter A, then say the sentence with its picture.',
routineEyebrow:'No pressure',routineTitle:'A little session is enough.',routineIntro:'Try 5–10 minutes or less, depending on attention. One full lesson is not a daily requirement.',
r1Title:'Look',r1Text:'Open one scene or page and talk about its pictures.',
r2Title:'Say',r2Text:'Choose a word or sentence and read it together.',
r3Title:'Try',r3Text:'Point, choose or write according to readiness.',
r4Title:'Revisit',r4Text:'Ask about the word again later and celebrate the effort.',
gentle:'If your child gets stuck, help without turning it into a test or a comparison. Enjoying the book matters.',
nextEyebrow:'Try it together',nextTitle:'Start with A or Feelings.',nextText:'Use the printed illustrations alongside the Learning Hub words and sentences. Reviewed American English recordings are being prepared and are not available to play yet.',
linkA:'Letter A lesson ↗',linkFeelings:'Feelings lesson ↗',linkOrder:'Order the book ↗',footerBook:'Back to the book ↗'
}};
const button=document.querySelector('#guide-language');
function changeLanguage(value){
 const lang=value==='en'?'en':'ar';
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==='en'?'ltr':'rtl';
 document.querySelectorAll('[data-guide]').forEach(node=>{
  const translation=translations[lang][node.dataset.guide];
  if(translation!==undefined)node.textContent=translation;
 });
 button.textContent=lang==='en'?'العربية':'English';
 button.lang=lang==='en'?'ar':'en';
 document.title=lang==='en'?'Parent Guide | RVU Kids':'دليل الأهل | RVU Kids';
 sessionStorage.setItem('rvu-lang',lang);
}
const query=new URLSearchParams(location.search);
const explicit=query.get('lang');
const preference=(explicit==='ar'||explicit==='en')?explicit:(sessionStorage.getItem('rvu-lang')||'ar');
changeLanguage(preference);
button.addEventListener('click',()=>{
 const next=document.documentElement.lang==='ar'?'en':'ar';
 changeLanguage(next);
 const url=new URL(location.href);
 url.searchParams.set('lang',next);
 history.replaceState(null,'',url);
});
