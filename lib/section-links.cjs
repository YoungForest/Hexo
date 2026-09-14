'use strict';
const {parseDocument,DomUtils:D}=require('htmlparser2');
const cls=(n,c)=>(n.attribs?.class||'').split(/\s+/).includes(c);
const all=(n,p)=>D.findAll(p,n.children||[]);
const escape=value=>String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const icon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l2-2"/></svg>';
function enhance(html,english=false,report=()=>{}) {
 const doc=parseDocument(html,{withStartIndices:true,withEndIndices:true});
 const main=all(doc,n=>cls(n,'main-inner')&&cls(n,'post'))[0];
 if(!main)return html;
 const body=all(main,n=>cls(n,'post-body'))[0];
 if(!body)return html;
 const headings=all(body,n=>/^h[23]$/.test(n.name));
 const edits=[];
 for(const heading of headings) {
  let parent=heading.parent,excluded=false;
  while(parent&&parent!==body){if(['pre','code'].includes(parent.name)||cls(parent,'legacy-comments'))excluded=true;parent=parent.parent;}
  if(excluded||heading.attribs.id===undefined)continue;
  const id=heading.attribs.id;
  if(!id.trim()){
   const url=all(doc,n=>n.name==='link'&&n.attribs.rel==='canonical')[0]?.attribs.href||'(fixture)';
   report('Skipped existing empty section ID: '+url);continue;
  }
  if(all(doc,n=>n.attribs?.id===id).length!==1)throw Error('Conflicting section ID: '+id);
  const href='#'+encodeURIComponent(id);
  const existing=all(heading,n=>cls(n,'section-link'));
  if(existing.length){
   if(existing.length!==1||existing[0].name!=='a'||existing[0].attribs.href!==href||existing[0].parent!==heading)throw Error('Invalid existing section link: '+id);
   continue;
  }
  const label=(english?'Link to section: ':'本节链接：')+D.textContent(heading).replace(/\s+/g,' ').trim();
  const position=html.lastIndexOf('</',heading.endIndex);
  if(position<heading.startIndex||!/^<\/h[23]>/i.test(html.slice(position,heading.endIndex+1)))throw Error('Section closing tag not found');
  edits.push([position,'<a class="section-link" href="'+escape(href)+'" aria-label="'+escape(label)+'">'+icon+'</a>']);
 }
 for(const [position,value] of edits.sort((a,b)=>b[0]-a[0]))html=html.slice(0,position)+value+html.slice(position);
 return html;
}
module.exports={enhance,icon};
