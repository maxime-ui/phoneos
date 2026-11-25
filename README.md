# Astéria

RPG gacha complet en page web, 100 % HTML/CSS/JS vanilla : tout l'univers
s'affiche directement dans le navigateur, avec un bouton **⛶ Plein écran**
dans la barre supérieure.
Aucune dépendance, aucun back-end : ouvrez `index.html` dans votre navigateur.

📖 **Guide complet du jeu** : [GUIDE.md](GUIDE.md) — tout y est expliqué (OS, combat, héros, reliques, raid, histoire, stratégies).

## Applications incluses

| App | Fonctions |
|---|---|
| Astéria | Gacha + combat au tour par tour façon FGO + Mode Histoire + Raid — détail ci-dessous |
| Personnages | Fiches détaillées des 154 héros (liste complète, non possédés grisés), accessibles depuis la Collection : classe et bonus, cartes de combat, stats réelles (doublons, évolutions, reliques incluses), compétence, **passif**, éveils et talents acquis, coût de la prochaine évolution, indice d'obtention pour les héros non invoqués (Graal → Enfer+) |
| Trophées | Salle des trophées : étagère des 8 bannières (débloquées/scellées), records des 8 boss (meilleur niveau vaincu, **Enfer+ distingué d'Enfer** avec mise en avant dorée), record du Mode Infini, statut du **Graal** (Astrée, Héritière des braises, SS exclusive débloquée en battant le Dragon des cendres en Enfer+) |
| Réglages | **Vitesse du jeu (Lent/Normal/Rapide — dialogues + musique)**, **vitesse des dialogues du Mode Histoire (Instantané/Lent/Normal/Rapide, indépendante du jeu)**, **mode daltonien (repères visuels en plus des couleurs : badges de rareté, symboles sur les cartes de combat, repères PV)**, **son du jeu on/off**, **musique de fond on/off (une mélodie différente par menu : Astéria, Personnages, Trophées, Réglages)**, **notifications système on/off**, volume, réinitialisation (purge complète des données) |

La barre supérieure donne accès aux 4 sections (**Astéria**, Personnages,
Trophées, Réglages), au **sélecteur de difficulté du Mode Histoire** (chaîne de difficultés : change la difficulté en un clic, chaque palier débloqué seulement après que toute l'histoire a été bouclée au palier précédent) et au
**plein écran** (bouton ⛶ ou raccourci clavier **F**).
Raccourcis clavier : **1–4** pour changer d'app, **F** plein écran, **Échap** retour.

### Astéria en détail

**Invocations**

- Bannière des héros (3 ◆ l'unité, 30 ◆ pour ×10) : 5 % SSR · 20 % SR · 75 % R, **SSR garanti à la 50ᵉ invocation (pity affichée en direct, remise à zéro à chaque SSR)**
- **11 portails de classe** (5 ◆/invocation, pool restreint à la classe **— Invocateur et Valkyrie inclus** ; **pity SSR garanti à 30 une seule fois, puis à 50 définitivement** — reset à chaque SSR, compteur persisté)
- Week-end des invocateurs : taux SSR doublé (détection sur la date réelle)

**Roster**

- **154 personnages (72 R · 46 SR · 35 SSR · 1 SS) en 11 classes**, chacun avec son **visuel unique** (portrait SVG procédural : palette, coiffure, arme et emblème propres au héros, grisés tant qu'ils ne sont pas possédés) : Chevalier, Berserker, Mage, Archer, Rôdeur, Héros + **Soigneur** (soigne l'allié le plus blessé), **Défenseur** (réduit les dégâts de l'équipe), **Tueur de boss** (+30/+45 % dégâts, attire les ripostes), **Invocateur** (une ombre frappe en plus à chaque carte), **Valkyrie** (soigne l'allié le plus blessé après chaque carte) — archétypes 100 % originaux
- **25 compétences uniques** (à la carte, lors de l'Ultime, y compris Invocateur et Valkyrie) + **60 passifs nommés actifs en combat** (renvoi, exécution, soin, jauge, critique, esquive, PV max, ATK d'équipe…) et **statistiques de classe à l'éveil** (chaque classe a ses forces : PV en plus pour les Chevaliers, ATK pour les Mages…)
- Montée en niveau par doublons (+8 %/copie, plafond +96 %)
- **Évolutions** (Forge dans l'onglet Équipe) : ★→★★★★, +10 % ATK/PV par rang, **éveils par rang** (Éveil I jauge de départ, Éveil II dégâts + talent de classe, Éveil III talent + second talent de classe — 2 talents empilables, 20 talents de classe, **Éveil IV** payé avec un **matériau de classe**), **silhouettes évoluées** (aura, halo, couronne d'étoiles dorées, y compris dans les scènes)
- **19 matières** : 8 classiques + **11 matériaux propres à chaque classe** (Insigne de Chevalier, Croc de Berserker, Rune de Mage, Plume d'Archer, Fleur de Rôdeur, Étoile du Héros, Baume de Soigneur, Rivet de Défenseur, Lame du Tueur, Cendre d'Invocateur, Plume de Valkyrie) — droppés en quête, Infini, Raid et Histoire selon la difficulté, et **les doublons de héros se recyclent en matériau de leur classe** (2/4/8 selon la rareté R/SR/SSR) ; matières classiques : Éclat d'acier (quêtes), Cœur de braise (Infini), Larme de la nuit (boss d'histoire), Couronne d'aube (Difficile→Enfer+), Sceau du dragon (Enfer+), Élixir de raid (Difficile, Infini tous les 5 étages, Enfer/Enfer+), **Poussière de relique** (toutes les victoires ordinaires) et **Cristal de relique** (boss hauts niveaux, phases du raid, étages multiples de 5)
- **Reliquaire du raid v4** : **8 reliques** — Lame du Raid (ATK), Écaille du Dragon (PV), Étendard des trois phases (jauge d'Ultime), **Anneau des serments (critique)**, **Orbe des braises (dégâts)**, **Creuset des serments (soins)**, **Carcan des origines (esquive)** et **Égide de Hautefeuille (renvoi)** — **forgées puis équipées sur le héros de votre choix** (sélecteur par relique dans l'onglet Équipe), à **rangs progressifs N → R → SR → SSR** : stat principale recalibrée et croissante pour le héros porteur (ATK/PV +14 → 38 %, jauge +15 → 26 %, critique/dégâts +9 → 23 %, soins +10 → 30 %, esquive +8 → 24 %, renvoi +10 → 27 %), **sous-stats fixes débloquées rang après rang** et **prévisualisation exacte dans chaque sélecteur** (ATK/PV/bonus futurs du héros avant d'équiper), **améliorables avec Poussières (+ Cristaux)** droppées partout en jeu, et **4 bonus d'ensemble passifs** (Pacte du trio à 2 reliques, Trinité du dragon à 4, Harmonie parfaite à 4 en rang Épique+, Pacte d'ombre à 2 en rang Épique+ — comptées seulement une fois équipées)

**Modes**

- **Quêtes** à 3 difficultés, **Mode Infini** (+18 % PV/étage, +9 % ATQ, record sauvegardé)
- **Mode Histoire** : **24 chapitres en 4 actes + un épilogue** (« Les trois qui restaient debout » — l'origine des reliques et du serment), dialogues machine à écrire (vitesse réglable, option Instantané), scènes SVG procédurales avec votre équipe réelle, 11 boss de récit (dont le **Général des cendres**, la **Vouivre des braises** et l'**Archonte des cendres**), choix narratifs + 6 bénédictions persistantes, **6 difficultés de boss (Facile → Enfer+) chaînées** (bouclez toute l'histoire en Facile pour débloquer Moyen, etc.), **gains de butin variables selon la difficulté**, Enfer+ avec compétences de boss élites, +8 ◆ par chapitre
- **Entraînement** : testez tous les héros — **même non possédés** — contre 3 mannequins d'intensité croissante (Bois, Fer, Boss simulé) ; choisissez d'abord un héros dans la liste, il est affiché en haut, puis lancez le duel face aux adversaires **toujours visibles en haut de la page** ; le combat se déroule dans l'onglet lui-même ; aucun gain, aucune perte
- **Bannières de gloire** : 8 bannières à +25 ◆ chacune, **notification système au déblocage**
- **Raid hebdomadaire** : 3 phases enchaînées (Gardien de la trempe, Commandant du feu, Cœur du dragon), 1 Élixir pour entrer, équipe restaurée entre les phases, 40 ◆ sur victoire finale, **coffre hebdomadaire** réinitialisé chaque semaine, **classement hebdo** contre 7 rivaux simulés avec **bonus de rang** au coffre (+60/+40/+20 ◆)
- **Interface corrigée** : toutes les pages longues (Collection, Entraînement, Équipe, Personnages…) défilent désormais — la zone de contenu est bornée sous la barre d'apps et scrolle dans son propre volet
- **Missions quotidiennes** : 3 missions tirées au sort chaque jour réel (cartes, invocations, victoires, soins, étages Infini, boss d'histoire), récompenses ◆ réclamables
- **Événements de week-end** : Week-end de fortune (récompenses ×2), Week-end des invocateurs (taux SSR doublé)
- **17 archétypes d'ennemis (22 ennemis nommés) répartis en 6 classes ennemies** (Humain, Arcaniste, Élémentaire, Mort-vivant, Spectre, Bestial) : Oracle (se régénère), Muraille (très résistante), Invocateur (frappe d'ombre), **Fantassin** (double frappe), **Nécromant** (drain de vie), **Banshee** (drain de jauge), **Sanguinaire** (frappe le plus blessé), **Colosse de givre**, **Drakônide** (vol de vie), **Faucheur** (exécution des blessés), **Gardien des runes** (bouclier), **Cultiste** (chant du retour), élites (Voile d'ombre, Chasse en meute, Siphon d'âmes…)
- Musique chiptune **par menu** (Astéria, Personnages, Trophées, Réglages — 4 mélodies distinctes) et effets sonores Web Audio sur tout le jeu
- **Équilibrage v4** : 21 nouveaux héros et 8 nouvelles reliques — mais surtout : **ultimes ennemies** (chaque archétype a sa propre surprise au bout de X tours) et **élans de classe pour vos héros** (tous les 7 tours, le plus fort de votre équipe réagit selon sa classe) ; ennemis réévalués une nouvelle fois (17 archétypes / 22 noms / 6 classes), stats de classe par héros ; **Graal (SS) rééquilibré** : 2 600 ATK · 15 300 PV · passif dégâts +16 % et jauge de départ +22 % · renvoi 32 % · soin 18 % des dégâts ; bosses de l'histoire et mannequins renforcés ; passifs de tous les nouveaux héros écrits et actifs en combat

**Collection**

- Tous les héros affichés, non possédés grisés, jauge de complétion
- Récompenses à 25/50/75/100 % : +50/+100/+200/+500 ◆ réclamables
- Touchez un héros pour ouvrir sa fiche détaillée dans l'**app Personnages**

## Structure

```
index.html          Point d'entrée
GUIDE.md            Guide complet du jeu (10 sections)
css/styles.css      Barre supérieure de navigation + styles système et apps
js/os.js            Noyau : navigation entre apps, notifications (désactivables),
plein écran, persistance
js/sfx.js           Moteur audio Web Audio (sfx synthétisés + musique chiptune par menu, muet configurable)
js/svgart.js        Générateur d'illustrations SVG procédurales (scènes du Mode Histoire,
                    silhouettes évoluées : aura/halo/couronne d'étoiles)
js/main.js          Initialisation (applique le mode daltonien au démarrage)
js/apps/asteria.js   Gacha + combat + collection + mode histoire + raid + forge
js/apps/heroes.js   App Personnages (fiches détaillées des héros, lecture seule)
js/apps/settings.js Réglages (vitesse du jeu, vitesse des dialogues, daltonien, son, notifications)
js/apps/trophies.js Salle des trophées
test/smoke.test.js  Test de fumée (198 vérifications)
test/stress.test.js Simulation de joueur (tirages, ultimes, boss)
```

## Lancer

```bash
# Au choix :
xdg-open index.html          # ou double-clic sur index.html
python3 -m http.server       # puis http://localhost:8000
```

## Tester

Le test de fumée simule l'ouverture de la page (barre d'apps, Astéria ouverte par défaut, bouton plein écran, horloge),
les 4 apps, roster des 153 unités possédées (sur 154), écran Collection (Graal grisé,
récompense de complétion réclamée, clic → fiche détaillée dans l'app Personnages, retour, fiche du Graal non invoqué), réglages bonus (mode daltonien persisté,
vitesse des dialogues réglée sur Instantané), portail de classe avec pity, **pity de la bannière des héros à 50 invocations (SSR garanti, remise à zéro)**, missions quotidiennes (affichage, réclamation, progression en combat), quête jouée avec équipe 100 % Soigneurs (soin vérifié),
Forge d'évolution (butin semé, évolution de Bron +10 %, étoiles ★, **éveil IV payé en Croc de Berserker**), **recyclage des doublons en matériau de classe** et chasse au butin (victoire facile → Éclat d'acier), Reliquaire v4 (**8 reliques forgées puis équipées, prévisualisation exacte ATK/PV/bonus par héros**, bonus d'ensemble Pacte/Trinité actifs + Harmonie parfaite vérifiée en 4 rangs Épique+, Écaille améliorée en rang R avec sous-stat, 19 matières),
Raid hebdomadaire (3 phases, coffre réclamé, −1 Élixir à l'entrée, silhouettes évoluées),
Mode Infini, **Entraînement (héros grisés testables, mannequins, aucun gain)**, Mode Histoire (**24 chapitres, 4 actes + épilogue**, chapitre joué, progression, boss dragon, **chaîne de difficultés Facile → Enfer+**, épilogue « Écho du premier dragon »), records de Trophées avec Enfer+ distingué, notifications, plein écran (bouton + raccourci F), sélecteur de difficulté et classement hebdo du raid, via jsdom :

```bash
npm install jsdom   # uniquement pour le test
node test/smoke.test.js    # 198 vérifications
node test/stress.test.js   # simulation de joueur : batailles aléatoires, ultimes, boss
```
