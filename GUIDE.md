# PhoneOS — Le guide complet

🌞 Bienvenue sur PhoneOS, un téléphone simulé dans votre navigateur, et son jeu
principal : **l'Épopée**, un gacha + RPG au tour par tour. Ce document explique
tout : l'OS, le combat, les héros, les évolutions, les reliques, le Raid, le
Mode Histoire et les stratégies. 100 % hors-ligne, aucune donnée ne quitte
votre navigateur.

---

## 1. Le téléphone

| Élément | Fonctionnement |
|---|---|
| Boot | Séquence animée à chaque allumage (bouton power) |
| Verrouillage | Code PIN **1234** par défaut — horloge et date réelles |
| Accueil | Grille d'apps (Épopée, Personnages, Réglages, Trophées) |
| Barre d'état | Heure réelle, batterie simulée (décharge lente + chargeur dans Réglages), mode avion |
| Multitâche | Apps récentes, fermeture individuelle ou globale |
| Notifications | Empilées, désactivables dans Réglages |

**Réglages utiles** : vitesse du jeu (Lent/Normal/Rapide), vitesse des
dialogues de l'Histoire (avec *Instantané*), mode daltonien (repères visuels),
son on/off, volume, notifications.

---

## 2. L'Épopée — vue d'ensemble

L'app **Épopée** contient 4 onglets : **Invoquer**, **Équipe**, **Quêtes**,
**Collection** ; le Mode Histoire et le Raid en font partie (voyez §6/§7).

### 2.1 Le quartz (◆)

Monnaie unique. On en gagne en combattant (victoires, bosses, étages,
chapitres), via les missions quotidiennes, le coffre du raid, les bannières et
les paliers de Collection. On le dépense en invocations.

### 2.2 Les invocations

| Mode | Prix | Remarque |
|---|---|---|
| Bannière des héros ×1 / ×10 | 3 ◆ / 30 ◆ | Toutes classes : 5 % SSR · 20 % SR · 75 % R |
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
| R (gris) | 75 % des tirages | 58 |
| SR (bleu) | 20 % | 32 |
| SSR (doré) | 5 % | 22 — chaque SSR a un **passif unique** |
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

- +10 % ATK/PV par rang, cumulés aux doublons.
- **20 talents de classe** au total — deux par classe, empilables.
- La silhouette du héros évolue : aura (★), halo (★★), couronne d'étoiles
  dorées (★★★) — visible en combat ET dans les scènes d'histoire.

### 3.5 Les 6 matières de butin (+ 2 items de reliques)

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

Dans l'onglet **Équipe**, après la Forge. Trois reliques **d'équipe** (elles
touchent tous vos héros) : Lame du Raid, Écaille du Dragon, Étendard des trois
phases.

### 4.1 Forger et améliorer

1. **Forger** (rang **N**) avec les matières de raid : la relique devient
   active et apporte sa **stat principale** ;
2. **Améliorer** avec Poussières (+ Cristaux aux rangs hauts) pour monter de
   rang : **N → R → SR → SSR (Légendaire)** ;
3. Chaque rang débloque **une sous-stat supplémentaire** — les sous-stats sont
   **fixées à l'avance** (zéro aléatoire) : vous savez exactement ce que vous
   achetez.

| Rang | Lame du Raid | Écaille du Dragon | Étendard des trois phases |
|---|---|---|---|
| N | ATK d'équipe +4 % | PV max +4 % | Jauge de départ +15 % |
| R | +8 % **· Critique +3 %** | +8 % **· Soins +4 %** | +18 % **· ATK d'équipe +3 %** |
| SR | +12 % · Crit +3 % **· Renvoi +5 %** | +12 % · Soins +4 % **· Esquive +4 %** | +21 % · ATK +3 % **· Ultime/carte +2 %** |
| SSR | +16 % · Crit +3 % · Renvoi +5 % **· Exécution +8 %** | +16 % · Soins +4 % · Esquive +4 % **· PV max +6 %** | +24 % · ATK +3 % · Ultime/carte +2 % **· Croissance +2 %/tour** |

Coûts d'amélioration : N→R **10 Poussières** · R→SR **20 Poussières + 5 Cristaux** ·
SR→SSR **40 Poussières + 12 Cristaux**.
Un vieux « +8 % » des saves antérieures devient automatiquement un rang N (+4 %
stat principale) : améliorez pour aller au-delà de l'ancien bonus.

### 4.2 Bonus d'ensemble (passifs supplémentaires)

