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
son on/off, volume, notifications.

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
| Portail de classe (9 classes) | 5 ◆ | Pool limité à la classe, **pity : SSR garanti au 30ᵉ tirage** (compteur visible, réinitialisé au SSR) |

Les **portails de classe** sont le moyen sûr de viser un rôle précis
(Soigneur, Défenseur, Tueur de boss…). Le pity compte séparément par classe.

Les **doublons** montent le niveau d'un héros : +8 % ATK/PV par copie
(plafond +96 %, soit 13 copies utiles).

---

## 3. Les héros

### 3.1 Raretés

| Rang | Couleur | Nombre |
|---|---|---|
| R (gris) | 75 % des tirages | 64 |
| SR (bleu) | 20 % | 38 |
| SSR (doré) | 5 % | 30 — chaque SSR a un **passif unique** |
| SS (orange) | — | 1 : **Astrée, Héritière des braises** (le Graal, voir §7) |

### 3.2 Les 9 classes et bonus d'équipe

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
| **Tueur de boss** | Burst | +30 % dégâts, attire les ripostes en priorité |

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
Baume de Soigneur, Rivet de Défenseur, Lame du Tueur.

| Source | Gain |
|---|---|
| Quêtes Facile / Normal / Difficile | +1 / +2 / +3 matériaux tirés parmi les classes de l'équipe |
| Mode Infini (chaque étage) | +1 matériau d'une classe de l'équipe |
| Histoire (toutes difficultés) | +1 à +3 selon la difficulté |
| Raid (par phase franchie) | +1 matériau |
| **Recyclage d'un doublon** (onglet Équipe, panneau Recyclage) | +2 (R) / +4 (SR) / +8 (SSR) du matériau de la classe du doublon ; le doublon est consommé |

Les doublons restent par ailleurs utiles en niveau (+8 %/copie, plafond +96 %) :
recyclez seulement les copies au-delà du plafond utile.

### 3.5 Les 8 matières classiques (+ 2 items de reliques, + 9 matériaux de classe — §3.4bis)

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

## 4. Le Reliquaire (système de reliques v2)

Dans l'onglet **Équipe**, après la Forge. **Cinq reliques** — Lame du Raid,
Écaille du Dragon, Étendard des trois phases, **Anneau des serments (critique)**
et **Orbe des braises (dégâts)** — **forgées puis équipées sur UN héros de votre
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

| Rang | Lame | Écaille | Étendard | Anneau | Orbe |
|---|---|---|---|---|---|
| N | ATK +12 % | PV +12 % | Jauge +15 % | Critique +8 % | Dégâts +8 % |
| R | +18 % **· Crit +3 %** | +18 % **· Soins +4 %** | +18 % **· ATK équipe +3 %** | +12 % **· Exécution +6 %** | +12 % **· ATK équipe +4 %** |
| SR | +26 % · Crit +3 % **· Renvoi +5 %** | +26 % · Soins +4 % **· Esquive +4 %** | +21 % · ATK équipe +3 % **· Ultime/carte +2 %** | +16 % · Exéc +6 % **· Ultime/carte +3 %** | +16 % · ATK équipe +4 % **· Soins +5 %** |
| SSR | +36 % · Crit +3 % · Renvoi +5 % **· Exécution +8 %** | +36 % · Soins +4 % · Esquive +4 % **· PV héros +6 %** | +24 % · ATK équipe +3 % · Ultime/carte +2 % **· Croissance +2 %/tour** | +22 % · Exéc +6 % · Ultime/carte +3 % **· Renvoi +5 %** | +22 % · ATK équipe +4 % · Soins +5 % **· Croissance +3 %/tour** |

Coûts d'amélioration : N→R **10 Poussières** · R→SR **20 Poussières + 5 Cristaux** ·
SR→SSR **40 Poussières + 12 Cristaux**.
Les anciennes reliques vénérantes restent forgées au même rang (leurs stats sont
désormais personnelles au héros équipé — pensez à choisir un porteur).

### 4.2 Bonus d'ensemble (passifs supplémentaires)

| Ensemble | Condition | Effet |
|---|---|---|
| **Pacte du trio** | 2 reliques forgées **et équipées** | Dégâts +4 % |
| **Trinité du dragon** | 4 reliques forgées **et équipées** | Dégâts +4 % et jauge de départ +10 % |
| **Harmonie parfaite** | 4 reliques équipées en rang Épique (SR) ou + | Dégâts +8 % |

Le boost maximal : 8 %→16 % ATK, 4 %→14 % PV/via sous-stats, jauges,
critique, renvoi, exécution, soins… soit environ **+30 % de puissance
d'équipe** à tout maximiser.

---

## 5. Les modes de combat

### 5.1 Quêtes (1er onglet de combat)

Les **taux de butin varient avec la difficulté** (matériaux de classe : +1/+2/+3
et Cristal dès la Difficile ; voir §3.4bis).

| Difficulté | Ennemi (hp/atk) | Butin |
|---|---|---|
| Facile | 7 000 / 780 | +1 Éclat, +1 Poussière, +1 matériau de classe |
| Normal | 15 000 / 1 330 | +2 Éclats (parfois +1), +2 Poussières, +2 matériaux |
| Difficile | 28 000 / 2 050 | +3 Éclats, Couronne, Élixir, **Cristal**, +3 matériaux |

### 5.2 Mode Infini

