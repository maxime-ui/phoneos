/* Test de stress Épopée : batailles aléatoires longues (mode infini + quêtes) */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("/tmp/node_modules/jsdom");

const root = "/workspace/phoneos";
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = [
  "js/os.js", "js/sfx.js", "js/svgart.js", "js/apps/snake.js", "js/apps/game2048.js", "js/apps/epopee.js", "js/apps/calculator.js",
  "js/apps/notes.js", "js/apps/phone.js", "js/apps/messages.js", "js/apps/clock.js",
  "js/apps/gallery.js", "js/apps/settings.js", "js/main.js",
];
scripts.forEach((file) => {
  const code = fs.readFileSync(path.join(root, file), "utf8");
  html = html.replace('<script src="' + file + '"></script>', "<script>" + code.replace(/<\/script>/g, "<\\/script>") + "</script>");
});

const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true });
const { window } = dom;
const { document } = dom.window;

const errors = [];
window.addEventListener("error", (e) => errors.push(e.message));

function unlock() {
  const pad = document.querySelector("#lock-pad");
  [...pad.querySelectorAll("button")].slice(1);
  const key = (k) => [...pad.querySelectorAll("button")].find((b) => b.textContent === k).dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  ["1", "2", "3", "4"].forEach(key);
  // attendre boot si nécessaire
}

setTimeout(() => {
  try {
    // attendre fin du boot puis déverrouiller
    const pad = document.querySelector("#lock-pad");
    const key = (k) => [...pad.querySelectorAll("button")].find((b) => b.textContent === k).dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    ["1", "2", "3", "4"].forEach(key);
  } catch (e) { errors.push("unlock: " + e.message); }

  const OSref = () => window.eval("OS");
  let maxFloorSeen = 1;
  let battles = 0;
  let picksCount = 0;

  function inBattle() {
    const layer = document.getElementById("layer-app");
    return !layer.classList.contains("hidden") && document.querySelector(".battle") && !document.querySelector(".battle-result");
  }

  function launchBattle() {
    OSref().openApp("epopee");
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

  // Boss du Mode Histoire (chapitre 4) : forcer la progression et jouer le combat
  let bossTurns = 0;
  try {
    window.localStorage.setItem("phoneos:epopee-story", JSON.stringify({ done: 3, music: false }));
    OSref().openApp("epopee");
    const storyTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Histoire");
    storyTab.click();
    const chapter4 = [...document.querySelectorAll(".story-chapter")].pop();
    if (chapter4) chapter4.click();
    for (let i = 0; i < 3; i++) { const next = [...document.querySelectorAll(".story-next")].pop(); if (next) next.click(); }
    const bossBtn = document.querySelector(".story-boss");
    if (bossBtn) bossBtn.click();
    for (let i = 0; i < 60 && document.querySelector(".battle") && !document.querySelector(".battle-result"); i++) {
      const card = document.querySelector(".hand-card");
      if (card) { card.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); bossTurns++; }
      const ult = [...document.querySelectorAll(".battle-actions .pull-btn")].find((b) => !b.classList.contains("disabled"));
      if (ult) ult.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
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
