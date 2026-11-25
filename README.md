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
| Snake | Jeu d'arcade : grille 15×15, record sauvegardé, clavier + croix directionnelle |
| Épopée | Gacha (invocations R/SR/SSR, quartz) + combat au tour par tour façon FGO : cartes Brut/Arcane/Rapide, jauge d'Ultime, quêtes à 3 difficultés, 88 personnages fictifs répartis en 6 classes (Chevalier, Berserker, Mage, Archer, Rôdeur, Héros — libération inspirée des archétypes manga, tous 100 % originaux), montée en niveau par doublons (+8 % ATK/PV par copie, plafond +96 %), 5 archétypes d'ennemis (Brute, Assassin, Sorcier, Capitaine, Golem), 14 compétences uniques sur les SSR (renvoi, double frappe, bouclier, malédiction, brûlure…), Mode Infini (ennemis +16 %/étage, récompense au record, sauvegarde du meilleur étage), **Mode Histoire** (récit complet en 12 chapitres et 3 actes : dialogues typographiés machine à écrire avec les héros du roster, scènes SVG procédurales par chapitre, 5 boss de récit intégrés au fil de l'histoire dont le « Dragon des cendres » en final (42 000 PV, +40 ◆), choix narratifs accordant 6 bénédictions persistantes (+dégâts, Ultime avancée, PV de boss réduits…), boutons Continuer/Réessayer après chaque boss, **5 difficultés de boss (Facile, Moyen, Difficile, Impossible, Enfer — PV ×0,55 à ×3,2, ATK ×0,6 à ×2,4, récompenses ×0,5 à ×4, choix persisté)**, **Bannières de gloire** (une bannière SVG par niveau : battez les 5 boss à chaque difficulté pour la débloquer, +25 ◆ par bannière, étagère dans l'onglet Histoire), **Enfer+** (débloqué avec la bannière Enfer : boss ×4,2 PV / ×3 ATK / ×6 ◆, chacun doté d'une compétence unique — Chasse en meute, Massue écrasante, Siphon d'âmes, Oriflamme maudite, Souffle de cendres), +8 ◆ par chapitre, progression et musique on/off persistées, effets sonores et musique chiptune Web Audio sur tout le jeu) |
| 2048 | Puzzle de fusion : tuiles colorées, record sauvegardé, clavier + croix directionnelle |
| Calc | Calculatrice avec parenthèses, aperçu du résultat en direct |
| Téléphone | Clavier téléphonique, appel simulé avec chrono d'appel |
| Messages | Conversations persistées, réponses automatiques simulées |
| Horloge | Horloge temps réel + chronomètre avec tours |
| Notes | Prise de notes persistée (localStorage) |
| Photos | Galerie de démonstration avec visionneuse plein écran |
| Réglages | Mode avion, luminosité, volume, chargeur, réinitialisation |

## Structure

```
index.html          Point d'entrée
css/styles.css      Châssis du téléphone + styles système et apps
js/os.js            Noyau : couches d'affichage, cycle de vie des apps,
                    notifications, état système, persistance
js/sfx.js           Moteur audio Web Audio (sfx synthétisés + musique chiptune)
js/svgart.js        Générateur d'illustrations SVG procédurales (scènes du Mode Histoire)
js/main.js          Initialisation
js/apps/*.js        Applications (registerApp)
test/smoke.test.js  Test de fumée (jsdom installé séparément)
```

## Lancer

```bash
# Au choix :
xdg-open index.html          # ou double-clic sur index.html
python3 -m http.server       # puis http://localhost:8000
```

## Tester

Le test de fumée simule boot, déverrouillage, ouverture des 10 apps, calcul, partie de quête jouée (3 cartes),
Mode Infini, Mode Histoire (chapitre joué, progression, boss dragon) et multitâche via jsdom :

```bash
npm install jsdom   # uniquement pour le test
node test/smoke.test.js
node test/stress.test.js   # simulation de joueur : batailles aléatoires, ultimes, boss
```

```bash
npm install jsdom   # uniquement pour le test
node test/smoke.test.js
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
