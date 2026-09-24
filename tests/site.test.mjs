import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const url = 'http://127.0.0.1:3107';
let server, browser;
before(async () => {
  server = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: '3107', SERVE_DIR: 'dist' }, stdio: 'pipe' });
  await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); });
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
});
after(async () => { await browser?.close(); server?.kill(); });

test('all generated pages and their local destinations exist', async () => {
  const routes = JSON.parse(await readFile('.tmp/generated-pages.json', 'utf8'));
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const checked = new Set();
  for (const route of routes) {
    const response = await page.goto(`${url}/${route}`);
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, route);
    const links = await page.locator('a[href], img[src], source[src], audio[src], script[src], link[href]').evaluateAll(els => els.map(el => el.href || el.src));
    for (const link of links) {
      if (!link?.startsWith(url)) continue;
      const target = link.split('#')[0];
      if (checked.has(target)) continue;
      checked.add(target);
      assert.equal((await page.request.head(target)).status(), 200, `${route}: ${target}`);
    }
  }
  await page.close();
});

test('new sections and detail pages are responsive and accessible in both languages', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const lang of ['', 'ro/']) {
    for (const route of ['projects/', 'web-design/', 'blog/', 'projects/tool-changer/', 'projects/museum-robot/', 'projects/amnesia/', 'web-design/manila/', 'blog/we-are-not-prepared-for-ai/']) {
      await page.goto(`${url}/${lang}${route}`);
      assert.equal(await page.getByText('undefined', { exact: true }).count(), 0, `${lang}${route} missing translation`);
      for (const width of [320, 768, 1051, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${lang}${route} overflow at ${width}`);
      }
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
      assert.deepEqual(violations, [], `${lang}${route}`);
      const alternate = await page.locator(`.language-switch a[lang="${lang ? 'en' : 'ro'}"]`).getAttribute('href');
      assert.ok(new URL(alternate, page.url()).pathname.endsWith(`${lang ? '' : 'ro/'}${route}index.html`));
    }
  }
  await page.close();
});

test('galleries support next, previous, wrapping and keyboard controls', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const [route, count] of [['projects/pneumatic-arm/', 6], ['projects/amnesia/', 8], ['web-design/manila/', 2]]) {
    await page.goto(`${url}/${route}`);
    assert.equal(await page.locator('.gallery-slide:visible').count(), 1);
    await page.locator('[data-direction="-1"]').click();
    assert.equal(await page.locator('.gallery-count').textContent(), `${count} / ${count}`);
    await page.locator('[data-direction="1"]').click();
    assert.equal(await page.locator('.gallery-count').textContent(), `1 / ${count}`);
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('.gallery-count').textContent(), `2 / ${count}`);
  }
  await page.close();
});

test('Amnesia has translated features, real screenshots, playable video and its repository link', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const lang of ['', 'ro/']) {
    await page.goto(`${url}/${lang}projects/amnesia/`);
    assert.equal(await page.locator('.detail-repository').getAttribute('href'), 'https://github.com/LucianStefanAndrei/Amnesia');
    assert.equal(await page.locator('.feature-card').count(), 6);
    assert.equal(await page.locator('#features-title').textContent(), lang ? 'În interiorul aplicației' : 'Inside the application');
    assert.match(await page.locator('.project-features').textContent(), /Argon2id/);
    assert.equal(await page.locator('.gallery-slide').count(), 8);
    assert.equal(await page.locator('.detail-illustration').count(), 0);
    await page.locator('.image-fullscreen').first().click();
    await page.waitForSelector('.image-viewer[open]');
    assert.equal(await page.locator('.image-viewer-count').textContent(), '1 / 8');
    await page.keyboard.press('Escape');
    await page.locator('video').evaluate(video => { video.muted = true; video.load(); });
    await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
    assert.ok(await page.locator('video').evaluate(video => video.duration > 0 && video.videoWidth > 0));
    await page.locator('video').evaluate(video => video.play());
    await page.waitForFunction(() => document.querySelector('video').currentTime > 0);
    await page.locator('video').evaluate(video => video.pause());
  }
  await page.close();
});

test('all projects share one archive and the CAD archive is removed', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const lang of ['', 'ro/']) {
    await page.goto(`${url}/${lang}projects/`);
    assert.equal(await page.locator('.catalog-card').count(), 8);
    assert.equal(await page.locator('a[href*="cad/index.html"]').count(), 0);
    await page.locator('.catalog-card a[href*="/amnesia/"]').click();
    await page.locator('.back-link').click();
    await page.waitForURL(`**/${lang}projects/index.html`);
    assert.equal((await page.request.get(`${url}/${lang}cad/`)).status(), 404);
  }
  const generated = JSON.parse(await readFile('.tmp/generated-pages.json', 'utf8'));
  assert.ok(generated.includes('projects/index.html'));
  assert.equal(generated.some(route => /(^|\/)cad\//.test(route)), false);
  await page.close();
});

test('images open in a fullscreen dialog without new tabs, with keyboard controls and focus return', async () => {
  for (const lang of ['', 'ro/']) {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${url}/${lang}web-design/manila/`);
      assert.equal(await page.locator('.gallery a[target="_blank"]').count(), 0);
      await page.locator('.gallery-slide:visible img').click();
      const dialog = page.locator('.image-viewer');
      await page.waitForSelector('.image-viewer[open]');
      assert.equal(context.pages().length, 1);
      const bounds = await dialog.boundingBox();
      assert.equal(bounds.width, width);
      assert.equal(bounds.height, 900);
      await page.keyboard.press('ArrowRight');
      assert.equal(await dialog.locator('.image-viewer-count').textContent(), '2 / 2');
      assert.ok((await dialog.locator('img').getAttribute('src')).endsWith('manila-2.jpg'));
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => v.id));
      assert.deepEqual(violations, []);
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.activeElement?.classList.contains('image-fullscreen'));
      assert.equal(await dialog.isVisible(), false);
      assert.equal(await page.locator('.gallery-count').textContent(), '2 / 2');
      await page.keyboard.press('Enter');
      await page.waitForSelector('.image-viewer[open]');
      await dialog.locator('.image-viewer-close').click();
      assert.equal(await dialog.isVisible(), false);
    }
    await page.goto(`${url}/${lang}projects/tool-changer/`);
    assert.equal(await page.locator('.gallery-slide').count(), 1);
    assert.equal(await page.locator('.gallery-controls').count(), 0);
    await page.locator('.image-fullscreen').click();
    assert.equal(await page.locator('.image-viewer-navigation').isVisible(), false);
    assert.equal((await page.request.head(`${url}/assets/media/projects/tool-changer/Desen_Tehnic2.png`)).status(), 404);
    await context.close();
  }
});

