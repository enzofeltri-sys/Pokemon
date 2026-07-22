// Combat au tour par tour contre un Pokémon sauvage.
window.PKMN = window.PKMN || {};

function stageMul(stage) {
  return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
}

function calcDamage(attacker, attackerSpecies, defender, defenderSpecies, move) {
  if (move.fixedDamage) return { dmg: move.fixedDamage, eff: 1 };
  const physical = move.cat === "physique";
  let atkBase = physical ? attacker.stats.atk : attacker.stats.spa;
  if (physical && attacker.status === "burn") atkBase = Math.floor(atkBase / 2);
  const defBase = physical ? defender.stats.def : defender.stats.spd;
  const atkStage = physical ? attacker.statStages.atk : attacker.statStages.spa;
  const defStage = physical ? defender.statStages.def : defender.statStages.spd;
  const atk = atkBase * stageMul(atkStage);
  const def = Math.max(1, defBase * stageMul(defStage));
  const level = attacker.level;
  const base = ((2 * level) / 5 + 2) * move.power * (atk / def) / 50 + 2;
  const stab = attackerSpecies.types.includes(move.type) ? 1.5 : 1;
  const eff = PKMN.getEffectiveness(move.type, defenderSpecies.types);
  const rand = 0.85 + Math.random() * 0.15;
  const dmg = Math.max(1, Math.floor(base * stab * eff * rand));
  return { dmg, eff };
}

// Formule des jeux originaux: XP de base de l'espèce × son niveau / 7.
function expReward(species, level) {
  return Math.max(1, Math.floor((species.baseExp * level) / 7));
}

function moneyReward(level) {
  return 15 + level * 3;
}

const STATUS_ABBR = { poison: "PSN", toxic: "TOX", paralysis: "PAR", burn: "BRN", sleep: "DOD", freeze: "GEL" };
function statusTag(mon) {
  const tag = mon.status ? STATUS_ABBR[mon.status] : (mon.confused > 0 ? "CNF" : "");
  return tag ? `  [${tag}]` : "";
}

