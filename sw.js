importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
    console.log(`Workbox berhasil dimuat`);

    workbox.loadModule('workbox-cacheable-response');
    // workbox.loadModule('workbox-background-sync');

    workbox.precaching.precacheAndRoute([
        { url: '/', revision: '1' },
        { url: '/index.html', revision: '1' },
        { url: '/partials/nav.html', revision: '1' },
        { url: '/pages/classement.html', revision: '1' },
        { url: '/pages/match.html', revision: '1' },
        { url: '/pages/team.html', revision: '1' },
        { url: '/pages/detail_team.html', revision: '1' },
        { url: '/js/app.js', revision: '1' },
        { url: '/js/detail_team.js', revision: '1' },
        { url: '/js/materialize.min.js', revision: '1' },
        { url: '/js/db_football.js', revision: '1' },
        { url: '/js/idb.js', revision: '1' },
        { url: '/css/materialize.min.css', revision: '1' },
        { url: '/css/football.css', revision: '1' },
        { url: '/images/logo.png', revision: '1' },
        { url: '/images/error-404.png', revision: '1' },
        { url: '/images/icon.png', revision: '1' },
        { url: '/images/icon1.png', revision: '1' },
        { url: '/images/icon2.png', revision: '1' },
        { url: '/images/default-team.png', revision: '1' },
        { url: '/manifest.json', revision: '1' },
    ]);

    // const bgSyncData = new workbox.backgroundSync.Plugin('laLiga', {
    //     maxRetentionTime: 24 * 60, // max 24 Hours
    //     callbacks: {
    //         queueDidReplay: showNotification
    //       }
    // });


    workbox.routing.registerRoute(
        new RegExp('/pages/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'pages'
        })
    );

    workbox.routing.registerRoute(
        new RegExp('https://fonts.googleapis.com'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'gfonts-style'
        })
    )

    workbox.routing.registerRoute(
        new RegExp('https://fonts.gstatic.com'),
        workbox.strategies.cacheFirst({
            cacheName: 'gfonts-webfonts',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ]
        })
    )

    workbox.routing.registerRoute(
        /^https:\/\/api\.football-data\.org\/v2/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'football-cache',
            plugins: [
                // bgSyncData,
                new workbox.cacheableResponse.Plugin({
                    statuses: [200],
                }),
                new workbox.expiration.Plugin({
                    maxEntries: 20,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
                }),
            ],
        })
    );

} else {
    console.log(`Workbox gagal dimuat`);
}

self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: 'images/icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
}); 