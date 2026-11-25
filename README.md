# Astéria

RPG gacha complet en page web, construit en HTML/CSS/JavaScript vanilla : tout l'univers
s'affiche directement dans le navigateur, avec un bouton **⛶ Plein écran**
dans la barre supérieure.
Aucune dépendance à installer pour jouer et aucun back-end. La suite de tests utilise
`jsdom` comme dépendance de développement (Node.js 20 recommandé).

📖 **Guide complet du jeu** : [GUIDE.md](GUIDE.md) — tout y est expliqué (OS, combat, héros, reliques, raid, histoire, stratégies).

## Applications incluses

| App | Fonctions |
|---|---|
| Astéria | Gacha + combat au tour par tour façon FGO + Mode Histoire + Raid — détail ci-dessous |
| Personnages | Fiches détaillées des 133 héros (liste complète, non possédés grisés), accessibles depuis la Collection : classe et bonus, cartes de combat, stats réelles (doublons, évolutions, reliques incluses), compétence, **passif**, éveils et talents acquis, coût de la prochaine évolution, indice d'obtention pour les héros non invoqués (Graal → Enfer+) |
| Trophées | Salle des trophées : étagère des 5 bannières (débloquées/scellées), records des 5 boss (meilleur niveau vaincu, **Enfer+ distingué d'Enfer** avec mise en avant dorée), record du Mode Infini, statut du **Graal** (Astrée, Héritière des braises, SS exclusive débloquée en battant le Dragon des cendres en Enfer+) |
| Réglages | **Vitesse du jeu (Lent/Normal/Rapide — dialogues + musique)**, **vitesse des dialogues du Mode Histoire (Instantané/Lent/Normal/Rapide, indépendante du jeu)**, **mode daltonien (repères visuels en plus des couleurs : badges de rareté, symboles sur les cartes de combat, repères PV)**, **son du jeu on/off**, **notifications système on/off**, volume, réinitialisation (purge complète des données) |

La barre supérieure donne accès aux 4 sections (**Astéria**, Personnages,
Trophées, Réglages), au **sélecteur de difficulté du Mode Histoire** (chaîne de difficultés : change la difficulté en un clic, chaque palier débloqué seulement après que toute l'histoire a été bouclée au palier précédent) et au
**plein écran** (bouton ⛶ ou raccourci clavier **F**).

### Astéria en détail

**Invocations**

- Bannière des héros (3 ◆ l'unité, 30 ◆ pour ×10) : 5 % SSR · 20 % SR · 75 % R, **SSR garanti à la 50ᵉ invocation (pity affichée en direct, remise à zéro à chaque SSR)**
- **9 portails de classe** (5 ◆/invocation, pool restreint à la classe, **pity SSR garanti à 30**, compteur persisté)
- Week-end des invocateurs : taux SSR doublé (détection sur la date réelle)

**Roster**

- **133 personnages (64 R · 38 SR · 30 SSR · 1 SS) en 9 classes** : Chevalier, Berserker, Mage, Archer, Rôdeur, Héros + **Soigneur** (soigne l'allié le plus blessé), **Défenseur** (réduit les dégâts de l'équipe), **Tueur de boss** (+30/+45 % dégâts, attire les ripostes) — archétypes 100 % originaux
- **23 compétences uniques** (à la carte, lors de l'Ultime) + **46 passifs nommés actifs en combat** (renvoi, exécution, soin, jauge, critique, esquive, PV max, ATK d'équipe…)
- Montée en niveau par doublons (+8 %/copie, plafond +96 %)
- **Évolutions** (Forge dans l'onglet Équipe) : ★→★★★★, +10 % ATK/PV par rang, **éveils par rang** (Éveil I jauge de départ, Éveil II dégâts + talent de classe, Éveil III talent + second talent de classe — 2 talents empilables, 20 talents de classe, **Éveil IV** payé avec un **matériau de classe**), **silhouettes évoluées** (aura, halo, couronne d'étoiles dorées, y compris dans les scènes)
- **17 matières** : 8 classiques + **9 matériaux propres à chaque classe** (Insigne de Chevalier, Croc de Berserker, Rune de Mage, Plume d'Archer, Fleur de Rôdeur, Étoile du Héros, Baume de Soigneur, Rivet de Défenseur, Lame du Tueur) — droppés en quête, Infini, Raid et Histoire selon la difficulté, et **les doublons de héros se recyclent en matériau de leur classe** (2/4/8 selon la rareté R/SR/SSR) ; matières classiques : Éclat d'acier (quêtes), Cœur de braise (Infini), Larme de la nuit (boss d'histoire), Couronne d'aube (Difficile→Enfer+), Sceau du dragon (Enfer+), Élixir de raid (Difficile, Infini tous les 5 étages, Enfer/Enfer+), **Poussière de relique** (toutes les victoires ordinaires) et **Cristal de relique** (boss hauts niveaux, phases du raid, étages multiples de 5)
- **Reliquaire du raid v3** : **5 reliques** — Lame du Raid (ATK), Écaille du Dragon (PV), Étendard des trois phases (jauge d'Ultime), **Anneau des serments (critique)** et **Orbe des braises (dégâts)** — **forgées puis équipées sur le héros de votre choix** (sélecteur par relique dans l'onglet Équipe), à **rangs progressifs N → R → SR → SSR** : stat principale recalibrée et croissante pour le héros porteur (ATK/PV +12 → 36 %, jauge +15 → 24 %, critique/dégâts +8 → 22 %), **sous-stats fixes débloquées rang après rang** et **prévisualisation exacte dans chaque sélecteur** (ATK/PV/bonus futurs du héros avant d'équiper), **améliorables avec Poussières (+ Cristaux)** droppées partout en jeu, et **3 bonus d'ensemble passifs** (Pacte du trio à 2 reliques, Trinité du dragon à 4, Harmonie parfaite à 4 en rang Épique+ — comptées seulement une fois équipées)

**Modes**

- **Quêtes** à 3 difficultés, **Mode Infini** (+18 % PV/étage, +9 % ATQ, record sauvegardé)
- **Mode Histoire** : **18 chapitres en 4 actes + un épilogue** (« Les trois qui restaient debout » — l'origine des reliques et du serment), dialogues machine à écrire (vitesse réglable, option Instantané), scènes SVG procédurales avec votre équipe réelle, 6 boss de récit, choix narratifs + 6 bénédictions persistantes, **6 difficultés de boss (Facile → Enfer+) chaînées** (bouclez toute l'histoire en Facile pour débloquer Moyen, etc.), **gains de butin variables selon la difficulté**, Enfer+ avec compétences de boss élites, +8 ◆ par chapitre
- **Entraînement** : testez tous les héros — **même non possédés** — contre 3 mannequins d'intensité croissante (Bois, Fer, Boss simulé) ; aucun gain, aucune perte
- **Bannières de gloire** : +25 ◆ chacune, **notification système au déblocage**
- **Raid hebdomadaire** : 3 phases enchaînées (Gardien de la trempe, Commandant du feu, Cœur du dragon), 1 Élixir pour entrer, équipe restaurée entre les phases, 40 ◆ sur victoire finale, **coffre hebdomadaire** réinitialisé chaque semaine, **classement hebdo** contre 7 rivaux simulés avec **bonus de rang** au coffre (+60/+40/+20 ◆)
- **Missions quotidiennes** : 3 missions tirées au sort chaque jour réel (cartes, invocations, victoires, soins, étages Infini, boss d'histoire), récompenses ◆ réclamables
- **Événements de week-end** : Week-end de fortune (récompenses ×2), Week-end des invocateurs (taux SSR doublé)
- **13 archétypes d'ennemis (14 ennemis nommés)** : Oracle (se régénère), Muraille (très résistante), Invocateur (frappe d'ombre), **Fantassin** (double frappe), **Nécromant** (drain de vie), **Banshee** (drain de jauge), **Sanguinaire** (frappe le le plus blessé), **Colosse de givre**, élites (Voile d'ombre, Chasse en meute, Siphon d'âmes…)
- Musique chiptune et effets sonores Web Audio sur tout le jeu
- **Équilibrage v3** : reliques recalibrées, ennemis réévalués et plus nombreux (13 archétypes / 14 noms), héros et passifs réévalués, **Graal (SS) rééquilibré** (2 650 ATK · 14 500 PV · passif dégâts +18 % et jauge de départ +20 %), ennemis up (quêtes Normal/Difficile ~+7/8 %, Infini et Raid ~+10 %)

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
js/sfx.js           Moteur audio Web Audio (sfx synthétisés + musique chiptune, muet configurable)
js/svgart.js        Générateur d'illustrations SVG procédurales (scènes du Mode Histoire,
                    silhouettes évoluées : aura/halo/couronne d'étoiles)
js/main.js          Initialisation (applique le mode daltonien au démarrage)
js/apps/asteria.js   Gacha + combat + collection + mode histoire + raid + forge
js/apps/heroes.js   App Personnages (fiches détaillées des héros, lecture seule)
js/apps/settings.js Réglages (vitesse du jeu, vitesse des dialogues, daltonien, son, notifications)
js/apps/trophies.js Salle des trophées
test/smoke.test.js  Test de fumée automatisé (navigation, sauvegardes, combats, progression, assets, volume)
```

## Lancer

```bash
# Pour jouer :
xdg-open index.html          # ou double-clic sur index.html
python3 -m http.server       # puis http://localhost:8000

# Pour lancer les contrôles (Node.js 20+) :
npm install
npm run check:syntax
npm test
```

## Tester

Le test de fumée (`npm test`) simule l'ouverture de la page (barre d'apps, Astéria ouverte par défaut, bouton plein écran, horloge),
les 4 apps, roster des 132 unités possédées (sur 133), écran Collection (Graal grisé,
récompense de complétion réclamée, clic → fiche détaillée dans l'app Personnages, retour, fiche du Graal non invoqué), réglages bonus (mode daltonien persisté,
vitesse des dialogues réglée sur Instantané), portail de classe avec pity, **pity de la bannière des héros à 50 invocations (SSR garanti, remise à zéro)**, missions quotidiennes (affichage, réclamation, progression en combat), quête jouée avec équipe 100 % Soigneurs (soin vérifié),
Forge d'évolution (butin semé, évolution de Bron +10 %, étoiles ★, **éveil IV payé en Croc de Berserker**), **recyclage des doublons en matériau de classe** et chasse au butin (victoire facile → Éclat d'acier), Reliquaire v3 (**5 reliques forgées puis équipées, prévisualisation exacte ATK/PV/bonus par héros**, bonus d'ensemble Pacte/Trinité actifs + Harmonie parfaite vérifiée en 4 rangs Épique+, Écaille améliorée en rang R avec sous-stat, 17 matières),
Raid hebdomadaire (3 phases, coffre réclamé, −1 Élixir à l'entrée, silhouettes évoluées),
Mode Infini, **Entraînement (héros grisés testables, mannequins, aucun gain)**, Mode Histoire (**18 chapitres, 4 actes + épilogue**, chapitre joué, progression, boss dragon, **chaîne de difficultés Facile → Enfer+**, épilogue « Écho du premier dragon »), records de Trophées avec Enfer+ distingué, notifications, plein écran (bouton + raccourci F), sélecteur de difficulté et classement hebdo du raid, via jsdom :

```bash
npm install jsdom   # uniquement pour le test
npm run check:syntax      # vérification syntaxique des scripts
npm test                   # test de fumée jsdom
```
