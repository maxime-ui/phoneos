# Astéria 2.0 — Phase 1

Cette branche prépare une nouvelle progression sans toucher aux sauvegardes historiques.

## Décisions

- Branche de travail : `asteria-2.0`.
- Sauvegarde principale v2 : `phoneos:asteria-v2`.
- Sauvegardes annexes : `phoneos:asteria-v2-story`, `phoneos:asteria-v2-daily`, `phoneos:asteria-v2-raid`.
- Record du mode infini : `phoneos:asteria-v2-infinite-best`.
- Schéma de la sauvegarde principale : `schemaVersion: 2`.
- Nouvelle partie : 30 quartz, Bron, Tilia et Nerys, équipe initiale [Bron, Tilia, Nerys].

## Protection des anciennes données

Le chargement v2 ne lit plus les clés historiques `asteria*` ni `epopee*` et ne lance plus leur migration automatique. Au premier lancement de cette version sur un navigateur, les anciennes clés de progression connues sont supprimées une seule fois ; les préférences générales du téléphone ne sont pas concernées.

Les paramètres généraux du système (son, affichage, daltonisme, vitesse) restent partagés avec le système existant.

## Fichiers modifiés

- `js/apps/asteria.js` : espace de sauvegarde v2 isolé et versionné.
- `test/smoke.test.js` : données de test et vérifications redirigées vers l'espace v2.

## Validation à effectuer

Depuis un environnement disposant de Node.js et de jsdom :

```bash
npm run check:syntax
npm test
```

La connexion GitHub permet de pousser le code, mais ne fournit pas à elle seule un environnement d'exécution local. Les tests ne sont donc pas déclarés réussis tant qu'ils n'ont pas été exécutés.


## Combat 2.0 — première couche tactique

- Télégraphie : chaque ennemi affiche une prochaine action annoncée avec son effet général.
- Garde d'équipe : une action parmi les trois actions du tour réduit de 35 % les dégâts directs reçus pendant la riposte ennemie.
- La garde est réinitialisée après la riposte ; elle ne se cumule pas.
- Les intentions sont recalculées au début du nouveau tour.
- Styles CSS dédiés pour rendre l'avertissement lisible sur petit écran.

## Nettoyage des anciennes sauvegardes

Au premier démarrage de cette version, une opération unique supprime les anciennes clés de progression Astéria/Épopée connues. Les préférences globales (son, affichage, accessibilité) ne sont pas touchées. Le nettoyage est marqué dans le stockage local pour ne pas se répéter.


## Combat 2.0 — rupture de posture

- Chaque dégât direct contribue à une jauge de rupture égale à 28 % des PV max de l'ennemi.
- Lorsque le seuil est atteint, la posture est rompue et la prochaine action ennemie est annulée.
- La brûlure continue de se résoudre pendant le tour interrompu.
- Une jauge et une alerte dédiées sont affichées pendant le combat.
- Le test de fumée vérifie la présence de l'intention, de la jauge et de l'action de garde.

## État de validation

Le workflow GitHub Actions `.github/workflows/asteria-quality.yml` est configuré pour les pushes sur `asteria-2.0`, les pull requests ciblant `vibe/phoneos-270620` et les déclenchements manuels. Il exécute le contrôle de syntaxe puis `npm test` sous Node.js 20. Un workflow configuré ne signifie pas qu’un passage est réussi : consulter l’onglet Actions et vérifier le commit exact avant de déclarer la branche validée.


## Ajustements de robustesse

- Réinitialisation de la jauge de rupture, de l'état déséquilibré et de la garde entre les phases du raid.
- Test de fumée : une ancienne sauvegarde est injectée avant le démarrage et son absence est vérifiée après le lancement v2.


## Combat 2.0 — affinités et réactions élémentaires

- Les trois familles de cartes portent désormais une signature élémentaire : Brut = Feu, Arcane = Arcane, Rapide = Vent.
- Chaque type d'ennemi possède une affinité fixe et affichée pendant le combat, afin de rendre la préparation lisible.
- Le cycle d'affinités Feu/Eau/Foudre/Nature/Terre applique +25 % sur une faiblesse et −20 % face à une résistance.
- Enchaîner deux éléments différents déclenche une réaction (+15 % sur la frappe qui déclenche la réaction).
- Arcane et Vent sont des éléments neutres dans le cycle : ils permettent de varier les cartes sans subir de pénalité.
- Le système expose ses données via `OS.asteriaData.elementInfo()` et les tests de fumée vérifient la cohérence du catalogue.

