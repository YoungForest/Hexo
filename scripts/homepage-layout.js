'use strict';
const fs = require('node:fs');
const path = require('node:path');
// Keep the tracked override outside source/_data: it needs theme render locals.
hexo.extend.filter.register('before_generate', () => {
  hexo.theme.setView('index.njk', fs.readFileSync(path.join(hexo.base_dir, 'templates/index.njk'), 'utf8'));
}, 10);
