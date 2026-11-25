/* App : Salle des trophées — bannières, records Enfer+, récompenses collection, le Graal */
"use strict";

OS.registerApp({
  id: "trophies",
  name: "Trophées",
  icon: "🏆",
  color: "#6b4f2a",
  render(body) {
    body.classList.add("padend");

    const BANNERS = [
      { name: "Bannière du Chemin", color: "#2f7a4f" },
      { name: "Bannière des Trois Volontaires", color: "#2f5f8f" },
      { name: "Bannière du Serment", color: "#a06a2c" },
      { name: "Bannière de la Caldeira", color: "#8c2f39" },
      { name: "Bannière du Dragon Rouge", color: "#d33b2f" },
      { name: "Bannière du Général", color: "#4a4f60" },
      { name: "Bannière de la Vouivre", color: "#3b6b6f" },
      { name: "Bannière de l'Archonte", color: "#7d3bd4" },
    ];
    const BOSS_IDX = [1, 3, 6, 9, 11, 12, 20, 21];
    const DIFFS = ["Facile", "Moyen", "Difficile", "Impossible", "Enfer", "Enfer+"];

    function bannerUnlockedAt(t, b) {
      if (t >= 5) return (b[BOSS_IDX[t]] || 0) >= 6;
      return BOSS_IDX.every((i) => (b[i] || 0) >= t + 1);
    }

    const story = OS.store.get("asteria-story", {});
    const gacha = OS.store.get("asteria", {});
    const owned = gacha.owned || {};
    const beaten = story.bossBeaten || {};
    const infiniteBest = OS.store.get("infinite-best", 0);
    const graalOwned = !!owned.graal;

    function bannerSvg(color, dim) {
      return '<svg class="mini-banner" viewBox="0 0 40 56" preserveAspectRatio="xMidYMid meet">' +
        '<path d="M6 2 H34 V44 L20 34 L6 44 Z" fill="' + color + '" opacity="' + (dim ? "0.28" : "1") + '"/>' +
        '<path d="M6 2 H34 V44 L20 34 L6 44 Z" fill="none" stroke="#0e1322"/>' +
        '<rect x="6" y="8" width="28" height="3" fill="#e3b23c" opacity="' + (dim ? "0.15" : "0.85") + '"/>' +
        '<circle cx="20" cy="20" r="5.5" fill="#e3b23c" opacity="' + (dim ? "0.15" : "0.9") + '"/>' +
        '</svg>';
    }

    const wrap = document.createElement("div");
    wrap.className = "trophies";

    const title = document.createElement("div");
    title.className = "team-hint";
    title.textContent = "Salle des trophées — la vitrine de vos exploits.";
    wrap.appendChild(title);

    const h1 = document.createElement("h3");
    h1.textContent = "Bannières de gloire";
    wrap.appendChild(h1);
    const shelf = document.createElement("div");
    shelf.className = "story-banners";
    let unlockedCount = 0;
    BANNERS.forEach((bn, t) => {
      const unlocked = bannerUnlockedAt(t, beaten);
      if (unlocked) unlockedCount++;
      const slot = document.createElement("div");
      slot.className = "banner-slot" + (unlocked ? " unlocked" : " locked");
      slot.innerHTML = bannerSvg(bn.color, !unlocked) + "<span>" + (unlocked ? bn.name : "Bannière scellée") + "</span>";
      shelf.appendChild(slot);
    });
    wrap.appendChild(shelf);
    const shelfNote = document.createElement("div");
    shelfNote.className = "team-hint";
    shelfNote.textContent = unlockedCount + " / " + BANNERS.length + " bannières — les 5 bannières d'âge demandent tous les " + BOSS_IDX.length + " boss d'histoire à un palier de difficulté ; la bannière du Général, de la Vouivre et de l'Archonte demandent leur boss en Enfer+.";
    wrap.appendChild(shelfNote);

    const h2 = document.createElement("h3");
    h2.textContent = "Records des boss (meilleur niveau vaincu)";
    wrap.appendChild(h2);
    const rec = document.createElement("div");
    rec.className = "trophies-records";
    BOSS_IDX.forEach((i) => {
      const lvl = beaten[i] || 0;
      const line = document.createElement("div");
      line.className = "trophies-record" + (lvl >= DIFFS.length ? " top" : "");
      line.innerHTML = "<b>Chapitre " + (i + 1) + "</b> — " + (lvl ? DIFFS[Math.min(lvl - 1, DIFFS.length - 1)] : "<i>jamais vaincu</i>");
      rec.appendChild(line);
    });
    const infLine = document.createElement("div");
    infLine.className = "trophies-record" + (infiniteBest >= 10 ? " top" : "");
    infLine.innerHTML = "<b>Mode Infini</b> — record : étage " + infiniteBest;
    rec.appendChild(infLine);
    wrap.appendChild(rec);

    const h3 = document.createElement("h3");
    h3.textContent = "Le Graal";
    wrap.appendChild(h3);
    const graal = document.createElement("div");
    graal.className = "trophy-graal" + (graalOwned ? " unlocked" : " locked");
    graal.innerHTML =
      '<div class="graal-name">✦ Astrée, Héritière des braises</div>' +
      '<div class="unit-rarity">SS · exclusif</div>' +
      '<div class="team-hint">' + (graalOwned
        ? "Rejointe ! La descendante du dragon des cendres combat à vos côtés (dégâts +16 %, jauge +22 % au départ, renvoi 32 %, soin 18 % des dégâts)."
        : "Verrouillée — battez le Dragon des cendres (chapitre 12) en difficulté Enfer+ pour la faire rejoindre votre collection.") +
      "</div>";
    wrap.appendChild(graal);

    body.appendChild(wrap);
  },
});
