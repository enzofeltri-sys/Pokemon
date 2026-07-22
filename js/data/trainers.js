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
  }
};
