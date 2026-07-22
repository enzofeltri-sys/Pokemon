// Cartes en tuiles (grille de caractères). Chaque caractère = un type de tuile.
// Légende: '#' mur/arbre (bloqué) | '.' chemin | '"' herbe haute (rencontre) |
// 'C'/'D' porte (téléportation) | 'H' tuile de soin | '<'/'>' sortie de route
window.PKMN = window.PKMN || {};

PKMN.TILE_INFO = {
  "#": { blocked: true },
  ".": { blocked: false },
  '"': { blocked: false, grass: true },
  "C": { blocked: false, warp: true },
  "D": { blocked: false, warp: true },
  "H": { blocked: false, heal: true },
  "<": { blocked: false, warp: true },
  ">": { blocked: false, warp: true }
};

PKMN.MAPS = {
  town: {
    name: "Bourg Origine",
    tiles: [
      "##############",
      "#............#",
      "#....C.......#",
      "#............#",
      "#............>",
      "#............#",
      "#............#",
      "#............#",
      "#............#",
      "##############"
    ],
    warps: {
      "5,2": { toMap: "center", x: 4, y: 4 },
      "13,4": { toMap: "route1", x: 1, y: 4 }
    },
    playerStart: { x: 6, y: 6 }
  },

  center: {
    name: "Centre Pokémon",
    indoor: true,
    tiles: [
      "########",
      "#......#",
      "#..H...#",
      "#......#",
      "#......#",
      "####D###"
    ],
    warps: {
      "4,5": { toMap: "town", x: 5, y: 3 }
    }
  },

  route1: {
    name: "Route 1",
    tiles: [
      "####################",
      "#..................#",
      '#..""""......""""..#',
      '#..""""......""""..#',
      "<..................#",
      '#..""""......""""..#',
      '#..""""......""""..#',
      "#..................#",
      "#..................#",
      "####################"
    ],
    warps: {
      "0,4": { toMap: "town", x: 12, y: 4 }
    },
    encounterRate: 0.12,
    encounterTable: [
      { id: 16, weight: 30, min: 2, max: 4 },  // Roucool
      { id: 19, weight: 30, min: 2, max: 4 },  // Rattata
      { id: 13, weight: 15, min: 2, max: 3 },  // Aspicot
      { id: 10, weight: 15, min: 2, max: 3 },  // Chenipan
      { id: 29, weight: 5,  min: 3, max: 5 },  // Nidoran F
      { id: 32, weight: 5,  min: 3, max: 5 }   // Nidoran M
    ]
  }
};

PKMN.START_MAP = "town";
