'use strict';
const dns=require('node:dns').promises, net=require('node:net');
const http=require('node:http'), https=require('node:https');
const reserved6=new net.BlockList();
reserved6.addSubnet('2001::',23,'ipv6'); // IETF protocol assignments incl Teredo/benchmark/ORCHID.
reserved6.addSubnet('2001:db8::',32,'ipv6');
reserved6.addSubnet('2002::',16,'ipv6'); // Embedded IPv4 / 6to4.
reserved6.addSubnet('3fff::',20,'ipv6'); // Documentation space.
function isPublic(address) {
  if(net.isIPv4(address)) {
    const [a,b]=address.split('.').map(Number);
    return !(a===0 || a===10 || a===127 || a>=224 || a===169&&b===254 ||
      a===172&&b>=16&&b<=31 || a===192&&[0,168].includes(b) ||
      a===100&&b>=64&&b<=127 || a===198&&[18,19,51].includes(b) || a===203&&b===0);
  }
  // Only global unicast IPv6; mapped IPv4, link-local, ULA and documentation are excluded.
  return net.isIPv6(address) && /^[23][0-9a-f]{3}:/i.test(address) && !reserved6.check(address,'ipv6');
}
function allowedURL(value) {
  let url;try{url=new URL(value);}catch{return false;}
  return ['http:','https:'].includes(url.protocol) && !url.username && !url.password &&
    (!url.port || url.port==='80'&&url.protocol==='http:' || url.port==='443'&&url.protocol==='https:') &&
    !/^(?:localhost|.*\.localhost|.*\.local|.*\.internal)$/i.test(url.hostname) &&
    ![...url.searchParams.keys()].some(k=>/^(?:token|access_token|api_key|apikey|password|secret|signature|auth|key)$/i.test(k));
}
async function requestPublic(value,timeout=5000) {
  if(!allowedURL(value))throw Error('unsafe-url');
  const url=new URL(value),host=url.hostname.replace(/^\[|\]$/g,'');
  const addresses=net.isIP(host)?[{address:host,family:net.isIP(host)}]:
    await Promise.race([dns.lookup(host,{all:true}),new Promise((_,reject)=>{
      const t=setTimeout(()=>reject(Error('dns-timeout')),timeout);t.unref();
    })]);
  if(!addresses.length || addresses.some(a=>!isPublic(a.address)))throw Error('non-public-address');
  const pinned=addresses[0];
  return new Promise((resolve,reject)=>{
    // Pin the validated IP to this request, including TLS/SNI hostname validation.
    const req=(url.protocol==='https:'?https:http).request(url,{
      method:'HEAD',agent:false,
      lookup:(_host,options,callback)=>options.all ? callback(null,[pinned]) : callback(null,pinned.address,pinned.family),
      headers:{'User-Agent':'YoungForest-LinkReview/1.0','Accept':'*/*'}
    },res=>{res.resume();resolve({status:res.statusCode,location:res.headers.location});});
    req.setTimeout(timeout,()=>req.destroy(Error('request-timeout')));req.on('error',reject);req.end();
  });
}
module.exports={isPublic,allowedURL,requestPublic};
