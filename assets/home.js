// Progressive enhancement: without JavaScript, all projects and designs remain available.
const toggle = document.querySelector('.projects-toggle');
const additional = document.querySelector('#additional-projects');
if (toggle && additional) {
  const setExpanded = expanded => {
    additional.hidden = !expanded;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.querySelector('span').textContent = expanded ? toggle.dataset.less : toggle.dataset.more;
    toggle.querySelector('.toggle-symbol').textContent = expanded ? '−' : '＋';
  };
  setExpanded(false);
  toggle.hidden = false;
  toggle.addEventListener('click', () => setExpanded(additional.hidden));
  const revealAnchor = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target && additional.contains(target) && additional.hidden) {
      setExpanded(true);
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  };
  revealAnchor();
  window.addEventListener('hashchange', revealAnchor);
  window.addEventListener('beforeprint', () => setExpanded(true));
}

const reel = document.querySelector('[data-design-reel]');
if (reel) {
  const track = reel.querySelector('.design-reel-track');
  const cards = [...track.children];
  const controls = reel.querySelector('.design-reel-controls');
  const previous = controls.querySelector('[data-design-direction="-1"]');
  const next = controls.querySelector('[data-design-direction="1"]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => {
    const bounds = track.getBoundingClientRect();
    const visible = cards.map((card, i) => {
      const rect = card.getBoundingClientRect();
      return rect.left + rect.width / 2 >= bounds.left && rect.left + rect.width / 2 <= bounds.right ? i : -1;
    }).filter(i => i >= 0);
    if (visible.length) {
      const first = visible[0] + 1, last = visible.at(-1) + 1;
      controls.querySelector('.design-reel-count').textContent = `${first === last ? first : first + '–' + last} / ${cards.length}`;
    }
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const move = direction => {
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    const index = Math.round(track.scrollLeft / step) + direction;
    track.scrollTo({ left: Math.max(0, index * step), behavior: reduced.matches ? 'instant' : 'smooth' });
  };
  controls.hidden = false;
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  let scrollTimer;
  track.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(update, 100); }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  else window.addEventListener('resize', update);
  update();
}
