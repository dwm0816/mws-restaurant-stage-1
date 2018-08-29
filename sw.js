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
                      'img/*.jpg',
                      'https://code.jquery.com/jquery-3.3.1.min.js',
                      '//normalize-css.googlecode.com/svn/trunk/normalize.css',
                      'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
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


/*
CITATIONS: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions - Arrow function refresh
https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode - cloneNode, unused but attempted
https://api.jquery.com/clone/ - clone, the used solution to replace cloneNode.. for now
Udacity service worker course was reviewed for most of the techniques used within

TODO 8/29/2018:
    1. Find a solution to cloneNode v clone()
    2. Find a solution for iterative numbers in the cache name
    3. Make code more concise
    4. IMPORTANT: fix refresh bug (Requires 3 refreshes on average to fully cache a page...)
*/