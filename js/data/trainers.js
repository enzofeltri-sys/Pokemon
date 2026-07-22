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
  }
};