test('CAD sources are excluded from the published site', async () => {
  const published = await readdir('dist', { recursive: true });
  assert.equal(published.some(file => /\.(step|stp)$/i.test(file)), false);
  assert.equal((await fetch(`${url}/assets/media/projects/gearbox/source.step`)).status, 404);
});

test('all STEP-derived models load automatically, toggle wireframe, rotate and reset', { timeout: 120000 }, async () => {
  for (const id of ['assistive-cane', 'pneumatic-arm', 'gearbox', 'tool-changer']) {
    const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
    const errors = [], requests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => requests.push(r.url()));
    await page.goto(`${url}/projects/${id}/`);
    await page.waitForSelector('[data-loaded="true"]', { timeout: 30000 });
    assert.ok(requests.some(r => r.endsWith('/model.glb')));
    assert.equal(requests.some(r => r.endsWith('/wireframe.glb')), false);
    assert.equal(await page.locator('.load-model, a[href$=".step"], a[href$=".glb"]').count(), 0);
    assert.equal(await page.locator('.model-shell').getAttribute('aria-busy'), 'false');
    await page.locator('model-viewer').evaluate(el => el.scrollIntoView({ block: 'center' }));
    const initial = await page.locator('model-viewer').evaluate(v => v.getCameraOrbit().theta);
    const box = await page.locator('model-viewer').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2, { steps: 12 });
    await page.mouse.up();
    await page.waitForFunction(theta => Math.abs(document.querySelector('model-viewer').getCameraOrbit().theta - theta) > .05, initial);
    await page.waitForTimeout(250);
    const beforeMode = await page.locator('model-viewer').evaluate(v => v.getCameraOrbit().theta);
    await page.locator('.wireframe-model').click();
    await page.waitForSelector('[data-mode="wireframe"][data-loaded="true"]');
    assert.equal(await page.locator('.wireframe-model').getAttribute('aria-pressed'), 'true');
    const wireOrbit = await page.locator('model-viewer').evaluate(v => v.getCameraOrbit().theta);
    assert.ok(Math.abs(beforeMode - wireOrbit) < .02, `${id} preserves orientation`);
    assert.ok(await page.locator('model-viewer').evaluate(viewer => viewer.src.endsWith('/wireframe.glb')));
    // Verify actual line primitives, not simply a different button appearance.
    const data = await readFile(`dist/assets/media/projects/${id}/wireframe.glb`);
    const gltf = JSON.parse(data.subarray(20, 20 + data.readUInt32LE(12)).toString());
    assert.ok(gltf.meshes.length > 0 && gltf.meshes.every(mesh => mesh.primitives.every(p => p.mode === 1)));
    await page.locator('.wireframe-model').press('Enter');
    await page.waitForSelector('[data-mode="solid"][data-loaded="true"]');
    assert.equal(await page.locator('.wireframe-model').getAttribute('aria-pressed'), 'false');
    await page.locator('.reset-model').click();
    const reset = await page.locator('model-viewer').evaluate(v => v.getCameraOrbit().theta);
    assert.ok(Math.abs(initial - reset) < .01);
    assert.deepEqual(errors, []);
    assert.equal(requests.some(r => !r.startsWith(url) && !r.startsWith('blob:') && !r.startsWith('data:')), false);
    await page.close();
  }
});

