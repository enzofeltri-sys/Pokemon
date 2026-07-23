// Moteur de dialogues réutilisable: fait défiler le texte d'un nœud, applique ses
// effets (objets, quêtes, drapeaux, morale...), puis affiche des choix ou enchaîne
// sur le nœud suivant. Conçu pour être piloté entièrement par les données des PNJ
// (js/data/npcs.js), sans code spécifique par personnage.
window.PKMN = window.PKMN || {};

// Portrait affiché à côté du texte de dialogue. Personnages nommés (Professeure,
// Champions d'Arène, rival, Main Noire...) : portrait choisi à la main parmi
// PortraitsFinal. PNJ génériques (sans entrée ici) : un des 200 mini-bustes de
// la planche generic_sheet.png (grille 16x16, 10 colonnes x 20 lignes),
// assigné une fois pour toutes par PNJ via un compteur global qui évite les
// doublons (même principe que l'apparence overworld des PNJ).
const NPC_PORTRAITS = {
  prof_aline: "Lady2",
  rival_kian: "Boy", rival_kian_route3: "Boy", rival_kian_route5: "Boy", league_champion: "Boy",
  gym16_trainer: "Punk",
  gym16_leader: "Detective", super_champion: "Detective",
  gym1_leader: "Girl2",
  gym2_leader: "FarmerBoy",
  gym3_leader: "Lady",
  gym4_leader: "Kid1",
  gym5_leader: "Wizard2",
  gym6_leader: "Glasses",
  gym7_leader: "Girl",
  gym8_leader: "Viking",
  gym9_leader: "Luimberjack",
  gym10_leader: "Kid2",
  gym11_leader: "Knight",
  gym12_leader: "Boy2",
  gym13_leader: "Wizard1",
  gym14_leader: "old_man2",
  gym15_leader: "old_man"
};
const GENERIC_PORTRAIT_COLS = 10, GENERIC_PORTRAIT_ROWS = 20;
let _npcPortraitCounter = 0;
const _npcPortraitIndex = new Map();
function genericPortraitCoords(npc) {
  const key = npc.id || npc.name || "npc";
  if (!_npcPortraitIndex.has(key)) _npcPortraitIndex.set(key, _npcPortraitCounter++);
  const total = GENERIC_PORTRAIT_COLS * GENERIC_PORTRAIT_ROWS;
  // Brassage (multiplication par une constante première avec le total) pour que
  // des PNJ voisins dans un même fichier de carte n'aient pas des portraits
  // côte à côte sur la planche (souvent des variantes proches du même look).
  const n = (_npcPortraitIndex.get(key) * 6863) % total;
  return { col: n % GENERIC_PORTRAIT_COLS, row: Math.floor(n / GENERIC_PORTRAIT_COLS) };
}

// Dessine le portrait du PNJ actuellement en dialogue, dans la zone libre
// au-dessus de la boîte de texte. Ne fait rien si l'image n'est pas prête
// (hors-ligne, cache pas encore rempli) — le dialogue reste lisible sans.
function drawSpeakerPortrait(ctx, npc) {
  const CW = PKMN.CANVAS_W;
  const boxW = 84, boxH = 84, x = CW - boxW - 14, y = 46;
  const named = NPC_PORTRAITS[npc.id];
  let entry, sx, sy, sw, sh;
  if (named) {
    entry = PKMN.getSpriteImage(`./sprites/portraits/${named}.png`);
    if (entry.status !== "ok" || entry.img.naturalWidth !== 32 || entry.img.naturalHeight !== 32) return;
    sx = 0; sy = 0; sw = 32; sh = 32;
  } else {
    entry = PKMN.getSpriteImage("./sprites/portraits/generic_sheet.png");
    if (entry.status !== "ok" || entry.img.naturalWidth !== 160 || entry.img.naturalHeight !== 320) return;
    const c = genericPortraitCoords(npc);
    sx = c.col * 16; sy = c.row * 16; sw = 16; sh = 16;
  }
  PKMN.drawBorderedBox(ctx, x, y, boxW, boxH, { r: 4 });
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.img, sx, sy, sw, sh, x + 6, y + 6, boxW - 12, boxH - 12);
}

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

  // Sépare les effets spéciaux qui basculent vers l'écran de combat
  // (`startTrainerBattle`, `startLegendaryBattle`) des effets "standards"
  // délégués à PKMN.runStoryEffects.
  runEffects(effects) {
    if (!effects) return;
    const standard = [];
    for (const eff of effects) {
      if (eff.startTrainerBattle) {
        const trainer = PKMN.TRAINERS[eff.startTrainerBattle];
        PKMN.BattleState.startTrainer(trainer);
        PKMN.switchState("battle");
        this._battleTriggered = true;
      } else if (eff.startLegendaryBattle) {
        const { species, level, onCatch } = eff.startLegendaryBattle;
        PKMN.BattleState.startWild(species, level, { onCatch });
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
      drawSpeakerPortrait(ctx, this.npc);
      PKMN.drawTextBox(ctx, this.queue[0] || "");
    } else if (this.phase === "choices") {
      PKMN.drawTextBox(ctx, "Que réponds-tu ?", { noPrompt: true });
      const labels = this.choices.map((c) => c.label);
      const h = labels.length * 26 + 16;
      PKMN.drawMenu(ctx, CW - 220, CH - 100 - h - 10, labels, this.choiceSel, { w: 210 });
    }
  }
};
