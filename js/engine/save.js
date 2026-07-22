// Sauvegarde locale (localStorage), aucune donnée ne quitte le navigateur.
window.PKMN = window.PKMN || {};

PKMN.SAVE_KEY = "pkmn_perso_save_v1";

PKMN.saveGame = function () {
  const P = PKMN.Player;
  const data = {
    party: P.party,
    pokedexSeen: [...P.pokedexSeen],
    pokedexCaught: [...P.pokedexCaught],
    bag: P.bag,
    mapKey: P.mapKey,
    x: P.x,
    y: P.y
  };
  try {
    localStorage.setItem(PKMN.SAVE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn("Sauvegarde impossible:", e);
    return false;
  }
};

PKMN.loadGame = function () {
  try {
    const raw = localStorage.getItem(PKMN.SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    const P = PKMN.Player;
    P.party = data.party || [];
    P.pokedexSeen = new Set(data.pokedexSeen || []);
    P.pokedexCaught = new Set(data.pokedexCaught || []);
    P.bag = data.bag || {};
    P.mapKey = data.mapKey || PKMN.START_MAP;
    P.x = data.x ?? PKMN.MAPS[PKMN.START_MAP].playerStart.x;
    P.y = data.y ?? PKMN.MAPS[PKMN.START_MAP].playerStart.y;
    return P.party.length > 0;
  } catch (e) {
    console.warn("Chargement impossible:", e);
    return false;
  }
};

PKMN.hasSave = function () {
  return !!localStorage.getItem(PKMN.SAVE_KEY);
};

PKMN.deleteSave = function () {
  localStorage.removeItem(PKMN.SAVE_KEY);
};
