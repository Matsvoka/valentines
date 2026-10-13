// ── FLOATING PETALS ──
const petalEmojis = ['🌸','🌺','🌷','💮','🌹','💕','✿'];
const petalContainer = document.getElementById('petals');
for (let i = 0; i < 22; i++) {
  const el = document.createElement('span');
  el.className = 'petal';
  el.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  el.style.animationDuration = (8 + Math.random() * 12) + 's';
  el.style.animationDelay = (Math.random() * 14) + 's';
  petalContainer.appendChild(el);
}

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── SCRAPBOOK CUPID SHOOT ──
const sbCupidBtn  = document.getElementById('sbCupidBtn');
const sbCupidArea = document.getElementById('sbCupidArea');
const sbCupidHint = document.getElementById('sbCupidHint');
const sbLockEl    = document.getElementById('sbLock');
const sbLockHeart = document.getElementById('sbLockHeart');
const sbDrawer    = document.getElementById('sbDrawer');
let sbIsExpanded  = false;

function triggerSbRain() {
  const section   = document.getElementById('fotos');
  const lockRect  = sbLockEl.getBoundingClientRect();
  const sectRect  = section.getBoundingClientRect();
  const topOffset = lockRect.bottom - sectRect.top;

  const rain = document.createElement('div');
  rain.className = 'sb-emoji-rain';
  rain.style.top    = topOffset + 'px';
  rain.style.left   = '0'; rain.style.right = '0';
  rain.style.height = 'calc(100vh + 300px)';
  rain.style.bottom = 'unset';
  section.appendChild(rain);

  const emojis = ['💕','💗','💝','✨','🌸','🌺','💖','🌷','💞'];
  for (let i = 0; i < 36; i++) {
    const el = document.createElement('span');
    el.className = 'sb-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left              = (Math.random() * 100) + '%';
    el.style.fontSize          = (0.75 + Math.random() * 0.9) + 'rem';
    el.style.animationName     = Math.random() > 0.5 ? 'sbFallCW' : 'sbFallCCW';
    el.style.animationDuration = (4 + Math.random() * 6) + 's';
    el.style.animationDelay    = (Math.random() * 4) + 's';
    el.style.animationTimingFunction = 'linear';
    el.style.animationFillMode = 'forwards';
    rain.appendChild(el);
  }
  setTimeout(() => rain.remove(), 12000);
}

function expandScrapbook() {
  if (sbIsExpanded) return;
  sbIsExpanded = true;
  sbDrawer.style.height = sbDrawer.scrollHeight + 'px';
  sbDrawer.classList.add('expanded');
  sbDrawer.addEventListener('transitionend', () => {
    sbDrawer.style.height = 'auto';
    sbDrawer.style.overflow = 'visible';
  }, { once: true });
  triggerSbRain();
}

function shootArrow() {
  if (sbIsExpanded) return;
  sbCupidHint.style.opacity = '0';
  sbCupidArea.classList.add('hidden');

  const icon = sbCupidBtn.querySelector('.sb-cupid-icon');
  icon.style.animation = 'cupidShoot 0.38s ease forwards';

  const cupidR  = sbCupidBtn.getBoundingClientRect();
  const heartR  = sbLockEl.getBoundingClientRect();
  const sx = cupidR.left + cupidR.width  / 2;
  const sy = cupidR.top  + cupidR.height / 2;
  const ex = heartR.left + heartR.width  / 2;
  const ey = heartR.top  + heartR.height / 2;
  const angle    = Math.atan2(ey - sy, ex - sx) * (180 / Math.PI);
  const dist     = Math.hypot(ex - sx, ey - sy);
  const flightMs = Math.max(280, dist * 0.75);

  const arrow = document.createElement('span');
  arrow.id = 'sbArrow';
  arrow.textContent = '➤';
  arrow.style.left      = (sx - 12) + 'px';
  arrow.style.top       = (sy - 12) + 'px';
  arrow.style.transform = `rotate(${angle}deg)`;
  arrow.style.color     = 'var(--rose-deep)';
  arrow.style.textShadow = '0 2px 8px rgba(224,122,160,0.6)';
  arrow.style.transition =
    `left ${flightMs}ms cubic-bezier(0.4,0,1,1),` +
    `top  ${flightMs}ms cubic-bezier(0.4,0,1,1)`;
  document.body.appendChild(arrow);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    arrow.style.left = (ex - 12) + 'px';
    arrow.style.top  = (ey - 12) + 'px';
  }));

  setTimeout(() => {
    arrow.remove();
    sbLockHeart.src = 'images/heart_arrow.png';
    sbLockEl.style.animation = 'heartImpact 0.55s ease forwards';
    setTimeout(() => expandScrapbook(), 600);
  }, flightMs + 30);
}

