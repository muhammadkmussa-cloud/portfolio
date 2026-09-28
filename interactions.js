(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const allowed = () => !reduced.matches && !document.body.classList.contains('motion-paused') && !document.hidden;
  const clamp = value => Math.max(0, Math.min(1, value));
  const headings = [...document.querySelectorAll('.work-word, .client-word, .about-name, .connect')].map(element => ({ element, parts: [...element.children], offsets: [], note: element.parentElement.querySelector('.split-note') }));
  let headingFrame = 0;
  function paintHeadings() {
    headingFrame = 0;
    for (const { element, parts, offsets, note } of headings) {
      const progress = allowed() ? clamp((innerHeight * .9 - element.getBoundingClientRect().top) / (innerHeight * .6)) : 1;
      parts.forEach((part, i) => { part.style.translate = `${(offsets[i] || 0) * (1 - progress)}px 0`; });
      if (note) {
        const left = parts[0].getBoundingClientRect(), right = parts[1].getBoundingClientRect();
        const wrapper = element.parentElement.getBoundingClientRect();
        const mobile = innerWidth <= 600;
        const gap = right.left - left.right;
        const reveal = allowed() ? clamp((progress - .62) / .3) : 1;
        note.style.setProperty('--note-reveal', String(!mobile && gap < 180 ? 0 : reveal));
        note.style.setProperty('--note-y', `${left.top + left.height / 2 - wrapper.top}px`);
        note.style.setProperty('--note-x', `${(left.right + right.left) / 2 - wrapper.left}px`);
        note.style.setProperty('--note-width', `${Math.max(0, gap - 32)}px`);
      }
    }
  }
  function requestHeadings() {
    if (!headingFrame) headingFrame = requestAnimationFrame(paintHeadings);
  }
  function measureHeadings() {
    for (const heading of headings) {
      heading.parts.forEach(part => { part.style.translate = 'none'; });
      const rect = heading.element.getBoundingClientRect();
      const boxes = heading.parts.map(part => part.getBoundingClientRect());
      let cursor = rect.left + (rect.width - boxes.reduce((total, box) => total + box.width, 0)) / 2;
      heading.offsets = boxes.map(box => {
        const offset = cursor - box.left;
        cursor += box.width;
        return offset;
      });
    }
    paintHeadings();
  }
  window.addEventListener('scroll', requestHeadings, { passive: true });
  window.addEventListener('resize', measureHeadings);
  document.fonts.ready.then(measureHeadings);
  measureHeadings();

  // Draw only while a pointer disturbs an image; original media stays underneath.
  const effects = [...document.querySelectorAll('main img:not(.brand img), main video')].map(media => {
    const host = media.parentElement;
    if (media instanceof HTMLImageElement) media.draggable = false;
    host.classList.add('pixel-host');
    const canvas = document.createElement('canvas');
    canvas.className = 'pixel-interaction';
    canvas.setAttribute('aria-hidden', 'true');
    host.append(canvas);
    const context = canvas.getContext('2d');
    const buffer = document.createElement('canvas');
    const sourceContext = buffer.getContext('2d');
    if (!context || !sourceContext) { canvas.remove(); return { stop() {} }; }
    const poster = media instanceof HTMLVideoElement && media.poster ? new Image() : null;
    if (poster) poster.src = media.poster;
    let pointer = null, frame = 0, lastTime = 0;
    let width = 0, height = 0, ratio = 1, cells = [];
    const limit = (value, min, max) => Math.max(min, Math.min(max, value));
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0; pointer = null; lastTime = 0;
      cells.forEach(cell => { cell.x = cell.y = cell.tx = cell.ty = 0; });
      canvas.style.opacity = '0';
    }
    function draw(time) {
      frame = 0;
      if (!allowed() || !finePointer.matches) { stop(); return; }
      const dt = lastTime ? Math.min(2, (time - lastTime) / 16.667) : 1;
      lastTime = time;
      const source = media instanceof HTMLVideoElement ? (media.readyState >= 2 ? media : poster) : media;
      const sw = source?.videoWidth || source?.naturalWidth;
      const sh = source?.videoHeight || source?.naturalHeight;
      if (!sw || !sh) { stop(); return; }
      sourceContext.clearRect(0, 0, width, height);
      const scale = getComputedStyle(media).objectFit === 'contain' ? Math.min(width / sw, height / sh) : Math.max(width / sw, height / sh);
      sourceContext.drawImage(source, (width - sw * scale) / 2, (height - sh * scale) / 2, sw * scale, sh * scale);
      context.clearRect(0, 0, width, height);
      context.drawImage(buffer, 0, 0, width, height);
      let active = false;
      for (const cell of cells) {
        const response = 1 - Math.pow(.78, dt);
        cell.x += (cell.tx - cell.x) * response;
        cell.y += (cell.ty - cell.y) * response;
        cell.tx *= Math.pow(.945, dt);
        cell.ty *= Math.pow(.945, dt);
        if (Math.max(Math.abs(cell.x), Math.abs(cell.y), Math.abs(cell.tx), Math.abs(cell.ty)) < .08) continue;
        active = true;
        const sx = limit(cell.left + cell.x, 0, width - cell.w);
        const sy = limit(cell.top + cell.y, 0, height - cell.h);
        // Keep the full photograph texture within each square, shifting its UV sample.
        context.clearRect(cell.left, cell.top, cell.w, cell.h);
        context.drawImage(buffer, sx * ratio, sy * ratio, cell.w * ratio, cell.h * ratio,
          cell.left, cell.top, cell.w, cell.h);
      }
      if (!active) { stop(); return; }
      canvas.style.opacity = '1';
      frame = requestAnimationFrame(draw);
    }
    host.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || !allowed() || !finePointer.matches) return;
      const rect = media.getBoundingClientRect(), parent = host.getBoundingClientRect();
      const next = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (next.x < 0 || next.x > rect.width || next.y < 0 || next.y > rect.height) { pointer = null; return; }
      width = Math.round(rect.width); height = Math.round(rect.height);
      if (!width || !height) return;
      ratio = Math.min(devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = buffer.width = Math.round(width * ratio);
        canvas.height = buffer.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        sourceContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        const tile = limit(Math.round(width / 15), 18, 38);
        cells = [];
        for (let y = 0; y < height; y += tile) for (let x = 0; x < width; x += tile) {
          cells.push({ left:x, top:y, w:Math.min(tile, width-x), h:Math.min(tile, height-y), x:0, y:0, tx:0, ty:0 });
        }
      }
      canvas.style.left = `${rect.left - parent.left}px`;
      canvas.style.top = `${rect.top - parent.top}px`;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      const vx = pointer ? limit(next.x - pointer.x, -35, 35) : 8;
      const vy = pointer ? limit(next.y - pointer.y, -35, 35) : 4;
      const radius = Math.min(width * .4, 170);
      cells.forEach((cell, index) => {
        const dx = cell.left + cell.w / 2 - next.x, dy = cell.top + cell.h / 2 - next.y;
        const distance = Math.hypot(dx, dy);
        if (distance > radius) return;
        const falloff = (1 - distance / radius) ** 1.5;
        const variation = .65 + ((index * 13) % 11) / 15;
        cell.tx = limit(cell.tx + (vx * 1.8 + dx * .18) * falloff * variation, -65, 65);
        cell.ty = limit(cell.ty + (vy * 1.8 + dy * .18) * falloff * variation, -65, 65);
      });
      pointer = next;
      if (!frame) { lastTime = 0; frame = requestAnimationFrame(draw); }
    });
    host.addEventListener('pointerleave', () => { pointer = null; });
    return { stop };
  });
  function syncMotion() {
    requestHeadings();
    if (!allowed() || !finePointer.matches) effects.forEach(effect => effect.stop());
  }
  new MutationObserver(syncMotion).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  reduced.addEventListener('change', syncMotion);
  finePointer.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('scroll', () => effects.forEach(effect => effect.stop()), { passive: true });
  window.addEventListener('resize', () => effects.forEach(effect => effect.stop()));
})();
