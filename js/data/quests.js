// Base de données des quêtes secondaires. Chaque quête est juste des métadonnées
// d'affichage; son état réel (active/terminée, étape) vit dans PKMN.Player.quests,
// modifié par les effets des dialogues (voir js/story/dialogue.js).
window.PKMN = window.PKMN || {};

PKMN.QUESTS = {
  collier_perdu: { name: "Le collier perdu" }
};
