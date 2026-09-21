'use strict';
const en = {
whyEyebrow:'Why this book?',whyTitle:'Letters. Words. Sentences.',whyIntro:'More than isolated alphabet pages: your child discovers letters, connects them to illustrated words, uses simple sentences and practices with you.',whyLettersTitle:'Letters in a story',whyLettersText:'Uppercase and lowercase letters in clear scenes.',whyWordsTitle:'Words with meaning',whyWordsText:'Words linked to pictures and meaning.',whySentencesTitle:'Everyday sentences',whySentencesText:'Feelings, family and everyday moments.',whyAudioSoon:'Coming soon',whyAudioTitle:'American English audio library',whyAudioText:'American English recordings for words and sentences are coming soon. Audio playback is not available yet.',
skip:'Skip to content',announcement:'A little world of learning. One book at a time.',navInside:'Book highlights',navLearn:'Learning Hub',navPreview:'Preview',digitalEyebrow:'Keep exploring',digitalTitle:'The learning continues online.',digitalIntro:'Explore the approved vocabulary and sentences in two learning paths. Reviewed American English audio will be added separately.',digitalAlphabet:'Letters and illustrated words.',digitalAlphabetLink:'Explore A–Z ↗',digitalSentences:'Everyday sentences for little learners.',digitalSentencesLink:'Explore units ↗',digitalPreview:'Exactly five real pages: cover, letter A, A practice, Feelings, and letter M.',digitalPreviewLink:'View the preview ↗',navHow:'How to order',navFaq:'FAQs',navOrder:'Order the book',age:'For curious minds, ages 3–6',heroTitle:'A new letter.<br>A new story.<br><em>A little discovery.</em>',heroDescription:'Pictures, words, and hands-on activities. Share the joy of learning English with your child, one page at a time, with Rvu Alphabet Book.',heroOrder:'Start their little journey',heroPreview:'Take a peek inside <span aria-hidden="true">↗</span>',price:'200 EGP',shippingExtra:'+ shipping by governorate',printNote:'Printed especially for you after payment is verified',pagesBadge:'pages of<br>discovery',actualCover:'Actual book cover',benefit1:'Letters from A to Z',benefit2:'Tracing, writing & activities',benefit3:'Words and everyday sentences',benefit4:'A little time learning together',insideEyebrow:'The first book from RVU Kids',insideTitle:'More than learning the ABCs.',insideIntro:'Look, say, try, and remember. Different activities to explore together, at your child’s own pace.',feature1Title:'Letters with a story',feature1:'Uppercase and lowercase letters, illustrated words, and scenes that connect each letter to its meaning.',feature2Title:'Little hands, big learning',feature2:'Trace, write, match, and choose. Each page is another small chance to try.',feature3Title:'English from their world',feature3:'Simple words and sentences about feelings, food, and familiar everyday moments.',feature4Title:'Celebrate every step',feature4:'Reviews, challenges, and a certificate at the end to celebrate their effort together.',previewEyebrow:'Look before you order',previewTitle:'A real peek inside.',previewIntro:'Actual pages from the current book. Tap a page to take a closer look.',previewNote:'Selected preview pages. Printed colors may look different from your screen.',howEyebrow:'From your order to your door',howTitle:'One simple step at a time.',howIntro:'Printed on demand in Mit Ghamr, Egypt. Printing takes approximately one day after payment verification. Delivery time varies by location.',step1Title:'Send your request',step1:'Choose your quantity, governorate and payment preference, then send your order details through WhatsApp.',step2Title:'Review your total',step2:'We check your address and privately share the shipping cost, total, and transfer details.',step3Title:'We verify payment',step3:'Pay using InstaPay or Vodafone Cash after we confirm the total. Printing begins only after the funds are verified.',step4Title:'Printed for your child',step4:'Printing starts after payment verification. We then coordinate shipping with you.',orderEyebrow:'One book. So many beginnings.',orderTitle:'Ready for the first page?',orderIntro:'Enter your order details and continue to our WhatsApp @n2nty. We will confirm shipping, your total and payment details before printing.',orderSpec:'96 pages · Ages 3–6',privacyShort:'You choose to send your order details to RVU Kids in WhatsApp. We do not need your child’s name or personal information.',formTitle:'Your order details',formRequired:'Required unless marked optional',whatsappNotice:'Your order will open WhatsApp @n2nty with a prepared message. Review it and press Send in WhatsApp; completing this form alone sends nothing.',nameLabel:'Parent / guardian name',phoneLabel:'Mobile number',governorateLabel:'Governorate',cityLabel:'City / district',addressLabel:'Full delivery address',quantityLabel:'Number of copies',paymentLabel:'Preferred payment method',vodafoneCash:'Vodafone Cash',notesLabel:'Delivery notes (optional)',subtotalLabel:'Books subtotal',shippingLabel:'Shipping',totalLabel:'Total',consent:'I agree to share these order and delivery details with RVU Kids through WhatsApp. Opening WhatsApp does not send the message or confirm payment.',privacyLink:'Privacy',submitOrder:'Continue on WhatsApp ↗',noPaymentNow:'No payment on this website. We confirm shipping, your total and InstaPay or Vodafone Cash details privately on WhatsApp before you pay.',faqEyebrow:'Before your first page',faqTitle:'A few things parents ask.',faq1q:'What age is this book for?',faq1a:'Children ages 3–6, with a parent or guardian. Younger children can start with pictures and spoken words, then move on to writing and activities when ready.',faq2q:'Is this a printed book or a file?',faq2a:'This order is for a printed, 96-page copy of Rvu Alphabet Book. The online previews help you explore its content.',faq3q:'How much is shipping?',faq3a:'It depends on the governorate and delivery address. If a verified rate is not available online, we will contact you with the shipping cost and total before any transfer.',faq4q:'When will it be printed and delivered?',faq4a:'Printing in Mit Ghamr takes approximately one day after receipt of payment is verified. Shipping time is separate and will be discussed based on your address.',faq5q:'Does submitting the form or a transfer screenshot confirm payment?',faq5a:'No. Press Send inside WhatsApp to deliver your request. We then confirm shipping and your total. Payment is verified only after the money actually arrives, not from a screenshot.',faq6q:'Is audio content available?',faq6a:'Some pages include spaces intended for listening activities, but working audio links are not currently confirmed. The offer covers the printed book and its content.',footerLine:'Small beginnings. Growing curiosity.',footerPlace:'Printed with love in Mit Ghamr, Egypt',privacyTitle:'Your order privacy',privacyBody:'The form does not submit details to this website’s server. You review the prepared order message and choose to send it to RVU Kids @n2nty in WhatsApp. Your message includes parent name, phone, governorate, city, delivery address, quantity, chosen payment method and any notes you enter. We do not request children’s personal data, passwords or bank card information. Necessary delivery details are shared with the courier when shipping is arranged. Contact us in the same WhatsApp chat to correct or cancel your details. We confirm shipping, total and transfer details before payment.'
};
const ar = Object.fromEntries([...document.querySelectorAll('[data-i18n]')].map(el=>[el.dataset.i18n,el.innerHTML]));
const governorates=[['C','القاهرة','Cairo'],['GZ','الجيزة','Giza'],['ALX','الإسكندرية','Alexandria'],['DK','الدقهلية','Dakahlia'],['SHR','الشرقية','Sharqia'],['GH','الغربية','Gharbia'],['MN','المنوفية','Monufia'],['KB','القليوبية','Qalyubia'],['BH','البحيرة','Beheira'],['KFS','كفر الشيخ','Kafr El Sheikh'],['DT','دمياط','Damietta'],['PTS','بورسعيد','Port Said'],['IS','الإسماعيلية','Ismailia'],['SUZ','السويس','Suez'],['FYM','الفيوم','Faiyum'],['BNS','بني سويف','Beni Suef'],['MT','المنيا','Minya'],['AST','أسيوط','Asyut'],['SHG','سوهاج','Sohag'],['KN','قنا','Qena'],['LX','الأقصر','Luxor'],['ASN','أسوان','Aswan'],['BA','البحر الأحمر','Red Sea'],['WAD','الوادي الجديد','New Valley'],['MTT','مطروح','Matrouh'],['SIN','شمال سيناء','North Sinai'],['JS','جنوب سيناء','South Sinai']];
const previews=[['letter-a','حرف A وحكايته','The letter A','حروف وكلمات مصوّرة','Letters & illustrated words'],['practice-a','وقت التجربة','Time to try','تتبّع، كتابة واختيار','Trace, write & choose'],['feelings','نتكلم عن مشاعرنا','Let’s talk about feelings','إنجليزي من الحياة اليومية','Everyday English'],['letter-m','حرف M وحكايته','The letter M','moon · milk · monkey · mouse','moon · milk · monkey · mouse']];
const requestedLang=new URLSearchParams(location.search).get('lang');
let lang=requestedLang==='en'||requestedLang==='ar'?requestedLang:(sessionStorage.getItem('rvu-lang')||'ar');
sessionStorage.setItem('rvu-lang',lang);
const shippingRates={};
const form=document.querySelector('#order-form');
const message=document.querySelector('#form-message');

