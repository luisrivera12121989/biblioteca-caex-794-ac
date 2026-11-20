/* Service worker – Biblioteca CAEX 794 AC. Para publicar una versión nueva, cambie VERSION. */
const VERSION="caex794-v3";
const CORE=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith("caex794-")&&n!==VERSION).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(VERSION).then(h=>h.put("./index.html",c));return x}).catch(()=>caches.match("./index.html")));return}
 if(u.origin===location.origin){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(VERSION).then(h=>h.put(r,c))}return x})));return}
 if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.open(VERSION).then(c=>c.match(r).then(m=>{const f=fetch(r).then(x=>{if(x.ok||x.type==="opaque")c.put(r,x.clone());return x}).catch(()=>m);return m||f})))}
});
