/* Test de stress Astéria : batailles aléatoires longues (mode infini + quêtes) */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("/tmp/node_modules/jsdom");

const root = "/workspace/phoneos";
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = ["js/os.js", "js/sfx.js", "js/svgart.js", "js/apps/asteria.js", "js/apps/heroes.js", "js/apps/settings.js", "js/apps/trophies.js", "js/main.js"];
scripts.forEach((file) => {
  const code = fs.readFileSync(path.join(root, file), "utf8");
  html = html.replace('<script src="' + file + '"></script>', "<script>" + code.replace(/<\/script>/g, "<\\/script>") + "</script>");
});

const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true });
const { window } = dom;
const { document } = dom.window;

const errors = [];
window.addEventListener("error", (e) => errors.push(e.message));

setTimeout(() => {

  const OSref = () => window.eval("OS");
  let maxFloorSeen = 1;
  let battles = 0;
  let picksCount = 0;

  function inBattle() {
    return !!document.querySelector(".battle") && !document.querySelector(".battle-result");
  }

  function launchBattle() {
    OSref().openApp("asteria");
    const questTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
    if (!questTab) return;
    questTab.click();
    const btn = Math.random() < 0.5
      ? document.querySelector(".pull-btn.tier-infini")
      : document.querySelector(".pull-btn.tier-facile");
    if (btn) btn.click();
    battles++;
  }

  for (let draws = 0; draws < 600; draws++) {
    try {
      if (!inBattle()) launchBattle();
      const card = document.querySelector(".hand-card");
      if (card) {
        card.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
        picksCount++;
        if (picksCount >= 3) picksCount = 0;
      }
      const label = document.querySelector(".hp-row.enemy .hp-label");
      if (label) {
        const m = label.textContent.match(/Étage (\d+)/);
        if (m) maxFloorSeen = Math.max(maxFloorSeen, Number(m[1]));
      }
    } catch (e) {
      errors.push("iteration " + draws + ": " + e.message);
      break;
    }
  }

  // Ultimes : jouer le maximum de clics sur Ultime quand disponible
  let ults = 0;
  for (let i = 0; i < 400; i++) {
    try {
      if (!inBattle()) launchBattle();
      const ult = [...document.querySelectorAll(".battle-actions .pull-btn")].find((b) => !b.classList.contains("disabled"));
      if (ult) {
        ult.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
        ults++;
      } else {
        const card = document.querySelector(".hand-card");
        if (card) card.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      }
    } catch (e) { errors.push("ult " + i + ": " + e.message); break; }
  }

  // Boss du Mode Histoire : forcer la progression et enchaîner les tentatives
  let bossTurns = 0;
  try {
    window.localStorage.setItem("phoneos:asteria-story", JSON.stringify({ done: 3, music: false }));
    window.eval("OS").closeApp();
    for (let attempt = 0; attempt < 4; attempt++) {
      OSref().openApp("asteria");
      const storyTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Histoire");
      storyTab.click();
      const chapter4 = [...document.querySelectorAll(".story-chapter")].find((b) => b.textContent.includes("Gortak"));
      if (chapter4) chapter4.click();
      for (let i = 0; i < 3; i++) { const next = [...document.querySelectorAll(".story-next")].pop(); if (next) next.click(); }
      const bossBtn = document.querySelector(".story-boss");
      if (bossBtn) bossBtn.click();
      if (!document.querySelector(".battle")) continue;
      for (let i = 0; i < 40 && document.querySelector(".battle") && !document.querySelector(".battle-result"); i++) {
        const card = document.querySelector(".hand-card");
        if (card) { card.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); bossTurns++; }
        const ult = [...document.querySelectorAll(".battle-actions .pull-btn")].find((b) => !b.classList.contains("disabled"));
        if (ult) ult.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      }
      if (document.querySelector(".battle-result")) {
        const retry = [...document.querySelectorAll(".battle-actions button")].find((b) => b.textContent.includes("Réessayer"));
        const cont = [...document.querySelectorAll(".battle-actions button")].find((b) => b.textContent.includes("Continuer"));
        if (retry) retry.click();
        else if (cont) { cont.click(); bossTurns += 2; }
      }
    }
  } catch (e) { errors.push("story boss: " + e.message); }

  console.log("batailles lancées :", battles);
  console.log("étage max atteint :", maxFloorSeen);
  console.log("ultimes déclenchées :", ults);
  console.log("tours contre le boss d'histoire :", bossTurns);
  console.log("erreurs JS :", errors.length ? errors.slice(0, 5).join(" | ") : "0");
  const ok = errors.length === 0 && battles > 5 && maxFloorSeen >= 3 && ults > 0 && bossTurns > 10;
  console.log(ok ? "STRESS TEST : VALIDE" : "STRESS TEST : ÉCHEC");
  process.exit(ok ? 0 : 1);
}, 2600);
