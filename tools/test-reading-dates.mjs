import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import Hexo from 'hexo';
import { calendarDate } from './reading-dates.mjs';

assert.throws(()=>calendarDate('2026-02-31'));
assert.throws(()=>calendarDate(undefined));
assert.equal(calendarDate('2018-07-3 22:55:55'),'2018-07-03');
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'youngforest-dates-'));
const engine=new Hexo(dir,{silent:true});
try {
  await fs.writeFile(path.join(dir,'package.json'),JSON.stringify({name:'reading-date-fixtures',hexo:{version:'8.1.2'}}));
  await fs.mkdir(path.join(dir,'source/_posts'),{recursive:true});
  await fs.writeFile(path.join(dir,'_config.yml'),'title: Date fixtures\nurl: https://example.test/\ntheme: false\nplugins: []\nupdated_option: date\ntimezone: UTC\n');
  for(const [slug,updated] of [['missing',''],['explicit','updated: 2020-02-04 12:00:00\n'],['same-day','updated: 2020-02-03 13:00:00\n']]) {
    const p=path.join(dir,'source/_posts',slug+'.md');
    await fs.writeFile(p,'---\ntitle: '+slug+'\ndate: 2020-02-03 12:00:00\n'+updated+'---\nFixture.');
    await fs.utimes(p,new Date('2030-01-01'),new Date('2030-01-01'));
  }
  await engine.init();
  assert.equal(engine.config.updated_option,'date','Fixture configuration must actually load');
  engine.extend.renderer.register('md','html',data=>data.text,true);
  await engine.load();
  const posts=engine.locals.get('posts');
  assert.equal(posts.findOne({slug:'missing'}).updated.valueOf(),posts.findOne({slug:'missing'}).date.valueOf());
  assert.equal(posts.findOne({slug:'explicit'}).updated.toISOString(),'2020-02-04T12:00:00.000Z');
  assert.equal(posts.findOne({slug:'same-day'}).updated.toISOString(),'2020-02-03T13:00:00.000Z');
  console.log('Date fixtures passed: missing, explicit, same-day, invalid; future mtime ignored.');
} finally {
  await engine.exit();
  // Only the exact task-owned mkdtemp directory is removed.
  await fs.rm(dir,{recursive:true,force:true});
}
