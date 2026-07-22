window.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("game");
  // Le canvas n'attend pas tout seul le chargement des polices @font-face:
  // sans ça, les premières images (voire toutes, si le navigateur ne les
  // recharge jamais) s'affichent avec la police de repli.
  try {
    await Promise.all([
      document.fonts.load("16px Silkscreen"),
      document.fonts.load("bold 16px Silkscreen"),
      document.fonts.load("16px 'Press Start 2P'")
    ]);
  } catch (e) {
    // Pas grave si une police ne charge pas: le jeu utilisera la police de repli.
  }
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
