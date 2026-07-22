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
    name: "Val Brumeux",
    tiles: [
      "##############",
      "#............#",
      "#.D..C..M.D..#",
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
      "2,2": { toMap: "lab", x: 3, y: 4 },
      "10,2": { toMap: "rivalhouse", x: 3, y: 4 },
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

  lab: {
    name: "Laboratoire",
    indoor: true,
    tiles: [
      "########",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "####D###"
    ],
    warps: {
      "4,5": { toMap: "town", x: 2, y: 3 }
    }
  },

  rivalhouse: {
    name: "Maison",
    indoor: true,
    tiles: [
      "########",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "####D###"
    ],
    warps: {
      "4,5": { toMap: "town", x: 10, y: 3 }
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
    name: "Sylverive",
    tiles: [
      "##############",
      "#............#",
      "#..D....C....#",
      "#............#",
      "<............>",
      "#............#",
      "#............#",
      "#............#",
      "#............#",
      "##############"
    ],
    warps: {
      "0,4": { toMap: "route2", x: 18, y: 4 },
      "3,2": { toMap: "gym1", x: 4, y: 6 },
      "8,2": { toMap: "center2", x: 4, y: 4 },
      "13,4": { toMap: "route3", x: 1, y: 4 }
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
  },

  gym1: {
    name: "Arène du Vent",
    indoor: true,
    tiles: [
      "########",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "####D###"
    ],
    warps: {
      "4,7": { toMap: "town2", x: 3, y: 3 }
    }
  },

  route3: {
    name: "Route 3",
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
      "0,4": { toMap: "town2", x: 13, y: 4 },
      "19,4": { toMap: "town3", x: 1, y: 4 }
    },
    encounterRate: 0.15,
    encounterTable: [
      { id: 77, weight: 20, min: 8,  max: 11 },  // Ponyta
      { id: 58, weight: 18, min: 9,  max: 12 },  // Caninos
      { id: 27, weight: 20, min: 7,  max: 10 },  // Sabelette
      { id: 74, weight: 20, min: 7,  max: 10 },  // Racaillou
      { id: 19, weight: 22, min: 6,  max: 9  }   // Rattata
    ]
  },

  town3: {
    name: "Braseforge",
    tiles: [
      "##############",
      "#............#",
      "#..D..C..M...#",
      "#............#",
      "<............>",
      "#............#",
      "#............#",
      "#............#",
      "#............#",
      "##############"
    ],
    warps: {
      "0,4": { toMap: "route3", x: 18, y: 4 },
      "3,2": { toMap: "gym2", x: 4, y: 6 },
      "6,2": { toMap: "center3", x: 4, y: 4 },
      "13,4": { toMap: "route4", x: 1, y: 4 }
    }
  },

  center3: {
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
      "4,5": { toMap: "town3", x: 6, y: 3 }
    }
  },

  gym2: {
    name: "Arène du Feu",
    indoor: true,
    tiles: [
      "########",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "####D###"
    ],
    warps: {
      "4,7": { toMap: "town3", x: 3, y: 3 }
    }
  },

  route4: {
    name: "Route 4",
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
      "0,4": { toMap: "town3", x: 13, y: 4 },
      "19,4": { toMap: "town4", x: 1, y: 4 }
    },
    encounterRate: 0.15,
    encounterTable: [
      { id: 79,  weight: 18, min: 13, max: 16 },  // Ramoloss
      { id: 118, weight: 22, min: 12, max: 15 },  // Poissirene
      { id: 41,  weight: 20, min: 13, max: 16 },  // Nosferapti
      { id: 74,  weight: 20, min: 12, max: 15 },  // Racaillou
      { id: 19,  weight: 20, min: 11, max: 14 }   // Rattata
    ]
  },

  town4: {
    name: "Miréclat",
    tiles: [
      "##############",
      "#............#",
      "#..D..C..M...#",
      "#............#",
      "<............>",
      "#............#",
      "#............#",
      "#............#",
      "#............#",
      "##############"
    ],
    warps: {
      "0,4": { toMap: "route4", x: 18, y: 4 },
      "3,2": { toMap: "gym3", x: 4, y: 6 },
      "6,2": { toMap: "center4", x: 4, y: 4 },
      "13,4": { toMap: "route5", x: 1, y: 4 }
    }
  },

  center4: {
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
      "4,5": { toMap: "town4", x: 6, y: 3 }
    }
  },

  gym3: {
    name: "Arène de l'Eau",
    indoor: true,
    tiles: [
      "########",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "####D###"
    ],
    warps: {
      "4,7": { toMap: "town4", x: 3, y: 3 }
    }
  },

  route5: {
    name: "Route 5",
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
      "0,4": { toMap: "town4", x: 13, y: 4 },
      "19,4": { toMap: "town5", x: 1, y: 4 }
    },
    encounterRate: 0.15,
    encounterTable: [
      { id: 43,  weight: 22, min: 18, max: 21 },  // Mystherbe
      { id: 69,  weight: 20, min: 18, max: 21 },  // Chetiflor
      { id: 102, weight: 18, min: 18, max: 21 },  // Saquedeneu
      { id: 16,  weight: 20, min: 17, max: 20 },  // Roucool
      { id: 27,  weight: 20, min: 17, max: 20 }   // Sabelette
    ]
  },

  town5: {
    name: "Verdeterre",
    tiles: [
      "##############",
      "#............#",
      "#..D..C..M...#",
      "#............#",
      "<............#",
      "#............#",
      "#............#",
      "#............#",
      "#............#",
      "##############"
    ],
    warps: {
      "0,4": { toMap: "route5", x: 18, y: 4 },
      "3,2": { toMap: "gym4", x: 4, y: 6 },
      "6,2": { toMap: "center5", x: 4, y: 4 }
    }
  },

  center5: {
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
      "4,5": { toMap: "town5", x: 6, y: 3 }
    }
  },

  gym4: {
    name: "Arène de la Nature",
    indoor: true,
    tiles: [
      "########",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "#......#",
      "####D###"
    ],
    warps: {
      "4,7": { toMap: "town5", x: 3, y: 3 }
    }
  }
};

PKMN.START_MAP = "town";
