/* Test de fumée PhoneOS sous jsdom */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");

// Inline chaque <script src> pour que les bindings globaux partagent la portée,
// comme le font de vraies balises script dans un navigateur.
// Vérification statique du pack d'illustrations livré avec Astéria 2.0.
const artFiles = [
  "assets/asteria/heroes/roster.svg",
  "assets/asteria/enemies/bestiary.svg",
  "assets/asteria/heroes/chevalier.svg",
  "assets/asteria/heroes/mage.svg",
  "assets/asteria/heroes/archer.svg",
  "assets/asteria/heroes/berserker.svg",
  "assets/asteria/heroes/rodeur.svg",
  "assets/asteria/heroes/heros.svg",
  "assets/asteria/heroes/soigneur.svg",
  "assets/asteria/heroes/defenseur.svg",
  "assets/asteria/heroes/tueur.svg",
  "assets/asteria/heroes/artificier.svg",
  "assets/asteria/heroes/druide.svg",
  "assets/asteria/heroes/occultiste.svg",
  "assets/asteria/equipment/talisman.svg",
  "assets/asteria/equipment/grimoire.svg",
  "assets/asteria/equipment/bottes.svg",
  "assets/asteria/enemies/loup-ombre.svg",
  "assets/asteria/enemies/golem-runique.svg",
  "assets/asteria/enemies/sorciere-cendre.svg",
  "assets/asteria/enemies/dragonnet.svg",
  "assets/asteria/enemies/sentinelle.svg",
  "assets/asteria/enemies/seigneur-abysses.svg",
  "assets/asteria/scenes/crepuscule-ruines.svg",
  "assets/asteria/scenes/foret.svg",
  "assets/asteria/scenes/volcan.svg",
  "assets/asteria/scenes/ruines.svg",
  "assets/asteria/enemies/types/brute.svg",
  "assets/asteria/enemies/types/assassin.svg",
  "assets/asteria/enemies/types/sorcier.svg",
  "assets/asteria/enemies/types/capitaine.svg",
  "assets/asteria/enemies/types/golem.svg",
  "assets/asteria/enemies/types/oracle.svg",
  "assets/asteria/enemies/types/muraille.svg",
  "assets/asteria/enemies/types/invocateur.svg",
  "assets/asteria/enemies/types/fantassin.svg",
  "assets/asteria/enemies/types/necromant.svg",
  "assets/asteria/enemies/types/banshee.svg",
  "assets/asteria/enemies/types/sanguinaire.svg",
  "assets/asteria/enemies/types/colosse-givre.svg",
  "assets/asteria/enemies/types/duelliste.svg",
  "assets/asteria/enemies/types/artilleur.svg",
  "assets/asteria/enemies/types/alchimiste.svg",
  "assets/asteria/enemies/types/sentinelle.svg",
  "assets/asteria/enemies/types/predateur.svg",
  "assets/asteria/enemies/types/chronomancien.svg",
  "assets/asteria/elements/feu.svg",
  "assets/asteria/elements/eau.svg",
  "assets/asteria/elements/foudre.svg",
  "assets/asteria/elements/nature.svg",
  "assets/asteria/elements/terre.svg",
  "assets/asteria/elements/arcane.svg",
  "assets/asteria/elements/vent.svg",
  "assets/asteria/equipment/arme.svg",
  "assets/asteria/equipment/armure.svg",
  "assets/asteria/equipment/etendard.svg",
  "assets/asteria/equipment/anneau.svg",
  "assets/asteria/equipment/orbe.svg",
  "assets/asteria/equipment/talisman.svg",
  "assets/asteria/equipment/grimoire.svg",
  "assets/asteria/equipment/bottes.svg",
];
artFiles.forEach((file) => {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) throw new Error("Illustration manquante : " + file);
  const svg = fs.readFileSync(fullPath, "utf8");
  if (!/<svg\b/.test(svg) || !/<\/svg>\s*$/.test(svg)) throw new Error("SVG invalide : " + file);
});
const scripts = ["js/os.js", "js/sfx.js", "js/svgart.js", "js/apps/asteria.js", "js/apps/heroes.js", "js/apps/settings.js", "js/apps/trophies.js", "js/main.js"];

