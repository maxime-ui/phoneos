/* Test de fumée PhoneOS sous jsdom */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("/tmp/node_modules/jsdom");

const root = "/workspace/phoneos";
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");

// Inline chaque <script src> pour que les bindings globaux partagent la portée,
// comme le font de vraies balises script dans un navigateur.
const scripts = ["js/os.js", "js/sfx.js", "js/svgart.js", "js/apps/asteria.js", "js/apps/heroes.js", "js/apps/settings.js", "js/apps/trophies.js", "js/main.js"];

// Seed save Astéria : toutes les unités SAUF le Graal + équipe avec Soigneur (doit précéder tous les scripts)
const unitsBlock = fs.readFileSync(path.join(root, "js/apps/asteria.js"), "utf8").match(/UNITS\s*=\s*\[([\s\S]*?)\n    \];/)[1];
const unitIds = [...unitsBlock.matchAll(/\{ id: "([^"]+)"/g)].map((m) => m[1]);
const ownedAll = {};
unitIds.forEach((id) => { if (id !== "graal") ownedAll[id] = 1; });
const seedSave = { quartz: 300, owned: ownedAll, team: ["bron", "edele", "nerys"] };
html = html.replace('<script src="js/os.js">',
  '<script>localStorage.setItem("phoneos:event-debug", JSON.stringify("fortune"));localStorage.setItem("phoneos:asteria", ' + JSON.stringify(JSON.stringify(seedSave)) + ');</script>\n<script src="js/os.js">');
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
  check("4 apps enregistrées (Astéria, Personnages, Réglages, Trophées)", apps.length === 4);
  apps.forEach((id) => {
    window.eval("OS").openApp(id);
    check("app ouverte : " + id, !$("#layer-app").classList.contains("hidden") && $("#app-body").children.length > 0);
  });

  // Astéria : roster complet et classes de gameplay
  window.eval("OS").openApp("asteria");
  const teamTabR = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabR.click();
  check("roster de 112 unités possédées", document.querySelectorAll(".roster .unit-card").length === 112);
  const helpText = $("#app-body").textContent;
  check("aides de classe Soigneur/Défenseur/Tueur", helpText.includes("Soigneur") && helpText.includes("Défenseur") && helpText.includes("Tueur"));

  // Composer une équipe 100 % Soigneurs par clics UI
  const clickUnit = (name) => {
    const c = [...document.querySelectorAll(".roster .unit-card")].find((x) => x.querySelector(".unit-name").textContent === name);
    if (c) c.click();
  };
  clickUnit("Bron"); clickUnit("Nerys"); clickUnit("Sirona"); clickUnit("Poppy");
  check("équipe 3 Soigneurs composée", [...document.querySelectorAll(".roster .unit-card.in-team .unit-cls")].every((el) => el.textContent === "Soigneur"));

  // Forge d'évolution : butin semé puis 1re évolution de Bron (+8 Éclat d'acier)
  const saveForge = JSON.parse(window.localStorage.getItem("phoneos:asteria"));
  saveForge.loot = { eclat: 999, coeur: 50, larme: 50, couronne: 50, sceau: 50, poussiere: 50, cristal: 20 };
  window.eval('(function(){localStorage.setItem("phoneos:asteria",' + JSON.stringify(JSON.stringify(saveForge)) + ')})()');
  window.eval("OS").openApp("asteria");
  const teamTabF = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabF.click();
  check("inventaire de butin affiché (8 matières)", document.querySelectorAll(".loot-chip").length === 8);
  check("forge d'évolution : lignes présentes", document.querySelectorAll(".forge-line").length >= 100);
  const bronLine = [...document.querySelectorAll(".forge-line")].find((l) => l.querySelector(".unit-name").textContent.startsWith("Bron"));
  check("forge : ligne Bron évolutive et finançable", !!bronLine && !bronLine.querySelector("button").disabled);
  check("forge : prochain éveil annoncé", !!bronLine && bronLine.innerHTML.includes("Éveil I ✦ Jauge de départ"));
  if (bronLine) bronLine.querySelector("button").click();
  const saveEvo = JSON.parse(window.localStorage.getItem("phoneos:asteria"));
  check("évolution Bron persistée (+10 %, −8 Éclat)", saveEvo.evo.bron === 1 && saveEvo.loot.eclat === 991);
  const bronCardF = [...document.querySelectorAll(".roster .unit-card")].find((c) => c.querySelector(".unit-name").textContent.includes("Bron"));
  check("étoiles ★ affichées sur la carte", !!bronCardF && bronCardF.querySelector(".unit-name").textContent.includes("★"));
  check("éveil I acquis visible sur Bron évolué", !!bronCardF && bronCardF.textContent.includes("Éveil I ✦ Jauge de départ"));
  const ssrCard = [...document.querySelectorAll(".roster .unit-card")].find((c) => c.className.includes("r3"));
  check("passif ✧ affiché sur les SSR", !!ssrCard && ssrCard.textContent.includes("Passif :"));

  // Reliquaire du raid : 3 reliques forgees avec le butin, bonus communs a l'equipe
  check("bandeau d'evenement force (fortune)", !!document.querySelector(".event-chip") && document.querySelector(".event-chip").textContent.includes("Week-end de fortune"));
  check("reliquaire : 3 reliques + 3 ensembles affichés", document.querySelectorAll(".relic-line:not(.set-line)").length === 3 && document.querySelectorAll(".set-line").length === 3);
  const bronAtkOf = () => { const c = [...document.querySelectorAll(".roster .unit-card")].find((x) => x.querySelector(".unit-name").textContent.includes("Bron")); return c ? Number((c.textContent.match(/ATK (\d+)/) || [0, 0])[1]) : 0; };
  const bronAtkBefore = bronAtkOf();
  const armorLine = [...document.querySelectorAll(".relic-line")].find((l) => l.textContent.includes("\u00c9caille du Dragon"));
  check("\u00c9caille du Dragon forgerable", !!armorLine && !armorLine.querySelector("button").disabled);
  if (armorLine) armorLine.querySelector("button").click();
  const saveRelic = JSON.parse(window.localStorage.getItem("phoneos:asteria"));
  check("\u00c9caille forge\u00e9e : \u221220 \u00c9clats, \u221215 C\u0153urs", saveRelic.relics.armure === 1 && saveRelic.loot.eclat === 971 && saveRelic.loot.coeur === 35);
  const weaponLine = [...document.querySelectorAll(".relic-line")].find((l) => l.textContent.includes("Lame du Raid"));
  check("Lame du Raid forgerable", !!weaponLine && !weaponLine.querySelector("button").disabled);
  if (weaponLine) weaponLine.querySelector("button").click();
  const saveRelic2 = JSON.parse(window.localStorage.getItem("phoneos:asteria"));
  check("Lame forg\u00e9e et persist\u00e9e", saveRelic2.relics.arme === 1);
  check("Lame : ATK de l'\u00e9quipe renforc\u00e9e (" + bronAtkBefore + " \u2192 " + bronAtkOf() + ")", bronAtkOf() > bronAtkBefore);
  const flagLine = [...document.querySelectorAll(".relic-line")].find((l) => l.textContent.includes("\u00c9tendard des trois phases"));
  check("\u00c9tendard forgerable (Couronnes + Sceaux en stock)", !!flagLine && !flagLine.querySelector("button").disabled);
  if (flagLine) flagLine.querySelector("button").click();
  check("Étendard forgé, 3 reliques actives", JSON.parse(window.localStorage.getItem("phoneos:asteria")).relics.etendard === 1 && [...document.querySelectorAll(".relic-line:not(.set-line)")].every((l) => l.textContent.includes("Forgée")));

  // Reliques v2 : amélioration (Poussières + Cristaux) et bonus d'ensemble
  check("bonus d'ensemble : Pacte du trio + Trinité actifs", [...document.querySelectorAll(".set-line.ready")].length === 2 && document.body.textContent.includes("Pacte du trio") && document.body.textContent.includes("Trinité du dragon"));
  check("Harmonie parfaite inactive (rang N)", [...document.querySelectorAll(".set-line.ready")].every((l) => !l.textContent.includes("Harmonie parfaite")));
  const armorLine2 = [...document.querySelectorAll(".relic-line:not(.set-line)")].find((l) => l.textContent.includes("Écaille du Dragon"));
  check("Écaille N : principale affichée, aucune sous-stat", !!armorLine2 && armorLine2.textContent.includes("Principale") && armorLine2.textContent.includes("Aucune sous-stat"));
  const upBtn = armorLine2 && [...armorLine2.querySelectorAll("button")].find((b) => b.textContent.includes("Améliorer"));
  check("Écaille améliorable (→ R)", !!upBtn && !upBtn.disabled);
  if (upBtn) upBtn.click();
  const saveUp = JSON.parse(window.localStorage.getItem("phoneos:asteria"));
  check("Écaille passée en R (−10 Poussières)", saveUp.relics.armure === 2 && saveUp.loot.poussiere === 40);
  const armorLine3 = [...document.querySelectorAll(".relic-line:not(.set-line)")].find((l) => l.textContent.includes("Écaille du Dragon"));
  check("Écaille R : chip rang, PV max +8 % et 1re sous-stat", !!armorLine3 && armorLine3.textContent.includes("R · Rare") && armorLine3.textContent.includes("PV max +8 %") && armorLine3.textContent.includes("Soins +4 %"));

  // Collection : 113 héros, le Graal grisé, récompense de complétion réclamable
  const colTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Collection");
  check("onglet Collection présent", !!colTab);
  colTab.click();
  check("collection affiche les " + unitIds.length + " héros", document.querySelectorAll(".col-grid .unit-card").length === unitIds.length);
  check("Graal non possédé grisé", document.querySelectorAll(".col-grid .unit-card.locked").length === 1 && document.body.textContent.includes("Astrée, Héritière des braises"));
  check("progression 112/113 affichée", document.body.textContent.includes("112 / 113"));
  const claim = document.querySelector(".collect-line .claim-btn");
  check("récompense 25 % réclamable", !!claim);
  if (claim) claim.click();
  check("réclamation +50 ◆ persistée", JSON.parse(window.localStorage.getItem("phoneos:asteria")).quartz === 350 && JSON.parse(window.localStorage.getItem("phoneos:asteria")).collected.includes(25));

  // App Personnages : navigation Collection -> fiche détaillée -> retour
  const colCard = [...document.querySelectorAll(".col-grid .unit-card")].find((c) => !c.classList.contains("locked") && c.textContent.includes("Morgane"));
  check("carte Collection cliquable", !!colCard);
  if (colCard) colCard.click();
  check("clic Collection -> app Personnages ouverte", Object.keys(window.eval("OS").APPS).includes("heroes") && $("#app-body").querySelectorAll(".sheet-panel").length === 1);
  check("fiche Morgane : doublons, passif et compétence", $("#app-body").textContent.includes("Doublons") && $("#app-body").textContent.includes("Passif :") && $("#app-body").textContent.includes("Compétence :"));
  const backBtn = document.querySelector(".sheet-actions .pull-btn");
  check("bouton retour présent", !!backBtn);
  if (backBtn) backBtn.click();
  check("retour -> liste complète de " + unitIds.length + " héros", document.querySelectorAll(".col-grid .unit-card").length === unitIds.length);
  window.eval("OS").heroes.open("graal");
  check("fiche Graal non invoqué : indice Enfer+", $("#app-body").querySelectorAll(".sheet-panel").length === 1 && $("#app-body").textContent.includes("Dragon des cendres") && $("#app-body").textContent.includes("Enfer+") && !$("#app-body").textContent.includes("Doublons"));

  // Réglages bonus : mode daltonien + vitesse des dialogues
  window.eval("OS").openApp("settings");
  const cbInput = [...document.querySelectorAll(".switch input")].find((inp) => inp.closest(".row, .set-row, div") && inp.closest(".row, .set-row, div").textContent.includes("Mode daltonien"));
  check("toggle Mode daltonien présent", !!cbInput);
  if (cbInput) cbInput.click();
  check("mode daltonien : body.cb appliqué", document.body.classList.contains("cb"));
  check("mode daltonien persisté", window.localStorage.getItem("phoneos:colorblind") === "true");
  const speedBtns = [...document.querySelectorAll(".seg-row button, button")].filter((b) => b.textContent === "Instantané" || b.textContent === "Rapide");
  const instantBtn = speedBtns.find((b) => b.textContent === "Instantané");
  check("rangée vitesse des dialogues présente", speedBtns.length >= 2);
  if (instantBtn) instantBtn.click();
  check("vitesse des dialogues persistée (instant)", window.localStorage.getItem("phoneos:story-speed") === JSON.stringify("instant"));
  window.eval("OS").openApp("asteria");

  // Portail de classe : coût 5 ◆ + pity persistée
  const summonTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Invoquer");
  summonTab.click();
  check("portails de classe affichés (9)", document.querySelectorAll(".portal-grid .portal-btn").length === 9);
  const healerPortal = [...document.querySelectorAll(".portal-grid .portal-btn")].find((b) => b.textContent.includes("Soigneur"));
  check("portail Soigneur présent", !!healerPortal);
  if (healerPortal) healerPortal.click();
  const saveAfterPortal = JSON.parse(window.localStorage.getItem("phoneos:asteria"));
  check("portail : −5 ◆ et pity persistée", saveAfterPortal.quartz === 345 && saveAfterPortal.pity["Soigneur"] >= 1);
  const portalCard = document.querySelector(".pull-results .unit-card");
  check("portail : personnage Soigneur invoqué", !!portalCard && portalCard.querySelector(".unit-cls").textContent.includes("Soigneur"));

  // Missions quotidiennes : seed contrôlé pour aujourd'hui (date réelle, même jour)
  const today = new Date();
  const tk = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  window.eval('(function(){localStorage.setItem("phoneos:asteria-daily",JSON.stringify({date:"' + tk + '",missions:[{t:"cards",label:"Jouer 30 cartes en combat",goal:30,reward:20,p:0,claimed:false},{t:"pulls",label:"Invoquer 10 héros",goal:10,reward:25,p:10,claimed:false},{t:"wins",label:"Gagner 3 quêtes",goal:3,reward:30,p:1,claimed:false}]}));})()');
  window.eval('(function(){localStorage.setItem("phoneos:event-debug", JSON.stringify("invoqueurs"));})()');
  window.eval("OS").openApp("asteria");
  const questTabD = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  questTabD.click();
  check("3 missions du jour affichées", document.querySelectorAll(".daily-mission").length === 3);
  check("bandeau d'evenement passe en Week-end des invocateurs", !!document.querySelector(".event-chip") && document.querySelector(".event-chip").textContent.includes("invocateurs"));
  check("mission 'Invoquer' prête à réclamer", !!document.querySelector(".daily-mission .claim-btn"));
  document.querySelector(".daily-mission .claim-btn").click();
  check("réclamation mission +25 ◆", JSON.parse(window.localStorage.getItem("phoneos:asteria")).quartz === 370);
  check("mission réclamée marquée ✓", JSON.parse(window.localStorage.getItem("phoneos:asteria-daily")).missions[1].claimed === true);

  // Quête facile : le Soigneur soigne au lieu d'attaquer
  const questTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  check("onglet quêtes présent", !!questTab);
  questTab.click();
  const tierBtn = [...document.querySelectorAll(".pull-btn")].find((b) => b.classList.contains("tier-facile"));
  check("bouton quête facile présent", !!tierBtn);
  tierBtn.click();
  check("vue combat affichée", !!document.querySelector(".battle"));
  check("jauge de d\u00e9part : Étendard N +15 et Trinité +10 = 25 %", document.querySelector(".gauge .hp-num") && document.querySelector(".gauge .hp-num").textContent === "25%");
  const beforeLog = document.querySelectorAll(".battle-log > div").length;
  for (let draws = 0; draws < 3; draws++) {
    const card = document.querySelector(".hand-card:not([disabled])");
    if (card) card.click();
  }
  const afterLog = document.querySelectorAll(".battle-log > div").length;
  check("3 cartes jouées -> log enrichi (" + beforeLog + " → " + afterLog + ")", afterLog > beforeLog);
  const logText = document.querySelector(".battle-log") ? document.querySelector(".battle-log").textContent : "";
  check("Soigneur soigne l'allié le plus blessé", logText.includes("soigne"));
  const dailyCards = JSON.parse(window.localStorage.getItem("phoneos:asteria-daily")).missions.find((m) => m.t === "cards");
  check("mission cartes progresse en combat (3 jouées)", !!dailyCards && dailyCards.p >= 3);

  // Chasse au butin : équipe offensive gagne la quête facile → Éclat d'acier garanti
  const teamTabW = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabW.click();
  clickUnit("Mère Édelé"); clickUnit("Sirona"); clickUnit("Poppy");
  clickUnit("Bron"); clickUnit("Tilia"); clickUnit("Nerys");
  const questTabW = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  questTabW.click();
  let lootSeen = false;
  for (let attempt = 0; attempt < 4 && !lootSeen; attempt++) {
    const tierBtnW = [...document.querySelectorAll(".pull-row .pull-btn")].find((b) => b.classList.contains("tier-facile"));
    if (!tierBtnW) break;
    tierBtnW.click();
    for (let t2 = 0; t2 < 16; t2++) {
      if (!document.querySelector(".battle") || document.querySelector(".battle-result")) break;
      for (let p2 = 0; p2 < 3; p2++) {
        const card2 = document.querySelector(".hand-card:not([disabled])");
        if (card2) card2.click();
      }
      const lg = document.querySelector(".battle-log");
      if (lg && lg.textContent.includes("Butin")) { lootSeen = true; break; }
    }
  }
  check("butin : Éclat d'acier gagné en victoire facile", lootSeen && JSON.parse(window.localStorage.getItem("phoneos:asteria")).loot.eclat >= 972);

  // Mode Infini : démarrage sans erreur, étage affiché
  window.eval("OS").openApp("asteria");
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
  // Évolution poussée : l'équipe est réinitialisée avec Bron ★★★ (talents II/III empilables)
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria"));s.team=["bron","tilia","nerys"];s.evo={bron:3};localStorage.setItem("phoneos:asteria",JSON.stringify(s));})()');
  window.eval("OS").openApp("asteria");
  const teamTabE = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabE.click();
  const bronCardE = [...document.querySelectorAll(".roster .unit-card")].find((c) => c.querySelector(".unit-name").textContent.includes("Bron"));
  check("Éveils II/III + 2ᵉ talent de classe affichés sur Bron ★★★ (Berserker)", !!bronCardE && bronCardE.textContent.includes("Éveil II ✦ Dégâts +8 %") && bronCardE.textContent.includes("Talent ✦ Critique +8 %") && bronCardE.textContent.includes("Éveil III ✦ Rage +15 % sous le seuil") && bronCardE.textContent.includes("Talent ✦ PV max +8 %"));

  const storyTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Histoire");
  check("onglet Histoire présent", !!storyTab);
  storyTab.click();
  check("liste des 12 chapitres", document.querySelectorAll(".story-chapter").length === 12);
  check("chapitres 2-12 verrouillés au départ", document.querySelectorAll(".story-chapter.locked").length === 11);
  check("trois actes affichés", document.querySelectorAll(".story-act").length === 3);
  check("toggle musique présent", !!document.querySelector(".music-toggle"));

  check("6 difficultés affichées (Enfer+ inclus)", document.querySelectorAll(".diff-row .pull-btn").length === 6);
  check("étagère de 5 bannières", document.querySelectorAll(".banner-slot").length === 5);
  check("aucune bannière au départ", document.querySelectorAll(".banner-slot.locked").length === 5);
  const enferBtn = [...document.querySelectorAll(".diff-row .pull-btn")].find((b) => b.textContent.includes("Enfer"));
  check("bouton Enfer présent", !!enferBtn);
  if (enferBtn) enferBtn.click();
  check("difficulté Enfer persistée", (JSON.parse(window.localStorage.getItem("phoneos:asteria-story") || "{}").diff) === "enfer");
  const epBtn0 = [...document.querySelectorAll(".diff-row .pull-btn")].find((b) => b.textContent.includes("Enfer+"));
  check("Enfer+ verrouillé au départ", epBtn0 && epBtn0.classList.contains("locked"));
  if (epBtn0) epBtn0.click();
  check("clic sur Enfer+ verrouillé sans effet", (JSON.parse(window.localStorage.getItem("phoneos:asteria-story") || "{}").diff) === "enfer");

  document.querySelector(".story-chapter").click();
  check("scène SVG visible", !!document.querySelector(".story-art"));
  const sceneHtml = document.querySelector(".story-art").innerHTML;
  check("scène d'histoire : l'équipe réelle apparaît avec ses évolutions", sceneHtml.includes("scale(1.08)") && sceneHtml.includes("#ffd970"));
  check("titre du chapitre affiché", !!document.querySelector(".story-title") && document.querySelector(".story-title").textContent.includes("L'appel du village"));
  const firstLine = document.querySelector(".story-line.current");
  check("ligne narrée présente", !!firstLine && firstLine.textContent.length > 0);

  for (let i = 0; i < 4; i++) {
    const next = [...document.querySelectorAll(".story-next")].pop();
    if (next) next.click();
  }
  const storySaved = JSON.parse(window.localStorage.getItem("phoneos:asteria-story") || "{}");
  check("progression chapitre 1 sauvegardée", storySaved.done >= 1);
  check("récompense chapitre affichée", document.querySelector("#app-body").textContent.includes("CHAPITRE TERMINÉ"));

  storyTab.click();
  check("chapitres 3-12 encore verrouillés", document.querySelectorAll(".story-chapter.locked").length === 10);

  const music = document.querySelector(".music-toggle");
  music.click();
  const musicSaved = JSON.parse(window.localStorage.getItem("phoneos:asteria-story") || "{}");
  check("musique ON persistée", document.querySelector(".music-toggle").textContent.includes("ON") && musicSaved.music === true);
  document.querySelector(".music-toggle").click();

  // Choix narratif du chapitre 3 (bénédiction persistée)
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria-story"));s.done=2;localStorage.setItem("phoneos:asteria-story",JSON.stringify(s));})()');
  window.eval("OS").openApp("asteria");
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
  const blessingSaved = JSON.parse(window.localStorage.getItem("phoneos:asteria-story") || "{}");
  check("bénédiction sauvegardée", !!blessingSaved.blessing && document.querySelector("#app-body").textContent.includes("CHAPITRE TERMINÉ"));

  // Boss du chapitre 4 : Gortak
  window.eval("OS").openApp("asteria");
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
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria-story"));s.done=11;localStorage.setItem("phoneos:asteria-story",JSON.stringify(s));})()');
  window.eval("OS").openApp("asteria");
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

  // Bannières + déblocage d'Enfer+
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria-story"));s.bossBeaten={"1":5,"3":5,"6":5,"9":5,"11":5};localStorage.setItem("phoneos:asteria-story",JSON.stringify(s));})()');
  window.eval("OS").openApp("asteria");
  const storyTab4 = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Histoire");
  storyTab4.click();
  check("5 bannières débloquées", document.querySelectorAll(".banner-slot.unlocked").length === 5);
  const epBtn = [...document.querySelectorAll(".diff-row .pull-btn")].find((b) => b.textContent.includes("Enfer+"));
  check("Enfer+ débloqué", epBtn && !epBtn.classList.contains("locked"));
  if (epBtn) epBtn.click();
  check("Enfer+ sélectionné et persisté", (JSON.parse(window.localStorage.getItem("phoneos:asteria-story") || "{}").diff) === "enferPlus");

  // Boss Gortak en Enfer+ : stats scalées + compétence élite
  const chapter4p = [...document.querySelectorAll(".story-chapter")][3];
  chapter4p.click();
  for (let i = 0; i < 3; i++) {
    const next = [...document.querySelectorAll(".story-next")].pop();
    if (next) next.click();
  }
  const bossBtnP = document.querySelector(".story-boss");
  check("bouton boss Gortak (Enfer+) présent", !!bossBtnP);
  if (bossBtnP) bossBtnP.click();
  const bossHp = document.querySelector(".hp-row.enemy .hp-num");
  check("boss Enfer+ scalé ×4,2 (> 50 000 PV)", !!bossHp && Number(bossHp.textContent.split("/")[0]) > 50000);
  check("compétence élite affichée", document.body.textContent.includes("Massue écrasante"));

  // Salle des trophées
  window.eval("OS").openApp("trophies");
  check("trophées : 5 bannières affichées", document.querySelectorAll(".trophies .banner-slot").length === 5);
  check("trophées : 5 bannières débloquées via seed", document.querySelectorAll(".trophies .banner-slot.unlocked").length === 5);
  check("trophées : records des 5 boss + Mode Infini", document.querySelectorAll(".trophies-record").length === 6);
  check("trophées : Graal verrouillé affiché", !!document.querySelector(".trophy-graal.locked") && document.body.textContent.includes("Astrée, Héritière des braises"));
  check("trophées : record Mode Infini affiché", document.body.textContent.includes("Mode Infini"));
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria-story"));s.bossBeaten={"1":6,"3":6,"6":6,"9":6,"11":6};localStorage.setItem("phoneos:asteria-story",JSON.stringify(s));})()');
  window.eval("OS").openApp("trophies");
  check("trophées : records Enfer+ distincts d'Enfer", [...document.querySelectorAll(".trophies-record.top")].filter((l) => l.textContent.includes("Enfer+")).length === 5);

  // ---- Raid hebdomadaire : 3 phases, coffre, Élixirs ----
  window.eval('(function(){var d=new Date(),t=new Date(d.getFullYear(),0,1),w=Math.ceil(((d-t)/86400000+t.getDay()+1)/7);localStorage.setItem("phoneos:asteria-raid",JSON.stringify({week:d.getFullYear()+"-S"+w,elixirs:5,cleared:3,claimed:false}));})()');
  window.eval("OS").openApp("asteria");
  const questTabR = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  questTabR.click();
  check("panneau raid affiché", !!document.querySelector(".raid-panel"));
  check("3 phases de raid affichées", document.querySelectorAll(".raid-chip").length === 3);
  check("3 phases déjà vaincues (✓)", document.querySelectorAll(".raid-chip.done").length === 3);
  check("Élixirs affichés (5)", document.querySelector(".raid-panel").textContent.includes("Élixirs de raid : 5"));
  const chest = document.querySelector(".raid-chest");
  check("coffre hebdomadaire réclamable", !!chest);
  const q0 = JSON.parse(window.localStorage.getItem("phoneos:asteria")).quartz;
  if (chest) chest.click();
  const rs1 = JSON.parse(window.localStorage.getItem("phoneos:asteria"));
  const rr1 = JSON.parse(window.localStorage.getItem("phoneos:asteria-raid"));
  check("coffre : +90 ◆ (3 phases × 30)", rs1.quartz === q0 + 90);
  check("coffre : +3 Sceaux du dragon, Étendard déduit (45 → 48)", rs1.loot.sceau === 48);
  check("coffre marqué réclamé", rr1.claimed === true);
  const teamTabR2 = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabR2.click();
  check("8 matières de butin dont Élixir et items de reliques", document.querySelectorAll(".loot-chip").length === 8 && document.body.textContent.includes("Élixir de raid") && document.body.textContent.includes("Poussière de relique") && document.body.textContent.includes("Cristal de relique"));
  const questTabR2 = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  questTabR2.click();
  const enterBtn = [...document.querySelectorAll(".raid-panel .pull-btn")].find((b) => b.textContent.includes("Entrer dans le Raid"));
  check("bouton entrer dans le raid actif", !!enterBtn && !enterBtn.disabled);
  if (enterBtn) enterBtn.click();
  check("raid : −1 Élixir persisté", JSON.parse(window.localStorage.getItem("phoneos:asteria-raid")).elixirs === 4);
  check("combat de raid lancé (phase 1/3)", !!document.querySelector(".battle") && document.body.textContent.includes("Gardien de la trempe") && document.body.textContent.includes("Phase 1/3"));
  check("élite du gardien annoncée", document.querySelector(".battle-log").textContent.includes("Massue écrasante"));

  // Silhouettes évoluées : aura, échelle et couronne d'étoiles au rang III
  const sil0 = window.eval("OS").art.silhouette("Chevalier", "#fff", 100, 110, false, 0);
  const sil3 = window.eval("OS").art.silhouette("Chevalier", "#fff", 100, 110, false, 3);
  check("silhouette de base sans aura", !sil0.includes("scale(1.08)"));
  check("silhouette évoluée : échelle 1,08 + halo", sil3.includes("scale(1.08)") && sil3.includes("opacity=\"0.16\""));
  check("silhouette rang III : couronne d'étoiles dorées", sil3.includes("#ffd970") && sil3.includes("#e3b23c"));
  const raidSave = JSON.parse(window.localStorage.getItem("phoneos:asteria"));
  const anyTeamEvo = raidSave.team.some((id) => ((raidSave.evo || {})[id] || 0) >= 1);
  const raidArt = document.querySelector(".battle .story-art").innerHTML;
  check("scène de combat raid : aura présente seulement si un membre est évolué", raidArt.includes("scale(1.08)") === anyTeamEvo);

  window.eval("OS").closeApp();

  // Retour -> home
  window.eval("OS").closeApp();
  check("retour home", !$("#layer-home").classList.contains("hidden"));

  // Recents
  window.eval("OS").showRecents();
  const cards = document.querySelectorAll(".recents-card").length;
  check("recents non vide (" + cards + ")", cards >= 3);
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
