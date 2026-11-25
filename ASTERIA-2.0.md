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
node test/smoke.test.js
node test/stress.test.js
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

Aucun workflow GitHub Actions n'est configuré sur la branche au moment de la vérification. Les tests ont été enrichis, mais ils ne sont pas déclarés exécutés ici.


## Ajustements de robustesse

- Réinitialisation de la jauge de rupture, de l'état déséquilibré et de la garde entre les phases du raid.
- Test de fumée : une ancienne sauvegarde est injectée avant le démarrage et son absence est vérifiée après le lancement v2.
