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

Le chargement v2 ne lit plus les clés historiques `asteria*` ni `epopee*` et ne lance plus leur migration automatique. Les anciennes sauvegardes restent dans le stockage local du navigateur ; elles ne sont ni importées ni effacées par cette branche.

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
