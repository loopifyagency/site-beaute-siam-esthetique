/* ==========================================================================
   Beauté Siam Esthétique — mouvement
   GSAP + ScrollTrigger + Lenis. Tout ce qui n'est pas de l'animation
   (statut d'ouverture, onglets, avis, menu) fonctionne aussi sans GSAP.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const html = doc.documentElement;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const mk = (tag, cls) => { const e = doc.createElement(tag); if (cls) e.className = cls; return e; };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const animate = hasGsap && !reduce;

  const loader = $('#loader');
  const header = $('#header');
  let lenis = null;
  let menuOpen = false;

  /* ------------------------------------------------------------------------
     Statut d'ouverture (heure de Paris) + ligne du jour dans le tableau
     ------------------------------------------------------------------------ */
  const SCHEDULE = { 0: null, 1: [600, 960], 2: [600, 1140], 3: null, 4: [600, 1140], 5: [600, 1140], 6: [570, 960] };
  const DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const fmt = (m) => { const h = Math.floor(m / 60); const mm = m % 60; return mm ? `${h} h ${String(mm).padStart(2, '0')}` : `${h} h`; };

  function parisNow() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: map[get('weekday')], min: Number(get('hour')) * 60 + Number(get('minute')) };
  }

  function initStatus() {
    const boxes = $$('[data-status]');
    if (!boxes.length) return;
    const paint = () => {
      let now;
      try { now = parisNow(); } catch (e) { return; }
      const today = SCHEDULE[now.day];
      let text; let open = false;
      if (today && now.min >= today[0] && now.min < today[1]) {
        open = true;
        text = `Ouvert maintenant, jusqu’à ${fmt(today[1])}`;
      } else {
        for (let d = 0; d < 8; d++) {
          const day = (now.day + d) % 7;
          const s = SCHEDULE[day];
          if (s && (d > 0 || now.min < s[0])) {
            const when = d === 0 ? 'aujourd’hui' : d === 1 ? 'demain' : DAY_NAMES[day];
            text = `Fermé en ce moment, ouvre ${when} à ${fmt(s[0])}`;
            break;
          }
        }
      }
      boxes.forEach((b) => {
        b.classList.toggle('is-open', open);
        const t = $('[data-status-text]', b);
        if (t && text) t.textContent = text;
      });
      $$('.hours tr').forEach((tr) => {
        const isToday = Number(tr.dataset.day) === now.day;
        tr.classList.toggle('is-today', isToday);
        if (isToday) tr.setAttribute('aria-current', 'date'); else tr.removeAttribute('aria-current');
      });
    };
    paint();
    setInterval(paint, 60000);
  }

  /* ------------------------------------------------------------------------
     Onglets des tarifs (clavier : flèches, Début, Fin)
     ------------------------------------------------------------------------ */
  function initTabs() {
    const tabs = $$('.tab');
    if (!tabs.length) return;
    let refreshTimer;
    const activate = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = doc.getElementById(t.getAttribute('aria-controls'));
        if (p) { p.hidden = !on; p.classList.toggle('is-active', on); }
      });
      if (focus) tab.focus();
      const panel = doc.getElementById(tab.getAttribute('aria-controls'));
      if (animate && panel) {
        gsap.fromTo($$('.panel__title, .rows > li, .panel__note, .gift', panel),
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.055, ease: 'expo.out', clearProps: 'transform,opacity' });
      }
      if (hasGsap) { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120); }
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        let next = null;
        if (e.key in keys) next = tabs[(i + keys[e.key] + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); activate(next, true); }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Menu mobile
     ------------------------------------------------------------------------ */
  const menu = $('#menu');
  const burger = $('#burger');
  function setMenu(open) {
    if (!menu || !burger || open === menuOpen) return;
    menuOpen = open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    html.classList.toggle('menu-open', open);
    if (lenis) (open ? lenis.stop() : lenis.start());
    const links = $$('.menu__nav a span, .menu__foot > *', menu);
    if (open) {
      menu.inert = false;
      menu.setAttribute('aria-hidden', 'false');
      header.classList.remove('is-hidden');
      if (animate) {
        gsap.killTweensOf([menu, ...links]);
        gsap.set(menu, { visibility: 'visible' });
        gsap.to(menu, { clipPath: 'circle(150% at calc(100% - 44px) 38px)', duration: 0.9, ease: 'expo.inOut' });
        gsap.fromTo(links, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.25 });
      } else {
        menu.style.visibility = 'visible';
        menu.style.clipPath = 'none';
      }
      const first = $('.menu__nav a', menu);
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 300);
    } else {
      menu.setAttribute('aria-hidden', 'true');
      menu.inert = true;
      if (animate) {
        gsap.to(menu, { clipPath: 'circle(0% at calc(100% - 44px) 38px)', duration: 0.7, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
      } else {
        menu.style.visibility = 'hidden';
        menu.style.clipPath = 'circle(0% at 100% 0)';
      }
      burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener('click', () => setMenu(!menuOpen));
  doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) setMenu(false); });

  /* ------------------------------------------------------------------------
     Ancres (Lenis si présent, sinon défilement natif)
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#top' ? doc.body : (id.length > 1 ? $(id) : null);
    if (!target) return;
    e.preventDefault();
    if (menuOpen) setMenu(false);
    const go = () => {
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : target, { offset: id === '#top' ? 0 : -8, duration: 1.7, easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    menuOpen ? setTimeout(go, 350) : go();
  });

  /* ------------------------------------------------------------------------
     Avis : un avis à la fois, défilement automatique, balayage, clavier
     ------------------------------------------------------------------------ */
  function initReviews() {
    const stage = $('#reviewStage');
    if (!stage) return;
    const items = $$('.review', stage);
    const picks = $$('.pick');
    const prev = $('#revPrev');
    const next = $('#revNext');
    const pauseBtn = $('#revPause');
    let idx = 0;
    let paused = reduce;
    let bar = null;
    let userPaused = reduce;

    const durationFor = (el) => 5500 + el.textContent.length * 28;

    const runBar = () => {
      if (bar) bar.kill();
      picks.forEach((p) => { const i = $('i', p); if (i && hasGsap) gsap.set(i, { scaleX: 0 }); });
      if (!hasGsap || reduce || userPaused) return;
      const fill = $('i', picks[idx]);
      bar = gsap.to(fill, { scaleX: 1, duration: durationFor(items[idx]) / 1000, ease: 'none', onComplete: () => go(idx + 1) });
      if (paused) bar.pause();
    };

    const go = (n, dir) => {
      const to = (n + items.length) % items.length;
      if (to === idx && items[idx] && !items[idx].hidden) { runBar(); return; }
      const from = items[idx];
      const incoming = items[to];
      const way = dir || (n > idx || (idx === items.length - 1 && to === 0) ? 1 : -1);
      picks.forEach((p, i) => { const on = i === to; p.classList.toggle('is-active', on); p.setAttribute('aria-selected', String(on)); p.tabIndex = on ? 0 : -1; });
      const swap = () => {
        from.hidden = true; from.classList.remove('is-active');
        incoming.hidden = false; incoming.classList.add('is-active');
        if (animate) {
          const parts = $$('blockquote p, figcaption', incoming);
          gsap.fromTo(parts, { y: 34 * way, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: 'expo.out', clearProps: 'transform,opacity' });
        }
        idx = to;
        runBar();
        if (hasGsap) ScrollTrigger.refresh();
      };
      if (animate) {
        gsap.to($$('blockquote p, figcaption', from), { y: -26 * way, opacity: 0, duration: 0.35, stagger: 0.03, ease: 'power2.in', onComplete: () => { gsap.set($$('blockquote p, figcaption', from), { clearProps: 'all' }); swap(); } });
      } else swap();
    };

    picks.forEach((p, i) => p.addEventListener('click', () => go(i)));
    $('.reviews__list').addEventListener('keydown', (e) => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); go(idx + k, k); picks[(idx + k + items.length) % items.length].focus(); }
    });
    prev.addEventListener('click', () => go(idx - 1, -1));
    next.addEventListener('click', () => go(idx + 1, 1));

    const setPause = (state, byUser) => {
      paused = state;
      if (byUser) userPaused = state;
      if (bar) state ? bar.pause() : bar.resume();
      if (byUser) {
        pauseBtn.setAttribute('aria-pressed', String(state));
        pauseBtn.setAttribute('aria-label', state ? 'Relancer le défilement automatique' : 'Mettre le défilement automatique en pause');
        pauseBtn.firstElementChild.innerHTML = `<use href="#${state ? 'i-play' : 'i-pause'}"/>`;
        if (!state && !bar) runBar();
      }
    };
    pauseBtn.addEventListener('click', () => setPause(!userPaused, true));
    const area = stage.closest('.reviews__grid');
    area.addEventListener('pointerenter', () => { if (!userPaused) setPause(true); });
    area.addEventListener('pointerleave', () => { if (!userPaused) setPause(false); });
    area.addEventListener('focusin', () => { if (!userPaused) setPause(true); });
    area.addEventListener('focusout', () => { if (!userPaused) setPause(false); });

    // Balayage
    let sx = null;
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; stage.style.cursor = 'grabbing'; });
    const endDrag = (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null; stage.style.cursor = '';
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', () => { sx = null; stage.style.cursor = ''; });

    if (reduce) { pauseBtn.setAttribute('aria-pressed', 'true'); pauseBtn.firstElementChild.innerHTML = '<use href="#i-play"/>'; }

    // Démarre le défilement automatique quand la section est visible
    if ('IntersectionObserver' in window && !reduce) {
      let started = false;
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !started) { started = true; runBar(); }
          else if (!en.isIntersecting && bar && !userPaused) { paused = true; bar.pause(); }
          else if (en.isIntersecting && started && !userPaused && !area.matches(':hover')) { paused = false; if (bar) bar.resume(); }
        });
      }, { threshold: 0.35 }).observe(stage);
    }
  }

  initStatus();
  initTabs();
  initReviews();

  /* ------------------------------------------------------------------------
     Sans GSAP ou mouvement réduit : on affiche tout, sans mise en scène
     ------------------------------------------------------------------------ */
  const finishPlain = () => {
    if (loader) loader.remove();
    html.classList.remove('is-loading');
    $$('.odo').forEach(buildOdo);
    $$('.odo').forEach((o) => $$('.odo__strip', o).forEach((s) => { s.style.transform = `translateY(-${(Number(s.dataset.d) + 10) * 5}%)`; }));
    $$('[data-split]').forEach((el) => splitText(el, el.dataset.split));
    const fab = $('#fab');
    if (fab) {
      const toggle = () => fab.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7);
      window.addEventListener('scroll', toggle, { passive: true }); toggle();
    }
    const prog = $('#progress span');
    const onScroll = () => {
      const max = doc.documentElement.scrollHeight - window.innerHeight;
      if (prog) prog.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      header.classList.toggle('is-solid', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  };

  if (!hasGsap) { finishPlain(); return; }
  if (reduce) { gsap.registerPlugin(ScrollTrigger); finishPlain(); return; }

  /* ========================================================================
     MOUVEMENT
     ======================================================================== */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: 'power3.out' });
  html.classList.add('is-loading');

  // Découpe de texte : mots (masque qui monte) ou lettres
  function splitText(el, mode) {
    if (el.dataset.splitDone) return mode === 'chars' ? $$('.c', el) : $$('.wi', el);
    const raw = el.textContent.replace(/\s+/g, ' ').trim();
    const frag = doc.createDocumentFragment();
    const sr = mk('span', 'sr-only'); sr.textContent = raw; frag.appendChild(sr);
    raw.split(' ').forEach((word, i, arr) => {
      const w = mk('span', 'w'); w.setAttribute('aria-hidden', 'true');
      const inner = mk('span', 'wi');
      if (mode === 'chars') Array.from(word).forEach((ch) => { const c = mk('span', 'c'); c.textContent = ch; inner.appendChild(c); });
      else inner.textContent = word;
      w.appendChild(inner); frag.appendChild(w);
      if (i < arr.length - 1) frag.appendChild(doc.createTextNode(' '));
    });
    el.textContent = ''; el.appendChild(frag); el.dataset.splitDone = '1';
    return mode === 'chars' ? $$('.c', el) : $$('.wi', el);
  }
  window.splitText = splitText;

  // Compteur à rouleaux
  function buildOdo(el) {
    const v = String(el.dataset.value);
    el.textContent = '';
    Array.from(v).forEach((d) => {
      const col = mk('span', 'odo__col'); col.setAttribute('aria-hidden', 'true');
      const strip = mk('span', 'odo__strip'); strip.dataset.d = d;
      for (let k = 0; k < 20; k++) { const s = mk('span'); s.textContent = k % 10; strip.appendChild(s); }
      col.appendChild(strip); el.appendChild(col);
    });
  }

  // Défilement fluide
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  // En-tête, progression, bouton flottant
  const progress = $('#progress span');
  const setProgress = gsap.quickSetter(progress, 'scaleX');
  const fab = $('#fab');
  let lastY = 0;
  const onScroll = (y) => {
    const max = doc.documentElement.scrollHeight - window.innerHeight;
    setProgress(max > 0 ? Math.min(1, y / max) : 0);
    header.classList.toggle('is-solid', y > 80);
    const dy = y - lastY;
    if (Math.abs(dy) > 4) {
      header.classList.toggle('is-hidden', dy > 0 && y > 260 && !menuOpen);
      lastY = y;
    }
    if (fab) fab.classList.toggle('is-visible', y > window.innerHeight * 0.75);
  };
  lenis.on('scroll', (e) => onScroll(e.scroll));
  window.addEventListener('scroll', () => { if (lenis.isStopped) onScroll(window.scrollY); }, { passive: true });

  // Découpes (avant toute mesure)
  const heroChars = $$('.hero__line').flatMap((l) => splitText(l, 'chars'));
  $$('.split-words').forEach((el) => splitText(el, 'words'));
  const footerChars = splitText($('.footer__word'), 'chars');
  $$('.odo').forEach(buildOdo);

  /* ---------- Préchargeur ---------- */
  const countEl = $('#loaderCount');
  const loaderPaths = $$('.loader__path');
  gsap.set(loaderPaths, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('.loader__name span', { yPercent: 120 });
  gsap.set('.loader__sub', { autoAlpha: 0, y: 12 });

  // États initiaux du hero (le préchargeur les cache)
  gsap.set(heroChars, { yPercent: 125, rotate: 7 });
  gsap.set(['.hero__tag', '.hero__lede', '.hero__actions', '.hero .status'], { autoAlpha: 0, y: 34 });
  gsap.set('.niche', { yPercent: 38, autoAlpha: 0 });
  gsap.set('.niche img', { scale: 1.35 });
  gsap.set('.led--hero', { scaleX: 0 });
  gsap.set('.seal', { scale: 0.3, autoAlpha: 0 });
  gsap.set('.petal', { scale: 0, autoAlpha: 0 });
  gsap.set('.site-header', { yPercent: -100 });

  const imgs = $$('.hero img').map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  const fontsReady = (doc.fonts && doc.fonts.ready) ? doc.fonts.ready : Promise.resolve();
  const pageReady = Promise.race([
    Promise.all([fontsReady, ...imgs]),
    new Promise((r) => setTimeout(r, 5000)),
  ]);

  let heroReady = false;
  const counter = { v: 0 };
  const loadTl = gsap.timeline();
  loadTl
    .to(loaderPaths, { strokeDashoffset: 0, duration: 1.5, stagger: 0.25, ease: 'power2.inOut' }, 0)
    .to('.loader__name span', { yPercent: 0, duration: 1, stagger: 0.12, ease: 'expo.out' }, 0.35)
    .to('.loader__sub', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.7)
    .to(counter, { v: 100, duration: 1.7, ease: 'power1.inOut', onUpdate: () => { countEl.textContent = Math.round(counter.v); } }, 0);

  Promise.all([loadTl.then(), pageReady]).then(() => {
    countEl.textContent = '100';
    const exit = gsap.timeline({ onComplete: onReady });
    exit
      .to('.loader__label', { y: -30, autoAlpha: 0, duration: 0.55, ease: 'power2.in' })
      .to('.loader__door--l', { xPercent: -101, duration: 1.25, ease: 'expo.inOut' }, 0.35)
      .to('.loader__door--r', { xPercent: 101, duration: 1.25, ease: 'expo.inOut' }, 0.35)
      .add(() => { heroIn().eventCallback('onComplete', () => { heroReady = true; }); }, 0.75);
  });

  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.site-header', { yPercent: 0, duration: 1.1, clearProps: 'transform', onComplete: () => header.classList.add('is-ready') }, 0.2)
      .to(heroChars, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.055 }, 0)
      .to('.led--hero', { scaleX: 1, duration: 1.8, ease: 'power3.inOut' }, 0.15)
      .to('.niche', { yPercent: 0, autoAlpha: 1, duration: 1.5, stagger: 0.14 }, 0.25)
      .to('.niche img', { scale: 1, duration: 2.2, stagger: 0.14 }, 0.25)
      .to(['.hero__tag', '.hero__lede', '.hero__actions', '.hero .status'], { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.7)
      .to('.seal', { scale: 1, autoAlpha: 1, duration: 1.4, ease: 'back.out(1.5)' }, 0.9)
      .to('.petal', { scale: 1, autoAlpha: (i, el) => (el.classList.contains('petal--4') ? 0.55 : el.classList.contains('petal--5') ? 0.7 : 0.9), duration: 1.2, stagger: 0.1, ease: 'back.out(2)' }, 1);
    return tl;
  }

  function onReady() {
    if (loader) loader.remove();
    html.classList.remove('is-loading');
    lenis.start();
    ScrollTrigger.refresh();
  }

  /* ---------- Hero : parallaxe multicouche, souris, ambiance ---------- */
  const heroLayers = $$('.hero [data-depth]');
  heroLayers.forEach((el) => {
    const depth = parseFloat(el.dataset.depth);
    gsap.to(el, { y: -(depth - 0.5) * 140, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });
  gsap.to('.hero__glow', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  const spin = gsap.to('.seal svg', { rotation: 360, transformOrigin: '50% 50%', duration: 28, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom top',
    onUpdate: (self) => gsap.to(spin, { timeScale: 1 + Math.min(Math.abs(self.getVelocity()) / 220, 9), duration: 0.3, overwrite: true, onComplete: () => gsap.to(spin, { timeScale: 1, duration: 1.4 }) }),
  });
  $$('.petal').forEach((p, i) => {
    gsap.to(p, { rotation: i % 2 ? '+=55' : '-=55', duration: 5 + i * 1.3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  if (fine) {
    const hero = $('.hero');
    const movers = heroLayers.map((el) => {
      const depth = parseFloat(el.dataset.depth);
      const small = el.classList.contains('petal');
      const k = small ? depth * 70 : depth * 2.6;
      return { x: gsap.quickTo(el, 'xPercent', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(el, 'yPercent', { duration: 1.2, ease: 'power3' }), k };
    });
    hero.addEventListener('pointermove', (e) => {
      if (!heroReady) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => { m.x(-nx * m.k); m.y(-ny * m.k * 0.7); });
    });
    hero.addEventListener('pointerleave', () => movers.forEach((m) => { m.x(0); m.y(0); }));
  }

  /* ---------- Boutons magnétiques ---------- */
  if (fine) {
    $$('[data-magnetic]').forEach((btn) => {
      const label = $('.btn__label', btn);
      const bx = gsap.quickTo(btn, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.55)' });
      const by = gsap.quickTo(btn, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.55)' });
      const lx = label ? gsap.quickTo(label, 'x', { duration: 0.6, ease: 'power3' }) : null;
      const ly = label ? gsap.quickTo(label, 'y', { duration: 0.6, ease: 'power3' }) : null;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        bx(dx * 0.32); by(dy * 0.45);
        if (lx) { lx(dx * 0.14); ly(dy * 0.2); }
      });
      btn.addEventListener('pointerleave', () => { bx(0); by(0); if (lx) { lx(0); ly(0); } });
    });
  }

  /* ---------- Inclinaison 3D + reflet ---------- */
  if (fine) {
    const bindTilt = (el, max, glareEl) => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
      const gx = glareEl ? gsap.quickTo(glareEl, 'x', { duration: 0.5, ease: 'power3' }) : null;
      const gy = glareEl ? gsap.quickTo(glareEl, 'y', { duration: 0.5, ease: 'power3' }) : null;
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rx(-py * max); ry(px * max * 1.2);
        if (gx) { gx(px * r.width * 0.9); gy(py * r.height * 0.9); }
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); if (gx) { gx(0); gy(0); } });
    };
    $$('[data-tilt]').forEach((el) => bindTilt(el, 9, $('.glare', el)));
    $$('[data-tilt-soft]').forEach((el) => bindTilt(el, 5, null));
  }

  /* ---------- Titres : mots qui montent ---------- */
  $$('.split-words').forEach((el) => {
    if (el.closest('.shelf')) return; // géré par le défilement horizontal
    const words = $$('.wi', el);
    gsap.from(words, { yPercent: 118, rotate: 4, duration: 1.3, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  /* ---------- Marquee : vitesse et sens liés au défilement ---------- */
  $$('.marquee__row').forEach((row) => {
    const track = $('.marquee__track', row);
    const dir = Number(row.dataset.dir) || -1;
    const original = Array.from(track.children);
    const set = mk('div', 'marquee__set');
    original.forEach((n) => set.appendChild(n));
    track.appendChild(set);
    const copies = 3;
    for (let i = 0; i < copies; i++) { const c = set.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); }
    const share = 100 / (copies + 1);
    const base = dir === -1
      ? gsap.fromTo(track, { xPercent: 0 }, { xPercent: -share, duration: 34, ease: 'none', repeat: -1 })
      : gsap.fromTo(track, { xPercent: -share }, { xPercent: 0, duration: 40, ease: 'none', repeat: -1 });
    row._tween = base;
  });
  let marqueeIdle;
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 260, 8);
      const sign = self.direction === 1 ? 1 : -1;
      $$('.marquee__row').forEach((r) => gsap.to(r._tween, { timeScale: sign * boost, duration: 0.25, overwrite: true }));
      clearTimeout(marqueeIdle);
      marqueeIdle = setTimeout(() => $$('.marquee__row').forEach((r) => gsap.to(r._tween, { timeScale: 1, duration: 1.4, overwrite: true })), 140);
    },
  });

  /* ---------- Histoire (épinglée) et services (horizontal) ---------- */
  const mm = gsap.matchMedia();
  const stepEls = $$('.step');
  const rail = $$('.story__rail li');

  mm.add('(min-width: 900px) and (min-height: 620px)', () => {
    const n = stepEls.length;
    const parts = stepEls.map((s) => ({ el: s, copy: $$('.step__n, h3, p', s), media: $('.step__media', s), img: $('img', s) }));
    gsap.set(parts.slice(1).map((p) => p.el), { autoAlpha: 0 });
    parts.slice(1).forEach((p) => {
      gsap.set(p.copy, { y: 56, opacity: 0 });
      gsap.set(p.img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.3 });
    });
    // Entrée de la première étape
    gsap.from(parts[0].copy, { y: 56, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.story', start: 'top 62%', once: true } });
    gsap.from(parts[0].img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.3, duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.story', start: 'top 62%', once: true } });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: '.story__pin', start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 3.4),
        pin: '.story__pin', scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const time = self.progress * tl.duration();
          const active = Math.min(n - 1, Math.floor(time + 0.3));
          rail.forEach((li, i) => li.classList.toggle('is-on', i === active));
          gsap.set('.story__rail-fill', { scaleX: Math.max(0.01, self.progress) });
        },
      },
    });
    for (let i = 1; i < n; i++) {
      const prev = parts[i - 1]; const cur = parts[i];
      const t = (i - 1) + 0.7;
      tl.to(prev.copy, { y: -56, opacity: 0, duration: 0.24, stagger: 0.03 }, t)
        .to(prev.img, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.3 }, t)
        .set(cur.el, { autoAlpha: 1 }, t)
        .to(cur.img, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.4 }, t + 0.05)
        .to(cur.copy, { y: 0, opacity: 1, duration: 0.28, stagger: 0.04 }, t + 0.1)
        .set(prev.el, { autoAlpha: 0 }, t + 0.32);
    }
    tl.to({}, { duration: 0.7 }, n - 1);
    return () => rail.forEach((li, i) => li.classList.toggle('is-on', i === 0));
  });

  mm.add('(max-width: 899px), (max-height: 619px)', () => {
    stepEls.forEach((s) => {
      gsap.from($$('.step__n, h3, p', s), { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 82%', once: true } });
      gsap.from($('.step__media img', s), { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.25, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: s, start: 'top 85%', once: true } });
    });
    // Titres de l'étagère (pas de piste horizontale épinglée ici)
    $$('.shelf .split-words').forEach((el) => gsap.from($$('.wi', el), { yPercent: 118, duration: 1.2, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  });

  mm.add('(min-width: 900px) and (min-height: 620px)', () => {
    const track = $('.shelf__track');
    const bar = $('.shelf__progress span');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const slide = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.shelf', start: 'top top', end: () => '+=' + dist(),
        pin: '.shelf__pin', scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
      },
    });
    // Titre d'introduction
    gsap.from($$('.shelf__intro .wi'), { yPercent: 118, rotate: 4, duration: 1.3, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.shelf', start: 'top 70%', once: true } });
    gsap.from('.shelf__intro p, .shelf__hint', { y: 30, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.shelf', start: 'top 60%', once: true } });
    // Les étiquettes se posent sur l'étagère quand elles entrent à droite
    $$('.label, .shelf__outro').forEach((el, i) => {
      gsap.from(el, {
        y: 140, opacity: 0, rotation: i % 2 ? 4 : -4, duration: 1.3, ease: 'expo.out',
        scrollTrigger: { trigger: el, containerAnimation: slide, start: 'left 96%', toggleActions: 'play none none reverse' },
      });
    });
    // Intro : le titre glisse plus lentement que la piste
    gsap.to('.shelf__intro', { x: () => dist() * 0.12, ease: 'none', scrollTrigger: { trigger: '.shelf', start: 'top top', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true } });
  });

  // Étiquettes en mode défilement natif (mobile) : entrée simple
  mm.add('(max-width: 899px), (max-height: 619px)', () => {
    $$('.label').forEach((el, i) => gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', delay: Math.min(i, 2) * 0.08, scrollTrigger: { trigger: '.shelf__track', start: 'top 85%', once: true } }));
  });

  /* ---------- Tarifs : entrée ---------- */
  gsap.from('.tarifs__head p', { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.tarifs__head', start: 'top 80%', once: true } });
  gsap.from('.tab', { x: -30, opacity: 0, duration: 1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.tabs', start: 'top 85%', once: true } });
  gsap.from('.panel.is-active .panel__title, .panel.is-active .rows > li, .panel.is-active .panel__note', { y: 30, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.panels', start: 'top 85%', once: true } });

  /* ---------- Chiffres : rouleaux ---------- */
  $$('.ledger__row').forEach((row) => {
    const odo = $('.odo', row);
    const strips = $$('.odo__strip', odo);
    gsap.from(row, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 88%', once: true } });
    gsap.to(strips, {
      yPercent: (i, el) => -((Number(el.dataset.d) + 10) * 5),
      duration: 2.6, ease: 'expo.out', stagger: 0.18,
      scrollTrigger: { trigger: row, start: 'top 80%', once: true },
    });
    gsap.from($$('p', row), { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.3, scrollTrigger: { trigger: row, start: 'top 80%', once: true } });
  });

  /* ---------- Galerie : révélations par forme, parallaxe, Ken Burns ---------- */
  const reveals = {
    arch: { from: 'inset(100% 0% 0% 0%)', to: 'inset(0% 0% 0% 0%)' },
    oval: { from: 'circle(0% at 50% 50%)', to: 'circle(75% at 50% 50%)' },
    round: { from: 'circle(0% at 50% 100%)', to: 'circle(80% at 50% 50%)' },
    wide: { from: 'inset(0% 100% 0% 0%)', to: 'inset(0% 0% 0% 0%)' },
    petal: { from: 'inset(0% 0% 100% 0%)', to: 'inset(0% 0% 0% 0%)' },
  };
  $$('.shot').forEach((shot) => {
    const kind = Object.keys(reveals).find((k) => shot.classList.contains('shot--' + k));
    const frame = $('.shot__frame', shot);
    const img = $('img', shot);
    const speed = Number(shot.dataset.speed) || 0;
    gsap.fromTo(frame, { clipPath: reveals[kind].from }, { clipPath: reveals[kind].to, duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: shot, start: 'top 85%', once: true } });
    gsap.fromTo(shot, { yPercent: -speed }, { yPercent: speed, ease: 'none', scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo(img, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1, ease: 'none', scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from($('figcaption', shot), { y: 20, opacity: 0, duration: 1, delay: 0.5, ease: 'expo.out', scrollTrigger: { trigger: shot, start: 'top 80%', once: true } });
  });

  /* ---------- Avis : entrée ---------- */
  gsap.from('.reviews__stage', { y: 50, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.reviews__grid', start: 'top 80%', once: true } });
  gsap.from('.pick', { y: 30, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.reviews__list', start: 'top 85%', once: true } });

  /* ---------- Appel à l'action ---------- */
  gsap.from('.cta__lede, .cta__actions, .cta__gift', { y: 40, opacity: 0, duration: 1.2, stagger: 0.14, ease: 'expo.out', scrollTrigger: { trigger: '.cta__lede', start: 'top 88%', once: true } });
  $$('.cta__petals i').forEach((p, i) => {
    gsap.from(p, { scale: 0, duration: 1.6, delay: i * 0.12, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.cta', start: 'top 70%', once: true } });
    gsap.to(p, { y: i % 2 ? -50 : 60, rotation: i % 2 ? 40 : -40, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });

  /* ---------- Nous trouver ---------- */
  gsap.from('.mapbox', { clipPath: 'circle(0% at 0% 100%)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: '.find', start: 'top 70%', once: true } });
  gsap.from('.find address p, .hours', { y: 40, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.find__card', start: 'top 78%', once: true } });

  /* ---------- Pied de page ---------- */
  gsap.from(footerChars, { yPercent: 110, duration: 1.4, stagger: 0.045, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 80%', once: true } });
  if (fine) footerChars.forEach((ch) => {
    ch.addEventListener('pointerenter', () => gsap.to(ch, { yPercent: -7, duration: 0.45, ease: 'power3.out', overwrite: 'auto' }));
    ch.addEventListener('pointerleave', () => gsap.to(ch, { yPercent: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' }));
  });
  gsap.from('.led--footer', { scaleX: 0, duration: 2, ease: 'power3.inOut', scrollTrigger: { trigger: '.footer', start: 'top 90%', once: true } });
  gsap.from('.footer__cols > *', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.footer__cols', start: 'top 92%', once: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
