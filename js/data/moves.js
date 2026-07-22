// Liste des capacités. power=null pour les capacités de statut (simplifiées: baisse/hausse de stat).
window.PKMN = window.PKMN || {};

PKMN.MOVES = {
  charge:       { name: "Charge",         type: "normal",   power: 40,  acc: 100, pp: 35, cat: "physique" },
  griffe:       { name: "Griffe",         type: "normal",   power: 40,  acc: 100, pp: 35, cat: "physique" },
  rugissement:  { name: "Rugissement",    type: "normal",   power: null, acc: 100, pp: 40, cat: "statut", effect: { stat: "atk", target: "foe", stages: -1 } },
  vive_attaque: { name: "Vive-Attaque",   type: "normal",   power: 40,  acc: 100, pp: 30, cat: "physique", priority: 1 },
  hurlement:    { name: "Hurlement",      type: "normal",   power: null, acc: 100, pp: 30, cat: "statut", effect: { stat: "def", target: "foe", stages: -1 } },
  mimi_queue:   { name: "Mimi-Queue",     type: "normal",   power: null, acc: 100, pp: 30, cat: "statut", effect: { stat: "def", target: "foe", stages: -1 } },
  cage_eclair:  { name: "Cage-Éclair",    type: "electrik", power: null, acc: 100, pp: 20, cat: "statut", effect: { stat: "spe", target: "foe", stages: -1 } },
  ultralaser:   { name: "Ultralaser",     type: "normal",   power: 150, acc: 90,  pp: 5,  cat: "physique", recharge: true },
  cognobscur:   { name: "Cogn'Obscur",    type: "normal",   power: 130, acc: 100, pp: 10, cat: "physique" },
  frappe_atlas: { name: "Frappe Atlas",   type: "normal",   power: 130, acc: 100, pp: 10, cat: "physique" },
  ecrasface:    { name: "Écras'Face",     type: "normal",   power: 80,  acc: 100, pp: 15, cat: "physique" },

  flammeche:    { name: "Flammèche",      type: "feu",     power: 40,  acc: 100, pp: 25, cat: "special" },
  lance_flammes: { name: "Lance-Flammes",  type: "feu",     power: 90,  acc: 100, pp: 15, cat: "special" },
  deflagration: { name: "Déflagration",   type: "feu",     power: 110, acc: 85,  pp: 5,  cat: "special" },
  tourbillon_feu: { name: "Tourbillon Feu", type: "feu",   power: 35,  acc: 85,  pp: 15, cat: "special" },

  pistolet_a_o: { name: "Pistolet à O",   type: "eau",     power: 40,  acc: 100, pp: 25, cat: "special" },
  bulles_d_o:   { name: "Bulles d'O",     type: "eau",     power: 65,  acc: 100, pp: 20, cat: "special" },
  hydrocanon:   { name: "Hydrocanon",     type: "eau",     power: 110, acc: 80,  pp: 5,  cat: "special" },
  surf:         { name: "Surf",           type: "eau",     power: 95,  acc: 100, pp: 15, cat: "special" },
  cascade:      { name: "Cascade",        type: "eau",     power: 80,  acc: 100, pp: 15, cat: "physique" },

  tonnelectrik: { name: "Tonnelectrik",   type: "electrik", power: 40,  acc: 100, pp: 30, cat: "special" },
  eclair:       { name: "Éclair",         type: "electrik", power: 90,  acc: 100, pp: 15, cat: "special" },
  tonnerre:     { name: "Tonnerre",       type: "electrik", power: 110, acc: 70,  pp: 10, cat: "special" },

  fouet_lianes: { name: "Fouet Lianes",   type: "plante",  power: 45,  acc: 100, pp: 25, cat: "physique" },
  tranch_herbe: { name: "Tranch'Herbe",   type: "plante",  power: 55,  acc: 95,  pp: 25, cat: "physique" },
  lance_soleil: { name: "Lance-Soleil",   type: "plante",  power: 120, acc: 100, pp: 10, cat: "special" },
  synthese:     { name: "Synthèse",       type: "plante",  power: null, acc: 100, pp: 5,  cat: "statut", effect: { heal: 0.5, target: "self" } },
  poudre_toxik: { name: "Poudre Toxik",   type: "poison",  power: null, acc: 75,  pp: 35, cat: "statut", effect: { status: "poison", target: "foe" } },

  poudreuse:    { name: "Poudreuse",      type: "glace",   power: 40,  acc: 100, pp: 25, cat: "special" },
  huile_glacee: { name: "Huile Glacée",   type: "glace",   power: 95,  acc: 100, pp: 10, cat: "special" },

  poing_karate: { name: "Poing Karaté",   type: "combat",  power: 50,  acc: 100, pp: 25, cat: "physique" },
  double_pied:  { name: "Double Pied",    type: "combat",  power: 30,  acc: 100, pp: 30, cat: "physique", hits: 2 },

  dard_venin:   { name: "Dard-Venin",     type: "poison",  power: 15,  acc: 100, pp: 35, cat: "physique" },
  sombre_toxine:{ name: "Sombre Toxine",  type: "poison",  power: null, acc: 90,  pp: 10, cat: "statut", effect: { status: "poison", target: "foe" } },

  seisme:       { name: "Séisme",         type: "sol",     power: 100, acc: 100, pp: 10, cat: "physique" },
  ball_seisme:  { name: "Ball'Seisme",    type: "sol",     power: 100, acc: 100, pp: 10, cat: "physique" },

  cyclone:      { name: "Cyclone",        type: "vol",     power: 40,  acc: 100, pp: 35, cat: "special" },
  attak_air:    { name: "Attak'Air",      type: "vol",     power: 60,  acc: 100, pp: 35, cat: "physique" },
  cru_aile:     { name: "Cru'Aile",       type: "vol",     power: 60,  acc: 100, pp: 35, cat: "physique" },
  pika_pika:    { name: "Piqué",          type: "vol",     power: 140, acc: 100, pp: 5,  cat: "physique" },

  choc_mental:  { name: "Choc Mental",    type: "psy",     power: 65,  acc: 100, pp: 20, cat: "special" },
  psyko:        { name: "Psyko",          type: "psy",     power: 90,  acc: 100, pp: 10, cat: "special" },
  lueur:        { name: "Lueur",          type: "psy",     power: null, acc: 100, pp: 20, cat: "statut", effect: { stat: "spd", target: "self", stages: 1 } },

  ligotage:     { name: "Ligotage",       type: "insecte", power: 15,  acc: 90,  pp: 20, cat: "physique" },
  dard_pin:     { name: "Dard-Pin",       type: "insecte", power: 25,  acc: 85,  pp: 20, cat: "physique", hits: 3 },
  megacorne:    { name: "Mégacorne",      type: "insecte", power: 120, acc: 85,  pp: 10, cat: "physique" },

  jet_pierres:  { name: "Jet-Pierres",    type: "roche",   power: 50,  acc: 90,  pp: 15, cat: "physique" },
  eboulement:   { name: "Éboulement",     type: "roche",   power: 75,  acc: 90,  pp: 10, cat: "physique" },

  moukill:      { name: "Mâchouille",     type: "spectre", power: 60,  acc: 100, pp: 25, cat: "physique" },
  ball_ombre:   { name: "Ball'Ombre",     type: "spectre", power: 80,  acc: 100, pp: 15, cat: "special" },

  rage_dragon:  { name: "Rage Dragon",    type: "dragon",  power: 40,  acc: 100, pp: 10, cat: "special", fixedDamage: 40 },
  draco_rage:   { name: "Draco-Rage",     type: "dragon",  power: 100, acc: 100, pp: 10, cat: "special" },

  morsure:      { name: "Morsure",        type: "tenebres", power: 60, acc: 100, pp: 25, cat: "physique" },

  boul_armure:  { name: "Boul'Armure",    type: "acier",   power: 40,  acc: 100, pp: 20, cat: "physique" },
  tete_de_fer:  { name: "Tête de Fer",    type: "acier",   power: 80,  acc: 100, pp: 15, cat: "physique" },

  draine:       { name: "Draine",         type: "plante",  power: 20,  acc: 100, pp: 25, cat: "special", drain: 0.5 },
  mega_sangsue: { name: "Méga-Sangsue",   type: "plante",  power: 40,  acc: 100, pp: 15, cat: "special", drain: 0.5 },

  danse_lames:  { name: "Danse Lames",    type: "normal",  power: null, acc: 100, pp: 20, cat: "statut", effect: { stat: "atk", target: "self", stages: 2 } },
  rapidite:     { name: "Rapidité",       type: "normal",  power: null, acc: 100, pp: 30, cat: "statut", effect: { stat: "spe", target: "self", stages: 2 } },
  repos:        { name: "Repos",          type: "psy",     power: null, acc: 100, pp: 10, cat: "statut", effect: { heal: 1, target: "self" } }
};
