// Boucle principale, machine à états, gestion des entrées clavier.
window.PKMN = window.PKMN || {};

PKMN.switchState = function (name) {
  PKMN.currentStateName = name;
  const state = PKMN.STATES[name];
  if (state && state.onEnter) state.onEnter();
};

PKMN.initGame = function (canvas) {
  const ctx = canvas.getContext("2d");

  PKMN.STATES = {
    title: PKMN.TitleState,
    starter: PKMN.StarterState,
    overworld: PKMN.OverworldState,
    battle: PKMN.BattleState,
    party: PKMN.PartyState,
    pokedex: PKMN.PokedexState
  };

  const NAV_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter"]);

  PKMN.dispatchKey = function (key) {
    const state = PKMN.STATES[PKMN.currentStateName];
    if (state && state.onKey) state.onKey(key);
  };

  window.addEventListener("keydown", (e) => {
    if (NAV_KEYS.has(e.key)) e.preventDefault();
    PKMN.dispatchKey(e.key);
  });

  if (PKMN.initTouchControls) PKMN.initTouchControls();

  PKMN.switchState("title");

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const state = PKMN.STATES[PKMN.currentStateName];
    if (state && state.update) state.update(dt);
    if (state && state.render) state.render(ctx);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};