| Ensemble | Condition | Effet |
|---|---|---|
| **Pacte du trio** | 2 reliques forgées | Dégâts +4 % |
| **Trinité du dragon** | 3 reliques forgées | Dégâts +4 % et jauge de départ +10 % |
| **Harmonie parfaite** | 3 reliques en rang Épique (SR) ou + | Dégâts +8 % |

Le boost maximal : 8 %→16 % ATK, 4 %→14 % PV/via sous-stats, jauges,
critique, renvoi, exécution, soins… soit environ **+30 % de puissance
d'équipe** à tout maximiser.

---

## 5. Les modes de combat

### 5.1 Quêtes (1er onglet de combat)

| Difficulté | Ennemi (hp/atk) | Butin |
|---|---|---|
| Facile | 7 000 / 780 | +1 Éclat, +1 Poussière |
| Normal | 15 000 / 1 330 | +2 Éclats (parfois +1), +2 Poussières |
| Difficile | 28 000 / 2 050 | +3 Éclats, Couronne, Élixir, **Cristal** |

### 5.2 Mode Infini

Ennemis sans fin, +18 % de stats par étage (+9 % ATQ), record sauvegardé.
Butin : Cœur de braise + Poussière par étage ; **Élixir + Cristal tous les
5 étages**. Restauration de 25 % PV par étage.

### 5.3 Raid hebdomadaire

1 Élixir pour entrer, 3 phases enchaînées (Gardien de la trempe 66 000 PV →
Commandant du feu 100 000 PV → Cœur du dragon 155 000 PV), équipe restaurée
entre phases, +1 Cristal par phase franchie. Coffre hebdo en fonction des
phases vaincues (+30 ◆ × phases, matières, Poussières, Cristaux).

### 5.4 Récompenses des événements

Week-end réel : **fortune** (récompenses ×2) ou **invocateurs** (SSR ×2).
(En dehors des week-ends, aucun événement.)

---

## 6. Le Mode Histoire

- **12 chapitres en 3 actes**, dialogues frappés (vitesse réglable, option Instantané).
- **Choix narratifs** → **bénédictions** permanentes (+8 % dégâts, démarrage de jauge, etc.).
- **5 boss de récit** aux chapitres 2, 4, 7, 10, 12 ; **6 difficultés** : Facile,
  Moyen, Difficile, Impossible, Enfer, **Enfer+** (débloqué quand les 5 bannières
  sont gagnées).
- **Bannières de gloire** : 5 bannières à +25 ◆ chacune (notification système) ;
  chaque bannière demande les 5 boss battus à un palier de difficulté.
- **Enfer+** : ennemis ×4,2 PV / ×3 ATQ, **5 compétences élites** (Massue écrasante,
  Siphon d'âmes, Souffle de cendres, Oriflamme maudite…), +2 Élixirs, +2 Cristaux
  et le fameux **Graal** (voir §7).

---

## 7. Le Graal — Astrée, Héritière des braises

Vainquez le **Dragon des cendres** (chapitre 12) **en Enfer+** : +50 ◆ et **SS
exclusive** (Aura orange, rang SS). Ses talents : +8 % dégâts/tour, renvoie 35 %
des ripostes, soigne 15 % des dégâts infligés. La pierre angulaire des
compétiteurs — affichée dans la Salle des trophées.

---

## 8. Systèmes connexes

- **Collection** (Épopée) : tout le roster, héros manquants grisés ; paliers de
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
2. **Pity** : gardez 30 × 5 = 150 ◆ de côté si vous videz un portail spécifique.
3. **Équipe équilibrée** : 1 Soigneur + 1 Défenseur + 1 DPS/Tueur couvre presque tout ;
   pour les Raid : Tueur de boss + Soigneur + Héros.
4. **Butin** : n'oubliez pas les Cristaux — la Difficile quotidienne (1 Cristal)
   est la manière régulière de faire monter vos reliques au rang SR.
5. **Bonus d'ensemble** : 3 reliques forgées = Trinité (+4 % dégâts, +10 jauge)
   même en rang N : faites-les toutes d'abord, améliorez ensuite.
6. **Enfer+** : équipe ★★★ + reliques SR est un vrai minimum ; gardez des Élixirs
   de re-change (Échec = phase perdue).

---

## 10. Technique

- 100 % HTML/CSS/JS vanilla, aucune dépendance runtime.
- Sauvegarde locale (`phoneos:*` dans localStorage) : Épopée, Histoire, Raid,
  missions, meilleur étage, Réglages.
- Tests : `node test/smoke.test.js` (142 vérifications) et
  `node test/stress.test.js` — voir le README.
- Données partagées pour les apps : `OS.epopeeData`.
