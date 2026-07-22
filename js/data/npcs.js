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
//       start: "id du premier nœud" OU [{condition, node}, ...] (voir dialogue.js),
//       default: "id de repli" (si start est une liste conditionnelle),
//       nodes: {
//         nomDuNoeud: {
//           text: "..." ou ["ligne 1", "ligne 2", ...],
//           effects: [ { give: {item, amount} }, { setFlag, value }, { startQuest },
//                      { advanceQuest: {id, step} }, { completeQuest }, { money: {delta} },
//                      { moral: {axis, delta} }, { heal: true }, { badge }, { startTrainerBattle } ],
//           choices: [ { label, next, condition, effects } ],  // optionnel
//           next: "id du nœud suivant"  // optionnel si pas de choix, sinon fin du dialogue
//         }
//       }
//     }
//   }
window.PKMN = window.PKMN || {};

PKMN.NPCS = {
  lab: [
    {
      id: "prof_aline",
      name: "Professeure Aline",
      x: 3, y: 2, facing: "down",
      color: "#16a085", letter: "A",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "met_prof_aline" }, node: "revisite" }],
        default: "premiere_fois",
        nodes: {
          premiere_fois: {
            text: [
              "Ah, te voilà ! J'espérais bien te voir passer par ici.",
              "Prends ça, ça t'aidera un peu sur la route."
            ],
            effects: [{ give: { item: "potion", amount: 2 } }, { setFlag: "met_prof_aline", value: true }],
            next: null
          },
          revisite: {
            text: ["Comment se porte ton équipe ? Reviens me voir si tu as besoin de conseils."],
            next: null
          }
        }
      }
    }
  ],

  rivalhouse: [
    {
      id: "rival_kian",
      name: "Kian",
      x: 3, y: 2, facing: "down",
      color: "#e67e22", letter: "K",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_rival1" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Alors, prêt à tester tes progrès ?",
              "On va vite savoir qui de nous deux est le meilleur !"
            ],
            effects: [{ startTrainerBattle: "rival1" }]
          },
          apres_defaite: {
            text: ["Pas mal du tout... mais la prochaine fois sera différente.", "On se recroisera, j'en suis sûr."],
            next: null
          }
        }
      }
    }
  ],

  town: [
    {
      id: "vieil_homme",
      name: "Vieil homme",
      x: 3, y: 7, facing: "down",
      color: "#7f8c8d", letter: "V",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["De mon temps, on traversait toute la région à pied, sans jamais se plaindre.", "Bande de jeunes !"],
            next: null
          }
        }
      }
    },
    {
      id: "collectionneuse",
      name: "Collectionneuse",
      x: 9, y: 8, facing: "up",
      color: "#8e44ad", letter: "C",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "met_collectionneuse" }, node: "revisite" }],
        default: "premiere_fois",
        nodes: {
          premiere_fois: {
            text: ["Oh, une nouvelle recrue ! Tiens, prends ça, ça peut toujours servir.", "Un Répulsif t'évitera quelques rencontres inutiles."],
            effects: [{ give: { item: "repel", amount: 1 } }, { setFlag: "met_collectionneuse", value: true }],
            next: null
          },
          revisite: {
            text: ["Bonne chance pour la suite de ton aventure !"],
            next: null
          }
        }
      }
    }
  ],

  gym1: [
    {
      id: "gym1_trainer",
      name: "Novice des Vents",
      x: 4, y: 4, facing: "down",
      color: "#2980b9", letter: "J",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym1_trainer" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: ["Tu ne passeras pas si facilement !"],
            effects: [{ startTrainerBattle: "gym1_trainer" }]
          },
          apres_defaite: {
            text: ["Vas-y, la Championne t'attend."],
            next: null
          }
        }
      }
    },
    {
      id: "gym1_leader",
      name: "Aoede",
      x: 4, y: 2, facing: "down",
      color: "#c0392b", letter: "A",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym1" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Je suis Aoede, Championne de l'Arène du Vent.",
              "Montre-moi ce que tu vaux !"
            ],
            effects: [{ startTrainerBattle: "gym1_leader" }]
          },
          apres_defaite: {
            text: ["Ce badge est à toi. Tu as du potentiel.", "Continue ta route, d'autres défis t'attendent."],
            next: null
          }
        }
      }
    }
  ],

  town2: [
    {
      id: "badaud_sylverive",
      name: "Badaud",
      x: 5, y: 6, facing: "down",
      color: "#7f8c8d", letter: "B",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Sylverive, la fierté de la région d'Elyndor !", "Enfin... quand tout va bien."],
            next: null
          }
        }
      }
    },
    {
      id: "informateur_sylverive",
      name: "Passant nerveux",
      x: 10, y: 7, facing: "left",
      color: "#34495e", letter: "?",
      type: "utile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: [
              "Psst... tu as entendu parler de ces gens habillés en noir qui rôdent près des routes ?",
              "Je ne sais pas ce qu'ils cherchent, mais ça ne me dit rien qui vaille.",
              "Fais attention à toi."
            ],
            effects: [{ setFlag: "heard_main_noire_hint", value: true }],
            next: null
          }
        }
      }
    }
  ],

  route3: [
    {
      id: "rival_kian_route3",
      name: "Kian",
      x: 10, y: 7, facing: "up",
      color: "#e67e22", letter: "K",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_rival2" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Tiens, je m'attendais bien à te croiser par ici.",
              "Voyons si l'écart entre nous s'est vraiment creusé !"
            ],
            effects: [{ startTrainerBattle: "rival2" }]
          },
          apres_defaite: {
            text: ["Toujours devant... pour l'instant.", "Je ne compte pas en rester là."],
            next: null
          }
        }
      }
    }
  ],

  gym2: [
    {
      id: "gym2_trainer",
      name: "Recrue Ardente",
      x: 4, y: 4, facing: "down",
      color: "#d35400", letter: "R",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym2_trainer" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: ["Sens la chaleur monter !"],
            effects: [{ startTrainerBattle: "gym2_trainer" }]
          },
          apres_defaite: {
            text: ["Ignis t'attend au fond de la salle."],
            next: null
          }
        }
      }
    },
    {
      id: "gym2_leader",
      name: "Ignis",
      x: 4, y: 2, facing: "down",
      color: "#e74c3c", letter: "I",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym2" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Je suis Ignis, Champion de l'Arène du Feu.",
              "Espérons que tu tiennes la chaleur du combat !"
            ],
            effects: [{ startTrainerBattle: "gym2_leader" }]
          },
          apres_defaite: {
            text: ["Ce badge est mérité.", "La suite de la route ne sera pas plus tendre."],
            next: null
          }
        }
      }
    }
  ],

  town3: [
    {
      id: "badaud_braseforge",
      name: "Forgeron",
      x: 5, y: 6, facing: "down",
      color: "#7f8c8d", letter: "F",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Ici, la chaleur des forges ne s'éteint jamais.", "Ça forge le caractère, à ce qu'on dit."],
            next: null
          }
        }
      }
    },
    {
      id: "informateur_braseforge",
      name: "Passant inquiet",
      x: 10, y: 7, facing: "left",
      color: "#34495e", letter: "?",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "heard_main_noire_hint2" }, node: "revisite" }],
        default: "premiere_fois",
        nodes: {
          premiere_fois: {
            text: [
              "Ces gens en noir dont on parlait à Sylverive... on les a revus par ici.",
              "Ils posaient des questions étranges près de l'Arène.",
              "Tiens, ça pourra t'être utile si tu croises des ennuis."
            ],
            effects: [{ give: { item: "antidote", amount: 2 } }, { setFlag: "heard_main_noire_hint2", value: true }],
            next: null
          },
          revisite: {
            text: ["Reste sur tes gardes."],
            next: null
          }
        }
      }
    }
  ]
};
