/* おりーぶ庵 AI-OS ― アプリとして使うためのしくみ（Service Worker）
   ねらい
   ・ホーム画面のアイコンから開いても、いつも新しい画面になるようにする
     （画面＝HTMLは毎回サーバーに見にいきます。古いものは残しません）
   ・電波が無いときだけ、しまっておいた画面を出す
   ・写真やデータは一切あつかいません（この中には入れません）
*/
const AIOS_CACHE = 'aios-v1';
const CORE = ['./ai-os.html','./logo.png','./icon-192.png','./icon-512.png',
              './apple-touch-icon.png','./favicon.ico','./site.webmanifest'];

self.addEventListener('install', e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(AIOS_CACHE).then(c=>c.addAll(CORE).catch(()=>{})));
});

self.addEventListener('activate', e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()) if(k!==AIOS_CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', e=>{
  if(e.data==='skipWaiting') self.skipWaiting();
  if(e.data==='clear') e.waitUntil((async()=>{
    for(const k of await caches.keys()) await caches.delete(k);
  })());
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  let url; try{ url = new URL(req.url); }catch(err){ return; }
  if(url.origin !== self.location.origin) return;        // ほかのサイトにはさわりません

  // 画面（HTML）は、まずサーバーを見にいく＝いつも新しい版になります
  if(req.mode === 'navigate' || /\.html$/.test(url.pathname)){
    e.respondWith((async()=>{
      try{
        const r = await fetch(req, {cache:'no-store'});
        if(r && r.ok){ const c = await caches.open(AIOS_CACHE); c.put(req, r.clone()); }
        return r;
      }catch(err){
        return (await caches.match(req)) || (await caches.match('./ai-os.html'))
            || new Response('いまは電波がつながっていません。', {status:503,
                 headers:{'content-type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }

  // 絵や設定ファイルは、しまってあるものを出しつつ、裏で新しくしておきます
  e.respondWith((async()=>{
    const cached = await caches.match(req);
    const net = fetch(req).then(r=>{
      if(r && r.ok) caches.open(AIOS_CACHE).then(c=>c.put(req, r.clone()));
      return r;
    }).catch(()=>null);
    return cached || (await net) || new Response('', {status:504});
  })());
});
