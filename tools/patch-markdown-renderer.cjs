'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const packageDir = path.join(root, 'node_modules', 'hexo-renderer-markdown-it');
const pkg = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
if (pkg.version !== '7.1.1') throw Error('Re-review renderer compatibility patch before changing version');
const file = path.join(packageDir, 'lib', 'anchors.js');
const original = fs.readFileSync(file, 'utf8');
const normalized = original.replace(/\r\n/g, '\n');
const oldImport = "const Token = require('markdown-it/lib/token');";
const signature = 'const renderPermalink = function(slug, opts, tokens, idx) {';
const replacement = signature + '\n  // Use the public parser token instance, not a version-specific internal module.\n  const Token = tokens[idx].constructor;';
if (normalized.includes(replacement) && !normalized.includes(oldImport)) {
  console.log('Renderer compatibility patch already applied.');
} else {
  if (normalized.split(oldImport).length !== 2 || normalized.split(signature).length !== 2) {
    throw Error('Unexpected renderer source; refusing to patch');
  }
  const patched = normalized.replace(oldImport + '\n', '').replace(signature, replacement);
  fs.writeFileSync(file, original.includes('\r\n') ? patched.replace(/\n/g, '\r\n') : patched);
  console.log('Patched renderer 7.1.1: derive Token from parser instead of private import.');
}
