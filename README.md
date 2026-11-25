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
| Personnages | Fiches détaillées des 113 héros (liste complète, non possédés grisés), accessibles depuis la Collection : classe et bonus, cartes de combat, stats réelles (doublons, évolutions, reliques incluses), compétence, **passif**, éveils et talents acquis, coût de la prochaine évolution, indice d'obtention pour les héros non invoqués (Graal → Enfer+) |
| Trophées | Salle des trophées : étagère des 5 bannières (débloquées/scellées), records des 5 boss (meilleur niveau vaincu, **Enfer+ distingué d'Enfer** avec mise en avant dorée), record du Mode Infini, statut du **Graal** (Astrée, Héritière des braises, SS exclusive débloquée en battant le Dragon des cendres en Enfer+) |
| Réglages | **Vitesse du jeu (Lent/Normal/Rapide — dialogues + musique)**, **vitesse des dialogues du Mode Histoire (Instantané/Lent/Normal/Rapide, indépendante du jeu)**, **mode daltonien (repères visuels en plus des couleurs : badges de rareté, symboles sur les cartes de combat, repères PV)**, **son du jeu on/off**, **notifications système on/off**, volume, réinitialisation (purge complète des données) |

La barre supérieure donne accès aux 4 sections (**Astéria**, Personnages,
Trophées, Réglages) et au **plein écran** (bouton ⛶).

### Astéria en détail

**Invocations**

- Bannière des héros (3 ◆ l'unité, 30 ◆ pour ×10) : 5 % SSR · 20 % SR · 75 % R
- **9 portails de classe** (5 ◆/invocation, pool restreint à la classe, **pity SSR garanti à 30**, compteur persisté)
- Week-end des invocateurs : taux SSR doublé (détection sur la date réelle)

**Roster**

- **113 personnages (58 R · 32 SR · 22 SSR · 1 SS) en 9 classes** : Chevalier, Berserker, Mage, Archer, Rôdeur, Héros + **Soigneur** (soigne l'allié le plus blessé), **Défenseur** (réduit les dégâts de l'équipe), **Tueur de boss** (+30/+45 % dégâts, attire les ripostes) — archétypes 100 % originaux
- **23 compétences uniques** (à la carte, lors de l'Ultime) + **23 passifs nommés actifs en combat** (renvoi, exécution, soin, jauge, critique, esquive, PV max, ATK d'équipe…)
- Montée en niveau par doublons (+8 %/copie, plafond +96 %)
- **Évolutions** (Forge dans l'onglet Équipe) : ★→★★★, +10 % ATK/PV par rang, **éveils par rang** (Éveil I jauge de départ, Éveil II dégâts + talent de classe, Éveil III talent + second talent de classe — 2 talents empilables, 20 talents de classe), **silhouettes évoluées** (aura, halo, couronne d'étoiles dorées, y compris dans les scènes)
- **8 matières et items de butin** : Éclat d'acier (quêtes), Cœur de braise (Infini), Larme de la nuit (boss d'histoire), Couronne d'aube (Difficile→Enfer+), Sceau du dragon (Enfer+), Élixir de raid (Difficile, Infini tous les 5 étages, Enfer/Enfer+), **Poussière de relique** (toutes les victoires ordinaires) et **Cristal de relique** (boss hauts niveaux, phases du raid, étages multiples de 5)
- **Reliquaire du raid v2** : 3 reliques d'équipe à **rangs progressifs N → R → SR → SSR** — stat principale croissante (ATK d'équipe, PV max, jauge de départ) et **sous-stats fixes débloquées rang après rang** (critique, renvoi, exécution, soins, esquive, Ultime/carte, croissance/tour), **améliorables avec Poussières (+ Cristaux)** droppées partout en jeu, et **3 bonus d'ensemble passifs** (Pacte du trio +4 % dégâts, Trinité du dragon +4 % dégâts +10 jauge, Harmonie parfaite +8 % dégâts pour 3 reliques Épiques+)

**Modes**

- **Quêtes** à 3 difficultés, **Mode Infini** (+18 % PV/étage, +9 % ATQ, record sauvegardé)
- **Mode Histoire** : 12 chapitres / 3 actes, dialogues machine à écrire (vitesse réglable, option Instantané), scènes SVG procédurales avec votre équipe réelle, 5 boss de récit, choix narratifs + 6 bénédictions persistantes, **6 difficultés de boss (Facile → Enfer+)**, Enfer+ avec 5 compétences de boss élites, +8 ◆ par chapitre
- **Bannières de gloire** : +25 ◆ chacune, **notification système au déblocage**
- **Raid hebdomadaire** : 3 phases enchaînées (Gardien de la trempe, Commandant du feu, Cœur du dragon), 1 Élixir pour entrer, équipe restaurée entre les phases, 40 ◆ sur victoire finale, **coffre hebdomadaire** réinitialisé chaque semaine
- **Missions quotidiennes** : 3 missions tirées au sort chaque jour réel (cartes, invocations, victoires, soins, étages Infini, boss d'histoire), récompenses ◆ réclamables
- **Événements de week-end** : Week-end de fortune (récompenses ×2), Week-end des invocateurs (taux SSR doublé)
- 8 archétypes d'ennemis : **Oracle** (se régénère), **Muraille** (très résistante), **Invocateur** (frappe d'ombre)…
- Musique chiptune et effets sonores Web Audio sur tout le jeu
- **Équilibrage v2** : avec des reliques plus fortes, les ennemis montent — quêtes Normal/Difficile (~+7/8 %), Infini et Raid (~+10 %)

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
test/smoke.test.js  Test de fumée (140 vérifications)
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
les 4 apps, roster des 112 unités possédées, écran Collection (Graal grisé,
récompense de complétion réclamée, clic → fiche détaillée dans l'app Personnages, retour, fiche du Graal non invoqué), réglages bonus (mode daltonien persisté,
vitesse des dialogues réglée sur Instantané), portail de classe avec pity, missions quotidiennes (affichage, réclamation, progression en combat), quête jouée avec équipe 100 % Soigneurs (soin vérifié),
Forge d'évolution (butin semé, évolution de Bron +10 %, étoiles ★) et chasse au butin (victoire facile → Éclat d'acier), Reliquaire v2 (3 reliques forgées, bonus d'ensemble Pacte/Trinité actifs, Écaille améliorée en rang R avec sous-stat, 8 matières),
Raid hebdomadaire (3 phases, coffre réclamé, −1 Élixir à l'entrée, silhouettes évoluées),
Mode Infini, Mode Histoire (chapitre joué, progression, boss dragon, Enfer+), records de Trophées avec Enfer+ distingué, et notifications + plein écran, via jsdom :

```bash
npm install jsdom   # uniquement pour le test
node test/smoke.test.js    # 140 vérifications
node test/stress.test.js   # simulation de joueur : batailles aléatoires, ultimes, boss
```
