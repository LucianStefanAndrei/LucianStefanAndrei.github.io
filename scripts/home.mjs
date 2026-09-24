import { profile, projects, copy } from '../content/site.mjs';
import { renderMobius } from '../assets/mobius.mjs';
import { renderPolyhedron } from '../assets/polyhedron.mjs';
import { layout, esc, arrow, edgeDecor, socialLinks, projectRoute } from './layout.mjs';

export function renderHome(lang) {
 const t=copy[lang];
 const base=lang==='en'?'./':'../';

 const asset=name=>base+'assets/'+name;
 const milestones=t.highlights.map(([title,detail])=>`<li><i aria-hidden="true">✳</i><div><strong>${esc(title)}</strong><span>${esc(detail)}</span></div></li>`).join('');
  const card = (p, i) => {
    const c = p[lang];
    const href = `${base}${projectRoute(lang,p.id)}`;
    return `<article class="project-card project-${i + 1}${i === 0 ? ' project-featured' : ''} reveal" id="${p.id}"><a class="project-card-link" href="${href}" aria-label="${esc(c.name)}">
      <div class="project-preview"><div class="preview-label"><span>${String(i + 1).padStart(2, '0')} / ${esc(c.name)}</span><span aria-hidden="true">+</span></div>
        <img src="${asset(p.image)}" alt="${esc(c.alt)}" width="${p.imageWidth||720}" height="${p.imageHeight||420}" loading="lazy" decoding="async">
        <span class="illustration-label">${esc(c.previewLabel||t.illustration)}</span><span class="preview-corner" aria-hidden="true"></span>
      </div>
      <div class="project-content">${i === 0 ? `<div class="featured-label"><span aria-hidden="true">↗</span>${t.featured}</div>` : ''}<div class="project-meta"><span>${esc(c.category)}</span><span>${esc(c.date)}</span></div>
        <h3>${esc(c.name)}</h3><p>${esc(c.description)}</p>
        <ul class="tags" aria-label="${lang === 'en' ? 'Technologies' : 'Tehnologii'}">${p.tags.map(tag => `<li>${esc(tag)}</li>`).join('')}</ul>
        <span class="project-open">${t.details}${arrow}</span>
      </div>
    </a></article>`;
  };
return layout({lang,route:lang==='en'?'index.html':'ro/index.html',title:t.title,description:t.description,home:true,alternates:{en:'index.html',ro:'ro/index.html'},scripts:['mobius.mjs','polyhedron.mjs'],body:`
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero-topline"><span><i class="tiny-square" aria-hidden="true"></i>${t.discipline}</span><span>${t.location}</span></div>
      <div class="hero-grid"><div class="hero-copy"><h1 id="hero-title">${t.heroName.map((part, i) => `<span style="--i:${i}">${part}</span>`).join('')}</h1><p class="hero-role">${t.role}</p><p class="hero-intro">${t.intro}</p><div class="hero-actions"><a class="button button-red" href="#work">${t.viewWork}<span aria-hidden="true">↘</span></a><a class="button button-outline" href="#contact">${t.getInTouch}<span aria-hidden="true">↗</span></a></div></div>
      <div class="hero-art ascii-panel"><div class="art-coordinates" aria-hidden="true"><span>Σ / 001</span><span>+ + +</span></div><div class="ascii-stage" aria-hidden="true"><pre class="ascii-output mobius-ascii">${esc(renderMobius())}</pre></div><div class="art-footer"><span>${t.figure}</span><button class="motion-toggle" type="button" data-pause="${t.pauseMotion}" data-play="${t.playMotion}" hidden>${t.pauseMotion}</button></div><span class="art-side" aria-hidden="true">${t.figureSide}</span></div></div>
      <div class="hero-bottom"><span class="availability"><i aria-hidden="true"></i>${t.availability}</span><a href="#work">${t.scroll}<span aria-hidden="true">↓</span></a></div>
    </section>
    <section class="work section-rule" id="work" aria-labelledby="work-title">${edgeDecor}<div class="container section-space">
      <div class="section-kicker"><span>${t.workLabel}</span><span>${t.projectCount}</span></div><div class="section-heading reveal"><h2 id="work-title">${t.workTitle}</h2><p>${t.workIntro}</p></div>
      <div class="project-grid">${projects.map(card).join('')}</div>
    </div></section>
    <section class="about section-rule" id="about" aria-labelledby="about-title">${edgeDecor}<div class="container section-space"><div class="about-section-heading"><span class="section-index">${t.aboutLabel}</span><h2 id="about-title" class="reveal">${t.aboutTitle}</h2><span aria-hidden="true">● ■ ▲</span></div><div class="about-grid">
        <div class="about-portrait reveal"><div class="about-art ascii-panel"><div class="art-coordinates" aria-hidden="true"><span>Σ / 002</span><span>+ + +</span></div><div class="ascii-stage" aria-hidden="true"><pre class="ascii-output polyhedron-ascii">${esc(renderPolyhedron())}</pre></div><div class="art-footer"><span>${t.aboutFigure}</span><button class="motion-toggle" type="button" data-pause="${t.pauseMotion}" data-play="${t.playMotion}" hidden>${t.pauseMotion}</button></div></div></div>
        <div class="about-copy reveal"><h3>${t.aboutIntro}</h3><p>${t.bio}</p><div class="education"><span aria-hidden="true">↗</span><div><strong>${t.education}</strong><p>${t.university}<br>${t.educationDate}</p></div></div></div>
      </div><div class="skills-grid">${t.skillGroups.map(([name, skills], i) => `<div class="skill-group reveal"><h3><span class="skill-marker marker-${i}" aria-hidden="true"></span>${name}</h3><ul class="tags">${skills.map(s => `<li>${s}</li>`).join('')}</ul></div>`).join('')}</div>
    </div><section class="highlights" aria-labelledby="milestones-title"><div class="container milestones-header"><h3 id="milestones-title">${t.highlightsLabel}</h3><button class="milestones-toggle" type="button" data-pause="${t.pauseHighlights}" data-play="${t.playHighlights}" hidden>${t.pauseHighlights}</button></div><div class="milestones-window"><div class="milestones-track"><ul class="milestone-list">${milestones}</ul><ul class="milestone-list milestone-duplicate" aria-hidden="true">${milestones}</ul></div></div></section></section>
    <section class="process section-rule" aria-labelledby="process-title"><div class="container section-space"><div class="section-kicker"><span>${t.processLabel}</span><span aria-hidden="true">↗</span></div><div class="section-heading reveal"><h2 id="process-title">${t.processTitle}</h2><p>${t.processIntro}</p></div><div class="process-grid">${t.steps.map(([title, description], i) => `<article class="process-step reveal"><div class="step-number step-${i}" aria-hidden="true"><span>0${i + 1}</span></div><h3>${title}</h3><p>${description}</p></article>`).join('')}</div></div></section>
    <section class="contact section-rule" id="contact" aria-labelledby="contact-title"><div class="container section-space"><div class="section-kicker"><span>${t.contactLabel}</span><span aria-hidden="true">●</span></div><div class="contact-grid"><div class="reveal"><h2 id="contact-title">${t.contactTitle}</h2></div><div class="contact-info reveal"><div class="contact-arrow" aria-hidden="true">↗</div><p>${t.contactIntro}</p><span class="email-label">${t.emailLabel}</span><a class="email-link" href="mailto:${esc(profile.email)}">${esc(profile.email)}<span aria-hidden="true">↗</span></a><div class="social-links">${socialLinks()}</div>${profile.resume?`<a class="resume-link" href="${base}${profile.resume}" download>${t.resume}<span aria-hidden="true">↓</span><small>${t.resumeNote}</small></a>`:''}</div></div></div><div class="contact-circle" aria-hidden="true"></div></section>
`});
}
