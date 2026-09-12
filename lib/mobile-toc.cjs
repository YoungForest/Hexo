'use strict';
const {tocObj} = require('hexo-util');
const options = {min_depth:2, max_depth:3, class:'mobile-toc-list', list_number:false};
function mobileTocCount(content, enabled = true) {
  if (!enabled) return 0;
  const headings = tocObj(content || '', options);
  // Never invent an anchor or offer a broken link for hand-written empty HTML headings.
  return headings.length >= 4 && headings.every(h => h.id && h.text.trim()) ? headings.length : 0;
}
module.exports = {mobileTocCount, options};
