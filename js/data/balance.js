// Constantes d'équilibrage du jeu, regroupées ici pour pouvoir retoucher la
// difficulté/progression sans devoir chasser des nombres isolés dans le
// moteur de combat ou la gestion d'équipe.
window.PKMN = window.PKMN || {};

PKMN.BALANCE = {
  // --- Dégâts / combat ---
  CRIT_CHANCE_NORMAL: 1 / 16,
  CRIT_CHANCE_HIGH: 1 / 8,      // capacités "highCrit"
  CRIT_DAMAGE_MULTIPLIER: 1.5,
  STAB_MULTIPLIER: 1.5,          // bonus Same Type Attack Bonus
  DAMAGE_RANDOM_MIN: 0.85,       // facteur aléatoire final: MIN + random()*SPAN
  DAMAGE_RANDOM_SPAN: 0.15,
  BURN_ATK_MULTIPLIER: 0.5,      // attaque physique divisée par 2 si brûlé
  ABILITY_LOW_HP_THRESHOLD: 1 / 3,   // Brasier/Torrent/Engrais: sous ce ratio de PV max
  ABILITY_LOW_HP_MULTIPLIER: 1.5,
  ABNEGATION_MULTIPLIER: 1.5,    // Abnégation: bonus d'attaque si sous statut

  // --- Statuts ---
  POISON_FRACTION: 1 / 8,        // dégâts de poison classique = maxHp / 8 par tour
  BURN_FRACTION: 1 / 16,
  TOXIC_FRACTION_DIVISOR: 16,    // dégâts de toxic = maxHp * compteur / 16 (croissant)
  PARALYSIS_FULL_CHANCE: 0.25,   // chance d'être totalement paralysé ce tour
  PARALYSIS_SPEED_MULTIPLIER: 0.5,
  FREEZE_THAW_CHANCE: 0.2,       // chance de dégeler à chaque tentative d'action
  CONFUSE_SELF_HIT_CHANCE: 1 / 3,
  CONFUSE_SELF_DAMAGE_MULTIPLIER: 0.4,
  CONFUSE_MIN_TURNS: 2,
  CONFUSE_TURN_RANGE: 2,         // durée = MIN + random(0..RANGE-1)
  SLEEP_MIN_TURNS: 1,
  SLEEP_TURN_RANGE: 3,
  STATUS_ABILITY_PROC_CHANCE: 0.3, // Statik / Point Poison au contact

  // --- Capture ---
  CATCH_RATE_LEGENDARY: 25,
  CATCH_RATE_STAGE1: 190,        // Pokémon de base (pas encore évolué)
  CATCH_RATE_STAGE2: 120,
  CATCH_RATE_STAGE3: 70,
  CATCH_RATE_SCALE: 255,         // dénominateur des taux de capture ci-dessus (échelle des jeux originaux)
  CATCH_HP_FACTOR_BASE: 0.2,
  CATCH_HP_FACTOR_SPAN: 0.8,      // facteur PV = BASE + SPAN*(1 - pv/pvMax)
  CATCH_STATUS_FACTOR_SLEEP_FREEZE: 2,
  CATCH_STATUS_FACTOR_OTHER: 1.5,
  CATCH_CHANCE_MIN: 0.03,
  CATCH_CHANCE_MAX: 0.95,

  // --- Récompenses ---
  XP_LEVEL_DIVISOR: 7,           // xp gagnée = baseExp * niveau / 7 (formule des jeux originaux)
  MULTI_EXP_SHARE: 0.5,          // part d'xp pour les non-participants (option Multi Exp)
  MONEY_REWARD_BASE: 15,
  MONEY_REWARD_PER_LEVEL: 3,

  // --- Objets tenus ---
  ORAN_BERRY_HP_THRESHOLD: 1 / 4, // se déclenche sous ce ratio de PV max

  // --- Équipe / progression ---
  EV_CAP_PER_STAT: 252,
  EV_CAP_TOTAL: 510,
  LEVEL_CAP: 100,
  XP_CURVE_EXPONENT: 3,          // xp cumulée nécessaire pour un niveau = niveau^exposant
  REVIVE_HEAL_FRACTION: 0.5
};
