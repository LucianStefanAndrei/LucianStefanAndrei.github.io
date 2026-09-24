import { profile, copy } from '../content/site.mjs';
import { sections } from '../content/sections.mjs';

export const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
export const identity = '<span class="identity" aria-hidden="true"><i></i><i></i><i></i></span>';
export const edgeDecor = '<div class="edge-decor" aria-hidden="true"><i class="edge-circle"></i><i class="edge-diamond"></i><i class="edge-triangle"></i></div>';
export const prefix = lang => lang === 'ro' ? 'ro/' : '';
export const rootPath = route => '../'.repeat(route.split('/').length - 1) || './';
export const projectRoute = (lang, id) => `${prefix(lang)}projects/${id}/index.html`;
export const blogRoute = lang => `${prefix(lang)}blog/index.html`;
const icons = {
  GitHub: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.2-1.5 6.2-6.9a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.7S17.5.6 14.7 2.4a13.4 13.4 0 0 0-7 0C4.9.6 3.7 1 3.7 1a5 5 0 0 0-.1 3.7A5.4 5.4 0 0 0 2.1 8.5c0 5.4 3.2 6.6 6.2 6.9a3.4 3.4 0 0 0-.9 2.7V22"/>',
  LinkedIn: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M7 10v7m4 0v-7m0 3a3 3 0 0 1 6 0v4"/><circle cx="7" cy="7" r=".7" fill="currentColor"/>',
  Behance: '<path d="M3 12h5a3 3 0 0 0 0-6H3v13h5a3.5 3.5 0 0 0 0-7M15 7h5m1 10a4 4 0 1 1 0-4v1h-7"/>',
  Medium: '<ellipse cx="7" cy="12" rx="6" ry="7" fill="currentColor" stroke="none"/><ellipse cx="17" cy="12" rx="3" ry="7" fill="currentColor" stroke="none"/><ellipse cx="22" cy="12" rx="1" ry="6" fill="currentColor" stroke="none"/>',
};
export const socialLinks = () => [['GitHub', profile.github], ['LinkedIn', profile.linkedin], ['Behance', profile.behance], ['Medium',profile.medium]].map(([name, href]) => `<a class="text-link" href="${esc(href)}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg><span>${name}</span>${arrow}</a>`).join('');

export function layout({ lang, route, title, description, body, alternates, home = false, scripts = [], article = false }) {
  const t = copy[lang], base = rootPath(route);
  const resume = profile.resume?.[lang];
  const homeHref = home ? '' : `${base}${prefix(lang)}index.html`;
  const origin = profile.siteUrl.replace(/\/$/, '');
  const canonical = `${origin}/${route.replace(/index\.html$/, '')}`;
  const asset = name => `${base}assets/${name}`;
  return `<!doctype html>
<html lang="${lang}"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title><meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#F0F0F0"><meta name="color-scheme" content="light">
  <meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
  <meta property="og:locale" content="${lang === 'en' ? 'en_GB' : 'ro_RO'}"><meta property="og:site_name" content="${esc(profile.name)}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">
  ${origin ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(origin)}/assets/social-card.png"><meta name="twitter:image" content="${esc(origin)}/assets/social-card.png">` : '<!-- Set profile.siteUrl to enable canonical and absolute social image URLs. -->'}
  ${Object.entries(alternates).map(([language, path]) => `<link rel="alternate" hreflang="${language}" href="${esc(origin ? origin + '/' + path : base + path)}">`).join('')}
  <link rel="icon" href="${asset('favicon.svg')}?v=2" type="image/svg+xml">
  <link rel="preload" href="${asset('fonts/outfit-latin.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${asset('styles.css')}"><script src="${asset('main.js')}" defer></script>
  <link rel="stylesheet" href="${asset('pages.css')}">
  ${scripts.map(script => `<script type="module" src="${asset(script)}"></script>`).join('')}
</head><body id="top">
  <a class="skip-link" href="#main">${t.skip}</a>
  <header class="site-header"><div class="container nav-wrap">
    <a class="brand" href="${homeHref || '#top'}" aria-label="${esc(profile.name)}">${identity}<span>ȘTEFAN<span class="brand-second"> ANDREI LUCIAN</span></span></a>
    <div class="nav-portrait"><img src="${asset('portrait.jpg')}" alt="${esc(profile.name)}" width="320" height="320" decoding="async"></div>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" data-open="${t.menu}" data-close="${t.close}" hidden><span>${t.menu}</span><i aria-hidden="true"></i></button>
    <nav id="navigation" aria-label="${lang === 'en' ? 'Main navigation' : 'Navigație principală'}"><a class="nav-link nav-home" href="${homeHref}#top"${home?' aria-current="page"':''}>${t.home}</a><a class="nav-link" href="${homeHref}#about">${t.about}</a><a class="nav-link" href="${base}${prefix(lang)}projects/index.html">${sections[lang].projects}</a><a class="nav-link" href="${base}${prefix(lang)}web-design/index.html">${sections[lang].design}</a><a class="nav-link" href="${base}${blogRoute(lang)}"${route.includes('/blog/') || route.startsWith('blog/') ? ' aria-current="page"' : ''}>${t.blog}</a><a class="nav-link" href="${homeHref}#contact">${t.contact}</a>${resume?`<a class="nav-resume" href="${base}${resume}" download aria-label="${t.resumeLabel}">${t.resume} <span aria-hidden="true">↓</span></a>`:''}
      <div class="language-switch" aria-label="${lang === 'en' ? 'Language' : 'Limbă'}">${['en','ro'].map((language, i) => `${i ? '<span aria-hidden="true">/</span>' : ''}<a lang="${language}" hreflang="${language}" href="${base}${alternates[language] || blogRoute(language)}" ${lang === language ? 'aria-current="page"' : ''} aria-label="${language === 'en' ? 'English' : 'Română'}">${language.toUpperCase()}</a>`).join('')}</div>
    </nav>
  </div></header>
  <main id="main">${body}</main>
  <footer><div class="container footer-inner"><a class="footer-brand" href="${homeHref || '#top'}">${identity}<span>ȘTEFAN ANDREI LUCIAN</span></a><div class="footer-socials" role="group" aria-label="${t.socials}">${socialLinks()}</div><a class="back-top" href="#top">${t.backTop}<span aria-hidden="true">↑</span></a><p>© ${new Date().getUTCFullYear()} · ${t.footerNote}</p></div></footer>
</body></html>`;
}
