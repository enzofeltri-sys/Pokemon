// Contrôles tactiles (croix directionnelle + boutons A/B) pour jouer au
// doigt sur iPhone/iPad, en plus du clavier.
window.PKMN = window.PKMN || {};

PKMN.initTouchControls = function () {
  const buttons = document.querySelectorAll("#touch-controls [data-key]");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    const key = btn.dataset.key;
    const repeatable = key.startsWith("Arrow");
    let interval = null;

    const press = (e) => {
      e.preventDefault();
      btn.classList.add("pressed");
      PKMN.dispatchKey(key);
      if (repeatable) {
        clearInterval(interval);
        interval = setInterval(() => PKMN.dispatchKey(key), 160);
      }
    };
    const release = (e) => {
      if (e) e.preventDefault();
      btn.classList.remove("pressed");
      btn.blur();
      clearInterval(interval);
      interval = null;
    };

    btn.addEventListener("touchstart", press, { passive: false });
    btn.addEventListener("touchend", release, { passive: false });
    btn.addEventListener("touchcancel", release, { passive: false });
    // Support souris aussi (test sur ordinateur)
    btn.addEventListener("mousedown", press);
    btn.addEventListener("mouseup", release);
    btn.addEventListener("mouseleave", release);
  });

  // Taper sur l'écran de jeu fait aussi avancer les dialogues (comme Entrée)
  const canvas = document.getElementById("game");
  if (canvas) {
    canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      PKMN.dispatchKey("Enter");
    }, { passive: false });
  }
};
