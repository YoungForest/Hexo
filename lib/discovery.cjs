'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const KINDS = ['book-note', 'book-screen', 'external-review'];
function buildCatalog(manifest, posts, en = false) {
  assert.equal(manifest?.version, 1, 'Unsupported discovery manifest version');
  assert(Array.isArray(manifest.reading) && Array.isArray(manifest.series), 'Missing discovery collections');
  const byId = new Map(posts.filter(p => p.published !== false).map(p => [path.basename(p.source, '.md'), p]));
  const labels = en ? {
    all:'All', 'book-note':'Book notes', 'book-screen':'Books & adaptations', 'external-review':'External reviews',
    published:'Published', count:'notes', filter:'Filter notes', back:'Back to Books & Screen Notes',
    older:'Earlier year', newer:'Later year', series:'All yearly reviews', group:'Type',
    reading:'Reading & screen', 'year-review':'Year in review', algorithms:'Algorithms & contests', other:'Other writing'
  } : {
    all:'全部', 'book-note':'阅读笔记', 'book-screen':'书与影视', 'external-review':'外链书评',
    published:'发表于', count:'篇笔记', filter:'筛选笔记', back:'返回书影音笔记',
    older:'较早一年', newer:'较晚一年', series:'全部年度总结', group:'类型',
    reading:'书影音笔记', 'year-review':'年度总结', algorithms:'算法与竞赛', other:'其他文章'
  };
  const resolve = id => {
    assert(typeof id === 'string' && id && !id.includes('/') && !id.includes('\\'), 'Invalid post reference');
    const p = byId.get(id); assert(p, 'Missing published post: ' + id);
    return {id, path:p.path, title:p.title, description:p.description || '', date:p.date.format('YYYY-MM-DD'), timestamp:p.date.valueOf()};
  };
  const aliases = entry => {
    assert(entry.aliases === undefined || Array.isArray(entry.aliases), 'Aliases must be an array');
    const values = entry.aliases || [];
    assert(values.every(s => typeof s === 'string' && s.trim()), 'Aliases must be nonempty strings');
    return [...new Set(values)];
  };
  const seen = new Set(), metadata = new Map();
  const reading = manifest.reading.map(entry => {
    assert(!seen.has(entry.post), 'Duplicate reading post: '+entry.post); seen.add(entry.post);
    assert(KINDS.includes(entry.kind), 'Invalid reading kind: '+entry.kind);
    const post=resolve(entry.post);
    assert(post.description, 'Reading entry needs existing description: '+entry.post);
    const record={...post,kind:entry.kind,kindLabel:labels[entry.kind],aliases:aliases(entry)};
    metadata.set(entry.post,{...record,group:'reading'});
    return record;
  }).sort((a,b)=>b.timestamp-a.timestamp || a.id.localeCompare(b.id,'en'));
  const seriesIds=new Set(),members=new Set();
  const series=manifest.series.map(s=>{
    assert(typeof s.id==='string' && /^[a-z0-9-]+$/.test(s.id) && !seriesIds.has(s.id),'Invalid/duplicate series id');
    assert(typeof s.title==='string' && s.title.trim(),'Missing series title');seriesIds.add(s.id);
    assert(Array.isArray(s.items) && s.items.length>1,'Series needs at least two entries');
    const items=s.items.map(entry=>{
      assert(!members.has(entry.post),'Duplicate series member');members.add(entry.post);
      assert(Number.isInteger(entry.year),'Invalid series year');
      return {...resolve(entry.post),year:entry.year,aliases:aliases(entry)};
    }).sort((a,b)=>a.year-b.year);
    assert.equal(new Set(items.map(i=>i.year)).size,items.length,'Duplicate year');
    items.forEach((item,i)=>metadata.set(item.id,{...metadata.get(item.id),...item,group:metadata.get(item.id)?.group||'year-review',series:{id:s.id,title:s.title,year:item.year,older:items[i-1],newer:items[i+1]}}));
    return {id:s.id,title:s.title,items,descending:[...items].reverse()};
  });
  for(const [id,p] of byId) {
    if(!metadata.has(id)) {
      const categories=p.categories?.toArray ? p.categories.toArray().map(c=>c.name) : (p.categories||[]);
      metadata.set(id,{group:categories.some(c=>['LeetCode','KickStart'].includes(c))?'algorithms':'other',aliases:[]});
    }
    const m=metadata.get(id);m.groupLabel=labels[m.group];m.filterKey=labels.group;m.labels=labels;
  }
  return {reading,series,metadata,labels,kinds:KINDS,en};
}
module.exports={buildCatalog,KINDS};
