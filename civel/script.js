
const $=(s,ctx=document)=>ctx.querySelector(s);
const $$=(s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
const header=$('[data-header]');
const menu=$('[data-menu]');
const nav=$('[data-nav]');
window.addEventListener('scroll',()=>{ if(header) header.classList.toggle('is-scrolled', window.scrollY>24); },{passive:true});
if(menu&&nav){menu.addEventListener('click',()=>{menu.classList.toggle('is-open');nav.classList.toggle('is-open');document.body.classList.toggle('no-scroll');});$$('a',nav).forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('is-open');nav.classList.remove('is-open');document.body.classList.remove('no-scroll')}));}
const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})}, {threshold:.12, rootMargin:'0px 0px -40px'});
$$('.reveal').forEach(el=>io.observe(el));
$$('[data-faq]').forEach(item=>{const btn=$('button',item);btn.addEventListener('click',()=>{item.classList.toggle('open')})});
$$('[data-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const btn=$('button[type="submit"]',form);const old=btn.textContent;btn.textContent='Solicitação registrada ✓';btn.disabled=true;setTimeout(()=>{btn.textContent=old;btn.disabled=false;form.reset()},2600)}));
$$('[data-count]').forEach(el=>{const target=Number(el.dataset.count||0);const suffix=el.dataset.suffix||'';let done=false;const obs=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!done){done=true;let start=performance.now();function step(t){let p=Math.min((t-start)/1400,1);let v=Math.round(target*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('pt-BR')+suffix;if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step);obs.disconnect()}},{threshold:.6});obs.observe(el)});
const spotlight=$('[data-spotlight]');
if(spotlight){spotlight.addEventListener('pointermove',e=>{const r=spotlight.getBoundingClientRect();spotlight.style.setProperty('--x',`${e.clientX-r.left}px`);spotlight.style.setProperty('--y',`${e.clientY-r.top}px`);});}
