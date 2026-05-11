
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => [...ctx.querySelectorAll(s)];

const header = $('[data-header]');
const menuBtn = $('[data-menu]');
const nav = $('[data-nav]');
if (header) {
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 18), { passive:true });
}
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }));
}

const reveal = $$('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: .14, rootMargin: '0px 0px -40px 0px' });
reveal.forEach(el => io.observe(el));

const counters = $$('[data-count]');
const countIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1250;
    const start = performance.now();
    function step(now){
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased).toLocaleString('pt-BR');
      el.textContent = `${prefix}${val}${suffix}`;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold: .45 });
counters.forEach(el => countIO.observe(el));

$$('[data-faq]').forEach(item => {
  const btn = $('button', item);
  btn?.addEventListener('click', () => {
    const parent = item.parentElement;
    $$('[data-faq]', parent).forEach(other => { if(other !== item) other.classList.remove('open'); });
    item.classList.toggle('open');
  });
});

const forms = $$('form[data-form]');
forms.forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = 'Solicitação registrada ✓';
  btn.disabled = true;
  form.reset();
  setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 2800);
}));

const spotlight = $('.spotlight-grid');
if (spotlight) {
  spotlight.addEventListener('pointermove', e => {
    const r = spotlight.getBoundingClientRect();
    spotlight.style.setProperty('--mx', `${e.clientX - r.left}px`);
    spotlight.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}
