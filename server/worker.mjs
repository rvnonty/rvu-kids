const GOVS=new Set(['C','GZ','ALX','DK','SHR','GH','MN','KB','BH','KFS','DT','PTS','IS','SUZ','FYM','BNS','MT','AST','SHG','KN','LX','ASN','BA','WAD','MTT','SIN','JS']);
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const text=(value,min,max)=>typeof value==='string'&&value.trim().length>=min&&value.trim().length<=max&&!/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value);
export function validateOrder(b){
 if(!b||typeof b!=='object'||Array.isArray(b))return null;
 if(!text(b.name,2,100)||!text(b.city,2,100)||!text(b.address,8,500)||!text(b.notes??'',0,500))return null;
 const phone=typeof b.phone==='string'?b.phone.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/[\s()-]/g,'').replace(/^0020/,'+20'):'';
 if(!/^(?:\+20|0)1[0125]\d{8}$/.test(phone)||!GOVS.has(b.governorate)||!Number.isInteger(b.quantity)||b.quantity<1||b.quantity>20||!['instapay','vodafone_cash'].includes(b.payment)||b.consent!==true||b.website)return null;
 return {name:b.name.trim(),phone,city:b.city.trim(),address:b.address.trim(),governorate:b.governorate,quantity:b.quantity,payment:b.payment,notes:(b.notes??'').trim(),locale:b.locale==='en'?'en':'ar'};
}
async function hash(value){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(v=>v.toString(16).padStart(2,'0')).join('');}
async function config(env){
 if(!env.DB||env.ORDERS_ENABLED!=='true'||!env.RATE_LIMIT_SECRET)return {acceptingOrders:false,shippingRates:{}};
 const {results}=await env.DB.prepare('SELECT governorate, amount_egp FROM shipping_rates WHERE enabled = 1').all();
 const shippingRates={};for(const row of results)if(GOVS.has(row.governorate)&&Number.isSafeInteger(row.amount_egp)&&row.amount_egp>=0)shippingRates[row.governorate]=row.amount_egp;
 return {acceptingOrders:true,shippingRates};
}
async function readLimitedJSON(request){
 const reader=request.body?.getReader();if(!reader)throw Error('body');let size=0;const chunks=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();throw Error('size');}chunks.push(value);}
 const bytes=new Uint8Array(size);let i=0;for(const c of chunks){bytes.set(c,i);i+=c.length;}return JSON.parse(new TextDecoder().decode(bytes));
}
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(!url.pathname.startsWith('/api/'))return env.ASSETS?env.ASSETS.fetch(request):new Response('Not found',{status:404});
 try{
  if(url.pathname==='/api/config'&&request.method==='GET')return json(await config(env));
  if(url.pathname!=='/api/orders')return json({error:'not_found'},404);
  if(request.method!=='POST')return json({error:'method_not_allowed'},405);
  if(request.headers.get('Origin')!==url.origin)return json({error:'origin_not_allowed'},403);
  if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json'))return json({error:'content_type'},415);
  const cfg=await config(env);if(!cfg.acceptingOrders)return json({error:'orders_unavailable'},503);
  const key=request.headers.get('Idempotency-Key')??'';if(!/^[a-f0-9-]{36}$/i.test(key))return json({error:'request_key_required'},400);
  let body;try{body=await readLimitedJSON(request);}catch{return json({error:'invalid_body'},400);}
  const order=validateOrder(body);if(!order)return json({error:'invalid_order'},400);
  const bodyHash=await hash(JSON.stringify(order));
  const existing=await env.DB.prepare('SELECT reference, body_hash FROM orders WHERE request_key = ?').bind(key).first();
  if(existing)return existing.body_hash===bodyHash?json({reference:existing.reference,status:'pending_review'},200):json({error:'request_conflict'},409);
  const hour=Math.floor(Date.now()/3600000),ip=request.headers.get('CF-Connecting-IP');if(!ip)return json({error:'request_unavailable'},503);
  const bucket=await hash(`${env.RATE_LIMIT_SECRET}:${hour}:${ip}`);
  const rate=await env.DB.prepare('INSERT INTO request_limits (bucket, attempts, expires_at) VALUES (?, 1, ?) ON CONFLICT(bucket) DO UPDATE SET attempts = attempts + 1 RETURNING attempts').bind(bucket,Date.now()+7200000).first();
  if(rate.attempts>8)return json({error:'rate_limited'},429);
  const shipping=cfg.shippingRates[order.governorate]??null,subtotal=order.quantity*200;
  const reference='RVK-'+crypto.randomUUID().replaceAll('-','').slice(0,16).toUpperCase();
  await env.DB.prepare(`INSERT INTO orders (reference, request_key, body_hash, parent_name, phone, governorate, city, address, quantity, payment_method, notes, locale, unit_price_egp, subtotal_egp, shipping_egp, total_egp, status, created_at, consent_version) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 200, ?, ?, ?, 'pending_review', ?, '2026-09-21') ON CONFLICT(request_key) DO NOTHING`).bind(reference,key,bodyHash,order.name,order.phone,order.governorate,order.city,order.address,order.quantity,order.payment,order.notes,order.locale,subtotal,shipping,shipping===null?null:subtotal+shipping,new Date().toISOString()).run();
  const saved=await env.DB.prepare('SELECT reference, body_hash FROM orders WHERE request_key = ?').bind(key).first();
  if(!saved||saved.body_hash!==bodyHash)return json({error:'request_conflict'},409);
  return json({reference:saved.reference,status:'pending_review'},201);
 }catch{return json({error:'temporarily_unavailable'},503);}
},async scheduled(event,env){if(env.DB)await env.DB.prepare('DELETE FROM request_limits WHERE expires_at < ?').bind(Date.now()).run();}};
