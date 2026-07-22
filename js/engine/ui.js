// Aides de rendu génériques + écrans: titre, choix du starter, équipe, pokédex.
window.PKMN = window.PKMN || {};

const CW = 480, CH = 400; // dimensions logiques du canvas (voir index.html)
PKMN.CANVAS_W = CW;
PKMN.CANVAS_H = CH;

PKMN.wrapText = function (ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
};

PKMN.roundRectPath = function (ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

PKMN.drawPanel = function (ctx, x, y, w, h, opts) {
  opts = opts || {};
  const r = opts.r ?? 10;
  PKMN.roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = opts.border || "#2c3e50";
  ctx.fill();
  const pad = opts.pad ?? 4;
  PKMN.roundRectPath(ctx, x + pad, y + pad, w - pad * 2, h - pad * 2, Math.max(2, r - pad));
  ctx.fillStyle = opts.fill || "#fff";
  ctx.fill();
};

PKMN.drawTextBox = function (ctx, text, opts) {
  opts = opts || {};
  const x = 10, y = CH - 100, w = CW - 20, h = 90;
  PKMN.drawPanel(ctx, x, y, w, h, { border: "#1c3f5f", fill: "#fdfefe" });
  ctx.fillStyle = "#111";
  ctx.font = "16px 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const lines = PKMN.wrapText(ctx, text, w - 24);
  lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, x + 12, y + 12 + i * 22));
  if (!opts.noPrompt) {
    ctx.fillStyle = "#888";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("▶ Entrée / Espace", x + w - 10, y + h - 18);
  }
};

PKMN.drawMenu = function (ctx, x, y, items, selectedIndex, opts) {
  opts = opts || {};
  const lineH = opts.lineH || 26;
  const w = opts.w || 180;
  const h = items.length * lineH + 16;
  PKMN.drawPanel(ctx, x, y, w, h, { border: "#1c3f5f", fill: "#fdfefe" });
  ctx.font = "16px 'Segoe UI', sans-serif";
  ctx.textBaseline = "middle";
  items.forEach((item, i) => {
    const ly = y + 8 + i * lineH + lineH / 2;
    if (i === selectedIndex) {
      ctx.fillStyle = "#f4d03f";
      ctx.fillRect(x + 4, y + 4 + i * lineH, w - 8, lineH);
    }
    ctx.fillStyle = "#111";
    ctx.textAlign = "left";
    ctx.fillText((i === selectedIndex ? "➤ " : "   ") + item, x + 10, ly);
  });
};

PKMN.drawHpBar = function (ctx, x, y, w, h, ratio) {
  ctx.fillStyle = "#444";
  ctx.fillRect(x, y, w, h);
  const color = ratio > 0.5 ? "#4caf50" : ratio > 0.2 ? "#f39c12" : "#e74c3c";
  ctx.fillStyle = color;
  ctx.fillRect(x, y, Math.max(0, w * ratio), h);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
};

// ---------- Écran titre ----------
PKMN.TitleState = {
  onEnter() {
    this.hasSave = PKMN.hasSave();
    this.sel = 0;
    this.confirmingNewGame = false;
  },
  items() {
    return this.hasSave ? ["Continuer", "Nouvelle partie"] : ["Nouvelle partie"];
  },
  onKey(key) {
    if (this.confirmingNewGame) {
      if (key === "Enter" || key === " ") {
        PKMN.deleteSave();
        PKMN.switchState("starter");
      } else if (key === "Escape") {
        this.confirmingNewGame = false;
      }
      return;
    }
    const items = this.items();
    if (key === "ArrowDown") this.sel = (this.sel + 1) % items.length;
    if (key === "ArrowUp") this.sel = (this.sel - 1 + items.length) % items.length;
    if (key === "Enter" || key === " ") {
      const choice = items[this.sel];
      if (choice === "Continuer") {
        const ok = PKMN.loadGame();
        PKMN.switchState(ok ? "overworld" : "starter");
      } else if (choice === "Nouvelle partie") {
        if (this.hasSave) this.confirmingNewGame = true;
        else PKMN.switchState("starter");
      }
    }
  },
  render(ctx) {
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#f4d03f";
    ctx.font = "bold 36px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Pokémon", CW / 2, 120);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Édition Perso", CW / 2, 155);

    const items = this.items();
    PKMN.drawMenu(ctx, CW / 2 - 100, 200, items, this.sel, { w: 200 });

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#bbb";
    ctx.textAlign = "center";
    ctx.fillText("Projet fan perso — Pokémon © Nintendo/Game Freak", CW / 2, CH - 20);

    if (this.confirmingNewGame) {
      PKMN.drawTextBox(ctx, "Supprimer la sauvegarde et recommencer ? (Entrée = oui, Échap = non)");
    }
  }
};

