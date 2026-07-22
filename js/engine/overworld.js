// État "monde ouvert": déplacement du joueur sur la tilemap, collisions,
// téléportations (portes/routes), rencontres sauvages, tuile de soin.
window.PKMN = window.PKMN || {};

const TILE = 32;

const TILE_COLORS = {
  "#": "#1e4d2b",
  ".": "#8bc34a",
  '"': "#4c8c3f",
  C: "#8d6e63",
  D: "#8d6e63",
  H: "#81d4fa",
  "<": "#c8b273",
  ">": "#c8b273"
};

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

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, PKMN.CANVAS_W, PKMN.CANVAS_H);

    const startCol = Math.floor(camX / TILE), startRow = Math.floor(camY / TILE);
    for (let r = 0; r <= viewRows; r++) {
      for (let c = 0; c <= viewCols; c++) {
        const tx = startCol + c, ty = startRow + r;
        if (tx < 0 || ty < 0 || ty >= mapH || tx >= mapW) continue;
        const tile = map.tiles[ty][tx];
        ctx.fillStyle = TILE_COLORS[tile] || "#8bc34a";
        ctx.fillRect(tx * TILE - camX, ty * TILE - camY, TILE, TILE);
        if (tile === "C" || tile === "D") {
          ctx.fillStyle = "#4e342e";
          ctx.fillRect(tx * TILE - camX + 6, ty * TILE - camY + 4, TILE - 12, TILE - 8);
        }
      }
    }

    // Joueur
    const screenX = px * TILE - camX, screenY = py * TILE - camY;
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(screenX + TILE / 2, screenY + TILE / 2, TILE / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    const dirOffset = { up: [0, -6], down: [0, 6], left: [-6, 0], right: [6, 0] }[this.facing];
    ctx.beginPath();
    ctx.arc(screenX + TILE / 2 + dirOffset[0], screenY + TILE / 2 + dirOffset[1], 3, 0, Math.PI * 2);
    ctx.fill();

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
