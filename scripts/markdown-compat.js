'use strict';
// linkify-it 6 changed this default. Preserve the blog's existing bare-domain links.
hexo.extend.filter.register('markdown-it:renderer', parser => {
  parser.linkify.set({ fuzzyLink: true });
});
