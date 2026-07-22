// Moteur de dialogues réutilisable: fait défiler le texte d'un nœud, applique ses
// effets (objets, quêtes, drapeaux, morale...), puis affiche des choix ou enchaîne
// sur le nœud suivant. Conçu pour être piloté entièrement par les données des PNJ
// (js/data/npcs.js), sans code spécifique par personnage.
window.PKMN = window.PKMN || {};

PKMN.DialogueState = {
  startWith(npc) {
    this.npc = npc;
    PKMN.Player.incTalkCount(npc.id);
    this.nodeId = npc.dialogue.start;
    this.choices = [];
    this.choiceSel = 0;
    this.loadNode();
  },

  currentNode() {
    return this.npc.dialogue.nodes[this.nodeId];
  },

  loadNode() {
    const node = this.currentNode();
    const text = node.text;
    this.queue = Array.isArray(text) ? text.slice() : [text];
    this.onQueueDone = () => this.afterText();
    this.phase = "message";
  },

  checkCondition(cond) {
    if (!cond) return true;
    if (cond.flag !== undefined) return !!PKMN.Player.getFlag(cond.flag) === (cond.equals !== false);
    if (cond.quest !== undefined) return PKMN.Player.questStatus(cond.quest) === cond.status;
    return true;
  },

  runEffects(effects) {
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
    }
    PKMN.saveGame();
  },

  afterText() {
    const node = this.currentNode();
    this.runEffects(node.effects);
    const choices = (node.choices || []).filter((c) => this.checkCondition(c.condition));
    if (choices.length) {
      this.choices = choices;
      this.choiceSel = 0;
      this.phase = "choices";
      return;
    }
    if (node.next) {
      this.nodeId = node.next;
      this.loadNode();
      return;
    }
    PKMN.switchState("overworld");
  },

  advance() {
    if (this.queue.length > 0) this.queue.shift();
    if (this.queue.length === 0) {
      const cb = this.onQueueDone;
      this.onQueueDone = null;
      if (cb) {
        try {
          cb();
        } catch (e) {
          console.error("Erreur de dialogue, retour forcé à la carte.", e);
          PKMN.switchState("overworld");
        }
      }
    }
  },

  onKey(key) {
    if (this.phase === "message") {
      if (key === "Enter" || key === " " || key === "Escape") this.advance();
      return;
    }
    if (this.phase === "choices") {
      const n = this.choices.length;
      if (key === "ArrowDown") this.choiceSel = (this.choiceSel + 1) % n;
      if (key === "ArrowUp") this.choiceSel = (this.choiceSel - 1 + n) % n;
      if (key === "Escape") { PKMN.switchState("overworld"); return; }
      if (key === "Enter" || key === " ") {
        const choice = this.choices[this.choiceSel];
        this.runEffects(choice.effects);
        if (choice.next) {
          this.nodeId = choice.next;
          this.loadNode();
        } else {
          PKMN.switchState("overworld");
        }
      }
      return;
    }
  },

  render(ctx) {
    const CW = PKMN.CANVAS_W, CH = PKMN.CANVAS_H;
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#f4d03f";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(this.npc.name, 16, 30);

    if (this.phase === "message") {
      PKMN.drawTextBox(ctx, this.queue[0] || "");
    } else if (this.phase === "choices") {
      PKMN.drawTextBox(ctx, "Que réponds-tu ?", { noPrompt: true });
      const labels = this.choices.map((c) => c.label);
      const h = labels.length * 26 + 16;
      PKMN.drawMenu(ctx, CW - 220, CH - 100 - h - 10, labels, this.choiceSel, { w: 210 });
    }
  }
};
