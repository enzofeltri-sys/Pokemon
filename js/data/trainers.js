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
  }
};
