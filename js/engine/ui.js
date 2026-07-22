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

PKMN.drawTextBox = function (ctx, text, opts) {
  opts = opts || {};
  const x = 10, y = CH - 100, w = CW - 20, h = 90;
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
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
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
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
  onEnter() { this.blink = 0; },
  update(dt) { this.blink += dt; },
  onKey(key) {
    if (key === "Enter" || key === " ") {
      if (PKMN.hasSave()) {
        PKMN.loadGame();
        PKMN.switchState("overworld");
      } else {
        PKMN.switchState("starter");
      }
    }
  },
  render(ctx) {
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#f4d03f";
    ctx.font = "bold 36px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Pokémon", CW / 2, 140);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Édition Perso", CW / 2, 175);
    if (Math.floor(this.blink / 0.6) % 2 === 0) {
      ctx.font = "18px sans-serif";
      ctx.fillText(PKMN.hasSave() ? "Appuie sur Entrée pour continuer" : "Appuie sur Entrée pour commencer", CW / 2, 260);
    }
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#bbb";
    ctx.fillText("Projet fan perso — Pokémon © Nintendo/Game Freak", CW / 2, CH - 20);
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
        PKMN.Player.mapKey = PKMN.START_MAP;
        const start = PKMN.MAPS[PKMN.START_MAP].playerStart;
        PKMN.Player.x = start.x;
        PKMN.Player.y = start.y;
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
  onEnter() { this.sel = 0; this.returnTo = this.returnTo || "overworld"; },
  onKey(key) {
    const n = PKMN.Player.party.length;
    if (key === "ArrowDown") this.sel = (this.sel + 1) % n;
    if (key === "ArrowUp") this.sel = (this.sel - 1 + n) % n;
    if (key === "Escape" || key === "Enter" || key === " ") PKMN.switchState(this.returnTo);
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

    PKMN.drawTextBox(ctx, "Échap pour revenir.", { noPrompt: true });
  }
};

// ---------- Pokédex ----------
PKMN.PokedexState = {
  onEnter() { this.scroll = 0; },
  onKey(key) {
    if (key === "ArrowDown") this.scroll = Math.min(this.scroll + 1, 151 - 8);
    if (key === "ArrowUp") this.scroll = Math.max(this.scroll - 1, 0);
    if (key === "Escape" || key === "Enter" || key === " ") PKMN.switchState("overworld");
  },
  render(ctx) {
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    const caught = PKMN.Player.pokedexCaught.size;
    ctx.fillText(`Pokédex — ${caught}/151 capturés`, 16, 26);

    for (let i = 0; i < 8; i++) {
      const id = this.scroll + i + 1;
      if (id > 151) break;
      const species = PKMN.POKEDEX[id];
      const seen = PKMN.Player.pokedexSeen.has(id);
      const caughtIt = PKMN.Player.pokedexCaught.has(id);
      const y = 44 + i * 42;
      ctx.fillStyle = caughtIt ? "#2ecc71" : seen ? "#7f8c8d" : "#34495e";
      ctx.fillRect(8, y, CW - 16, 36);
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
    PKMN.drawTextBox(ctx, "Flèches haut/bas pour naviguer, Échap pour revenir.", { noPrompt: true });
  }
};
