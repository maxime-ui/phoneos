/* App : Personnages — fiches détaillées des héros */
"use strict";

let heroesPending = null;
OS.heroes = {
  open(id) {
    heroesPending = id;
    OS.openApp("heroes");
  },
};

OS.registerApp({
  id: "heroes",
  name: "Personnages",
  icon: "📖",
  color: "#3b6bd4",
  render(body) {
    body.classList.add("padend");
    const D = OS.epopeeData;
    const sv = OS.store.get("epopee", {}) || {};
    sv.owned = sv.owned || {};
    sv.evo = sv.evo || {};
    sv.relics = sv.relics || {};

    function showSheet(id) {
      body.innerHTML = "";
      const u = D.byId(id);
      if (!u) return showList();
      const owned = !!sv.owned[id];
      const rar = D.RARITY[u.r] || { label: "R", color: "#7d869c" };
      const evo = owned ? (sv.evo[id] || 0) : 0;

      const panel = document.createElement("div");
      panel.className = "sheet-panel unit-card r" + u.r;

      const head = document.createElement("div");
      head.className = "sheet-head";
      head.innerHTML =
        '<span class="tag-chip" style="background:' + rar.color + '">' + rar.label + "</span>" +
        '<span class="unit-name sheet-name">' + u.name + " " + "★".repeat(evo) + "</span>";
      panel.appendChild(head);

      const cls = document.createElement("div");
      cls.className = "sheet-line";
      cls.innerHTML = "<b>" + u.cls + "</b> — " + (D.CLASS_BONUS[u.cls] || "");
      panel.appendChild(cls);

      const cards = document.createElement("div");
      cards.className = "tag-row";
      u.cards.forEach((t) => {
        const c = D.CARD[t];
        const chip = document.createElement("span");
        chip.className = "tag-chip";
        chip.style.background = c.color;
        chip.textContent = c.label;
        cards.appendChild(chip);
      });
      panel.appendChild(cards);

      const stats = document.createElement("div");
      stats.className = "sheet-line";
      if (owned) {
        const p = D.corePower(u, sv);
        stats.innerHTML =
          "<b>ATK " + p.atk + " · PV " + p.hp + "</b><br>" +
          "<small>Doublons : ×" + (sv.owned[id] || 1) + " · +8 % par copie (plafond +96 %)" +
          (evo ? " · Évolution : +" + (10 * evo) + " % ATK/PV" : "") + "</small>";
      } else {
        stats.innerHTML =
          "<b>ATK " + u.atk + " · PV " + u.hp + "</b><br>" +
          "<small>Non invoqué — cherchez ce héros via le portail de classe " + u.cls + " (onglet Invoquer de l'Épopée)</small>";
      }
      panel.appendChild(stats);

      const sk = D.SKILL_INFO[id];
      if (sk) {
        const s = document.createElement("div");
        s.className = "sheet-line";
        s.innerHTML = "<b>✦ Compétence : " + sk[0] + "</b><br>" + sk[1];
        panel.appendChild(s);
      }

      const pa = D.PASSIVE_INFO[id];
      if (pa) {
        const s = document.createElement("div");
        s.className = "sheet-line";
        s.innerHTML = "<b>✧ Passif : " + pa[0] + "</b><br>" + pa[1];
        panel.appendChild(s);
      }

      if (owned) {
        const labels = D.evoSkillLabelsOf(u, evo);
        const ev = document.createElement("div");
        ev.className = "sheet-line";
        ev.innerHTML = "<b>Éveils &amp; talents</b><br>" + (labels.length ? labels.join("<br>") : "Aucun éveil — évoluez ★ dans la Forge (onglet Équipe de l'Épopée)");
        panel.appendChild(ev);
        if (evo < 3 && D.EVO_REQ[u.r]) {
          const req = D.EVO_REQ[u.r][evo] || {};
          const reqTxt = Object.keys(req).map((k) => req[k] + "× " + D.LOOT[k].name).join(" + ");
          const nxt = document.createElement("div");
          nxt.className = "sheet-line";
          nxt.innerHTML = "<small>Évolution suivante : " + "★".repeat(evo) + "→ " + "★".repeat(evo + 1) + " · " + (reqTxt || "—") + "</small>";
          panel.appendChild(nxt);
        }
      } else if (id === "graal") {
        const g = document.createElement("div");
        g.className = "sheet-line";
        g.innerHTML = "<small>SS exclusive : vainquez le <b>Dragon des cendres en Enfer+</b> (Mode Histoire, chapitre 12)</small>";
        panel.appendChild(g);
      }

      const bar = document.createElement("div");
      bar.className = "sheet-actions";
      const back = document.createElement("button");
      back.className = "pull-btn";
      back.textContent = "↩ Retour à la liste";
      back.addEventListener("click", showList);
      bar.appendChild(back);
      body.appendChild(panel);
      body.appendChild(bar);
    }

    function showList() {
      body.innerHTML = "";
      const ownedCount = D.UNITS.filter((u) => sv.owned[u.id]).length;
      const head = document.createElement("div");
      head.className = "team-hint";
      head.textContent = "Personnages — " + ownedCount + " / " + D.UNITS.length + " possédés. Touchez un héros pour sa fiche détaillée :";
      body.appendChild(head);

      const grid = document.createElement("div");
      grid.className = "col-grid";
      D.UNITS.forEach((u) => {
        const owned = !!sv.owned[u.id];
        const card = document.createElement("div");
        card.className = "unit-card r" + u.r + (owned ? "" : " locked");
        card.innerHTML =
          '<div class="unit-name">' + u.name + " " + "★".repeat(sv.evo[u.id] || 0) + "</div>" +
          '<span class="unit-cls">' + u.cls + " · " + (D.RARITY[u.r] ? D.RARITY[u.r].label : "R") + "</span>";
        card.addEventListener("click", () => {
          OS.sfx.play("ui");
          showSheet(u.id);
        });
        grid.appendChild(card);
      });
      body.appendChild(grid);
    }

    if (heroesPending) {
      const id = heroesPending;
      heroesPending = null;
      showSheet(id);
    } else {
      showList();
    }
  },
});
