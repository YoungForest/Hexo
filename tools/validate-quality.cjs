'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),yaml=require('js-yaml');
const {parseDocument,DomUtils:D}=require('htmlparser2');
const {SIZES}=require('../lib/responsive-media.cjs');
const {inventory}=require('../lib/link-audit.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(fs.readFileSync('source/_data/responsive-media.json','utf8'));
const en=yaml.load(fs.readFileSync('_config.yml','utf8')).root==='/en/';
const all=(d,p)=>D.findAll(p,d.children||[]),cls=(n,c)=>(n.attribs?.class||'').split(/\s+/).includes(c);
async function main() {
  assert.equal(manifest.assetOwner,'Hexo');assert.equal(manifest.version,1);
  assert.equal(manifest.photos.length,27);assert.equal(new Set(manifest.photos.map(p=>p.src)).size,27);
  assert.equal(manifest.photos.filter(p=>p.post==='Paris').length,15);assert.equal(manifest.photos.filter(p=>p.post==='shandong-trip').length,12);
  assert.deepEqual(manifest.parameters.widths,[480,960,1600]);
  for(const photo of manifest.photos) {
    assert(photo.width>0&&photo.height>0);assert(/^[a-f0-9]{64}$/.test(photo.inputSha256));
    assert(['pending','passed'].includes(photo.review.technical));assert(['pending','approved'].includes(photo.review.author));
    assert.deepEqual(photo.outputs.map(o=>o.width),[...new Set([480,960,1600].map(w=>Math.min(w,photo.width)))]);
    for(const o of photo.outputs) {
      assert(o.src.startsWith('/images/responsive/')&&!o.src.includes('..'));
      assert.equal(o.height,Math.round(photo.height*o.width/photo.width));
      assert(o.bytes>0&&o.width<=photo.width);
    }
    if(!en) {
      const sharp=require('sharp'),input=fs.readFileSync(path.join('source',photo.src.slice(1)));
      assert.equal(hash(input),photo.inputSha256,'Original photograph must remain unchanged');
      assert.equal(input.length,photo.inputBytes);
      const meta=await sharp(input).metadata(),rotate=[5,6,7,8].includes(meta.orientation);
      assert.equal(photo.width,rotate?meta.height:meta.width);assert.equal(photo.height,rotate?meta.width:meta.height);
      for(const o of photo.outputs) {
        const bytes=fs.readFileSync(path.join('source',o.src.slice(1))),m=await sharp(bytes).metadata();
        assert.equal(hash(bytes),o.sha256);assert.equal(bytes.length,o.bytes);
        assert.equal(m.width,o.width);assert.equal(m.height,o.height);assert.equal(m.format,'webp');
        assert(!m.exif&&!m.xmp&&!m.iptc,'Derived images must not carry original private metadata');
      }
    }
  }
  let pages=0,photos=0,posts=0;
  for(const [relative,file] of inventory('public').files) {
    if(!relative.endsWith('.html'))continue;
    const doc=parseDocument(fs.readFileSync(file,'utf8'));
    const target=all(doc,n=>n.attribs?.id==='reading-content'),skip=all(doc,n=>cls(n,'skip-link'));
    if(!all(doc,n=>cls(n,'main-inner')).length)continue;
    pages++;assert.equal(target.length,1);assert.equal(skip.length,1);assert.equal(skip[0].attribs.href,'#reading-content');
    assert(cls(target[0],'main-inner'));assert.equal(D.textContent(skip[0]),en?'Skip to content':'跳到正文');
    assert(!all(doc,n=>cls(n,'copy-btn')).length,'Vendor copy UI stays disabled');
    const body=all(doc,n=>cls(n,'post-body'))[0];
    if(!body||!/^\d{4}\/\d{2}\/\d{2}\//.test(relative))continue;
    posts++;
    assert.equal(all(doc,n=>cls(n,'print-source')).length,1);
    const slug=relative.split('/').at(-2),expected=manifest.photos.filter(p=>p.post===slug);
    const images=all(body,n=>n.name==='img'&&n.attribs['data-responsive-photo']);
    assert.equal(images.length,expected.length);photos+=images.length;
    assert.equal(all(body,n=>cls(n,'photo-original')).length,expected.length);
    for(const image of images) {
      const p=expected.find(p=>p.id===image.attribs['data-responsive-photo']);assert(p);
      assert.equal(decodeURI(image.attribs.src),p.src);
      assert.equal(image.attribs.width,String(p.width));assert.equal(image.attribs.height,String(p.height));
      assert.equal(image.attribs.srcset,p.outputs.map(o=>o.src+' '+o.width+'w').join(', '));
      assert.equal(image.attribs.sizes,SIZES);assert.equal(image.attribs.loading,'lazy');assert.equal(image.attribs.decoding,'async');
    }
  }
  assert.equal(photos,27);
  const atom=fs.readFileSync('public/atom.xml','utf8'),search=fs.readFileSync('public/search.json','utf8');
  for(const marker of ['data-responsive-photo','photo-original','code-copy-tools','print-source','skip-link']) {
    assert(!atom.includes(marker),'UI leaked into Atom');assert(!search.includes(marker),'UI leaked into search');
  }
  console.log(JSON.stringify({quality:'passed',pages,posts,responsivePhotos:photos,originalsAndDerivatives:en?'shared resources checked separately in explicit integration':'all input/output hashes, orientation, dimensions, format, metadata checked'}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
