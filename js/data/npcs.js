// Base de données des PNJ, par carte. Chaque PNJ est une entité fixe sur une tuile
// (bloque le passage) que le joueur peut interpeller en lui faisant face et en
// appuyant sur Entrée/A. Forme d'un PNJ:
//   {
//     id: "identifiant_unique",
//     name: "Nom affiché",
//     x, y: position sur la carte,
//     facing: "down"|"up"|"left"|"right" (optionnel, "down" par défaut),
//     color: couleur du jeton (placeholder visuel),
//     letter: lettre affichée dans le jeton,
//     type: "inutile" | "utile" | "echange" | "cache" (juste indicatif),
//     dialogue: {
//       start: "id du premier nœud",
//       nodes: {
//         nomDuNoeud: {
//           text: "..." ou ["ligne 1", "ligne 2", ...],
//           effects: [ { give: {item, amount} }, { setFlag, value }, { startQuest },
//                      { advanceQuest: {id, step} }, { completeQuest }, { money: {delta} },
//                      { moral: {axis, delta} }, { heal: true } ],
//           choices: [ { label, next, condition, effects } ],  // optionnel
//           next: "id du nœud suivant"  // optionnel si pas de choix, sinon fin du dialogue
//         }
//       }
//     }
//   }
// Scaffold vide pour l'instant — le contenu narratif (rival, professeure, PNJ du
// village) arrive dans une phase suivante, une fois le moteur validé.
window.PKMN = window.PKMN || {};

PKMN.NPCS = {};