function doCollapseAnimation() {
  const collapseBtn = document.getElementById('sbCollapseBtn');
  sbDrawer.style.overflow = 'hidden';
  const h = sbDrawer.scrollHeight;
  sbDrawer.style.transition = 'none';
  sbDrawer.style.height = h + 'px';
  void sbDrawer.offsetHeight;
  sbDrawer.style.transition = '';
  sbDrawer.classList.remove('expanded');
  sbDrawer.style.height = '0';
  sbDrawer.addEventListener('transitionend', () => {
    sbIsExpanded = false;
    sbLockHeart.src = 'images/heart.png';
    sbLockEl.style.animation = '';
    sbCupidBtn.querySelector('.sb-cupid-icon').style.animation = '';
    if (collapseBtn) collapseBtn.style.opacity = '';
    sbCupidArea.classList.remove('hidden');
    sbCupidHint.style.opacity = '';
  }, { once: true });
}

function collapseScrapbook() {
  if (!sbIsExpanded) return;
  const collapseBtn = document.getElementById('sbCollapseBtn');
  if (collapseBtn) collapseBtn.style.opacity = '0';

  const section  = document.getElementById('fotos');
  const targetY  = section.getBoundingClientRect().top + window.scrollY;
  const distance = Math.abs(window.scrollY - targetY);
  const scrollMs = distance < 50 ? 0 : Math.min(Math.max(distance * 0.3, 250), 550);

  section.scrollIntoView({ behavior: scrollMs > 0 ? 'smooth' : 'auto', block: 'start' });
  setTimeout(doCollapseAnimation, scrollMs + 40);
}

function navGoHome() {
  if (sbIsExpanded) doCollapseAnimation();
  if (window.resetEnvelope) window.resetEnvelope();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return false;
}

sbCupidBtn.addEventListener('click', shootArrow);
document.getElementById('sbCollapseBtn').addEventListener('click', collapseScrapbook);

// ── TIMER ──
const TIMER_UNITS = ['years', 'months', 'days', 'hours', 'mins', 'secs'];
let activeTimerUnits = new Set(TIMER_UNITS);

function computeTimer() {
  const start = new Date(2023, 2, 10);
  const now   = new Date();
  if (now < start) return {};
  const result = {};
  let ref = new Date(start);

  if (activeTimerUnits.has('years')) {
    let y = now.getFullYear() - start.getFullYear();
    let tmp = new Date(start); tmp.setFullYear(start.getFullYear() + y);
    if (tmp > now) { y--; tmp.setFullYear(start.getFullYear() + y); }
    result.years = y; ref = tmp;
  }

  if (activeTimerUnits.has('months')) {
    let m = (now.getFullYear() - ref.getFullYear()) * 12 + (now.getMonth() - ref.getMonth());
    let tmp = new Date(ref); tmp.setMonth(ref.getMonth() + m);
    if (tmp > now) { m--; tmp.setMonth(ref.getMonth() + m); }
    result.months = m; ref = tmp;
  }

  let ms = now - ref;
  if (activeTimerUnits.has('days'))  { result.days  = Math.floor(ms / 864e5); ms %= 864e5; }
  if (activeTimerUnits.has('hours')) { result.hours = Math.floor(ms / 36e5);  ms %= 36e5;  }
  if (activeTimerUnits.has('mins'))  { result.mins  = Math.floor(ms / 6e4);   ms %= 6e4;   }
  if (activeTimerUnits.has('secs'))  { result.secs  = Math.floor(ms / 1e3);   }
  return result;
}

