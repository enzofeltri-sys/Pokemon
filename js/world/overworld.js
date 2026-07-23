// État "monde ouvert": déplacement du joueur sur la tilemap, collisions,
// téléportations (portes/routes), rencontres sauvages, tuile de soin.
window.PKMN = window.PKMN || {};

const TILE = 32;

// Teinte jour/nuit d'après l'heure réelle de l'appareil: nuit profonde,
// aube/crépuscule chaud, ou rien en plein jour. Renvoie un rgba() prêt à
// l'emploi ou null.
function nightTintStyle() {
  const h = new Date().getHours();
  if (h >= 22 || h < 5) return "rgba(30,30,70,0.45)";
  if (h >= 19 || h < 7) return "rgba(255,140,60,0.18)";
  return null;
}

// Hachage déterministe (même tuile = même texture à chaque rendu, pas de scintillement)
function tileSeed(tx, ty) {
  let h = (tx * 374761393 + ty * 668265263) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 1000) / 1000;
}

function drawGrass(ctx, px, py, seed) {
  const P = PKMN.PALETTE;
  ctx.fillStyle = P.grassMid;
  ctx.fillRect(px, py, TILE, TILE);
  // Bande d'ombre en haut de la tuile pour casser le plat, façon dénivelé léger.
  ctx.fillStyle = P.grassDark;
  ctx.fillRect(px, py, TILE, 4);
  ctx.fillStyle = P.grassLight;
  const spots = [[6, 8], [20, 5], [11, 22], [24, 18], [16, 12], [4, 24], [27, 9], [9, 27]];
  const n = 3 + Math.floor(seed * 4);
  for (let i = 0; i < n; i++) {
    const [dx, dy] = spots[i % spots.length];
    ctx.fillRect(px + dx, py + dy, 3, 2);
  }
  ctx.fillStyle = P.grassDark;
  const shadows = [[14, 6], [3, 16], [22, 24]];
  const ns = 1 + Math.floor(seed * 2);
  for (let i = 0; i < ns; i++) {
    const [dx, dy] = shadows[i % shadows.length];
    ctx.fillRect(px + dx, py + dy, 2, 2);
  }
}

function drawTallGrass(ctx, px, py, seed, time) {
  const P = PKMN.PALETTE;
  ctx.fillStyle = P.tallGrassDark;
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = P.tallGrassLight;
  ctx.fillRect(px, py, TILE, TILE - 6);
  ctx.strokeStyle = P.tallGrassDark;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  const tufts = [[6, 22], [13, 18], [20, 24], [26, 16], [9, 10], [23, 8], [3, 6], [29, 26]];
  const n = 5 + Math.floor(seed * 3);
  const t = time || 0;
  for (let i = 0; i < n; i++) {
    const [dx, dy] = tufts[i % tufts.length];
    const sway = Math.sin(t * 2.2 + seed * 6.28 + i * 1.7) * 2.5;
    ctx.beginPath();
    ctx.moveTo(px + dx - 3, py + dy + 6);
    ctx.lineTo(px + dx + sway, py + dy - 3);
    ctx.lineTo(px + dx + 3, py + dy + 6);
    ctx.stroke();
  }
  ctx.strokeStyle = "#6bab52";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < n; i += 2) {
    const [dx, dy] = tufts[i % tufts.length];
    const sway = Math.sin(t * 2.2 + seed * 6.28 + i * 1.7) * 2.5;
    ctx.beginPath();
    ctx.moveTo(px + dx, py + dy + 5);
    ctx.lineTo(px + dx + sway, py + dy - 1);
    ctx.stroke();
  }
}

