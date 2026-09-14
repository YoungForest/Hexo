'use strict';
const {notFoundHead}=require('../lib/not-found.cjs');
// Scope the final head to the exact generated error page; never mutate ordinary metadata.
hexo.extend.filter.register('after_render:html',notFoundHead,35);
