// Base de données des Dresseurs affrontables (combats liés à un PNJ via l'effet
// de dialogue `startTrainerBattle`). Forme d'un dresseur:
//   {
//     name: "Nom affiché en combat",
//     team: [{ species, level }, ...],   // envoyés dans l'ordre, un par un
//     reward: montant d'argent gagné à la victoire,
//     onWin: [ ...effets façon dialogue (setFlag, startQuest, badge, moral...) ]
//   }
window.PKMN = window.PKMN || {};

PKMN.TRAINERS = {
  rival1: {
    name: "Kian",
    team() {
      return [{ species: PKMN.rivalStarterId(), level: 5 }];
    },
    reward: 200,
    onWin: [{ setFlag: "beat_rival1", value: true }]
  },

  gym1_trainer: {
    name: "Novice des Vents",
    team: [{ species: 16, level: 9 }],
    reward: 150,
    onWin: [{ setFlag: "beat_gym1_trainer", value: true }]
  },

  gym1_leader: {
    name: "Aoede",
    team: [{ species: 17, level: 11 }, { species: 22, level: 13 }],
    reward: 500,
    onWin: [{ badge: "badge1" }, { setFlag: "beat_gym1", value: true }]
  },

  rival2: {
    name: "Kian",
    team() {
      const baseId = PKMN.rivalStarterId();
      const evoId = PKMN.POKEDEX[baseId].evoId || baseId;
      return [{ species: evoId, level: 16 }];
    },
    reward: 400,
    onWin: [{ setFlag: "beat_rival2", value: true }]
  },

  gym2_trainer: {
    name: "Recrue Ardente",
    team: [{ species: 58, level: 14 }],
    reward: 250,
    onWin: [{ setFlag: "beat_gym2_trainer", value: true }]
  },

  gym2_leader: {
    name: "Ignis",
    team: [{ species: 77, level: 16 }, { species: 59, level: 18 }],
    reward: 800,
    onWin: [{ badge: "badge2" }, { setFlag: "beat_gym2", value: true }]
  },

  gym3_trainer: {
    name: "Plongeuse",
    team: [{ species: 60, level: 17 }],
    reward: 300,
    onWin: [{ setFlag: "beat_gym3_trainer", value: true }]
  },

  gym3_leader: {
    name: "Néréa",
    team: [{ species: 118, level: 19 }, { species: 61, level: 21 }],
    reward: 1000,
    onWin: [{ badge: "badge3" }, { setFlag: "beat_gym3", value: true }]
  },

  rival3: {
    name: "Kian",
    team() {
      const baseId = PKMN.rivalStarterId();
      const stage2 = PKMN.POKEDEX[baseId].evoId || baseId;
      const stage3 = PKMN.POKEDEX[stage2].evoId || stage2;
      return [{ species: stage3, level: 28 }];
    },
    reward: 600,
    onWin: [{ setFlag: "beat_rival3", value: true }]
  },

  gym4_trainer: {
    name: "Herboriste",
    team: [{ species: 43, level: 22 }],
    reward: 350,
    onWin: [{ setFlag: "beat_gym4_trainer", value: true }]
  },

  gym4_leader: {
    name: "Sylvana",
    team: [{ species: 44, level: 24 }, { species: 71, level: 26 }],
    reward: 1200,
    onWin: [{ badge: "badge4" }, { setFlag: "beat_gym4", value: true }]
  },

  gym5_trainer: {
    name: "Occultiste",
    team: [{ species: 92, level: 28 }],
    reward: 400,
    onWin: [{ setFlag: "beat_gym5_trainer", value: true }]
  },

  gym5_leader: {
    name: "Ombrine",
    team: [{ species: 93, level: 30 }, { species: 94, level: 32 }],
    reward: 1400,
    onWin: [{ badge: "badge5" }, { setFlag: "beat_gym5", value: true }]
  },

  gym6_trainer: {
    name: "Électricien",
    team: [{ species: 100, level: 33 }],
    reward: 450,
    onWin: [{ setFlag: "beat_gym6_trainer", value: true }]
  },

  gym6_leader: {
    name: "Zapholt",
    team: [{ species: 101, level: 35 }, { species: 125, level: 37 }],
    reward: 1600,
    onWin: [{ badge: "badge6" }, { setFlag: "beat_gym6", value: true }]
  },

  gym7_trainer: {
    name: "Alpiniste",
    team: [{ species: 86, level: 38 }],
    reward: 500,
    onWin: [{ setFlag: "beat_gym7_trainer", value: true }]
  },

  gym7_leader: {
    name: "Glacia",
    team: [{ species: 87, level: 40 }, { species: 124, level: 42 }],
    reward: 1800,
    onWin: [{ badge: "badge7" }, { setFlag: "beat_gym7", value: true }]
  },

  gym8_trainer: {
    name: "Carrier",
    team: [{ species: 75, level: 43 }],
    reward: 550,
    onWin: [{ setFlag: "beat_gym8_trainer", value: true }]
  },

  gym8_leader: {
    name: "Terrakin",
    team: [{ species: 95, level: 45 }, { species: 76, level: 47 }],
    reward: 2000,
    onWin: [{ badge: "badge8" }, { setFlag: "beat_gym8", value: true }, { setFlag: "all_badges_campaign1", value: true }]
  },

  elite1_toxine: {
    name: "Toxine",
    team: [{ species: 89, level: 46 }, { species: 34, level: 48 }],
    reward: 1500,
    onWin: [{ setFlag: "beat_elite1", value: true }]
  },

  elite2_kojiro: {
    name: "Kojiro",
    team: [{ species: 107, level: 46 }, { species: 68, level: 48 }],
    reward: 1700,
    onWin: [{ setFlag: "beat_elite2", value: true }]
  },

  elite3_miroir: {
    name: "Miroir",
    team: [{ species: 64, level: 46 }, { species: 65, level: 48 }],
    reward: 1900,
    onWin: [{ setFlag: "beat_elite3", value: true }]
  },

  elite4_drake: {
    name: "Drake",
    team: [{ species: 148, level: 47 }, { species: 149, level: 49 }],
    reward: 2100,
    onWin: [{ setFlag: "beat_elite4", value: true }]
  },

  gym9_trainer: {
    name: "Fossoyeur",
    team: [{ species: 111, level: 48 }],
    reward: 600,
    onWin: [{ setFlag: "beat_gym9_trainer", value: true }]
  },

  gym9_leader: {
    name: "Cendra",
    team: [{ species: 51, level: 50 }, { species: 105, level: 52 }],
    reward: 2200,
    onWin: [{ badge: "badge9" }, { setFlag: "beat_gym9", value: true }]
  },

  league_champion: {
    name: "Kian",
    team() {
      const baseId = PKMN.rivalStarterId();
      const stage2 = PKMN.POKEDEX[baseId].evoId || baseId;
      const stage3 = PKMN.POKEDEX[stage2].evoId || stage2;
      return [
        { species: 143, level: 48 },
        { species: 130, level: 50 },
        { species: stage3, level: 51 }
      ];
    },
    reward: 3000,
    onWin: [{ setFlag: "beat_champion1", value: true }]
  }
};
