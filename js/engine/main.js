window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game");
  PKMN.initGame(canvas);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW non enregistré:", e));
  });
}

// Vide le cache du Service Worker + désenregistre le Service Worker lui-même,
// puis recharge la page. Utile quand une mise à jour du jeu reste bloquée par
// une ancienne version mise en cache (l'app installée en PWA en particulier).
// La sauvegarde (localStorage) n'est jamais touchée par cette opération.
PKMN.hardRefresh = async function () {
  try {
    PKMN.saveGame();
  } catch (e) {
    // rien à sauvegarder (ex: pas encore de partie) — sans importance ici
  }
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (e) {
    console.warn("Erreur pendant le nettoyage du cache:", e);
  } finally {
    location.reload();
  }
};
