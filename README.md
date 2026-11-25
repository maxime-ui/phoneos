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
| Épopée | Gacha (invocations R/SR/SSR, quartz) + combat au tour par tour façon FGO : cartes Brut/Arcane/Rapide, jauge d'Ultime, quêtes à 3 difficultés, personnages 100 % fictifs |
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
multitâche, notification et cycle power off/on via jsdom :

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
