'use strict';
const yaml = require('js-yaml');
const fs = require('node:fs');
const {inventory,audit} = require('../lib/link-audit.cjs');
const site = yaml.load(fs.readFileSync('_config.yml','utf8')).root === '/en/' ? 'en' : 'Hexo';
const report = audit({[site]:inventory('public')});
console.log(JSON.stringify({site,checked:report.checked,crossSiteDeferred:report.deferred,errors:report.errors},null,2));
if (report.errors.length) process.exitCode=1;
