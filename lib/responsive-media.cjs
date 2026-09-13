'use strict';
const {parseDocument,DomUtils:D}=require('htmlparser2');
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const SIZES='(max-width: 767px) calc(100vw - 40px), (max-width: 991px) calc(100vw - 80px), 800px';
function renderPhotos(html,slug,manifest,en=false) {
  if(!manifest.posts.includes(slug))return html;
  const bySource=new Map(manifest.photos.filter(p=>p.post===slug).map(p=>[p.src,p]));
  const doc=parseDocument(html,{withStartIndices:true,withEndIndices:true}),patches=[];
  for(const image of D.findAll(n=>n.name==='img',doc.children)) {
    let key;
    try{const u=new URL(image.attribs.src,'https://youngforest.github.io');if(u.origin!=='https://youngforest.github.io')continue;key=decodeURIComponent(u.pathname);}catch{continue;}
    const photo=bySource.get(key);if(!photo)continue;
    const original=html.slice(image.startIndex,image.endIndex+1);
    if(/\b(?:srcset|data-responsive-photo)=/.test(original))continue;
    const attrs=' data-responsive-photo="'+esc(photo.id)+'" width="'+photo.width+'" height="'+photo.height+
      '" srcset="'+esc(photo.outputs.map(o=>o.src+' '+o.width+'w').join(', '))+
      '" sizes="'+SIZES+'" loading="lazy" decoding="async"';
    const tag=original.replace(/\s+(?:width|height|loading|decoding)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,'').replace(/\s*\/?>$/,attrs+'>');
    const label=en?'View original':'查看原图';
    const link='<span class="photo-original"><a href="'+esc(image.attribs.src)+'" aria-label="'+
      esc(label+' · '+(image.attribs.alt||photo.id))+'">'+label+'</a></span>';
    patches.push({start:image.startIndex,end:image.endIndex+1,value:tag+link});
  }
  for(const p of patches.reverse())html=html.slice(0,p.start)+p.value+html.slice(p.end);
  return html;
}
module.exports={renderPhotos,SIZES};
