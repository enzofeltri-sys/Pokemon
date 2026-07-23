# Pokémon — Édition Perso

Petit RPG Pokémon en HTML/JS/Canvas, fait pour un usage strictement personnel
(fan-project non commercial). Génération 1 complète (151 Pokémon, vrais noms,
types et statistiques). Fonctionne entièrement hors-ligne, sauf pour les
sprites officiels qui se chargent depuis internet quand tu joues.

## Comment jouer

Ouvre `index.html` dans un navigateur (double-clic, ou via un petit serveur
local pour de meilleures performances, ex: `python3 -m http.server` puis
`http://localhost:8000`).

- **Flèches directionnelles** : se déplacer
- **Entrée / Espace** : valider, avancer les dialogues, ouvrir le menu pause
  (Équipe / Pokédex / Sauvegarder) dans le monde ouvert
- **Échap** : revenir en arrière dans un menu

Va dans l'herbe haute (Route 1, à l'est de la ville de départ) pour
déclencher des combats sauvages. Le Centre Pokémon (bâtiment dans la ville)
soigne intégralement ton équipe.

## Contenu du v1

- 151 Pokémon de Génération 1 (stats, types, noms français officiels)
- Ville de départ + Route 1 avec rencontres sauvages
- Combat au tour par tour (types, PP, statistiques, montée en stats)
- Capture (Poké Ball), montée de niveau, évolutions (simplifiées : toutes
  déclenchées par niveau, y compris celles qui utilisaient une pierre ou un
  échange dans le jeu original)
- Sauvegarde locale dans le navigateur (`localStorage`)

## Limites connues / pistes d'extension

- Génération 2 et 3 pas encore incluses (structure prévue pour les ajouter
  facilement dans `js/data/pokedex.js`)
- Une seule route/carte pour l'instant
- Pas d'objets (Potions, etc.) ni de dresseurs adverses
- Les sprites officiels nécessitent une connexion internet ; hors-ligne, un
  placeholder coloré par type s'affiche à la place

## Tests

Un petit jeu de tests automatisés couvre le moteur de combat (types, statuts,
capture, dresseurs multi-Pokémon...) dans `tests/`. Pour les lancer :

```
npm install
npm test
```

Les constantes d'équilibrage (taux de capture, fractions de dégâts de statut,
partage d'XP, etc.) sont centralisées dans `js/data/balance.js`.

## Crédits

- Boîte de dialogue et indicateur "appuie pour continuer" (sprites/ui/) :
  *Sprout Lands - UI Pack - Basic pack*, par Cup Nooble (usage non-commercial).
- Personnage jouable, rival, Main Noire et PNJ génériques (sprites/player.png,
  sprites/rival.png, sprites/main_noire*.png, sprites/npc_a.png,
  sprites/npc_b.png, sprites/npc_c.png) : même style graphique pour tout le
  monde, par souci d'harmonie visuelle — *QuestDX Character Pack
  (Free Version)*, par Snoblin.
- Tuiles d'herbe/eau, arbres, façades de bâtiments (porte maison/Centre/Mart),
  mur intérieur et déco (tableau, plante, tapis) (sprites/tiles/) : reprises
  et recolorées à partir de *Sprout Lands - Sprites - Basic pack*, par
  Cup Nooble (usage non-commercial).
- Portraits affichés dans les boîtes de dialogue (sprites/portraits/) :
  fournis pour ce projet.

## Note

Projet fan réalisé pour un usage personnel uniquement. Pokémon, les noms et
designs associés sont la propriété de Nintendo / Creatures Inc. / Game Freak /
The Pokémon Company.
