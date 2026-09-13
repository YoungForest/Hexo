'use strict';
// Explicit manual report only. No cookies, credentials, form submissions or automatic fixes.
const fs=require('node:fs'),yaml=require('js-yaml');
const {inventory,audit}=require('../lib/link-audit.cjs');
const {allowedURL,requestPublic}=require('../lib/public-link-request.cjs');
async function main() {
  const args=process.argv.slice(2);
  const value=(flag,fallback)=>args.includes(flag)?args[args.indexOf(flag)+1]:fallback;
  const limit=Number(value('--limit','20')),timeout=Number(value('--timeout','5000'));
  if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(timeout)||timeout<1000||timeout>15000)throw Error('Use --limit 1..100 and --timeout 1000..15000');
  const site=yaml.load(fs.readFileSync('_config.yml','utf8')).root==='/en/'?'en':'Hexo';
  const urls=[...new Set(audit({[site]:inventory('public')}).external.map(s=>{const u=new URL(s);u.hash='';return u.href;}))];
  const results=[];let requests=0;
  for(const source of urls) {
    if(requests>=limit)break;
    let url=source;const chain=[];
    for(let hops=0;hops<4;hops++) {
      if(requests>=limit){chain.push({classification:'request-limit'});break;}
      if(!allowedURL(url)){chain.push({classification:'skipped-unsafe-url'});break;}
      requests++;await new Promise(resolve=>setTimeout(resolve,500));
      try{
        const r=await requestPublic(url,timeout);
        const classification=r.status>=200&&r.status<300?'reachable':
          [404,410].includes(r.status)?'possibly-missing-needs-review':
          r.status>=300&&r.status<400?'redirect':'unconfirmed';
        chain.push({url,status:r.status,classification});
        if(classification!=='redirect'||!r.location)break;
        url=new URL(r.location,url).href; // Every redirect is revalidated and DNS-pinned.
      }catch(e){chain.push({url,classification:'unconfirmed-or-blocked',reason:e.code||e.message});break;}
    }
    results.push({source,chain});
  }
  const report={checkedAt:new Date().toISOString(),site,method:'Public HEAD requests only. 403/429/timeouts are not dead-link verdicts.',limit,requests,available:urls.length,results};
  const output=value('--output',null),json=JSON.stringify(report,null,2)+'\n';
  if(output)fs.writeFileSync(output,json);else process.stdout.write(json);
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
