'use strict';
const {parseDocument,DomUtils:D}=require('htmlparser2');
function notFoundHead(html) {
 const doc=parseDocument(html,{withStartIndices:true,withEndIndices:true});
 const all=(n,p)=>D.findAll(p,n.children||[]);
 const config=all(doc,n=>n.name==='script'&&n.attribs['data-name']==='page')[0];
 if(!config)return html;
 let data;try{data=JSON.parse(D.textContent(config));}catch{return html;}
 if(data.path!=='404.html')return html;
 const head=all(doc,n=>n.name==='head')[0];if(!head)return html;
 const nodes=all(head,n=>n.name==='link'&&(n.attribs.rel==='canonical'||n.attribs.hreflang)||
  n.name==='meta'&&(n.attribs.name==='robots'||/^(og:|twitter:|article:)/.test(n.attribs.property||n.attribs.name||'')));
 for(const n of nodes.sort((a,b)=>b.startIndex-a.startIndex))html=html.slice(0,n.startIndex)+html.slice(n.endIndex+1);
 const at=html.indexOf('>',head.startIndex)+1;
 return html.slice(0,at)+'\n<meta name="robots" content="noindex,follow">'+html.slice(at);
}
module.exports={notFoundHead};
