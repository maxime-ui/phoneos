/* App : Épopée — gacha + combat au tour par tour (personnages fictifs) */
"use strict";

OS.registerApp({
  id: "epopee",
  name: "Épopée",
  icon: "⚔️",
  color: "#6b4f9e",
  render(body) {
    body.classList.add("padend");
    const app = this;
    app.onClose = () => clearTyping();

    /* ---------- Données ---------- */

    const RARITY = { 1: { label: "R", color: "#7d869c" }, 2: { label: "SR", color: "#4f9eff" }, 3: { label: "SSR", color: "#e3b23c" } };
    const CARD = { R: { label: "Brut", color: "#c34a2f", mult: 1.5 }, B: { label: "Arcane", color: "#3b6bd4", mult: 1.0 }, V: { label: "Rapide", color: "#3ba75c", mult: 0.8 } };
    const TIER = {
      facile: { label: "Facile", hp: 7000, atk: 780, reward: 5 },
      normal: { label: "Normal", hp: 14000, atk: 1250, reward: 10 },
      dur: { label: "Difficile", hp: 26000, atk: 1900, reward: 20 },
      infini: { label: "Infini", hp: 7000, atk: 780, reward: 0, infinite: true },
    };
    const ENEMY_NAMES = ["Gobelin ancien", "Chevalier déchu", "Dragon des cendres", "Spectre des marais", "Colosse de pierre", "Sorcière du brouillard", "Basilic", "Seigneur liche"];

    const ENEMY_TYPES = {
      "Brute": { desc: "Frappe fort le membre le plus blessé" },
      "Assassin": { desc: "Traque l'attaquant le plus dangereux, critiques fréquents" },
      "Sorcier": { desc: "Brûle toute l'équipe à chaque tour" },
      "Capitaine": { desc: "Se renforce de 4 % à chacun de ses tours" },
      "Golem": { desc: "Carapace : subit 20 % de dégâts en moins, frappe plus lentement" },
    };

    const UNITS = [
      /* --- SSR (5 %) --- */
      { id: "gauvin", name: "Sir Gauvin", r: 3, cls: "Chevalier", atk: 1900, hp: 11500, cards: ["R", "B", "B"] },
      { id: "morgane", name: "Morgane", r: 3, cls: "Mage", atk: 1750, hp: 9800, cards: ["B", "B", "R"] },
      { id: "kaelith", name: "Kaelith", r: 3, cls: "Archer", atk: 1850, hp: 9200, cards: ["V", "R", "B"] },
      { id: "aldric", name: "Aldric de Hautefeuille", r: 3, cls: "Chevalier", atk: 1950, hp: 12000, cards: ["R", "R", "B"] },
      { id: "seraphine", name: "Séraphine", r: 3, cls: "Mage", atk: 1800, hp: 9500, cards: ["B", "V", "B"] },
      { id: "draven", name: "Draven", r: 3, cls: "Berserker", atk: 2000, hp: 9000, cards: ["R", "R", "V"] },
      { id: "valen", name: "Valen le Juste", r: 3, cls: "Chevalier", atk: 1980, hp: 11900, cards: ["R", "R", "B"] },
      { id: "ravenne", name: "Ravenne", r: 3, cls: "Mage", atk: 1820, hp: 10000, cards: ["B", "B", "V"] },
      { id: "aelis", name: "Aelis aux mille flèches", r: 3, cls: "Archer", atk: 1900, hp: 9400, cards: ["V", "V", "R"] },
      { id: "kargan", name: "Kargan", r: 3, cls: "Berserker", atk: 2050, hp: 9200, cards: ["R", "R", "V"] },
      /* --- Faction manga : légendes inspirées des archétypes --- */
      { id: "kairo", name: "Kairo, l'enfant des dragons", r: 3, cls: "Héros", atk: 2000, hp: 10600, cards: ["R", "R", "B"] },
      { id: "okatsuro", name: "Okatsuro", r: 3, cls: "Rôdeur", atk: 1920, hp: 9600, cards: ["V", "V", "B"] },
      { id: "barrok", name: "Barrok le Caoutchouc", r: 3, cls: "Héros", atk: 1880, hp: 11200, cards: ["R", "V", "B"] },
      { id: "enzo", name: "Enzo le Pyromane", r: 3, cls: "Mage", atk: 1850, hp: 9900, cards: ["B", "R", "R"] },
      /* --- SR (20 %) --- */
      { id: "elise", name: "Dame Elise", r: 2, cls: "Chevalier", atk: 1450, hp: 9500, cards: ["R", "B", "V"] },
      { id: "orwen", name: "Orwen", r: 2, cls: "Berserker", atk: 1700, hp: 8500, cards: ["R", "R", "V"] },
      { id: "lia", name: "Lia", r: 2, cls: "Mage", atk: 1350, hp: 8800, cards: ["B", "V", "B"] },
      { id: "farid", name: "Farid", r: 2, cls: "Rôdeur", atk: 1500, hp: 8300, cards: ["V", "R", "V"] },
      { id: "rowena", name: "Rowena", r: 2, cls: "Mage", atk: 1400, hp: 9200, cards: ["B", "V", "R"] },
      { id: "cassius", name: "Cassius", r: 2, cls: "Chevalier", atk: 1500, hp: 9800, cards: ["B", "R", "B"] },
      { id: "morwenna", name: "Morwenna", r: 2, cls: "Rôdeur", atk: 1600, hp: 8600, cards: ["V", "V", "R"] },
      { id: "thibault", name: "Thibault", r: 2, cls: "Chevalier", atk: 1380, hp: 10200, cards: ["R", "B", "V"] },
      { id: "isolde", name: "Isolde", r: 2, cls: "Archer", atk: 1550, hp: 8400, cards: ["V", "R", "R"] },
      { id: "kaeren", name: "Kaeren", r: 2, cls: "Rôdeur", atk: 1480, hp: 8900, cards: ["B", "V", "V"] },
      { id: "bellamy", name: "Bellamy", r: 2, cls: "Berserker", atk: 1650, hp: 8300, cards: ["R", "V", "R"] },
      { id: "odric", name: "Odric", r: 2, cls: "Chevalier", atk: 1520, hp: 9400, cards: ["B", "R", "V"] },
      { id: "gauthier", name: "Gauthier", r: 2, cls: "Chevalier", atk: 1560, hp: 9600, cards: ["R", "B", "V"] },
      { id: "elda", name: "Elda", r: 2, cls: "Mage", atk: 1420, hp: 9400, cards: ["B", "V", "B"] },
      { id: "soren", name: "Soren", r: 2, cls: "Archer", atk: 1580, hp: 8500, cards: ["V", "R", "B"] },
      { id: "ravena", name: "Ravena", r: 2, cls: "Rôdeur", atk: 1540, hp: 8700, cards: ["V", "B", "V"] },
      { id: "duncan", name: "Duncan", r: 2, cls: "Berserker", atk: 1680, hp: 8600, cards: ["R", "R", "V"] },
      { id: "yvain", name: "Yvain", r: 2, cls: "Chevalier", atk: 1490, hp: 10000, cards: ["B", "B", "R"] },
      { id: "maeva", name: "Maéva", r: 2, cls: "Rôdeur", atk: 1510, hp: 8800, cards: ["V", "V", "B"] },
      { id: "coralie", name: "Coralie", r: 2, cls: "Mage", atk: 1380, hp: 9600, cards: ["V", "B", "B"] },
      { id: "koharu", name: "Koharu", r: 2, cls: "Mage", atk: 1450, hp: 9500, cards: ["B", "V", "B"] },
      { id: "daichi", name: "Daichi le briseur de titans", r: 2, cls: "Chevalier", atk: 1580, hp: 10200, cards: ["R", "B", "V"] },
      { id: "akemi", name: "Akemi la Lame Rouge", r: 2, cls: "Rôdeur", atk: 1600, hp: 8400, cards: ["V", "R", "R"] },
      { id: "ryoji", name: "Ryoji", r: 2, cls: "Berserker", atk: 1720, hp: 8600, cards: ["R", "R", "V"] },
      /* --- R (75 %) --- */
      { id: "bron", name: "Bron", r: 1, cls: "Berserker", atk: 1100, hp: 7000, cards: ["R", "R", "V"] },
      { id: "tilia", name: "Tilia", r: 1, cls: "Mage", atk: 950, hp: 7500, cards: ["B", "B", "V"] },
      { id: "nerys", name: "Nerys", r: 1, cls: "Chevalier", atk: 1000, hp: 8200, cards: ["B", "R", "V"] },
      { id: "joach", name: "Joach", r: 1, cls: "Archer", atk: 1050, hp: 6800, cards: ["V", "R", "R"] },
      { id: "sylphe", name: "Sylphe", r: 1, cls: "Rôdeur", atk: 980, hp: 7200, cards: ["V", "V", "B"] },
      { id: "perrin", name: "Perrin", r: 1, cls: "Chevalier", atk: 1020, hp: 8400, cards: ["B", "R", "V"] },
      { id: "maud", name: "Maud", r: 1, cls: "Mage", atk: 960, hp: 7600, cards: ["B", "B", "V"] },
      { id: "hugo", name: "Hugo", r: 1, cls: "Berserker", atk: 1150, hp: 6900, cards: ["R", "R", "V"] },
      { id: "anouk", name: "Anouk", r: 1, cls: "Rôdeur", atk: 1000, hp: 7400, cards: ["V", "R", "B"] },
      { id: "basil", name: "Basil", r: 1, cls: "Archer", atk: 1080, hp: 6600, cards: ["V", "R", "R"] },
      { id: "celestine", name: "Célestine", r: 1, cls: "Mage", atk: 990, hp: 7800, cards: ["B", "V", "B"] },
      { id: "dorian", name: "Dorian", r: 1, cls: "Archer", atk: 1120, hp: 6700, cards: ["R", "V", "B"] },
      { id: "emeric", name: "Emeric", r: 1, cls: "Chevalier", atk: 980, hp: 8600, cards: ["R", "B", "V"] },
      { id: "fenna", name: "Fenna", r: 1, cls: "Rôdeur", atk: 1040, hp: 7200, cards: ["V", "V", "R"] },
      { id: "gael", name: "Gael", r: 1, cls: "Berserker", atk: 1180, hp: 6600, cards: ["R", "V", "B"] },
      { id: "hilda", name: "Hilda", r: 1, cls: "Mage", atk: 940, hp: 8000, cards: ["B", "R", "B"] },
      { id: "ivor", name: "Ivor", r: 1, cls: "Chevalier", atk: 1060, hp: 8200, cards: ["B", "R", "R"] },
      { id: "jolande", name: "Jolande", r: 1, cls: "Mage", atk: 1010, hp: 7500, cards: ["V", "B", "B"] },
      { id: "kasimir", name: "Kasimir", r: 1, cls: "Berserker", atk: 1140, hp: 7100, cards: ["V", "R", "R"] },
      { id: "lisette", name: "Lisette", r: 1, cls: "Archer", atk: 1090, hp: 6900, cards: ["B", "V", "R"] },
      { id: "marceau", name: "Marceau", r: 1, cls: "Rôdeur", atk: 1070, hp: 7300, cards: ["R", "V", "V"] },
      { id: "noemie", name: "Noémie", r: 1, cls: "Mage", atk: 970, hp: 7700, cards: ["B", "V", "R"] },
      { id: "oswald", name: "Oswald", r: 1, cls: "Chevalier", atk: 990, hp: 8800, cards: ["V", "B", "R"] },
      { id: "petra", name: "Petra", r: 1, cls: "Rôdeur", atk: 1030, hp: 7600, cards: ["B", "V", "V"] },
      { id: "arthaud", name: "Arthaud", r: 1, cls: "Chevalier", atk: 1040, hp: 8500, cards: ["R", "B", "V"] },
      { id: "blanche", name: "Blanche", r: 1, cls: "Mage", atk: 950, hp: 7800, cards: ["B", "B", "V"] },
      { id: "colin", name: "Colin", r: 1, cls: "Berserker", atk: 1160, hp: 7000, cards: ["R", "R", "V"] },
      { id: "delphine", name: "Delphine", r: 1, cls: "Mage", atk: 980, hp: 7900, cards: ["B", "V", "B"] },
      { id: "everard", name: "Everard", r: 1, cls: "Chevalier", atk: 1010, hp: 8700, cards: ["B", "R", "V"] },
      { id: "florence", name: "Florence", r: 1, cls: "Archer", atk: 1060, hp: 6800, cards: ["V", "R", "R"] },
      { id: "guilhem", name: "Guilhem", r: 1, cls: "Chevalier", atk: 1070, hp: 8300, cards: ["R", "V", "B"] },
      { id: "hermine", name: "Hermine", r: 1, cls: "Mage", atk: 990, hp: 7400, cards: ["V", "B", "B"] },
      { id: "ismael", name: "Ismael", r: 1, cls: "Rôdeur", atk: 1050, hp: 7100, cards: ["V", "R", "B"] },
      { id: "jade", name: "Jade", r: 1, cls: "Archer", atk: 1100, hp: 7000, cards: ["B", "V", "V"] },
      { id: "kaelan", name: "Kaelan", r: 1, cls: "Berserker", atk: 1130, hp: 7200, cards: ["R", "V", "R"] },
      { id: "lois", name: "Loïs", r: 1, cls: "Rôdeur", atk: 1020, hp: 7500, cards: ["V", "V", "B"] },
      { id: "margo", name: "Margo", r: 1, cls: "Mage", atk: 960, hp: 7600, cards: ["B", "R", "B"] },
      { id: "nils", name: "Nils", r: 1, cls: "Chevalier", atk: 1050, hp: 8100, cards: ["B", "R", "R"] },
      { id: "odile", name: "Odile", r: 1, cls: "Mage", atk: 1000, hp: 7200, cards: ["V", "B", "R"] },
      { id: "pierrick", name: "Pierrick", r: 1, cls: "Berserker", atk: 1170, hp: 6700, cards: ["R", "R", "V"] },
      { id: "quentin", name: "Quentin", r: 1, cls: "Archer", atk: 1110, hp: 6600, cards: ["V", "R", "B"] },
      { id: "rosalie", name: "Rosalie", r: 1, cls: "Rôdeur", atk: 1030, hp: 7400, cards: ["R", "V", "V"] },
      { id: "simon", name: "Simon", r: 1, cls: "Chevalier", atk: 990, hp: 8900, cards: ["R", "B", "R"] },
      { id: "thea", name: "Théa", r: 1, cls: "Mage", atk: 970, hp: 7700, cards: ["B", "V", "V"] },
      { id: "ulric", name: "Ulric", r: 1, cls: "Berserker", atk: 1150, hp: 7300, cards: ["V", "R", "R"] },
      { id: "victoire", name: "Victoire", r: 1, cls: "Chevalier", atk: 1080, hp: 8000, cards: ["B", "V", "R"] },
      { id: "isao", name: "Isao", r: 1, cls: "Chevalier", atk: 1060, hp: 8400, cards: ["B", "R", "V"] },
      { id: "mei", name: "Mei", r: 1, cls: "Mage", atk: 980, hp: 7700, cards: ["B", "V", "B"] },
      { id: "kenji", name: "Kenji", r: 1, cls: "Archer", atk: 1090, hp: 6800, cards: ["V", "R", "R"] },
      { id: "sora", name: "Sora Takeda", r: 1, cls: "Rôdeur", atk: 1010, hp: 7300, cards: ["V", "V", "B"] },
    ];

    const CLASS_BONUS = {
      Chevalier: "Encaisse : ripostes subies réduites de 25 %",
      Berserker: "Enragé : +20 % dégâts sous 50 % PV",
      Mage: "Arcane : dégâts +30 % et Ultime recharge plus vite",
      Archer: "Viseur : critiques à 35 % (au lieu de 25 %)",
      "Rôdeur": "Esquive : 25 % de chance d'éviter une riposte",
      "Héros": "Protagoniste : +5 % de dégâts à chaque tour qui passe (montée en puissance)",
    };

    const SKILL_INFO = {
      gauvin: ["Serment d'acier", "renvoie 30 % des dégâts de la riposte qu'il subit"],
      aldric: ["Bannière de Hautefeuille", "+10 % d'ATK pour toute l'équipe tant qu'il est debout"],
      morgane: ["Runes de sagesse", "l'Ultime se charge +5 % par carte jouée"],
      kaelith: ["Pluie d'étoiles", "ses cartes Rapide infligent 40 % de dégâts en plus"],
      draven: ["Frénésie du dernier souffle", "enragé dès 70 % PV (+30 % au lieu de +20 %)"],
      seraphine: ["Aurore", "bouclier : 20 % de chance de dévier chaque riposte"],
      ravenne: ["Sceau maudit", "chaque carte Arcane maudit l'ennemi : +10 % dégâts, cumulable"],
      aelis: ["Salve des mille flèches", "critiques à 50 % de chance (au lieu de 35 %)"],
      kairo: ["Charge du dragon", "15 % de chance de frapper deux fois"],
      okatsuro: ["Ombres jumelles", "esquive les ripostes à 40 % (au lieu de 25 %)"],
      barrok: ["Poing élastique", "renvoie 35 % des dégâts de la riposte qu'il subit"],
      enzo: ["Déflagration", "ses Brut enflamment l'ennemi : 4 % PV max/tour, 3 cumuls max"],
      kargan: ["Fureur titanesque", "enragé dès 80 % PV (+35 % de dégâts)"],
      valen: ["Gardien du trône", "+30 % d'ATK permanent quand un allié tombe K.O."],
    };
    const byId = (id) => UNITS.find((u) => u.id === id);

    function unitPower(u) {
      const count = save.owned[u.id] || 1;
      const mult = 1 + 0.08 * Math.min(count - 1, 12);
      return { ...u, lvl: count, atk: Math.round(u.atk * mult), hp: Math.round(u.hp * mult) };
    }

    let infiniteBest = OS.store.get("infinite-best", 0);

    function loadSave() {
      const saved = OS.store.get("epopee", null);
      if (saved) return saved;
      return { quartz: 30, owned: { bron: 1, tilia: 1, nerys: 1 }, team: ["bron", "tilia", "nerys"] };
    }
    let save = loadSave();
    function persist() { OS.store.set("epopee", save); }

    let storyState = OS.store.get("epopee-story", { done: 0, music: false, diff: "moyen" });
    if (!storyState.diff) storyState.diff = "moyen";
    function persistStory() { OS.store.set("epopee-story", storyState); }

    /* ---------- Squelette UI ---------- */

    const tabsRow = document.createElement("div");
    tabsRow.className = "gacha-tabs";
    const tabSummon = tab("Invoquer");
    const tabTeam = tab("Équipe");
    const tabBattle = tab("Quêtes");
    const tabStory = tab("Histoire");
    tabsRow.append(tabSummon, tabTeam, tabBattle, tabStory);

    function tab(label) {
      const b = document.createElement("button");
      b.textContent = label;
      b.addEventListener("click", () => {
        OS.sfx.play("ui");
        if (label === "Invoquer") renderSummon();
        else if (label === "Équipe") renderTeam();
        else if (label === "Histoire") renderStory();
        else renderQuests();
      });
      return b;
    }
    function setActiveTab(btn) {
      [tabSummon, tabTeam, tabBattle, tabStory].forEach((b) => b.classList.toggle("active", b === btn));
    }

    body.append(tabsRow);
    const content = document.createElement("div");
    content.className = "gacha-content";
    body.appendChild(content);

    /* ---------- Gacha ---------- */

    function rollUnit() {
      const roll = Math.random();
      const tier = roll < 0.05 ? 3 : roll < 0.25 ? 2 : 1;
      const pool = UNITS.filter((u) => u.r === tier);
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function pull(n) {
      if (save.quartz < (n === 1 ? 3 : 30)) {
        notifyGacha("Pas assez de quartz ! Gagnez-en en quête.");
        return [];
      }
      save.quartz -= n === 1 ? 3 : 30;
      const results = [];
      for (let i = 0; i < n; i++) {
        const unit = rollUnit();
        save.owned[unit.id] = (save.owned[unit.id] || 0) + 1;
        results.push(unit);
      }
      if (save.team.filter((id) => save.owned[id]).length < 3 && save.quartz >= 0) {
        save.team = Object.keys(save.owned).slice(0, 3);
      }
      persist();
      return results;
    }

    function renderSummon() {
      setActiveTab(tabSummon);
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const banner = document.createElement("div");
      banner.className = "banner";
      banner.innerHTML = '<div class="banner-title">Bannière des héros</div><div class="banner-sub">5 % SSR · 20 % SR · 75 % R</div>';
      content.appendChild(banner);

      const buttons = document.createElement("div");
      buttons.className = "pull-row";
      const single = pullBtn("Invoquer ×1 — 3 ◆", 1);
      const multi = pullBtn("Invoquer ×10 — 30 ◆", 10);
      buttons.append(single, multi);
      content.appendChild(buttons);

      const result = document.createElement("div");
      result.className = "pull-results";
      content.appendChild(result);
    }

    function pullBtn(label, n) {
      const b = document.createElement("button");
      b.className = "pull-btn";
      b.textContent = label;
      b.addEventListener("click", (e) => {
        const got = pull(n);
        if (!got.length) return;
        e.target.closest(".gacha-content").querySelector(".quartz-bar").replaceWith(quartzBar());
        const box = e.target.closest(".gacha-content").querySelector(".pull-results");
        box.innerHTML = "";
        got.forEach((u) => box.appendChild(unitCard(u)));
        OS.sfx.play(got.some((u) => u.r === 3) ? "ssr" : "gacha");
      });
      return b;
    }

    function unitCard(u) {
      const p = unitPower(u);
      const c = document.createElement("div");
      c.className = "unit-card r" + u.r;
      c.innerHTML =
        '<div class="unit-rarity">' + RARITY[u.r].label + (p.lvl > 1 ? " · Niveau " + p.lvl : "") + "</div>" +
        '<div class="unit-name">' + u.name + "</div>" +
        '<div class="unit-cls">' + u.cls + (p.lvl > 1 ? " · +" + Math.round((p.atk / u.atk - 1) * 100) + " %" : "") + "</div>" +
        (SKILL_INFO[u.id] ? '<div class="unit-skill">✦ ' + SKILL_INFO[u.id][0] + ' — ' + SKILL_INFO[u.id][1] + '</div>' : "") +
        '<div class="unit-stats">ATK ' + p.atk + " · PV " + p.hp + "</div>";
      return c;
    }

    function quartzBar() {
      const b = document.createElement("div");
      b.className = "quartz-bar";
      b.textContent = "◆ Quartz : " + save.quartz;
      return b;
    }

    function notifyGacha(msg) {
      content.querySelector(".gacha-error")?.remove();
      const err = document.createElement("div");
      err.className = "gacha-error";
      err.textContent = msg;
      content.appendChild(err);
    }

    /* ---------- Équipe ---------- */

    function renderTeam() {
      setActiveTab(tabTeam);
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const hint = document.createElement("div");
      hint.className = "team-hint";
      hint.textContent = "Touchez une unité pour l'ajouter ou la retirer de l'équipe (3 max)";
      content.appendChild(hint);

      const help = document.createElement("div");
      help.className = "class-help";
      Object.keys(CLASS_BONUS).forEach((cls) => {
        const line = document.createElement("div");
        line.innerHTML = "<b>" + cls + "</b> — " + CLASS_BONUS[cls];
        help.appendChild(line);
      });
      content.appendChild(help);

      const box = document.createElement("div");
      box.className = "roster";
      content.appendChild(box);

      const sorted = UNITS.filter((u) => save.owned[u.id]).map(unitPower).sort((a, b) => b.r - a.r || b.atk - a.atk);
      sorted.forEach((u) => {
        const card = unitCard(u);
        card.classList.add("selectable");
        if (save.team.includes(u.id)) card.classList.add("in-team");
        card.addEventListener("click", () => {
          if (save.team.includes(u.id)) {
            save.team = save.team.filter((id) => id !== u.id);
          } else if (save.team.length < 3) {
            save.team.push(u.id);
          }
          persist();
          renderTeam();
        });
        box.appendChild(card);
      });
    }

    /* ---------- Quêtes et combat ---------- */

    let battle = null;

    function teamUnits() {
      const units = save.team.map(byId).filter(Boolean).filter((u) => save.owned[u.id]).map(unitPower);
      return units.slice(0, 3);
    }

    function renderQuests() {
      setActiveTab(tabBattle);
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const team = teamUnits();
      if (team.length < 1) {
        content.innerHTML += '<div class="team-hint">Aucune équipe. Invoquez des héros d\'abord.</div>';
        return;
      }

      const title = document.createElement("div");
      title.className = "team-hint";
      title.textContent = "Équipe : " + team.map((u) => u.name).join(" · ");
      content.appendChild(title);

      const row = document.createElement("div");
      row.className = "pull-row";
      Object.keys(TIER).forEach((key) => {
        const t = TIER[key];
        const b = document.createElement("button");
        b.className = "pull-btn tier-" + key;
        b.innerHTML = t.infinite
          ? "Mode Infini<br><small>→ record : étage " + infiniteBest + "</small>"
          : "Quête " + t.label + "<br><small>→ " + t.reward + " ◆</small>";
        b.addEventListener("click", () => startBattle(key));
        row.appendChild(b);
      });
      content.appendChild(row);

      if (battle) content.appendChild(battleView());
    }

    function startBattle(key) {
      const team = teamUnits();
      const t = TIER[key];
      const types = Object.keys(ENEMY_TYPES);
      const etype = types[Math.floor(Math.random() * types.length)];
      const name = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)];
      const golemMult = etype === "Golem" ? 1.15 : 1;
      const scale = key === "infini" ? Math.pow(1.16, 0) : 1;
      battle = {
        mode: key === "infini" ? "infini" : "quest",
        floor: 1,
        enemy: { name, type: etype, hp: Math.round(t.hp * golemMult * scale), maxHp: Math.round(t.hp * golemMult * scale), atk: Math.round(t.atk * (key === "infini" ? 1.08 : 1)) },
        tier: key,
        units: team,
        hp: team.map((u) => u.hp),
        gauge: 0,
        picks: 0,
        curse: 0,
        burn: 0,
        valenFury: 0,
        log: ["----- " + name + " [" + etype + "] apparaît · " + ENEMY_TYPES[etype].desc + " -----"],
      };
      newHand();
      battle.heroStacks = team.map((u) => (u.cls === "Héros" ? 0 : -1));
      renderQuests();
    }

    function newHand() {
      const deck = [];
      battle.units.forEach((u, idx) => u.cards.forEach((type) => deck.push({ type, idx })));
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      battle.hand = deck.slice(0, 5);
      battle.picks = 0;
      if (battle.heroStacks) {
        aliveIdx().forEach((i) => {
          if (battle.heroStacks[i] >= 0) battle.heroStacks[i]++;
        });
      }
    }

    function aliveIdx() {
      return battle.hp.map((v, i) => (v > 0 ? i : -1)).filter((i) => i >= 0);
    }

    function playCard(cardIdx) {
      if (!battle || battle.picks >= 3) return;
      const card = battle.hand[cardIdx];
      if (!card) return;
      battle.hand.splice(cardIdx, 1);
      battle.picks++;

      const c = CARD[card.type];
      const u = battle.units[card.idx];
      const gi = aliveIdx().includes(card.idx) ? card.idx : aliveIdx()[0];
      const unit = battle.units[gi];

      let dmg = Math.round(unit.atk * c.mult * (0.9 + Math.random() * 0.3));
      dmg = Math.round(dmg * teamAtkMult() * (battle.storyMult || 1));
      let crit = false;
      const critBase = u.cls === "Archer" ? 0.35 : 0.25;
      const critChance = card.type === "V" ? (u.id === "aelis" ? 0.5 : critBase) : 0;
      if (card.type === "V" && Math.random() < critChance) { dmg *= 2; crit = true; }
      if (u.cls === "Mage" && card.type === "B") dmg = Math.round(dmg * 1.3);
      if (u.cls === "Berserker") {
        const threshold = u.id === "draven" ? 0.7 : 0.5;
        const rage = u.id === "draven" ? 1.3 : 1.2;
        if (battle.hp[gi] < u.hp * threshold) dmg = Math.round(dmg * rage);
      }
      if (u.cls === "Héros" && battle.heroStacks && battle.heroStacks[gi] > 1) {
        dmg = Math.round(dmg * (1 + 0.05 * (battle.heroStacks[gi] - 1)));
      }
      if (u.id === "kaelith" && card.type === "V") dmg = Math.round(dmg * 1.4);

      const gaugeGain = card.type === "B" ? (u.cls === "Mage" ? 28 : 22) : 8;
      battle.gauge = Math.min(100, battle.gauge + (battle.elite && battle.elite.id === "oriflamme" ? Math.round(gaugeGain * 0.8) : gaugeGain));
      if (u.id === "morgane") battle.gauge = Math.min(100, battle.gauge + 5);
      if (u.id === "ravenne" && card.type === "B") {
        battle.curse++;
        battle.log.unshift(unit.name + " maudit l'ennemi (+" + (battle.curse * 10) + " % dégâts)");
      }

      OS.sfx.play(crit ? "crit" : card.type === "V" ? "quick" : card.type === "B" ? "arcane" : "hit");

      const hits = (u.id === "kairo" && Math.random() < 0.15) ? 2 : 1;
      for (let h = 0; h < hits; h++) {
        hitEnemy(hits === 2 ? Math.round(dmg * 0.75) : dmg, unit.name, (crit ? "CRIT ! " : "") + c.label + (hits === 2 && h === 1 ? " (double frappe !)" : ""));
        if (battle.enemy.hp <= 0) break;
      }
      if (u.id === "enzo" && card.type === "R" && battle.enemy.hp > 0) {
        battle.burn = Math.min(3, battle.burn + 1);
        battle.log.unshift(unit.name + " enflamme l'ennemi (brûlure ×" + battle.burn + ")");
      }

      if (battle.enemy.hp <= 0) return endBattle(true);
      if (battle.picks >= 3) enemyTurn();
      renderQuests();
    }

    function teamAtkMult() {
      let mult = 1;
      if (battle.units.some((u, i) => u.id === "aldric" && battle.hp[i] > 0)) mult += 0.10;
      mult += battle.valenFury * 0.30;
      return mult;
    }

    function hitEnemy(base, actorName, label) {
      let dmg = base;
      if (battle.enemy.type === "Golem") dmg = Math.round(dmg * 0.8);
      dmg = Math.round(dmg * (1 + 0.10 * battle.curse));
      battle.enemy.hp = Math.max(0, battle.enemy.hp - dmg);
      battle.log.unshift(actorName + " (" + label + ") → " + dmg + " dégâts");
    }

    function useUltimate() {
      if (!battle || battle.gauge < 100 || battle.picks >= 3) return;
      const si = aliveIdx().sort((a, b) => battle.units[b].atk - battle.units[a].atk)[0];
      const strongest = battle.units[si];
      const heroMult = battle.heroStacks && battle.heroStacks[si] > 1 ? (1 + 0.05 * (battle.heroStacks[si] - 1)) : 1;
      const dmg = Math.round(strongest.atk * 2.4 * heroMult * teamAtkMult() * (battle.storyMult || 1) * (0.95 + Math.random() * 0.1));
      battle.enemy.hp = Math.max(0, battle.enemy.hp - dmg);
      battle.gauge = 0;
      battle.picks = 3;
      OS.sfx.play("ult");
      battle.log.unshift("✦ ULTIME de " + strongest.name + " → " + dmg + " dégâts !");
      if (battle.enemy.hp <= 0) return endBattle(true);
      enemyTurn();
      renderQuests();
    }

    function attackAlly(ti, raw) {
      const target = battle.units[ti];
      const dodgeChance = target.id === "okatsuro" ? 0.40 : target.cls === "Rôdeur" ? 0.25 : 0;
      if (Math.random() < dodgeChance) {
        battle.log.unshift(target.name + " esquive la riposte !");
        return 0;
      }
      const shieldBearer = battle.units.findIndex((u, i) => u.id === "seraphine" && battle.hp[i] > 0);
      if (shieldBearer !== ti && shieldBearer !== -1 && Math.random() < 0.20) {
        battle.log.unshift("Séraphine dévie l'attaque avec son bouclier !");
        return 0;
      }
      let dmg = raw;
      if (target.cls === "Chevalier") dmg = Math.round(dmg * 0.75);
      battle.hp[ti] = Math.max(0, battle.hp[ti] - dmg);
      battle.log.unshift(battle.enemy.name + " frappe " + target.name + " → " + dmg + " dégâts");
      if (battle.elite && battle.elite.id === "siphon" && dmg > 0) {
        const heal = Math.round(dmg * 0.5);
        battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + heal);
        battle.log.unshift("Siphon d'âmes : le boss absorbe " + heal + " PV");
      }

      if (target.id === "gauvin" && battle.enemy.hp > 0) {
        hitEnemy(Math.round(dmg * 0.30), target.name, "serment d'acier (renvoi)");
      } else if (target.id === "barrok" && battle.enemy.hp > 0) {
        hitEnemy(Math.round(dmg * 0.35), target.name, "poing élastique (renvoi)");
      }
      if (battle.hp[ti] === 0 && battle.enemy.hp > 0) {
        battle.log.unshift(target.name + " tombe K.O.");
        const valenAlive = battle.units.some((u, i) => u.id === "valen" && battle.hp[i] > 0);
        if (valenAlive) {
          battle.valenFury++;
          battle.log.unshift("Valen rugit de douleur : +" + (battle.valenFury * 30) + " % d'ATK pour lui");
        }
      }
      return dmg;
    }

    function enemyTurn() {
      const targets = aliveIdx();
      if (!targets.length) return endBattle(false);
      const type = battle.enemy.type;
      let ti;
      switch (type) {
        case "Brute":
          ti = targets.sort((a, b) => battle.hp[a] - battle.hp[b])[0];
          attackAlly(ti, Math.round(battle.enemy.atk * 1.25 * (0.85 + Math.random() * 0.25)));
          break;
        case "Assassin":
          ti = targets.sort((a, b) => battle.units[b].atk - battle.units[a].atk)[0];
          let raw = battle.enemy.atk * (0.8 + Math.random() * 0.3);
          if (Math.random() < 0.2) {
            raw *= 1.8;
            attackAlly(ti, Math.round(raw));
            battle.log.unshift("Assassinat critique !");
          } else {
            attackAlly(ti, Math.round(raw));
          }
          break;
        case "Sorcier":
          battle.log.unshift("Le Sorcier embrase toute l'équipe !");
          targets.forEach((i) => {
            attackAlly(i, Math.round(battle.enemy.atk * 0.55 * (0.9 + Math.random() * 0.25)));
          });
          break;
        case "Capitaine":
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * (0.8 + Math.random() * 0.4)));
          battle.enemy.atk = Math.round(battle.enemy.atk * 1.04);
          battle.log.unshift("Le Capitaine joue de la corne : il frappe plus fort au tour suivant (+4 %)");
          break;
        default:
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.9 * (0.8 + Math.random() * 0.4)));
      }
      if (battle.burn > 0 && battle.enemy.hp > 0) {
        const burnDmg = Math.round(battle.enemy.maxHp * 0.04 * battle.burn);
        battle.enemy.hp = Math.max(0, battle.enemy.hp - burnDmg);
        battle.log.unshift("Brûlure → " + burnDmg + " dégâts");
        if (battle.enemy.hp <= 0) return endBattle(true);
      }
      if (battle.enemy.hp > 0 && battle.elite) {
        if (battle.elite.id === "meute") {
          const remaining = aliveIdx();
          if (remaining.length) {
            const t2 = remaining[Math.floor(Math.random() * remaining.length)];
            attackAlly(t2, Math.round(battle.enemy.atk * 0.6 * (0.8 + Math.random() * 0.4)));
            battle.log.unshift("Chasse en meute : un second prédateur bondit !");
          }
        } else if (battle.elite.id === "massue") {
          battle.enemy.atk = Math.round(battle.enemy.atk * 1.06);
          battle.log.unshift("Massue écrasante : +6 % d'ATK (cumul)");
        } else if (battle.elite.id === "oriflamme") {
          battle.log.unshift("L'oriflamme maudite opprime vos cartes…");
        } else if (battle.elite.id === "souffle") {
          battle.log.unshift("Souffle de cendres : l'équipe étouffe sous les braises !");
          aliveIdx().forEach((i) => {
            battle.hp[i] = Math.max(0, battle.hp[i] - Math.round(battle.units[i].hp * 0.03));
            if (battle.hp[i] === 0) battle.log.unshift(battle.units[i].name + " tombe K.O.");
          });
        }
      }
      if (!aliveIdx().length) return endBattle(false);
      newHand();
    }

    function endBattle(win) {
      if (win && battle.mode === "infini") return advanceFloor();
      let reward;
      if (battle.mode === "infini") {
        reward = Math.max(2, battle.floor * 3);
        if (battle.floor > infiniteBest) {
          infiniteBest = battle.floor;
          OS.store.set("infinite-best", infiniteBest);
          battle.log.unshift("Nouveau record d'étages : " + infiniteBest + " !");
        }
      } else if (battle.mode === "histoire") {
        reward = win ? battle.enemy.reward : 2;
        if (win) {
          battle.freshWin = storyState.done <= battle.storyChapter;
          storyState.done = Math.max(storyState.done, battle.storyChapter + 1);
          storyState.bossBeaten = storyState.bossBeaten || {};
          const diffIdx = Math.min(Object.keys(STORY_DIFFS).indexOf(storyState.diff), 4);
          const before = bannersUnlockedCount();
          storyState.bossBeaten[battle.storyChapter] = Math.max(storyState.bossBeaten[battle.storyChapter] || 0, diffIdx + 1);
          persistStory();
          const after = bannersUnlockedCount();
          if (after > before) {
            save.quartz += 25;
            persist();
            battle.log.unshift("✦ Bannière débloquée : " + BANNERS[after - 1].name + " (+25 ◆)");
          }
          battle.log.unshift("Boss vaincu ! Le récit continue (+" + reward + " ◆)");
        }
      } else {
        reward = win ? TIER[battle.tier].reward : 2;
      }
      OS.sfx.play(win ? "victory" : "defeat");
      save.quartz += reward;
      persist();
      battle.log.unshift(win ? "Victoire ! +" + reward + " ◆" : "Défaite… +" + reward + " ◆ (réconfort)");
      battle.over = true;
      renderQuests();
    }

    function advanceFloor() {
      battle.floor++;
      battle.log.unshift("--- Étage " + battle.floor + " franchi ---");
      battle.hp = battle.units.map((u, i) => Math.min(u.hp, battle.hp[i] + Math.round(u.hp * 0.25)));
      battle.gauge = Math.min(100, battle.gauge + 15);
      battle.curse = 0;
      battle.burn = 0;
      const scale = Math.pow(1.16, battle.floor - 1);
      const etype = Object.keys(ENEMY_TYPES)[Math.floor(Math.random() * Object.keys(ENEMY_TYPES).length)];
      const name = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)];
      const golemMult = etype === "Golem" ? 1.15 : 1;
      battle.enemy = { name, type: etype, hp: Math.round(TIER.infini.hp * golemMult * scale), maxHp: Math.round(TIER.infini.hp * golemMult * scale), atk: Math.round(TIER.infini.atk * Math.pow(1.08, battle.floor)) };
      battle.log.unshift(battle.enemy.name + " [" + etype + "] arrive · " + ENEMY_TYPES[etype].desc);
      newHand();
      renderQuests();
    }

    function bar(label, cur, max, cls) {
      const wrap = document.createElement("div");
      wrap.className = "hp-row " + (cls || "");
      const pct = Math.round((cur / max) * 100);
      const inner = pct > 50 ? "high" : pct > 20 ? "mid" : "low";
      wrap.innerHTML =
        '<div class="hp-label">' + label + "</div>" +
        '<div class="hp-track"><div style="width:' + pct + '%" class="hp-fill ' + inner + '"></div></div>' +
        '<div class="hp-num">' + cur + "/" + max + "</div>";
      return wrap;
    }

    function battleView() {
      const view = document.createElement("div");
      view.className = "battle";

      if (battle.over) {
        const won = battle.enemy.hp <= 0;
        const done = document.createElement("div");
        done.className = "battle-result " + (won ? "win" : "lose");
        done.textContent = won ? "VICTOIRE" : "DÉFAITE";
        view.appendChild(done);
        if (battle.mode === "histoire") {
          const row = document.createElement("div");
          row.className = "battle-actions";
          if (won) {
            const cont = document.createElement("button");
            cont.className = "pull-btn story-next";
            cont.textContent = "Continuer l'histoire ▸";
            cont.addEventListener("click", onStoryContinue);
            row.appendChild(cont);
          } else {
            const retry = document.createElement("button");
            retry.className = "pull-btn tier-infini story-boss";
            retry.textContent = "⚔ Réessayer";
            retry.addEventListener("click", onStoryRetry);
            row.appendChild(retry);
            const quit = document.createElement("button");
            quit.className = "pull-btn";
            quit.textContent = "↩ Renoncer";
            quit.addEventListener("click", renderStory);
            row.appendChild(quit);
          }
          view.appendChild(row);
        }
      } else {
        const floorTag = battle.mode === "infini" ? " · Étage " + battle.floor : battle.mode === "histoire" ? " · Boss d'histoire · " + battle.diffLabel : "";
        view.insertBefore(battleSceneArt(), view.firstChild);
        view.appendChild(bar(battle.enemy.name + " · " + battle.enemy.type + floorTag, battle.enemy.hp, battle.enemy.maxHp, "enemy"));

        const gwrap = document.createElement("div");
        gwrap.className = "hp-row gauge";
        gwrap.innerHTML =
          '<div class="hp-label">Ultime</div>' +
          '<div class="hp-track"><div style="width:' + battle.gauge + '%" class="hp-fill gauge-fill"></div></div>' +
          '<div class="hp-num">' + battle.gauge + "%</div>";
        view.appendChild(gwrap);

        battle.units.forEach((u, i) => {
          if (battle.hp[i] > 0) view.appendChild(bar(u.name, battle.hp[i], u.hp, "ally"));
          else {
            const ko = document.createElement("div");
            ko.className = "hp-row ko";
            ko.innerHTML = '<div class="hp-label">' + u.name + " — K.O.</div>";
            view.appendChild(ko);
          }
        });

        const hand = document.createElement("div");
        hand.className = "card-hand";
        battle.hand.forEach((card, i) => {
          const b = document.createElement("button");
          const c = CARD[card.type];
          b.className = "hand-card type-" + card.type;
          b.innerHTML = "<b>" + c.label + "</b><span>" + battle.units[card.idx].name + "</span>";
          b.addEventListener("click", () => playCard(i));
          hand.appendChild(b);
        });
        view.appendChild(hand);

        const actions = document.createElement("div");
        actions.className = "battle-actions";
        const ult = document.createElement("button");
        ult.className = "pull-btn ult" + (battle.gauge < 100 ? " disabled" : "");
        ult.textContent = "✦ Ultime (" + battle.gauge + "%)";
        ult.addEventListener("click", useUltimate);
        actions.appendChild(ult);
        view.appendChild(actions);
      }

      const log = document.createElement("div");
      log.className = "battle-log";
      battle.log.slice(0, 8).forEach((line) => {
        const row = document.createElement("div");
        row.textContent = line;
        log.appendChild(row);
      });
      view.appendChild(log);
      return view;
    }

    /* ---------- Mode Histoire ---------- */

    const BLESSINGS = {
      fleches: "Lames affûtées (+10 % de dégâts en boss)",
      runes: "Runes allumées (+25 % d'Ultime au début des boss)",
      courage: "Vœu de courage (Ultime à 50 % au début des boss)",
      os: "Médaillon d'os (boss à −10 % de PV)",
      charge: "Charge frontale (+15 % de dégâts en boss)",
      nuit: "Tactique nocturne (Ultime à 50 % au début des boss)",
    };
    const BLESSING_FX = {
      fleches: { mult: 1.10 },
      charge: { mult: 1.15 },
      runes: { gauge: 25 },
      courage: { gauge: 50 },
      nuit: { gauge: 50 },
      os: { hpMult: 0.90 },
    };

    const STORY_DIFFS = {
      facile: { label: "Facile", hp: 0.55, atk: 0.60, rw: 0.5 },
      moyen: { label: "Moyen", hp: 1, atk: 1, rw: 1 },
      difficile: { label: "Difficile", hp: 1.6, atk: 1.45, rw: 1.5 },
      impossible: { label: "Impossible", hp: 2.3, atk: 1.9, rw: 2.5 },
      enfer: { label: "Enfer", hp: 3.2, atk: 2.4, rw: 4 },
      enferPlus: { label: "Enfer+", hp: 4.2, atk: 3, rw: 6, elite: true },
    };

    const BANNERS = [
      { name: "Bannière du Chemin", color: "#2f7a4f" },
      { name: "Bannière des Trois Volontaires", color: "#2f5f8f" },
      { name: "Bannière du Serment", color: "#a06a2c" },
      { name: "Bannière de la Caldeira", color: "#8c2f39" },
      { name: "Bannière du Dragon Rouge", color: "#d33b2f" },
    ];
    const BOSS_IDX = [1, 3, 6, 9, 11];

    function bannersUnlockedCount() {
      const beaten = storyState.bossBeaten || {};
      let n = 0;
      for (let t = 0; t < BANNERS.length; t++) {
        if (BOSS_IDX.every((i) => (beaten[i] || 0) >= t + 1)) n = t + 1;
      }
      return n;
    }

    function bannerSvg(color, dim) {
      return '<svg class="mini-banner" viewBox="0 0 40 56" preserveAspectRatio="xMidYMid meet">' +
        '<path d="M6 2 H34 V44 L20 34 L6 44 Z" fill="' + color + '" opacity="' + (dim ? "0.28" : "1") + '"/>' +
        '<path d="M6 2 H34 V44 L20 34 L6 44 Z" fill="none" stroke="#0e1322"/>' +
        '<rect x="6" y="8" width="28" height="3" fill="#e3b23c" opacity="' + (dim ? "0.15" : "0.85") + '"/>' +
        '<circle cx="20" cy="20" r="5.5" fill="#e3b23c" opacity="' + (dim ? "0.15" : "0.9") + '"/>' +
        '</svg>';
    }

    const STORY = [
      /* --- Acte I --- */
      {
        act: "Acte I — La route du nord",
        title: "L'appel du village",
        scene: { sky: "dawn", ground: "village", sunX: 60, actors: [
          { cls: "Chevalier", color: "#e3b23c", x: 205 },
          { cls: "Berserker", color: "#c34a2f", x: 248, flip: true },
        ] },
        events: [
          { t: "Le village de Hautefeuille s'éveille sous une aube de lave. L'an dernier, le roi a rappelé ses chevaliers : plus personne ne protège la frontière du nord." },
          { s: "Orwen", t: "Les bêtes descendent des collines chaque nuit. Et quelque chose de plus grand brûle là-haut — le ciel sent le soufre jusqu'ici." },
          { s: "Dame Elise", t: "Alors nous irons nous-mêmes. Trois volontaires, une route, et pas un denier du roi." },
          { t: "Vous regardez vos compagnons : la force, l'arcane, la vitesse. La route du nord commence." },
        ],
      },
      {
        act: "Acte I — La route du nord",
        title: "La patrouille des ombres",
        scene: { sky: "night", ground: "foret", stars: true, sunX: 250, actors: [
          { cls: "Berserker", color: "#c34a2f", x: 120 },
          { cls: "Archer", color: "#3ba75c", x: 160, flip: true },
        ] },
        events: [
          { t: "À la lisière du bois, les corbeaux se taisent d'un seul coup. Des ombres encerclent le chemin, lourdes de chaînes." },
          { s: "Orwen", t: "Ce ne sont pas des loups. Ces ombres portaient des chaînes — quelqu'un les envoie sur nous." },
          { boss: { name: "Meute d'ombre", type: "Brute", hp: 9000, atk: 1050, reward: 12, elite: { id: "meute", name: "Chasse en meute", desc: "un second prédateur frappe chaque tour" }, intro: "La meute se jette sur vous. Premier vrai combat." } },
        ],
      },
      {
        act: "Acte I — La route du nord",
        title: "La croix des rôdeurs",
        scene: { sky: "forest", ground: "canopee2", sunX: 250, actors: [
          { cls: "Rôdeur", color: "#4f9eff", x: 160 },
          { cls: "Mage", color: "#3b6bd4", x: 205, flip: true },
        ] },
        events: [
          { t: "Au carrefour des chasseurs, une croix de flèches plantées dans un tronc marque la route sûre. Les rôdeurs d'autrefois y laissaient toujours un don." },
          { s: "Kaeren", t: "La forêt donne sa protection à qui laisse un don. Choisissons le nôtre." },
          { q: "Quel don laissez-vous au carrefour ?", opts: [
            { label: "Affûter les lames", blessing: "fleches" },
            { label: "Allumer les runes", blessing: "runes" },
          ] },
        ],
      },
      {
        act: "Acte I — La route du nord",
        title: "Le chef de guerre Gortak",
        scene: { sky: "dawn", ground: "foret", sunX: 60, actors: [
          { cls: "Chevalier", color: "#e3b23c", x: 120 },
          { cls: "Berserker", color: "#c34a2f", x: 160, flip: true },
        ] },
        events: [
          { s: "Dame Elise", t: "Voilà qui menait la meute. Un chef de guerre ceinturé de chaînes brisées, congédié des guerres du sud." },
          { s: "Gortak", t: "PETITS SEIGNEURS. VOTRE ROI VOUS A VENDUS. MOI, JE VOUS OFFRE LA GUERRE." },
          { s: "Orwen", t: "Il annonce ça comme un cadeau. Répondons-lui." },
          { boss: { name: "Gortak, chef de guerre", type: "Brute", hp: 14000, atk: 1350, reward: 18, elite: { id: "massue", name: "Massue écrasante", desc: "+6 % d'ATK à chacun de ses tours" }, intro: "Gortak lève sa masse de fer. Le sol en tremble." } },
        ],
      },
      /* --- Acte II --- */
      {
        act: "Acte II — La forêt des mille flèches",
        title: "La forêt qui parle",
        scene: { sky: "forest", ground: "canopee2", sunX: 250, actors: [
          { cls: "Mage", color: "#3b6bd4", x: 160 },
          { cls: "Archer", color: "#3ba75c", x: 205, flip: true },
        ] },
        events: [
          { t: "La forêt avale le bruit. Des milliers de flèches anciennes hérissent les troncs, plantées là par des rôdeurs oubliés." },
          { s: "Lia", t: "Chaque flèche pointe une direction sûre. Suivez les pointes, jamais les yeux." },
          { s: "Kaeren", t: "Les archers d'autrefois veillaient encore, il y a un mois. Maintenant, il n'y a plus que nous." },
        ],
      },
      {
        act: "Acte II — La forêt des mille flèches",
        title: "Le sanctuaire des murmures",
        scene: { sky: "night", ground: "sanctuaire", stars: true, sunX: 160, actors: [
          { cls: "Mage", color: "#6b4f9e", x: 170 },
          { cls: "Mage", color: "#e3b23c", x: 215, flip: true },
        ] },
        events: [
          { t: "Au sommet des marches, un sanctuaire qu'aucun cartographe n'a nommé. Dans la pierre, des runes murmurent dans une langue morte." },
          { s: "Morgane", t: "Les murmures disent : le dragon des cendres dort sous la montagne. Nos ancêtres l'ont scellé, et le sceau faiblit." },
          { s: "Morgane", t: "Le sanctuaire aide qui lui laisse une offrande. Dépêchez-vous : le sceau agonise." },
          { q: "Quelle offrande déposez-vous ?", opts: [
            { label: "Le médaillon d'os", blessing: "os" },
            { label: "Le vœu de courage", blessing: "courage" },
          ] },
        ],
      },
      {
        act: "Acte II — La forêt des mille flèches",
        title: "Le spectre des urnes",
        scene: { sky: "night", ground: "sanctuaire", stars: true, sunX: 250, actors: [
          { cls: "Mage", color: "#6b4f9e", x: 170 },
        ] },
        events: [
          { t: "Les urnes du sanctuaire se fissurent. Une voix froide monte de la poussière — une voix qui a oublié d'être humaine." },
          { s: "Séraphine", t: "Un gardien corrompu. Il a veillé ici pendant des siècles, et il ne supporte plus d'être réveillé." },
          { boss: { name: "Spectre des urnes", type: "Sorcier", hp: 24000, atk: 1800, reward: 25, elite: { id: "siphon", name: "Siphon d'âmes", desc: "se soigne de la moitié des dégâts infligés" }, intro: "Le spectre embrase le parvis de runes bleues." } },
        ],
      },
      {
        act: "Acte II — La forêt des mille flèches",
        title: "Le serment",
        scene: { sky: "night", ground: "sanctuaire", stars: true, sunX: 60, actors: [
          { cls: "Chevalier", color: "#e3b23c", x: 130 },
          { cls: "Archer", color: "#3ba75c", x: 175 },
          { cls: "Mage", color: "#6b4f9e", x: 220, flip: true },
        ] },
        events: [
          { s: "Séraphine", t: "Nous avons survécu au pire. Ce qui nous attend dort sous la montagne." },
          { s: "Sir Gauvin", t: "Alors gravez-le. Sur la pierre, sur les mains, partout où la peur pourra le lire." },
          { t: "Chacun grave trois mots sur le porche du sanctuaire : avancer, ou mourir en chemin." },
        ],
      },
      /* --- Acte III --- */
      {
        act: "Acte III — Le dragon des cendres",
        title: "L'escalier de lave",
        scene: { sky: "ash", ground: "vulkan", sunX: 250, actors: [
          { cls: "Berserker", color: "#c34a2f", x: 140 },
          { cls: "Chevalier", color: "#e3b23c", x: 185, flip: true },
        ] },
        events: [
          { t: "Mille marches taillées dans la roche chaude. À chaque palier, l'air brûle un peu plus, et le murmure des runes s'éteint." },
          { s: "Draven", t: "Enfin quelque chose d'honnête. Ici, au moins, on verra l'ennemi venir." },
        ],
      },
      {
        act: "Acte III — Le dragon des cendres",
        title: "Le chevalier de cendres",
        scene: { sky: "ash", ground: "vulkan", sunX: 250, actors: [
          { cls: "Chevalier", color: "#c34a2f", x: 170 },
          { cls: "Chevalier", color: "#e3b23c", x: 215, flip: true },
        ] },
        events: [
          { s: "Sir Gauvin", t: "Un chevalier de nos couleurs, figé face à la montagne. Il contemple le dragon depuis cent ans." },
          { s: "Le chevalier de cendres", t: "NI L'ORAGE, NI LA LAVE, NI LE DRAGON. VOUS SEULS RESSEMBLEZ À UNE MENACE." },
          { boss: { name: "Chevalier de cendres", type: "Capitaine", hp: 30000, atk: 2050, reward: 30, elite: { id: "oriflamme", name: "Oriflamme maudite", desc: "votre Ultime se charge 20 % moins vite" }, intro: "Le chevalier lève son oriflamme brûlée : il gagnera en force à chaque tour." } },
        ],
      },
      {
        act: "Acte III — Le dragon des cendres",
        title: "Le dragon des cendres",
        scene: { sky: "ash", ground: "vulkan", sunX: 250, dragon: [176, 96], actors: [
          { cls: "Berserker", color: "#c34a2f", x: 110 },
          { cls: "Chevalier", color: "#e3b23c", x: 150 },
          { cls: "Mage", color: "#6b4f9e", x: 188, flip: true },
        ] },
        events: [
          { t: "Un ciel de braises. Aucun soleil n'éclaire ce versant : seule la caldeira rouge arrose la montagne d'une lumière fauve." },
          { s: "Le dragon des cendres", t: "PETITS RÔDEURS. VOUS AVEZ RALLUMÉ LES RUNES. VENEZ DONC JOUER." },
          { s: "Draven", t: "Enfin quelque chose à ma taille." },
          { q: "Comment entrez-vous dans la caldeira ?", opts: [
            { label: "Charger d'un coup", blessing: "charge" },
            { label: "Attendre la nuit", blessing: "nuit" },
          ] },
        ],
      },
      {
        act: "Acte III — Le dragon des cendres",
        title: "Le vent du sud",
        scene: { sky: "ash", ground: "vulkan", sunX: 250, dragon: [176, 96], actors: [
          { cls: "Berserker", color: "#c34a2f", x: 110 },
          { cls: "Chevalier", color: "#e3b23c", x: 150 },
          { cls: "Mage", color: "#6b4f9e", x: 188, flip: true },
        ] },
        events: [
          { t: "Les ailes se déploient au-dessus du nuage de cendres. Chaque battement fait trembler le sol comme un tambour de guerre." },
          { boss: { name: "Dragon des cendres", type: "Brute", hp: 42000, atk: 2250, reward: 40, elite: { id: "souffle", name: "Souffle de cendres", desc: "brûle toute l'équipe (3 % PV max) à chaque tour" }, intro: "Le boss final. Toute la légende tient dans ce combat." } },
          { t: "Le dragon s'effondre en une pluie de braises. Sur l'horizon, pour la première fois depuis un an, le ciel se lève clair." },
          { s: "Dame Elise", t: "La route du nord est ouverte. Qu'on raconte que trois volontaires l'ont faite." },
          { t: "FIN — La légende du dragon des cendres, qu'un village nomme encore celle des Trois Volontaires." },
        ],
      },
    ];

    let storyScene = null;
    let typeTimer = null;

    function clearTyping() {
      if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
    }

    function storyBackBtn() {
      const b = document.createElement("button");
      b.className = "story-back";
      b.textContent = "↩ Tous les chapitres";
      b.addEventListener("click", () => { OS.sfx.play("page"); renderStory(); });
      return b;
    }

    function storyMusicToggle() {
      const b = document.createElement("button");
      b.className = "music-toggle";
      b.textContent = "♪ Musique : " + (storyState.music ? "ON" : "OFF");
      b.addEventListener("click", () => {
        storyState.music = !storyState.music;
        persistStory();
        OS.sfx.setMusic(storyState.music);
        renderStory();
      });
      return b;
    }

    function storyChapterList() {
      const acts = [];
      STORY.forEach((ch, i) => {
        if (!acts.length || acts[acts.length - 1].name !== ch.act) acts.push({ name: ch.act, heads: [], first: i });
      });
      const wrap = document.createElement("div");
      acts.forEach((act) => {
        const head = document.createElement("div");
        head.className = "story-act";
        head.textContent = act.name;
        wrap.appendChild(head);
        const list = document.createElement("div");
        list.className = "story-list";
        STORY.forEach((ch, i) => {
          if (ch.act !== act.name) return;
          const c = document.createElement("button");
          const locked = i > storyState.done;
          const done = i < storyState.done;
          c.className = "story-chapter" + (locked ? " locked" : "") + (done ? " done" : "");
          c.innerHTML = "<b>" + (i + 1) + ". " + ch.title + "</b><small>" + (done ? "✓ terminé" : locked ? "verrouillé" : "▶ jouer") + "</small>";
          if (!locked) c.addEventListener("click", () => { OS.sfx.play("page"); openScene(i); });
          list.appendChild(c);
        });
        wrap.appendChild(list);
      });
      return wrap;
    }

    function renderStory() {
      clearTyping();
      setActiveTab(tabStory);
      content.innerHTML = "";
      content.appendChild(quartzBar());
      if (storyState.music) OS.sfx.setMusic(true);

      const hint = document.createElement("div");
      hint.className = "team-hint";
      hint.textContent = "Mode Histoire — trois volontaires sur la route du nord.";
      content.appendChild(hint);

      const shelf = document.createElement("div");
      shelf.className = "story-banners";
      BANNERS.forEach((bn, t) => {
        const slot = document.createElement("div");
        const unlocked = bannersUnlockedCount() > t;
        slot.className = "banner-slot" + (unlocked ? " unlocked" : " locked");
        slot.innerHTML = bannerSvg(bn.color, !unlocked) + "<span>" + (unlocked ? bn.name : "Bannière scellée") + "</span>";
        shelf.appendChild(slot);
      });
      content.appendChild(shelf);

      const diffTitle = document.createElement("div");
      diffTitle.className = "team-hint";
      diffTitle.textContent = "Difficulté des boss d'histoire :";
      content.appendChild(diffTitle);
      const diffRow = document.createElement("div");
      diffRow.className = "pull-row diff-row";
      const banners = bannersUnlockedCount();
      Object.keys(STORY_DIFFS).forEach((key) => {
        const d = STORY_DIFFS[key];
        const b = document.createElement("button");
        const locked = key === "enferPlus" && banners < BANNERS.length;
        b.className = "pull-btn tier-" + key + (storyState.diff === key ? " active-diff" : "") + (locked ? " locked" : "");
        b.innerHTML = locked
          ? d.label + "<br><small>🔒 les 5 boss en Enfer</small>"
          : d.label + "<br><small>boss ×" + String(d.hp).replace(".", ",") + " · ◆ ×" + String(d.rw).replace(".", ",") + "</small>";
        if (!locked) b.addEventListener("click", () => {
          storyState.diff = key;
          persistStory();
          OS.sfx.play("ui");
          renderStory();
        });
        diffRow.appendChild(b);
      });
      content.appendChild(diffRow);

      if (storyState.blessing) {
        const bl = document.createElement("div");
        bl.className = "story-blessing";
        bl.textContent = "✧ Bénédiction : " + BLESSINGS[storyState.blessing];
        content.appendChild(bl);
      }

      content.appendChild(storyMusicToggle());
      content.appendChild(storyChapterList());
    }

    function openScene(i, step) {
      storyScene = { idx: i, step: step || 0 };
      renderScene();
    }

    function typeCurrentLine(el, text) {
      let pos = Math.min(2, text.length);
      el.textContent = text.slice(0, pos);
      typeTimer = setInterval(() => {
        pos += 2;
        el.textContent = text.slice(0, pos);
        if (pos % 8 === 0) OS.sfx.play("type");
        if (pos >= text.length) {
          el.textContent = text;
          clearTyping();
        }
      }, 30);
    }

    function renderScene() {
      clearTyping();
      const ch = STORY[storyScene.idx];
      const ev = ch.events[storyScene.step];
      content.innerHTML = "";
      content.appendChild(quartzBar());
      content.appendChild(storyBackBtn());

      const art = document.createElement("div");
      art.className = "story-art-box";
      art.innerHTML = OS.art.scene(ch.scene);
      content.appendChild(art);

      const title = document.createElement("div");
      title.className = "story-title";
      title.textContent = (storyScene.idx + 1) + ". " + ch.title;
      content.appendChild(title);

      if (ev.q) {
        const text = document.createElement("div");
        text.className = "story-text";
        const line = document.createElement("div");
        line.className = "story-line current";
        text.appendChild(line);
        content.appendChild(text);
        typeCurrentLine(line, ev.q);

        const box = document.createElement("div");
        box.className = "story-choices";
        ev.opts.forEach((o) => {
          const opt = document.createElement("button");
          opt.className = "story-choice";
          opt.innerHTML = "<b>" + o.label + "</b><small>" + BLESSINGS[o.blessing] + "</small>";
          opt.addEventListener("click", () => {
            storyState.blessing = o.blessing;
            persistStory();
            OS.sfx.play("unlock");
            advanceScene();
          });
          box.appendChild(opt);
        });
        content.appendChild(box);
      } else if (ev.boss) {
        const text = document.createElement("div");
        text.className = "story-text";
        const line = document.createElement("div");
        line.className = "story-line current";
        text.appendChild(line);
        content.appendChild(text);
        typeCurrentLine(line, ev.boss.intro);

        const boss = document.createElement("button");
        boss.className = "pull-btn tier-infini story-boss";
        boss.textContent = "⚔ Engager : " + ev.boss.name;
        boss.addEventListener("click", () => startStoryBattle(ev.boss));
        content.appendChild(boss);
      } else {
        const text = document.createElement("div");
        text.className = "story-text";
        if (ev.s) {
          const sp = document.createElement("div");
          sp.className = "story-speaker";
          sp.textContent = ev.s;
          text.appendChild(sp);
        }
        const line = document.createElement("div");
        line.className = "story-line current" + (ev.s ? "" : " narration");
        text.appendChild(line);
        content.appendChild(text);
        typeCurrentLine(line, ev.t);

        const next = document.createElement("button");
        next.className = "pull-btn story-next";
        next.textContent = "Suivant ▸";
        next.addEventListener("click", advanceScene);
        content.appendChild(next);
      }
    }

    function advanceScene() {
      const ch = STORY[storyScene.idx];
      if (storyScene.step < ch.events.length - 1) {
        storyScene.step++;
        OS.sfx.play("page");
        renderScene();
      } else {
        const gained = completeChapter(storyScene.idx);
        renderDoneChapter(storyScene.idx, gained > 0 ? "+8 ◆ gagnés" : "déjà lu");
      }
    }

    function completeChapter(i) {
      if (storyState.done <= i) {
        storyState.done = i + 1;
        persistStory();
        save.quartz += 8;
        persist();
        OS.sfx.play("unlock");
        return 8;
      }
      return 0;
    }

    function renderDoneChapter(i, subtitle) {
      clearTyping();
      const ch = STORY[i];
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const art = document.createElement("div");
      art.className = "story-art-box";
      art.innerHTML = OS.art.scene(ch.scene);
      content.appendChild(art);

      const done = document.createElement("div");
      done.className = "battle-result win";
      done.textContent = i === STORY.length - 1 ? "✓ FIN DE L'HISTOIRE — " + subtitle : "✓ CHAPITRE TERMINÉ — " + subtitle;
      content.appendChild(done);

      if (i + 1 < STORY.length) {
        const nx = document.createElement("button");
        nx.className = "pull-btn story-next";
        nx.textContent = "Chapitre suivant ▸";
        nx.addEventListener("click", () => { OS.sfx.play("page"); openScene(i + 1); });
        content.appendChild(nx);
      }
      content.appendChild(storyBackBtn());
    }

    function battleSceneArt() {
      const idx = battle.storyChapter !== undefined ? battle.storyChapter : (storyScene ? storyScene.idx : 0);
      const art = document.createElement("div");
      art.className = "story-art-box";
      art.innerHTML = OS.art.scene(STORY[idx] ? STORY[idx].scene : STORY[0].scene);
      return art;
    }

    function startStoryBattle(cfg) {
      const team = teamUnits();
      if (!team.length) { renderStory(); return; }
      const fx = BLESSING_FX[storyState.blessing] || {};
      const d = STORY_DIFFS[storyState.diff || "moyen"];
      const hp = Math.round(cfg.hp * (fx.hpMult || 1) * d.hp);
      storyScene = { idx: storyScene ? storyScene.idx : 0, step: storyScene ? storyScene.step : 0 };
      battle = {
        mode: "histoire",
        tier: "histoire",
        storyChapter: storyScene.idx,
        storyStep: storyScene.step,
        bossCfg: cfg,
        storyMult: fx.mult || 1,
        floor: storyScene.idx + 1,
        enemy: { name: cfg.name, type: cfg.type, hp, maxHp: hp, atk: Math.round(cfg.atk * d.atk), reward: Math.max(2, Math.round(cfg.reward * d.rw)) },
        diffLabel: d.label,
        units: team,
        hp: team.map((u) => u.hp),
        gauge: fx.gauge || 0,
        picks: 0,
        curse: 0,
        burn: 0,
        valenFury: 0,
        log: [],
      };
      if (d.elite && cfg.elite) battle.elite = cfg.elite;
      newHand();
      battle.heroStacks = team.map((u) => (u.cls === "Héros" ? 0 : -1));
      battle.log.unshift("----- " + cfg.name + " [Boss d'histoire · " + d.label + "] · récompense : " + battle.enemy.reward + " ◆ -----");
      if (battle.elite) battle.log.unshift("[Enfer+] " + battle.elite.name + " : " + battle.elite.desc);
      if (battle.elite) OS.sfx.play("arcane");
      OS.sfx.play("ult");
      renderQuests();
    }

    function onStoryContinue() {
      const idx = battle.storyChapter;
      const step = battle.storyStep + 1;
      const fresh = !!battle.freshWin;
      storyScene = { idx, step };
      if (step >= STORY[idx].events.length) renderDoneChapter(idx, fresh ? "boss vaincu !" : "déjà lu");
      else renderScene();
    }

    function onStoryRetry() {
      storyScene = { idx: battle.storyChapter, step: battle.storyStep };
      openScene(battle.storyChapter, battle.storyStep);
    }

    /* ---------- Démarrage ---------- */
    persist();
    renderSummon();
  },
});