**Note d'équilibrage :** les cartes existantes n'utilisent actuellement que Feu, Arcane et Vent. Les autres éléments sont le socle des futures compétences, personnages et effets de terrain ; ils ne sont pas artificiellement attribués aux unités existantes.


## Combat 2.0 — synergies de composition

Trois synergies de classe sont actives tant que les deux classes requises sont vivantes :
- Mage + Archer : **Convergence arcanique**, +8 % de dégâts d'équipe.
- Chevalier + Soigneur : **Serment protecteur**, −10 % de dégâts reçus.
- Berserker + Rôdeur : **Traque coordonnée**, +6 % de dégâts d'équipe.

Les synergies se désactivent automatiquement si l'un des deux membres tombe K.O. Elles sont affichées dans l'interface du combat et s'appliquent en plus des passifs individuels.

## Direction artistique — premier pack intégré

- Six portraits vectoriels de classes sont ajoutés dans `assets/asteria/heroes/` : Chevalier, Mage, Archer, Berserker, Rôdeur et Héros.
- Six portraits de créatures et boss sont ajoutés dans `assets/asteria/enemies/`.
- Les cartes de héros de l'écran Équipe et des listes qui réutilisent `unitCard()` affichent maintenant le portrait correspondant à la classe.
- Le test de fumée vérifie la présence des douze fichiers SVG.
- Les illustrations sont des premières silhouettes vectorielles originales et légères, conçues pour être remplacées/enrichies progressivement par des artworks détaillés sans changer les chemins d'assets.

- Sept icônes élémentaires (Feu, Eau, Foudre, Nature, Terre, Arcane, Vent) sont disponibles dans `assets/asteria/elements/`.
- Un décor de combat crépusculaire est disponible dans `assets/asteria/scenes/` et sert de fond au cadre de scène.
- Les contrôles de présence des assets couvrent désormais héros, ennemis, boss, éléments et décor.

## Deuxième vague graphique — bestiaire et régions

- 13 portraits dédiés correspondent aux 13 archétypes de `ENEMY_TYPES` ; le portrait du type rencontré apparaît dans le panneau de combat.
- Trois paysages de région (forêt, terres embrasées, ruines) illustrent les entrées de chapitres de la carte narrative.
- Les cartes de chapitres et le panneau d'ennemi disposent de styles adaptatifs pour les petits écrans.
- Le test de fumée vérifie aussi la présence des 13 portraits de bestiaire et des trois paysages.

- Cinq icônes de reliques (arme, armure, étendard, anneau, orbe) sont ajoutées et intégrées aux lignes du reliquaire. Le test de fumée vérifie leurs fichiers.

## Contrôle qualité et classes complètes

- Trois portraits manquants ont été ajoutés (Soigneur, Défenseur, Tueur) ; les neuf classes de gameplay ont maintenant une correspondance explicite vers leur portrait.
- Le test de fumée vérifie la présence et la structure de chaque SVG, le nombre de portraits affichés dans le roster et la résolution du portrait de boss en combat.
- Le test est désormais portable : chemins calculés depuis le dossier du projet et dépendance jsdom déclarée dans package.json.
- Le workflow GitHub Actions `.github/workflows/asteria-quality.yml` contrôle la syntaxe JavaScript puis exécute le test de fumée sur les pushes de la branche et les pull requests.


## Vérification et maintenance

- Dépendances d’exécution : aucune ; le jeu reste HTML/CSS/JavaScript natif.
- Dépendance de développement : `jsdom` (déclarée dans `package.json`) pour exécuter le test de fumée sous Node.js.
- Commandes de contrôle : `npm install`, `npm run check:syntax`, puis `npm test`.
- Le test initialise les scripts dans jsdom et remplace `window.scrollTo` via `beforeParse`, avant le démarrage du noyau PhoneOS.
- La validation CI doit être vérifiée sur le SHA exact du dernier commit ; l’existence du workflow ne vaut pas résultat vert.


## Cohérence audio et combat

- Le curseur de volume règle maintenant un gain maître partagé par les effets sonores et la musique, avec persistance et bornage de 0 à 100 %.
- Les attaques ultimes utilisent le même pipeline de dégâts que les cartes : résistances d'archétype, malédiction et jauge de rupture sont appliquées de façon cohérente.
- Le test de fumée couvre le bornage, la persistance et le raccord du volume au moteur audio.
- Le moteur audio ignore les demandes répétées d'activation/désactivation de la musique et du mute ; cela évite de lancer plusieurs boucles lors des re-rendus du Mode Histoire. L'initialisation AudioContext échouée reste non bloquante.
