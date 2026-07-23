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
  quete_mew: { name: "La légende sous la légende" },
  quete_raikou: { name: "L'orage qui rôde" },
  quete_entei: { name: "Le feu qui couve" },
  quete_suicune: { name: "Le courant silencieux" },
  quete_lugia: { name: "Le gardien des profondeurs" },
  quete_hooh: { name: "L'oiseau arc-en-ciel" },
  quete_celebi: { name: "Le voyageur du temps" }
};
