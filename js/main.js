window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game");
  PKMN.initGame(canvas);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW non enregistré:", e));
  });
}
