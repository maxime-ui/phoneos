/* App : Trophées — progression de collection et record du Mode Infini */
"use strict";

OS.registerApp({
  id: "trophies",
  name: "Trophées",
  icon: "🏆",
  color: "#6b4f2a",
  render(body) {
    body.classList.add("padend");
    const gacha = OS.store.get("asteria-v2", {}) || {};
    const owned = gacha.owned || {};
    const units = (OS.asteriaData && OS.asteriaData.UNITS) || [];
    const collectible = units.filter((u) => u.id !== "graal");
    const count = collectible.filter((u) => owned[u.id]).length;
    const complete = count === collectible.length && collectible.length > 0;
    const graalOwned = !!owned.graal;
    const best = OS.store.get("asteria-v2-infinite-best", 0);

    const wrap = document.createElement("div");
    wrap.className = "trophies";
    const title = document.createElement("div");
    title.className = "team-hint";
    title.textContent = "Trophées — vos objectifs de collection et de combat.";
    wrap.appendChild(title);

    const h = document.createElement("h3");
    h.textContent = "Collection complète";
    wrap.appendChild(h);
    const collection = document.createElement("div");
    collection.className = "trophy-graal" + (graalOwned ? " unlocked" : complete ? " unlocked" : " locked");
    collection.innerHTML =
      '<div class="graal-name">✦ Astrée, Héritière des braises</div>' +
      '<div class="unit-rarity">SS · récompense de complétion</div>' +
      '<div class="team-hint">' + (graalOwned
        ? "Astrée a rejoint votre équipe. Collection complète : " + units.filter((u) => owned[u.id]).length + " / " + units.length + " héros."
        : complete
          ? "Objectif atteint ! Ouvrez Astéria → Collection pour réclamer Astrée et les 500 ◆ de la récompense finale."
          : "À débloquer : possédez les " + collectible.length + " héros R, SR et SSR. Progression : " + count + " / " + collectible.length + ".") +
      "</div>";
    wrap.appendChild(collection);

    const recordTitle = document.createElement("h3");
    recordTitle.textContent = "Mode Infini";
    wrap.appendChild(recordTitle);
    const record = document.createElement("div");
    record.className = "trophies-record" + (best >= 10 ? " top" : "");
    record.innerHTML = "<b>Meilleur étage</b> — " + best;
    wrap.appendChild(record);
    body.appendChild(wrap);
  },
});
