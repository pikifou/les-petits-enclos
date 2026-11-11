const CACHE = 'enclos-f3682df79190';
const FILES = ["./", ".nojekyll", "app.js", "assets/bambou.webp", "assets/berger.webp", "assets/chats-0.webp", "assets/chats-1.webp", "assets/chats-2.webp", "assets/chats-3.webp", "assets/chats-4.webp", "assets/chats-5.webp", "assets/chats-6.webp", "assets/chats-7.webp", "assets/hiboux-0.webp", "assets/hiboux-1.webp", "assets/hiboux-2.webp", "assets/hiboux-3.webp", "assets/hiboux-4.webp", "assets/hiboux-5.webp", "assets/hiboux-6.webp", "assets/hiboux-7.webp", "assets/jardin.webp", "assets/lucioles-0.webp", "assets/lucioles-1.webp", "assets/lucioles-2.webp", "assets/lucioles-3.webp", "assets/lucioles-4.webp", "assets/lucioles-5.webp", "assets/lucioles-6.webp", "assets/lucioles-7.webp", "assets/lucioles.webp", "assets/moutons-0.webp", "assets/moutons-1.webp", "assets/moutons-2.webp", "assets/moutons-3.webp", "assets/moutons-4.webp", "assets/moutons-5.webp", "assets/moutons-6.webp", "assets/moutons-7.webp", "assets/nuages.webp", "assets/pandas-0.webp", "assets/pandas-1.webp", "assets/pandas-2.webp", "assets/pandas-3.webp", "assets/pandas-4.webp", "assets/pandas-5.webp", "assets/pandas-6.webp", "assets/pandas-7.webp", "assets/prairie.webp", "icon-192.png", "icon-512.png", "index.html", "levels.js", "logic.js", "ludi.js", "ludi.json", "manifest.webmanifest", "state.js", "style.css"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('enclos-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    const url = new URL(event.request.url);
    const key = event.request.mode==='navigate' ? new URL('index.html',self.registration.scope).href : url.href;
    const cached=await cache.match(key);
    return cached||fetch(event.request);
  }));
});