// Seed save Astéria : toutes les unités SAUF le Graal + équipe avec Soigneur (doit précéder tous les scripts)
const unitsBlock = fs.readFileSync(path.join(root, "js/apps/asteria.js"), "utf8").match(/UNITS\s*=\s*\[([\s\S]*?)\n    \];/)[1];
const unitIds = [...unitsBlock.matchAll(/\{ id: "([^"]+)"/g)].map((m) => m[1]);
const heroSprite = fs.readFileSync(path.join(root, "assets/asteria/heroes/roster.svg"), "utf8");
const enemySprite = fs.readFileSync(path.join(root, "assets/asteria/enemies/bestiary.svg"), "utf8");
unitIds.forEach((id) => {
  if (!heroSprite.includes('id="hero-' + id + '"')) throw new Error("Portrait héros absent du sprite : " + id);
});
["gobelin-ancien","chevalier-dechu","dragon-des-cendres","spectre-des-marais","colosse-de-pierre","sorciere-du-brouillard","basilic","seigneur-liche","fantassin-d-elite","necromant-errant","banshee-des-marais","sanguinaire-du-brasier","colosse-de-givre","ombre-du-serment","dueliste-des-failles","canonniere-cendree","alchimiste-du-neant","sentinelle-prismatique","predateur-nocturne","chronomancien-brise","hydre-des-brumes","reine-des-epines","garde-astral","devoreur-de-runes"].forEach((id) => {
  if (!enemySprite.includes('id="enemy-' + id + '"')) throw new Error("Portrait ennemi absent du sprite : " + id);
});
["brute","assassin","sorcier","capitaine","golem","oracle","muraille","invocateur","fantassin","necromant","banshee","sanguinaire","colosse-de-givre","duelliste","artilleur","alchimiste","sentinelle","predateur","chronomancien"].forEach((id) => {
  if (!enemySprite.includes('id="enemy-type-' + id + '"')) throw new Error("Portrait d'archétype absent du sprite : " + id);
});
const ownedAll = {};
unitIds.forEach((id) => { if (id !== "graal") ownedAll[id] = 1; });
const seedSave = { schemaVersion: 2, quartz: 300, owned: ownedAll, team: ["bron", "edele", "nerys"] };
html = html.replace('<script src="js/os.js">',
  '<script>localStorage.setItem("phoneos:event-debug", JSON.stringify("fortune"));localStorage.setItem("phoneos:asteria", JSON.stringify({quartz:99999}));localStorage.setItem("phoneos:asteria-v2", ' + JSON.stringify(JSON.stringify(seedSave)) + ');</script>\n<script src="js/os.js">');
scripts.forEach((file) => {
  const code = fs.readFileSync(path.join(root, file), "utf8");
  const inline = "<script>" + code.replace(/<\/script>/g, "<\\/script>") + "<\/script>";
  html = html.replace('<script src="' + file + '"></script>', inline);
});

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "http://localhost/",
  pretendToBeVisual: true,
  beforeParse(window) {
    // OS.openApp() appelle scrollTo pendant l’initialisation ; le stub doit exister avant les scripts.
    window.scrollTo = () => {};
  },
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
check("DOMOSS existe", typeof window.eval("OS") === "object");
const elementInfo = window.eval("OS").asteriaData.elementInfo();
check("système élémentaire : 7 affinités déclarées", Object.keys(elementInfo.elements).length === 7);
const synergyInfo = window.eval("OS").asteriaData.teamSynergyInfo();
check("synergies tactiques : 6 combinaisons documentées", synergyInfo.length === 6 && synergyInfo.some((x) => x.name === "Serment protecteur"));
check("cartes : Brut/Arcane/Rapide ont une affinité", elementInfo.cards.R.element === "feu" && elementInfo.cards.B.element === "arcane" && elementInfo.cards.V.element === "vent");
check("ennemis : affinités fixes connues", Object.keys(elementInfo.enemyAffinity).length >= 13 && elementInfo.enemyAffinity.Golem === "terre");

// Attendre l'init de la page web (~2 s max)
setTimeout(() => {
  // Page web : plus de téléphone (châssis, boot, verrouillage) — barre d'apps + Astéria ouverte par défaut
  check("page web : aucun châssis de téléphone", !document.querySelector(".phone") && !document.querySelector(".lock-pad"));
  check("barre d'apps présente (4 onglets)", document.querySelectorAll("#top-tabs .top-tab").length === 4);
  const activeTab = document.querySelector("#top-tabs .top-tab.active");
  check("Astéria ouverte par défaut", !!activeTab && activeTab.dataset.app === "asteria");
  check("ancienne sauvegarde Astéria supprimée au démarrage v2", window.localStorage.getItem("phoneos:asteria") === null);
  check("bouton plein écran présent", !!document.getElementById("btn-fullscreen"));
  check("horloge de la barre affichée", document.getElementById("top-clock").textContent !== "--:--");
  check("sélecteur de difficulté narrative retiré", !document.getElementById("top-diff"));

  // Ouvrir chaque app (la page ne quitte jamais le flux web)
  const apps = Object.keys(window.eval("OS").APPS);
  check("4 apps enregistrées (Astéria, Personnages, Réglages, Trophées)", apps.length === 4);
  apps.forEach((id) => {
    window.eval("OS").openApp(id);
    const tab = [...document.querySelectorAll("#top-tabs .top-tab")].find((t) => t.dataset.app === id);
    check("app ouverte : " + id, !!tab && tab.classList.contains("active") && $("#app-body").children.length > 0);
  });

  // Astéria : roster complet et classes de gameplay
  window.eval("OS").openApp("asteria");
  const teamTabR = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabR.click();
  check("roster de 144 unités possédées", document.querySelectorAll(".roster .unit-card").length === unitIds.length - 1);
  const rosterPortraits = [...document.querySelectorAll(".roster .unit-card .unit-portrait .hero-art")];
  check("un portrait SVG personnalisé pour chaque héros du roster", rosterPortraits.length === unitIds.length - 1 && rosterPortraits.every((portrait) => portrait.tagName.toLowerCase() === "svg" && !!portrait.getAttribute("data-portrait-id")));
  check("portraits héros réellement distincts (dessins et identifiants)", new Set(rosterPortraits.map((portrait) => portrait.outerHTML)).size === rosterPortraits.length);
  const artApi = window.eval("OS").asteriaData;
  check("nouveaux héros R/SR/SSR : 12 unités ajoutées", ["elyndra","maelis","nyxar","toren","sylwen","vhal","brena","lirio","zarek","pavel","nima","orik"].every(id => artApi.UNITS.some(u => u.id === id)));
  check("aucun nouveau héros SS", artApi.UNITS.filter(u => u.r === 4).length === 1 && artApi.UNITS.find(u => u.r === 4).id === "graal");
  check("trois nouvelles classes de héros déclarées", ["Artificier","Druide","Occultiste"].every(cls => !!artApi.CLASS_BONUS[cls] && !!artApi.EVO2[cls] && !!artApi.EVO3[cls] && !!artApi.EVO3B[cls]));
  check("un passif est défini pour chaque héros", artApi.UNITS.every(u => !!artApi.PASSIVE_INFO[u.id]));
  check("six nouveaux archétypes ennemis et leur équilibrage", ["Duelliste","Artilleur","Alchimiste","Sentinelle","Prédateur","Chronomancien"].every(type => !!artApi.ENEMY_TYPES[type] && artApi.ENEMY_BALANCE[type] && artApi.ENEMY_BALANCE[type].every(v => v > 0)));
  check("ultimes de classe définis pour les douze classes", ["Chevalier","Berserker","Mage","Archer","Rôdeur","Héros","Soigneur","Défenseur","Tueur","Artificier","Druide","Occultiste"].every(cls => artApi.CLASS_ULTIMATE[cls] && artApi.CLASS_ULTIMATE[cls].turns >= 3));
  check("données de bannières et de Mode Histoire retirées", !artApi.FEATURED_BANNERS && !artApi.STORY && !artApi.storyDiffs && !artApi.setStoryDiff);
  check("huit reliques disponibles", Object.keys(artApi.RELICS).length === 8);
  const allHeroArt = artApi.UNITS.map((unit) => artApi.heroPortraitMarkup(unit.id));
  const enemyTypes = Object.keys(artApi.ENEMY_TYPES);
  const allEnemyArt = artApi.ENEMY_NAMES.map((name, i) => artApi.enemyPortraitMarkup(enemyTypes[i % enemyTypes.length], name));
  check("145 portraits de héros générés et uniques", allHeroArt.length === unitIds.length && new Set(allHeroArt).size === allHeroArt.length);
  check("portraits ennemis uniques par nom et archétype", allEnemyArt.length === artApi.ENEMY_NAMES.length && new Set(allEnemyArt).size === allEnemyArt.length);
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
  const saveForge = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  saveForge.loot = { eclat: 999, coeur: 50, larme: 50, couronne: 50, sceau: 50, poussiere: 50, cristal: 20 };
  window.eval('(function(){localStorage.setItem("phoneos:asteria-v2",' + JSON.stringify(JSON.stringify(saveForge)) + ')})()');
  window.eval("OS").openApp("asteria");
  const teamTabF = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabF.click();
  check("inventaire de butin affiché (20 matières)", document.querySelectorAll(".loot-chip").length === 20);
  check("forge d'évolution : lignes présentes", document.querySelectorAll(".forge-line").length >= 100);
  const bronLine = [...document.querySelectorAll(".forge-line")].find((l) => l.querySelector(".unit-name").textContent.startsWith("Bron"));
  check("forge : ligne Bron évolutive et finançable", !!bronLine && !bronLine.querySelector("button").disabled);
  check("forge : prochain éveil annoncé", !!bronLine && bronLine.innerHTML.includes("Éveil I ✦ Jauge de départ"));
  if (bronLine) bronLine.querySelector("button").click();
  const saveEvo = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("évolution Bron persistée (+10 %, −8 Éclat)", saveEvo.evo.bron === 1 && saveEvo.loot.eclat === 991);
  const bronCardF = [...document.querySelectorAll(".roster .unit-card")].find((c) => c.querySelector(".unit-name").textContent.includes("Bron"));
  check("étoiles ★ affichées sur la carte", !!bronCardF && bronCardF.querySelector(".unit-name").textContent.includes("★"));
  check("éveil I acquis visible sur Bron évolué", !!bronCardF && bronCardF.textContent.includes("Éveil I ✦ Jauge de départ"));
  const ssrCard = [...document.querySelectorAll(".roster .unit-card")].find((c) => c.className.includes("r3"));
  check("passif ✧ affiché sur les SSR", !!ssrCard && ssrCard.textContent.includes("Passif :"));

  // Reliquaire du raid : 3 reliques forgees avec le butin, bonus communs a l'equipe
  check("bandeau d'evenement force (fortune)", !!document.querySelector(".event-chip") && document.querySelector(".event-chip").textContent.includes("Week-end de fortune"));
  check("reliquaire : 8 reliques + 4 ensembles affichés", document.querySelectorAll(".relic-line:not(.set-line)").length === 8 && document.querySelectorAll(".set-line").length === 4);
  const bronAtkOf = () => { const c = [...document.querySelectorAll(".roster .unit-card")].find((x) => x.querySelector(".unit-name").textContent.includes("Bron")); return c ? Number((c.textContent.match(/ATK (\d+)/) || [0, 0])[1]) : 0; };
  const bronAtkBefore = bronAtkOf();
  const armorLine = [...document.querySelectorAll(".relic-line")].find((l) => l.textContent.includes("\u00c9caille du Dragon"));
  check("\u00c9caille du Dragon forgerable", !!armorLine && !armorLine.querySelector("button").disabled);
  if (armorLine) armorLine.querySelector("button").click();
  const saveRelic = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("Écaille forgée : −20 Éclats, −15 Cœurs", saveRelic.relics.armure === 1 && saveRelic.loot.eclat === 971 && saveRelic.loot.coeur === 35);
  const armorLineE = [...document.querySelectorAll(".relic-line:not(.set-line)")].find((l) => l.textContent.includes("Écaille du Dragon"));
  const armorSel = armorLineE && armorLineE.querySelector(".relic-equip-select");
  check("sélecteur d'équipement sur l'Écaille forgée", !!armorSel);
  if (armorSel) { armorSel.value = "nerys"; armorSel.dispatchEvent(new window.Event("change")); }
  check("Écaille équipée sur Nerys persistée", JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).relicsEquip.armure === "nerys");
  const nerysCard = [...document.querySelectorAll(".roster .unit-card")].find((c) => c.querySelector(".unit-name").textContent.includes("Nerys"));
  check("Nerys : PV renforcés par l'Écaille portée", !!nerysCard && nerysCard.textContent.includes("PV"));
  const weaponLine = [...document.querySelectorAll(".relic-line")].find((l) => l.textContent.includes("Lame du Raid"));
  check("Lame du Raid forgerable", !!weaponLine && !weaponLine.querySelector("button").disabled);
  if (weaponLine) weaponLine.querySelector("button").click();
  const saveRelic2 = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("Lame forg\u00e9e et persist\u00e9e", saveRelic2.relics.arme === 1);
  check("Lame forgée sans porteur : ATK de Bron inchangée (" + bronAtkBefore + ")", bronAtkOf() === bronAtkBefore);
  const weaponLine2 = [...document.querySelectorAll(".relic-line:not(.set-line)")].find((l) => l.textContent.includes("Lame du Raid"));
  const weaponSel = weaponLine2 && weaponLine2.querySelector(".relic-equip-select");
  check("sélecteur d'équipement sur la Lame", !!weaponSel);
  if (weaponSel) { weaponSel.value = "bron"; weaponSel.dispatchEvent(new window.Event("change")); }
  check("Lame équipée sur Bron persistée", JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).relicsEquip.arme === "bron");
  check("Lame portée par Bron : ATK renforcée (" + bronAtkBefore + " → " + bronAtkOf() + ")", bronAtkOf() > bronAtkBefore);
  const lameSelOpt = weaponSel && [...weaponSel.querySelectorAll("option")].find((o) => o.value === "bron");
  check("prévisualisation Lame : ATK exacte du héros affichée avant équipement", !!lameSelOpt && /\(ATK \d+ → \d+\)/.test(lameSelOpt.textContent));
  const ringLine = [...document.querySelectorAll(".relic-line")].find((l) => l.textContent.includes("Anneau des serments"));
  check("Anneau des serments forgerable", !!ringLine && !ringLine.querySelector("button").disabled);
  if (ringLine) ringLine.querySelector("button").click();
  const saveRing = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("Anneau forgé (−14 Larmes, −6 Sceaux)", saveRing.relics.anneau === 1 && saveRing.loot.larme === 26 && saveRing.loot.sceau === 44);
  const ringLine2 = [...document.querySelectorAll(".relic-line:not(.set-line)")].find((l) => l.textContent.includes("Anneau des serments"));
  const ringSel = ringLine2 && ringLine2.querySelector(".relic-equip-select");
  check("sélecteur d'équipement sur l'Anneau", !!ringSel);
  const ringOpt = ringSel && [...ringSel.querySelectorAll("option")].find((o) => o.value === "tilia");
  check("prévisualisation Anneau : bonus de critique affiché", !!ringOpt && ringOpt.textContent.includes("(Critique +8 %)"));
  if (ringSel) { ringSel.value = "tilia"; ringSel.dispatchEvent(new window.Event("change")); }
  check("Anneau équipé sur Tilia persisté", JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).relicsEquip.anneau === "tilia");
  const orbLine = [...document.querySelectorAll(".relic-line")].find((l) => l.textContent.includes("Orbe des braises"));
  check("Orbe des braises forgerable", !!orbLine && !orbLine.querySelector("button").disabled);
  if (orbLine) orbLine.querySelector("button").click();
  const saveOrb = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("Orbe forgé (−18 Cœurs, −10 Larmes)", saveOrb.relics.orbe === 1 && saveOrb.loot.coeur === 17 && saveOrb.loot.larme === 16);
  const orbLine2 = [...document.querySelectorAll(".relic-line:not(.set-line)")].find((l) => l.textContent.includes("Orbe des braises"));
  const orbSel = orbLine2 && orbLine2.querySelector(".relic-equip-select");
  check("sélecteur d'équipement sur l'Orbe", !!orbSel);
  const orbOpt = orbSel && [...orbSel.querySelectorAll("option")].find((o) => o.value === "bron");
  check("prévisualisation Orbe : bonus de dégâts affiché", !!orbOpt && orbOpt.textContent.includes("(Dégâts +8 %)"));
  if (orbSel) { orbSel.value = "bron"; orbSel.dispatchEvent(new window.Event("change")); }
  check("Orbe équipé sur Bron persisté", JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).relicsEquip.orbe === "bron");
  const flagLine = [...document.querySelectorAll(".relic-line")].find((l) => l.textContent.includes("\u00c9tendard des trois phases"));
  check("\u00c9tendard forgerable (Couronnes + Sceaux en stock)", !!flagLine && !flagLine.querySelector("button").disabled);
  if (flagLine) flagLine.querySelector("button").click();
  const flagLine2 = [...document.querySelectorAll(".relic-line:not(.set-line)")].find((l) => l.textContent.includes("Étendard des trois phases"));
  const flagSel = flagLine2 && flagLine2.querySelector(".relic-equip-select");
  check("sélecteur d'équipement sur l'Étendard", !!flagSel);
  if (flagSel) { flagSel.value = "edele"; flagSel.dispatchEvent(new window.Event("change")); }
  const saveFlag = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("Étendard forgé et équipé, 8 reliques actives", saveFlag.relics.etendard === 1 && saveFlag.relicsEquip.etendard === "edele" && document.querySelectorAll(".relic-line:not(.set-line)").length === 8 && [...document.querySelectorAll(".relic-line:not(.set-line)")].filter((l) => l.textContent.includes("Forgée")).length === 5);

  // Reliques v2 : amélioration (Poussières + Cristaux) et bonus d'ensemble
  check("bonus d'ensemble : Pacte, Trinité et Cycle actifs", [...document.querySelectorAll(".set-line.ready")].length === 3 && document.body.textContent.includes("Pacte du trio") && document.body.textContent.includes("Trinité du dragon"));
  check("Harmonie parfaite inactive (rang N)", [...document.querySelectorAll(".set-line.ready")].every((l) => !l.textContent.includes("Harmonie parfaite")));
  const armorLine2 = [...document.querySelectorAll(".relic-line:not(.set-line)")].find((l) => l.textContent.includes("Écaille du Dragon"));
  check("Écaille N : principale affichée, aucune sous-stat", !!armorLine2 && armorLine2.textContent.includes("Principale") && armorLine2.textContent.includes("Aucune sous-stat"));
  const upBtn = armorLine2 && [...armorLine2.querySelectorAll("button")].find((b) => b.textContent.includes("Améliorer"));
  check("Écaille améliorable (→ R)", !!upBtn && !upBtn.disabled);
  if (upBtn) upBtn.click();
  const saveUp = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("Écaille passée en R (−10 Poussières)", saveUp.relics.armure === 2 && saveUp.loot.poussiere === 40);
  const armorLine3 = [...document.querySelectorAll(".relic-line:not(.set-line)")].find((l) => l.textContent.includes("Écaille du Dragon"));
  check("Écaille R : chip rang, PV du héros +18 % et 1re sous-stat", !!armorLine3 && armorLine3.textContent.includes("R · Rare") && armorLine3.textContent.includes("PV du héros +18 %") && armorLine3.textContent.includes("Soins +4 %"));
  const AD = window.eval("OS").asteriaData;
  const svH = { relics: { arme: 3, armure: 3, etendard: 3, anneau: 3 }, relicsEquip: { arme: "bron", armure: "nerys", etendard: "edele", anneau: "tilia" }, owned: { bron: 1, nerys: 1, edele: 1, tilia: 1 } };
  check("Harmonie parfaite : active dès 4 reliques Épique + (dégâts +16 %)", AD.relicFxOf(svH).dmg === 16);
  const svH2 = { ...svH, relics: { ...svH.relics, anneau: 1 } };
  check("Harmonie parfaite : inactive si une relique portée est au rang N", AD.relicFxOf(svH2).dmg === 8);

  // Recyclage des doublons : matériaux propres à la classe, selon la rareté
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria-v2"));s.owned.tilia=3;localStorage.setItem("phoneos:asteria-v2",JSON.stringify(s));})()');
  window.eval("OS").openApp("asteria");
  const teamTabRec = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabRec.click();
  check("recyclage : panneau des doublons affiché", document.querySelectorAll(".recycle-panel .forge-line").length >= 1);
  const tiliaRec = [...document.querySelectorAll(".recycle-panel .forge-line")].find((l) => l.textContent.includes("Tilia"));
  check("recyclage : Tilia 3 doublons → +2 Rune de Mage", !!tiliaRec && tiliaRec.textContent.includes("3 doublons") && tiliaRec.textContent.includes("Rune de Mage"));
  if (tiliaRec) tiliaRec.querySelector("button").click();
  const saveRec = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("recyclage : doublon consommé et matériau de classe crédité", saveRec.owned.tilia === 2 && saveRec.loot.mat_Mage === 2);

  // Collection : 113 héros, le Graal grisé, récompense de complétion réclamable
  const colTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Collection");
  check("onglet Collection présent", !!colTab);
  colTab.click();
  check("collection affiche les " + unitIds.length + " héros", document.querySelectorAll(".col-grid .unit-card").length === unitIds.length);
  const collectionPortraits = [...document.querySelectorAll(".col-grid .unit-card .hero-art")];
  check("chaque carte de héros possède son portrait SVG unique", collectionPortraits.length === unitIds.length && collectionPortraits.every((portrait) => portrait.tagName.toLowerCase() === "svg" && !!portrait.getAttribute("data-portrait-id")) && new Set(collectionPortraits.map((portrait) => portrait.outerHTML)).size === collectionPortraits.length);
  check("Graal non possédé grisé", document.querySelectorAll(".col-grid .unit-card.locked").length === 1 && document.body.textContent.includes("Astrée, Héritière des braises"));
  check("filtres Collection classe/rareté/possession présents", document.querySelectorAll(".collection-filters select").length === 3);
  const ownershipFilter = document.querySelectorAll(".collection-filters select")[2];
  ownershipFilter.value = "missing"; ownershipFilter.dispatchEvent(new window.Event("change"));
  check("filtre non possédés appliqué", document.querySelectorAll(".col-grid .unit-card").length === 1 && document.querySelector(".col-grid .unit-card.locked"));
  let collectionFilters = document.querySelectorAll(".collection-filters select");
  collectionFilters[0].value = "Mage"; collectionFilters[0].dispatchEvent(new window.Event("change"));
  collectionFilters = document.querySelectorAll(".collection-filters select");
  collectionFilters[1].value = "1"; collectionFilters[1].dispatchEvent(new window.Event("change"));
  collectionFilters = document.querySelectorAll(".collection-filters select");
  collectionFilters[2].value = "owned"; collectionFilters[2].dispatchEvent(new window.Event("change"));
  const combinedCards = [...document.querySelectorAll(".col-grid .unit-card")];
  check("filtres Collection combinés : classe Mage + rareté R + possédés", combinedCards.length > 0 && combinedCards.every((card) => card.querySelector(".unit-cls").textContent.includes("Mage") && card.querySelector(".unit-rarity").textContent.startsWith("R")));
  let resetFilters = document.querySelectorAll(".collection-filters select");
  resetFilters[2].value = "all"; resetFilters[2].dispatchEvent(new window.Event("change"));
  resetFilters = document.querySelectorAll(".collection-filters select");
  resetFilters[0].value = "all"; resetFilters[0].dispatchEvent(new window.Event("change"));
  resetFilters = document.querySelectorAll(".collection-filters select");
  resetFilters[1].value = "all"; resetFilters[1].dispatchEvent(new window.Event("change"));
  check("progression de collection hors SS : 144 / 144 affichée", document.body.textContent.includes("144 / 144"));
  const claim = document.querySelector(".collect-line .claim-btn");
  check("récompense 25 % réclamable", !!claim);
  if (claim) claim.click();
  check("réclamation +50 ◆ persistée", JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).quartz === 350 && JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).collected.includes(25));

  // Le SS est une récompense de complétion, sans auto-inclusion dans le seuil des 100 %.
  const collectionBeforeFinal = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria-v2"));s.owned=s.owned||{};'+JSON.stringify(unitIds)+'.forEach(function(id){if(id!=="graal")s.owned[id]=1;});s.collected=[25,50,75];s.quartz=0;localStorage.setItem("phoneos:asteria-v2",JSON.stringify(s));})()');
  window.eval("OS").openApp("asteria");
  [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Collection").click();
  check("100 % atteignable sans posséder Astrée SS", document.body.textContent.includes("144 / 144 (100 %)") && !![...document.querySelectorAll(".collect-line .claim-btn")].find((b) => b.textContent.includes("Astrée")));
  const graalReward = [...document.querySelectorAll(".collect-line .claim-btn")].find((b) => b.textContent.includes("Astrée"));
  if (graalReward) graalReward.click();
  const completedCollection = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("récompense finale : Astrée SS et 500 ◆ crédités une seule fois", completedCollection.owned.graal === 1 && completedCollection.quartz === 500 && completedCollection.collected.includes(100));
  window.localStorage.setItem("phoneos:asteria-v2", JSON.stringify(collectionBeforeFinal));

  // App Personnages : navigation Collection -> fiche détaillée -> retour
  const colCard = [...document.querySelectorAll(".col-grid .unit-card")].find((c) => !c.classList.contains("locked") && c.textContent.includes("Morgane"));
  check("carte Collection cliquable", !!colCard);
  if (colCard) colCard.click();
  check("clic Collection -> app Personnages ouverte", Object.keys(window.eval("OS").APPS).includes("heroes") && $("#app-body").querySelectorAll(".sheet-panel").length === 1);
  check("fiche Morgane : doublons, passif, compétence et ultime", $("#app-body").textContent.includes("Doublons") && $("#app-body").textContent.includes("Passif :") && $("#app-body").textContent.includes("Compétence :") && $("#app-body").textContent.includes("Ultime de classe :"));
  const backBtn = document.querySelector(".sheet-actions .pull-btn");
  check("bouton retour présent", !!backBtn);
  if (backBtn) backBtn.click();
  check("retour -> liste complète de " + unitIds.length + " héros", document.querySelectorAll(".col-grid .unit-card").length === unitIds.length);
  window.eval("OS").heroes.open("graal");
  check("fiche Graal non invoqué : indice Enfer+", $("#app-body").querySelectorAll(".sheet-panel").length === 1 && $("#app-body").textContent.includes("144 autres héros") && !$("#app-body").textContent.includes("Doublons"));

  // Réglages : mode daltonien et vitesse globale du jeu
  window.eval("OS").openApp("settings");
  const cbInput = [...document.querySelectorAll(".switch input")].find((inp) => inp.closest(".row, .set-row, div") && inp.closest(".row, .set-row, div").textContent.includes("Mode daltonien"));
  check("toggle Mode daltonien présent", !!cbInput);
  if (cbInput) cbInput.click();
  check("mode daltonien : body.cb appliqué", document.body.classList.contains("cb"));
  check("mode daltonien persisté", window.localStorage.getItem("phoneos:colorblind") === "true");
  const speedBtns = [...document.querySelectorAll(".seg-row button")].filter((b) => ["Lent", "Normal", "Rapide"].includes(b.textContent));
  const rapidBtn = speedBtns.find((b) => b.textContent === "Rapide");
  check("vitesse globale du jeu : trois réglages présents", speedBtns.length === 3);
  if (rapidBtn) rapidBtn.click();
  check("vitesse globale persistée", window.localStorage.getItem("phoneos:game-speed") === "2");
  const volumeSlider = document.querySelector(".settings-group input[type=range]");
  check("curseur de volume présent", !!volumeSlider);
  if (volumeSlider) { volumeSlider.value = "42"; volumeSlider.dispatchEvent(new window.Event("input", { bubbles: true })); }
  check("curseur : volume persisté et appliqué au moteur", window.localStorage.getItem("phoneos:volume") === "42" && window.eval("OS").sfx.volume === 42);
  check("curseur : valeur affichée actualisée", !!volumeSlider && volumeSlider.parentElement.textContent.includes("42 %"));
  window.eval("OS").openApp("asteria");

  // Portail de classe : coût 5 ◆ + pity persistée
  const summonTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Invoquer");
  summonTab.click();
  check("portails de classe affichés (12)", document.querySelectorAll(".portal-grid .portal-btn").length === 12);
  const healerPortal = [...document.querySelectorAll(".portal-grid .portal-btn")].find((b) => b.textContent.includes("Soigneur"));
  check("portail Soigneur présent", !!healerPortal);
  if (healerPortal) healerPortal.click();
  check("clic portail : aperçu des héros et probabilités affiché", !!document.querySelector(".portal-detail") && document.querySelectorAll(".portal-detail .portal-rate").length === 3 && document.querySelectorAll(".portal-detail .portal-roster .unit-card").length > 0);
  check("portail : filtre Possédés / Non possédés disponible", !!document.querySelector(".portal-owned-filter select"));
  check("ouvrir un portail ne consomme pas de quartz", JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).quartz === 350);
  const portalOwnership = document.querySelector(".portal-owned-filter select");
  if (portalOwnership) { portalOwnership.value = "missing"; portalOwnership.dispatchEvent(new window.Event("change")); }
  check("portail : filtre Non possédés appliqué", !!document.querySelector(".portal-detail .portal-count") && document.querySelector(".portal-detail .portal-count").textContent.startsWith("0 / ") && document.querySelectorAll(".portal-detail .portal-roster .unit-card").length === 0);
  if (portalOwnership) { portalOwnership.value = "all"; portalOwnership.dispatchEvent(new window.Event("change")); }
  const portalSummon = [...document.querySelectorAll(".portal-detail .pull-btn")].find((b) => b.textContent.includes("×1"));
  if (portalSummon) portalSummon.click();
  const saveAfterPortal = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("invocation depuis portail : −5 ◆ et compteur de pity persisté (0 si SSR)", saveAfterPortal.quartz === 345 && Object.prototype.hasOwnProperty.call(saveAfterPortal.pity, "Soigneur") && Number.isFinite(saveAfterPortal.pity["Soigneur"]) && saveAfterPortal.pity["Soigneur"] >= 0);
  const portalCard = document.querySelector(".portal-detail .pull-results .unit-card");
  check("portail : personnage Soigneur invoqué", !!portalCard && portalCard.querySelector(".unit-cls").textContent.includes("Soigneur"));

  // Missions quotidiennes : seed contrôlé pour aujourd'hui (date réelle, même jour)
  const today = new Date();
  const tk = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  window.eval('(function(){localStorage.setItem("phoneos:asteria-v2-daily",JSON.stringify({date:"' + tk + '",missions:[{t:"cards",label:"Jouer 30 cartes en combat",goal:30,reward:20,p:0,claimed:false},{t:"pulls",label:"Invoquer 10 héros",goal:10,reward:25,p:10,claimed:false},{t:"wins",label:"Gagner 3 quêtes",goal:3,reward:30,p:1,claimed:false}]}));})()');
  window.eval('(function(){localStorage.setItem("phoneos:event-debug", JSON.stringify("invoqueurs"));})()');
  window.eval("OS").openApp("asteria");
  const questTabD = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  questTabD.click();
  check("3 missions du jour affichées", document.querySelectorAll(".daily-mission").length === 3);
  check("bandeau d'evenement passe en Week-end des invocateurs", !!document.querySelector(".event-chip") && document.querySelector(".event-chip").textContent.includes("invocateurs"));
  check("mission 'Invoquer' prête à réclamer", !!document.querySelector(".daily-mission .claim-btn"));
  document.querySelector(".daily-mission .claim-btn").click();
  check("réclamation mission +25 ◆", JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).quartz === 370);
  check("mission réclamée marquée ✓", JSON.parse(window.localStorage.getItem("phoneos:asteria-v2-daily")).missions[1].claimed === true);

  // Invocation générale : SSR garanti à la 50ᵉ invocation, remise à zéro
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria-v2"));s.pity={banniere:49};s.quartz=100;localStorage.setItem("phoneos:asteria-v2",JSON.stringify(s));})()');
  window.eval("OS").openApp("asteria");
  const summonTabP = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Invoquer");
  summonTabP.click();
  check("invocation générale : compteur 49/50 affiché", document.querySelector(".banner-sub").textContent.includes("compteur 49/50"));
  const singleP = [...document.querySelectorAll(".pull-row .pull-btn")].find((b) => b.textContent.includes("Invoquer ×1"));
  check("invocation ×1 disponible", !!singleP);
  if (singleP) singleP.click();
  const pityCard = document.querySelector(".pull-results .unit-card");
  check("pity 50 : SSR garanti à la 50ᵉ invocation", !!pityCard && pityCard.className.includes("r3") && JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).pity.general === 0);
  check("compteur invocation générale remis à 0/50", document.querySelector(".banner-sub").textContent.includes("compteur 0/50"));

  // Quête facile : le Soigneur soigne au lieu d'attaquer
  const questTab = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  check("onglet quêtes présent", !!questTab);
  questTab.click();
  const tierBtn = [...document.querySelectorAll(".pull-btn")].find((b) => b.classList.contains("tier-facile"));
  check("bouton quête facile présent", !!tierBtn);
  tierBtn.click();
  check("vue combat affichée", !!document.querySelector(".battle"));
  check("jauge de départ : Étendard N portée par Edele (+15) + Trinité +10 = 25 %", document.querySelector(".gauge .hp-num") && document.querySelector(".gauge .hp-num").textContent === "25%");
  const beforeLog = document.querySelectorAll(".battle-log > div").length;
  for (let draws = 0; draws < 3; draws++) {
    const card = document.querySelector(".hand-card:not([disabled])");
    if (card) card.click();
  }
  const afterLog = document.querySelectorAll(".battle-log > div").length;
  check("3 cartes jouées -> log enrichi (" + beforeLog + " → " + afterLog + ")", afterLog > beforeLog);
  const logText = document.querySelector(".battle-log") ? document.querySelector(".battle-log").textContent : "";
  check("Soigneur soigne l'allié le plus blessé", logText.includes("soigne"));
  const dailyCards = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2-daily")).missions.find((m) => m.t === "cards");
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
  check("butin : Éclat d'acier gagné en victoire facile", lootSeen && JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).loot.eclat >= 972);

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
  check("infini : progression et récompenses évolutives annoncées", document.querySelector(".infinite-scaling-hint") && document.querySelector(".infinite-scaling-hint").textContent.includes("+18 % PV"));

  // Évolutions avancées et vérification de la suppression des modes narratifs
  // Évolution poussée : l'équipe est réinitialisée avec Bron ★★★ (talents II/III empilables)
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria-v2"));s.team=["bron","tilia","nerys"];s.evo={bron:3};localStorage.setItem("phoneos:asteria-v2",JSON.stringify(s));})()');
  window.eval("OS").openApp("asteria");
  const teamTabE = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabE.click();
  const bronCardE = [...document.querySelectorAll(".roster .unit-card")].find((c) => c.querySelector(".unit-name").textContent.includes("Bron"));
  check("Éveils II/III + 2ᵉ talent de classe affichés sur Bron ★★★ (Berserker)", !!bronCardE && bronCardE.textContent.includes("Éveil II ✦ Dégâts +8 %") && bronCardE.textContent.includes("Talent ✦ Critique +8 %") && bronCardE.textContent.includes("Éveil III ✦ Rage +15 % sous le seuil") && bronCardE.textContent.includes("Talent ✦ PV max +8 %"));

  // Éveil IV : 4ᵉ étoile payée en matériau de classe (Croc de Berserker)
  window.eval('(function(){var s=JSON.parse(localStorage.getItem("phoneos:asteria-v2"));s.evo={bron:3};s.loot.mat_Berserker=5;localStorage.setItem("phoneos:asteria-v2",JSON.stringify(s));})()');
  window.eval("OS").openApp("asteria");
  const teamTabE4 = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabE4.click();
  const bronLineE4 = [...document.querySelectorAll(".forge-line")].find((l) => l.querySelector(".unit-name").textContent.startsWith("Bron"));
  check("forge éveil IV : ligne Bron au rang III financable", !!bronLineE4 && !bronLineE4.querySelector("button").disabled && bronLineE4.textContent.includes("Croc de Berserker"));
  if (bronLineE4) bronLineE4.querySelector("button").click();
  const saveE4 = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  check("éveil IV persisté (−3 Crocs de Berserker)", saveE4.evo.bron === 4 && saveE4.loot.mat_Berserker === 2);
  const bronCardE4 = [...document.querySelectorAll(".roster .unit-card")].find((c) => c.querySelector(".unit-name").textContent.includes("Bron"));
  check("éveil IV visible : ★★★★ et talents annoncés", !!bronCardE4 && bronCardE4.querySelector(".unit-name").textContent.includes("★★★★") && bronCardE4.textContent.includes("Éveil IV ✦ Dégâts +6 % et jauge de départ +5 %"));

  // Le Mode Histoire et les bannières événementielles/de gloire ne sont plus présents.
  check("aucun onglet Mode Histoire", ![...document.querySelectorAll(".gacha-tabs button")].some((b) => b.textContent === "Histoire"));
  const summonTabClean = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Invoquer");
  summonTabClean.click();
  check("aucune bannière événementielle", !document.querySelector(".featured-banner-grid") && !document.querySelector(".banner-slot") && !document.body.textContent.includes("Bannières thématiques"));
  check("invocation générale et portails de classe conservés", document.body.textContent.includes("Invocation générale") && document.querySelectorAll(".portal-grid .portal-btn").length === 12);
  window.eval("OS").openApp("trophies");
  check("trophées sans bannières ni records narratifs", !document.querySelector(".banner-slot") && !document.body.textContent.includes("boss d'histoire") && !!document.querySelector(".trophy-graal"));
  check("trophées : objectif de collection SS affiché", document.body.textContent.includes("Astrée, Héritière des braises") && document.body.textContent.includes("collection"));

  // ---- Raid hebdomadaire : 3 phases, coffre, Élixirs ----
  window.eval('(function(){var d=new Date(),t=new Date(d.getFullYear(),0,1),w=Math.ceil(((d-t)/86400000+t.getDay()+1)/7);localStorage.setItem("phoneos:asteria-v2-raid",JSON.stringify({week:d.getFullYear()+"-S"+w,elixirs:5,cleared:3,claimed:false}));})()');
  window.eval("OS").openApp("asteria");
  const questTabR = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  questTabR.click();
  check("panneau raid affiché", !!document.querySelector(".raid-panel"));
  check("classement hebdo du raid affiché (8 lignes)", document.querySelectorAll(".raid-board-row").length === 8 && document.body.textContent.includes("Vous"));
  check("ligne 'Vous' en surbrillance", !!document.querySelector(".raid-board-row.me") && document.querySelector(".raid-board-row.me").textContent.includes("Vous"));
  check("3 phases de raid affichées", document.querySelectorAll(".raid-chip").length === 3);
  check("3 phases déjà vaincues (✓)", document.querySelectorAll(".raid-chip.done").length === 3);
  check("Élixirs affichés (5)", document.querySelector(".raid-panel").textContent.includes("Élixirs de raid : 5"));
  const chest = document.querySelector(".raid-chest");
  check("coffre hebdomadaire réclamable", !!chest);
  const raidData = window.eval("OS").asteriaData;
  const lb = raidData.raidLeaderboard(JSON.parse(window.localStorage.getItem("phoneos:asteria-v2-raid")).week, 3);
  const bonus = raidData.raidRwOf(lb.rank);
  check("classement déterministe : rang calculé " + lb.rank + "/8", lb.rank >= 1 && lb.rank <= 8 && lb.entries.length === 8);
  const q0 = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2")).quartz;
  if (chest) chest.click();
  const rs1 = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  const rr1 = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2-raid"));
  check("coffre : +90 ◆ + bonus de rang " + lb.rank + " (+" + bonus + " ◆)", rs1.quartz === q0 + 90 + bonus);
  check("coffre : +3 Sceaux du dragon (39 → 42 après l'Anneau)", rs1.loot.sceau === 42);
  check("coffre marqué réclamé", rr1.claimed === true);
  const teamTabR2 = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Équipe");
  teamTabR2.click();
  check("20 matières de butin dont Élixir, classes et reliques", document.querySelectorAll(".loot-chip").length === 20 && document.body.textContent.includes("Élixir de raid") && document.body.textContent.includes("Poussière de relique") && document.body.textContent.includes("Cristal de relique"));
  const questTabR2 = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Quêtes");
  questTabR2.click();
  const enterBtn = [...document.querySelectorAll(".raid-panel .pull-btn")].find((b) => b.textContent.includes("Entrer dans le Raid"));
  check("bouton entrer dans le raid actif", !!enterBtn && !enterBtn.disabled);
  if (enterBtn) enterBtn.click();
  check("raid : −1 Élixir persisté", JSON.parse(window.localStorage.getItem("phoneos:asteria-v2-raid")).elixirs === 4);
  check("combat de raid lancé (phase 1/3)", !!document.querySelector(".battle") && document.body.textContent.includes("Gardien de la trempe") && document.body.textContent.includes("Phase 1/3"));
  check("élite du gardien annoncée", document.querySelector(".battle-log").textContent.includes("Massue écrasante"));

  // Silhouettes évoluées : aura, échelle et couronne d'étoiles au rang III
  const sil0 = window.eval("OS").art.silhouette("Chevalier", "#fff", 100, 110, false, 0);
  const sil3 = window.eval("OS").art.silhouette("Chevalier", "#fff", 100, 110, false, 3);
  check("silhouette de base sans aura", !sil0.includes("scale(1.08)"));
  check("silhouette évoluée : échelle 1,08 + halo", sil3.includes("scale(1.08)") && sil3.includes("opacity=\"0.16\""));
  check("silhouette rang III : couronne d'étoiles dorées", sil3.includes("#ffd970") && sil3.includes("#e3b23c"));
  const raidSave = JSON.parse(window.localStorage.getItem("phoneos:asteria-v2"));
  const anyTeamEvo = raidSave.team.some((id) => ((raidSave.evo || {})[id] || 0) >= 1);
  const raidArt = document.querySelector(".battle .story-art").innerHTML;
  check("scène de combat raid : aura présente seulement si un membre est évolué", raidArt.includes("scale(1.08)") === anyTeamEvo);

  // Laboratoire Entraînement : roster complet, cible immortelle et sortie immédiate.
  const trainTabBtn = [...document.querySelectorAll(".gacha-tabs button")].find((b) => b.textContent === "Entraînement");
  check("onglet Entraînement présent", !!trainTabBtn);
  trainTabBtn.click();
  check("entraînement : tous les héros affichés", document.querySelectorAll(".roster .unit-card").length === unitIds.length);
  const graalCardT = [...document.querySelectorAll(".roster .unit-card")].find((c) => c.textContent.includes("Astrée, Héritière des braises"));
  if (graalCardT) graalCardT.click();
  check("clic héros : combat d'entraînement lancé immédiatement", !!document.querySelector(".battle") && document.querySelector(".battle").textContent.includes("combat réel"));
  check("héros non possédé sélectionnable", !!document.querySelector(".training-selected .unit-card.in-team"));
  const changeTrainingHero = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Changer de héros"));
  check("laboratoire : combat isolé sans devoir défiler le roster complet", !!changeTrainingHero && !!document.querySelector(".training-selected .unit-card.in-team"));
  if (changeTrainingHero) changeTrainingHero.click();
  const startTrain = [...document.querySelectorAll(".pull-row button")].find((b) => b.textContent.includes("mob aléatoire"));
  check("démarrage contre mob aléatoire proposé", !!startTrain && !startTrain.disabled);
  if (startTrain) startTrain.click();
  check("combat laboratoire démarré", !!document.querySelector(".battle") && document.querySelector(".battle").textContent.includes("combat réel"));
  const enemyHpBefore = Number((document.querySelector(".battle .hp-row.enemy .hp-num")?.textContent || "0").replace(/[^0-9]/g, ""));
  let heroHpBefore = Number((document.querySelector(".battle .hp-row.ally .hp-num")?.textContent || "0").replace(/[^0-9]/g, ""));
  for (let action = 0; action < 3; action++) {
    const card = document.querySelector(".battle .hand-card");
    if (card) card.click();
  }
  const enemyHpAfter = Number((document.querySelector(".battle .hp-row.enemy .hp-num")?.textContent || "0").replace(/[^0-9]/g, ""));
  const heroHpAfter = Number((document.querySelector(".battle .hp-row.ally .hp-num")?.textContent || "0").replace(/[^0-9]/g, ""));
  check("duel : les attaques diminuent réellement les PV ennemis", enemyHpBefore > 0 && enemyHpAfter > 0 && enemyHpAfter < enemyHpBefore);
  check("duel : l'ennemi riposte et peut blesser le héros après 3 actions", heroHpBefore > 0 && heroHpAfter < heroHpBefore);
  check("duel : compteur de dégâts cumulés visible", !!document.querySelector(".training-score") && document.querySelector(".training-score").textContent.toLowerCase().includes("dégâts cumulés"));
  for (let action = 0; action < 9 && document.querySelector(".battle"); action++) {
    const card = document.querySelector(".battle .hand-card:not([disabled])");
    if (card) card.click();
  }
  const trainingLog = document.querySelector(".battle-log")?.textContent || "";
  check("ultime de héros déclenché après son délai de classe", trainingLog.includes("Éveil du protagoniste"));
  check("ultime ennemi déclenché au quatrième tour", trainingLog.includes("ULTIME ENNEMI"));
  const quitTraining = [...document.querySelectorAll(".battle button")].find((b) => b.textContent.includes("Quitter le test"));
  check("sortie disponible pendant le combat", !!quitTraining);
  if (quitTraining) quitTraining.click();
  check("sortie immédiate vers Entraînement", !document.querySelector(".battle") && document.body.textContent.includes("mob aléatoire"));

  // Volume : réglage borné, persisté et transmis au moteur audio.
  window.eval("OS").setVolume(37);
  check("volume : valeur appliquée au moteur audio", window.eval("OS").sfx.volume === 37);
  check("volume : valeur persistée", window.localStorage.getItem("phoneos:volume") === "37");
  window.eval("OS").setVolume(140);
  check("volume : valeur plafonnée à 100 %", window.eval("OS").sfx.volume === 100);
  window.eval("OS").setVolume(60);

  // Le moteur audio ignore les demandes répétées identiques sans dupliquer sa boucle.
  window.eval("OS").sfx.setMusic(true);
  check("audio : activation musique reflétée", window.eval("OS").sfx.musicPlaying === true);
  window.eval("OS").sfx.setMusic(true);
  window.eval("OS").sfx.setMusic(false);
  check("audio : arrêt musique reflété", window.eval("OS").sfx.musicPlaying === false);
  window.eval("OS").sfx.setMuted(true);
  window.eval("OS").sfx.setMuted(true);
  window.eval("OS").sfx.setMuted(false);

  // Le sélecteur global de difficulté a disparu avec le Mode Histoire.
  check("aucun sélecteur global de difficulté", !document.getElementById("top-diff"));
  const nF = document.querySelectorAll(".notif").length;
  document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "f" }));
  check("raccourci F : réaction plein écran (repli jsdom)", document.querySelectorAll(".notif").length === nF + 1);

  // Raccourcis globaux : navigation 1–4 et protection des combinaisons système.
  const nCtrlF = document.querySelectorAll(".notif").length;
  document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "f", ctrlKey: true, bubbles: true }));
  check("Ctrl+F ne déclenche pas le plein écran", document.querySelectorAll(".notif").length === nCtrlF);
  document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "2", bubbles: true }));
  check("raccourci 2 : ouverture de Personnages", !!document.querySelector("#top-tabs .top-tab.active[data-app='heroes']"));
  document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "1", bubbles: true }));
  check("raccourci 1 : retour à Astéria", !!document.querySelector("#top-tabs .top-tab.active[data-app='asteria']"));

  window.eval("OS").closeApp();

  // closeApp ramène sur Astéria (page web unique, pas d'écran d'accueil)
  const backTab = document.querySelector("#top-tabs .top-tab.active");
  check("retour -> Astéria ouverte", !!backTab && backTab.dataset.app === "asteria");

  if (errors.length) {
    console.log("ERREURS:\n" + errors.join("\n"));
  }
  console.log(results.join("\n"));
  const fails = results.filter((r) => r.startsWith("FAIL")).length;
  console.log("\n" + (fails === 0 && errors.length === 0 ? "TOUS LES TESTS PASSENT" : fails + " échec(s), " + errors.length + " erreur(s) JS"));
  process.exit(fails === 0 && errors.length === 0 ? 0 : 1);
}, 2400);