// ---------- Choix du starter ----------
PKMN.StarterState = {
  starters: [1, 4, 7], // Bulbizarre, Salamèche, Carapuce
  onEnter() { this.sel = 0; this.confirming = false; },
  onKey(key) {
    if (this.confirming) {
      if (key === "Enter" || key === " ") {
        const speciesId = this.starters[this.sel];
        PKMN.Player.party = [];
        PKMN.Player.addToParty(speciesId, 5);
        PKMN.Player.initBag();
        PKMN.Player.mapKey = PKMN.START_MAP;
        const start = PKMN.MAPS[PKMN.START_MAP].playerStart;
        PKMN.Player.x = start.x;
        PKMN.Player.y = start.y;
        PKMN.Player.lastCenter = { mapKey: PKMN.START_MAP, x: start.x, y: start.y };
        PKMN.saveGame();
        PKMN.switchState("overworld");
      } else if (key === "Escape") {
        this.confirming = false;
      }
      return;
    }
    if (key === "ArrowLeft") this.sel = (this.sel + 2) % 3;
    if (key === "ArrowRight") this.sel = (this.sel + 1) % 3;
    if (key === "Enter" || key === " ") this.confirming = true;
  },
  render(ctx) {
    ctx.fillStyle = "#eafaf1";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Choisis ton Pokémon de départ", CW / 2, 40);

    this.starters.forEach((id, i) => {
      const species = PKMN.POKEDEX[id];
      const x = 60 + i * 150;
      const y = 90;
      if (i === this.sel) {
        ctx.fillStyle = "#f4d03f";
        ctx.fillRect(x - 10, y - 10, 120, 130);
      }
      PKMN.drawPokemonSprite(ctx, id, x, y, 100, false);
      ctx.fillStyle = "#111";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(species.name, x + 50, y + 118);
    });

    if (this.confirming) {
      const species = PKMN.POKEDEX[this.starters[this.sel]];
      PKMN.drawTextBox(ctx, `Partir à l'aventure avec ${species.name} ? (Entrée = oui, Échap = non)`);
    } else {
      PKMN.drawTextBox(ctx, "Flèches gauche/droite pour choisir, Entrée pour valider.", { noPrompt: true });
    }
  }
};

