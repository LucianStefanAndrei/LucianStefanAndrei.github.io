// Navigation works as ordinary anchor links without JavaScript.
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobile = window.matchMedia('(max-width: 1050px)');
function setMenu(open, returnFocus = false) {
  menu.setAttribute('aria-expanded', String(open));
  menu.querySelector('span').textContent = open ? menu.dataset.close : menu.dataset.open;
  navigation.classList.toggle('is-open', open);
  navigation.inert = mobile.matches && !open;
  if (returnFocus) menu.focus();
}
document.documentElement.classList.add('js');
menu.hidden = false;
setMenu(false);
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => { if (event.target.closest('a') && mobile.matches) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setMenu(false, true); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header') && menu.getAttribute('aria-expanded') === 'true') setMenu(false); });
mobile.addEventListener('change', () => setMenu(false));

// Preserve the current section when changing language; navigation never depends on storage.
document.querySelectorAll('.language-switch a').forEach(link => link.addEventListener('click', () => {
  if (window.location.hash) link.hash = window.location.hash;
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('reveal-pending');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('reveal-pending');
      observer.observe(element);
    }
  });
  const revealAll = () => {
    document.querySelectorAll('.reveal-pending').forEach(el => el.classList.remove('reveal-pending'));
    observer.disconnect();
  };
  reducedMotion.addEventListener('change', revealAll, { once: true });
  // Never hide keyboard-focused content while waiting for an observer callback.
  document.addEventListener('focusin', event => event.target.closest('.reveal-pending')?.classList.remove('reveal-pending'));
  window.addEventListener('beforeprint', revealAll);
}

// A duplicated visual track creates a seamless loop; assistive technology gets
// only the first list. With reduced motion or no JS, every milestone is static.
const milestones = document.querySelector('.highlights');
if (milestones) {
  const toggle = milestones.querySelector('.milestones-toggle');
  const list = milestones.querySelector('.milestone-list');
  let paused = false, visible = false;
  const sync = () => {
    const enhanced = !reducedMotion.matches;
    milestones.classList.toggle('is-enhanced', enhanced);
    milestones.classList.toggle('is-running', enhanced && !paused && visible && !document.hidden);
    toggle.hidden = !enhanced;
    toggle.textContent = paused ? toggle.dataset.play : toggle.dataset.pause;
  };
  const size = () => milestones.style.setProperty('--marquee-duration', `${list.scrollWidth / 58}s`);
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  reducedMotion.addEventListener('change', () => { sync(); size(); });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(milestones);
  } else visible = true;
  sync();
  size();
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(list);
}