function updateTimerSeps() {
  let seen = false;
  TIMER_UNITS.forEach(unit => {
    const sep = document.querySelector(`.timer-sep[data-sep="${unit}"]`);
    const on  = activeTimerUnits.has(unit);
    if (sep) sep.style.display = (seen && on) ? '' : 'none';
    if (on) seen = true;
  });
}

function updateTimer() {
  const v = computeTimer();
  const highestActive = TIMER_UNITS.find(u => activeTimerUnits.has(u));
  TIMER_UNITS.forEach(unit => {
    const el = document.getElementById('timer' + unit.charAt(0).toUpperCase() + unit.slice(1));
    if (!el) return;
    if (!activeTimerUnits.has(unit)) { el.textContent = '--'; return; }
    const val = v[unit] ?? 0;
    const minD = (unit === 'days' && highestActive === 'days') ? 3
               : (unit === 'years') ? 1 : 2;
    el.textContent = String(val).padStart(minD, '0');
  });
}

function toggleTimerUnit(unit) {
  if (activeTimerUnits.has(unit) && activeTimerUnits.size === 1) return;
  const wasActive = activeTimerUnits.has(unit);
  if (wasActive) activeTimerUnits.delete(unit); else activeTimerUnits.add(unit);
  document.querySelector(`.timer-unit[data-unit="${unit}"]`)
    .classList.toggle('disabled', wasActive);
  updateTimerSeps();
  updateTimer();
}

updateTimerSeps();
setInterval(updateTimer, 1000);
updateTimer();

// ── CAROUSEL (stacked effect) ──
const carouselEl  = document.querySelector('.carousel');
const track       = document.getElementById('carouselTrack');
const slides      = Array.from(track.querySelectorAll('.carousel-slide'));
const totalSlides = slides.length;
let currentSlide  = 0;
let autoPlay;

const SLIDE_PCT = 0.80;

function layout() {
  const w          = carouselEl.offsetWidth || 780;
  const slideW     = Math.round(w * SLIDE_PCT);
  const activeLeft = Math.round((w - slideW) / 2);
  const prevLeft   = 0;
  const nextLeft   = w - slideW;
  return { w, slideW, activeLeft, prevLeft, nextLeft };
}

function applyLayout() {
  const { slideW, activeLeft } = layout();
  slides.forEach(s => { s.style.width = slideW + 'px'; s.style.minWidth = slideW + 'px'; });
  const estimatedH = Math.round(slideW * 9 / 16 + 148);
  track.style.minHeight = estimatedH + 'px';
}

