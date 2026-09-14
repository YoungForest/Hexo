'use strict';
const {enhance}=require('../lib/section-links.cjs');
// Final page only: neither post.content, excerpts, search nor Atom is changed.
hexo.extend.filter.register('after_render:html',html=>enhance(html,hexo.config.root==='/en/',message=>hexo.log.warn(message)),40);
