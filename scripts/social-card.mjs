// Optional authoring tool: render a local social-sharing image with installed Chrome.
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
const font = (await readFile('assets/fonts/outfit-latin.woff2')).toString('base64');
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<html><head><style>@font-face{font-family:Outfit;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#f0f0f0;color:#121212;font-family:Outfit;display:grid;grid-template-columns:1.2fr 1fr;padding:55px;gap:45px;height:630px}h1{font-size:96px;line-height:.9;letter-spacing:-5px;margin:45px 0 25px;font-weight:900}h1 span{color:#d02020}p{font-size:24px}small{font-size:13px;letter-spacing:2px}.art{background:#1040c0;position:relative;overflow:hidden;border:4px solid #121212;box-shadow:8px 8px #121212}.circle{width:290px;height:290px;border-radius:50%;background:#d02020;border:4px solid #121212;position:absolute;top:70px;left:20px}.square{width:220px;height:220px;background:#f0f0f0;border:4px solid #121212;position:absolute;top:155px;left:175px;transform:rotate(-15deg)}.triangle{width:270px;height:250px;position:absolute;top:225px;left:80px;background:#f0c020;clip-path:polygon(50% 0,100% 100%,0 100%)}.dot{width:62px;height:62px;background:#121212;border:3px solid #f0f0f0;border-radius:50%;position:absolute;top:280px;left:252px}</style></head><body><div><small>ROBOTICS × ARTIFICIAL INTELLIGENCE</small><h1>ȘTEFAN<br>ANDREI<br><span>LUCIAN.</span></h1><p>Robotics Engineer. AI Engineer.</p><small>CLUJ-NAPOCA, ROMANIA</small></div><div class="art"><div class="circle"></div><div class="square"></div><div class="triangle"></div><div class="dot"></div></div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'assets/social-card.png' });
} finally { await browser.close(); }
