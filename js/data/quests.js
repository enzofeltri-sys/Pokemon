// Base de données des quêtes secondaires. Chaque quête est juste des métadonnées
// d'affichage; son état réel (active/terminée, étape) vit dans PKMN.Player.quests,
// modifié par les effets des dialogues (voir js/engine/dialogue.js).
// Scaffold vide pour l'instant — le contenu narratif (rival, professeure, village,
// quêtes secondaires) arrive dans une phase suivante, une fois le moteur validé.
window.PKMN = window.PKMN || {};

PKMN.QUESTS = {};
