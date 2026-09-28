(() => {
  'use strict';
  const body = document.body;
  const mosaic = document.querySelector('.mosaic');
  const grid = document.createElement('div');
  grid.className = 'mosaic-grid';
  function sizeMosaic() {
    const size = window.innerWidth < 600 ? 28 : 40;
    const columns = Math.ceil(window.innerWidth / size) + 2;
    const rows = Math.ceil(window.innerHeight / size) + 2;
    grid.style.setProperty('--tile-size', `${size}px`);
    grid.style.gridTemplateColumns = `repeat(${columns}, ${size}px)`;
    const tiles = document.createDocumentFragment();
    for (let i = 0; i < columns * rows; i++) {
      const tile = document.createElement('i');
      tile.style.setProperty('--tone', String(((i * 37 + 13) % 11) / 40));
      tile.style.setProperty('--delay', `${-((i * 7) % 13)}s`);
      tiles.append(tile);
    }
    grid.replaceChildren(tiles);
  }
  sizeMosaic();
  let mosaicResize;
  window.addEventListener('resize', () => {
    clearTimeout(mosaicResize);
    mosaicResize = setTimeout(sizeMosaic, 150);
  });
  mosaic.append(grid);
  document.querySelectorAll('.work-word, .client-word').forEach(heading => {
    heading.setAttribute('aria-label', heading.textContent);
    let order = 0;
    [...heading.children].forEach(word => {
      const text = word.textContent;
      word.textContent = '';
      word.setAttribute('aria-hidden', 'true');
      for (const char of text) {
        const letter = document.createElement('span');
        letter.className = 'glyph';
        letter.textContent = char;
        letter.style.setProperty('--order', order++);
        word.append(letter);
      }
    });
  });

  // Clip text rows using the measured 450ms reference reveal timing.
  document.querySelectorAll('.display.reveal:not(.work-word):not(.client-word):not(.about-title):not(.connect)').forEach(heading => {
    const mask = document.createElement('span');
    const line = document.createElement('span');
    mask.className = 'title-mask';
    line.className = 'title-line';
    while (heading.firstChild) line.append(heading.firstChild);
    mask.append(line);
    heading.append(mask);
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phone = window.matchMedia('(max-width: 600px)');
  const toggle = document.querySelector('.motion-toggle');
  const nav = document.getElementById('navLinks');
  const burger = document.getElementById('burger');
  const videos = [...document.querySelectorAll('.workflow-film, .showcase-film')];
  let paused = false;
  let navigating = false;
  try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch { /* Storage is optional. */ }
  const motionAllowed = () => !paused && !reduced.matches;
  function updateMotion() {
    body.classList.toggle('motion-paused', !motionAllowed());
    toggle.textContent = reduced.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
    toggle.setAttribute('aria-pressed', String(!motionAllowed()));
    toggle.disabled = reduced.matches;
    if (!motionAllowed()) videos.forEach(video => video.pause());
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'playing'); } catch { /* Continue without persistence. */ }
    updateMotion();
  });
  reduced.addEventListener('change', updateMotion);
  updateMotion();
  // Content stays visible until observation is ready; failed initialization never hides it.
  if ('IntersectionObserver' in window) {
    const reveals = [...document.querySelectorAll('.reveal')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    reveals.forEach(element => observer.observe(element));
    body.classList.add('motion-ready');
    const started = new WeakSet();
    const films = new IntersectionObserver(entries => entries.forEach(entry => {
      const video = entry.target;
      if (!entry.isIntersecting) { video.pause(); return; }
      if (motionAllowed() && !started.has(video) && !document.hidden) {
        started.add(video);
        video.play().catch(() => { /* Native controls remain available when autoplay is blocked. */ });
      }
    }), { threshold: 0.4 });
    videos.forEach(video => films.observe(video));
  }
  document.addEventListener('visibilitychange', () => {
    body.classList.toggle('tab-hidden', document.hidden);
    if (document.hidden) videos.forEach(video => video.pause());
  });
  const scrollState = () => body.classList.toggle('scrolled', window.scrollY > 65);
  window.addEventListener('scroll', scrollState, { passive: true });
  scrollState();
  const normalizePage = pathname => pathname.replace(/\.html$/, '').replace(/\/$/, '').replace(/^\/index$/, '') || '/';
  const path = normalizePage(location.pathname);
  nav.querySelectorAll('a').forEach(link => {
    const section = ['/somahub', '/khamis-computers', '/halaal-charitable-trust', '/school-system'].includes(path) ? '/work' : path === '/services' ? '/about' : path;
    if (normalizePage(link.pathname) === section) link.setAttribute('aria-current', 'page');
  });
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  function syncMenu() {
    const open = phone.matches && burger.getAttribute('aria-expanded') === 'true';
    nav.inert = phone.matches && !open;
    main.inert = open;
    footer.inert = open;
    toggle.inert = open;
    document.querySelector('.brand').inert = open;
    document.querySelector('.social-link').inert = open;
    if (open) nav.querySelector('a').focus();
  }
  new MutationObserver(syncMenu).observe(burger, { attributes: true, attributeFilter: ['aria-expanded'] });
  phone.addEventListener('change', syncMenu);
  syncMenu();
  document.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || !phone.matches || burger.getAttribute('aria-expanded') !== 'true') return;
    const links = [...nav.querySelectorAll('a')];
    const first = links[0];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); burger.focus(); }
    else if (!event.shiftKey && document.activeElement === burger) { event.preventDefault(); first.focus(); }
  });
  if (motionAllowed()) {
    body.classList.add('entering');
    window.setTimeout(() => body.classList.remove('entering'), 850);
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !['http:', 'https:'].includes(destination.protocol) || destination.pathname === location.pathname || !motionAllowed()) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    body.classList.remove('entering');
    body.classList.add('leaving');
    window.setTimeout(() => location.assign(destination.href), 430);
  });
  window.addEventListener('pageshow', () => {
    navigating = false;
    body.classList.remove('leaving', 'menu-open');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open navigation');
    syncMenu();
    scrollState();
  });
})();