Ennemis sans fin, +18 % de stats par étage (+9 % ATQ), record sauvegardé.
Butin : Cœur de braise + Poussière par étage ; **Élixir + Cristal tous les
5 étages**. Restauration de 25 % PV par étage.

### 5.3 Raid hebdomadaire

1 Élixir pour entrer, 3 phases enchaînées (Gardien de la trempe 66 000 PV →
Commandant du feu 100 000 PV → Cœur du dragon 155 000 PV), équipe restaurée
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

- **18 chapitres en 4 actes + un épilogue**, dialogues frappés (vitesse réglable,
  option Instantané). L'Acte IV (« Les braises d'avant ») approfondit les
  ennemis de la route (Nomade sans visage, Prêtre des braises, Golem du
  serment, Triade de fer, Sanguinaire des cratères) et **l'épilogue « Les trois
  qui restaient debout » révèle les origines** : le premier dragon, le premier
  serment, la forge des premières reliques.
- **Choix narratifs** → **bénédictions** permanentes (+8 % dégâts, démarrage de jauge, etc.).
- **6 boss de récit** aux chapitres 2, 4, 7, 10, 12 et 18 (l'Écho du premier
  dragon) ; **6 difficultés chaînées** : Facile, Moyen, Difficile, Impossible,
  Enfer, **Enfer+** — il faut boucler **toute** l'histoire en Facile pour
  débloquer Moyen, en Moyen pour Difficile, etc. ; Enfer+ exige en plus les
  5 bannières.
- **Butin variable selon la difficulté** : Larmes (+1 → +3), Couronnes dès
  Impossible, Cristaux dès Difficile, Élixirs et Sceaux en Enfer/Enfer+,
  matériaux de classe en continu
- **Bannières de gloire** : 5 bannières à +25 ◆ chacune (notification système) ;
  chaque bannière demande les 5 boss battus à un palier de difficulté.
- **Enfer+** : ennemis ×4,2 PV / ×3 ATQ, **5 compétences élites** (Massue écrasante,
  Siphon d'âmes, Souffle de cendres, Oriflamme maudite…), +2 Élixirs, +2 Cristaux
  et le fameux **Graal** (voir §7).

---

## 7. Le Graal — Astrée, Héritière des braises

Vainquez le **Dragon des cendres** (chapitre 12) **en Enfer+** : +50 ◆ et **SS
exclusive** (Aura orange, rang SS), **rééquilibrée** : 2 650 ATK · 14 500 PV,
**passif Héritière des braises (dégâts +18 % et jauge de départ +20 %)** et
Ultime héritage des braises (+8 % dégâts/tour, renvoie 35 % des ripostes, soigne
15 % des dégâts infligés). La pierre angulaire des
compétiteurs — affichée dans la Salle des trophées.

---

## 8. Systèmes connexes

- **Collection** (Astéria) : tout le roster, héros manquants grisés ; paliers de
  25/50/75/100 % → +50/+100/+200/+500 ◆ ; touchez un héros → fiche détaillée.
- **App Personnages** : fiche de chaque héros (stats réelles, compétence, passif,
  éveils, talents, doublons, coût d'évolution suivante, comment invoquer les absents).
- **Missions quotidiennes** : 3 missions par jour réel (cartes jouées, invocations,
  victoires, soins, étages Infini, boss d'histoire) — réclamation dans l'onglet Quêtes.
- **Salle des trophées** : bannières, records des boss par difficulté (Enfer+
  distingué), record d'Infini, statut du Graal.

---

## 9. Stratégies éclairées

1. **Début** : quêtes Facile/Normal pour l'Éclat, portail Soigneur tôt (un
   Soigneur change tout en Difficile+).
2. **Pity** : gardez 30 × 5 = 150 ◆ de côté si vous videz un portail spécifique ;
   sur la bannière des héros, le compteur affiche votre pity (SSR garanti à 50).
3. **Équipe équilibrée** : 1 Soigneur + 1 Défenseur + 1 DPS/Tueur couvre presque tout ;
   pour les Raid : Tueur de boss + Soigneur + Héros.
4. **Butin** : n'oubliez pas les Cristaux — la Difficile quotidienne (1 Cristal)
   est la manière régulière de faire monter vos reliques au rang SR.
5. **Bonus d'ensemble** : 4 reliques forgées ET équipées = Trinité (+4 % dégâts,
   +10 jauge) même en rang N : équipez-les toutes d'abord, améliorez ensuite.
   Astuce : équipez les 5 reliques dès le rang N (Pacte + Trinité actifs :
   +8 % dégâts et +10 jauge), déplacez-les avec la prévisualisation — Lame +
   Exécution SSR sur votre meilleur DPS, Écaille sur le Défenseur, Étendard sur
   l'ouvreur (éveil ★ lui aussi), Anneau/Orbe sur vos dégâts.
7. **Éveil IV** : les matériaux de classe tombent un peu partout — gardez les
   doublons SSR pour le recyclage (+8) plutôt que de les laisser dormir.
6. **Enfer+** : équipe ★★★ + reliques SR est un vrai minimum ; gardez des Élixirs
   de re-change (Échec = phase perdue).

---

## 10. Technique

- 100 % HTML/CSS/JS vanilla, aucune dépendance runtime.
- Sauvegarde locale (`phoneos:*` dans localStorage) : Astéria, Histoire, Raid,
  missions, meilleur étage, Réglages.
- Tests : `node test/smoke.test.js` (192 vérifications) et
  `node test/stress.test.js` — voir le README.
- Données partagées pour les apps : `OS.asteriaData`.
