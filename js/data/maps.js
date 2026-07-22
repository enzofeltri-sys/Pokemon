// Cartes en tuiles (grille de caractères). Chaque caractère = un type de tuile.
// Légende: '#' mur/arbre (bloqué) | '.' chemin | '"' herbe haute (rencontre) |
// 'C'/'D' porte (téléportation) | 'H' tuile de soin | 'M' Poké Mart | 'P' Boîte PC | '<'/'>' sortie de route
window.PKMN = window.PKMN || {};

PKMN.TILE_INFO = {
  "#": { blocked: true },
  ".": { blocked: false },
  '"': { blocked: false, grass: true },
  "C": { blocked: false, warp: true },
  "D": { blocked: false, warp: true },
  "H": { blocked: false, heal: true },
  "M": { blocked: false, mart: true },
  "P": { blocked: false, pc: true },
  "<": { blocked: false, warp: true },
  ">": { blocked: false, warp: true }
};

PKMN.MAPS = {
  town: {
    name: "Bourg Origine",
    tiles: [
      "##############",
      "#............#",
      "#....C..M....#",
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
      "#..H.P.#",
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
      "<..................>",
      '#..""""......""""..#',
      '#..""""......""""..#',
      "#..................#",
      "#..................#",
      "####################"
    ],
    warps: {
      "0,4": { toMap: "town", x: 12, y: 4 },
      "19,4": { toMap: "route2", x: 1, y: 4 }
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
  },

  route2: {
    name: "Route 2",
    tiles: [
      "####################",
      "#..................#",
      '#.""""......""""...#',
      '#.""""......""""...#',
      "<..................>",
      '#.""""......""""...#',
      '#.""""......""""...#',
      "#..................#",
      "#..................#",
      "####################"
    ],
    warps: {
      "0,4": { toMap: "route1", x: 18, y: 4 },
      "19,4": { toMap: "town2", x: 1, y: 4 }
    },
    encounterRate: 0.14,
    encounterTable: [
      { id: 25, weight: 12, min: 5, max: 8 },  // Pikachu
      { id: 27, weight: 22, min: 5, max: 8 },  // Sabelette
      { id: 52, weight: 22, min: 5, max: 8 },  // Miaouss
      { id: 23, weight: 18, min: 5, max: 8 },  // Abo
      { id: 43, weight: 18, min: 5, max: 9 },  // Mystherbe
      { id: 77, weight: 8,  min: 6, max: 9 }   // Ponyta
    ]
  },

  town2: {
    name: "Ville Prisma",
    tiles: [
      "##############",
      "#............#",
      "#.......C....#",
      "#............#",
      "<............#",
      "#............#",
      "#............#",
      "#............#",
      "#............#",
      "##############"
    ],
    warps: {
      "0,4": { toMap: "route2", x: 18, y: 4 },
      "8,2": { toMap: "center2", x: 4, y: 4 }
    }
  },

  center2: {
    name: "Centre Pokémon",
    indoor: true,
    tiles: [
      "########",
      "#......#",
      "#..H.P.#",
      "#......#",
      "#......#",
      "####D###"
    ],
    warps: {
      "4,5": { toMap: "town2", x: 8, y: 3 }
    }
  }
};

PKMN.START_MAP = "town";
