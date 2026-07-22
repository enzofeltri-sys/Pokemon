// Service worker: met le jeu en cache pour qu'il fonctionne hors-ligne,
// et garde les sprites Pokémon déjà chargés pour les revoir sans internet.
const CACHE_NAME = "pkmn-perso-v23";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/data/types.js",
  "./js/data/moves.js",
  "./js/data/learnsets.js",
  "./js/data/items.js",
  "./js/data/abilities.js",
  "./js/data/pokedex.js",
  "./js/data/maps.js",
  "./js/data/quests.js",
  "./js/data/npcs.js",
  "./js/data/trainers.js",
  "./js/engine/sprites.js",
  "./js/party/player.js",
  "./js/engine/save.js",
  "./js/story/effects.js",
  "./js/ui/ui.js",
  "./js/world/overworld.js",
  "./js/battle/battle.js",
  "./js/story/dialogue.js",
  "./js/engine/touch.js",
  "./js/engine/game.js",
  "./js/engine/main.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isSprite = url.hostname === "raw.githubusercontent.com";

  if (isSprite) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((resp) => {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return resp;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