test('video and article narration support playback and byte-range seeking', async () => {
  const page = await browser.newPage();
  for (const [route, selector] of [['projects/museum-robot/', 'video'], ['blog/ai-powered-armies/', 'audio']]) {
    await page.goto(`${url}/${route}`);
    const media = page.locator(selector);
    const src = await media.evaluate(el => el.currentSrc || el.src || el.querySelector('source').src);
    const response = await page.request.get(src, { headers: { Range: 'bytes=0-99' } });
    assert.equal(response.status(), 206);
    assert.equal((await response.body()).length, 100);
    assert.equal((await page.request.get(src, { headers: { Range: 'bytes=999999999-' } })).status(), 416);
    await media.evaluate(el => { el.muted = true; return el.play(); });
    await page.waitForFunction(selector => document.querySelector(selector).currentTime > 0, selector);
    await media.evaluate(el => { el.currentTime = 20; });
    await page.waitForFunction(selector => !document.querySelector(selector).seeking && document.querySelector(selector).currentTime >= 20, selector);
    await media.evaluate(el => el.pause());
  }
  await page.close();
});

test('model failures retain a preview and wireframe failures restore the solid view', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.route('**/model.glb', route => route.abort());
  await page.goto(`${url}/projects/gearbox/`);
  await page.waitForFunction(() => document.querySelector('.model-status').textContent.includes('could not load'));
  assert.equal(await page.locator('.model-poster').isVisible(), true);
  assert.equal(await page.locator('.model-shell').getAttribute('aria-busy'), 'false');
  await page.unroute('**/model.glb');
  await page.route('**/wireframe.glb', route => route.abort());
  await page.reload();
  await page.waitForSelector('[data-loaded="true"]');
  await page.locator('.wireframe-model').click();
  await page.waitForSelector('[data-mode="solid"][data-loaded="true"][aria-busy="false"]');
  assert.equal(await page.locator('.wireframe-model').getAttribute('aria-pressed'), 'false');
  assert.ok((await page.locator('.model-status').textContent()).includes('could not load'));
  await page.close();
});

