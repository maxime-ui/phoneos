# Astéria — Le guide complet

🌞 Bienvenue dans **Astéria**, un gacha + RPG au tour par tour jouable directement
dans votre navigateur, en une simple page web avec bouton plein écran. Ce document explique
tout : la page, le combat, les héros, les évolutions, les reliques, le Raid, le
Mode Histoire et les stratégies. 100 % hors-ligne, aucune donnée ne quitte
votre navigateur.

---

## 1. La page de jeu

| Élément | Fonctionnement |
|---|---|
| Barre supérieure | Identité du jeu + **4 onglets** (Astéria, Personnages, Réglages, Trophées) + **sélecteur de difficulté du Mode Histoire** (6 niveaux, **chaîne de difficultés** : chaque palier se débloque en bouclant toute l'histoire au palier précédent) + **bouton ⛶ Plein écran** (+ raccourci clavier **F**) + horloge réelle |
| Page principale | L'app affichée en grand — **Astéria est ouverte par défaut** au chargement |
| Notifications | Bannières empilées en haut à droite, désactivables dans Réglages |
| Sauvegarde | Automatique, dans le stockage local du navigateur — rien à faire |

**Réglages utiles** : vitesse du jeu (Lent/Normal/Rapide), vitesse des
dialogues de l'Histoire (avec *Instantané*), mode daltonien (repères visuels),
son on/off, **musique de fond on/off (une mélodie propre à chaque menu : Astéria,
Personnages, Trophées, Réglages)**, volume, notifications.

---

## 2. Astéria — vue d'ensemble

L'app **Astéria** contient 6 onglets : **Invoquer**, **Équipe**,
**Entraînement**, **Collection**, **Quêtes**, **Histoire** (le Raid en fait
partie via Quêtes, voyez §6).

### 2.1 Le quartz (◆)

Monnaie unique. On en gagne en combattant (victoires, bosses, étages,
chapitres), via les missions quotidiennes, le coffre du raid, les bannières et
les paliers de Collection. On le dépense en invocations.

### 2.2 Les invocations

| Mode | Prix | Remarque |
|---|---|---|
| Bannière des héros ×1 / ×10 | 3 ◆ / 30 ◆ | Toutes classes : 5 % SSR · 20 % SR · 75 % R. **Pity : SSR garanti à la 50ᵉ invocation** (compteur affiché en direct, remis à zéro dès qu'un SSR tombe, garanti ou non) |
| Portail de classe (11 classes) | 5 ◆ | Pool limité à la classe (Invocateur et Valkyrie inclus), **pity : SSR garanti au 30ᵉ tirage une seule fois, puis au 50ᵉ définitivement** (compteur visible, réinitialisé à chaque SSR) |

Les **portails de classe** sont le moyen sûr de viser un rôle précis
(Soigneur, Défenseur, Tueur de boss…). Le pity compte séparément par classe.
Règle spéciale : **une seule fois par classe**, le seuil tombe à 30 ; dès qu'il
a fourni son SSR garanti, il passe **définitivement à 50** — mais si un SSR sort
naturellement avant le seuil, le compteur repart de zéro.

Les **doublons** montent le niveau d'un héros : +8 % ATK/PV par copie
(plafond +96 %, soit 13 copies utiles).

---

## 3. Les héros

### 3.1 Raretés

| Rang | Couleur | Nombre |
|---|---|---|
| R (gris) | 75 % des tirages | 72 |
| SR (bleu) | 20 % | 46 |
| SSR (doré) | 5 % | 35 — chaque SSR a un **passif unique** |
| SS (orange) | — | 1 : **Astrée, Héritière des braises** (le Graal, voir §7) |

Chaque héros possède **son propre visuel** : un portrait SVG procédural unique
(palette, coiffure, arme et emblème variant par héros) affiché dans l'Équipe,
la Collection et l'app Personnages — grisés tant qu'ils ne sont pas possédés.

### 3.2 Les 11 classes et bonus d'équipe

| Classe | Rôle | Bonus |
|---|---|---|
| Chevalier | Polyvalent | Critique +5 % |
| Berserker | Gros dégâts | Dégâts +10 % sous 50 % PV |
| Mage | Jauge rapide | Ultime +4 %/carte |
| Archer | Coup critique | Esquive +8 % |
| Rôdeur | Esquive | Esquive +10 % |
| Héros | Croissance | +5 % dégâts/tour (Héros accumulent : rin, graal) |
| **Soigneur** | Survie | Se soigne au lieu d'attaquer — soigne l'allié le plus blessé |
| **Défenseur** | Survie | Réduit les dégâts subis par toute l'équipe |
| **Tueur de boss** | Burst | +30/+45 % dégâts, attire les ripostes en priorité |
| **Invocateur** | Écho | **Ombre fidèle** : une ombre frappe en plus à chaque carte (12 % de l'ATK) |
| **Valkyrie** | Soutien | **Aile d'orage** : chaque carte soigne l'allié le plus blessé, plongeon éclair tous les 7 tours |

### 3.2bis Le rythme du combat — ultimes et élans

- **Ultime ennemie** : chaque archétype ennemi (17 au total, répartis en
  6 classes — Humain, Arcaniste, Élémentaire, Mort-vivant, Spectre, Bestial)
  déclenche sa propre ultime au bout de **4 à 6 tours** : Incinération,
  Légion d'ombres, Moisson noire, Blizzard, Crépuscule de la faux…
- **Élan de classe** : tous les **7 tours**, le membre le plus fort de votre
  équipe réagit selon sa classe — charge du Chevalier, pointes de l'Invocateur,
  plongeon de la Valkyrie… à vous de scanner le rythme des tours.

### 3.3 Les cartes de combat

Chaque héros possède 3 cartes (Brut ◤Rouge ×1,5 · Arcane ◆Bleu ×1,0 · Rapide
▲Vert ×0,8). Chaque tour, 3 cartes tirées de l'équipe sont jouables. Les cartes
rechargent la jauge d'Ultime (Bleu > Vert) et déclenchent passifs et talents.

**Ultime (jauge 100 %)** : frappe massive + effet propre à l'héros.
Les jauge de départ viennent des éveils et de l'Étendard (+ max 60 % en quête).

### 3.4 Évolutions et éveils (Forge, onglet Équipe)

| Rang | Coût | Gains |
|---|---|---|
| ★ (Éveil I) | voir Forge | Jauge de départ +10 % + talent de classe I |
| ★★ (Éveil II) | mats | Dégâts +8 % + **talent de classe II** |
| ★★★ (Éveil III) | mats | Talent de classe III + **second talent de classe réactivé** |
| ★★★★ (Éveil IV) | **matériau de classe** (3/4/5 selon rareté) | Dégâts +6 % et jauge de départ +5 % |

- +10 % ATK/PV par rang, cumulés aux doublons.
- **20 talents de classe** au total — deux par classe, empilables.
- La silhouette du héros évolue : aura (★), halo (★★), couronne d'étoiles
  dorées (★★★) — visible en combat ET dans les scènes d'histoire.

### 3.4bis Matériaux de classe et recyclage des doublons

Chaque classe a son **matériau d'éveil IV** : Insigne de Chevalier, Croc de
Berserker, Rune de Mage, Plume d'Archer, Fleur de Rôdeur, Étoile du Héros,
Baume de Soigneur, Rivet de Défenseur, Lame du Tueur, **Cendre d'Invocateur,
Plume de Valkyrie**.

| Source | Gain |
|---|---|
| Quêtes Facile / Normal / Difficile | +1 / +2 / +3 matériaux tirés parmi les classes de l'équipe |
| Mode Infini (chaque étage) | +1 matériau d'une classe de l'équipe |
| Histoire (toutes difficultés) | +1 à +3 selon la difficulté |
| Raid (par phase franchie) | +1 matériau |
| **Recyclage d'un doublon** (onglet Équipe, panneau Recyclage) | +2 (R) / +4 (SR) / +8 (SSR) du matériau de la classe du doublon ; le doublon est consommé |

Les doublons restent par ailleurs utiles en niveau (+8 %/copie, plafond +96 %) :
recyclez seulement les copies au-delà du plafond utile.

### 3.5 Les 8 matières classiques (+ 2 items de reliques, + 11 matériaux de classe — §3.4bis)

| Matière | S'obtient dans | Sert à |
|---|---|---|
| Éclat d'acier | Quêtes (toutes) | Forger/évoluer (rang R) |
| Cœur de braise | Mode Infini (chaque étage) | Évolutions SR/SSR |
| Larme de la nuit | Boss d'histoire | Évolutions SR/SSR, Lame du Raid |
| Couronne d'aube | Quêtes Difficile, boss Impossible→Enfer+ | Évolutions SSR, reliques |
| Sceau du dragon | Enfer+ uniquement | Étendard, évolutions ★★★ |
| Élixir de raid | Quêtes Difficile, Infini tous les 5 étages, Histoire Enfer/Enfer+ | Entrer dans le Raid |
| **Poussière de relique** | Toutes les victoires ordinaires (quêtes, étages d'Infini, coffre) | Améliorer les reliques (rangs R/SR/SSR) |
| **Cristal de relique** | Boss (difficulté haute), phases du Raid, étages multiples de 5, coffre | Améliorer les reliques (rangs SR/SSR) |

---

## 4. Le Reliquaire (système de reliques v4)

Dans l'onglet **Équipe**, après la Forge. **Huit reliques** — Lame du Raid,
Écaille du Dragon, Étendard des trois phases, **Anneau des serments (critique)**,
**Orbe des braises (dégâts)**, **Creuset des serments (soins)**,
**Carcan des origines (esquive)** et **Égide de Hautefeuille (renvoi)** —
**forgées puis équipées sur UN héros de votre
choix** : une relique n'a d'effet que sur son porteur (stats personnelles). Une
relique forgée mais non équipée ne fait rien ; chaque relique peut être
déplacée, retirée, réattribuée à volonté via le sélecteur « Équiper sur : » —
qui affiche en clair **l'effet exact sur le héros choisi** (ATK/PV futurs
ou bonus %), y compris pour un déplacement entre héros.

### 4.1 Forger et améliorer

1. **Forger** (rang **N**) avec les matières de raid : la relique devient
   active et apporte sa **stat principale** ;
2. **Améliorer** avec Poussières (+ Cristaux aux rangs hauts) pour monter de
   rang : **N → R → SR → SSR (Légendaire)** ;
3. Chaque rang débloque **une sous-stat supplémentaire** — les sous-stats sont
   **fixées à l'avance** (zéro aléatoire) : vous savez exactement ce que vous
   achetez.

| Relique | N | R | SR | SSR (Légendaire) |
|---|---|---|---|---|
| Lame du Raid (ATK) | +14 % | +20 % **· Crit +3 %** | +27 % · Crit +3 % **· Renvoi +5 %** | +38 % · Crit +3 % · Renvoi +5 % **· Exécution +8 %** |
| Écaille du Dragon (PV) | +14 % | +20 % **· Soins +4 %** | +27 % · Soins +4 % **· Esquive +4 %** | +38 % · Soins +4 % · Esquive +4 % **· PV héros +6 %** |
| Étendard des trois phases (jauge) | +15 % | +19 % **· ATK équipe +3 %** | +22 % · ATK équipe +3 % **· Ultime/carte +2 %** | +26 % · ATK équipe +3 % · Ultime/carte +2 % **· Croissance +2 %/tour** |
| Anneau des serments (critique) | +9 % | +13 % **· Exécution +6 %** | +17 % · Exéc +6 % **· Ultime/carte +3 %** | +23 % · Exéc +6 % · Ultime/carte +3 % **· Renvoi +5 %** |
| Orbe des braises (dégâts) | +9 % | +13 % **· ATK équipe +4 %** | +17 % · ATK équipe +4 % **· Soins +5 %** | +23 % · ATK équipe +4 % · Soins +5 % **· Croissance +3 %/tour** |
| Creuset des serments (soins) | +10 % | +16 % **· PV héros +5 %** | +22 % · PV héros +5 % **· ATK équipe +3 %** | +30 % · PV héros +5 % · ATK équipe +3 % **· Croissance +2 %/tour** |
| Carcan des origines (esquive) | +8 % | +12 % **· Crit +3 %** | +17 % · Crit +3 % **· Renvoi +4 %** | +24 % · Crit +3 % · Renvoi +4 % **· Exécution +6 %** |
| Égide de Hautefeuille (renvoi) | +10 % | +15 % **· Soins +3 %** | +20 % · Soins +3 % **· PV héros +5 %** | +27 % · Soins +3 % · PV héros +5 % **· Croissance +2 %/tour** |

Coûts d'amélioration : N→R **10 Poussières** · R→SR **20 Poussières + 5 Cristaux** ·
SR→SSR **40 Poussières + 12 Cristaux**.
Les anciennes reliques vénérantes restent forgées au même rang (leurs stats sont
désormais **recalibrées**, v4, et personnelles au héros équipé — pensez à
choisir un porteur).

### 4.2 Bonus d'ensemble (passifs supplémentaires)

| Ensemble | Condition | Effet |
|---|---|---|
| **Pacte du trio** | 2 reliques forgées **et équipées** | Dégâts +4 % |
| **Trinité du dragon** | 4 reliques forgées **et équipées** | Dégâts +4 % et jauge de départ +10 % |
| **Harmonie parfaite** | 4 reliques équipées en rang Épique (SR) ou + | Dégâts +8 % |
| **Pacte d'ombre** | 2 reliques équipées en rang Épique (SR) ou + | Esquive +6 % |

Le boost maximal : ATK/PV +14 % → +38 %, jauge jusqu'à +26 %, et jusqu'à
+30 % de critique, dégâts, soins, esquive, renvoi… plus les 4 ensembles :
environ **+40 % de puissance d'équipe** à tout maximiser.

---

## 5. Les modes de combat

### 5.1 Quêtes (1er onglet de combat)

Les **taux de butin varient avec la difficulté** (matériaux de classe : +1/+2/+3
et Cristal dès la Difficile ; voir §3.4bis).

| Difficulté | Ennemi (hp/atk) | Butin |
|---|---|---|
| Facile | 7 600 / 830 | +1 Éclat, +1 Poussière, +1 matériau de classe |
| Normal | 16 200 / 1 430 | +2 Éclats (parfois +1), +2 Poussières, +2 matériaux |
| Difficile | 30 300 / 2 210 | +3 Éclats, Couronne, Élixir, **Cristal**, +3 matériaux |

### 5.2 Mode Infini

Ennemis sans fin, +18 % de stats par étage (+9 % ATQ), record sauvegardé.
Butin : Cœur de braise + Poussière par étage ; **Élixir + Cristal tous les
5 étages**. Restauration de 25 % PV par étage.

### 5.3 Raid hebdomadaire

1 Élixir pour entrer, 3 phases enchaînées (Gardien de la trempe 71 000 PV →
Commandant du feu 108 000 PV → Cœur du dragon 168 000 PV), équipe restaurée
entre phases, +1 Cristal par phase franchie. Coffre hebdo en fonction des
phases vaincues (+30 ◆ × phases, matières, Poussières, Cristaux) plus un
**bonus de rang** du **classement hebdo** : vous êtes classé contre 7 rivaux simulés
(score = phases vaincues : 1 500 / 2 500 / 4 000), bonus de +60 ◆ (1er),
+40 ◆ (top 3) ou +20 ◆, rivaux et classement renouvelés chaque semaine.

### 5.4 Récompenses des événements

Week-end réel : **fortune** (récompenses ×2) ou **invocateurs** (SSR ×2).
(En dehors des week-ends, aucun événement.)

---

## 6. Le Mode Histoire

- **24 chapitres en 4 actes + un épilogue**, dialogues frappés (vitesse réglable,
  option Instantané). L'Acte III s'étend après le Dragon des cendres :
  **le Général des cendres** (dans le sillage du Faucheur d'équinoxe),
  **la descendance des braises** puis **le camp des braises**. L'Acte IV
  (« Les braises d'avant ») approfondit les ennemis de la route (Nomade sans
  visage, Prêtre des braises, Golem du serment, Triade de fer, Sanguinaire des
  cratères) et gagne trois chapitres : **la Vouivre des cimes** (boss :
  **Vouivre des braises**), **le culte du retour** (boss : **Archonte des
  cendres**) et **le feu qui choisit** — avant **l'épilogue « Les trois qui
  restaient debout »** qui révèle les origines : le premier dragon, le premier
  serment, la forge des premières reliques.
- **Choix narratifs** → **bénédictions** permanentes (+8 % dégâts, démarrage de jauge, etc.).
- **8 boss de récit** aux chapitres 2, 4, 7, 10, 12, 13, 21 et 22 (Meute
  d'ombre, Gortak chef de guerre, Spectre des urnes, Chevalier de cendres,
  Dragon des cendres, Général des cendres, Vouivre des braises, Archonte des
  cendres) — plus la
  bataille finale de l'épilogue, **l'Écho du premier dragon** ; **6 difficultés
  chaînées** : Facile, Moyen, Difficile, Impossible, Enfer, **Enfer+** — il faut
  boucler **toute** l'histoire en Facile pour débloquer Moyen, en Moyen pour
  Difficile, etc. Chaque palier battu à un boss le compte pour les
  **bannières de gloire** et les records.
- **Butin variable selon la difficulté** : Larmes (+1 → +3), Couronnes dès
  Impossible, Cristaux dès Difficile, Élixirs et Sceaux en Enfer/Enfer+,
  matériaux de classe en continu
- **Bannières de gloire** : 8 bannières à +25 ◆ chacune (notification système).
  Les **5 bannières d'âge** (Chemin, Trois Volontaires, Serment, Caldeira,
  Dragon Rouge) demandent **tous les 8 boss** battus à un palier de difficulté
  croissant ; les **3 bannières de boss** (Général, Vouivre, Archonte) demandent
  leur boss dédié en **Enfer+**.
- **Enfer+** : ennemis ×4,2 PV / ×3 ATQ, **compétences élites enrichies**
  (Massue écrasante, Siphon d'âmes, Souffle de cendres, Oriflamme maudite,
  **Hache d'exécution**, **Vol de sang**, **Appel des cendres**…), +2 Élixirs,
  +2 Cristaux et le fameux **Graal** (voir §7).
- **Ennemis réévalués (v4)** : **22 ennemis nommés** à travers **17 archétypes**
  et **6 classes ennemies** (Humain, Arcaniste, Élémentaire, Mort-vivant,
  Spectre, Bestial) ; chaque archétype possède désormais une **ultime propre**
  au bout de 4 à 6 tours (§3.2bis), et 4 nouveaux faisent la loi sur la route :
  Drakônide, Faucheur, Gardien des runes et Cultiste.

---

## 7. Le Graal — Astrée, Héritière des braises

Vainquez le **Dragon des cendres** (chapitre 12) **en Enfer+** : +50 ◆ et **SS
exclusive** (Aura orange, rang SS), **rééquilibrée (v4)** : 2 600 ATK ·
15 300 PV, **passif Héritière des braises (dégâts +16 % et jauge de départ
+22 %)** et Ultime héritage des braises (+8 % dégâts/tour, renvoie 32 % des
ripostes, soigne 18 % des dégâts infligés). La pierre angulaire des
compétiteurs — affichée dans la Salle des trophées.

---

## 8. Systèmes connexes

- **Collection** (Astéria) : tout le roster, héros manquants grisés ; paliers de
  25/50/75/100 % → +50/+100/+200/+500 ◆ ; touchez un héros → fiche détaillée.
- **App Personnages** : fiche de chaque héros (portrait SVG unique, stats réelles, compétence, passif,
  éveils, talents, doublons, coût d'évolution suivante, comment invoquer les absents).
- **Missions quotidiennes** : 3 missions par jour réel (cartes jouées, invocations,
  victoires, soins, étages Infini, boss d'histoire) — réclamation dans l'onglet Quêtes.
- **Salle des trophées** : bannières, records des boss par difficulté (Enfer+
  distingué), record d'Infini, statut du Graal.

---

## 9. Stratégies éclairées

1. **Début** : quêtes Facile/Normal pour l'Éclat, portail Soigneur tôt (un
   Soigneur change tout en Difficile+).
2. **Pity** : la première pity de chaque portail de classe tombe à 30 (gardez
   150 ◆ de côté pour la saisir) puis le seuil passe **définitivement à 50** —
   planifiez 250 ◆ pour les tirages suivants. Sur la bannière des héros, le
   compteur affiche votre pity (SSR garanti à 50).
3. **Équipe équilibrée** : 1 Soigneur + 1 Défenseur + 1 DPS/Tueur couvre presque tout ;
   pour les Raid : Tueur de boss + Soigneur + Héros.
4. **Butin** : n'oubliez pas les Cristaux — la Difficile quotidienne (1 Cristal)
   est la manière régulière de faire monter vos reliques au rang SR.
5. **Bonus d'ensemble** : 4 reliques forgées ET équipées = Trinité (+4 % dégâts,
   +10 jauge) même en rang N : équipez-les toutes d'abord, améliorez ensuite.
   Astuce : équipez les 8 reliques dès le rang N (Pacte + Trinité actifs :
   +8 % dégâts et +10 jauge), déplacez-les avec la prévisualisation — Lame +
   Exécution SSR sur votre meilleur DPS, Écaille sur le Défenseur, Étendard sur
   l'ouvreur (éveil ★ lui aussi), Anneau/Orbe sur vos dégâts, Creuset sur le
   Soigneur, Carcan/Égide sur la ligne de front.
7. **Éveil IV** : les matériaux de classe tombent un peu partout — gardez les
   doublons SSR pour le recyclage (+8) plutôt que de les laisser dormir.
6. **Enfer+** : équipe ★★★ + reliques SR est un vrai minimum ; gardez des Élixirs
   de re-change (Échec = phase perdue).

---

## 10. Technique

- 100 % HTML/CSS/JS vanilla, aucune dépendance runtime.
- Sauvegarde locale (`phoneos:*` dans localStorage) : Astéria, Histoire, Raid,
  missions, meilleur étage, Réglages.
- Tests : `node test/smoke.test.js` (198 vérifications) et
  `node test/stress.test.js` — voir le README.
- Données partagées pour les apps : `OS.asteriaData`.
