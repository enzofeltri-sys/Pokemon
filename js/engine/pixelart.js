// Palette et petites aides de rendu partagées par tous les écrans, pour un
// look pixel-art cohérent (façon jeux Pokémon portables) au lieu d'aplats de
// couleur isolés dans chaque fichier.
window.PKMN = window.PKMN || {};

PKMN.PALETTE = {
  grassLight: "#8bc24a",
  grassMid: "#74ad3c",
  grassDark: "#5c9130",
  tallGrassLight: "#4f8f42",
  tallGrassDark: "#356027",
  waterLight: "#6db8f2",
  waterMid: "#3d84cf",
  waterDark: "#285f9e",
  pathLight: "#e6cd9a",
  pathMid: "#d4b378",
  pathDark: "#b6935a",
  wallLight: "#c3cdd6",
  wallMid: "#a3aeb8",
  wallDark: "#7c8794",
  floorLight: "#f4f2ea",
  floorDark: "#e3e1d6",
  caveFloorLight: "#544c68",
  caveFloorDark: "#423a56",
  caveWallLight: "#332c44",
  caveWallDark: "#241f30",
  snowLight: "#f4f8fb",
  snowMid: "#d9e6ee",
  woodDark: "#5d4025",
  woodMid: "#7a5632",
  roofRed: "#b5453a",
  roofRedDark: "#8c332a",

  ink: "#1c2030",
  paper: "#fbf7ea",
  // Palette chaude reprise de la boîte de dialogue Sprout Lands (Cup Nooble,
  // usage non-commercial credité) au lieu du bleu/gris froid d'origine.
  uiBorderDark: "#6b4226",
  uiBorderAccent: "#aa7959",
  uiFill: "#f3e5c2",
  uiAccent: "#f4c542",
  uiAccentDark: "#c99a1f"
};

// Boîte façon jeux portables: bord sombre épais + liseré coloré + fond clair.
// Remplace le simple panneau arrondi générique par quelque chose de plus
// proche d'une vraie interface de jeu.
PKMN.drawBorderedBox = function (ctx, x, y, w, h, opts) {
  opts = opts || {};
  const r = opts.r ?? 5;
  const outer = opts.outer || PKMN.PALETTE.uiBorderDark;
  const accent = opts.accent || PKMN.PALETTE.uiBorderAccent;
  const fill = opts.fill || PKMN.PALETTE.uiFill;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  PKMN.roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = outer;
  ctx.fill();
  ctx.restore();
  PKMN.roundRectPath(ctx, x + 3, y + 3, w - 6, h - 6, Math.max(2, r - 2));
  ctx.fillStyle = accent;
  ctx.fill();
  PKMN.roundRectPath(ctx, x + 5, y + 5, w - 10, h - 10, Math.max(1, r - 3));
  ctx.fillStyle = fill;
  ctx.fill();
};

// Petit triangle de curseur (remplace le "➤ " textuel) — plus net à l'échelle pixel.
PKMN.drawCursorTriangle = function (ctx, x, y, color) {
  ctx.fillStyle = color || PKMN.PALETTE.ink;
  ctx.beginPath();
  ctx.moveTo(x, y - 5);
  ctx.lineTo(x + 8, y);
  ctx.lineTo(x, y + 5);
  ctx.closePath();
  ctx.fill();
};

// Triangle clignotant en bas d'une boîte de texte, pour indiquer qu'on peut continuer.
// Anime le rebond de la flèche "appuie pour continuer" à partir de la
// feuille de sprite Sprout Lands (7 frames, 16x16, sprites/ui/advance_indicator.png).
// Retombe sur le triangle dessiné à la main si l'image n'est pas dispo (hors-ligne).
PKMN.drawAdvanceIndicator = function (ctx, x, y, t) {
  const entry = PKMN.getSpriteImage("./sprites/ui/advance_indicator.png");
  if (entry.status === "ok" && entry.img.naturalWidth === 112 && entry.img.naturalHeight === 16) {
    const frame = Math.floor((t || 0) * 8) % 7;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(entry.img, frame * 16, 0, 16, 16, x - 8, y - 8, 16, 16);
    return;
  }
  const bob = Math.sin((t || 0) * 6) * 2;
  ctx.fillStyle = PKMN.PALETTE.ink;
  ctx.beginPath();
  ctx.moveTo(x - 5, y + bob - 3);
  ctx.lineTo(x + 5, y + bob - 3);
  ctx.lineTo(x, y + bob + 3);
  ctx.closePath();
  ctx.fill();
};

// Petit badge coloré (façon jeux modernes) pour afficher un type au lieu
// d'un texte brut "feu/vol". Renvoie sa largeur pour empiler plusieurs
// badges côte à côte (types primaire + secondaire).
PKMN.drawTypeBadge = function (ctx, type, x, y, opts) {
  opts = opts || {};
  const label = PKMN.TYPE_LABELS[type] || type.toUpperCase();
  const color = PKMN.TYPE_COLORS[type] || "#999";
  const fontSize = opts.fontSize || 10;
  ctx.font = `bold ${fontSize}px Silkscreen, sans-serif`;
  const textW = ctx.measureText(label).width;
  const padX = 6;
  const w = textW + padX * 2;
  const h = opts.h || fontSize + 8;
  PKMN.roundRectPath(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
  ctx.textBaseline = "alphabetic";
  return w;
};

// Dessine 1 ou 2 badges de type côte à côte à partir d'un tableau de types.
PKMN.drawTypeBadges = function (ctx, types, x, y, opts) {
  let cx = x;
  for (const t of types) {
    cx += PKMN.drawTypeBadge(ctx, t, cx, y, opts) + 4;
  }
  return cx - x;
};

// Semis de petits pixels déterministes (même seed = mêmes points), pour
// texturer une tuile sans qu'elle scintille d'une image à l'autre.
PKMN.speckle = function (ctx, px, py, seed, spots, count, color, size) {
  ctx.fillStyle = color;
  const n = Math.min(spots.length, count);
  for (let i = 0; i < n; i++) {
    const [dx, dy] = spots[(i + Math.floor(seed * 97)) % spots.length];
    ctx.fillRect(px + dx, py + dy, size, size);
  }
};
