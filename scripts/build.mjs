import { mkdir,writeFile,cp,rm,rmdir,readFile } from 'node:fs/promises';
import path from 'node:path';
import { profile } from '../content/site.mjs';
import { catalog,designWorks } from '../content/catalog.mjs';
import { renderHome } from './home.mjs';
import { renderProjects,renderProject,renderDesign,renderBlog,loadArticles } from './pages.mjs';
import { prefix,projectRoute,blogRoute,esc } from './layout.mjs';
import { prepareWireframe } from './wireframe.mjs';

for(const project of catalog.filter(project=>project.media?.model)){
  await prepareWireframe(project.media.model,project.media.wireframe);
  // Remove only the generated download copies; originals remain in public/projects.
  if(!/^[a-z0-9-]+$/.test(project.id))throw Error('Invalid project ID');
  for(const root of ['assets','dist/assets'])await rm(`${root}/media/projects/${project.id}/source.step`,{force:true});
}

await mkdir('assets/media',{recursive:true});
await cp('public/web_design','assets/media/design',{recursive:true});
await cp('public/posts','assets/media/posts',{recursive:true,filter:source=>!source.endsWith('.md')});
const articles=await loadArticles();
const pages=new Map();
for(const lang of ['en','ro']){
  pages.set(`${prefix(lang)}index.html`,renderHome(lang));
  pages.set(`${prefix(lang)}projects/index.html`,renderProjects(lang));
  pages.set(`${prefix(lang)}web-design/index.html`,renderDesign(lang));
  pages.set(blogRoute(lang),renderBlog(lang,articles));
  for(const p of catalog)pages.set(projectRoute(lang,p.id),renderProject(p,lang));
  for(const work of designWorks)pages.set(`${prefix(lang)}web-design/${work.id}/index.html`,renderDesign(lang,work));
  for(const article of articles)pages.set(`${prefix(lang)}blog/${article.slug}/index.html`,renderBlog(lang,articles,article));
}
await mkdir('dist',{recursive:true});
// Remove only stale generated HTML recorded by our previous build, never source files.
const manifestFile='.tmp/generated-pages.json';
let previous=[];try{previous=JSON.parse(await readFile(manifestFile,'utf8'));}catch{}
for(const route of previous){
  if(pages.has(route)||!/^((ro\/)?(cad|projects|web-design|blog)\/)?[a-z0-9\-/]*index\.html$/.test(route))continue;
  await rm(path.join('dist',route),{force:true});
  const outputRoot=path.resolve('dist');
  let directory=path.dirname(path.resolve('dist',route));
  while(directory.startsWith(outputRoot+path.sep)){
    try{await rmdir(directory);}catch(error){if(error.code!=='ENOENT'&&error.code!=='ENOTEMPTY')throw error;break;}
    directory=path.dirname(directory);
  }
}
for(const [route,html] of pages){
  const target=path.join('dist',route);
  await mkdir(path.dirname(target),{recursive:true});await writeFile(target,html);
}
// Original documents and unpublished résumés are never part of the static output.
await cp('assets','dist/assets',{recursive:true,filter:source=>{
  if(/\.(step|stp|odt)$/i.test(source))return false;
  const isResume=/^(cv[_-]|resume).*\.pdf$/i.test(path.basename(source));
  return !isResume||source.replaceAll(path.sep,'/')===profile.resume;
}});
if(!profile.resume)await rm('dist/assets/CV_Stefan_Lucian_Ro.pdf',{force:true});
await mkdir('.tmp',{recursive:true});await writeFile(manifestFile,JSON.stringify([...pages.keys()]));
if(profile.siteUrl){
  const origin=profile.siteUrl.replace(/\/$/,'');
  await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...pages.keys()].map(route=>`<url><loc>${esc(origin+'/'+route.replace(/index\.html$/,''))}</loc></url>`).join('')}</urlset>`);
}else for(const name of ['robots.txt','sitemap.xml'])await rm(`dist/${name}`,{force:true});
console.log(`Built ${pages.size} static pages: ${catalog.length} projects, ${designWorks.length} design collections, ${articles.length} articles, in English and Romanian. Output: dist/`);
