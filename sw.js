// Service worker: met le jeu en cache pour qu'il fonctionne hors-ligne,
// et garde les sprites Pokémon déjà chargés pour les revoir sans internet.
const CACHE_NAME = "pkmn-perso-v54";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/data/balance.js",
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
  "./js/engine/pixelart.js",
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
  "./sprites/player.png",
  "./sprites/rival.png",
  "./sprites/npc_a.png",
  "./sprites/npc_b.png",
  "./sprites/npc_c.png",
  "./sprites/main_noire.png",
  "./sprites/main_noire_boss.png",
  "./sprites/ui/advance_indicator.png",
  "./sprites/tiles/grass.png",
  "./sprites/tiles/water.png",
  "./sprites/tiles/tree_a.png",
  "./sprites/tiles/tree_b.png",
  "./sprites/tiles/door_house.png",
  "./sprites/tiles/door_center.png",
  "./sprites/tiles/door_mart.png",
  "./sprites/tiles/wall_indoor.png",
  "./sprites/tiles/painting_0.png",
  "./sprites/tiles/painting_1.png",
  "./sprites/tiles/painting_2.png",
  "./sprites/tiles/plant_0.png",
  "./sprites/tiles/plant_1.png",
  "./sprites/tiles/plant_2.png",
  "./sprites/tiles/rug_0.png",
  "./sprites/tiles/rug_1.png",
  "./sprites/tiles/rug_2.png",
  "./sprites/portraits/generic_sheet.png",
  "./sprites/portraits/Boy.png",
  "./sprites/portraits/Boy2.png",
  "./sprites/portraits/Girl.png",
  "./sprites/portraits/Girl2.png",
  "./sprites/portraits/Kid1.png",
  "./sprites/portraits/Kid2.png",
  "./sprites/portraits/Lady.png",
  "./sprites/portraits/Lady2.png",
  "./sprites/portraits/old_man.png",
  "./sprites/portraits/old_man2.png",
  "./sprites/portraits/Knight.png",
  "./sprites/portraits/Viking.png",
  "./sprites/portraits/Wizard1.png",
  "./sprites/portraits/Wizard2.png",
  "./sprites/portraits/Punk.png",
  "./sprites/portraits/Detective.png",
  "./sprites/portraits/Glasses.png",
  "./sprites/portraits/Goblin.png",
  "./sprites/portraits/FarmerBoy.png",
  "./sprites/portraits/Luimberjack.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./fonts/Silkscreen-Regular.ttf",
  "./fonts/Silkscreen-Bold.ttf",
  "./fonts/PressStart2P-Regular.ttf"
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
