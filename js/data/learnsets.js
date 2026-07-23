// Mouvements réellement appris par niveau pour chaque Pokémon (Génération 1),
// à partir des movesets connus des jeux originaux, simplifiés au pool de
// capacités disponibles dans ce jeu. [niveau, capacité], triés croissants.
window.PKMN = window.PKMN || {};

PKMN.LEARNSETS = {
  1: [[1, "charge"], [1, "rugissement"], [7, "fouet_lianes"], [15, "poudre_toxik"], [25, "draine"], [33, "lance_soleil"]],
  2: [[1, "charge"], [1, "fouet_lianes"], [10, "draine"], [20, "poudre_toxik"], [30, "mega_sangsue"], [40, "lance_soleil"]],
  3: [[1, "charge"], [1, "fouet_lianes"], [1, "draine"], [10, "poudre_toxik"], [20, "mega_sangsue"], [32, "lance_soleil"]],

  4: [[1, "griffe"], [1, "rugissement"], [7, "flammeche"], [13, "vive_attaque"], [22, "lance_flammes"], [36, "deflagration"]],
  5: [[1, "griffe"], [1, "flammeche"], [13, "vive_attaque"], [22, "lance_flammes"], [36, "deflagration"]],
  6: [[1, "griffe"], [1, "flammeche"], [1, "cru_aile"], [13, "vive_attaque"], [22, "lance_flammes"], [36, "deflagration"], [46, "attak_air"]],

  7: [[1, "charge"], [1, "rugissement"], [8, "pistolet_a_o"], [16, "morsure"], [24, "bulles_d_o"], [36, "hydrocanon"]],
  8: [[1, "charge"], [1, "pistolet_a_o"], [10, "morsure"], [20, "bulles_d_o"], [30, "cascade"], [42, "hydrocanon"]],
  9: [[1, "charge"], [1, "pistolet_a_o"], [1, "morsure"], [10, "bulles_d_o"], [20, "cascade"], [32, "hydrocanon"], [44, "surf"]],

  10: [[1, "ligotage"], [5, "charge"]],
  11: [[1, "charge"]],
  12: [[1, "charge"], [1, "cyclone"], [10, "dard_pin"], [20, "psyko"], [30, "attak_air"]],

  13: [[1, "dard_venin"], [1, "ligotage"]],
  14: [[1, "dard_venin"]],
  15: [[1, "dard_venin"], [1, "cyclone"], [10, "megacorne"], [20, "dard_pin"]],

  16: [[1, "charge"], [1, "cyclone"], [9, "vive_attaque"], [18, "cru_aile"]],
  17: [[1, "charge"], [1, "cyclone"], [1, "vive_attaque"], [9, "cru_aile"], [25, "attak_air"]],
  18: [[1, "charge"], [1, "vive_attaque"], [1, "cru_aile"], [9, "attak_air"], [32, "pika_pika"]],

  19: [[1, "charge"], [1, "vive_attaque"], [7, "morsure"], [13, "amplification"], [16, "cognobscur"]],
  20: [[1, "charge"], [1, "vive_attaque"], [1, "morsure"], [1, "amplification"], [20, "cognobscur"], [32, "frappe_atlas"]],

  21: [[1, "charge"], [1, "cyclone"], [9, "vive_attaque"], [19, "cru_aile"]],
  22: [[1, "charge"], [1, "cyclone"], [1, "vive_attaque"], [9, "cru_aile"], [25, "pika_pika"]],

  23: [[1, "dard_venin"], [1, "rugissement"], [10, "morsure"], [20, "sombre_toxine"]],
  24: [[1, "dard_venin"], [1, "morsure"], [10, "sombre_toxine"], [24, "ecrasface"]],

  25: [[1, "charge"], [1, "vive_attaque"], [1, "cage_eclair"], [10, "tonnelectrik"], [26, "eclair"], [36, "tonnerre"]],
  26: [[1, "charge"], [1, "vive_attaque"], [1, "tonnelectrik"], [10, "eclair"], [26, "tonnerre"]],

  27: [[1, "charge"], [1, "griffe"], [10, "seisme"], [20, "ball_seisme"]],
  28: [[1, "charge"], [1, "griffe"], [1, "seisme"], [20, "ball_seisme"], [32, "eboulement"]],

  29: [[1, "charge"], [1, "dard_venin"], [10, "morsure"], [20, "sombre_toxine"]],
  30: [[1, "charge"], [1, "dard_venin"], [1, "morsure"], [16, "sombre_toxine"], [30, "ecrasface"]],
  31: [[1, "charge"], [1, "dard_venin"], [1, "morsure"], [16, "seisme"], [30, "sombre_toxine"], [40, "ball_seisme"]],

  32: [[1, "charge"], [1, "dard_venin"], [10, "morsure"], [20, "sombre_toxine"]],
  33: [[1, "charge"], [1, "dard_venin"], [1, "morsure"], [16, "sombre_toxine"], [30, "ecrasface"]],
  34: [[1, "charge"], [1, "dard_venin"], [1, "morsure"], [16, "seisme"], [30, "sombre_toxine"], [40, "ball_seisme"]],

  35: [[1, "charge"], [1, "rugissement"], [10, "cognobscur"], [20, "repos"]],
  36: [[1, "charge"], [1, "cognobscur"], [10, "repos"], [24, "frappe_atlas"]],

  37: [[1, "griffe"], [1, "rugissement"], [9, "flammeche"], [20, "tourbillon_feu"], [30, "lance_flammes"]],
  38: [[1, "griffe"], [1, "flammeche"], [9, "tourbillon_feu"], [24, "lance_flammes"], [40, "deflagration"]],

  39: [[1, "charge"], [1, "repos"], [10, "mimi_queue"], [20, "cognobscur"]],
  40: [[1, "charge"], [1, "repos"], [1, "mimi_queue"], [20, "cognobscur"], [30, "frappe_atlas"]],

  41: [[1, "cyclone"], [1, "dard_venin"], [10, "morsure"], [20, "sombre_toxine"]],
  42: [[1, "cyclone"], [1, "dard_venin"], [1, "morsure"], [10, "attak_air"], [24, "sombre_toxine"]],

  43: [[1, "charge"], [1, "poudre_toxik"], [5, "poudre_dodo"], [8, "fouet_lianes"], [16, "draine"]],
  44: [[1, "charge"], [1, "fouet_lianes"], [1, "poudre_toxik"], [1, "poudre_dodo"], [16, "draine"], [28, "mega_sangsue"]],
  45: [[1, "charge"], [1, "fouet_lianes"], [1, "poudre_dodo"], [1, "poudre_toxik"], [16, "mega_sangsue"], [28, "lance_soleil"], [40, "sombre_toxine"]],

  46: [[1, "ligotage"], [1, "charge"], [7, "poudre_dodo"], [10, "poudre_toxik"], [20, "mega_sangsue"]],
  47: [[1, "ligotage"], [1, "charge"], [1, "poudre_dodo"], [1, "poudre_toxik"], [20, "mega_sangsue"], [32, "megacorne"]],

  48: [[1, "ligotage"], [1, "dard_venin"], [10, "psyko"], [20, "megacorne"]],
  49: [[1, "ligotage"], [1, "dard_venin"], [1, "psyko"], [20, "megacorne"], [30, "choc_mental"]],

  50: [[1, "griffe"], [1, "charge"], [10, "seisme"], [20, "ball_seisme"]],
  51: [[1, "griffe"], [1, "seisme"], [1, "charge"], [20, "ball_seisme"], [31, "eboulement"]],

  52: [[1, "griffe"], [1, "rugissement"], [10, "vive_attaque"], [20, "cognobscur"]],
  53: [[1, "griffe"], [1, "vive_attaque"], [10, "cognobscur"], [28, "frappe_atlas"]],

  54: [[1, "charge"], [1, "rugissement"], [10, "pistolet_a_o"], [20, "choc_mental"], [33, "bulles_d_o"]],
  55: [[1, "charge"], [1, "pistolet_a_o"], [10, "choc_mental"], [20, "bulles_d_o"], [33, "hydrocanon"]],

  56: [[1, "griffe"], [1, "rugissement"], [9, "poing_karate"], [20, "double_pied"]],
  57: [[1, "griffe"], [1, "poing_karate"], [1, "double_pied"], [20, "frappe_atlas"], [30, "cognobscur"]],

  58: [[1, "griffe"], [1, "rugissement"], [10, "flammeche"], [20, "morsure"], [30, "tourbillon_feu"]],
  59: [[1, "griffe"], [1, "flammeche"], [1, "morsure"], [24, "tourbillon_feu"], [40, "deflagration"]],

  60: [[1, "charge"], [1, "rugissement"], [8, "pistolet_a_o"], [16, "double_pied"]],
  61: [[1, "charge"], [1, "pistolet_a_o"], [1, "double_pied"], [20, "bulles_d_o"], [31, "poing_karate"]],
  62: [[1, "charge"], [1, "pistolet_a_o"], [1, "double_pied"], [1, "poing_karate"], [20, "bulles_d_o"], [36, "hydrocanon"]],

  63: [[1, "choc_mental"], [8, "regard_confus"]],
  64: [[1, "choc_mental"], [1, "regard_confus"], [1, "lueur"], [16, "psyko"], [30, "repos"]],
  65: [[1, "choc_mental"], [1, "regard_confus"], [1, "lueur"], [1, "psyko"], [30, "repos"], [40, "ultralaser"]],

  66: [[1, "griffe"], [1, "rugissement"], [10, "poing_karate"], [20, "double_pied"]],
  67: [[1, "griffe"], [1, "poing_karate"], [1, "double_pied"], [20, "frappe_atlas"], [34, "cognobscur"]],
  68: [[1, "griffe"], [1, "poing_karate"], [1, "double_pied"], [1, "frappe_atlas"], [34, "ecrasface"], [46, "ultralaser"]],

  69: [[1, "charge"], [1, "poudre_toxik"], [8, "fouet_lianes"]],
  70: [[1, "charge"], [1, "fouet_lianes"], [1, "poudre_toxik"], [18, "draine"], [30, "mega_sangsue"]],
  71: [[1, "charge"], [1, "fouet_lianes"], [1, "poudre_toxik"], [18, "mega_sangsue"], [30, "lance_soleil"], [42, "sombre_toxine"]],

  72: [[1, "dard_venin"], [1, "pistolet_a_o"], [10, "sombre_toxine"], [20, "bulles_d_o"]],
  73: [[1, "dard_venin"], [1, "pistolet_a_o"], [1, "sombre_toxine"], [20, "bulles_d_o"], [32, "hydrocanon"]],

  74: [[1, "charge"], [1, "jet_pierres"], [11, "seisme"], [21, "eboulement"]],
  75: [[1, "charge"], [1, "jet_pierres"], [1, "seisme"], [21, "eboulement"], [36, "ball_seisme"]],
  76: [[1, "charge"], [1, "jet_pierres"], [1, "seisme"], [1, "eboulement"], [36, "ball_seisme"], [46, "tete_de_fer"]],

  77: [[1, "griffe"], [1, "rugissement"], [10, "flammeche"], [24, "tourbillon_feu"]],
  78: [[1, "griffe"], [1, "flammeche"], [1, "tourbillon_feu"], [30, "lance_flammes"], [45, "deflagration"]],

  79: [[1, "charge"], [1, "rugissement"], [16, "choc_mental"], [28, "pistolet_a_o"]],
  80: [[1, "charge"], [1, "choc_mental"], [1, "pistolet_a_o"], [28, "psyko"], [42, "bulles_d_o"]],

  81: [[1, "boul_armure"], [1, "tonnelectrik"], [15, "cage_eclair"], [25, "eclair"]],
  82: [[1, "boul_armure"], [1, "tonnelectrik"], [1, "eclair"], [25, "tete_de_fer"], [35, "tonnerre"]],

  83: [[1, "charge"], [1, "cyclone"], [15, "cognobscur"], [25, "attak_air"]],

  84: [[1, "charge"], [1, "vive_attaque"], [9, "cyclone"], [19, "cognobscur"]],
  85: [[1, "charge"], [1, "vive_attaque"], [1, "cyclone"], [19, "cognobscur"], [32, "frappe_atlas"]],

  86: [[1, "charge"], [1, "rugissement"], [10, "poudreuse"], [20, "pistolet_a_o"]],
  87: [[1, "charge"], [1, "poudreuse"], [1, "pistolet_a_o"], [20, "huile_glacee"], [34, "bulles_d_o"]],

  88: [[1, "charge"], [1, "rugissement"], [10, "sombre_toxine"], [20, "morsure"]],
  89: [[1, "charge"], [1, "sombre_toxine"], [1, "morsure"], [20, "ecrasface"], [38, "frappe_atlas"]],

  90: [[1, "charge"], [1, "pistolet_a_o"], [15, "bulles_d_o"], [25, "cascade"]],
  91: [[1, "charge"], [1, "pistolet_a_o"], [1, "poudreuse"], [25, "bulles_d_o"], [35, "huile_glacee"], [45, "hydrocanon"]],

  92: [[1, "dard_venin"], [1, "moukill"]],
  93: [[1, "dard_venin"], [1, "moukill"], [1, "ball_ombre"], [25, "sombre_toxine"]],
  94: [[1, "dard_venin"], [1, "moukill"], [1, "ball_ombre"], [1, "sombre_toxine"], [38, "psyko"]],

  95: [[1, "charge"], [1, "jet_pierres"], [15, "seisme"], [28, "eboulement"]],

  96: [[1, "charge"], [1, "rugissement"], [6, "regard_confus"], [10, "choc_mental"], [24, "psyko"]],
  97: [[1, "charge"], [1, "choc_mental"], [1, "regard_confus"], [1, "psyko"], [24, "lueur"], [38, "repos"]],

  98: [[1, "charge"], [1, "griffe"], [10, "pistolet_a_o"], [20, "bulles_d_o"]],
  99: [[1, "charge"], [1, "griffe"], [1, "pistolet_a_o"], [20, "bulles_d_o"], [32, "hydrocanon"]],

  100: [[1, "charge"], [1, "tonnelectrik"], [15, "cage_eclair"], [25, "eclair"]],
  101: [[1, "charge"], [1, "tonnelectrik"], [1, "eclair"], [25, "tonnerre"]],

  102: [[1, "charge"], [1, "choc_mental"], [15, "lance_soleil"], [25, "psyko"]],
  103: [[1, "charge"], [1, "choc_mental"], [1, "psyko"], [25, "lance_soleil"], [38, "ultralaser"]],

  104: [[1, "charge"], [1, "griffe"], [10, "seisme"], [22, "eboulement"]],
  105: [[1, "charge"], [1, "griffe"], [1, "seisme"], [22, "eboulement"], [36, "frappe_atlas"]],

  106: [[1, "poing_karate"], [1, "double_pied"], [20, "frappe_atlas"]],
  107: [[1, "poing_karate"], [1, "double_pied"], [20, "cognobscur"]],

  108: [[1, "charge"], [1, "rugissement"], [15, "cognobscur"], [28, "repos"]],

  109: [[1, "dard_venin"], [1, "voile_fumee"], [18, "ecrasface"], [28, "frappe_atlas"]],
  110: [[1, "dard_venin"], [1, "voile_fumee"], [1, "ecrasface"], [28, "frappe_atlas"], [40, "ultralaser"]],

  111: [[1, "charge"], [1, "jet_pierres"], [15, "seisme"], [30, "eboulement"]],
  112: [[1, "charge"], [1, "jet_pierres"], [1, "seisme"], [1, "eboulement"], [30, "ball_seisme"], [42, "frappe_atlas"]],

  113: [[1, "charge"], [1, "repos"], [15, "cognobscur"], [28, "lueur"]],

  114: [[1, "fouet_lianes"], [1, "ligotage"], [18, "mega_sangsue"], [30, "lance_soleil"]],

  115: [[1, "charge"], [1, "griffe"], [15, "cognobscur"], [28, "frappe_atlas"]],

  116: [[1, "charge"], [1, "pistolet_a_o"], [19, "bulles_d_o"]],
  117: [[1, "charge"], [1, "pistolet_a_o"], [1, "bulles_d_o"], [32, "cascade"], [42, "hydrocanon"]],

  118: [[1, "charge"], [1, "griffe"], [19, "bulles_d_o"]],
  119: [[1, "charge"], [1, "griffe"], [1, "bulles_d_o"], [33, "cascade"], [43, "hydrocanon"]],

  120: [[1, "charge"], [1, "pistolet_a_o"], [20, "bulles_d_o"]],
  121: [[1, "charge"], [1, "pistolet_a_o"], [1, "choc_mental"], [20, "bulles_d_o"], [32, "psyko"], [42, "hydrocanon"]],

  122: [[1, "choc_mental"], [1, "lueur"], [20, "psyko"], [32, "repos"]],

  123: [[1, "griffe"], [1, "cyclone"], [20, "dard_pin"], [30, "attak_air"]],

  124: [[1, "choc_mental"], [1, "poudreuse"], [20, "huile_glacee"], [32, "psyko"]],

  125: [[1, "griffe"], [1, "tonnelectrik"], [20, "eclair"], [32, "tonnerre"]],

  126: [[1, "griffe"], [1, "flammeche"], [20, "tourbillon_feu"], [32, "lance_flammes"]],

  127: [[1, "griffe"], [1, "ligotage"], [20, "megacorne"], [30, "frappe_atlas"]],

  128: [[1, "charge"], [1, "griffe"], [20, "cognobscur"], [30, "frappe_atlas"]],

  129: [[1, "charge"]],
  130: [[1, "charge"], [1, "morsure"], [1, "cru_aile"], [20, "bulles_d_o"], [32, "hydrocanon"], [42, "attak_air"]],

  131: [[1, "charge"], [1, "pistolet_a_o"], [1, "poudreuse"], [20, "bulles_d_o"], [32, "huile_glacee"], [42, "hydrocanon"]],

  132: [[1, "charge"], [1, "repos"]],

  133: [[1, "charge"], [1, "mimi_queue"], [16, "morsure"], [28, "frappe_atlas"]],
  134: [[1, "charge"], [1, "morsure"], [1, "pistolet_a_o"], [28, "bulles_d_o"], [40, "hydrocanon"]],
  135: [[1, "charge"], [1, "morsure"], [1, "tonnelectrik"], [28, "eclair"], [40, "tonnerre"]],
  136: [[1, "charge"], [1, "morsure"], [1, "flammeche"], [28, "tourbillon_feu"], [40, "deflagration"]],

  137: [[1, "charge"], [1, "choc_mental"], [20, "tonnelectrik"], [32, "repos"]],

  138: [[1, "charge"], [1, "pistolet_a_o"], [20, "jet_pierres"], [32, "bulles_d_o"]],
  139: [[1, "charge"], [1, "pistolet_a_o"], [1, "jet_pierres"], [20, "eboulement"], [32, "hydrocanon"]],

  140: [[1, "charge"], [1, "pistolet_a_o"], [20, "jet_pierres"], [32, "bulles_d_o"]],
  141: [[1, "charge"], [1, "pistolet_a_o"], [1, "jet_pierres"], [20, "eboulement"], [32, "cascade"]],

  142: [[1, "griffe"], [1, "cyclone"], [1, "jet_pierres"], [24, "eboulement"], [36, "attak_air"]],

  143: [[1, "charge"], [1, "repos"], [20, "cognobscur"], [32, "frappe_atlas"]],

  144: [[1, "poudreuse"], [1, "cyclone"], [1, "huile_glacee"], [30, "attak_air"]],
  145: [[1, "tonnelectrik"], [1, "cyclone"], [1, "eclair"], [30, "tonnerre"]],
  146: [[1, "flammeche"], [1, "cyclone"], [1, "tourbillon_feu"], [30, "deflagration"]],

  147: [[1, "charge"], [1, "rage_dragon"], [20, "draco_rage"]],
  148: [[1, "charge"], [1, "rage_dragon"], [1, "draco_rage"]],
  149: [[1, "charge"], [1, "rage_dragon"], [1, "draco_rage"], [1, "cru_aile"], [45, "attak_air"]],

  150: [[1, "choc_mental"], [1, "lueur"], [1, "psyko"], [50, "ultralaser"]],
  151: [[1, "charge"], [1, "choc_mental"], [1, "psyko"], [1, "lueur"]],

  152: [[1, "charge"], [1, "fouet_lianes"], [10, "draine"], [11, "mega_sangsue"], [13, "lance_soleil"]], // Germignon
  153: [[1, "charge"], [1, "fouet_lianes"], [14, "draine"], [19, "mega_sangsue"], [25, "lance_soleil"]], // Macronium
  154: [[1, "charge"], [1, "fouet_lianes"], [18, "draine"], [27, "mega_sangsue"], [37, "lance_soleil"]], // Méganium
  155: [[1, "charge"], [1, "flammeche"], [9, "tourbillon_feu"], [10, "lance_flammes"], [11, "deflagration"]], // Héricendre
  156: [[1, "charge"], [1, "flammeche"], [15, "tourbillon_feu"], [21, "lance_flammes"], [28, "deflagration"]], // Feurisson
  157: [[1, "charge"], [1, "flammeche"], [18, "tourbillon_feu"], [27, "lance_flammes"], [37, "deflagration"]], // Typhlosion
  158: [[1, "charge"], [1, "pistolet_a_o"], [10, "bulles_d_o"], [12, "cascade"], [14, "hydrocanon"]], // Kaiminus
  159: [[1, "charge"], [1, "pistolet_a_o"], [13, "bulles_d_o"], [18, "cascade"], [23, "hydrocanon"]], // Crocrodil
  160: [[1, "charge"], [1, "pistolet_a_o"], [18, "bulles_d_o"], [27, "cascade"], [37, "hydrocanon"]], // Aligatueur
  161: [[1, "charge"], [1, "vive_attaque"], [10, "ecrasface"], [11, "cognobscur"]], // Fouinette
  162: [[1, "charge"], [1, "vive_attaque"], [19, "ecrasface"], [29, "cognobscur"]], // Fouinar
  163: [[1, "charge"], [1, "vive_attaque"], [1, "cyclone"], [10, "ecrasface"], [11, "cognobscur"], [13, "cru_aile"], [15, "attak_air"], [16, "pika_pika"]], // Hoothoot
  164: [[1, "charge"], [1, "vive_attaque"], [1, "cyclone"], [13, "ecrasface"], [19, "cognobscur"], [24, "cru_aile"], [29, "attak_air"], [35, "pika_pika"]], // Noarfang
  165: [[1, "charge"], [1, "ligotage"], [1, "cyclone"], [9, "dard_pin"], [11, "megacorne"], [12, "cru_aile"], [13, "attak_air"], [15, "pika_pika"]], // Coxy
  166: [[1, "charge"], [1, "ligotage"], [1, "cyclone"], [13, "dard_pin"], [19, "megacorne"], [24, "cru_aile"], [29, "attak_air"], [35, "pika_pika"]], // Coxyclaque
  167: [[1, "charge"], [1, "ligotage"], [1, "dard_venin"], [10, "dard_pin"], [13, "megacorne"], [15, "poudre_toxik"], [18, "sombre_toxine"]], // Mimigal
  168: [[1, "charge"], [1, "ligotage"], [1, "dard_venin"], [14, "dard_pin"], [21, "megacorne"], [27, "poudre_toxik"], [34, "sombre_toxine"]], // Migalos
  169: [[1, "charge"], [1, "dard_venin"], [1, "cyclone"], [14, "poudre_toxik"], [21, "sombre_toxine"], [27, "cru_aile"], [33, "attak_air"], [40, "pika_pika"]], // Nostenfer
  170: [[1, "charge"], [1, "pistolet_a_o"], [1, "tonnelectrik"], [10, "bulles_d_o"], [13, "cascade"], [15, "hydrocanon"], [18, "cage_eclair"], [20, "eclair"], [23, "tonnerre"]], // Loupio
  171: [[1, "charge"], [1, "pistolet_a_o"], [1, "tonnelectrik"], [13, "bulles_d_o"], [17, "cascade"], [22, "hydrocanon"], [26, "cage_eclair"], [31, "eclair"], [35, "tonnerre"]], // Lanturn
  172: [[1, "charge"], [1, "tonnelectrik"], [14, "cage_eclair"], [20, "eclair"], [26, "tonnerre"]], // Pichu
  173: [[1, "charge"], [1, "vive_attaque"], [16, "ecrasface"], [24, "cognobscur"]], // Mélo
  174: [[1, "charge"], [1, "vive_attaque"], [16, "ecrasface"], [24, "cognobscur"]], // Toudoudou
  175: [[1, "charge"], [1, "vive_attaque"], [13, "ecrasface"], [18, "cognobscur"]], // Togepi
  176: [[1, "charge"], [1, "vive_attaque"], [1, "cyclone"], [13, "ecrasface"], [19, "cognobscur"], [24, "cru_aile"], [29, "attak_air"], [35, "pika_pika"]], // Togetic
  177: [[1, "charge"], [1, "choc_mental"], [1, "cyclone"], [10, "regard_confus"], [12, "psyko"], [14, "ultralaser"], [17, "cru_aile"], [19, "attak_air"], [21, "pika_pika"]], // Natu
  178: [[1, "charge"], [1, "choc_mental"], [1, "cyclone"], [13, "regard_confus"], [17, "psyko"], [22, "ultralaser"], [26, "cru_aile"], [31, "attak_air"], [35, "pika_pika"]], // Xatu
  179: [[1, "charge"], [1, "tonnelectrik"], [9, "cage_eclair"], [11, "eclair"], [12, "tonnerre"]], // Wattouat
  180: [[1, "charge"], [1, "tonnelectrik"], [13, "cage_eclair"], [18, "eclair"], [23, "tonnerre"]], // Lainergie
  181: [[1, "charge"], [1, "tonnelectrik"], [18, "cage_eclair"], [27, "eclair"], [37, "tonnerre"]], // Pharamp
  182: [[1, "charge"], [1, "fouet_lianes"], [16, "draine"], [24, "mega_sangsue"], [32, "lance_soleil"]], // Joliflor
  183: [[1, "charge"], [1, "pistolet_a_o"], [10, "bulles_d_o"], [12, "cascade"], [14, "hydrocanon"]], // Marill
  184: [[1, "charge"], [1, "pistolet_a_o"], [18, "bulles_d_o"], [27, "cascade"], [37, "hydrocanon"]], // Azumarill
  185: [[1, "charge"], [1, "jet_pierres"], [24, "eboulement"]], // Simularbre
  186: [[1, "charge"], [1, "pistolet_a_o"], [16, "bulles_d_o"], [24, "cascade"], [32, "hydrocanon"]], // Tarpaud
  187: [[1, "charge"], [1, "fouet_lianes"], [1, "cyclone"], [9, "draine"], [10, "mega_sangsue"], [11, "lance_soleil"], [13, "cru_aile"], [14, "attak_air"], [15, "pika_pika"]], // Granivol
  188: [[1, "charge"], [1, "fouet_lianes"], [1, "cyclone"], [10, "draine"], [13, "mega_sangsue"], [15, "lance_soleil"], [18, "cru_aile"], [20, "attak_air"], [23, "pika_pika"]], // Floravol
  189: [[1, "charge"], [1, "fouet_lianes"], [1, "cyclone"], [13, "draine"], [19, "mega_sangsue"], [24, "lance_soleil"], [30, "cru_aile"], [35, "attak_air"], [41, "pika_pika"]], // Cotovol
  190: [[1, "charge"], [1, "vive_attaque"], [16, "ecrasface"], [24, "cognobscur"]], // Capumain
  191: [[1, "charge"], [1, "fouet_lianes"], [7, "mega_sangsue"], [7, "lance_soleil"], [8, "draine"]], // Tournegrin
  192: [[1, "charge"], [1, "fouet_lianes"], [16, "draine"], [24, "mega_sangsue"], [32, "lance_soleil"]], // Héliatronc
  193: [[1, "charge"], [1, "ligotage"], [1, "cyclone"], [12, "dard_pin"], [16, "megacorne"], [20, "cru_aile"], [24, "attak_air"], [28, "pika_pika"]], // Yanma
  194: [[1, "charge"], [1, "pistolet_a_o"], [1, "seisme"], [10, "bulles_d_o"], [11, "cascade"], [13, "hydrocanon"], [15, "ball_seisme"], [16, "eboulement"]], // Axoloto
  195: [[1, "charge"], [1, "pistolet_a_o"], [1, "seisme"], [13, "bulles_d_o"], [19, "cascade"], [24, "hydrocanon"], [29, "ball_seisme"], [35, "eboulement"]], // Maraiste
  196: [[1, "charge"], [1, "choc_mental"], [16, "regard_confus"], [24, "psyko"], [32, "ultralaser"]], // Mentali
  197: [[1, "charge"], [1, "morsure"], [19, "crocs_ultimes"], [29, "eclats_noirs"]], // Noctali
  198: [[1, "charge"], [1, "morsure"], [1, "cyclone"], [12, "crocs_ultimes"], [16, "eclats_noirs"], [20, "cru_aile"], [24, "attak_air"], [28, "pika_pika"]], // Cornèbre
  199: [[1, "charge"], [1, "pistolet_a_o"], [1, "choc_mental"], [13, "bulles_d_o"], [17, "cascade"], [22, "hydrocanon"], [26, "regard_confus"], [31, "psyko"], [35, "ultralaser"]], // Roigada
  200: [[1, "charge"], [1, "moukill"], [20, "ball_ombre"]], // Feuforêve
  201: [[1, "charge"], [1, "choc_mental"], [14, "regard_confus"], [20, "psyko"], [26, "ultralaser"]], // Zarbi
  202: [[1, "charge"], [1, "choc_mental"], [16, "regard_confus"], [24, "psyko"], [32, "ultralaser"]], // Qulbutoké
  203: [[1, "charge"], [1, "vive_attaque"], [1, "choc_mental"], [12, "ecrasface"], [16, "cognobscur"], [20, "regard_confus"], [24, "psyko"], [28, "ultralaser"]], // Girafarig
  204: [[1, "charge"], [1, "ligotage"], [15, "dard_pin"], [22, "megacorne"]], // Pomdepik
  205: [[1, "charge"], [1, "ligotage"], [1, "boul_armure"], [14, "dard_pin"], [21, "megacorne"], [27, "griffe_acier"], [34, "tete_de_fer"]], // Foretress
  206: [[1, "charge"], [1, "vive_attaque"], [16, "ecrasface"], [24, "cognobscur"]], // Insolourdo
  207: [[1, "charge"], [1, "seisme"], [1, "cyclone"], [12, "ball_seisme"], [16, "eboulement"], [20, "cru_aile"], [24, "attak_air"], [28, "pika_pika"]], // Scorplane
  208: [[1, "charge"], [1, "boul_armure"], [1, "seisme"], [16, "griffe_acier"], [23, "tete_de_fer"], [31, "ball_seisme"], [38, "eboulement"]], // Steelix
  209: [[1, "charge"], [1, "vive_attaque"], [12, "ecrasface"], [17, "cognobscur"]], // Snubbull
  210: [[1, "charge"], [1, "vive_attaque"], [19, "ecrasface"], [29, "cognobscur"]], // Granbull
  211: [[1, "charge"], [1, "pistolet_a_o"], [1, "dard_venin"], [12, "bulles_d_o"], [16, "cascade"], [20, "hydrocanon"], [24, "poudre_toxik"], [28, "sombre_toxine"]], // Qwilfish
  212: [[1, "charge"], [1, "ligotage"], [1, "boul_armure"], [16, "dard_pin"], [23, "megacorne"], [31, "griffe_acier"], [38, "tete_de_fer"]], // Cizayox
  213: [[1, "charge"], [1, "ligotage"], [1, "jet_pierres"], [14, "dard_pin"], [20, "megacorne"], [26, "eboulement"]], // Caratroc
  214: [[1, "charge"], [1, "ligotage"], [1, "poing_karate"], [13, "dard_pin"], [18, "megacorne"], [22, "double_pied"], [27, "corps_a_corps"]], // Scarhino
  215: [[1, "charge"], [1, "morsure"], [1, "poudreuse"], [14, "crocs_ultimes"], [20, "eclats_noirs"], [26, "huile_glacee"]], // Farfuret
  216: [[1, "charge"], [1, "vive_attaque"], [15, "ecrasface"], [21, "cognobscur"]], // Teddiursa
  217: [[1, "charge"], [1, "vive_attaque"], [19, "ecrasface"], [29, "cognobscur"]], // Ursaring
  218: [[1, "charge"], [1, "flammeche"], [15, "tourbillon_feu"], [22, "lance_flammes"], [29, "deflagration"]], // Limagma
  219: [[1, "charge"], [1, "flammeche"], [1, "jet_pierres"], [14, "tourbillon_feu"], [21, "lance_flammes"], [27, "deflagration"], [34, "eboulement"]], // Volcaropod
  220: [[1, "charge"], [1, "poudreuse"], [1, "seisme"], [14, "huile_glacee"], [20, "ball_seisme"], [25, "eboulement"]], // Marcacrin
  221: [[1, "charge"], [1, "poudreuse"], [1, "seisme"], [16, "huile_glacee"], [24, "ball_seisme"], [32, "eboulement"]], // Cochignon
  222: [[1, "charge"], [1, "pistolet_a_o"], [1, "jet_pierres"], [13, "bulles_d_o"], [18, "cascade"], [22, "hydrocanon"], [27, "eboulement"]], // Corayon
  223: [[1, "charge"], [1, "pistolet_a_o"], [12, "bulles_d_o"], [16, "cascade"], [19, "hydrocanon"]], // Rémoraid
  224: [[1, "charge"], [1, "pistolet_a_o"], [16, "bulles_d_o"], [24, "cascade"], [32, "hydrocanon"]], // Octillery
  225: [[1, "charge"], [1, "poudreuse"], [1, "cyclone"], [13, "huile_glacee"], [18, "cru_aile"], [22, "attak_air"], [27, "pika_pika"]], // Cadoizo
  226: [[1, "charge"], [1, "pistolet_a_o"], [1, "cyclone"], [13, "bulles_d_o"], [17, "cascade"], [22, "hydrocanon"], [26, "cru_aile"], [31, "attak_air"], [35, "pika_pika"]], // Démanta
  227: [[1, "charge"], [1, "boul_armure"], [1, "cyclone"], [12, "griffe_acier"], [16, "tete_de_fer"], [20, "cru_aile"], [24, "attak_air"], [28, "pika_pika"]], // Airmure
  228: [[1, "charge"], [1, "morsure"], [1, "flammeche"], [10, "crocs_ultimes"], [13, "eclats_noirs"], [15, "tourbillon_feu"], [17, "lance_flammes"], [20, "deflagration"]], // Malosse
  229: [[1, "charge"], [1, "morsure"], [1, "flammeche"], [13, "crocs_ultimes"], [19, "eclats_noirs"], [24, "tourbillon_feu"], [29, "lance_flammes"], [35, "deflagration"]], // Démolosse
  230: [[1, "charge"], [1, "pistolet_a_o"], [1, "rage_dragon"], [14, "bulles_d_o"], [21, "cascade"], [27, "hydrocanon"], [33, "dracochoc"], [40, "draco_rage"]], // Hyporoi
  231: [[1, "charge"], [1, "seisme"], [13, "ball_seisme"], [18, "eboulement"]], // Phanpy
  232: [[1, "charge"], [1, "seisme"], [19, "ball_seisme"], [29, "eboulement"]], // Donphan
  233: [[1, "charge"], [1, "vive_attaque"], [21, "ecrasface"], [33, "cognobscur"]], // Porygon2
  234: [[1, "charge"], [1, "vive_attaque"], [16, "ecrasface"], [24, "cognobscur"]], // Cerfrousse
  235: [[1, "charge"], [1, "vive_attaque"], [16, "ecrasface"], [24, "cognobscur"]], // Queulorior
  236: [[1, "charge"], [1, "poing_karate"], [11, "double_pied"], [15, "corps_a_corps"]], // Debugant
  237: [[1, "charge"], [1, "poing_karate"], [19, "double_pied"], [29, "corps_a_corps"]], // Kapoera
  238: [[1, "charge"], [1, "poudreuse"], [1, "choc_mental"], [12, "huile_glacee"], [16, "regard_confus"], [20, "psyko"], [24, "ultralaser"]], // Lippouti
  239: [[1, "charge"], [1, "tonnelectrik"], [13, "cage_eclair"], [18, "eclair"], [23, "tonnerre"]], // Élekid
  240: [[1, "charge"], [1, "flammeche"], [13, "tourbillon_feu"], [18, "lance_flammes"], [23, "deflagration"]], // Magby
  241: [[1, "charge"], [1, "vive_attaque"], [16, "ecrasface"], [24, "cognobscur"]], // Écrémeuh
  242: [[1, "charge"], [1, "vive_attaque"], [21, "ecrasface"], [33, "cognobscur"]], // Leuphorie
  243: [[1, "charge"], [1, "tonnelectrik"], [19, "cage_eclair"], [29, "eclair"], [40, "tonnerre"]], // Raikou
  244: [[1, "charge"], [1, "flammeche"], [19, "tourbillon_feu"], [29, "lance_flammes"], [40, "deflagration"]], // Entei
  245: [[1, "charge"], [1, "pistolet_a_o"], [19, "bulles_d_o"], [29, "cascade"], [40, "hydrocanon"]], // Suicune
  246: [[1, "charge"], [1, "jet_pierres"], [1, "seisme"], [13, "eboulement"], [18, "ball_seisme"]], // Embrylex
  247: [[1, "charge"], [1, "jet_pierres"], [1, "seisme"], [19, "eboulement"], [31, "ball_seisme"]], // Ymphect
  248: [[1, "charge"], [1, "jet_pierres"], [1, "morsure"], [18, "eboulement"], [27, "crocs_ultimes"], [37, "eclats_noirs"]], // Tyranocif
  249: [[1, "charge"], [1, "choc_mental"], [1, "cyclone"], [14, "regard_confus"], [20, "psyko"], [26, "ultralaser"], [32, "cru_aile"], [38, "attak_air"], [44, "pika_pika"]], // Lugia
  250: [[1, "charge"], [1, "flammeche"], [1, "cyclone"], [14, "tourbillon_feu"], [20, "lance_flammes"], [26, "deflagration"], [32, "cru_aile"], [38, "attak_air"], [44, "pika_pika"]], // Ho-Oh
  251: [[1, "charge"], [1, "choc_mental"], [1, "fouet_lianes"], [14, "regard_confus"], [20, "psyko"], [26, "ultralaser"], [32, "draine"], [38, "mega_sangsue"], [44, "lance_soleil"]], // Celebi
};

PKMN.movesAtLevel = function (speciesId, level) {
  const learnset = PKMN.LEARNSETS[speciesId] || [];
  const known = learnset.filter((entry) => entry[0] <= level).map((entry) => entry[1]);
  const unique = [...new Set(known)];
  return unique.slice(-4);
};
