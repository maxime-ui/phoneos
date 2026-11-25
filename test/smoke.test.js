/* Test de fumée PhoneOS sous jsdom */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("/tmp/node_modules/jsdom");

const root = "/workspace/phoneos";
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");

// Inline chaque <script src> pour que les bindings globaux partagent la portée,
// comme le font de vraies balises script dans un navigateur.
const scripts = ["js/os.js", "js/sfx.js", "js/svgart.js", "js/apps/snake.js", "js/apps/game2048.js", "js/apps/epopee.js", "js/apps/calculator.js", "js/apps/notes.js", "js/apps/phone.js",
  "js/apps/messages.js", "js/apps/clock.js", "js/apps/gallery.js", "js/apps/settings.js", "js/main.js"];
scripts.forEach((file) => {
  const code = fs.readFileSync(path.join(root, file), "utf8");
  const inline = "<script>" + code.replace(/<\/script>/g, "<\\/script>") + "<\/script>";
  html = html.replace('<script src="' + file + '"></script>', inline);
});

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "http://localhost/",
  pretendToBeVisual: true,
});
const { window } = dom;
const { document } = window;

let errors = [];
window.addEventListener("error", (e) => errors.push("window error: " + e.message));

function fire(el, type) { el.dispatchEvent(new window.Event(type, { bubbles: true })); }
function click(el) { el.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); }

const $ = (s) => document.querySelector(s);
const results = [];
function check(name, cond) { results.push((cond ? "PASS" : "FAIL") + "  " + name); }

// Déclenche DOMContentLoaded manuellement
// 1. Boot visibilité
check("DOMOSS existe", typeof window.eval("OS") === "object");
check("boot visible", !$("#layer-boot").classList.contains("hidden"));