// ---------- Écran équipe ----------
PKMN.PartyState = {
  onEnter() { this.sel = 0; this.actionSel = 0; this.phase = "list"; this.returnTo = this.returnTo || "overworld"; },
  onKey(key) {
    const n = PKMN.Player.party.length;
    if (this.phase === "list") {
      if (key === "ArrowDown") this.sel = (this.sel + 1) % n;
      if (key === "ArrowUp") this.sel = (this.sel - 1 + n) % n;
      if (key === "Escape") PKMN.switchState(this.returnTo);
      if (key === "Enter" || key === " ") { this.phase = "action"; this.actionSel = 0; }
      return;
    }
    if (this.phase === "action") {
      const items = this.actionItems();
      if (key === "ArrowDown") this.actionSel = (this.actionSel + 1) % items.length;
      if (key === "ArrowUp") this.actionSel = (this.actionSel - 1 + items.length) % items.length;
      if (key === "Escape") this.phase = "list";
      if (key === "Enter" || key === " ") this.chooseAction(items[this.actionSel]);
      return;
    }
    if (this.phase === "info") {
      if (key === "Escape" || key === "Enter" || key === " ") this.phase = "list";
      return;
    }
    if (this.phase === "held") {
      const items = this.heldChoices();
      if (key === "ArrowDown") this.heldSel = (this.heldSel + 1) % items.length;
      if (key === "ArrowUp") this.heldSel = (this.heldSel - 1 + items.length) % items.length;
      if (key === "Escape") this.phase = "action";
      if (key === "Enter" || key === " ") this.chooseHeld(items[this.heldSel]);
      return;
    }
  },
  actionItems() {
    const n = PKMN.Player.party.length;
    const items = ["Infos", "Objet tenu"];
    if (this.sel > 0) items.push("Monter");
    if (this.sel < n - 1) items.push("Descendre");
    items.push("Retour");
    return items;
  },
  chooseAction(choice) {
    const party = PKMN.Player.party;
    if (choice === "Infos") { this.phase = "info"; return; }
    if (choice === "Objet tenu") { this.phase = "held"; this.heldSel = 0; return; }
    if (choice === "Monter") { [party[this.sel - 1], party[this.sel]] = [party[this.sel], party[this.sel - 1]]; this.sel--; }
    if (choice === "Descendre") { [party[this.sel + 1], party[this.sel]] = [party[this.sel], party[this.sel + 1]]; this.sel++; }
    PKMN.saveGame();
    this.phase = "list";
  },
  heldChoices() {
    const mon = PKMN.Player.party[this.sel];
    const items = Object.keys(PKMN.Player.bag).filter((k) => PKMN.ITEMS[k].category === "heldberry" && PKMN.Player.bag[k] > 0);
    if (mon.heldItem) items.push("retirer");
    items.push("retour");
    return items;
  },
  chooseHeld(key) {
    const mon = PKMN.Player.party[this.sel];
    if (key === "retour") { this.phase = "action"; return; }
    if (key === "retirer") {
      PKMN.Player.bag[mon.heldItem] = (PKMN.Player.bag[mon.heldItem] || 0) + 1;
      mon.heldItem = null;
    } else {
      if (mon.heldItem) PKMN.Player.bag[mon.heldItem] = (PKMN.Player.bag[mon.heldItem] || 0) + 1;
      PKMN.Player.bag[key]--;
      mon.heldItem = key;
    }
    PKMN.saveGame();
    this.heldSel = 0;
    this.phase = "action";
  },
  render(ctx) {
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Ton équipe", 16, 30);

    PKMN.Player.party.forEach((mon, i) => {
      const species = PKMN.speciesOf(mon);
      const y = 50 + i * 55;
      if (i === this.sel) {
        ctx.fillStyle = "#34495e";
        ctx.fillRect(8, y - 4, CW - 16, 50);
      }
      PKMN.drawPokemonSprite(ctx, mon.species, 12, y - 4, 44, false);
      ctx.fillStyle = "#fff";
      ctx.font = "15px sans-serif";
      ctx.fillText(`${species.name}  Nv.${mon.level}`, 64, y + 2);
      ctx.font = "12px sans-serif";
      ctx.fillText(`PV ${mon.hp}/${mon.maxHp}`, 64, y + 20);
      PKMN.drawHpBar(ctx, 200, y + 12, 120, 10, mon.hp / mon.maxHp);
      if (mon.hp <= 0) {
        ctx.fillStyle = "#e74c3c";
        ctx.fillText("K.O.", 340, y + 20);
      }
    });

    if (this.phase === "action") {
      const items = this.actionItems();
      PKMN.drawMenu(ctx, CW - 170, 50 + this.sel * 55, items, this.actionSel, { w: 160 });
    } else if (this.phase === "info") {
      this.renderInfo(ctx);
      return;
    } else if (this.phase === "held") {
      const items = this.heldChoices().map((k) => k === "retour" ? "Retour" : k === "retirer" ? "Retirer" : PKMN.ITEMS[k].name);
      PKMN.drawMenu(ctx, CW - 170, 50 + this.sel * 55, items, this.heldSel, { w: 160 });
    }

    PKMN.drawTextBox(ctx, this.phase === "list" ? "Entrée: options · Échap: revenir" : "Entrée: choisir · Échap: retour", { noPrompt: true });
  },
  renderInfo(ctx) {
    const mon = PKMN.Player.party[this.sel];
    const species = PKMN.speciesOf(mon);
    ctx.fillStyle = "#eafaf1";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${species.name}  Nv.${mon.level}  (${species.types.join("/")})`, 16, 26);
    PKMN.drawPokemonSprite(ctx, mon.species, 16, 34, 90, false);

    const statNames = { hp: "PV", atk: "Attaque", def: "Défense", spa: "Att.Spé", spd: "Déf.Spé", spe: "Vitesse" };
    let y = 40;
    ctx.font = "13px sans-serif";
    for (const key of ["hp", "atk", "def", "spa", "spd", "spe"]) {
      ctx.fillStyle = "#2c3e50";
      const val = key === "hp" ? `${mon.hp}/${mon.maxHp}` : mon.stats[key];
      ctx.fillText(`${statNames[key]}: ${val}   (IV ${mon.ivs[key]} · EV ${mon.evs[key]})`, 116, y);
      y += 18;
    }

    ctx.fillText(`XP: ${mon.xp}/${PKMN.xpToNextLevel(mon.level)}`, 116, y + 4);

    y += 20;
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#2c3e50";
    const heldName = mon.heldItem ? PKMN.ITEMS[mon.heldItem].name : "aucun";
    ctx.fillText(`Talent: ${PKMN.ABILITIES[species.ability].name}  ·  Objet: ${heldName}`, 16, y);

    y += 16;
    ctx.font = "bold 13px sans-serif";
    ctx.fillStyle = "#2c3e50";
    ctx.fillText("Capacités:", 16, y);
    y += 16;
    ctx.font = "12px sans-serif";
    for (const m of mon.moves) {
      ctx.fillText(`${PKMN.MOVES[m.key].name} (${m.pp}/${m.maxPp} PP)`, 16, y);
      y += 15;
    }

    const matchups = PKMN.typeMatchups(species.types);
    const weak = [...matchups.weak4, ...matchups.weak2];
    const resist = [...matchups.immune, ...matchups.resist4, ...matchups.resist2];
    y += 8;
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#c0392b";
    ctx.fillText(`Faible contre: ${weak.length ? weak.join(", ") : "rien de particulier"}`, 16, y);
    y += 15;
    ctx.fillStyle = "#27ae60";
    ctx.fillText(`Résiste à: ${resist.length ? resist.join(", ") : "rien de particulier"}`, 16, y);

    PKMN.drawTextBox(ctx, "Échap pour revenir.", { noPrompt: true });
  }
};

// ---------- Sac (objets, pierres d'évolution, soins) ----------
PKMN.BagState = {
  onEnter() { this.phase = "items"; this.sel = 0; this.targetSel = 0; this.message = null; this.pendingItem = null; },
  itemList() {
    // Les Poké Ball ne s'utilisent qu'en combat, pas depuis ce menu.
    return Object.keys(PKMN.Player.bag).filter((k) => k !== "pokeball" && PKMN.Player.bag[k] > 0);
  },
  onKey(key) {
    if (this.message) {
      if (key === "Enter" || key === " " || key === "Escape") this.message = null;
      return;
    }
    if (this.phase === "items") {
      const items = this.itemList();
      if (key === "Escape" || (!items.length && (key === "Enter" || key === " "))) { PKMN.switchState("overworld"); return; }
      if (!items.length) return;
      if (key === "ArrowDown") this.sel = (this.sel + 1) % items.length;
      if (key === "ArrowUp") this.sel = (this.sel - 1 + items.length) % items.length;
      if (key === "Enter" || key === " ") {
        const chosen = items[this.sel];
        if (chosen === "repel") { this.useRepel(); return; }
        this.pendingItem = chosen; this.phase = "target"; this.targetSel = 0;
      }
      return;
    }
    if (this.phase === "target") {
      const party = PKMN.Player.party;
      if (key === "ArrowDown") this.targetSel = (this.targetSel + 1) % party.length;
      if (key === "ArrowUp") this.targetSel = (this.targetSel - 1 + party.length) % party.length;
      if (key === "Escape") this.phase = "items";
      if (key === "Enter" || key === " ") this.useItemOn(party[this.targetSel]);
      return;
    }
  },
  useRepel() {
    PKMN.Player.repelSteps = PKMN.ITEMS.repel.steps;
    PKMN.Player.bag.repel--;
    PKMN.saveGame();
    this.message = `Répulsif actif pour ${PKMN.ITEMS.repel.steps} pas !`;
  },
  useItemOn(mon) {
    this.message = PKMN.applyItemToMon(this.pendingItem, mon);
    PKMN.saveGame();
    this.phase = "items";
    this.sel = 0;
  },
  render(ctx) {
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Sac", 16, 30);

    const items = this.itemList();
    if (this.phase === "items" || !items.length) {
      if (!items.length) {
        ctx.font = "15px sans-serif";
        ctx.fillText("Ton sac est vide.", 16, 70);
      } else {
        items.forEach((key, i) => {
          const y = 50 + i * 36;
          if (i === this.sel) { ctx.fillStyle = "#34495e"; ctx.fillRect(8, y - 4, CW - 16, 32); }
          ctx.fillStyle = "#fff";
          ctx.font = "15px sans-serif";
          ctx.fillText(`${PKMN.ITEMS[key].name}  x${PKMN.Player.bag[key]}`, 16, y + 16);
        });
      }
    } else if (this.phase === "target") {
      ctx.fillStyle = "#f4d03f";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Utiliser ${PKMN.ITEMS[this.pendingItem].name} sur qui ?`, 16, 44);
      PKMN.Player.party.forEach((mon, i) => {
        const species = PKMN.speciesOf(mon);
        const y = 60 + i * 36;
        if (i === this.targetSel) { ctx.fillStyle = "#34495e"; ctx.fillRect(8, y - 4, CW - 16, 32); }
        ctx.fillStyle = "#fff";
        ctx.font = "15px sans-serif";
        ctx.fillText(`${species.name}  Nv.${mon.level}`, 16, y + 16);
      });
    }

    if (this.message) PKMN.drawTextBox(ctx, this.message);
    else PKMN.drawTextBox(ctx, this.phase === "items" ? "Entrée: utiliser · Échap: revenir" : "Entrée: choisir · Échap: retour", { noPrompt: true });
  }
};

