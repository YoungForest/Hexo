'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {parseDocument, DomUtils: D} = require('htmlparser2');
const ORIGIN = 'https://youngforest.github.io';
const cls = (n, c) => (n.attribs?.class || '').split(/\s+/).includes(c);
const all = (doc, test) => D.findAll(test, doc.children || []);
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
}
function inventory(publicDir) {
  const root = path.resolve(publicDir);
  if (!fs.existsSync(root)) throw new Error('Build the site before checking links: '+root);
  // The exact-case inventory is essential on Windows: existsSync alone hides case errors.
  const files = new Map(walk(root).map(f => [path.relative(root,f).replaceAll('\\','/'),f]));
  return {files, ids:new Map()};
}
function owner(url) {
  return url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'Hexo';
}
function resolveLocal(value, base, sites) {
  let url;
  try { url = new URL(value,base); } catch { return {error:'invalid-url'}; }
  if (!['http:','https:'].includes(url.protocol)) return {skip:true};
  if (url.origin !== ORIGIN) return {external:url.href};
  const site = owner(url), catalog = sites[site];
  if (!catalog) return {deferred:site};
  let relative;
  try { relative = decodeURIComponent(url.pathname === '/en' ? '' :
    url.pathname.slice(site === 'en' ? 4 : 1)); }
  catch { return {error:'invalid-encoding'}; }
  if (relative.includes('\\') || relative.includes('\0') ||
      relative.split('/').some(p => p === '..' || p === '.')) return {error:'unsafe-path'};
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  if (!catalog.files.has(relative) && catalog.files.has(relative+'/index.html')) relative += '/index.html';
  const file = catalog.files.get(relative);
  if (!file) return {error:'missing-or-wrong-case', site, relative};
  let fragment;
  try { fragment = decodeURIComponent(url.hash.slice(1).split(':~:')[0]); }
  catch { return {error:'invalid-fragment-encoding'}; }
  if (fragment && relative.endsWith('.html')) {
    if (!catalog.ids.has(relative)) {
      const doc = parseDocument(fs.readFileSync(file,'utf8'));
      catalog.ids.set(relative,new Set(all(doc,n => n.attribs?.id ||
        n.name === 'a' && n.attribs?.name).map(n => n.attribs.id || n.attribs.name)));
    }
    if (!catalog.ids.get(relative).has(fragment)) return {error:'missing-fragment',site,relative,fragment};
  }
  return {ok:true,site,relative};
}
function references(site, catalog) {
  const result = [];
  for (const [relative,file] of catalog.files) {
    if (!/^\d{4}\/\d{2}\/\d{2}\/.+\/index\.html$/.test(relative)) continue;
    const doc = parseDocument(fs.readFileSync(file,'utf8'));
    const body = all(doc,n => cls(n,'post-body'))[0];
    if (!body) continue;
    const page = ORIGIN+'/'+(site==='en'?'en/':'')+relative.replace(/index\.html$/,'');
    for (const n of all(body,n => n.name === 'a' || n.name === 'img' || n.name === 'source')) {
      const attr = n.name === 'a' ? 'href' : 'src';
      if (n.attribs?.[attr]) result.push({page,value:n.attribs[attr],attribute:attr});
      // This site's responsive image filenames contain no literal commas or spaces.
      if (n.attribs?.srcset && !n.attribs.srcset.startsWith('data:'))
        for (const candidate of n.attribs.srcset.split(','))
          result.push({page,value:candidate.trim().split(/\s+/)[0],attribute:'srcset'});
    }
  }
  return result;
}
function audit(sites) {
  const errors = [], external = new Set(); let checked=0, deferred=0;
  for (const [site,catalog] of Object.entries(sites)) for (const ref of references(site,catalog)) {
    const result = resolveLocal(ref.value,ref.page,sites);
    if (result.error) errors.push({...ref,...result});
    else if (result.deferred) deferred++;
    else if (result.external) external.add(result.external);
    else if (result.ok) checked++;
  }
  return {checked,deferred,errors,external:[...external].sort()};
}
module.exports = {ORIGIN,inventory,resolveLocal,references,audit};
