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
  ],

  gym3: [
    {
      id: "gym3_trainer",
      name: "Plongeuse",
      x: 4, y: 4, facing: "down",
      color: "#2980b9", letter: "P",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym3_trainer" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: ["Le courant t'emportera !"],
            effects: [{ startTrainerBattle: "gym3_trainer" }]
          },
          apres_defaite: {
            text: ["Néréa n'attend que toi, au fond de la salle."],
            next: null
          }
        }
      }
    },
    {
      id: "gym3_leader",
      name: "Néréa",
      x: 4, y: 2, facing: "down",
      color: "#2471a3", letter: "N",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym3" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Je suis Néréa, Championne de l'Arène de l'Eau.",
              "Laisse-toi porter par le courant... si tu peux."
            ],
            effects: [{ startTrainerBattle: "gym3_leader" }]
          },
          apres_defaite: {
            text: ["Ce badge te revient.", "La route continue, ne te relâche pas."],
            next: null
          }
        }
      }
    }
  ],

  town4: [
    {
      id: "badaud_mireclat",
      name: "Pêcheur",
      x: 5, y: 6, facing: "down",
      color: "#7f8c8d", letter: "P",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Miréclat a les eaux les plus limpides de la région.", "Enfin, ça se dit."],
            next: null
          }
        }
      }
    },
    {
      id: "informateur_mireclat",
      name: "Passante préoccupée",
      x: 10, y: 7, facing: "left",
      color: "#34495e", letter: "?",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "heard_main_noire_hint3" }, node: "revisite" }],
        default: "premiere_fois",
        nodes: {
          premiere_fois: {
            text: [
              "Ces gens en noir... ils remontent vers le nord, à ce qu'on raconte.",
              "Quelqu'un a parlé d'un endroit qu'ils appellent juste \"le Sanctuaire\".",
              "Je ne sais pas ce que ça signifie, mais méfie-toi."
            ],
            effects: [{ setFlag: "heard_main_noire_hint3", value: true }],
            next: null
          },
          revisite: {
            text: ["Sois prudent sur la route."],
            next: null
          }
        }
      }
    }
  ],

  route5: [
    {
      id: "rival_kian_route5",
      name: "Kian",
      x: 10, y: 7, facing: "up",
      color: "#e67e22", letter: "K",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_rival3" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "On approche du milieu du chemin, tu ne crois pas ?",
              "Cette fois, je ne compte pas perdre !"
            ],
            effects: [{ startTrainerBattle: "rival3" }]
          },
          apres_defaite: {
            text: ["Tch... encore une fois.", "Ce n'est pas fini entre nous."],
            next: null
          }
        }
      }
    }
  ],

  gym4: [
    {
      id: "gym4_trainer",
      name: "Herboriste",
      x: 4, y: 4, facing: "down",
      color: "#27ae60", letter: "H",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym4_trainer" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: ["La nature ne pardonne pas l'imprudence !"],
            effects: [{ startTrainerBattle: "gym4_trainer" }]
          },
          apres_defaite: {
            text: ["Sylvana t'attend au fond de la salle."],
            next: null
          }
        }
      }
    },
    {
      id: "gym4_leader",
      name: "Sylvana",
      x: 4, y: 2, facing: "down",
      color: "#1e8449", letter: "S",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym4" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Je suis Sylvana, Championne de l'Arène de la Nature.",
              "Voyons si tu sais t'adapter à ton adversaire."
            ],
            effects: [{ startTrainerBattle: "gym4_leader" }]
          },
          apres_defaite: {
            text: ["Un badge amplement mérité.", "Le chemin qui t'attend sera bien plus rude."],
            next: null
          }
        }
      }
    }
  ],

  town5: [
    {
      id: "badaud_verdeterre",
      name: "Jardinière",
      x: 5, y: 6, facing: "down",
      color: "#7f8c8d", letter: "J",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Verdeterre pousse plus vite que n'importe où ailleurs.", "Un vrai mystère, à vrai dire."],
            next: null
          }
        }
      }
    }
  ],

  route6: [
    {
      id: "silhouette_impasse",
      name: "Silhouette",
      x: 10, y: 8, facing: "down",
      color: "#95a5a6", letter: "?",
      type: "cache",
      dialogue: {
        start: [{ condition: { flag: "quete_collier_recuperee" }, node: "revisite" }],
        default: "premiere_fois",
        nodes: {
          premiere_fois: {
            text: [
              "Tiens, qu'est-ce que c'est que ça, à moitié enterré ici ?",
              "Un collier... Ça doit appartenir à quelqu'un. Prends-le, toi qui voyages."
            ],
            effects: [{ setFlag: "quete_collier_recuperee", value: true }],
            next: null
          },
          revisite: {
            text: ["Cette impasse ne cache plus rien d'autre, on dirait."],
            next: null
          }
        }
      }
    }
  ],

  gym5: [
    {
      id: "gym5_trainer",
      name: "Occultiste",
      x: 4, y: 4, facing: "down",
      color: "#5b2c6f", letter: "O",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym5_trainer" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: ["Les ombres vont t'engloutir !"],
            effects: [{ startTrainerBattle: "gym5_trainer" }]
          },
          apres_defaite: {
            text: ["Ombrine t'attend au fond de la salle."],
            next: null
          }
        }
      }
    },
    {
      id: "gym5_leader",
      name: "Ombrine",
      x: 4, y: 2, facing: "down",
      color: "#4a235a", letter: "O",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym5" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Je suis Ombrine, Championne de l'Arène de l'Ombre.",
              "Ceux qui craignent le noir n'ont rien à faire ici."
            ],
            effects: [{ startTrainerBattle: "gym5_leader" }]
          },
          apres_defaite: {
            text: ["Ce badge est le tien.", "Ce que tu affronteras ensuite ne recule devant rien."],
            next: null
          }
        }
      }
    }
  ],

  town6: [
    {
      id: "badaud_nocterme",
      name: "Veilleur",
      x: 5, y: 6, facing: "down",
      color: "#7f8c8d", letter: "V",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Nocterme ne dort jamais vraiment.", "Ça a son charme... ou pas."],
            next: null
          }
        }
      }
    },
    {
      id: "villageoise_collier",
      name: "Villageoise inquiète",
      x: 9, y: 6, facing: "down",
      color: "#af7ac5", letter: "V",
      type: "utile",
      dialogue: {
        start: [
          { condition: { flag: "quete_collier_remerciee" }, node: "final" },
          { condition: { flag: "quete_collier_recuperee" }, node: "remerciement" },
          { condition: { flag: "quete_collier_active" }, node: "en_attente" }
        ],
        default: "premiere_fois",
        nodes: {
          premiere_fois: {
            text: [
              "Oh... j'ai perdu un collier auquel je tiens beaucoup, quelque part sur la route en arrivant ici.",
              "Il y a une impasse le long du chemin. Si jamais tu le retrouves..."
            ],
            effects: [{ startQuest: "collier_perdu" }, { setFlag: "quete_collier_active", value: true }],
            next: null
          },
          en_attente: {
            text: ["Toujours aucune trace de mon collier ?"],
            next: null
          },
          remerciement: {
            text: ["Mon collier ! Tu l'as retrouvé !", "Merci mille fois, tiens, prends ceci en retour."],
            effects: [
              { give: { item: "superball", amount: 2 } },
              { money: { delta: 300 } },
              { completeQuest: "collier_perdu" },
              { setFlag: "quete_collier_remerciee", value: true }
            ],
            next: null
          },
          final: {
            text: ["Encore merci pour tout à l'heure."],
            next: null
          }
        }
      }
    },
    {
      id: "informateur_nocterme",
      name: "Passant méfiant",
      x: 12, y: 7, facing: "left",
      color: "#34495e", letter: "?",
      type: "utile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: [
              "On raconte que la Ligue elle-même s'inquiète de ces gens en noir, maintenant.",
              "Si même eux s'en préoccupent, ça ne doit pas être bon signe."
            ],
            effects: [{ setFlag: "heard_main_noire_hint4", value: true }],
            next: null
          }
        }
      }
    }
  ],

  maison_inutile1: [
    {
      id: "habitant_maison1",
      name: "Habitant",
      x: 3, y: 2, facing: "down",
      color: "#7f8c8d", letter: "H",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Cette maison ? Rien de spécial, j'y habite juste.", "Tu peux repartir, tu sais."],
            next: null
          }
        }
      }
    }
  ],

  gym6: [
    {
      id: "gym6_trainer",
      name: "Électricien",
      x: 4, y: 4, facing: "down",
      color: "#d4ac0d", letter: "É",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym6_trainer" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: ["Ça va décoiffer !"],
            effects: [{ startTrainerBattle: "gym6_trainer" }]
          },
          apres_defaite: {
            text: ["Zapholt t'attend au fond de la salle."],
            next: null
          }
        }
      }
    },
    {
      id: "gym6_leader",
      name: "Zapholt",
      x: 4, y: 2, facing: "down",
      color: "#b7950b", letter: "Z",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym6" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Je suis Zapholt, Champion de l'Arène de l'Éclair.",
              "J'espère que ton équipe tient le choc !"
            ],
            effects: [{ startTrainerBattle: "gym6_leader" }]
          },
          apres_defaite: {
            text: ["Un badge à la hauteur de tes efforts.", "La suite du voyage s'annonce électrique, dans tous les sens du terme."],
            next: null
          }
        }
      }
    }
  ],

  town7: [
    {
      id: "badaud_voltis",
      name: "Ingénieur",
      x: 5, y: 6, facing: "down",
      color: "#7f8c8d", letter: "I",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Voltis alimente toute la région, ou presque.", "Ne touche pas aux câbles, par contre."],
            next: null
          }
        }
      }
    }
  ],

  maison_inutile2: [
    {
      id: "habitant_maison2",
      name: "Habitante",
      x: 3, y: 2, facing: "down",
      color: "#7f8c8d", letter: "H",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Ah, un visiteur ! Enfin non, je n'ai rien à te proposer.", "Bonne route quand même."],
            next: null
          }
        }
      }
    }
  ],

  gym7: [
    {
      id: "gym7_trainer",
      name: "Alpiniste",
      x: 4, y: 4, facing: "down",
      color: "#5dade2", letter: "A",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym7_trainer" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: ["Le froid ne pardonne pas !"],
            effects: [{ startTrainerBattle: "gym7_trainer" }]
          },
          apres_defaite: {
            text: ["Glacia t'attend au fond de la salle."],
            next: null
          }
        }
      }
    },
    {
      id: "gym7_leader",
      name: "Glacia",
      x: 4, y: 2, facing: "down",
      color: "#2e86c1", letter: "G",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym7" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Je suis Glacia, Championne de l'Arène du Givre.",
              "Espérons que tu résistes mieux au froid que la plupart."
            ],
            effects: [{ startTrainerBattle: "gym7_leader" }]
          },
          apres_defaite: {
            text: ["Ce badge est amplement mérité.", "Il ne t'en reste plus qu'un, pour cette partie du voyage."],
            next: null
          }
        }
      }
    }
  ],

  town8: [
    {
      id: "badaud_glaceria",
      name: "Guide",
      x: 5, y: 6, facing: "down",
      color: "#7f8c8d", letter: "G",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Glacéria reste froide toute l'année.", "Prends de quoi te couvrir, si tu comptais rester."],
            next: null
          }
        }
      }
    }
  ],

  maison_inutile3: [
    {
      id: "habitant_maison3",
      name: "Habitant",
      x: 3, y: 2, facing: "down",
      color: "#7f8c8d", letter: "H",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Le chauffage laisse un peu à désirer ici.", "Mais on s'y fait."],
            next: null
          }
        }
      }
    }
  ],

  gym8: [
    {
      id: "gym8_trainer",
      name: "Carrier",
      x: 4, y: 4, facing: "down",
      color: "#935116", letter: "C",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym8_trainer" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: ["Solide comme la roche !"],
            effects: [{ startTrainerBattle: "gym8_trainer" }]
          },
          apres_defaite: {
            text: ["Terrakin t'attend au fond de la salle."],
            next: null
          }
        }
      }
    },
    {
      id: "gym8_leader",
      name: "Terrakin",
      x: 4, y: 2, facing: "down",
      color: "#784212", letter: "T",
      type: "utile",
      dialogue: {
        start: [{ condition: { flag: "beat_gym8" }, node: "apres_defaite" }],
        default: "avant_combat",
        nodes: {
          avant_combat: {
            text: [
              "Je suis Terrakin, Champion de l'Arène de la Roche.",
              "Voyons si tu peux ébranler ma défense."
            ],
            effects: [{ startTrainerBattle: "gym8_leader" }]
          },
          apres_defaite: {
            text: ["Huit badges. Tu as fait du chemin.", "Ce n'était pourtant que la première étape."],
            next: null
          }
        }
      }
    }
  ],

  town9: [
    {
      id: "badaud_solhazar",
      name: "Mineur",
      x: 5, y: 6, facing: "down",
      color: "#7f8c8d", letter: "M",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Solhazar a été bâtie sur d'anciennes carrières.", "On y trouve toutes sortes de curiosités, à ce qu'on dit."],
            next: null
          }
        }
      }
    },
    {
      id: "informateur_solhazar",
      name: "Voyageuse épuisée",
      x: 10, y: 7, facing: "left",
      color: "#34495e", letter: "?",
      type: "utile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: [
              "J'ai croisé une colonne entière de ces gens en noir, plus au nord.",
              "Ils ne m'ont rien fait, mais leur allure n'annonçait rien de bon.",
              "Je crois qu'ils appellent leur cheffe... la Main Noire."
            ],
            effects: [{ setFlag: "heard_main_noire_hint5", value: true }],
            next: null
          }
        }
      }
    }
  ],

  town10: [
    {
      id: "badaud_zenithia",
      name: "Historien",
      x: 5, y: 6, facing: "down",
      color: "#7f8c8d", letter: "H",
      type: "inutile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: ["Zénithia n'existe que pour la Ligue.", "Chaque génération de Dresseurs y écrit son nom, ou l'oublie."],
            next: null
          }
        }
      }
    },
    {
      id: "informateur_zenithia",
      name: "Ancien Champion",
      x: 10, y: 7, facing: "left",
      color: "#34495e", letter: "?",
      type: "utile",
      dialogue: {
        start: "a",
        nodes: {
          a: {
            text: [
              "La Main Noire ? J'ai entendu ce nom, dans mon temps déjà.",
              "Si elle refait surface, ce n'est pas un badge de plus qui réglera le problème.",
              "Sois prêt à autre chose que des combats de Dresseurs, plus tard."
            ],
            effects: [{ setFlag: "heard_main_noire_hint6", value: true }],
            next: null
          }
        }
      }
    }
  ],

  league_hall: [
    {
      id: "elite1_toxine",
      name: "Toxine",
      x: 4, y: 16, facing: "down",
      color: "#7d3c98", letter: "T",
      type: "utile",
      dialogue: {
        start: [
          { condition: { flag: "all_badges_campaign1", equals: false }, node: "pas_pret" },
          { condition: { flag: "beat_elite1" }, node: "apres_defaite" }
        ],
        default: "avant_combat",
        nodes: {
          pas_pret: {
            text: ["Reviens quand tu auras rassemblé les 8 badges de cette région."],
            next: null
          },
          avant_combat: {
            text: [
              "Je suis Toxine, premier membre du Conseil des 4.",
              "Le poison ne pardonne pas la moindre erreur."
            ],
            effects: [{ startTrainerBattle: "elite1_toxine" }]
          },
          apres_defaite: {
            text: ["Le suivant t'attend plus haut."],
            next: null
          }
        }
      }
    },
    {
      id: "elite2_kojiro",
      name: "Kojiro",
      x: 4, y: 12, facing: "down",
      color: "#a04000", letter: "K",
      type: "utile",
      dialogue: {
        start: [
          { condition: { flag: "beat_elite1", equals: false }, node: "pas_pret" },
          { condition: { flag: "beat_elite2" }, node: "apres_defaite" }
        ],
        default: "avant_combat",
        nodes: {
          pas_pret: {
            text: ["Tu dois d'abord affronter Toxine."],
            next: null
          },
          avant_combat: {
            text: [
              "Je suis Kojiro, deuxième membre du Conseil.",
              "Le combat rapproché ne laisse aucune place au doute."
            ],
            effects: [{ startTrainerBattle: "elite2_kojiro" }]
          },
          apres_defaite: {
            text: ["Continue. Miroir t'attend."],
            next: null
          }
        }
      }
    },
    {
      id: "elite3_miroir",
      name: "Miroir",
      x: 4, y: 8, facing: "down",
      color: "#a569bd", letter: "M",
      type: "utile",
      dialogue: {
        start: [
          { condition: { flag: "beat_elite2", equals: false }, node: "pas_pret" },
          { condition: { flag: "beat_elite3" }, node: "apres_defaite" }
        ],
        default: "avant_combat",
        nodes: {
          pas_pret: {
            text: ["Tu dois d'abord affronter Kojiro."],
            next: null
          },
          avant_combat: {
            text: [
              "Je suis Miroir, troisième membre du Conseil.",
              "Voyons si ton esprit est aussi solide que ton équipe."
            ],
            effects: [{ startTrainerBattle: "elite3_miroir" }]
          },
          apres_defaite: {
            text: ["Drake se tient juste devant toi."],
            next: null
          }
        }
      }
    },
    {
      id: "elite4_drake",
      name: "Drake",
      x: 4, y: 4, facing: "down",
      color: "#1a5276", letter: "D",
      type: "utile",
      dialogue: {
        start: [
          { condition: { flag: "beat_elite3", equals: false }, node: "pas_pret" },
          { condition: { flag: "beat_elite4" }, node: "apres_defaite" }
        ],
        default: "avant_combat",
        nodes: {
          pas_pret: {
            text: ["Tu dois d'abord affronter Miroir."],
            next: null
          },
          avant_combat: {
            text: [
              "Je suis Drake, dernier membre du Conseil des 4.",
              "Après moi, il ne reste plus que le Champion."
            ],
            effects: [{ startTrainerBattle: "elite4_drake" }]
          },
          apres_defaite: {
            text: ["Le Champion t'attend. Bonne chance."],
            next: null
          }
        }
      }
    },
    {
      id: "league_champion",
      name: "Kian",
      x: 4, y: 2, facing: "down",
      color: "#e67e22", letter: "K",
      type: "utile",
      dialogue: {
        start: [
          { condition: { flag: "beat_elite4", equals: false }, node: "pas_pret" },
          { condition: { flag: "beat_champion1" }, node: "apres_defaite" }
        ],
        default: "avant_combat",
        nodes: {
          pas_pret: {
            text: ["Tu n'iras pas plus loin sans avoir battu tout le Conseil des 4."],
            next: null
          },
          avant_combat: {
            text: [
              "... Ça faisait longtemps.",
              "Je t'attendais ici. Le titre de Champion, ça ne se donne pas — ça se prend.",
              "Montre-moi ce que tu vaux, une bonne fois pour toutes !"
            ],
            effects: [{ startTrainerBattle: "league_champion" }]
          },
          apres_defaite: {
            text: ["...Tu l'as fait.", "Ce titre est à toi, maintenant. Prends-en soin."],
            next: null
          }
        }
      }
    }
  ]
};
