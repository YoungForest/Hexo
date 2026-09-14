'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),yaml=require('js-yaml');
const {parseDocument,DomUtils:D}=require('htmlparser2');
const cls=(n,c)=>(n.attribs?.class||'').split(/\s+/).includes(c);
const all=(n,p)=>D.findAll(p,n.children||[]);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
function validate() {
 const en=yaml.load(fs.readFileSync('_config.yml','utf8')).root==='/en/',root=en?'/en/':'/';
 let posts=0,sections=0,pages=0;
 for(const file of walk('public').filter(f=>f.endsWith('.html'))) {
  const html=fs.readFileSync(file,'utf8'),doc=parseDocument(html),main=all(doc,n=>cls(n,'main-inner'))[0];
  if(!main)continue;
  pages++;
  const dialog=all(doc,n=>n.name==='dialog'&&cls(n,'search-dialog'));
  assert.equal(dialog.length,1,file+' one native search dialog');
  assert.equal(all(doc,n=>n.name==='script'&&n.attribs.src===root+'js/search-ui.js').length,1,'One controller');
  assert(!html.includes('src="'+root+'js/third-party/search/local-search.js"'),'Old controller not loaded');
  assert.equal(all(dialog[0],n=>n.name==='label'&&n.attribs.for==='site-search-input').length,1);
  assert.equal(all(dialog[0],n=>cls(n,'popup-btn-close')&&n.name==='button'&&n.attribs['aria-label']).length,1);
  for(const a of all(doc,n=>n.name==='a'&&Object.hasOwn(n.attribs,'data-search-fallback')))assert.equal(a.attribs.href,root+'archives/');
  const links=all(doc,n=>cls(n,'section-link'));
  if(!cls(main,'post')){assert.equal(links.length,0,'No section UI outside articles');continue;}
  posts++;
  const body=all(main,n=>cls(n,'post-body'))[0],headings=all(body,n=>/^h[23]$/.test(n.name)&&n.attribs.id);
  assert.equal(links.length,headings.length,file+' one link per heading');
  for(const heading of headings){
   const a=all(heading,n=>cls(n,'section-link'));
   assert.equal(a.length,1);assert.equal(a[0].parent,heading);assert.equal(a[0].name,'a');
   assert.equal(decodeURIComponent(a[0].attribs.href.slice(1)),heading.attribs.id);
   assert.equal(D.textContent(a[0]),'','No added heading text');
   assert(a[0].attribs['aria-label'].startsWith(en?'Link to section: ':'本节链接：'));
   const svg=all(a[0],n=>n.name==='svg')[0];assert(svg&&svg.attribs['aria-hidden']==='true');
   sections++;
  }
 }
 const html=fs.readFileSync('public/404.html','utf8'),doc=parseDocument(html);
 assert(all(doc,n=>n.name==='meta'&&n.attribs.name==='robots'&&n.attribs.content==='noindex,follow').length===1);
 assert.equal(all(doc,n=>n.name==='link'&&(n.attribs.rel==='canonical'||n.attribs.hreflang)).length,0);
 assert.equal(all(doc,n=>n.attribs?.id==='utterances'||cls(n,'legacy-comments')).length,0);
 for(const dest of [root,root+'archives/',root+'topics/',root+'reading/',en?'/':'/en/',en?'/archives/':'/en/archives/'])assert(all(doc,n=>n.name==='a'&&n.attribs.href===dest).length,'404 recovery '+dest);
 for(const name of ['atom.xml','search.json','sitemap.xml']){
  const data=fs.readFileSync('public/'+name,'utf8');
  assert(!data.includes('/404.html')&&!data.includes('class=\\\"section-link\\\"')&&!data.includes('class=&quot;section-link&quot;'),'No UI/error page in '+name);
 }
 // Compare generated coverage rather than freezing today's count and blocking future posts.
 assert.equal(posts,JSON.parse(fs.readFileSync('public/search.json','utf8')).length,'Every indexed post has a validated article page');
 console.log(JSON.stringify({recovery:'passed',pages,posts,sections,root,notFound:'noindex; no canonical/translations/feed/search/sitemap; bilingual recovery'}));
}
module.exports=validate;
if(require.main===module)validate();
