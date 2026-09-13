'use strict';
const fs=require('node:fs'),path=require('node:path');
const {renderPhotos}=require('../lib/responsive-media.cjs');
let manifest;
hexo.extend.filter.register('before_generate',()=>{
  manifest=JSON.parse(fs.readFileSync(path.join(hexo.base_dir,'source/_data/responsive-media.json'),'utf8'));
});
hexo.extend.helper.register('reading_photos',post=>renderPhotos(post.content,path.basename(post.source||'', '.md'),manifest,hexo.config.root==='/en/'));

const {parseDocument,DomUtils:D}=require('htmlparser2');
// Patch only the complete page shell. Never reserialize or mutate the author's body HTML.
hexo.extend.filter.register('after_render:html',html=>{
  const doc=parseDocument(html,{withStartIndices:true,withEndIndices:true});
  const body=D.findOne(n=>n.name==='body',doc.children);
  const target=D.findOne(n=>(n.attribs?.class||'').split(/\s+/).includes('main-inner'),doc.children);
  if(!body||!target||D.findOne(n=>(n.attribs?.class||'').split(/\s+/).includes('skip-link'),doc.children))return html;
  const id=target.attribs.id||'reading-content';
  if(!target.attribs.id&&D.findOne(n=>n.attribs?.id===id,doc.children))throw Error('Skip target ID collision');
  if(!target.attribs.id)html=html.slice(0,target.startIndex)+html.slice(target.startIndex).replace(/^<[\w:-]+/,s=>s+' id="'+id+'"');
  const label=hexo.config.root==='/en/'?'Skip to content':'跳到正文';
  const end=html.indexOf('>',body.startIndex)+1;
  return html.slice(0,end)+'<a class="skip-link" href="#'+id+'">'+label+'</a>'+html.slice(end);
},30);
