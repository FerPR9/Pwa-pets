
const CACHE_NAME = 'pet-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/page1.html',
  '/page2.html',
  '/page3.html',
  '/page4.html',
  '/styles/style.css',
  '/js/db.js',
  '/js/app.js',
];

// Instalar el Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache abierto y recursos agregados');
      return cache.addAll(urlsToCache);
    }).catch((error) => {
      console.error('Error al agregar recursos al caché:', error);
    })
  );
});

// Activar el Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Eliminar cachés antiguos
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).catch((error) => {
      console.error('Error al activar el service worker:', error);
    })
  );
});

// Manejar fetch y sincronizar caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si el recurso está en caché, devolverlo
      if (cachedResponse) {
        console.log(`Servido desde caché: ${event.request.url}`);
        return cachedResponse;
      }

      // Si el recurso no está en caché, hacer la solicitud a la red
      return fetch(event.request).then((networkResponse) => {
        // Verificar si la respuesta de la red es válida
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Si la respuesta es válida, agregarla al caché
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          console.log(`Nuevo recurso cacheado: ${event.request.url}`);
        });

        return networkResponse;
      }).catch((error) => {
        // Si falla la red y no hay caché, mostrar un mensaje genérico
        console.error('Error al manejar fetch:', error);
        return new Response('<h1>Sin conexión</h1><p>No se pudo cargar el recurso solicitado.</p>', {
          headers: { 'Content-Type': 'text/html' },
        });
      });
    })
  );
});

// Opcional: manejar sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncData') {
    event.waitUntil(
      // Aquí puedes poner la lógica para sincronizar datos pendientes (por ejemplo, enviar datos a la API)
      console.log('Sincronizando datos en segundo plano...')
    );
  }
});