const submit=document.querySelector('#submit-order');
const gov=document.querySelector('#governorate');
const qty=document.querySelector('#quantity');
const isEn=()=>lang==='en';
const money=n=>new Intl.NumberFormat(isEn()?'en-EG':'ar-EG',{style:'currency',currency:'EGP',maximumFractionDigits:0}).format(n);
function updateTotals(){
 const count=Number(qty.value),valid=Number.isInteger(count)&&count>=1&&count<=20;
 const rate=shippingRates[gov.value];
 const known=Number.isSafeInteger(rate)&&rate>=0;
 document.querySelector('#subtotal').textContent=valid?money(count*200):'—';
 document.querySelector('#shipping-cost').textContent=known?money(rate):(isEn()?'Quoted before payment':'يُحدّد قبل التحويل');
 document.querySelector('#total').textContent=valid&&known?money(count*200+rate):(isEn()?'Awaiting shipping quote':'بانتظار تحديد الشحن');
}
function setLanguage(value){
 lang=value;document.documentElement.lang=lang;document.documentElement.dir=isEn()?'ltr':'rtl';
 document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=(isEn()?en:ar)[el.dataset.i18n]??ar[el.dataset.i18n];});
 document.querySelector('#language').textContent=isEn()?'العربية':'English';document.querySelector('#language').lang=isEn()?'ar':'en';
 document.title=isEn()?'RVU Kids | Rvu Alphabet Book – 200 EGP':'RVU Kids | كتاب الحروف الإنجليزية للأطفال';
 const chosen=gov.value;gov.replaceChildren(new Option(isEn()?'Choose a governorate':'اختار المحافظة',''));
 governorates.forEach(([code,a,e])=>gov.add(new Option(isEn()?e:a,code)));gov.value=chosen;
 const grid=document.querySelector('#preview-grid');grid.replaceChildren();
 previews.forEach(p=>{const button=document.createElement('button');button.type='button';button.className='preview-card';const label=p[isEn()?2:1];button.setAttribute('aria-label',(isEn()?'Enlarge: ':'تكبير: ')+label);button.innerHTML=`<div class="preview-frame"><img src="./assets/${p[0]}.webp" width="900" height="1273" loading="lazy" alt="${label}"></div><strong>${label}</strong><span>${p[isEn()?4:3]}</span>`;button.addEventListener('click',()=>openPreview(p));grid.append(button);});
 document.querySelector('#preview-close').setAttribute('aria-label',isEn()?'Close preview':'إغلاق المعاينة');document.querySelector('#preview-previous').setAttribute('aria-label',isEn()?'Previous preview page':'صفحة المعاينة السابقة');document.querySelector('#preview-next').setAttribute('aria-label',isEn()?'Next preview page':'صفحة المعاينة التالية');document.querySelector('#privacy-close').setAttribute('aria-label',isEn()?'Close privacy notice':'إغلاق الخصوصية');
 form.elements.phone.setCustomValidity('');updateTotals();
}
let activePreview=0;
function showPreviewAt(i){
 activePreview=(i+previews.length)%previews.length;
 const p=previews[activePreview],img=document.querySelector('#preview-image');
 img.classList.remove('page-turn');
 img.src=`./assets/${p[0]}.webp`;
 img.alt=p[isEn()?2:1];
 document.querySelector('#preview-caption').textContent=(activePreview+1)+' / '+previews.length+' · '+img.alt;
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){void img.offsetWidth;img.classList.add('page-turn')}
}
function openPreview(p){showPreviewAt(previews.indexOf(p));document.querySelector('#preview-dialog').showModal();}
document.querySelector('#preview-previous').addEventListener('click',()=>showPreviewAt(activePreview-1));
document.querySelector('#preview-next').addEventListener('click',()=>showPreviewAt(activePreview+1));
document.querySelector('#preview-dialog').addEventListener('keydown',e=>{
 if(e.key==='ArrowLeft'){e.preventDefault();showPreviewAt(activePreview-1)}
 if(e.key==='ArrowRight'){e.preventDefault();showPreviewAt(activePreview+1)}
});
document.querySelector('#language').addEventListener('click',()=>{setLanguage(isEn()?'ar':'en');sessionStorage.setItem('rvu-lang',lang);const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);});
for(const type of ['preview','privacy']){const dialog=document.querySelector(`#${type}-dialog`);document.querySelector(`#${type}-close`).addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});}
['privacy-open','footer-privacy'].forEach(id=>document.getElementById(id).addEventListener('click',()=>document.querySelector('#privacy-dialog').showModal()));
qty.addEventListener('input',updateTotals);gov.addEventListener('change',updateTotals);form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
setLanguage(lang);
function normalizePhone(v){return v.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/[\s()-]/g,'').replace(/^0020/,'+20');}
form.addEventListener('submit',e=>{
 e.preventDefault();
 const phone=normalizePhone(form.elements.phone.value);
 if(!/^(?:\+20|0)1[0125]\d{8}$/.test(phone)){
  form.elements.phone.setCustomValidity(isEn()?'Enter a valid Egyptian mobile number.':'اكتب رقم موبايل مصري صحيح.');
  form.elements.phone.reportValidity();return;
 }
 if(!form.reportValidity())return;
 if(form.elements.website?.value.trim())return;
 const payload=Object.fromEntries(new FormData(form));
 const copies=Number(payload.quantity);
 if(!Number.isInteger(copies)||copies<1||copies>20)return;
 const governorate=governorates.find(row=>row[0]===payload.governorate);
 if(!governorate)return;
 const payment=payload.payment==='vodafone_cash'?'Vodafone Cash':payload.payment==='instapay'?'InstaPay':null;
 if(!payment)return;
 const fields=isEn()?[
  'Hello RVU Kids! I would like to order Rvu Alphabet Book.',
  'Parent/guardian: '+payload.name.trim(),
  'Phone: '+phone,
  'Governorate: '+governorate[2],
  'City/district: '+payload.city.trim(),
  'Delivery address: '+payload.address.trim(),
  'Copies: '+copies,
  'Preferred payment: '+payment,
  'Books subtotal: '+(copies*200)+' EGP',
  'Shipping & total: please confirm before payment',
  ...(payload.notes?.trim()?['Notes: '+payload.notes.trim()]:[]),
  'Please confirm shipping, the full total and payment details before printing.'
 ]:[
  'أهلًا RVU Kids! عاوز أطلب Rvu Alphabet Book.',
  'اسم ولي الأمر: '+payload.name.trim(),
  'رقم التواصل: '+phone,
  'المحافظة: '+governorate[1],
  'المدينة / المركز: '+payload.city.trim(),
  'عنوان التوصيل: '+payload.address.trim(),
  'عدد النسخ: '+copies,
  'طريقة الدفع المفضلة: '+payment,
  'قيمة الكتب: '+(copies*200)+' جنيه',
  'الشحن والإجمالي: برجاء التأكيد قبل التحويل',
  ...(payload.notes?.trim()?['ملاحظات: '+payload.notes.trim()]:[]),
  'من فضلك أكد تكلفة الشحن والإجمالي وبيانات الدفع قبل الطباعة.'
 ];
 message.className='success';
 message.textContent=isEn()?'Opening WhatsApp. Review the prepared message and press Send there; no order is received until you send it.':'هنفتح واتساب برسالة الطلب. راجعها واضغط إرسال هناك؛ لسه ما وصلناش طلبك قبل ما تبعته.';
 const url='https://wa.me/n2nty?text='+encodeURIComponent(fields.join('\n'));
 window.location.assign(url);
});