test('both languages: responsive layout, local assets, content and accessibility', async () => {
  for (const lang of ['en', 'ro']) {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${url}/${lang === 'ro' ? 'ro/' : ''}`);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('html').getAttribute('lang'), lang);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.project-card').count(), 8);
    assert.equal(await page.locator('.project-card:visible').count(), 4);
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${lang} overflows at ${width}px`);
    }
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const result = await page.evaluate(async () => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${lang} accessibility violations`);
    await page.locator('.project-card-link').first().focus();
    assert.equal(await page.locator('.project-preview img').first().evaluate(el => getComputedStyle(el).filter), 'grayscale(0)');
    const links = await page.locator('a[href], img[src], link[rel="stylesheet"], script[src]').evaluateAll(els => els.map(el => el.href || el.src).filter(Boolean));
    for (const link of new Set(links)) {
      if (!link.startsWith(url) || link.includes('#')) continue;
      const response = await page.request.get(link);
      assert.equal(response.status(), 200, link);
    }
    assert.deepEqual(errors, []);
    await page.locator('.project-card-link').first().press('Enter');
    await page.waitForURL('**/projects/museum-robot/index.html');
    assert.equal(await page.locator('video').count(), 1);
    await page.close();
  }
});

test('homepage expands all projects and opens links or deep links in both languages', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  for (const lang of ['', 'ro/']) {
    await page.goto(`${url}/${lang}`);
    const toggle = page.locator('.projects-toggle');
    assert.equal(await page.locator('.project-card:visible').count(), 4);
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    await toggle.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.project-card:visible').count(), 8);
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.closest('.project-card')?.id), 'assistive-cane');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => v.id));
    assert.deepEqual(violations, []);
    await toggle.click();
    assert.equal(await page.locator('.project-card:visible').count(), 4);
    await page.goto(`${url}/${lang}index.html#tool-changer`);
    assert.equal(await page.locator('#tool-changer').isVisible(), true);
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await page.locator('#tool-changer a').click();
    await page.waitForURL(`**/${lang}projects/tool-changer/index.html`);
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.nav-home').textContent(), lang ? 'Acasă' : 'Home');
    await page.locator('.nav-home').click();
    await page.waitForURL(`**/${lang}index.html#top`);
  }
  await page.close();
});

