/* Test de fumée PhoneOS sous jsdom */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("/tmp/node_modules/jsdom");

const root = "/workspace/phoneos";
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");

// Inline chaque <script src> pour que les bindings globaux partagent la portée,
// comme le font de vraies balises script dans un navigateur.
const scripts = ["js/os.js", "js/apps/snake.js", "js/apps/game2048.js", "js/apps/epopee.js", "js/apps/calculator.js", "js/apps/notes.js", "js/apps/phone.js",
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
