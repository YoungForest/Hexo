'use strict';
// Explicit offline asset generation, never an install/build hook. Original files are read-only.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require('sharp');
const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const root=path.resolve(__dirname,'..'),source=path.join(root,'source');
const manifestFile=path.join(source,'_data/responsive-media.json');
const paris=['church','pantheon','伏尔泰','first-duck','kaixuanmen','tieta','金字塔','自由引导人民','断臂维纳斯','second-duck','纪念碑','cibaoxianquan','镜厅','路易十四','third-duck'];
const shandong=['taishan','pijiubowuguan','haibindiyiyuchang','gongzhulou','ganhai','haijunbowuguan','tianzhujiaotang','pichaiyuan','daminghu','wulongtan','baotuquan','qianfoshan'];
const specs=[
  ...paris.map((n,i)=>({id:'paris-'+String(i+1).padStart(2,'0'),post:'Paris',src:'/images/paris/'+n+'.jpg'})),
  ...shandong.map((n,i)=>({id:'shandong-'+String(i+1).padStart(2,'0'),post:'shandong-trip',src:'/assets/'+n+'.jpg'}))
];
const parameters={tool:'sharp',version:'0.35.4',widths:[480,960,1600],format:'webp',quality:84,effort:5,autoOrient:true,colourspace:'srgb',metadata:'stripped',withoutEnlargement:true};
async function main() {
  if(sharp.versions.sharp!==parameters.version)throw Error('Use pinned sharp '+parameters.version);
  const old=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):null;
  const photos=[];let generated=0,reused=0;
  for(const spec of specs) {
    const input=fs.readFileSync(path.join(source,spec.src.slice(1))),inputSha256=hash(input),meta=await sharp(input).metadata();
    const rotate=[5,6,7,8].includes(meta.orientation);
    const width=rotate?meta.height:meta.width,height=rotate?meta.width:meta.height;
    const previous=old?.photos.find(p=>p.id===spec.id&&p.inputSha256===inputSha256);
    const reusable=JSON.stringify(old?.parameters)===JSON.stringify(parameters) && previous &&
      previous.outputs.every(o=>{const f=path.join(source,o.src.slice(1));return fs.existsSync(f)&&hash(fs.readFileSync(f))===o.sha256;});
    if(reusable){photos.push(previous);reused++;continue;}
    const outputs=[];
    for(const size of [...new Set(parameters.widths.map(w=>Math.min(w,width)))]) {
      const src='/images/responsive/'+spec.id+'-'+inputSha256.slice(0,12)+'-'+size+'.webp',file=path.join(source,src.slice(1));
      fs.mkdirSync(path.dirname(file),{recursive:true});
      const {data,info}=await sharp(input).autoOrient().resize({width:size,withoutEnlargement:true})
        .toColourspace('srgb').webp({quality:parameters.quality,effort:parameters.effort}).toBuffer({resolveWithObject:true});
      fs.writeFileSync(file,data);
      outputs.push({src,format:'webp',width:info.width,height:info.height,bytes:data.length,sha256:hash(data)});
      generated++;
    }
    photos.push({...spec,inputSha256,inputBytes:input.length,width,height,outputs,review:{technical:'pending',author:'pending'}});
  }
  const manifest={version:1,assetOwner:'Hexo',posts:['Paris','shandong-trip'],parameters,photos};
  fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify({photos:photos.length,generated,reused,originalBytes:photos.reduce((s,p)=>s+p.inputBytes,0),outputBytes:photos.flatMap(p=>p.outputs).reduce((s,o)=>s+o.bytes,0)}));
  console.log('Review the photos and mirror source/_data/responsive-media.json to the English repo before building both sites.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