function updateCarouselUI() {
  const { activeLeft, prevLeft, nextLeft } = layout();
  const prevIdx = (currentSlide - 1 + totalSlides) % totalSlides;
  const nextIdx = (currentSlide + 1) % totalSlides;

  slides.forEach((slide, i) => {
    let left, zIndex, opacity, transform;

    if (i === currentSlide) {
      left = activeLeft; zIndex = 3; opacity = 1;
      transform = 'scale(1) translateY(0)';
      slide.classList.add('is-active');
    } else if (i === prevIdx) {
      left = prevLeft; zIndex = 2; opacity = 0.70;
      transform = 'scale(0.95) translateY(8px)';
      slide.classList.remove('is-active');
    } else if (i === nextIdx) {
      left = nextLeft; zIndex = 2; opacity = 0.70;
      transform = 'scale(0.95) translateY(8px)';
      slide.classList.remove('is-active');
    } else {
      left = activeLeft; zIndex = 1; opacity = 0;
      transform = 'scale(0.88) translateY(14px)';
      slide.classList.remove('is-active');
    }

    slide.style.left      = left + 'px';
    slide.style.zIndex    = zIndex;
    slide.style.opacity   = opacity;
    slide.style.transform = transform;
  });

  document.querySelectorAll('.carousel-dot')
    .forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function moveCarousel(dir) {
  const newCurrent = (currentSlide + dir + totalSlides) % totalSlides;
  const { prevLeft, nextLeft } = layout();

  const farIdx   = dir > 0
    ? (newCurrent + 1) % totalSlides
    : (newCurrent - 1 + totalSlides) % totalSlides;
  const farSlide = slides[farIdx];
  farSlide.style.transition = 'none';
  farSlide.style.left       = (dir > 0 ? nextLeft : prevLeft) + 'px';
  farSlide.style.opacity    = '0';
  farSlide.style.transform  = 'scale(0.95) translateY(8px)';
  void farSlide.offsetWidth;
  farSlide.style.transition = '';

  currentSlide = newCurrent;
  updateCarouselUI();
  resetAutoPlay();
}

function resetAutoPlay() {
  clearInterval(autoPlay);
  autoPlay = setInterval(() => moveCarousel(1), 5000);
}

applyLayout();
slides.forEach(s => s.style.transition = 'none');
updateCarouselUI();
function equalizeSlideHeights() {
  slides.forEach(s => { s.style.height = ''; });           // reset para medir natural
  const maxH = Math.max(...slides.map(s => s.offsetHeight));
  if (maxH > 0) {
    slides.forEach(s => s.style.height = maxH + 'px');     // força todos ao mesmo tamanho
    track.style.minHeight = '0';
    track.style.height = maxH + 'px';
  }
}

requestAnimationFrame(() => {
  equalizeSlideHeights();
  requestAnimationFrame(() => slides.forEach(s => s.style.transition = ''));
});

window.addEventListener('resize', () => {
  applyLayout();
  updateCarouselUI();
  requestAnimationFrame(() => equalizeSlideHeights());
});

// build dots
const dotsEl = document.getElementById('carouselDots');
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Slide ' + (i + 1));
  dot.addEventListener('click', () => { currentSlide = i; updateCarouselUI(); resetAutoPlay(); });
  dotsEl.appendChild(dot);
}
resetAutoPlay();

// ── DRAG (mouse + touch) ──
let dragStartX  = null;
let dragLastX   = null;
let dragActive  = false;
let touchStartY = null;
let touchLocked = false;

function activateDrag() {
  dragActive = true;
  slides.forEach(s => s.style.transition = 'none');
  carouselEl.classList.add('is-dragging');
}

function applyDragOffset(delta) {
  const { activeLeft } = layout();
  slides[currentSlide].style.left = (activeLeft + delta) + 'px';

  const prevIdx = (currentSlide - 1 + totalSlides) % totalSlides;
  const nextIdx = (currentSlide + 1) % totalSlides;
  const revealW = carouselEl.offsetWidth * 0.22;

  if (delta < 0) {
    const p = Math.min(-delta / revealW, 1);
    slides[nextIdx].style.zIndex    = '2';
    slides[nextIdx].style.transform = `scale(${0.95 + 0.05 * p}) translateY(${8 * (1 - p)}px)`;
    slides[nextIdx].style.opacity   = String(0.70 + 0.30 * p);
    slides[prevIdx].style.zIndex    = '1';
  } else if (delta > 0) {
    const p = Math.min(delta / revealW, 1);
    slides[prevIdx].style.zIndex    = '2';
    slides[prevIdx].style.transform = `scale(${0.95 + 0.05 * p}) translateY(${8 * (1 - p)}px)`;
    slides[prevIdx].style.opacity   = String(0.70 + 0.30 * p);
    slides[nextIdx].style.zIndex    = '1';
  }
}

function settleDrag() {
  slides.forEach(s => s.style.transition = '');
  carouselEl.classList.remove('is-dragging');
  const delta     = dragLastX - dragStartX;
  const threshold = carouselEl.offsetWidth * 0.12;
  if      (delta < -threshold) moveCarousel(1);
  else if (delta >  threshold) moveCarousel(-1);
  else                         updateCarouselUI();
  dragStartX = dragLastX = null;
  dragActive = false;
}

