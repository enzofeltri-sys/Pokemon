// État "monde ouvert": déplacement du joueur sur la tilemap, collisions,
// téléportations (portes/routes), rencontres sauvages, tuile de soin.
window.PKMN = window.PKMN || {};

const TILE = 32;

// Hachage déterministe (même tuile = même texture à chaque rendu, pas de scintillement)
function tileSeed(tx, ty) {
  let h = (tx * 374761393 + ty * 668265263) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 1000) / 1000;
}

function drawGrass(ctx, px, py, seed) {
  ctx.fillStyle = "#7cb342";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = "#69a032";
  const spots = [[6, 8], [20, 5], [11, 22], [24, 18], [16, 12], [4, 24]];
  const n = 2 + Math.floor(seed * 4);
  for (let i = 0; i < n; i++) {
    const [dx, dy] = spots[i % spots.length];
    ctx.fillRect(px + dx, py + dy, 2, 3);
  }
}

function drawTallGrass(ctx, px, py, seed) {
  ctx.fillStyle = "#4c8c3f";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.strokeStyle = "#2e5f27";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  const tufts = [[6, 22], [13, 18], [20, 24], [26, 16], [9, 10], [23, 8]];
  const n = 4 + Math.floor(seed * 2);
  for (let i = 0; i < n; i++) {
    const [dx, dy] = tufts[i % tufts.length];
    ctx.beginPath();
    ctx.moveTo(px + dx - 3, py + dy + 6);
    ctx.lineTo(px + dx, py + dy - 2);
    ctx.lineTo(px + dx + 3, py + dy + 6);
    ctx.stroke();
  }
}