test('homepage design carousel supports buttons, keyboard, bounds and project navigation', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const lang of ['', 'ro/']) {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${url}/${lang}`);
      const track = page.locator('.design-reel-track');
      const previous = page.locator('[data-design-direction="-1"]');
      const next = page.locator('[data-design-direction="1"]');
      assert.equal(await track.locator('.design-card').count(), 7);
      assert.equal(await previous.isDisabled(), true);
      await next.click();
      await page.waitForFunction(() => document.querySelector('.design-reel-track').scrollLeft > 0);
      await page.waitForFunction(() => !document.querySelector('[data-design-direction="-1"]').disabled);
      const offset = await track.evaluate(el => el.scrollLeft);
      await track.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(offset => document.querySelector('.design-reel-track').scrollLeft > offset, offset);
      await track.locator('a').last().focus();
      await page.waitForFunction(() => document.querySelector('[data-design-direction="1"]').disabled);
      assert.match(await page.locator('.design-reel-count').textContent(), /7 \/ 7$/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await track.locator('a').last().press('Enter');
      await page.waitForURL(`**/${lang}web-design/manila/index.html`);
    }
  }
  await page.close();
});

test('mobile menu, keyboard dismissal and language switch preserve section', async () => {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  await page.goto(url);
  const menu = page.locator('.menu-toggle');
  assert.equal(await page.locator('nav').evaluate(el => el.inert), true);
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => v.id));
  assert.deepEqual(violations, []);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Home');
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.equal(await menu.evaluate(el => el === document.activeElement), true);
  await menu.click();
  await page.locator('nav a[href="#top"]').click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  await page.evaluate(() => window.scrollTo(0, 0));
  await menu.click();
  await page.locator('.language-switch a[lang="ro"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'ro');
  assert.ok(page.url().endsWith('/ro/index.html#top'));
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.equal(await page.locator('nav').evaluate(el => el.inert), false);
  await page.close();
});

test('no-JavaScript content, project navigation and galleries remain usable', async () => {
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  await page.goto(`${url}/ro/`);
  assert.equal(await page.locator('nav').isVisible(), true);
  assert.equal(await page.locator('.project-card').first().isVisible(), true);
  assert.equal(await page.locator('.project-card:visible').count(), 8);
  assert.equal(await page.locator('.projects-toggle').isVisible(), false);
  assert.equal(await page.locator('.design-reel-track .design-card').count(), 7);
  assert.equal(await page.locator('.design-reel-controls').isVisible(), false);
  await page.locator('.design-reel-track').evaluate(el => { el.scrollLeft = el.scrollWidth; });
  assert.ok(await page.locator('.design-reel-track').evaluate(el => el.scrollLeft > 0));
  assert.ok((await page.locator('.mobius-ascii').textContent()).trim().length > 100);
  await page.locator('.project-card-link').first().click();
  await page.waitForURL('**/projects/museum-robot/index.html');
  await page.goto(`${url}/ro/projects/tool-changer/`);
  assert.equal(await page.locator('.gallery-slide:visible').count(), 1);
  assert.equal(await page.locator('.model-tools').isVisible(), false);
  assert.equal(await page.locator('.model-poster').isVisible(), true);
  assert.equal(await page.locator('.image-fullscreen').isVisible(), false);
  await page.goto(`${url}/ro/projects/pneumatic-arm/`);
  assert.equal(await page.locator('.gallery-slide:visible').count(), 6);
  await page.close();
});

test('reduced motion disables introductions', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(url);
  const frame = await page.locator('.mobius-ascii').textContent();
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.mobius-ascii').textContent(), frame);
  assert.equal(await page.locator('.hero-art .motion-toggle').isVisible(), false);
  assert.equal(await page.locator('.reveal-pending').count(), 0);
  await page.close();
});

test('résumé links download the approved PDF for the current language', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const [lang, filename] of [['', 'CV_Stefan_Lucian_En.pdf'], ['ro/', 'CV_Stefan_Lucian_Ro.pdf']]) {
    const original = await readFile(`assets/${filename}`);
    const published = await readFile(`dist/assets/${filename}`);
    assert.equal(published.subarray(0, 5).toString(), '%PDF-');
    assert.deepEqual(published, original);
    for (const route of ['', 'projects/amnesia/']) {
      await page.goto(`${url}/${lang}${route}`);
      const link = page.locator('.nav-resume');
      assert.equal(await link.count(), 1);
      const href = await link.getAttribute('href');
      assert.equal(new URL(href, page.url()).pathname, `/assets/${filename}`);
      assert.equal((await page.request.get(new URL(href, page.url()).href)).status(), 200);
      if (!route) {
        const contact = page.locator('.resume-link');
        assert.equal(await contact.getAttribute('href'), href);
        const downloadPromise = page.waitForEvent('download');
        await contact.click();
        const download = await downloadPromise;
        assert.equal(download.suggestedFilename(), filename);
        assert.equal(await download.failure(), null);
      }
    }
  }
  await page.close();
});

test('ASCII Möbius band animates, pauses, resumes and reacts to reduced motion', async () => {
  const page = await browser.newPage({ reducedMotion: 'no-preference' });
  await page.goto(url);
  const band = page.locator('.mobius-ascii');
  const first = await band.textContent();
  assert.equal(first.split('\n').length, 40);
  await page.waitForFunction(frame => document.querySelector('.mobius-ascii').textContent !== frame, first);
  await page.locator('.hero-art').getByRole('button', { name: 'Pause animation' }).click();
  const paused = await band.textContent();
  await page.waitForTimeout(150);
  assert.equal(await band.textContent(), paused);
  await page.locator('.hero-art').getByRole('button', { name: 'Resume animation' }).click();
  await page.waitForFunction(frame => document.querySelector('.mobius-ascii').textContent !== frame, paused);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('.motion-toggle').hidden);
  const still = await band.textContent();
  await page.waitForTimeout(150);
  assert.equal(await band.textContent(), still);
  await page.close();
});

test('portrait, featured thesis, social icons, and all CV milestones are present', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(url);
  await page.locator('.nav-portrait img').evaluate(img => img.decode());
  assert.ok(await page.locator('.nav-portrait img').evaluate(img => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0));
  const portraitBounds = await page.locator('.nav-portrait').boundingBox();
  assert.equal(portraitBounds.width, portraitBounds.height);
  assert.equal(await page.locator('.project-featured').getAttribute('id'), 'museum-robot');
  assert.equal(await page.locator('.footer-socials a svg').count(), 4);
  assert.equal(await page.locator('.footer-socials a').last().getAttribute('href'), 'https://medium.com/@stefanandreilucian2');
  assert.equal(await page.locator('.footer-socials a[href*="linkedin"]').getAttribute('href'), 'https://www.linkedin.com/in/andrei-lucian-stefan-813b8421b/');
  assert.equal(await page.locator('.milestone-list:not(.milestone-duplicate) li').count(), 12);
  assert.equal(await page.locator('.milestone-duplicate').isVisible(), false);
  assert.equal(await page.locator('.milestones-toggle').isVisible(), false);
  assert.equal(await page.locator('.portrait-initials').count(), 0);
  assert.equal(await page.getByText('I enjoy taking a system', { exact: false }).count(), 0);
  await page.close();
});

test('About ASCII and milestone loop animate, pause independently, and respect reduced motion', async () => {
  const page = await browser.newPage({ reducedMotion: 'no-preference' });
  await page.goto(url);
  const panel = page.locator('.about-art');
  await panel.scrollIntoViewIfNeeded();
  const first = await page.locator('.polyhedron-ascii').textContent();
  await page.waitForFunction(frame => document.querySelector('.polyhedron-ascii').textContent !== frame, first);
  await panel.getByRole('button', { name: 'Pause animation' }).click();
  const paused = await page.locator('.polyhedron-ascii').textContent();
  await page.waitForTimeout(160);
  assert.equal(await page.locator('.polyhedron-ascii').textContent(), paused);
  const ticker = page.locator('.highlights');
  await ticker.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.milestones-track')).animationPlayState === 'running');
  const start = await page.locator('.milestones-track').evaluate(el => getComputedStyle(el).transform);
  await page.waitForFunction(start => getComputedStyle(document.querySelector('.milestones-track')).transform !== start, start);
  await page.getByRole('button', { name: 'Pause milestones' }).click();
  assert.equal(await page.locator('.milestones-track').evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
  await page.getByRole('button', { name: 'Resume milestones' }).click();
  assert.equal(await page.locator('.milestones-track').evaluate(el => getComputedStyle(el).animationPlayState), 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => !document.querySelector('.highlights').classList.contains('is-enhanced'));
  assert.equal(await page.locator('.milestone-duplicate').isVisible(), false);
  assert.equal(await page.locator('.milestones-track').evaluate(el => getComputedStyle(el).animationName), 'none');
  await page.close();
});
