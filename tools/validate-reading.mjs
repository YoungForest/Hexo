import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import yaml from 'js-yaml';
import { parseDocument } from 'htmlparser2';
import { calendarDate } from './reading-dates.mjs';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const config=yaml.load(read('_config.yml'));
const theme=yaml.load(read('_config.next.yml'));
const base=config.url.endsWith('/')?config.url:config.url+'/';
const en=new URL(base).pathname.startsWith('/en/');
const prefix=en?'/en/':'/';
const routes=['start-here/','topics/','topics/technology/','topics/career-growth/','topics/reading/','topics/life-abroad/'];
const retired=['2023/06/10/Ireland-Microsoft-probation-period/',...(en?['2021/09/22/LeetCode-biweekly-contest-61/']:[])];
const slugs=['recommender-systems-of-popular-apps','Tencent-WeChat-backend-intern-interview','my-3-years-master','Find-a-Europe-SDE-job-from-China','The-World-I-see','Why-Nations-fail','my-britain-trip','foreign-companies-comparision-between-China-Europe'];
function nodes(node,tag) { return (node.children??[]).flatMap(n=>[...(n.name===tag?[n]:[]),...nodes(n,tag)]); }
const text=n=>n.type==='text'?n.data:(n.children??[]).map(text).join('');
const cls=(n,c)=>(n.attribs?.class??'').split(/\s+/).includes(c);
const parse=s=>parseDocument(s);
const html=route=>parse(read('public/'+route+'index.html'));
const links=doc=>nodes(doc,'a').map(n=>n.attribs.href).filter(Boolean);
function checkLinks(doc,route) {
 for(const href of links(doc)){
  const u=new URL(href,base+route);
  if(u.origin!==new URL(base).origin || !u.pathname.startsWith(prefix) || (!en&&u.pathname.startsWith('/en/')))continue;
  const local=decodeURI(u.pathname.slice(prefix.length));
  assert(!local.startsWith('en/'),'Repeated language prefix: '+href);
  const file='public/'+local+(local.endsWith('/')?'index.html':'');
  assert(fs.existsSync(path.join(root,file)),'Missing internal target: '+href);
 }
}
function meta(doc,prop) {return nodes(doc,'meta').find(n=>n.attribs.property===prop)?.attribs.content;}
assert.equal(config.updated_option,'date');
assert.equal(theme.excerpt_description,true);
assert.equal(theme.post_meta.created_at,true);
assert.equal(theme.post_meta.updated_at.another_day,true);
assert.equal(theme.text_align.mobile,'left');
const fm=source=>yaml.load(source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)[1]);
const records=new Map();
for(const name of fs.readdirSync(path.join(root,'source/_posts')).filter(n=>n.endsWith('.md'))){
 const post=fm(read('source/_posts/'+name));
 const date=calendarDate(post.date);
 if(post.updated)calendarDate(post.updated);
 const route=date.replaceAll('-','/')+'/'+name.slice(0,-3)+'/';
 const doc=html(route);
 assert.equal(nodes(doc,'h1').length,1,'H1 count: '+name);
 const canonical=nodes(doc,'link').find(n=>n.attribs.rel==='canonical')?.attribs.href;
 assert.equal(canonical,base+route,'Canonical: '+name);
 if(!post.updated)assert.equal(meta(doc,'article:modified_time'),meta(doc,'article:published_time'),'mtime leak: '+name);
 const languageLinks=nodes(doc,'span').filter(n=>cls(n,'post-translation'));
 const target=post.translations?.[en?'zh-CN':'en'];
 assert.equal(languageLinks.length,target?1:0,'Translation UI: '+name);
 if(target)assert.equal(links(languageLinks[0])[0],target);
 records.set(name.slice(0,-3),{post,route,doc});
}
const index=html('');
assert.equal(nodes(index,'section').filter(n=>cls(n,'home-guide')).length,1);
assert.equal(nodes(index,'article').length,10);
assert.equal(nodes(html('page/2/'),'section').filter(n=>cls(n,'home-guide')).length,0);
checkLinks(index,'');
checkLinks(html('page/2/'),'page/2/');
const featured=nodes(index,'ul').find(n=>cls(n,'home-featured'));
assert.equal(links(featured).length,3);
assert.deepEqual(links(featured),['my-3-years-master','Find-a-Europe-SDE-job-from-China','The-World-I-see'].map(s=>prefix+records.get(s).route));
const homeTopics=nodes(index,'nav').find(n=>cls(n,'home-topics'));
assert.deepEqual(links(homeTopics),routes.slice(2).map(r=>prefix+r));
const feed=parseDocument(read('public/atom.xml'),{xmlMode:true});
const sitemap=parseDocument(read('public/sitemap.xml'),{xmlMode:true});
for(const route of routes){
 const doc=html(route);
 assert.equal(nodes(doc,'h1').length,1,'Guide H1: '+route);
 assert.equal(nodes(doc,'link').find(n=>n.attribs.rel==='canonical')?.attribs.href,base+route);
 const alternates=nodes(doc,'link').filter(n=>n.attribs.hreflang);
 for(const [language,address] of [['zh-CN','https://youngforest.github.io/'+route],['en','https://youngforest.github.io/en/'+route],['x-default','https://youngforest.github.io/'+route]])
  assert(alternates.some(n=>n.attribs.hreflang===language&&n.attribs.href===address),'Guide alternate '+route);
 assert(nodes(sitemap,'loc').some(n=>text(n).replace(/index\.html$/,'')===base+route),'Missing sitemap guide '+route);
 assert(!nodes(feed,'entry').some(n=>nodes(n,'id').some(i=>text(i)===base+route)),'Guide in article feed');
 assert(!nodes(doc,'script').some(n=>(n.attribs.src??'').includes('utteranc.es')),'Guide comments enabled');
 checkLinks(doc,route);
}
for(const slug of slugs)assert(links(html('start-here/')).includes(base+records.get(slug).route),'Missing curated post '+slug);
for(const entry of nodes(feed,'entry')){
 const record=[...records.values()].find(r=>base+r.route===text(nodes(entry,'id')[0]));
 if(record&&!record.post.updated)assert.equal(text(nodes(entry,'updated')[0]),text(nodes(entry,'published')[0]),'RSS updated differs');
}
for(const item of nodes(sitemap,'url')){
 const record=[...records.values()].find(r=>base+r.route===text(nodes(item,'loc')[0]));
 if(record&&!record.post.updated) {
  const modified=nodes(item,'lastmod')[0];
  if(modified)assert.equal(text(modified).slice(0,10),meta(record.doc,'article:published_time').slice(0,10),'Sitemap updated differs');
 }
}
for(const route of retired){
 assert(!fs.existsSync(path.join(root,'public',route)),'Retired page generated');
 for(const file of ['atom.xml','sitemap.xml','search.json','index.html','archives/index.html'])
  assert(!read('public/'+file).includes(route),'Retired reference '+file);
}
if(en){
 const win=records.get('Windows-Dev-Improvement').doc;
 assert.equal(nodes(win,'h3').filter(n=>text(n)==='How to install and set up Clink').length,1);
}else{
 const review=records.get('2025-summary-and-2026-resolutions').doc;
 const anchor=nodes(review,'a').find(n=>text(n)==='读后感列表');
 assert.equal(anchor?.attribs.href,'https://youngforest.github.io/categories/%E8%AF%BB%E5%90%8E%E6%84%9F/');
}
assert.equal(theme.utterances.repo,'YoungForest/blog-comments');
assert.equal(theme.utterances.issue_term,'pathname');
console.log('Reading validation passed: '+records.size+' posts, 6 guides, dates, feeds, translations, curated links and retired routes.');
