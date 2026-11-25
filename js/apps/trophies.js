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
      { name: "Bannière des Failles", color: "#7551b8" },
      { name: "Bannière de la Sève-Lune", color: "#398f6b" },
      { name: "Bannière du Dernier Sablier", color: "#3d627f" },
    ];
    const BOSS_IDX = [1, 3, 6, 9, 11, 18, 20, 22];
    const DIFFS = ["Facile", "Moyen", "Difficile", "Impossible", "Enfer", "Enfer+"];

    const story = OS.store.get("asteria-v2-story", {});
    const gacha = OS.store.get("asteria-v2", {});
    const owned = gacha.owned || {};
    const beaten = story.bossBeaten || {};
    const infiniteBest = OS.store.get("asteria-v2-infinite-best", 0);
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
      const unlocked = BOSS_IDX.every((i) => (beaten[i] || 0) >= Math.min(t + 1, DIFFS.length));
      if (unlocked) unlockedCount++;
      const slot = document.createElement("div");
      slot.className = "banner-slot" + (unlocked ? " unlocked" : " locked");
      slot.innerHTML = bannerSvg(bn.color, !unlocked) + "<span>" + (unlocked ? bn.name : "Bannière scellée") + "</span>";
      shelf.appendChild(slot);
    });
    wrap.appendChild(shelf);
    const shelfNote = document.createElement("div");
    shelfNote.className = "team-hint";
    shelfNote.textContent = unlockedCount + " / " + BANNERS.length + " bannières — battez les 8 boss d'histoire au niveau affiché pour débloquer la suivante.";
    wrap.appendChild(shelfNote);

    const h2 = document.createElement("h3");
    h2.textContent = "Records des boss (meilleur niveau vaincu)";
    wrap.appendChild(h2);
    const rec = document.createElement("div");
    rec.className = "trophies-records";
    BOSS_IDX.forEach((i) => {
      const lvl = beaten[i] || 0;
      const line = document.createElement("div");
      line.className = "trophies-record" + (lvl === DIFFS.length ? " top" : "");
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
        ? "Rejointe ! La descendante du dragon des cendres combat à vos côtés (+5 %/tour, renvoi 20 %, soin 8 % des dégâts)."
        : "Verrouillée — battez le Dragon des cendres (chapitre 12) en difficulté Enfer+ pour la faire rejoindre votre collection.") +
      "</div>";
    wrap.appendChild(graal);

    body.appendChild(wrap);
  },
});
