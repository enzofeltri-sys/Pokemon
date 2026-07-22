// Boucle principale, machine à états, gestion des entrées clavier.
window.PKMN = window.PKMN || {};

PKMN.switchState = function (name) {
  PKMN.currentStateName = name;
  const state = PKMN.STATES[name];
  if (state && state.onEnter) {
    try {
      state.onEnter();
    } catch (e) {
      console.error(`Erreur à l'entrée dans l'état "${name}":`, e);
    }
  }
};

PKMN.initGame = function (canvas) {
  const ctx = canvas.getContext("2d");

  PKMN.STATES = {
    title: PKMN.TitleState,
    starter: PKMN.StarterState,
    overworld: PKMN.OverworldState,
    battle: PKMN.BattleState,
    party: PKMN.PartyState,
    bag: PKMN.BagState,
    mart: PKMN.MartState,
    pc: PKMN.PCState,
    pokedex: PKMN.PokedexState,
    dialogue: PKMN.DialogueState,
    quest: PKMN.QuestState,
    options: PKMN.OptionsState
  };

  const NAV_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter"]);

  PKMN.dispatchKey = function (key) {
    const state = PKMN.STATES[PKMN.currentStateName];
    if (state && state.onKey) {
      try {
        state.onKey(key);
      } catch (e) {
        console.error("Erreur de saisie clavier:", e);
      }
    }
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
    try {
      if (state && state.update) state.update(dt);
      if (state && state.render) state.render(ctx);
    } catch (e) {
      // Filet de sécurité: une erreur d'affichage imprévue ne doit jamais figer
      // le jeu pour de bon — on la journalise et on continue les prochaines images.
      console.error("Erreur pendant l'affichage:", e);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};
