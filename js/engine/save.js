// Sauvegarde locale (localStorage), aucune donnée ne quitte le navigateur.
window.PKMN = window.PKMN || {};

PKMN.SAVE_KEY = "pkmn_perso_save_v1";

PKMN.saveGame = function () {
  const P = PKMN.Player;
  const data = {
    party: P.party,
    box: P.box,
    pokedexSeen: [...P.pokedexSeen],
    pokedexCaught: [...P.pokedexCaught],
    bag: P.bag,
    money: P.money,
    lastCenter: P.lastCenter,
    repelSteps: P.repelSteps,
    mapKey: P.mapKey,
    x: P.x,
    y: P.y,
    flags: P.flags,
    quests: P.quests,
    moral: P.moral,
    options: P.options,
    quickItem: P.quickItem
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
    P.party = (data.party || []).map(PKMN.normalizePokemon);
    P.box = (data.box || []).map(PKMN.normalizePokemon);
    P.pokedexSeen = new Set(data.pokedexSeen || []);
    P.pokedexCaught = new Set(data.pokedexCaught || []);
    P.bag = data.bag || {};
    P.money = data.money ?? 0;
    P.lastCenter = data.lastCenter || null;
    P.repelSteps = data.repelSteps ?? 0;
    P.mapKey = data.mapKey || PKMN.START_MAP;
    P.x = data.x ?? PKMN.MAPS[PKMN.START_MAP].playerStart.x;
    P.y = data.y ?? PKMN.MAPS[PKMN.START_MAP].playerStart.y;
    P.flags = data.flags || {};
    P.quests = data.quests || {};
    P.moral = data.moral || { loyaute: 0, ambition: 0, methode: 0 };
    P.options = Object.assign({ multiExp: true }, data.options || {});
    P.quickItem = data.quickItem || null;
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
