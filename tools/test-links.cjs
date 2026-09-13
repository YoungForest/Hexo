'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const {inventory,resolveLocal,audit} = require('../lib/link-audit.cjs');
const {isPublic,allowedURL} = require('../lib/public-link-request.cjs');
for(const address of ['127.0.0.1','10.1.2.3','172.16.0.1','192.168.1.1','169.254.169.254','100.64.0.1','::1','::ffff:127.0.0.1','fd00::1','fe80::1','2001:db8::1']) assert(!isPublic(address),address);
assert(isPublic('1.1.1.1'));assert(isPublic('2606:4700:4700::1111'));
for(const address of ['2001:0000::1','2001:0002::1','3fff::1','2002:7f00:1::'])assert(!isPublic(address),address);
for(const url of ['http://localhost/','file:///test','https://user:pass@example.com/','https://example.com/?token=secret','http://example.com:8080/'])assert(!allowedURL(url),url);
assert(allowedURL('https://www.rsa.ie/'));
const dir = fs.mkdtempSync(path.join(os.tmpdir(),'blog-link-tests-'));
function fixture(file,html) { const dest=path.join(dir,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,html); }
try {
  fixture('zh/index.html','<h1 id="首页">Home</h1>');
  fixture('zh/assets/Test.PNG','image');
  fixture('zh/2020/01/01/测试/index.html','<div class="post-body"><a href="#章节">OK</a><img src="/assets/Test.PNG"><h2 id="章节">Section</h2></div>');
  fixture('en/index.html','English');
  fixture('en/2020/01/01/test/index.html','<h2 id="Life">Life</h2>');
  const sites={Hexo:inventory(path.join(dir,'zh')),en:inventory(path.join(dir,'en'))};
  const base='https://youngforest.github.io/2020/01/01/测试/';
  const good=['#章节','#%E7%AB%A0%E8%8A%82','?v=1#章节','#章节:~:text=hello','#:~:text=hello','/assets/Test.PNG?x=1','/en','/en/','/en/2020/01/01/test/#Life','/2020/01/01/%E6%B5%8B%E8%AF%95/'];
  good.forEach(href=>assert(resolveLocal(href,base,sites).ok,href));
  for(const href of ['../assets/Test.PNG','/assets/test.PNG','#missing','/missing/','/%ZZ/','#%ZZ','/en/2020/01/01/test/#生活'])
    assert(resolveLocal(href,base,sites).error,href);
  assert.equal(resolveLocal('/assets/Test.PNG',base,{en:sites.en}).deferred,'Hexo');
  assert.equal(resolveLocal('/en',base,{Hexo:sites.Hexo}).deferred,'en');
  assert(resolveLocal('mailto:test@example.org',base,sites).skip);
  assert(resolveLocal('tel:123',base,sites).skip);
  assert(resolveLocal('https://example.org',base,sites).external);
  assert.equal(audit(sites).errors.length,0);
  fixture('zh/2020/01/01/broken/index.html','<div class="post-body"><a href="/missing/">Bad</a><img src="/assets/test.PNG"></div>');
  assert.equal(audit({Hexo:inventory(path.join(dir,'zh'))}).errors.length,2,'Negative fixtures must fail');
  console.log('Link validator: URL, root ownership, case, encoding, anchors and negative fixtures passed.');
} finally {
  // Only the exact directory returned by mkdtemp is removed.
  fs.rmSync(dir,{recursive:true,force:true});
}
