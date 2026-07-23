// Base de données des quêtes secondaires. Chaque quête est juste des métadonnées
// d'affichage; son état réel (active/terminée, étape) vit dans PKMN.Player.quests,
// modifié par les effets des dialogues (voir js/story/dialogue.js).
window.PKMN = window.PKMN || {};

PKMN.QUESTS = {
  collier_perdu: { name: "Le collier perdu" },
  quete_electhor: { name: "La présence électrique" },
  quete_artikodin: { name: "Le souffle glacé" },
  quete_sulfura: { name: "La chaleur oubliée" },
  quete_mewtwo: { name: "Le vrai gardien du sanctuaire" },
  quete_mew: { name: "La légende sous la légende" }
};
