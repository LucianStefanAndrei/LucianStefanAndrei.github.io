import { readFile, readdir } from 'node:fs/promises';
import { Marked } from 'marked';
import { profile, copy } from '../content/site.mjs';
import { catalog, designWorks } from '../content/catalog.mjs';
import { sections } from '../content/sections.mjs';
import { layout,esc,arrow,prefix,rootPath,projectRoute,blogRoute } from './layout.mjs';

const localized=(value,lang)=>typeof value==='object'?value[lang]:value;
const url=(base,src)=>base+src.split('/').map(encodeURIComponent).join('/');
const page=(lang,route,title,description,body,scripts=['media.js'])=>layout({lang,route,title:`${title} — ${profile.name}`,description,body,scripts,alternates:{en:route.replace(/^ro\//,''),ro:'ro/'+route.replace(/^ro\//,'')}});
export function carousel(images,lang,base,label){
  if(!images.length)return '';
  const t=sections[lang];
  return `<div class="gallery" data-carousel role="group" aria-label="${esc(label)}" data-close="${copy[lang].close}" data-previous="${t.previous}" data-next="${t.next}"><div class="gallery-track">${images.map((image,i)=>`<figure class="gallery-slide"><div class="gallery-image"><img src="${url(base,image.src)}" alt="${esc(localized(image.alt,lang))}" width="${image.width||1200}" height="${image.height||900}" loading="lazy" decoding="async"><button class="image-fullscreen" type="button" aria-label="${t.fullscreen}: ${esc(localized(image.alt,lang))}" aria-haspopup="dialog" hidden><span aria-hidden="true">⛶</span> ${t.fullscreen}</button></div><figcaption>${esc(localized(image.alt,lang))}</figcaption></figure>`).join('')}</div>${images.length>1?`<div class="gallery-controls" hidden><button type="button" data-direction="-1" aria-label="${t.previous}">←</button><span class="gallery-count" aria-live="polite" aria-atomic="true">1 / ${images.length}</span><button type="button" data-direction="1" aria-label="${t.next}">→</button></div>`:''}</div>`;
}
const tags=p=>`<ul class="tags">${p.tags.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
const projectImage=p=>p.media?.poster||p.media?.gallery?.[0]?.src||(p.image?'assets/'+p.image:null);

export function renderProject(p,lang){
  const t=sections[lang],c=p[lang],common=copy[lang],route=projectRoute(lang,p.id),base=rootPath(route),m=p.media||{};
  const back=`${base}${prefix(lang)}projects/index.html`;
  const model=m.model?`<section class="detail-section" id="model"><div class="detail-heading"><span>01</span><h2>${t.model}</h2></div><div class="model-shell" data-model="${url(base,m.model)}" data-wireframe="${url(base,m.wireframe)}" data-alt="${esc(c.name)}" data-loading="${t.modelLoading}" data-error="${t.modelFailure}"><div class="model-stage"><img class="model-poster" src="${url(base,m.poster)}" width="1200" height="900" alt="${esc(c.name)}" loading="lazy"></div><div class="model-tools" hidden><button type="button" class="wireframe-model" aria-pressed="false">${t.wireframe}</button><button type="button" class="reset-model">${t.resetModel}</button><button type="button" class="fullscreen-model">${t.fullscreen}</button><span>${t.modelHint}</span></div><p class="model-status" role="status"></p></div></section>`:'';
  const video=m.video?`<section class="detail-section" id="video"><div class="detail-heading"><span>▶</span><h2>${t.video}</h2></div><video class="project-video" controls controlslist="nodownload" playsinline preload="none" poster="${url(base,m.poster)}" width="1280" height="720" aria-label="${esc(c.name)}"><source src="${url(base,m.video)}" type="video/mp4"><a href="${url(base,m.video)}">${t.video}</a></video></section>`:'';
  const gallery=m.gallery?.length?`<section class="detail-section${m.screenshots?' gallery-screenshots':''}" id="gallery"><div class="detail-heading"><span>↗</span><h2>${esc(c.galleryTitle||t.gallery)}</h2></div>${carousel(m.gallery,lang,base,c.galleryTitle||t.gallery)}</section>`:'';
  const features=c.features?.length?`<section class="detail-section project-features" aria-labelledby="features-title"><div class="detail-heading"><span aria-hidden="true">＋</span><h2 id="features-title">${esc(c.featuresTitle)}</h2></div><div class="feature-grid">${c.features.map(([title,body],i)=>`<article class="feature-card"><span class="eyebrow" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div></section>`:'';
  const paragraphs=c.paragraphs||(c.contribution?[c.contribution,c.outcome]:[]);
  const next=catalog[(catalog.indexOf(p)+1)%catalog.length];
  return page(lang,route,c.name,c.description,`<div class="container detail-page"><a class="back-link" href="${back}">← ${t.allProjects}</a><div class="section-kicker"><span>${esc(c.category)}</span><span>${esc(c.date)}</span></div><header class="detail-hero"><h1>${esc(c.name)}</h1><p class="detail-lead">${esc(c.description)}</p>${tags(p)}${p.url?`<a class="text-link detail-repository" href="${esc(p.url)}">${esc(c.linkLabel||common.projectLink)} ${arrow}</a>`:''}</header><div class="project-overview"><h2>${t.overview}</h2><div>${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${c.problem&&!c.paragraphs?`<h3>${common.problem}</h3><p>${esc(c.problem)}</p>`:''}</div></div>${model}${video}${gallery}${features}${!model&&!video&&!gallery&&p.image?`<figure class="detail-illustration"><img src="${base}assets/${p.image}" alt="${esc(c.alt)}" width="720" height="420"></figure>`:''}<div class="detail-next"><a href="${back}">← ${t.allProjects}</a><a href="${base}${projectRoute(lang,next.id)}"><small>${t.nextProject}</small><strong>${esc(next[lang].name)} ${arrow}</strong></a></div></div>`);
}

export function renderProjects(lang){
  const t=sections[lang],route=`${prefix(lang)}projects/index.html`,base=rootPath(route);
  const cards=catalog.map((p,i)=>{const id=p.id,c=p[lang];return `<article class="catalog-card"><a href="${base}${projectRoute(lang,id)}"><div class="catalog-image"><img src="${url(base,projectImage(p))}" alt="${esc(c.name)}" width="1200" height="900" loading="lazy"><span>${p.media?.model?'3D / STEP':p.media?.video?'VIDEO':lang==='en'?'PROJECT':'PROIECT'}</span></div><div class="catalog-copy"><span class="eyebrow">${String(i+1).padStart(2,'0')} / ${esc(c.category)}</span><h2>${esc(c.name)}</h2><p>${esc(c.description)}</p><span class="project-open">${copy[lang].details} ${arrow}</span></div></a></article>`;}).join('');
  return page(lang,route,t.projects,t.projectsIntro,`<section class="container archive-page"><div class="section-kicker"><span>ROBOTICS / SOFTWARE / ENGINEERING</span><span>${String(catalog.length).padStart(2,'0')}</span></div><header class="archive-heading"><h1>${t.projectsTitle}</h1><p>${t.projectsIntro}</p></header><div class="catalog-grid">${cards}</div></section>`);
}

export function renderDesign(lang,work){
  const t=sections[lang],route=`${prefix(lang)}web-design/${work?work.id+'/':''}index.html`,base=rootPath(route);
  if(work)return page(lang,route,work[lang],work[lang],`<section class="container detail-page"><a class="back-link" href="${base}${prefix(lang)}web-design/index.html">← ${t.allDesign}</a><header class="detail-hero"><span class="eyebrow">${t.design}</span><h1>${esc(work[lang])}</h1></header>${carousel(work.images.map((file,i)=>({src:'assets/media/design/'+file,alt:`${work[lang]} — ${i+1}`})),lang,base,t.designMedia)}<a class="text-link design-behance" href="${profile.behance}">Behance ${arrow}</a></section>`);
  return page(lang,route,t.design,t.designIntro,`<section class="container archive-page"><div class="section-kicker"><span>FORM / COLOR / IDENTITY</span><span>07</span></div><header class="archive-heading"><h1>${t.designTitle}</h1><p>${t.designIntro}</p></header><div class="design-grid">${designWorks.map((w,i)=>`<article class="design-card"><a href="${base}${prefix(lang)}web-design/${w.id}/index.html"><div class="design-image"><img src="${url(base,'assets/media/design/'+w.images[0])}" alt="${esc(w[lang])}" width="1200" height="900" loading="lazy"></div><div class="design-card-title"><h2>${esc(w[lang])}</h2>${arrow}</div></a></article>`).join('')}</div></section>`);
}

export async function loadArticles(){
  const translations={
    'we-are-not-prepared-for-ai':{title:'Nu suntem pregătiți pentru IA',summary:'Provocări privind legislația IA, securitatea geopolitică și nivelul de înțelegere a inteligenței artificiale.'},
    'ai-powered-armies':{title:'Armate susținute de IA',summary:'Cum transformă inteligența artificială logistica militară, simulările tactice, fabricația 3D în teren și strategia de apărare.'},
  };
  const articles=[];
  for(const folder of await readdir('public/posts')){
    const raw=await readFile(`public/posts/${folder}/index.md`,'utf8');
    const match=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if(!match)throw Error(`Missing article frontmatter: ${folder}`);
    const meta={};for(const line of match[1].split(/\r?\n/)){const split=line.indexOf(':');if(split<0)continue;const value=line.slice(split+1).trim();meta[line.slice(0,split)]=JSON.parse(value);}
    const body=match[2].trim().replace(/^# [^\n]+\r?\n/,'').trim();
    articles.push({...meta,folder,body,ro:translations[meta.slug]||{title:meta.title,summary:meta.summary}});
  }
  return articles.sort((a,b)=>b.date.localeCompare(a.date));
}

export function renderBlog(lang,articles,article){
  const t=sections[lang],route=`${prefix(lang)}blog/${article?article.slug+'/':''}index.html`,base=rootPath(route);
  const date=value=>new Intl.DateTimeFormat(lang==='ro'?'ro-RO':'en-GB',{dateStyle:'long',timeZone:'UTC'}).format(new Date(value));
  const meta=a=>lang==='ro'?a.ro:a;
  const media=(a,file)=>url(base,`assets/media/posts/${a.folder}/${file}`);
  if(!article)return page(lang,route,copy[lang].blog,t.blogIntro,`<section class="container archive-page"><div class="section-kicker"><span>${copy[lang].blog.toUpperCase()} / ${profile.name.toUpperCase()}</span><span>${articles.length} ${t.articles.toUpperCase()}</span></div><header class="archive-heading"><h1>${t.blogTitle}</h1><p>${t.blogIntro}</p></header><div class="blog-grid">${articles.map(a=>`<article class="blog-card"><a href="${base}${prefix(lang)}blog/${a.slug}/index.html"><img src="${media(a,'cover.png')}" alt="" width="1280" height="720" loading="lazy"><div class="catalog-copy"><span class="eyebrow"><time datetime="${a.date}">${date(a.date)}</time> / ${parseInt(a.readTime)} ${t.reading}</span><h2>${esc(meta(a).title)}</h2><p>${esc(meta(a).summary)}</p><span class="project-open">${t.read} ${arrow}</span></div></a></article>`).join('')}</div><a class="text-link design-behance" href="${profile.medium}">Medium ${arrow}</a></section>`);
  const a=article;
  const marked=new Marked({renderer:{html({text}){return esc(text);},image({href,text}){const src=href.startsWith('./')?media(a,href.slice(2)):href;return `<img src="${esc(src)}" alt="${esc(text)}" loading="lazy" decoding="async">`;}}});
  const content=marked.parse(a.body.replaceAll('$2^n$','2ⁿ').replaceAll('$n$','n'));
  return layout({lang,route,title:`${meta(a).title} — ${profile.name}`,description:meta(a).summary,article:true,alternates:{en:`blog/${a.slug}/index.html`,ro:`ro/blog/${a.slug}/index.html`},body:`<article class="container article-page"><a class="back-link" href="${base}${blogRoute(lang)}">← ${t.allArticles}</a><header class="article-header"><span class="eyebrow"><time datetime="${a.date}">${date(a.date)}</time> / ${parseInt(a.readTime)} ${t.reading}</span><h1>${esc(meta(a).title)}</h1><p>${esc(meta(a).summary)}</p><div class="article-byline"><img src="${base}assets/portrait.jpg" alt="" width="44" height="44"><span>${profile.name}</span><span>${t.original}</span></div></header><img class="article-cover" src="${media(a,'cover.png')}" alt="" width="1280" height="720"><section class="article-audio" aria-label="${t.listen}"><h2>${t.listen} <span lang="en">/ English</span></h2><audio controls preload="none" src="${media(a,'narration.mp3')}"></audio></section><div class="article-prose" lang="en">${content}</div><div class="article-end"><a class="text-link" href="${base}${blogRoute(lang)}">← ${t.allArticles}</a><a class="text-link" href="${profile.medium}">Medium ${arrow}</a></div></article>`});
}