carouselEl.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  dragStartX = dragLastX = e.clientX;
});
document.addEventListener('mousemove', e => {
  if (dragStartX === null) return;
  dragLastX = e.clientX;
  const delta = dragLastX - dragStartX;
  if (!dragActive && Math.abs(delta) > 5) activateDrag();
  if (dragActive) applyDragOffset(delta);
});
document.addEventListener('mouseup', e => {
  if (dragStartX === null) return;
  dragLastX = e.clientX;
  if (dragActive) settleDrag();
  else { dragStartX = dragLastX = null; }
});

carouselEl.addEventListener('touchstart', e => {
  dragStartX  = dragLastX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchLocked = false;
}, { passive: true });

carouselEl.addEventListener('touchmove', e => {
  if (dragStartX === null) return;
  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  dragLastX = x;

  if (!touchLocked) {
    const dx = Math.abs(x - dragStartX);
    const dy = Math.abs(y - touchStartY);
    if (dy > dx + 4) { dragStartX = null; return; }
    if (dx > 5)      { touchLocked = true; activateDrag(); }
  }

  if (dragActive) {
    applyDragOffset(x - dragStartX);
    e.preventDefault();
  }
}, { passive: false });

carouselEl.addEventListener('touchend', e => {
  if (dragStartX === null) return;
  dragLastX = e.changedTouches[0].clientX;
  if (dragActive) settleDrag();
  else { dragStartX = dragLastX = null; }
});

// ── MODAL ──
const modalOverlay = document.getElementById('modalOverlay');

