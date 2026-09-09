import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import yaml from 'js-yaml';
import {parseDocument} from 'htmlparser2';
import {calendarDate} from './reading-dates.mjs';
const read=file=>fs.readFileSync(file,'utf8');
const config=yaml.load(read('_config.yml')),theme=yaml.load(read('_config.next.yml')),manifest=yaml.load(read('source/_data/discovery.yml'));
const root=config.root,base=config.url.endsWith('/')?config.url:config.url+'/',en=root==='/en/';
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const find=(n,p)=>[...(p(n)?[n]:[]),...(n.children||[]).flatMap(c=>find(c,p))];
const tag=(n,t)=>find(n,c=>c.name===t);
const text=n=>n?.type==='text'?n.data:(n?.children||[]).map(text).join('');
const cls=(n,c)=>(n.attribs?.class||'').split(' ').includes(c);
const dom=route=>parseDocument(read('public/'+route+'index.html'));
const records=new Map();
for(const file of walk('source/_posts').filter(f=>f.endsWith('.md'))) {
 const fm=yaml.load(read(file).match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)[1]);
 records.set(path.basename(file,'.md'),fm);
}
const pages=new Map();
for(const file of walk('public').filter(f=>f.endsWith('.html'))) {
 const doc=parseDocument(read(file)),canonical=tag(doc,'link').find(n=>n.attribs.rel==='canonical')?.attribs.href;
 if(canonical)pages.set(canonical,doc);
}
function localLink(href) {
 if(!href)return; // Theme action buttons may use anchors without href.
 const url=new URL(href,base);
 if(url.origin!==new URL(base).origin)return;
 if(en) assert(!url.pathname.startsWith('/en/en/'),'Double language prefix');
 if(!url.pathname.startsWith(root)||(!en&&url.pathname.startsWith('/en/')))return;
 const rel=decodeURIComponent(url.pathname.slice(root.length));
 const file='public/'+rel+(rel.endsWith('/')?'index.html':'');
 assert(fs.existsSync(file),'Missing target: '+href);
}
for(const route of ['reading/','series/year-in-review/']) {
 const doc=dom(route);assert.equal(tag(doc,'h1').length,1,'Page H1');
 assert.equal(tag(doc,'link').find(n=>n.attribs.rel==='canonical')?.attribs.href,base+route);
 for(const [lang,target] of [['zh-CN','https://youngforest.github.io/'+route],['en','https://youngforest.github.io/en/'+route],['x-default','https://youngforest.github.io/'+route]])assert.equal(tag(doc,'link').find(n=>n.attribs.hreflang===lang)?.attribs.href,target);
 assert.equal(find(doc,n=>Object.hasOwn(n.attribs||{},'data-pagefind-body')).length,0,'Do not index directory pages');
 tag(doc,'a').forEach(n=>localLink(n.attribs.href));
 const feed=parseDocument(read('public/atom.xml'),{xmlMode:true});
 for(const entry of tag(feed,'entry'))assert(!tag(entry,'link').some(n=>n.attribs.href===base+route),'Page leaked into post RSS');

}
const reading=dom('reading/'),entries=find(reading,n=>cls(n,'discovery-note'));
assert.equal(entries.length,manifest.reading.length);
const byKind=Object.fromEntries(['book-note','book-screen','external-review'].map(k=>[k,0]));
const seen=new Set(),published=[];
for(const entry of entries) {
 const link=tag(entry,'h2').flatMap(n=>tag(n,'a'))[0],url=new URL(link.attribs.href,base);
 const id=decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1)),fm=records.get(id);
 assert(fm,'Missing source for list entry');assert(!seen.has(id),'Repeated list entry');seen.add(id);
 const declared=manifest.reading.find(r=>r.post===id);
 assert.equal(entry.attribs['data-note-kind'],declared.kind);byKind[declared.kind]++;
 assert.equal(text(link),fm.title);assert.equal(text(find(entry,n=>cls(n,'discovery-description'))[0]),fm.description);
 assert.equal(tag(entry,'time')[0].attribs.datetime,calendarDate(fm.date));published.push(calendarDate(fm.date));
}
assert.deepEqual(published,[...published].sort().reverse(),'Reading list date order');
assert.deepEqual([...seen].sort(),manifest.reading.map(r=>r.post).sort());
const series=manifest.series[0],annual=dom('series/year-in-review/');
assert.deepEqual(find(annual,n=>cls(n,'discovery-year-label')).map(n=>Number(text(n))),series.items.map(i=>i.year).sort((a,b)=>b-a));
const allYears=[...series.items].sort((a,b)=>a.year-b.year);
let indexed=0;
for(const [url,doc] of pages) {
 const pathname=new URL(url).pathname;
 if(!/^\d{4}\/\d{2}\/\d{2}\//.test(pathname.slice(root.length)))continue;
 const id=decodeURIComponent(pathname.split('/').filter(Boolean).at(-1));
 if(!records.has(id))continue;
 indexed++;
 assert.equal(tag(doc,'h1').length,1,'Article H1');
 assert(find(doc,n=>cls(n,'post-body')).length===1,'Article body: '+url);
 const item=allYears.find(i=>i.post===id),nav=find(doc,n=>cls(n,'discovery-series'));
 if(item) {
  assert.equal(nav.length,1);assert.equal(find(doc,n=>cls(n,'post-nav')).length,0,'Duplicate navigation');
  const i=allYears.indexOf(item),older=tag(nav[0],'a').find(n=>n.attribs.rel==='prev'),newer=tag(nav[0],'a').find(n=>n.attribs.rel==='next');
  for(const [link,target] of [[older,allYears[i-1]],[newer,allYears[i+1]]]) {
   assert.equal(Boolean(link),Boolean(target),'Series boundary');
   if(target)assert(new URL(link.attribs.href,base).pathname.endsWith('/'+target.post+'/'),'Wrong series destination');
  }
 }
}
assert.equal(indexed,records.size,'Published post coverage');
assert.equal(theme.local_search.enable,true,'Retain existing search after failed trial');
assert(!fs.existsSync('public/pagefind'),'Rejected search index must not ship');
assert(!fs.existsSync('public/search/index.html'),'Unpublished trial page must not ship');
assert(!fs.existsSync('public/js/search-page.js'),'Rejected search UI must not ship');
for(const doc of pages.values()) {
 assert.equal(find(doc,n=>Object.keys(n.attribs||{}).some(k=>k.startsWith('data-pagefind'))).length,0,'No trial indexing markers');
 for(const script of tag(doc,'script')) assert(!/pagefind|search-page\.js/.test(script.attribs.src||''),'No trial search runtime');
}
const pkg=JSON.parse(read('package.json'));
for(const dependency of ['pagefind','minisearch','flexsearch'])assert(!pkg.dependencies?.[dependency]&&!pkg.devDependencies?.[dependency],'No rejected search dependency');
assert(fs.existsSync('public/search.json'),'Retain legacy data for compatibility');
assert.equal(theme.utterances.repo,'YoungForest/blog-comments');assert.equal(theme.utterances.issue_term,'pathname');assert.equal(theme.disqus.enable,false);
console.log(JSON.stringify({discovery:'passed',posts:records.size,reading:entries.length,kinds:byKind,annual:allYears.length,validatedPosts:indexed,search:'retained NeXT local search',root}));
