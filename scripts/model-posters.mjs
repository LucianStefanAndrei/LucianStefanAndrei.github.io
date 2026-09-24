import { chromium } from 'playwright-core';
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',args:['--enable-unsafe-swiftshader']});
try{
  for(const id of ['assistive-cane','pneumatic-arm','gearbox','tool-changer']){
    const page=await browser.newPage({viewport:{width:1200,height:900}});
    page.on('pageerror',error=>console.error(error.message));
    await page.goto('http://localhost:3000/');
    await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>html,body{margin:0;background:#e7ebf8}model-viewer{width:1200px;height:900px;--poster-color:#e7ebf8}</style><script type="module" src="/assets/vendor/model-viewer.min.js"></script></head><body><model-viewer src="/assets/media/projects/${id}/model.glb" camera-controls environment-image="neutral" interaction-prompt="none" camera-orbit="35deg 70deg 120%" exposure="0.8" loading="eager"></model-viewer></body></html>`);
    await page.waitForFunction(()=>document.querySelector('model-viewer').loaded,{},{timeout:120000});
    await page.waitForTimeout(600);
    await page.screenshot({path:`assets/media/projects/${id}/model-poster.png`});
    console.log(`3D preview rendered: ${id}`);
    await page.close();
  }
}finally{await browser.close();}