PKMN.BattleState = {
  startWild(speciesId, level) {
    this.wild = PKMN.createPokemon(speciesId, level);
    this.wildIsNew = !PKMN.Player.pokedexCaught.has(speciesId);
  },

  onEnter() {
    this.active = PKMN.Player.firstAlive();
    for (const mon of PKMN.Player.party) { mon.statStages = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }; }
    this.wild.statStages = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    this.phase = "message";
    this.menuSel = 0;
    const wildSpecies = PKMN.speciesOf(this.wild);
    this.queue = [`Un ${wildSpecies.name} sauvage apparaît !`];
    this.onQueueDone = () => { this.phase = "main_menu"; this.menuSel = 0; };
  },

  showMessages(list, cb) {
    this.queue = list.slice();
    this.onQueueDone = cb || (() => { this.phase = "main_menu"; this.menuSel = 0; });
    this.phase = "message";
  },

  advance() {
    if (this.queue.length > 0) {
      this.queue.shift();
    }
    if (this.queue.length === 0) {
      const cb = this.onQueueDone;
      this.onQueueDone = null;
      if (cb) cb();
    }
  },

  onKey(key) {
    if (this.phase === "message") {
      if (key === "Enter" || key === " ") this.advance();
      return;
    }
    if (this.phase === "main_menu") {
      const items = ["Attaque", "Sac", "Pokémon", "Fuite"];
      if (key === "ArrowDown" || key === "ArrowRight") this.menuSel = (this.menuSel + 1) % items.length;
      if (key === "ArrowUp" || key === "ArrowLeft") this.menuSel = (this.menuSel - 1 + items.length) % items.length;
      if (key === "Enter" || key === " ") this.chooseMainMenu(items[this.menuSel]);
      return;
    }
    if (this.phase === "move_menu") {
      const n = this.active.moves.length;
      if (key === "ArrowDown" || key === "ArrowRight") this.menuSel = (this.menuSel + 1) % n;
      if (key === "ArrowUp" || key === "ArrowLeft") this.menuSel = (this.menuSel - 1 + n) % n;
      if (key === "Escape") { this.phase = "main_menu"; this.menuSel = 0; }
      if (key === "Enter" || key === " ") this.chooseMove(this.menuSel);
      return;
    }
    if (this.phase === "party_menu") {
      const list = PKMN.Player.party;
      if (key === "ArrowDown") this.menuSel = (this.menuSel + 1) % list.length;
      if (key === "ArrowUp") this.menuSel = (this.menuSel - 1 + list.length) % list.length;
      if (key === "Escape" && !this.forcedSwitch) { this.phase = "main_menu"; this.menuSel = 0; }
      if (key === "Enter" || key === " ") this.choosePartySwitch(this.menuSel);
      return;
    }
    if (this.phase === "bag_menu") {
      const items = this.bagItems();
      if (key === "ArrowDown") this.menuSel = (this.menuSel + 1) % items.length;
      if (key === "ArrowUp") this.menuSel = (this.menuSel - 1 + items.length) % items.length;
      if (key === "Escape") { this.phase = "main_menu"; this.menuSel = 0; }
      if (key === "Enter" || key === " ") this.chooseBagItem(items[this.menuSel]);
      return;
    }
    if (this.phase === "end") {
      if (key === "Enter" || key === " ") PKMN.switchState("overworld");
      return;
    }
  },

  bagItems() {
    const items = ["pokeball", "potion", "antidote"].filter((k) => (PKMN.Player.bag[k] || 0) > 0);
    items.push("retour");
    return items;
  },

  chooseMainMenu(choice) {
    if (choice === "Attaque") { this.phase = "move_menu"; this.menuSel = 0; }
    else if (choice === "Sac") { this.phase = "bag_menu"; this.menuSel = 0; }
    else if (choice === "Pokémon") { this.forcedSwitch = false; this.phase = "party_menu"; this.menuSel = 0; }
    else if (choice === "Fuite") this.flee();
  },

  chooseBagItem(key) {
    if (key === "retour") { this.phase = "main_menu"; this.menuSel = 0; return; }
    if (key === "pokeball") this.throwBall();
    else if (key === "potion") this.usePotion();
    else if (key === "antidote") this.useAntidote();
  },

  usePotion() {
    if (this.active.hp >= this.active.maxHp) {
      this.showMessages(["Les PV sont déjà au maximum !"], () => { this.phase = "bag_menu"; this.menuSel = 0; });
      return;
    }
    PKMN.Player.bag.potion--;
    this.active.hp = Math.min(this.active.maxHp, this.active.hp + PKMN.ITEMS.potion.healAmount);
    const species = PKMN.speciesOf(this.active);
    this.showMessages([`Tu utilises une Potion sur ${species.name} !`, `${species.name} récupère des PV !`], () => this.wildTurnOnly());
  },

  useAntidote() {
    if (this.active.status !== "poison" && this.active.status !== "toxic") {
      this.showMessages(["Ça n'aurait aucun effet !"], () => { this.phase = "bag_menu"; this.menuSel = 0; });
      return;
    }
    PKMN.Player.bag.antidote--;
    this.active.status = null;
    this.active.statusCounter = 0;
    const species = PKMN.speciesOf(this.active);
    this.showMessages([`Tu utilises un Antidote sur ${species.name} !`, `${species.name} est soigné du poison !`], () => this.wildTurnOnly());
  },

  chooseMove(index) {
    const moveSlot = this.active.moves[index];
    if (moveSlot.pp <= 0) {
      this.showMessages(["Plus de PP pour cette capacité !"], () => { this.phase = "main_menu"; this.menuSel = 0; });
      return;
    }
    this.pendingPlayerMove = moveSlot;
    this.resolveTurn();
  },

  choosePartySwitch(index) {
    const mon = PKMN.Player.party[index];
    if (mon.hp <= 0) {
      this.showMessages(["Ce Pokémon est K.O. !"], () => { this.phase = "party_menu"; });
      return;
    }
    if (mon === this.active) {
      this.phase = "main_menu"; this.menuSel = 0;
      return;
    }
    const was_forced = this.forcedSwitch;
    this.active = mon;
    const species = PKMN.speciesOf(mon);
    if (was_forced) {
      this.showMessages([`Tu envoies ${species.name} !`], () => { this.phase = "main_menu"; this.menuSel = 0; });
    } else {
      this.pendingPlayerMove = null; // switch consomme le tour
      this.showMessages([`Tu rappelles ton Pokémon.`, `Tu envoies ${species.name} !`], () => this.wildTurnOnly());
    }
  },

  flee() {
    this.showMessages(["Tu prends la fuite !"], () => PKMN.switchState("overworld"));
  },

  throwBall() {
    if (!PKMN.Player.bag.pokeball) {
      this.showMessages(["Tu n'as plus de Poké Ball !"], () => { this.phase = "bag_menu"; this.menuSel = 0; });
      return;
    }
    const species = PKMN.speciesOf(this.wild);
    PKMN.Player.bag.pokeball--;
    const baseRate = species.legendary ? 25 : species.stage === 1 ? 190 : species.stage === 2 ? 120 : 70;
    const hpFactor = 0.2 + 0.8 * (1 - this.wild.hp / this.wild.maxHp);
    const chance = Math.max(0.03, Math.min(0.95, (baseRate / 255) * hpFactor));
    this.showMessages([`Tu lances une Poké Ball sur ${species.name} !`], () => {
      if (Math.random() < chance) {
        const toBox = PKMN.Player.addCaught(this.wild);
        PKMN.saveGame();
        const where = toBox ? "Envoyé à la Boîte PC (équipe déjà complète)." : "Ajouté à ton équipe.";
        this.showMessages([`${species.name} est capturé !`, where], () => { this.phase = "end"; });
      } else {
        this.showMessages(["Oh non ! Le Pokémon s'est échappé !"], () => this.wildTurnOnly());
      }
    });
  },

  wildTurnOnly() {
    const msgs = [];
    this.doMoveAction(this.wild, this.active, this.pickWildMove(), msgs, true);
    this.finishTurnMessages(msgs);
  },

  pickWildMove() {
    const usable = this.wild.moves.filter((m) => m.pp > 0);
    const pool = usable.length ? usable : this.wild.moves;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  // Vitesse effective (paralysie = -50%) avec bonus/malus de stage.
  effectiveSpeed(mon) {
    let s = mon.stats.spe * stageMul(mon.statStages.spe);
    if (mon.status === "paralysis") s *= 0.5;
    return s;
  },

  // La priorité de la capacité tranche avant la vitesse (Vive-Attaque agit en premier).
  turnOrder(monA, moveSlotA, monB, moveSlotB) {
    const prioA = PKMN.MOVES[moveSlotA.key].priority || 0;
    const prioB = PKMN.MOVES[moveSlotB.key].priority || 0;
    if (prioA !== prioB) return prioA > prioB;
    const sa = this.effectiveSpeed(monA), sb = this.effectiveSpeed(monB);
    if (sa === sb) return Math.random() < 0.5;
    return sa > sb;
  },

  resolveTurn() {
    const msgs = [];
    const playerMove = this.pendingPlayerMove;
    const wildMove = this.pickWildMove();
    const playerFirst = this.turnOrder(this.active, playerMove, this.wild, wildMove);

    const order = playerFirst
      ? [[this.active, this.wild, playerMove, false], [this.wild, this.active, wildMove, true]]
      : [[this.wild, this.active, wildMove, true], [this.active, this.wild, playerMove, false]];

    for (const [attacker, defender, move, isWild] of order) {
      if (attacker.hp <= 0) continue;
      if (defender === this.active && this.active.hp <= 0) continue;
      if (defender === this.wild && this.wild.hp <= 0) continue;
      this.doMoveAction(attacker, defender, move, msgs, isWild);
    }
    this.finishTurnMessages(msgs);
  },

  statusMessage(target, status) {
    const name = PKMN.speciesOf(target).name;
    const map = {
      poison: `${name} est empoisonné !`,
      toxic: `${name} est gravement empoisonné !`,
      paralysis: `${name} est paralysé !`,
      burn: `${name} est brûlé !`,
      sleep: `${name} s'endort !`,
      freeze: `${name} est gelé !`
    };
    return map[status] || `${name} est affecté !`;
  },

  applySecondary(target, secondary, msgs) {
    if (target.hp <= 0) return;
    if (secondary.confuse) {
      if (target.confused > 0) return;
      target.confused = 2 + Math.floor(Math.random() * 2);
      msgs.push(`${PKMN.speciesOf(target).name} devient confus !`);
      return;
    }
    if (secondary.status) {
      if (target.status) return;
      target.status = secondary.status;
      if (secondary.status === "sleep") target.statusCounter = 1 + Math.floor(Math.random() * 3);
      if (secondary.status === "toxic") target.statusCounter = 1;
      msgs.push(this.statusMessage(target, secondary.status));
    }
  },

  doMoveAction(attacker, defender, moveSlot, msgs, attackerIsWild) {
    const atkSpecies = PKMN.speciesOf(attacker);

    if (attacker.mustRecharge) {
      attacker.mustRecharge = false;
      msgs.push(`${atkSpecies.name} doit récupérer !`);
      return;
    }

    if (attacker.status === "freeze") {
      if (Math.random() < 0.2) {
        attacker.status = null;
        msgs.push(`${atkSpecies.name} n'est plus gelé !`);
      } else {
        msgs.push(`${atkSpecies.name} est gelé et ne peut pas attaquer !`);
        return;
      }
    }

    if (attacker.status === "sleep") {
      if (attacker.statusCounter > 0) {
        attacker.statusCounter--;
        msgs.push(`${atkSpecies.name} dort profondément.`);
        return;
      }
      attacker.status = null;
      msgs.push(`${atkSpecies.name} se réveille !`);
    }

    if (attacker.status === "paralysis" && Math.random() < 0.25) {
      msgs.push(`${atkSpecies.name} est paralysé ! Il ne peut pas bouger !`);
      return;
    }

    if (attacker.confused > 0) {
      attacker.confused--;
      if (Math.random() < 1 / 3) {
        msgs.push(`${atkSpecies.name} est confus et se blesse !`);
        const selfDmg = Math.max(1, Math.floor(attacker.stats.atk * 0.4));
        attacker.hp = Math.max(0, attacker.hp - selfDmg);
        if (attacker.hp <= 0) msgs.push(`${atkSpecies.name} est mis K.O. !`);
        return;
      }
      msgs.push(`${atkSpecies.name} est confus...`);
    }

    const move = PKMN.MOVES[moveSlot.key];
    const defSpecies = PKMN.speciesOf(defender);
    moveSlot.pp = Math.max(0, moveSlot.pp - 1);
    msgs.push(`${atkSpecies.name} utilise ${move.name} !`);

    if (Math.random() * 100 > move.acc) {
      msgs.push("Mais l'attaque échoue !");
      return;
    }

    if (move.power == null) {
      this.applyStatusMove(attacker, defender, move, msgs);
      return;
    }

    const hits = move.hits || 1;
    let totalDmg = 0, lastEff = 1;
    for (let i = 0; i < hits; i++) {
      if (defender.hp <= 0) break;
      const { dmg, eff } = calcDamage(attacker, atkSpecies, defender, defSpecies, move);
      defender.hp = Math.max(0, defender.hp - dmg);
      totalDmg += dmg;
      lastEff = eff;
    }
    if (hits > 1) msgs.push(`${hits} coups portés !`);
    if (lastEff > 1) msgs.push("C'est super efficace !");
    else if (lastEff > 0 && lastEff < 1) msgs.push("Ce n'est pas très efficace...");
    else if (lastEff === 0) msgs.push(`Ça n'affecte pas ${defSpecies.name} !`);

    if (move.recharge) attacker.mustRecharge = true;

    if (move.secondary && defender.hp > 0 && Math.random() * 100 < move.secondary.chance) {
      this.applySecondary(defender, move.secondary, msgs);
    }

    if (move.drain && totalDmg > 0) {
      const heal = Math.max(1, Math.floor(totalDmg * move.drain));
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
      msgs.push(`${atkSpecies.name} récupère des PV !`);
    }

    if (defender.hp <= 0) {
      msgs.push(`${defSpecies.name} est mis K.O. !`);
    }
  },

  applyStatusMove(attacker, defender, move, msgs) {
    const eff = move.effect;
    if (!eff) return;
    if (eff.heal) {
      const before = attacker.hp;
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + Math.floor(attacker.maxHp * eff.heal));
      if (attacker.hp > before) msgs.push(`${PKMN.speciesOf(attacker).name} récupère des PV !`);
      return;
    }
    if (eff.confuse) {
      const target = eff.target === "self" ? attacker : defender;
      if (target.confused > 0) {
        msgs.push("Mais ça échoue !");
      } else {
        target.confused = 2 + Math.floor(Math.random() * 2);
        msgs.push(`${PKMN.speciesOf(target).name} devient confus !`);
      }
      return;
    }
    if (eff.status) {
      const target = eff.target === "self" ? attacker : defender;
      if (target.status) {
        msgs.push("Mais ça échoue !");
      } else {
        target.status = eff.status;
        if (eff.status === "sleep") target.statusCounter = 1 + Math.floor(Math.random() * 3);
        if (eff.status === "toxic") target.statusCounter = 1;
        msgs.push(this.statusMessage(target, eff.status));
      }
      return;
    }
    if (eff.stat) {
      const target = eff.target === "self" ? attacker : defender;
      const cur = target.statStages[eff.stat];
      const next = Math.max(-6, Math.min(6, cur + eff.stages));
      if (next === cur) {
        msgs.push("Mais ça n'a aucun effet !");
      } else {
        target.statStages[eff.stat] = next;
        const dir = eff.stages > 0 ? "augmente" : "baisse";
        msgs.push(`${eff.stat.toUpperCase()} de ${PKMN.speciesOf(target).name} ${dir} !`);
      }
    }
  },

  finishTurnMessages(msgs) {
    // Dégâts de statut en fin de tour (poison / toxic / brûlure)
    for (const mon of [this.active, this.wild]) {
      if (mon.hp <= 0) continue;
      const name = PKMN.speciesOf(mon).name;
      if (mon.status === "poison") {
        const dmg = Math.max(1, Math.floor(mon.maxHp / 8));
        mon.hp = Math.max(0, mon.hp - dmg);
        msgs.push(`${name} souffre du poison !`);
      } else if (mon.status === "toxic") {
        const dmg = Math.max(1, Math.floor((mon.maxHp * mon.statusCounter) / 16));
        mon.hp = Math.max(0, mon.hp - dmg);
        mon.statusCounter++;
        msgs.push(`${name} souffre gravement du poison !`);
      } else if (mon.status === "burn") {
        const dmg = Math.max(1, Math.floor(mon.maxHp / 16));
        mon.hp = Math.max(0, mon.hp - dmg);
        msgs.push(`${name} souffre de sa brûlure !`);
      }
      if (mon.hp <= 0) msgs.push(`${name} est mis K.O. !`);
    }

    this.pendingPlayerMove = null;
    this.showMessages(msgs, () => this.afterTurn());
  },

  afterTurn() {
    if (this.wild.hp <= 0) {
      const species = PKMN.speciesOf(this.wild);
      const exp = expReward(species, this.wild.level);
      const money = moneyReward(this.wild.level);
      PKMN.addEVs(this.active, species.evYield);
      const lvlMsgs = PKMN.gainExp(this.active, exp);
      PKMN.Player.money += money;
      PKMN.saveGame();
      this.showMessages(
        [`${PKMN.speciesOf(this.active).name} gagne ${exp} points d'expérience !`, ...lvlMsgs, `Tu trouves ${money}₽ !`],
        () => { this.phase = "end"; }
      );
      return;
    }
    if (this.active.hp <= 0) {
      const alive = PKMN.Player.party.some((m) => m.hp > 0);
      if (!alive) {
        this.showMessages(["Tu n'as plus de Pokémon en état de combattre...", "Tu cours au centre Pokémon le plus proche."], () => {
          PKMN.healParty(PKMN.Player.party);
          const lc = PKMN.Player.lastCenter || { mapKey: PKMN.START_MAP, x: PKMN.MAPS[PKMN.START_MAP].playerStart.x, y: PKMN.MAPS[PKMN.START_MAP].playerStart.y };
          PKMN.Player.mapKey = lc.mapKey;
          PKMN.Player.x = lc.x;
          PKMN.Player.y = lc.y;
          PKMN.saveGame();
          PKMN.switchState("overworld");
        });
        return;
      }
      this.forcedSwitch = true;
      this.showMessages([`${PKMN.speciesOf(this.active).name} est K.O. ! Choisis un autre Pokémon.`], () => { this.phase = "party_menu"; this.menuSel = 0; });
      return;
    }
    this.phase = "main_menu";
    this.menuSel = 0;
  },

  render(ctx) {
    const W = PKMN.CANVAS_W, H = PKMN.CANVAS_H;
    const skyH = H * 0.55;
    const sky = ctx.createLinearGradient(0, 0, 0, skyH);
    sky.addColorStop(0, "#79c6f2");
    sky.addColorStop(1, "#eaf7ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, skyH);
    ctx.fillStyle = "#cfe6a0";
    ctx.fillRect(0, skyH, W, H - skyH);
    ctx.fillStyle = "#a9d17a";
    ctx.beginPath(); ctx.ellipse(W - 95, skyH + 30, 75, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(120, H - 130, 85, 20, 0, 0, Math.PI * 2); ctx.fill();

    const wildSpecies = PKMN.speciesOf(this.wild);
    PKMN.drawPanel(ctx, 20, 20, 200, 46, { border: "#1c3f5f", fill: "#fdfefe", r: 8 });
    ctx.fillStyle = "#111"; ctx.font = "14px sans-serif"; ctx.textAlign = "left";
    ctx.fillText(`${wildSpecies.name}  Nv.${this.wild.level}${statusTag(this.wild)}`, 28, 38);
    PKMN.drawHpBar(ctx, 28, 46, 130, 10, Math.max(0, this.wild.hp) / this.wild.maxHp);
    PKMN.drawPokemonSprite(ctx, this.wild.species, W - 150, 30, 120, false);

    if (this.active) {
      const activeSpecies = PKMN.speciesOf(this.active);
      PKMN.drawPokemonSprite(ctx, this.active.species, 30, H - 220, 120, true);
      PKMN.drawPanel(ctx, W - 220, H - 190, 200, 50, { border: "#1c3f5f", fill: "#fdfefe", r: 8 });
      ctx.fillStyle = "#111"; ctx.font = "14px sans-serif";
      ctx.fillText(`${activeSpecies.name}  Nv.${this.active.level}${statusTag(this.active)}`, W - 212, H - 172);
      ctx.fillText(`PV ${Math.max(0, this.active.hp)}/${this.active.maxHp}`, W - 212, H - 155);
      PKMN.drawHpBar(ctx, W - 212, H - 148, 130, 10, Math.max(0, this.active.hp) / this.active.maxHp);
    }

    if (this.phase === "message") {
      PKMN.drawTextBox(ctx, this.queue[0] || "");
    } else if (this.phase === "main_menu") {
      PKMN.drawTextBox(ctx, `Que doit faire ${PKMN.speciesOf(this.active).name} ?`, { noPrompt: true });
      PKMN.drawMenu(ctx, W - 180, H - 100, ["Attaque", "Sac", "Pokémon", "Fuite"], this.menuSel, { w: 170 });
    } else if (this.phase === "move_menu") {
      const items = this.active.moves.map((m) => `${PKMN.MOVES[m.key].name} (${m.pp}/${m.maxPp})`);
      PKMN.drawMenu(ctx, 10, H - 130, items, this.menuSel, { w: W - 20, lineH: 24 });
    } else if (this.phase === "party_menu") {
      const items = PKMN.Player.party.map((m) => `${PKMN.speciesOf(m).name} Nv.${m.level} — PV ${Math.max(0, m.hp)}/${m.maxHp}${m.hp <= 0 ? " (K.O.)" : ""}`);
      PKMN.drawMenu(ctx, 10, H - 30 - items.length * 26 - 16, items, this.menuSel, { w: W - 20, lineH: 26 });
    } else if (this.phase === "bag_menu") {
      const keys = this.bagItems();
      const labels = keys.map((k) => k === "retour" ? "Retour" : `${PKMN.ITEMS[k].name} (x${PKMN.Player.bag[k]})`);
      PKMN.drawMenu(ctx, 10, H - 30 - labels.length * 26 - 16, labels, this.menuSel, { w: W - 20, lineH: 26 });
    } else if (this.phase === "end") {
      PKMN.drawTextBox(ctx, "Appuie sur Entrée pour continuer.");
    }
  }
};
