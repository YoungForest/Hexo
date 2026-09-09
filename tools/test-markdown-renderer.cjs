'use strict';
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const rendererRequire = createRequire(require.resolve('hexo-renderer-markdown-it'));
const MarkdownIt = rendererRequire('markdown-it');
const anchor = require('hexo-renderer-markdown-it/lib/anchors');
const parser = new MarkdownIt({html:true,linkify:true,typographer:true});
parser.linkify.set({fuzzyLink:true});
parser.use(anchor, {level:2, collisionSuffix:'', permalink:true, permalinkClass:'header-anchor', permalinkSide:'left', permalinkSymbol:'¶', separator:'-'});
parser.use(require('markdown-it-footnote'));
parser.use(require('@traptitech/markdown-it-katex'));
const fixture = [
  '## Repeated heading', '', '## Repeated heading', '',
  '| Name | Value |', '| --- | --- |', '| α | 42 |', '',
  'https://example.com/path?a=1&b=2', '', 'A footnote[^1].', '', '[^1]: Preserved note.',
  '', '$x^2 + y^2$', '', '```cpp', 'int main() { return 0; }', '```', '',
  '<figure class="editorial-illustration"><img src="/test.webp" width="1536" height="864" alt="An illustration"></figure>'
].join('\n');
const html = parser.render(fixture);
for(const expected of ['id="Repeated-heading"','id="Repeated-heading-2"','href="#Repeated-heading"','<table>','<td>42</td>','href="https://example.com/path?a=1&amp;b=2"','footnote-ref','katex','language-cpp','<figure class="editorial-illustration">','width="1536"']) assert(html.includes(expected), expected);
assert(parser.render('## Repeated heading').includes('id="Repeated-heading"'), 'heading store reset');
assert(!parser.render('[unsafe](javascript:alert(1))').includes('href="javascript:'), 'unsafe URL');
assert(parser.render('theory-tester.com').includes('href="http://theory-tester.com"'), 'legacy bare-domain links');
console.log('Renderer fixtures passed: anchors, duplicate headings, tables, autolinks, footnotes, KaTeX, fenced code, raw figures.');
