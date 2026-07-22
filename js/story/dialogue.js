// Moteur de dialogues réutilisable: fait défiler le texte d'un nœud, applique ses
// effets (objets, quêtes, drapeaux, morale...), puis affiche des choix ou enchaîne
// sur le nœud suivant. Conçu pour être piloté entièrement par les données des PNJ
// (js/data/npcs.js), sans code spécifique par personnage.
window.PKMN = window.PKMN || {};

PKMN.DialogueState = {
  startWith(npc) {
    this.npc = npc;
    PKMN.Player.incTalkCount(npc.id);
    this.nodeId = this.resolveStart(npc.dialogue);
    this.choices = [];
    this.choiceSel = 0;
    this._battleTriggered = false;
    this.loadNode();
  },

  // `dialogue.start` peut être soit un id de nœud fixe, soit une liste
  // [{condition, node}, ...] évaluée dans l'ordre (le premier match gagne),
  // avec `dialogue.default` comme repli — utile pour un PNJ dont le discours
  // change une fois une condition remplie (dresseur déjà battu, quête finie...).
  resolveStart(dialogueDef) {
    if (typeof dialogueDef.start === "string") return dialogueDef.start;
    for (const entry of dialogueDef.start) {
      if (PKMN.checkStoryCondition(entry.condition)) return entry.node;
    }
    return dialogueDef.default || dialogueDef.start[0].node;
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
    return PKMN.checkStoryCondition(cond);
  },

  // Sépare l'effet spécial `startTrainerBattle` (qui bascule vers l'écran de
  // combat) des effets "standards" délégués à PKMN.runStoryEffects.
  runEffects(effects) {
    if (!effects) return;
    const standard = [];
    for (const eff of effects) {
      if (eff.startTrainerBattle) {
        const trainer = PKMN.TRAINERS[eff.startTrainerBattle];
        PKMN.BattleState.startTrainer(trainer);
        PKMN.switchState("battle");
        this._battleTriggered = true;
      } else {
        standard.push(eff);
      }
    }
    PKMN.runStoryEffects(standard);
  },

  afterText() {
    const node = this.currentNode();
    this.runEffects(node.effects);
    if (this._battleTriggered) { this._battleTriggered = false; return; }
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
        if (this._battleTriggered) { this._battleTriggered = false; return; }
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