function drawTree(ctx, px, py, seed, time) {
  const P = PKMN.PALETTE;
  ctx.fillStyle = P.grassMid;
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath(); ctx.ellipse(px + TILE * 0.5, py + TILE - 6, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = P.woodDark;
  ctx.fillRect(px + TILE / 2 - 3, py + TILE - 11, 6, 11);
  ctx.fillStyle = P.woodMid;
  ctx.fillRect(px + TILE / 2 - 3, py + TILE - 11, 2, 11);

  // La ramure se balance doucement autour du sommet du tronc (le tronc, lui,
  // ne bouge pas) — chaque arbre est déphasé via son seed pour ne pas onduler
  // tous ensemble comme un seul bloc.
  const pivotX = px + TILE * 0.5, pivotY = py + TILE - 11;
  const sway = Math.sin((time || 0) * 1.4 + (seed || 0) * 6.28) * 0.05;
  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(sway);
  ctx.translate(-pivotX, -pivotY);
  ctx.fillStyle = "#215c28";
  ctx.beginPath(); ctx.arc(px + TILE * 0.5, py + TILE * 0.36, TILE * 0.42, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#2d7a31";
  ctx.beginPath(); ctx.arc(px + TILE * 0.32, py + TILE * 0.28, TILE * 0.24, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + TILE * 0.68, py + TILE * 0.30, TILE * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#42975f";
  ctx.beginPath(); ctx.arc(px + TILE * 0.42, py + TILE * 0.20, TILE * 0.17, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath(); ctx.arc(px + TILE * 0.36, py + TILE * 0.16, TILE * 0.09, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawWater(ctx, px, py, seed) {
  const P = PKMN.PALETTE;
  const grad = ctx.createLinearGradient(px, py, px, py + TILE);
  grad.addColorStop(0, P.waterMid);
  grad.addColorStop(1, P.waterDark);
  ctx.fillStyle = grad;
  ctx.fillRect(px, py, TILE, TILE);
  ctx.strokeStyle = P.waterLight;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  const waves = [[6, 10], [18, 8], [10, 20], [22, 18], [4, 26], [26, 27]];
  const n = 3 + Math.floor(seed * 3);
  for (let i = 0; i < n; i++) {
    const [dx, dy] = waves[i % waves.length];
    ctx.beginPath();
    ctx.moveTo(px + dx, py + dy);
    ctx.quadraticCurveTo(px + dx + 4, py + dy - 3, px + dx + 8, py + dy);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(px + 4, py + 4, 3, 3);
}

function drawWallBrick(ctx, px, py) {
  const P = PKMN.PALETTE;
  ctx.fillStyle = P.wallMid;
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = P.roofRed;
  ctx.fillRect(px, py, TILE, 6);
  ctx.fillStyle = P.roofRedDark;
  ctx.fillRect(px, py + 5, TILE, 2);
  ctx.strokeStyle = P.wallDark;
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 8.5, TILE - 1, TILE - 9);
  ctx.beginPath();
  ctx.moveTo(px, py + TILE * 0.62); ctx.lineTo(px + TILE, py + TILE * 0.62);
  ctx.moveTo(px + TILE / 2, py + 8); ctx.lineTo(px + TILE / 2, py + TILE * 0.62);
  ctx.stroke();
  ctx.fillStyle = P.wallLight;
  ctx.fillRect(px + 2, py + 10, TILE - 4, 2);
}

function drawPath(ctx, px, py, seed) {
  const P = PKMN.PALETTE;
  ctx.fillStyle = P.pathMid;
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = P.pathDark;
  const spots = [[8, 8], [20, 18], [14, 26], [24, 6], [3, 20], [27, 24]];
  const n = 2 + Math.floor(seed * 3);
  for (let i = 0; i < n; i++) { const [dx, dy] = spots[i % spots.length]; ctx.fillRect(px + dx, py + dy, 2, 2); }
  ctx.fillStyle = P.pathLight;
  const hi = [[12, 12], [22, 22], [5, 6]];
  const nh = 1 + Math.floor(seed * 2);
  for (let i = 0; i < nh; i++) { const [dx, dy] = hi[i % hi.length]; ctx.fillRect(px + dx, py + dy, 2, 2); }
}

function drawFloor(ctx, px, py, tx, ty) {
  const P = PKMN.PALETTE;
  const light = (tx + ty) % 2 === 0;
  ctx.fillStyle = light ? P.floorLight : P.floorDark;
  ctx.fillRect(px, py, TILE, TILE);
  ctx.strokeStyle = "rgba(0,0,0,0.05)";
  ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
}

function drawCaveFloor(ctx, px, py, tx, ty) {
  const P = PKMN.PALETTE;
  const light = (tx + ty) % 2 === 0;
  ctx.fillStyle = light ? P.caveFloorLight : P.caveFloorDark;
  ctx.fillRect(px, py, TILE, TILE);
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
}

function drawCaveWall(ctx, px, py) {
  const P = PKMN.PALETTE;
  ctx.fillStyle = P.caveWallDark;
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = P.caveWallLight;
  ctx.fillRect(px, py, TILE, TILE * 0.6);
  ctx.strokeStyle = "#161320";
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
  ctx.fillStyle = "#463c5c";
  ctx.beginPath(); ctx.arc(px + TILE * 0.3, py + TILE * 0.4, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + TILE * 0.65, py + TILE * 0.6, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1a1626";
  ctx.beginPath(); ctx.arc(px + TILE * 0.7, py + TILE * 0.25, 3, 0, Math.PI * 2); ctx.fill();
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

function drawMart(ctx, px, py) {
  drawPath(ctx, px, py, 0.3);
  ctx.fillStyle = "#2d6ca1";
  ctx.fillRect(px + 1, py, TILE - 2, 9);
  ctx.fillStyle = "#1f4d78";
  ctx.fillRect(px + 1, py + 7, TILE - 2, 3);
  ctx.fillStyle = "#e8d3a2";
  ctx.fillRect(px + 6, py + 11, TILE - 12, TILE - 13);
  ctx.fillStyle = "#2d6ca1";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("$", px + TILE / 2, py + TILE - 8);
}

function drawPC(ctx, px, py) {
  ctx.fillStyle = "#455a64";
  ctx.fillRect(px + 5, py + 4, TILE - 10, TILE - 10);
  ctx.fillStyle = "#29434c";
  ctx.fillRect(px + 8, py + 7, TILE - 16, TILE - 20);
  ctx.fillStyle = "#4fc3f7";
  ctx.fillRect(px + 10, py + 9, TILE - 20, 4);
  ctx.fillStyle = "#cfd8dc";
  ctx.fillRect(px + 9, py + TILE - 12, TILE - 18, 4);
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

// Feuille de sprite du joueur (sprites/player.png): grille propre 3 colonnes
// (marche gauche / arrêt / marche droite) x 4 lignes (bas / gauche / droite /
// haut), 32x32 px par frame, fond transparent — même pitch que TILE, donc
// un blit direct sans mise à l'échelle. Tant que l'image n'est pas chargée
// (ou hors-ligne), on retombe sur le dessin procédural d'origine.
const PLAYER_SPRITE_URL = "./sprites/player.png";
const PLAYER_SHEET_ROWS = { down: 0, left: 1, right: 2, up: 3 };
const PLAYER_FRAME = 32;

function drawPlayerSprite(ctx, screenX, screenY, facing, bob, walkT, stepParity) {
  const entry = PKMN.getSpriteImage(PLAYER_SPRITE_URL);
  // Si une version différente de l'image traîne encore dans un cache
  // (service worker périmé, PWA pas relancée après une mise à jour...),
  // ses dimensions ne collent plus à la grille 3x4 attendue: mieux vaut
  // retomber sur le dessin procédural que découper une case vide au
  // hasard et afficher un joueur invisible.
  if (entry.status !== "ok" || entry.img.naturalWidth !== PLAYER_FRAME * 3 || entry.img.naturalHeight !== PLAYER_FRAME * 4) {
    drawPlayerSpriteProcedural(ctx, screenX, screenY, facing, bob, walkT, stepParity);
    return;
  }
  const row = PLAYER_SHEET_ROWS[facing] ?? 0;
  // Frame du milieu (arrêt) quand immobile, alternée gauche/droite en marchant.
  const col = !walkT ? 1 : (stepParity === 0 ? 0 : 2);

  const cx = screenX + TILE / 2;
  ctx.save();
  ctx.filter = "blur(1.2px)";
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(cx, screenY + TILE - 5, 10, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.img, col * PLAYER_FRAME, row * PLAYER_FRAME, PLAYER_FRAME, PLAYER_FRAME, screenX, screenY + bob, TILE, TILE);
}

function drawPlayerSpriteProcedural(ctx, screenX, screenY, facing, bob, walkT, stepParity) {
  const cx = screenX + TILE / 2;
  const topY = screenY + bob;
  ctx.save();
  ctx.filter = "blur(1.2px)";
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(cx, screenY + TILE - 5, 10, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Cycle de marche à 2 temps: la jambe "en l'air" se raccourcit et remonte
  // légèrement, l'autre reste plantée au sol — alterne à chaque pas complet.
  const phase = Math.sin((walkT || 0) * Math.PI);
  const liftA = stepParity === 0 ? 3 * phase : 0;
  const liftB = stepParity === 0 ? 0 : 3 * phase;
  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(cx - 6, topY + TILE * 0.72 + liftA * 0.4, 5, 9 - liftA);
  ctx.fillRect(cx + 1, topY + TILE * 0.72 + liftB * 0.4, 5, 9 - liftB);

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

const NPC_SKIN_TONES = ["#f2c29a", "#e8b184", "#caa06e", "#a06b45", "#7d4f30"];
const NPC_HAIR_COLORS = ["#241a14", "#4a2f1c", "#6b4423", "#8a6d3b", "#2c2c2c", "#7a3b2e"];

// Petit hash déterministe sur une chaîne, pour tirer une apparence stable
// (peau/cheveux) à partir de l'identifiant du PNJ — toujours le même
// personnage à chaque rendu, sans avoir à stocker ces choix dans les données.
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Dessine un PNJ comme un petit personnage (jambes, bras, torse, tête,
// cheveux) plutôt qu'un simple rond de couleur avec une lettre — même plan
// général que le sprite du joueur, avec une tenue et une carrure propres à
// chaque PNJ (déduites de sa couleur + d'un hash de son identifiant).
function drawNPCSprite(ctx, screenX, screenY, npc, legLift, facing) {
  if (npc._skin === undefined) {
    const h = hashStr(npc.id || npc.name || "npc");
    npc._skin = NPC_SKIN_TONES[h % NPC_SKIN_TONES.length];
    npc._hair = NPC_HAIR_COLORS[(h >> 3) % NPC_HAIR_COLORS.length];
  }
  const cx = screenX + TILE / 2;
  const topY = screenY;
  const shirt = npc.color || "#7f8c8d";

  ctx.save();
  ctx.filter = "blur(1.2px)";
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath(); ctx.ellipse(cx, screenY + TILE - 5, 10, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  const liftA = legLift && legLift.parity === 0 ? legLift.amount : 0;
  const liftB = legLift && legLift.parity !== 0 ? legLift.amount : 0;
  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(cx - 6, topY + TILE * 0.72 + liftA * 0.4, 5, 9 - liftA);
  ctx.fillRect(cx + 1, topY + TILE * 0.72 + liftB * 0.4, 5, 9 - liftB);

  ctx.fillStyle = npc._skin;
  ctx.fillRect(cx - 11, topY + TILE * 0.46, 3, 11);
  ctx.fillRect(cx + 8, topY + TILE * 0.46, 3, 11);

  ctx.fillStyle = shirt;
  ctx.fillRect(cx - 8, topY + TILE * 0.40, 16, 15);

  ctx.fillStyle = npc._skin;
  ctx.beginPath(); ctx.arc(cx, topY + TILE * 0.30, 8, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = npc._hair;
  ctx.beginPath(); ctx.arc(cx, topY + TILE * 0.245, 8.3, Math.PI, 0); ctx.fill();
  ctx.fillRect(cx - 8.3, topY + TILE * 0.245 - 1, 16.6, 3);

  ctx.fillStyle = "#241a14";
  const f = facing || "down";
  if (f === "down") { ctx.fillRect(cx - 4, topY + TILE * 0.30, 2, 2); ctx.fillRect(cx + 2, topY + TILE * 0.30, 2, 2); }
  else if (f === "left") { ctx.fillRect(cx - 5, topY + TILE * 0.30, 2, 2); }
  else if (f === "right") { ctx.fillRect(cx + 3, topY + TILE * 0.30, 2, 2); }
}

PKMN.OverworldState = {
  onEnter() {
    this.moving = false;
    this.moveT = 0;
    this.fromX = PKMN.Player.x;
    this.fromY = PKMN.Player.y;
    // Ne réinitialise l'orientation qu'à la toute première entrée: sinon, revenir
    // d'un combat ou d'un menu faisait toujours regarder vers le bas, empêchant de
    // reparler tout de suite au PNJ qu'on avait pourtant en face de soi.
    if (!this.facing) this.facing = "down";
    if (this.stepParity === undefined) this.stepParity = 0;
    if (this.time === undefined) this.time = 0;
    this.menuOpen = false;
    this.menuSel = 0;
    this.quickMenuOpen = false;
    this.quickMenuPhase = "list";
    this.quickSel = 0;
    this.quickItemSel = 0;
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

  npcsHere() {
    return PKMN.NPCS[PKMN.Player.mapKey] || [];
  },

  npcAt(x, y) {
    return this.npcsHere().find((n) => n.x === x && n.y === y) || null;
  },

  facingCoords() {
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[this.facing];
    return [PKMN.Player.x + d[0], PKMN.Player.y + d[1]];
  },

  pauseMenuItems() {
    return ["Équipe", "Sac", "Lien de Réserve", "Quêtes", "Pokédex", "Options", "Sauvegarder", "Fermer"];
  },

  quickMenuItems() {
    return ["Objet rapide", "Quête active", "Zone actuelle", "Lien de réserve", "Fermer"];
  },

  quickItemChoices() {
    const items = ["potion", "antidote", "revive", "repel"].filter((k) => (PKMN.Player.bag[k] || 0) > 0);
    items.push("retour");
    return items;
  },

  goToReserveLink() {
    const map = this.currentMap();
    if (map.noReserveLink) { this.message = "Indisponible ici."; return; }
    PKMN.switchState("pc");
  },

  chooseQuickMenu(choice) {
    if (choice === "Fermer") { this.quickMenuOpen = false; return; }
    if (choice === "Objet rapide") { this.quickMenuPhase = "pick_item"; this.quickItemSel = 0; return; }
    if (choice === "Quête active") {
      const activeId = Object.keys(PKMN.Player.quests).find((id) => PKMN.Player.quests[id].status === "active");
      this.quickMenuOpen = false;
      this.message = activeId ? PKMN.QUESTS[activeId].name : "Aucune quête active pour l'instant.";
      return;
    }
    if (choice === "Zone actuelle") {
      this.quickMenuOpen = false;
      this.message = this.currentMap().name;
      return;
    }
    if (choice === "Lien de réserve") { this.quickMenuOpen = false; this.goToReserveLink(); return; }
  },

  useQuickItem() {
    const key = PKMN.Player.quickItem;
    if (!key || !(PKMN.Player.bag[key] > 0)) {
      this.message = "Aucun objet assigné. Ouvre le menu Select pour en choisir un.";
      return;
    }
    if (key === "repel") {
      PKMN.Player.repelSteps = PKMN.ITEMS.repel.steps;
      PKMN.Player.bag.repel--;
      this.message = `Répulsif actif pour ${PKMN.ITEMS.repel.steps} pas !`;
    } else {
      const mon = PKMN.Player.firstAlive() || PKMN.Player.party[0];
      this.message = PKMN.applyItemToMon(key, mon);
    }
    PKMN.saveGame();
  },

  onKey(key) {
    if (this.message) {
      if (key === "Enter" || key === " " || key === "Escape") this.message = null;
      return;
    }
    if (this.quickMenuOpen) {
      if (this.quickMenuPhase === "list") {
        const items = this.quickMenuItems();
        if (key === "ArrowDown") this.quickSel = (this.quickSel + 1) % items.length;
        if (key === "ArrowUp") this.quickSel = (this.quickSel - 1 + items.length) % items.length;
        if (key === "Escape") this.quickMenuOpen = false;
        if (key === "Enter" || key === " ") this.chooseQuickMenu(items[this.quickSel]);
        return;
      }
      if (this.quickMenuPhase === "pick_item") {
        const items = this.quickItemChoices();
        if (key === "ArrowDown") this.quickItemSel = (this.quickItemSel + 1) % items.length;
        if (key === "ArrowUp") this.quickItemSel = (this.quickItemSel - 1 + items.length) % items.length;
        if (key === "Escape") this.quickMenuPhase = "list";
        if (key === "Enter" || key === " ") {
          const choice = items[this.quickItemSel];
          if (choice !== "retour") PKMN.Player.quickItem = choice;
          this.quickMenuOpen = false;
          this.quickMenuPhase = "list";
          PKMN.saveGame();
        }
        return;
      }
      return;
    }
    if (this.menuOpen) {
      const items = this.pauseMenuItems();
      if (key === "ArrowDown") this.menuSel = (this.menuSel + 1) % items.length;
      if (key === "ArrowUp") this.menuSel = (this.menuSel - 1 + items.length) % items.length;
      if (key === "Escape") this.menuOpen = false;
      if (key === "Enter" || key === " ") {
        const choice = items[this.menuSel];
        this.menuOpen = false;
        if (choice === "Équipe") { PKMN.PartyState.returnTo = "overworld"; PKMN.switchState("party"); }
        else if (choice === "Sac") PKMN.switchState("bag");
        else if (choice === "Lien de Réserve") this.goToReserveLink();
        else if (choice === "Quêtes") PKMN.switchState("quest");
        else if (choice === "Pokédex") PKMN.switchState("pokedex");
        else if (choice === "Options") PKMN.switchState("options");
        else if (choice === "Sauvegarder") { PKMN.saveGame(); this.message = "Partie sauvegardée !"; }
      }
      return;
    }
    if (this.moving) return;
    if (key === "Enter" || key === " ") {
      const [fx, fy] = this.facingCoords();
      const npc = this.npcAt(fx, fy);
      if (npc) { PKMN.DialogueState.startWith(npc); PKMN.switchState("dialogue"); }
      return;
    }
    if (key === "s") { this.menuOpen = true; this.menuSel = 0; return; }
    if (key === "Shift") { this.quickMenuOpen = true; this.quickMenuPhase = "list"; this.quickSel = 0; return; }
    if (key === "e") { this.useQuickItem(); return; }

    const dirs = { ArrowUp: [0, -1, "up"], ArrowDown: [0, 1, "down"], ArrowLeft: [-1, 0, "left"], ArrowRight: [1, 0, "right"] };
    const d = dirs[key];
    if (!d) return;
    this.facing = d[2];
    const map = this.currentMap();
    const nx = PKMN.Player.x + d[0], ny = PKMN.Player.y + d[1];
    const tile = this.tileAt(map, nx, ny);
    const info = PKMN.TILE_INFO[tile] || { blocked: true };
    if (info.blocked || this.npcAt(nx, ny)) return;

    this.fromX = PKMN.Player.x; this.fromY = PKMN.Player.y;
    PKMN.Player.x = nx; PKMN.Player.y = ny;
    this.moving = true;
    this.moveT = 0;
    this.stepParity = 1 - this.stepParity;
    this._arrivalTile = tile;
    this._arrivalMap = map;
  },

  update(dt) {
    this.time = (this.time || 0) + dt;
    if (this.transitionT > 0) this.transitionT = Math.max(0, this.transitionT - dt / 0.35);
    if (this.moving) {
      this.moveT += dt / 0.14;
      if (this.moveT >= 1) {
        this.moveT = 1;
        this.moving = false;
        this.onArrive(this._arrivalMap, this._arrivalTile);
      }
    }
    this.updateNpcWander(dt);
  },

  // Petite vie ambiante: chaque PNJ erre au hasard à un pas de sa position de
  // départ, avec un temps d'attente aléatoire entre deux pas, pour que le
  // monde ne semble pas figé. Ne touche jamais aux tuiles bloquées, à la
  // case du joueur, ni à celle visée par un autre PNJ.
  updateNpcWander(dt) {
    const map = this.currentMap();
    const npcs = this.npcsHere();
    for (const npc of npcs) {
      if (npc.noWander) continue;
      if (npc._homeX === undefined) {
        npc._homeX = npc.x;
        npc._homeY = npc.y;
        npc._wanderT = 1.5 + Math.random() * 3;
        npc._moving = false;
        npc._moveT = 0;
        npc._facing = npc.facing || "down";
        npc._stepParity = 0;
      }
      if (npc._moving) {
        npc._moveT += dt / 0.5;
        if (npc._moveT >= 1) {
          npc._moveT = 1;
          npc._moving = false;
          npc.x = npc._toX;
          npc.y = npc._toY;
        }
        continue;
      }
      npc._wanderT -= dt;
      if (npc._wanderT > 0) continue;
      npc._wanderT = 2 + Math.random() * 3;
      if (Math.random() < 0.5) continue; // reste immobile ce cycle-ci
      const dirs = [[0, -1, "up"], [0, 1, "down"], [-1, 0, "left"], [1, 0, "right"]];
      const [dx, dy, face] = dirs[Math.floor(Math.random() * 4)];
      const nx = npc.x + dx, ny = npc.y + dy;
      if (Math.abs(nx - npc._homeX) > 1 || Math.abs(ny - npc._homeY) > 1) continue;
      const info = PKMN.TILE_INFO[this.tileAt(map, nx, ny)] || { blocked: true };
      if (info.blocked) continue;
      if (nx === PKMN.Player.x && ny === PKMN.Player.y) continue;
      const occupied = npcs.some((o) => o !== npc && (
        (o.x === nx && o.y === ny) || (o._moving && o._toX === nx && o._toY === ny)
      ));
      if (occupied) continue;
      npc._fromX = npc.x; npc._fromY = npc.y;
      npc._toX = nx; npc._toY = ny;
      npc._facing = face;
      npc._moving = true;
      npc._moveT = 0;
      npc._stepParity = 1 - npc._stepParity;
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
        this.transitionT = 1; // fondu depuis le noir sur la nouvelle carte
        return;
      }
    }
    if (info.heal) {
      const hurt = PKMN.Player.party.some((m) => m.hp < m.maxHp || m.status);
      PKMN.healParty(PKMN.Player.party);
      const doorWarp = Object.values(map.warps)[0];
      if (doorWarp) PKMN.Player.lastCenter = { mapKey: doorWarp.toMap, x: doorWarp.x, y: doorWarp.y };
      if (hurt) this.message = "Votre équipe est soignée !";
      return;
    }
    if (info.mart) {
      PKMN.switchState("mart");
      return;
    }
    if (info.pc) {
      PKMN.switchState("pc");
      return;
    }
    if (info.grass) {
      if (PKMN.Player.repelSteps > 0) {
        PKMN.Player.repelSteps--;
      } else if (Math.random() < (map.encounterRate || 0)) {
        this.startEncounter(map);
      }
    }
  },

  startEncounter(map) {
    const table = map.encounterTable || [];
    if (!table.length) return;
    // Le poids de chaque espèce n'est pas authoré à la main: il découle de sa
    // rareté (stade d'évolution / légendaire) et de sa puissance brute
    // (PKMN.encounterWeight, js/data/balance.js) — seule la liste d'espèces
    // disponibles est propre à chaque route.
    const weights = table.map((e) => PKMN.encounterWeight(e.id));
    const totalW = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * totalW;
    let pick = table[0];
    for (let i = 0; i < table.length; i++) { if (r < weights[i]) { pick = table[i]; break; } r -= weights[i]; }
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

    ctx.fillStyle = map.indoor ? PKMN.PALETTE.floorDark : PKMN.PALETTE.grassMid;
    ctx.fillRect(0, 0, PKMN.CANVAS_W, PKMN.CANVAS_H);

    const startCol = Math.floor(camX / TILE), startRow = Math.floor(camY / TILE);
    for (let r = 0; r <= viewRows; r++) {
      for (let c = 0; c <= viewCols; c++) {
        const tx = startCol + c, ty = startRow + r;
        if (tx < 0 || ty < 0 || ty >= mapH || tx >= mapW) continue;
        const tile = map.tiles[ty][tx];
        const sx = tx * TILE - camX, sy = ty * TILE - camY;
        const seed = tileSeed(tx, ty);
        if (tile === "#") { map.cave ? drawCaveWall(ctx, sx, sy) : map.indoor ? drawWallBrick(ctx, sx, sy) : drawTree(ctx, sx, sy, seed, this.time); }
        else if (tile === '"') drawTallGrass(ctx, sx, sy, seed, this.time);
        else if (tile === "C" || tile === "D") drawDoor(ctx, sx, sy, map.indoor);
        else if (tile === "M") drawMart(ctx, sx, sy);
        else if (tile === "P") drawPC(ctx, sx, sy);
        else if (tile === "H") drawHeal(ctx, sx, sy);
        else if (tile === "<" || tile === ">") drawWarp(ctx, sx, sy, tile);
        else if (tile === "~") drawWater(ctx, sx, sy, seed);
        else if (map.cave) drawCaveFloor(ctx, sx, sy, tx, ty);
        else if (map.indoor) drawFloor(ctx, sx, sy, tx, ty);
        else drawGrass(ctx, sx, sy, seed);
      }
    }

    // PNJ
    for (const npc of this.npcsHere()) {
      const nx = npc._moving ? npc._fromX + (npc._toX - npc._fromX) * npc._moveT : npc.x;
      const ny = npc._moving ? npc._fromY + (npc._toY - npc._fromY) * npc._moveT : npc.y;
      const sx = nx * TILE - camX, sy = ny * TILE - camY;
      if (sx < -TILE || sy < -TILE || sx > PKMN.CANVAS_W || sy > PKMN.CANVAS_H) continue;
      const npcBob = npc._moving ? -Math.abs(Math.sin(npc._moveT * Math.PI)) * 2 : 0;
      const legLift = npc._moving ? { parity: npc._stepParity, amount: 3 * Math.sin(npc._moveT * Math.PI) } : null;
      drawNPCSprite(ctx, sx, sy + npcBob, npc, legLift, npc._facing);
    }

    // Joueur
    const screenX = px * TILE - camX, screenY = py * TILE - camY;
    const bob = this.moving ? -Math.abs(Math.sin(this.moveT * Math.PI)) * 3 : 0;
    drawPlayerSprite(ctx, screenX, screenY, this.facing, bob, this.moving ? this.moveT : 0, this.stepParity);

    // Teinte jour/nuit selon l'heure réelle de l'appareil (façon Or/Argent),
    // appliquée sous le HUD pour que celui-ci reste parfaitement lisible.
    const tint = nightTintStyle();
    if (tint) {
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, PKMN.CANVAS_W, PKMN.CANVAS_H);
    }

    // HUD nom de la zone
    PKMN.drawBorderedBox(ctx, 6, 6, Math.min(200, ctx.measureText(map.name).width + 40), 26, { r: 4 });
    ctx.fillStyle = PKMN.PALETTE.ink;
    ctx.font = "13px Silkscreen, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(map.name, 16, 24);

    if (this.menuOpen) {
      const items = this.pauseMenuItems();
      PKMN.drawMenu(ctx, PKMN.CANVAS_W - 160, 10, items, this.menuSel);
      const moneyY = 10 + items.length * 26 + 16 + 6;
      PKMN.drawBorderedBox(ctx, PKMN.CANVAS_W - 160, moneyY, 150, 30, { r: 4 });
      ctx.fillStyle = PKMN.PALETTE.uiAccentDark;
      ctx.font = "13px Silkscreen, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Argent: ${PKMN.Player.money}₽`, PKMN.CANVAS_W - 150, moneyY + 20);
    }
    if (this.quickMenuOpen) {
      if (this.quickMenuPhase === "list") {
        PKMN.drawMenu(ctx, PKMN.CANVAS_W - 190, 10, this.quickMenuItems(), this.quickSel, { w: 180 });
      } else {
        const items = this.quickItemChoices().map((k) => k === "retour" ? "Retour" : PKMN.ITEMS[k].name);
        PKMN.drawMenu(ctx, PKMN.CANVAS_W - 190, 10, items, this.quickItemSel, { w: 180 });
      }
    }
    if (this.message) {
      PKMN.drawTextBox(ctx, this.message);
    }

    // Fondu depuis le noir après un changement de carte (warp), pour éviter
    // le cut instantané. Couvre tout, HUD compris.
    if (this.transitionT > 0) {
      ctx.fillStyle = "#000";
      ctx.globalAlpha = this.transitionT;
      ctx.fillRect(0, 0, PKMN.CANVAS_W, PKMN.CANVAS_H);
      ctx.globalAlpha = 1;
    }
  }
};