function drawTree(ctx, px, py) {
  ctx.fillStyle = "#5a8f3c";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = "#5d4529";
  ctx.fillRect(px + TILE / 2 - 3, py + TILE - 11, 6, 11);
  ctx.fillStyle = "#1b5e20";
  ctx.beginPath(); ctx.arc(px + TILE * 0.5, py + TILE * 0.36, TILE * 0.42, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#2d7a31";
  ctx.beginPath(); ctx.arc(px + TILE * 0.32, py + TILE * 0.28, TILE * 0.24, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + TILE * 0.68, py + TILE * 0.30, TILE * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#388e3c";
  ctx.beginPath(); ctx.arc(px + TILE * 0.5, py + TILE * 0.20, TILE * 0.2, 0, Math.PI * 2); ctx.fill();
}

function drawWallBrick(ctx, px, py) {
  ctx.fillStyle = "#aab4bd";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.strokeStyle = "#7d8894";
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
  ctx.beginPath();
  ctx.moveTo(px, py + TILE / 2); ctx.lineTo(px + TILE, py + TILE / 2);
  ctx.moveTo(px + TILE / 2, py); ctx.lineTo(px + TILE / 2, py + TILE / 2);
  ctx.stroke();
}

function drawPath(ctx, px, py, seed) {
  ctx.fillStyle = "#dcc190";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = "#cdae7a";
  const spots = [[8, 8], [20, 18], [14, 26], [24, 6]];
  const n = 1 + Math.floor(seed * 2);
  for (let i = 0; i < n; i++) { const [dx, dy] = spots[i % spots.length]; ctx.fillRect(px + dx, py + dy, 2, 2); }
}

function drawFloor(ctx, px, py, tx, ty) {
  const light = (tx + ty) % 2 === 0;
  ctx.fillStyle = light ? "#f2f2f2" : "#e2e6ea";
  ctx.fillRect(px, py, TILE, TILE);
}

function drawDoor(ctx, px, py, indoor) {
  drawPath(ctx, px, py, 0.3);
  ctx.fillStyle = "#a13d3d";
  ctx.fillRect(px + 1, py, TILE - 2, 9);
  ctx.fillStyle = "#7a2e2e";
  ctx.fillRect(px + 1, py + 7, TILE - 2, 3);
  ctx.fillStyle = "#5d3a1a";
  ctx.fillRect(px + 7, py + 11, TILE - 14, TILE - 13);
  ctx.fillStyle = "#7a4a22";
  ctx.fillRect(px + 7, py + 11, TILE - 14, 3);
  ctx.fillStyle = "#f4d03f";
  ctx.beginPath(); ctx.arc(px + TILE - 12, py + TILE - 12, 1.6, 0, Math.PI * 2); ctx.fill();
}

function drawHeal(ctx, px, py) {
  ctx.fillStyle = "#eaf6ff";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.strokeStyle = "#4fc3f7";
  ctx.lineWidth = 2;
  ctx.strokeRect(px + 3, py + 3, TILE - 6, TILE - 6);
  ctx.fillStyle = "#e57373";
  ctx.fillRect(px + TILE / 2 - 2, py + 8, 4, TILE - 16);
  ctx.fillRect(px + 8, py + TILE / 2 - 2, TILE - 16, 4);
}

function drawWarp(ctx, px, py, dir) {
  drawPath(ctx, px, py, 0.4);
  ctx.fillStyle = "#8d6e63";
  ctx.beginPath();
  if (dir === ">") {
    ctx.moveTo(px + 10, py + 8); ctx.lineTo(px + 24, py + 16); ctx.lineTo(px + 10, py + 24);
  } else {
    ctx.moveTo(px + 22, py + 8); ctx.lineTo(px + 8, py + 16); ctx.lineTo(px + 22, py + 24);
  }
  ctx.closePath();
  ctx.fill();
}

function drawPlayerSprite(ctx, screenX, screenY, facing, bob) {
  const cx = screenX + TILE / 2;
  const topY = screenY + bob;
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(cx, screenY + TILE - 5, 10, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(cx - 6, topY + TILE * 0.72, 5, 9);
  ctx.fillRect(cx + 1, topY + TILE * 0.72, 5, 9);

  ctx.fillStyle = "#f2c29a";
  ctx.fillRect(cx - 11, topY + TILE * 0.46, 3, 11);
  ctx.fillRect(cx + 8, topY + TILE * 0.46, 3, 11);

  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(cx - 8, topY + TILE * 0.40, 16, 15);

  ctx.fillStyle = "#f2c29a";
  ctx.beginPath(); ctx.arc(cx, topY + TILE * 0.30, 8, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#c0392b";
  ctx.beginPath(); ctx.arc(cx, topY + TILE * 0.24, 8.5, Math.PI, 0); ctx.fill();
  ctx.fillRect(cx - 8.5, topY + TILE * 0.24 - 1, 17, 3);
  if (facing === "down") ctx.fillRect(cx - 3, topY + TILE * 0.24 - 5, 6, 4);

  ctx.fillStyle = "#241a14";
  if (facing === "down") { ctx.fillRect(cx - 4, topY + TILE * 0.30, 2, 2); ctx.fillRect(cx + 2, topY + TILE * 0.30, 2, 2); }
  else if (facing === "left") { ctx.fillRect(cx - 5, topY + TILE * 0.30, 2, 2); }
  else if (facing === "right") { ctx.fillRect(cx + 3, topY + TILE * 0.30, 2, 2); }
}

PKMN.OverworldState = {
  onEnter() {
    this.moving = false;
    this.moveT = 0;
    this.fromX = PKMN.Player.x;
    this.fromY = PKMN.Player.y;
    this.facing = "down";
    this.menuOpen = false;
    this.menuSel = 0;
    this.message = null;
  },

  currentMap() {
    return PKMN.MAPS[PKMN.Player.mapKey];
  },

  tileAt(map, x, y) {
    const row = map.tiles[y];
    if (!row || x < 0 || x >= row.length) return "#";
    return row[x];
  },

  onKey(key) {
    if (this.message) {
      if (key === "Enter" || key === " ") this.message = null;
      return;
    }
    if (this.menuOpen) {
      const items = ["Équipe", "Pokédex", "Sauvegarder", "Fermer"];
      if (key === "ArrowDown") this.menuSel = (this.menuSel + 1) % items.length;
      if (key === "ArrowUp") this.menuSel = (this.menuSel - 1 + items.length) % items.length;
      if (key === "Escape") this.menuOpen = false;
      if (key === "Enter" || key === " ") {
        const choice = items[this.menuSel];
        this.menuOpen = false;
        if (choice === "Équipe") { PKMN.PartyState.returnTo = "overworld"; PKMN.switchState("party"); }
        else if (choice === "Pokédex") PKMN.switchState("pokedex");
        else if (choice === "Sauvegarder") { PKMN.saveGame(); this.message = "Partie sauvegardée !"; }
      }
      return;
    }
    if (this.moving) return;
    if (key === "Enter") { this.menuOpen = true; this.menuSel = 0; return; }

    const dirs = { ArrowUp: [0, -1, "up"], ArrowDown: [0, 1, "down"], ArrowLeft: [-1, 0, "left"], ArrowRight: [1, 0, "right"] };
    const d = dirs[key];
    if (!d) return;
    this.facing = d[2];
    const map = this.currentMap();
    const nx = PKMN.Player.x + d[0], ny = PKMN.Player.y + d[1];
    const tile = this.tileAt(map, nx, ny);
    const info = PKMN.TILE_INFO[tile] || { blocked: true };
    if (info.blocked) return;

    this.fromX = PKMN.Player.x; this.fromY = PKMN.Player.y;
    PKMN.Player.x = nx; PKMN.Player.y = ny;
    this.moving = true;
    this.moveT = 0;
    this._arrivalTile = tile;
    this._arrivalMap = map;
  },

  update(dt) {
    if (this.moving) {
      this.moveT += dt / 0.14;
      if (this.moveT >= 1) {
        this.moveT = 1;
        this.moving = false;
        this.onArrive(this._arrivalMap, this._arrivalTile);
      }
    }
  },

  onArrive(map, tile) {
    const info = PKMN.TILE_INFO[tile] || {};
    if (info.warp) {
      const key = `${PKMN.Player.x},${PKMN.Player.y}`;
      const warp = map.warps[key];
      if (warp) {
        PKMN.Player.mapKey = warp.toMap;
        PKMN.Player.x = warp.x;
        PKMN.Player.y = warp.y;
        this.fromX = warp.x; this.fromY = warp.y;
        return;
      }
    }
    if (info.heal) {
      const hurt = PKMN.Player.party.some((m) => m.hp < m.maxHp || m.status);
      PKMN.healParty(PKMN.Player.party);
      if (hurt) this.message = "Votre équipe est soignée !";
      return;
    }
    if (info.grass && Math.random() < (map.encounterRate || 0)) {
      this.startEncounter(map);
    }
  },

  startEncounter(map) {
    const table = map.encounterTable || [];
    if (!table.length) return;
    const totalW = table.reduce((s, e) => s + e.weight, 0);
    let r = Math.random() * totalW;
    let pick = table[0];
    for (const e of table) { if (r < e.weight) { pick = e; break; } r -= e.weight; }
    const level = pick.min + Math.floor(Math.random() * (pick.max - pick.min + 1));
    PKMN.Player.pokedexSeen.add(pick.id);
    PKMN.BattleState.startWild(pick.id, level);
    PKMN.switchState("battle");
  },

  render(ctx) {
    const map = this.currentMap();
    const mapW = map.tiles[0].length, mapH = map.tiles.length;
    const viewCols = Math.ceil(PKMN.CANVAS_W / TILE) + 1;
    const viewRows = Math.ceil(PKMN.CANVAS_H / TILE) + 1;

    const px = this.moving ? this.fromX + (PKMN.Player.x - this.fromX) * this.moveT : PKMN.Player.x;
    const py = this.moving ? this.fromY + (PKMN.Player.y - this.fromY) * this.moveT : PKMN.Player.y;

    let camX = px * TILE + TILE / 2 - PKMN.CANVAS_W / 2;
    let camY = py * TILE + TILE / 2 - PKMN.CANVAS_H / 2;
    camX = Math.max(0, Math.min(camX, Math.max(0, mapW * TILE - PKMN.CANVAS_W)));
    camY = Math.max(0, Math.min(camY, Math.max(0, mapH * TILE - PKMN.CANVAS_H)));

    ctx.fillStyle = map.indoor ? "#e2e6ea" : "#5a8f3c";
    ctx.fillRect(0, 0, PKMN.CANVAS_W, PKMN.CANVAS_H);

    const startCol = Math.floor(camX / TILE), startRow = Math.floor(camY / TILE);
    for (let r = 0; r <= viewRows; r++) {
      for (let c = 0; c <= viewCols; c++) {
        const tx = startCol + c, ty = startRow + r;
        if (tx < 0 || ty < 0 || ty >= mapH || tx >= mapW) continue;
        const tile = map.tiles[ty][tx];
        const sx = tx * TILE - camX, sy = ty * TILE - camY;
        const seed = tileSeed(tx, ty);
        if (tile === "#") { map.indoor ? drawWallBrick(ctx, sx, sy) : drawTree(ctx, sx, sy); }
        else if (tile === '"') drawTallGrass(ctx, sx, sy, seed);
        else if (tile === "C" || tile === "D") drawDoor(ctx, sx, sy, map.indoor);
        else if (tile === "H") drawHeal(ctx, sx, sy);
        else if (tile === "<" || tile === ">") drawWarp(ctx, sx, sy, tile);
        else if (map.indoor) drawFloor(ctx, sx, sy, tx, ty);
        else drawGrass(ctx, sx, sy, seed);
      }
    }

    // Joueur
    const screenX = px * TILE - camX, screenY = py * TILE - camY;
    const bob = this.moving ? -Math.abs(Math.sin(this.moveT * Math.PI)) * 3 : 0;
    drawPlayerSprite(ctx, screenX, screenY, this.facing, bob);

    // HUD nom de la zone
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, 160, 24);
    ctx.fillStyle = "#fff";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(map.name, 8, 16);

    if (this.menuOpen) {
      PKMN.drawMenu(ctx, PKMN.CANVAS_W - 160, 10, ["Équipe", "Pokédex", "Sauvegarder", "Fermer"], this.menuSel);
    }
    if (this.message) {
      PKMN.drawTextBox(ctx, this.message);
    }
  }
};
