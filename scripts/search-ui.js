'use strict';
const fs=require('node:fs'),path=require('node:path');
const labels=require('../lib/search-ui-labels.cjs');
hexo.extend.helper.register('search_ui_labels',()=>labels(hexo.config.root==='/en/'));
hexo.extend.filter.register('before_generate',()=>{
  for(const [view,file] of [['_partials/search/index.njk','search-dialog.njk'],['search-loader.njk','search-loader.njk'],['_partials/header/menu.njk','search-menu.njk'],['_partials/header/brand.njk','search-brand.njk']])
    hexo.theme.setView(view,fs.readFileSync(path.join(hexo.base_dir,'templates',file),'utf8'));
  // Nunjucks filesystem includes bypass setView; route just this include through Hexo partial.
  const original=fs.readFileSync(path.join(hexo.theme_dir,'layout/_third-party/index.njk'),'utf8');
  const needle="{%- include 'search/localsearch.njk' -%}";
  if(!original.includes(needle))throw Error('Review NeXT search loader override after theme changes');
  hexo.theme.setView('_third-party/index.njk',original.replace(needle,"{{ partial('search-loader.njk') }}"));
},25);
