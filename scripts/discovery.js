'use strict';
const fs=require('node:fs');
const path=require('node:path');
const yaml=require('js-yaml');
const {buildCatalog}=require('../lib/discovery.cjs');
let catalog;
function data() {
  if(!catalog) {
    const manifest=yaml.load(fs.readFileSync(path.join(hexo.base_dir,'source/_data/discovery.yml'),'utf8'));
    catalog=buildCatalog(manifest,hexo.locals.get('posts').toArray(),hexo.config.root==='/en/');
  }
  return catalog;
}
hexo.extend.filter.register('before_generate',()=>{
  catalog=undefined;
  for(const [view,file] of [['_macro/post.njk','discovery-post.njk'],['page.njk','discovery-page.njk'],['reading-index.njk','reading-index.njk'],['year-in-review.njk','year-in-review.njk'],['series-navigation.njk','series-navigation.njk']]) {
    hexo.theme.setView(view,fs.readFileSync(path.join(hexo.base_dir,'templates',file),'utf8'));
  }
  data(); // Fail a build on missing references, not when a visitor opens a page.
  hexo.theme.setView('discovery-page-header.njk',fs.readFileSync(path.join(hexo.base_dir,'templates/discovery-page-header.njk'),'utf8'));
},20);
hexo.extend.helper.register('discovery_data',data);
hexo.extend.helper.register('discovery_post',post=>data().metadata.get(path.basename(post.source||'', '.md')));
