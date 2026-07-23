// Conditions/effets partagés entre les dialogues (js/story/dialogue.js) et les
// combats de Dresseur (récompenses de victoire, js/battle/battle.js) — un seul
// format de données pour scénariser le jeu, quel que soit l'endroit qui le
// déclenche. Dépend de PKMN.Player (js/party/player.js) et PKMN.saveGame
// (js/engine/save.js), qui doivent être chargés avant ce fichier.
window.PKMN = window.PKMN || {};

// Starter "qui contre" celui du joueur (triangle des types classique), utilisé
// par les combats du rival pour choisir son équipe dynamiquement.
PKMN.RIVAL_STARTER_COUNTER = { 1: 4, 4: 7, 7: 1 };
PKMN.rivalStarterId = function () {
  const mine = PKMN.Player.party[0] ? PKMN.Player.party[0].species : 1;
  return PKMN.RIVAL_STARTER_COUNTER[mine] || 4;
};

PKMN.checkStoryCondition = function (cond) {
  if (!cond) return true;
  if (cond.all !== undefined) return cond.all.every((c) => PKMN.checkStoryCondition(c));
  if (cond.flag !== undefined) return !!PKMN.Player.getFlag(cond.flag) === (cond.equals !== false);
  if (cond.quest !== undefined) return PKMN.Player.questStatus(cond.quest) === cond.status;
  if (cond.badge !== undefined) return PKMN.Player.hasBadge(cond.badge) === (cond.equals !== false);
  return true;
};

PKMN.runStoryEffects = function (effects) {
  if (!effects) return;
  for (const eff of effects) {
    if (eff.give) PKMN.Player.bag[eff.give.item] = (PKMN.Player.bag[eff.give.item] || 0) + (eff.give.amount || 1);
    if (eff.money) PKMN.Player.money = Math.max(0, PKMN.Player.money + eff.money.delta);
    if (eff.setFlag) PKMN.Player.setFlag(eff.setFlag, eff.value);
    if (eff.startQuest) PKMN.Player.startQuest(eff.startQuest);
    if (eff.advanceQuest) PKMN.Player.setQuestStep(eff.advanceQuest.id, eff.advanceQuest.step);
    if (eff.completeQuest) PKMN.Player.completeQuest(eff.completeQuest);
    if (eff.moral) PKMN.Player.adjustMoral(eff.moral.axis, eff.moral.delta);
    if (eff.heal) PKMN.healParty(PKMN.Player.party);
    if (eff.badge) PKMN.Player.addBadge(eff.badge);
  }
  PKMN.saveGame();
};
