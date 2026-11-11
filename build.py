"""Construit le site autonome, sans dépendance de compilation."""
from pathlib import Path
import hashlib, json, shutil
ROOT = Path(__file__).resolve().parent
OUT = (ROOT / 'docs').resolve()
assert OUT.parent == ROOT and OUT.name == 'docs'
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
for file in (ROOT / 'src').iterdir():
    if file.is_file(): shutil.copy2(file, OUT / file.name)
shutil.copytree(ROOT / 'assets', OUT / 'assets')
for file in (ROOT / 'pwa').iterdir(): shutil.copy2(file, OUT / file.name)
shutil.copy2(ROOT / 'ludi.json', OUT / 'ludi.json')
(OUT / '.nojekyll').touch()
files = sorted(p.relative_to(OUT).as_posix() for p in OUT.rglob('*') if p.is_file())
digest = hashlib.sha256(b''.join((OUT/f).read_bytes() for f in files)).hexdigest()[:12]
worker = """const CACHE = 'enclos-HASH';
const FILES = LIST;
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
""".replace('HASH',digest).replace('LIST',json.dumps(['./']+files))
(OUT / 'sw.js').write_text(worker,encoding='utf-8')
print(f'{len(files)} fichiers, cache {digest}')