// ---------- Poké Mart ----------
PKMN.MartState = {
  onEnter() { this.sel = 0; this.message = null; },
  onKey(key) {
    if (this.message) {
      if (key === "Enter" || key === " " || key === "Escape") this.message = null;
      return;
    }
    const items = [...PKMN.MART_STOCK, "sortir"];
    if (key === "ArrowDown") this.sel = (this.sel + 1) % items.length;
    if (key === "ArrowUp") this.sel = (this.sel - 1 + items.length) % items.length;
    if (key === "Escape") { PKMN.switchState("overworld"); return; }
    if (key === "Enter" || key === " ") {
      const choice = items[this.sel];
      if (choice === "sortir") PKMN.switchState("overworld");
      else this.buy(choice);
    }
  },
  buy(itemKey) {
    const item = PKMN.ITEMS[itemKey];
    if (PKMN.Player.money < item.price) {
      this.message = "Pas assez d'argent !";
      return;
    }
    PKMN.Player.money -= item.price;
    PKMN.Player.bag[itemKey] = (PKMN.Player.bag[itemKey] || 0) + 1;
    PKMN.saveGame();
    this.message = `${item.name} acheté !`;
  },
  render(ctx) {
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Poké Mart", 16, 30);
    ctx.fillStyle = "#f4d03f";
    ctx.font = "14px sans-serif";
    ctx.fillText(`Argent: ${PKMN.Player.money}₽`, 16, 52);

    const items = [...PKMN.MART_STOCK, "sortir"];
    items.forEach((key, i) => {
      const y = 74 + i * 36;
      if (i === this.sel) { ctx.fillStyle = "#34495e"; ctx.fillRect(8, y - 4, CW - 16, 32); }
      ctx.fillStyle = "#fff";
      ctx.font = "15px sans-serif";
      const label = key === "sortir" ? "Sortir" : `${PKMN.ITEMS[key].name} — ${PKMN.ITEMS[key].price}₽ (x${PKMN.Player.bag[key] || 0})`;
      ctx.fillText(label, 16, y + 16);
    });

    if (this.message) PKMN.drawTextBox(ctx, this.message);
    else PKMN.drawTextBox(ctx, "Entrée: acheter · Échap: sortir", { noPrompt: true });
  }
};

