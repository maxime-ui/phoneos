# Astéria

RPG gacha et jeu de combat au tour par tour, réalisé en HTML, CSS et JavaScript vanilla. Le jeu fonctionne directement dans le navigateur, sans serveur ni dépendance runtime.

📘 **Guide complet :** [GUIDE.md](GUIDE.md)

## Applications

- **Astéria** : invocations générales et portails par classe, équipe, entraînement, collection, quêtes, Mode Infini et raid hebdomadaire.
- **Personnages** : fiches détaillées des héros, statistiques, passifs, compétences, ultimes et évolutions.
- **Réglages** : audio, volume, vitesse du jeu, notifications et mode daltonien.
- **Trophées** : progression de collection, objectif Astrée SS et record du Mode Infini.

## Systèmes du jeu

- **145 héros** : 69 R, 42 SR, 33 SSR et 1 SS. Les 144 héros R/SR/SSR sont obtenables par invocation ; Astrée (SS) est la récompense de complétion de la Collection.
- **12 classes** : Chevalier, Berserker, Mage, Archer, Rôdeur, Héros, Soigneur, Défenseur, Tueur, Artificier, Druide et Occultiste.
- **Combat tactique** : cartes Brut/Arcane/Rapide, affinités élémentaires, garde, rupture, synergies, passifs et ultimes automatiques des héros et ennemis.
- **19 archétypes ennemis**, chacun avec ses comportements et son équilibrage.
- **8 reliques** et **4 ensembles**, avec statistiques principales et secondaires déterministes.
- **Quêtes** à trois difficultés, **Mode Infini** à difficulté croissante et **Raid hebdomadaire** en trois phases.
- **Missions quotidiennes** : cartes jouées, invocations, victoires, soins, progression en Infini et phases de raid.

## Invocation et collection

L'invocation générale coûte 3 ◆ par tirage (30 ◆ pour dix) et garantit un SSR au 50ᵉ tirage. Les portails de classe coûtent 5 ◆ (45 ◆ pour dix) et garantissent un SSR de la classe au 30ᵉ tirage. Il n'y a plus de bannières événementielles ou de bannières de gloire.

La progression de Collection se calcule sur les **144 héros R, SR et SSR**. Une fois les 144 possédés, la récompense finale de 100 % permet de réclamer **500 ◆ et Astrée, le héros SS**. Le SS n'est donc pas nécessaire pour atteindre le seuil qui le débloque.

## Lancer les vérifications

Node.js 20 recommandé.

```bash
npm install
npm run check:syntax
npm test
npm run test:stress
```

Les tests automatisés utilisent jsdom. Ils vérifient les fonctions et interactions principales, mais ne remplacent pas un contrôle visuel manuel dans un vrai navigateur.

## Technique

- HTML/CSS/JavaScript vanilla ; aucun back-end.
- Sauvegardes locales dans `localStorage` sous le préfixe `phoneos:asteria-v2`.
- Tests : `test/smoke.test.js` et `test/stress.test.js`.
- Workflow GitHub Actions : `.github/workflows/asteria-quality.yml`.
