/**
 * TENÓRIO & ANDRADE — ADVOCACIA TRIBUTÁRIA
 * main.js
 *
 * Módulos:
 *  1. Partículas (canvas hero background)
 *  2. Navbar (scroll + hamburger)
 *  3. Scroll Reveal (IntersectionObserver)
 *  4. Contadores animados
 *  5. Slider de depoimentos
 *  6. Acordeão FAQ
 *  7. Formulário de contato
 */

'use strict';

/* ================================================
   1. SISTEMA DE PARTÍCULAS
   Partículas douradas flutuando no hero.
   Conectadas por linhas quando próximas.
================================================ */
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    /* Cores e configurações */
    const CFG = {
        count:     90,
        maxDist:   130,
        speed:     0.35,
        minR:      1,
        maxR:      2.5,
        color:     '201, 164, 53',   /* gold RGB */
        lineAlpha: 0.18,
    };

    /* Ajusta canvas ao container */
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width  = rect.width;
        canvas.height = rect.height;
    }

    /* Cria uma partícula com posição e velocidade aleatórias */
    function createParticle() {
        return {
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * CFG.speed * 2,
            vy: (Math.random() - 0.5) * CFG.speed * 2,
            r:  CFG.minR + Math.random() * (CFG.maxR - CFG.minR),
            a:  0.2 + Math.random() * 0.5,
        };
    }

    /* Inicializa partículas */
    function init() {
        resize();
        particles = Array.from({ length: CFG.count }, createParticle);
    }

    /* Atualiza posições e rebate nas bordas */
    function update(p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    /* Desenha uma partícula */
    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CFG.color}, ${p.a})`;
        ctx.fill();
    }

    /* Desenha linha entre partículas próximas */
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CFG.maxDist) {
                    const alpha = CFG.lineAlpha * (1 - dist / CFG.maxDist);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${CFG.color}, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    /* Loop de animação */
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { update(p); drawParticle(p); });
        drawLines();
        animFrame = requestAnimationFrame(loop);
    }

    /* Pausa quando fora da viewport para performance */
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            if (!animFrame) loop();
        } else {
            cancelAnimationFrame(animFrame);
            animFrame = null;
        }
    });
    observer.observe(canvas);

    window.addEventListener('resize', () => {
        resize();
        particles.forEach(p => {
            p.x = Math.min(p.x, canvas.width);
            p.y = Math.min(p.y, canvas.height);
        });
    });

    init();
    loop();
})();


/* ================================================
   2. NAVBAR — scroll e hamburger
================================================ */
(function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    /* Muda aparência com scroll */
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* Menu hambúrguer mobile */
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Fecha menu ao clicar num link */
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
})();


/* ================================================
   3. SCROLL REVEAL (IntersectionObserver)
   Detecta .reveal-up, .reveal-left, .reveal-right
   e adiciona .visible quando entram na viewport.
================================================ */
(function initScrollReveal() {
    const revealEls = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right'
    );

    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); /* anima apenas uma vez */
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
})();


/* ================================================
   4. CONTADORES ANIMADOS
   Anima qualquer elemento com data-target="N"
   a partir de 0 até N quando entra na viewport.
================================================ */
(function initCounters() {
    /* Contadores no hero (animam ao carregar a página) */
    const heroCounters = document.querySelectorAll('.hero-stat-value[data-target]');
    heroCounters.forEach(el => animateCount(el, 1600));

    /* Contadores na stats bar (animam ao entrar na viewport) */
    const barCounters = document.querySelectorAll('.counter[data-target]');
    if (!barCounters.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target, 1800);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    barCounters.forEach(el => observer.observe(el));

    /**
     * Anima um elemento de 0 até data-target
     * @param {Element} el      - elemento com data-target
     * @param {number}  dur     - duração em ms
     */
    function animateCount(el, dur) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const start  = performance.now();

        function step(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / dur, 1);
            /* Easing out cubic */
            const eased    = 1 - Math.pow(1 - progress, 3);
            const current  = Math.round(eased * target);
            el.textContent = current.toLocaleString('pt-BR');
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
})();


/* ================================================
   5. SLIDER DE DEPOIMENTOS
   Controle por botões e pontos (dots).
================================================ */
(function initTestimonialSlider() {
    const slider  = document.getElementById('tSlider');
    const prevBtn = document.getElementById('tPrev');
    const nextBtn = document.getElementById('tNext');
    const dotsWrap = document.getElementById('tDots');

    if (!slider) return;

    const cards  = slider.querySelectorAll('.tcard');
    const total  = cards.length;
    let current  = 0;
    let autoTimer;

    /* Cria os pontos indicadores */
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'tdot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    function getDots() { return dotsWrap.querySelectorAll('.tdot'); }

    function goTo(index) {
        current = (index + total) % total;
        slider.style.transform = `translateX(-${current * 100}%)`;
        getDots().forEach((d, i) => d.classList.toggle('active', i === current));
    }

    /* Navegação */
    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    /* Auto-play a cada 6s */
    function startAuto() {
        autoTimer = setInterval(() => goTo(current + 1), 6000);
    }
    function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
    }

    /* Pausa ao passar o mouse */
    slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.parentElement.addEventListener('mouseleave', startAuto);

    /* Suporte a swipe touch */
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    startAuto();
})();


/* ================================================
   6. ACORDEÃO FAQ
   Um item aberto de cada vez.
   A altura é animada via max-height no CSS.
================================================ */
(function initFaq() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
        const question = item.querySelector('.faq-q');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            /* Fecha todos */
            items.forEach(i => i.classList.remove('open'));

            /* Abre o clicado, se estava fechado */
            if (!isOpen) item.classList.add('open');
        });
    });
})();


/* ================================================
   7. FORMULÁRIO DE CONTATO
   Validação básica e feedback visual ao enviar.
================================================ */
(function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name    = form.querySelector('#c-name').value.trim();
        const company = form.querySelector('#c-company').value.trim();
        const email   = form.querySelector('#c-email').value.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        /* Limpa erros anteriores */
        form.querySelectorAll('.input-error').forEach(el => el.remove());

        let valid = true;

        if (!name)    { showError(form.querySelector('#c-name'), 'Por favor, informe seu nome.'); valid = false; }
        if (!company) { showError(form.querySelector('#c-company'), 'Por favor, informe a empresa.'); valid = false; }
        if (!emailOk) { showError(form.querySelector('#c-email'), 'Informe um e-mail válido.'); valid = false; }

        if (!valid) return;

        /* Feedback de envio */
        const btn  = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>Enviando...</span>';
        btn.disabled = true;

        /* Simula envio (substitua por fetch real) */
        setTimeout(() => {
            btn.innerHTML = '<span>✓ Mensagem enviada com sucesso!</span>';
            btn.style.background = '#2d6a4f';
            form.reset();

            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
                btn.disabled = false;
            }, 4500);
        }, 1200);
    });

    /**
     * Exibe mensagem de erro abaixo de um campo
     * @param {Element} field - campo com erro
     * @param {string}  msg   - mensagem de erro
     */
    function showError(field, msg) {
        const span = document.createElement('span');
        span.className = 'input-error';
        span.style.cssText = 'display:block;font-size:.75rem;color:#e05050;margin-top:.35rem;';
        span.textContent = msg;
        field.parentElement.appendChild(span);
        field.style.borderColor = '#e05050';
        field.addEventListener('input', () => {
            field.style.borderColor = '';
            span.remove();
        }, { once: true });
    }
})();


/* ================================================
   UTILITÁRIOS GLOBAIS
================================================ */

/* Highlight do link ativo na navbar conforme scroll */
(function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
                links.forEach(a => {
                    a.classList.remove('active-link');
                    if (a.getAttribute('href') === `#${sec.id}`) {
                        a.classList.add('active-link');
                    }
                });
            }
        });
    }, { passive: true });
})();