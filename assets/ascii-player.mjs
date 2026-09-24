// Shared lifecycle for text animations: resize, pause, reduced motion and visibility.
export function mountAscii(output, render, columns, rows) {
  if (!output) return;
  const stage = output.parentElement;
  const panel = stage.closest('.ascii-panel');
  const toggle = panel.querySelector('.motion-toggle');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false, visible = true, frame = 0, previous = 0, elapsed = 0;
  const resize = () => {
    output.style.fontSize = `${Math.min(stage.clientWidth / (columns * 0.6), stage.clientHeight / (rows * 1.05))}px`;
  };
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize);
  const tick = now => {
    if (!previous) previous = now;
    if (now - previous >= 1000 / 24) {
      elapsed += Math.min(now - previous, 100) / 1000;
      previous = now;
      output.textContent = render(elapsed);
    }
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    previous = 0;
    toggle.hidden = motion.matches;
    toggle.textContent = paused ? toggle.dataset.play : toggle.dataset.pause;
    if (!paused && !motion.matches && visible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(panel);
  }
  sync();
}
