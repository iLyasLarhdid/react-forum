const CASHE_NAME = "version-1";
const urlsToCashe = ['index.html', 'offline.html'];

//install service worker (SW)
const self = this;

self.addEventListener('install',(event)=>{
    event.waitUntil(
        caches.open(CASHE_NAME).then((cashe)=>{
            console.log('opened cashe');
            return cashe.addAll(urlsToCashe);
        })
    )
});


//listen to the request
self.addEventListener('fetch',(event)=>{
    event.respondWith(
        caches.match(event.request)
            .then(()=>{
                return fetch(event.request).catch(()=>cashes.match('offline.html'))
            })
    );
});

//activate the SW
self.addEventListener('activate',(event)=>{
    const casheWhiteList=[];
    casheWhiteList.push(CASHE_NAME);

    event.waitUntil(
        cashes.keys().then((casheNames)=>Promise.all(
            casheNames.map((casheName)=>{
                if(casheWhiteList.includes(casheName)){
                    return cashes.delete(casheName);
                }
            })
        ))
    )
});