// ---------- Boîte PC ----------
PKMN.PCState = {
  onEnter() {
    this.focus = "party";
    this.partySel = 0;
    this.boxSel = 0;
    this.phase = "list";
    this.actionSel = 0;
    this.message = null;
  },
  onKey(key) {
    if (this.message) {
      if (key === "Enter" || key === " " || key === "Escape") this.message = null;
      return;
    }
    const partyLen = PKMN.Player.party.length;
    const boxLen = PKMN.Player.box.length;
    if (this.phase === "list") {
      if (key === "ArrowLeft" || key === "ArrowRight") this.focus = this.focus === "party" ? "box" : "party";
      if (this.focus === "party") {
        if (key === "ArrowDown") this.partySel = (this.partySel + 1) % partyLen;
        if (key === "ArrowUp") this.partySel = (this.partySel - 1 + partyLen) % partyLen;
      } else if (boxLen > 0) {
        if (key === "ArrowDown") this.boxSel = (this.boxSel + 1) % boxLen;
        if (key === "ArrowUp") this.boxSel = (this.boxSel - 1 + boxLen) % boxLen;
      }
      if (key === "Escape") { PKMN.switchState("overworld"); return; }
      if (key === "Enter" || key === " ") {
        if (this.focus === "box" && boxLen === 0) return;
        this.phase = "action"; this.actionSel = 0;
      }
      return;
    }
    if (this.phase === "action") {
      const items = this.actionItems();
      if (key === "ArrowDown") this.actionSel = (this.actionSel + 1) % items.length;
      if (key === "ArrowUp") this.actionSel = (this.actionSel - 1 + items.length) % items.length;
      if (key === "Escape") this.phase = "list";
      if (key === "Enter" || key === " ") this.chooseAction(items[this.actionSel]);
      return;
    }
    if (this.phase === "confirm_release") {
      if (key === "Enter" || key === " ") this.doRelease();
      if (key === "Escape") this.phase = "action";
      return;
    }
  },
  actionItems() {
    const items = [];
    if (this.focus === "party") { if (PKMN.Player.party.length > 1) items.push("Déposer"); items.push("Relâcher"); }
    else { if (PKMN.Player.party.length < 6) items.push("Retirer"); items.push("Relâcher"); }
    items.push("Retour");
    return items;
  },
  chooseAction(choice) {
    if (choice === "Retour") { this.phase = "list"; return; }
    if (choice === "Relâcher") { this.phase = "confirm_release"; return; }
    if (choice === "Déposer") {
      PKMN.Player.depositToBox(this.partySel);
      this.partySel = Math.min(this.partySel, PKMN.Player.party.length - 1);
      PKMN.saveGame();
      this.message = "Pokémon déposé en boîte.";
    } else if (choice === "Retirer") {
      PKMN.Player.withdrawFromBox(this.boxSel);
      this.boxSel = Math.max(0, Math.min(this.boxSel, PKMN.Player.box.length - 1));
      PKMN.saveGame();
      this.message = "Pokémon ajouté à l'équipe.";
    }
    this.phase = "list";
  },
  doRelease() {
    if (this.focus === "party") {
      const ok = PKMN.Player.releaseFromParty(this.partySel);
      this.message = ok ? "Pokémon relâché..." : "Il te faut garder au moins un Pokémon !";
      this.partySel = Math.max(0, Math.min(this.partySel, PKMN.Player.party.length - 1));
    } else {
      PKMN.Player.releaseFromBox(this.boxSel);
      this.boxSel = Math.max(0, Math.min(this.boxSel, PKMN.Player.box.length - 1));
      this.message = "Pokémon relâché...";
    }
    PKMN.saveGame();
    this.phase = "list";
  },
  render(ctx) {
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Boîte PC", 16, 26);

    const drawList = (title, list, selIndex, x, w, focused) => {
      ctx.fillStyle = focused ? "#f4d03f" : "#7f8c8d";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(title, x, 48);
      const visible = 6;
      const scroll = Math.max(0, Math.min(selIndex - 2, Math.max(0, list.length - visible)));
      for (let i = 0; i < visible; i++) {
        const idx = scroll + i;
        if (idx >= list.length) break;
        const mon = list[idx];
        const species = PKMN.speciesOf(mon);
        const y = 58 + i * 30;
        if (focused && idx === selIndex) { ctx.fillStyle = "#34495e"; ctx.fillRect(x - 4, y - 4, w, 26); }
        ctx.fillStyle = mon.hp <= 0 ? "#e74c3c" : "#fff";
        ctx.font = "13px sans-serif";
        ctx.fillText(`${species.name} Nv.${mon.level}`, x, y + 14);
      }
      if (list.length === 0) { ctx.fillStyle = "#7f8c8d"; ctx.font = "12px sans-serif"; ctx.fillText("(vide)", x, 62); }
    };

    drawList(`Équipe (${PKMN.Player.party.length}/6)`, PKMN.Player.party, this.partySel, 16, 220, this.focus === "party");
    drawList(`Boîte (${PKMN.Player.box.length})`, PKMN.Player.box, this.boxSel, 250, 220, this.focus === "box");

    if (this.phase === "action") {
      const list = this.focus === "party" ? PKMN.Player.party : PKMN.Player.box;
      const sel = this.focus === "party" ? this.partySel : this.boxSel;
      const x = this.focus === "party" ? 16 : 250;
      const items = this.actionItems();
      PKMN.drawMenu(ctx, x, 58 + Math.min(sel, 5) * 30, items, this.actionSel, { w: 170 });
    }

    if (this.phase === "confirm_release") {
      const list = this.focus === "party" ? PKMN.Player.party : PKMN.Player.box;
      const sel = this.focus === "party" ? this.partySel : this.boxSel;
      const species = PKMN.speciesOf(list[sel]);
      PKMN.drawTextBox(ctx, `Relâcher ${species.name} pour de bon ? (Entrée=oui, Échap=non)`);
    } else if (this.message) {
      PKMN.drawTextBox(ctx, this.message);
    } else {
      PKMN.drawTextBox(ctx, "Flèches: naviguer · Entrée: options · Échap: sortir", { noPrompt: true });
    }
  }
};