// Attendre fin du boot (~2 s max)
setTimeout(() => {
  check("verrouillage affiché après boot", !$("#layer-lock").classList.contains("hidden"));

  // PIN incorrect
  const pad = $("#lock-pad");
  const buttons = [...pad.querySelectorAll("button")];
  const key = (k) => click(buttons.find((b) => b.textContent === k));
  ["1", "2", "3", "5"].forEach(key);
  check("mauvais PIN refusé", $("#layer-home").classList.contains("hidden"));

  // PIN correct
  key("C");
  ["1", "2", "3", "4"].forEach(key);
  check("déverrouillé -> home visible", !$("#layer-home").classList.contains("hidden"));

  // Ouvrir chaque app
  const apps = Object.keys(window.eval("OS").APPS);
  check("10 apps enregistrées", apps.length === 10);
  apps.forEach((id) => {
    window.eval("OS").openApp(id);
    check("app ouverte : " + id, !$("#layer-app").classList.contains("hidden") && $("#app-body").children.length > 0);
  });

  // Calculatrice : 7 × 8 = 56
  window.eval("OS").openApp("calculator");
  const padEl = $("#app-body");
  const b7 = [...padEl.querySelectorAll("button")].find((b) => b.textContent === "7");
  const mul = [...padEl.querySelectorAll("button")].find((b) => b.textContent === "×");
  const b8 = [...padEl.querySelectorAll("button")].find((b) => b.textContent === "8");
  const eq = [...padEl.querySelectorAll("button")].find((b) => b.textContent === "=");
  [b7, mul, b8, eq].forEach(click);
  const res = padEl.querySelector(".calc-result").textContent;
  check("calculatrice 7×8=56", res === "56");

  // Épopée : lancer une quête et jouer 3 cartes
  window.eval("OS").openApp("epopee");
  const questTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  check("onglet quêtes présent", !!questTab);
  questTab.click();
  const tierBtn = [...document.querySelectorAll(".pull-btn")].find((b) => b.classList.contains("tier-facile"));
  check("bouton quête facile présent", !!tierBtn);
  tierBtn.click();
  check("vue combat affichée", !!document.querySelector(".battle"));
  const beforeLog = document.querySelectorAll(".battle-log > div").length;
  for (let draws = 0; draws < 3; draws++) {
    const card = document.querySelector(".hand-card:not([disabled])");
    if (card) card.click();
  }
  const afterLog = document.querySelectorAll(".battle-log > div").length;
  check("3 cartes jouées -> log enrichi (" + beforeLog + " → " + afterLog + ")", afterLog > beforeLog);

  // Mode Infini : démarrage sans erreur, étage affiché
  window.eval("OS").openApp("epopee");
  const questTab2 = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  questTab2.click();
  const infBtn = [...document.querySelectorAll(".pull-btn")].find((b) => b.classList.contains("tier-infini"));
  check("bouton Mode Infini présent", !!infBtn);
  infBtn.click();
  check("vue infini affichée (étage 1)", !!document.querySelector(".battle") && document.body.textContent.includes("Étage 1"));
  for (let draws = 0; draws < 3; draws++) {
    const card = document.querySelector(".hand-card:not([disabled])");
    if (card) card.click();
  }
  check("infini : tour joué sans erreur", document.querySelectorAll(".battle-log > div").length > 2);

  // ---- Mode Histoire ----
  const storyTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Histoire");
  check("onglet Histoire présent", !!storyTab);
  storyTab.click();
  check("liste des 12 chapitres", document.querySelectorAll(".story-chapter").length === 12);
  check("chapitres 2-12 verrouillés au départ", document.querySelectorAll(".story-chapter.locked").length === 11);
  check("trois actes affichés", document.querySelectorAll(".story-act").length === 3);
  check("toggle musique présent", !!document.querySelector(".music-toggle"));

  check("5 difficultés affichées", document.querySelectorAll(".diff-row .pull-btn").length === 5);
  const enferBtn = [...document.querySelectorAll(".diff-row .pull-btn")].find((b) => b.textContent.includes("Enfer"));
  check("bouton Enfer présent", !!enferBtn);
  if (enferBtn) enferBtn.click();
  check("difficulté Enfer persistée", (JSON.parse(window.localStorage.getItem("phoneos:epopee-story") || "{}").diff) === "enfer");

  document.querySelector(".story-chapter").click();
  check("scène SVG visible", !!document.querySelector(".story-art"));
  check("titre du chapitre affiché", !!document.querySelector(".story-title") && document.querySelector(".story-title").textContent.includes("L'appel du village"));
  const firstLine = document.querySelector(".story-line.current");
  check("ligne narrée présente", !!firstLine && firstLine.textContent.length > 0);

  for (let i = 0; i < 4; i++) {
    const next = [...document.querySelectorAll(".story-next")].pop();
    if (next) next.click();
  }
  const storySaved = JSON.parse(window.localStorage.getItem("phoneos:epopee-story") || "{}");
  check("progression chapitre 1 sauvegardée", storySaved.done >= 1);
  check("récompense chapitre affichée", document.querySelector("#app-body").textContent.includes("CHAPITRE TERMINÉ"));

  storyTab.click();
  check("chapitres 3-12 encore verrouillés", document.querySelectorAll(".story-chapter.locked").length === 10);

  const music = document.querySelector(".music-toggle");
  music.click();
  const musicSaved = JSON.parse(window.localStorage.getItem("phoneos:epopee-story") || "{}");
  check("musique ON persistée", document.querySelector(".music-toggle").textContent.includes("ON") && musicSaved.music === true);
  document.querySelector(".music-toggle").click();

  // Choix narratif du chapitre 3 (bénédiction persistée)
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:epopee-story"));s.done=2;localStorage.setItem("phoneos:epopee-story",JSON.stringify(s));})()');
  window.eval("OS").openApp("epopee");
  const storyTabC = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Histoire");
  storyTabC.click();
  const chapter3 = [...document.querySelectorAll(".story-chapter")][2];
  check("chapitre 3 déverrouillé", chapter3 && !chapter3.classList.contains("locked"));
  chapter3.click();
  for (let i = 0; i < 2; i++) {
    const next = [...document.querySelectorAll(".story-next")].pop();
    if (next) next.click();
  }
  check("choix narratif affiché", document.querySelectorAll(".story-choice").length === 2);
  const choice = document.querySelector(".story-choice");
  if (choice) choice.click();
  const blessingSaved = JSON.parse(window.localStorage.getItem("phoneos:epopee-story") || "{}");
  check("bénédiction sauvegardée", !!blessingSaved.blessing && document.querySelector("#app-body").textContent.includes("CHAPITRE TERMINÉ"));

  // Boss du chapitre 4 : Gortak
  window.eval("OS").openApp("epopee");
  const storyTab2 = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Histoire");
  storyTab2.click();
  const chapter4 = [...document.querySelectorAll(".story-chapter")][3];
  check("chapitre 4 (Gortak) déverrouillé", chapter4 && !chapter4.classList.contains("locked"));
  chapter4.click();
  for (let i = 0; i < 3; i++) {
    const next = [...document.querySelectorAll(".story-next")].pop();
    if (next) next.click();
  }
  const bossBtn = document.querySelector(".story-boss");
  check("bouton boss Gortak présent", !!bossBtn);
  if (bossBtn) bossBtn.click();
  check("combat boss lancé", !!document.querySelector(".battle") && document.body.textContent.includes("Gortak") && document.body.textContent.includes("Boss d'histoire"));
  for (let draws = 0; draws < 3; draws++) {
    const card = document.querySelector(".hand-card");
    if (card) card.click();
  }
  check("combat boss : tour joué sans erreur", document.querySelectorAll(".battle-log > div").length > 3);

  // Boss final : le dragon des cendres
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:epopee-story"));s.done=11;localStorage.setItem("phoneos:epopee-story",JSON.stringify(s));})()');
  window.eval("OS").openApp("epopee");
  const storyTab3 = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Histoire");
  storyTab3.click();
  const chapter12 = [...document.querySelectorAll(".story-chapter")][11];
  check("chapitre 12 déverrouillé", chapter12 && !chapter12.classList.contains("locked"));
  chapter12.click();
  const next12 = [...document.querySelectorAll(".story-next")].pop();
  if (next12) next12.click();
  const dragonBtn = document.querySelector(".story-boss");
  check("bouton boss dragon présent", !!dragonBtn);
  if (dragonBtn) dragonBtn.click();
  check("boss final lancé", !!document.querySelector(".battle") && document.body.textContent.includes("Dragon des cendres") && document.body.textContent.includes("Boss d'histoire"));
  const dragonHp = document.querySelector(".hp-row.enemy .hp-num");
  check("dragon scalé ×3,2 en Enfer (> 120 000 PV)", !!dragonHp && Number(dragonHp.textContent.split("/")[0]) > 120000);
  check("difficulté affichée dans le combat", document.body.textContent.includes("Boss d'histoire · Enfer"));

  window.eval("OS").closeApp();

  // Retour -> home
  window.eval("OS").closeApp();
  check("retour home", !$("#layer-home").classList.contains("hidden"));

  // Recents
  window.eval("OS").showRecents();
  const cards = document.querySelectorAll(".recents-card").length;
  check("recents non vide (" + cards + ")", cards >= 5);
  window.eval("OS").clearRecents();
  check("recents vidées -> home", !$("#layer-home").classList.contains("hidden"));

  // Notifications
  window.eval("OS").notify("✅", "#333", "Test", "Message de test");
  check("notification affichée", document.querySelectorAll(".notif").length >= 1);

  // Power off -> boot
  window.eval("OS").state.locked = false;
  // powerOff via bouton
  click(document.getElementById("btn-power"));
  check("écran éteint", !document.getElementById("screen-off").classList.contains("hidden"));
  click(document.getElementById("btn-power"));
  check("reboot lancé", !$("#layer-boot").classList.contains("hidden"));

  setTimeout(() => {
    check("reboot -> lock", !$("#layer-lock").classList.contains("hidden"));

    if (errors.length) {
      console.log("ERREURS:\n" + errors.join("\n"));
    }
    console.log(results.join("\n"));
    const fails = results.filter((r) => r.startsWith("FAIL")).length;
    console.log("\n" + (fails === 0 && errors.length === 0 ? "TOUS LES TESTS PASSENT" : fails + " échec(s), " + errors.length + " erreur(s) JS"));
    process.exit(fails === 0 && errors.length === 0 ? 0 : 1);
  }, 2600);
}, 2400);
