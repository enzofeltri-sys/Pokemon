// Chargement (et mise en cache) des sprites officiels depuis le dépôt public
// PokeAPI/sprites. Nécessite une connexion internet quand tu joues ; si l'image
// n'est pas disponible (hors-ligne), un placeholder coloré par type est affiché.
window.PKMN = window.PKMN || {};

PKMN._spriteCache = {};

PKMN.getSpriteImage = function (url) {
  let entry = PKMN._spriteCache[url];
  if (!entry) {
    const img = new Image();
    entry = { img, status: "loading" };
    img.onload = () => { entry.status = "ok"; };
    img.onerror = () => { entry.status = "error"; };
    img.src = url;
    PKMN._spriteCache[url] = entry;
  }
  return entry;
};

PKMN.drawPokemonSprite = function (ctx, speciesId, x, y, size, back) {
  const species = PKMN.POKEDEX[speciesId];
  const url = back ? species.spriteBack : species.spriteFront;
  const entry = PKMN.getSpriteImage(url);
  if (entry.status === "ok") {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(entry.img, x, y, size, size);
    return;
  }
  // Placeholder pendant le chargement ou si hors-ligne
  const color = PKMN.TYPE_COLORS[species.types[0]] || "#999";
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${Math.floor(size * 0.4)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(species.name[0], x + size / 2, y + size / 2 + 2);
  if (entry.status === "error") {
    ctx.font = `${Math.floor(size * 0.12)}px sans-serif`;
    ctx.fillText("(hors-ligne)", x + size / 2, y + size - 6);
  }
};