// ---------- Pokédex ----------
PKMN.PokedexState = {
  onEnter() { this.sel = 0; this.phase = "list"; },
  onKey(key) {
    if (this.phase === "detail") {
      if (key === "Escape" || key === "Enter" || key === " ") this.phase = "list";
      return;
    }
    if (key === "ArrowDown") this.sel = Math.min(this.sel + 1, 150);
    if (key === "ArrowUp") this.sel = Math.max(this.sel - 1, 0);
    if (key === "Escape") { PKMN.switchState("overworld"); return; }
    if (key === "Enter" || key === " ") {
      if (PKMN.Player.pokedexSeen.has(this.sel + 1)) this.phase = "detail";
    }
  },
  render(ctx) {
    if (this.phase === "detail") { this.renderDetail(ctx); return; }
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    const caught = PKMN.Player.pokedexCaught.size;
    ctx.fillText(`Pokédex — ${caught}/151 capturés`, 16, 26);

    const scroll = Math.max(0, Math.min(this.sel - 3, 151 - 8));
    for (let i = 0; i < 8; i++) {
      const id = scroll + i + 1;
      if (id > 151) break;
      const species = PKMN.POKEDEX[id];
      const seen = PKMN.Player.pokedexSeen.has(id);
      const caughtIt = PKMN.Player.pokedexCaught.has(id);
      const y = 44 + i * 42;
      ctx.fillStyle = caughtIt ? "#2ecc71" : seen ? "#7f8c8d" : "#34495e";
      ctx.fillRect(8, y, CW - 16, 36);
      if (id - 1 === this.sel) { ctx.strokeStyle = "#f4d03f"; ctx.lineWidth = 3; ctx.strokeRect(8, y, CW - 16, 36); }
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      const label = seen ? `#${String(id).padStart(3, "0")} ${species.name} (${species.types.join("/")})` : `#${String(id).padStart(3, "0")} ???`;
      ctx.fillText(label, 16, y + 22);
      if (caughtIt) {
        ctx.textAlign = "right";
        ctx.fillText("Capturé ✔", CW - 16, y + 22);
        ctx.textAlign = "left";
      }
    }
    PKMN.drawTextBox(ctx, "Flèches: naviguer · Entrée: détails (si vu) · Échap: revenir", { noPrompt: true });
  },
  renderDetail(ctx) {
    const id = this.sel + 1;
    const species = PKMN.POKEDEX[id];
    ctx.fillStyle = "#eafaf1";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`#${String(id).padStart(3, "0")} ${species.name} (${species.types.join("/")})`, 16, 26);
    PKMN.drawPokemonSprite(ctx, id, 16, 34, 90, false);

    const statNames = { hp: "PV", atk: "Attaque", def: "Défense", spa: "Att.Spé", spd: "Déf.Spé", spe: "Vitesse" };
    let y = 44;
    ctx.font = "13px sans-serif";
    for (const key of ["hp", "atk", "def", "spa", "spd", "spe"]) {
      ctx.fillStyle = "#2c3e50";
      ctx.fillText(`${statNames[key]}: ${species.baseStats[key]}`, 116, y);
      y += 18;
    }

    const matchups = PKMN.typeMatchups(species.types);
    const weak = [...matchups.weak4, ...matchups.weak2];
    const resist = [...matchups.immune, ...matchups.resist4, ...matchups.resist2];
    y += 14;
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#c0392b";
    ctx.fillText(`Faible contre: ${weak.length ? weak.join(", ") : "rien de particulier"}`, 16, y);
    y += 16;
    ctx.fillStyle = "#27ae60";
    ctx.fillText(`Résiste à: ${resist.length ? resist.join(", ") : "rien de particulier"}`, 16, y);

    PKMN.drawTextBox(ctx, "Échap pour revenir à la liste.", { noPrompt: true });
  }
};

