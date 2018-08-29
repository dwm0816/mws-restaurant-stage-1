//Selects a random number (wanted to do iterations but couldn't figure out consistency) and assigns to cache name.
let num = Math.floor(Math.random() * 99999);
let staticCache = num + ' cachedRest'

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(staticCache)
              .then(cache => {
                  return cache.addAll([
                      'index.html',
                      'restaurant.html',
                      'css/styles.css',
                      'js/main.js',
                      'js/dbhelper.js',
                      'js/restaurant_info.js',
                      'img/*.jpg'
                  ])
                  .catch(function(err){console.log('Error: "' + err + '"')});
              })
    )
});


self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    return cacheName.endsWith(' cachedRest') && cacheName != staticCache;
                }).map(cacheName => {return caches.delete(cacheName);})
            );
        })
    );
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
              .then(
                  function(response){
                      console.log(response + ' sporks');
                      if (response !== undefined){
                          return response;
                      } else {
                          return fetch(event.request)
                                .then(response => {console.log(JSON.stringify(response) + ' 201'); let clone = response.clone(); 
                                //TODO: Figure out cloneNode so I don't need to rely on jquery for this
                                    caches.open(staticCache).then(function(cache){
                                        cache.put(event.request, clone);
                                    });
                                })
                      }
                  }
              )
    )
})