function openModal(el) {
  const img   = el.querySelector('.polaroid__img');
  const title = el.querySelector('.polaroid__title');
  const date  = el.querySelector('.polaroid__date');
  const mImg  = document.getElementById('modalImg');
  mImg.innerHTML            = img.innerHTML;
  mImg.style.background     = img.style.background;
  mImg.style.backgroundImage    = img.style.backgroundImage;
  mImg.style.backgroundSize     = img.style.backgroundSize || 'cover';
  mImg.style.backgroundPosition = img.style.backgroundPosition || 'center';
  document.getElementById('modalTitle').textContent = title.textContent;
  document.getElementById('modalDate').textContent  = date.textContent;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.polaroid').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});
document.getElementById('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── ENVELOPE / CARTA ──
(function () {
  const envelope      = document.getElementById('envelope');
  const envSeal       = document.getElementById('envSeal');
  const envFlap       = document.getElementById('envFlap');
  const envLetter     = document.getElementById('envLetter');
  const envelopeTip   = document.getElementById('envelopeTip');
  const letterOverlay = document.getElementById('letterOverlay');
  const letterClose   = document.getElementById('letterClose');

  const PEEK           = -100;
  const THRESHOLD      =  70;
  const DOWN_THRESHOLD =  50;

  let state      = 'sealed';
  let dragY0     = null;
  let dragActive = false;
  let lastDragDy = 0;

  envSeal.addEventListener('click', () => {
    if (state !== 'sealed') return;
    envSeal.classList.add('removing');
    setTimeout(() => {
      envSeal.style.display = 'none';
      envelope.classList.add('unsealed');
      setTimeout(() => { envFlap.style.zIndex = '1'; }, 350);
      setTimeout(() => {
        state = 'unsealed';
        envelopeTip.textContent = '↑ Arraste a carta para ler';
      }, 700);
    }, 500);
  });

  function startDrag(y) {
    if (state !== 'unsealed') return;
    dragY0 = y; dragActive = false; lastDragDy = 0;
  }

  function moveDrag(y) {
    if (dragY0 === null || state === 'resetting') return;
    const dy = dragY0 - y;
    lastDragDy = dy;
    if (!dragActive && Math.abs(dy) > 8) { dragActive = true; envLetter.classList.add('dragging'); }
    if (dragActive) {
      const clampedY = Math.min(PEEK - dy, 0);
      envLetter.style.transition = 'none';
      envLetter.style.transform  = `translateY(${clampedY}px)`;
      envLetter.style.opacity    = dy > 0
        ? String(Math.max(0.35, 1 - (dy / THRESHOLD) * 0.55))
        : '1';
    }
  }

  function endDrag() {
    if (dragY0 === null) return;
    envLetter.classList.remove('dragging');
    dragY0 = null;
    if (!dragActive) { dragActive = false; return; }
    dragActive = false;

    if (lastDragDy >= THRESHOLD) {
      triggerOpen();
    } else if (lastDragDy <= -DOWN_THRESHOLD) {
      triggerReset();
    } else {
      envLetter.style.transition = '';
      envLetter.style.transform  = '';
      envLetter.style.opacity    = '';
    }
  }

  function triggerOpen() {
    state = 'open';
    envLetter.style.transition = 'transform 0.38s cubic-bezier(0.4,0,1,1), opacity 0.38s ease';
    envLetter.style.transform  = `translateY(${PEEK - lastDragDy - 380}px)`;
    envLetter.style.opacity    = '0';
    setTimeout(() => {
      letterOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 320);
  }

  function triggerReset() {
    state = 'resetting';
    envLetter.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease';
    envLetter.style.transform  = 'translateY(0)';
    envLetter.style.opacity    = '1';
    setTimeout(() => {
      envFlap.style.zIndex = '';
      envelope.classList.remove('unsealed');
      envLetter.style.transition = '';
      envLetter.style.transform  = '';
      envLetter.style.opacity    = '';
      setTimeout(() => {
        envSeal.classList.remove('removing');
        envSeal.style.display = '';
        envSeal.classList.add('appearing');
        envSeal.addEventListener('animationend', () => {
          envSeal.classList.remove('appearing');
        }, { once: true });
        envelopeTip.textContent = 'Clique no selo para abrir';
        state = 'sealed';
      }, 700);
    }, 450);
  }

  function closeLetterModal() {
    letterOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      state = 'unsealed';
      envLetter.style.transition = 'none';
      envLetter.style.transform  = 'translateY(-490px)';
      envLetter.style.opacity    = '0';
      void envLetter.offsetWidth;
      requestAnimationFrame(() => {
        envLetter.style.transition = 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease 0.1s';
        envLetter.style.transform  = '';
        envLetter.style.opacity    = '';
      });
    }, 350);
  }

  function resetEnvelope() {
    if (state === 'sealed' || state === 'resetting') return;
    if (state === 'open') {
      letterOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    triggerReset();
  }
  window.resetEnvelope = resetEnvelope;

  envLetter.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientY);
  });
  document.addEventListener('mousemove', e => moveDrag(e.clientY));
  document.addEventListener('mouseup',   ()  => endDrag());

  envLetter.addEventListener('touchstart', e => startDrag(e.touches[0].clientY), { passive: true });
  envLetter.addEventListener('touchmove', e => {
    const dy = dragY0 !== null ? dragY0 - e.touches[0].clientY : 0;
    if (Math.abs(dy) > 0) e.preventDefault();
    moveDrag(e.touches[0].clientY);
  }, { passive: false });
  envLetter.addEventListener('touchend', () => endDrag());

  letterClose.addEventListener('click', closeLetterModal);
  letterOverlay.addEventListener('click', e => { if (e.target === letterOverlay) closeLetterModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state === 'open') closeLetterModal();
  });
})();

// ── TIMELINE HEARTBEAT — random delay + duration per item ──
document.querySelectorAll('.timeline-item').forEach(item => {
  item.style.setProperty('--heart-delay', (Math.random() * 4).toFixed(2) + 's');
  item.style.setProperty('--heart-dur',   (2.5 + Math.random() * 1.5).toFixed(2) + 's');
});

// ── LIKE TOGGLE ──
function toggleLike(btn) {
  const liked = btn.textContent === '♥';
  btn.textContent = liked ? '♡' : '♥';
  btn.style.color = liked ? '' : '#e07aa0';
  btn.style.background = liked ? '' : 'var(--rose-light)';
  if (!liked) btn.classList.add('liked');
  setTimeout(() => btn.classList.remove('liked'), 400);
}