// ---------- Quêtes ----------
PKMN.QuestState = {
  onEnter() { this.sel = 0; },
  activeIds() {
    return Object.keys(PKMN.QUESTS).filter((id) => PKMN.Player.questStatus(id) !== "not_started");
  },
  onKey(key) {
    const ids = this.activeIds();
    if (key === "ArrowDown") this.sel = Math.min(this.sel + 1, Math.max(0, ids.length - 1));
    if (key === "ArrowUp") this.sel = Math.max(this.sel - 1, 0);
    if (key === "Escape" || key === "Enter" || key === " ") PKMN.switchState("overworld");
  },
  render(ctx) {
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Quêtes", 16, 30);

    const ids = this.activeIds();
    if (!ids.length) {
      ctx.font = "15px sans-serif";
      ctx.fillText("Aucune quête en cours pour l'instant.", 16, 70);
    } else {
      ids.forEach((id, i) => {
        const quest = PKMN.QUESTS[id];
        const status = PKMN.Player.questStatus(id);
        const y = 50 + i * 40;
        if (i === this.sel) { ctx.fillStyle = "#34495e"; ctx.fillRect(8, y - 4, CW - 16, 36); }
        ctx.fillStyle = status === "done" ? "#2ecc71" : "#fff";
        ctx.font = "15px sans-serif";
        ctx.fillText(`${quest.name}${status === "done" ? " (terminée)" : ""}`, 16, y + 16);
      });
    }
    PKMN.drawTextBox(ctx, "Échap: revenir", { noPrompt: true });
  }
};

// ---------- Options ----------
PKMN.OptionsState = {
  onEnter() { this.sel = 0; },
  items() {
    return [`Multi Exp : ${PKMN.Player.options.multiExp ? "Activé" : "Désactivé"}`, "Retour"];
  },
  onKey(key) {
    const items = this.items();
    if (key === "ArrowDown") this.sel = (this.sel + 1) % items.length;
    if (key === "ArrowUp") this.sel = (this.sel - 1 + items.length) % items.length;
    if (key === "Escape") { PKMN.switchState("overworld"); return; }
    if (key === "Enter" || key === " ") {
      if (this.sel === 0) { PKMN.Player.options.multiExp = !PKMN.Player.options.multiExp; PKMN.saveGame(); }
      else PKMN.switchState("overworld");
    }
  },
  render(ctx) {
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Options", 16, 30);
    PKMN.drawMenu(ctx, 16, 50, this.items(), this.sel, { w: 260 });
    PKMN.drawTextBox(ctx, "Entrée: changer/valider · Échap: revenir", { noPrompt: true });
  }
};
