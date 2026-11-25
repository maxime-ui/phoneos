# PhoneOS 1.0

Émulateur de téléphone complet dans le navigateur, 100 % HTML/CSS/JS vanilla.
Aucune dépendance, aucun back-end : ouvrez `index.html` dans votre navigateur.

## Fonctionnalités

- **Séquence de boot** animée avec barre de progression
- **Écran de verrouillage** avec code PIN (1234), horloge et date
- **Écran d'accueil** avec grille d'applications et dock
- **Barre d'état système** : heure réelle, batterie simulée (décharge lente), mode avion
- **Boutons physiques simulés** : power (éteindre/redémarrer), volume +/- avec retour visuel
- **Multitâche** : vue des applications récentes, fermeture individuelle ou globale
- **Notifications** empilées avec animation d'entrée/sortie
- **Barre de navigation** système : retour, accueil, multitâche

Applications incluses :

| App | Fonctions |
|---|---|
| Épopée | Gacha (invocations R/SR/SSR, quartz) + combat au tour par tour façon FGO : cartes Brut/Arcane/Rapide, jauge d'Ultime, quêtes à 3 difficultés, **113 personnages (112 + 1 SS exclusive) en 9 classes** (Chevalier, Berserker, Mage, Archer, Rôdeur, Héros + **Soigneur** (soigne l'allié le plus blessé au lieu d'attaquer), **Défenseur** (réduit les dégâts subis par toute l'équipe), **Tueur de boss** (+30/+45 % dégâts, attire les ripostes) — archétypes 100 % originaux), montée en niveau par doublons (+8 %/copie, plafond +96 %), **portails de classe** (9 portails, pool restreint à la classe, 5 ◆/invocation, **pity SSR garanti à 30 par portail**, compteur persisté), **onglet Collection** (tous les héros affichés, non possédés grisés, jauge de complétion, récompenses à 25/50/75/100 % : +50/+100/+200/+500 ◆ réclamables), 22 compétences uniques (renvoi, exécution, garde-rapprochée, mur…), 5 archétypes d'ennemis, Mode Infini (+16 %/étage, record sauvegardé), **Mode Histoire** (12 chapitres / 3 actes, dialogues machine à écrire, scènes SVG procédurales, 5 boss de récit, choix narratifs + 6 bénédictions persistantes, **6 difficultés de boss (Facile → Enfer+)**, **Bannières de gloire** (+25 ◆ chacune, **notification système au déblocage**), Enfer+ avec 5 compétences de boss uniques, +8 ◆ par chapitre, effets sonores et musique chiptune Web Audio sur tout le jeu) |
| Trophées | Salle des trophées : étagère des 5 bannières (débloquées/scellées), records des 5 boss (meilleur niveau vaincu), record du Mode Infini, statut du **Graal** (Astrée, Héritière des braises, SS exclusive débloquée en battant le Dragon des cendres en Enfer+) |
| Réglages | Mode avion, luminosité, **vitesse du jeu (Lent/Normal/Rapide — dialogues + musique)**, **son du jeu on/off**, **notifications système on/off**, volume, chargeur, réinitialisation |

## Structure

```
index.html          Point d'entrée
css/styles.css      Châssis du téléphone + styles système et apps
js/os.js            Noyau : couches d'affichage, cycle de vie des apps,
                    notifications (désactivables), état système, persistance
js/sfx.js           Moteur audio Web Audio (sfx synthétisés + musique chiptune, muet configurable)
js/svgart.js        Générateur d'illustrations SVG procédurales (scènes du Mode Histoire)
js/main.js          Initialisation
js/apps/epopee.js   Gacha + combat + collection + mode histoire
js/apps/settings.js Réglages (vitesse, son, notifications)
js/apps/trophies.js Salle des trophées
test/smoke.test.js  Test de fumée (jsdom installé séparément)
```

## Lancer

```bash
# Au choix :
xdg-open index.html          # ou double-clic sur index.html
python3 -m http.server       # puis http://localhost:8000
```

## Tester

Le test de fumée simule boot, déverrouillage, ouverture des 3 apps (Épopée, Réglages, Trophées), roster des 112 unités possédées, écran Collection (Graal grisé,
récompense de complétion réclamée), portail de classe avec pity, quête jouée avec équipe 100 % Soigneurs (soin vérifié),
Mode Infini, Mode Histoire (chapitre joué, progression, boss dragon, Enfer+), Salle des trophées et multitâche via jsdom :

```bash
npm install jsdom   # uniquement pour le test
node test/smoke.test.js
node test/stress.test.js   # simulation de joueur : batailles aléatoires, ultimes, boss
```

## Ajouter une application

Dans `js/apps/` :

```js
OS.registerApp({
  id: "monapp",
  name: "MonApp",
  icon: "🚀",           // emoji ou caractère
  color: "#5b6b94",     // couleur d'icône
  dock: false,          // true pour l'épingler dans le dock
  render(body) { /* construire l'UI dans body */ },
  onBack() {},          // optionnel : interception du bouton retour
});
```

Puis référencez le fichier dans `index.html` (avant `js/main.js`).
