# Yam's Score

## Présentation

Yam's Score est une feuille de score Yam's mobile-first, en français et installable comme PWA. Elle remplace la feuille papier, fonctionne sans compte ni backend, et conserve les données sur l’appareil.

## Fonctionnalités

- Plusieurs joueurs : ajout, renommage et suppression (au moins un joueur reste présent).
- Saisie rapide avec scores proposés, score personnalisé, rature et remise à vide.
- Indicateur de progression du bonus, totaux automatiques et validation des Chances.
- Thème de fond et couleur de grille indépendants.
- Historique local, classement et statistiques par joueur.
- Nouvelle partie avec archivage sûr, PWA et déploiement GitHub Pages.

## Stack

React 18, TypeScript strict, Vite, CSS natif, Lucide React, vite-plugin-pwa/Workbox et Vitest. L’application ne dépend d’aucune API, CDN ou police distante à l’exécution.

## Lancer le projet

```bash
npm install
npm run dev
npm run dev -- --host
npm test
npm run lint
npm run build
```

`npm run dev -- --host` expose l’adresse réseau Vite : ouvrir cette adresse depuis Safari sur un iPhone connecté au même Wi-Fi.

## Architecture

```text
src/
  app/          état React et couche de persistance
  components/   feuille de score, header et BottomSheet réutilisable
  game/         types, règles déclaratives, scoring, validation et historique
  theme/        catalogue des fonds/grilles et application des variables CSS
  styles/       styles mobile-first et tokens CSS
```

`src/game/rules.ts` est la source de vérité des catégories, de leur libellé, de leur texte d’aide et des valeurs proposées. Le moteur de scoring et le popup réemploient ces règles ; l’écran Règles les rend directement.

## Règles du jeu

Les catégories jouables sont : As, Deux, Trois, Quatre, Cinq, Six ; Chance +, Chance - ; Paire, Double paire, Brelan, Carré, Full, Petite suite, Grande suite, Yams et Yams Bonus.

### Section I

Chaque ligne est la somme des dés de la face correspondante : As `1–5`, Deux `2–10` par 2, Trois `3–15` par 3, Quatre `4–20` par 4, Cinq `5–25` par 5 et Six `6–30` par 6. Une rature est toujours possible et vaut `0`.

Additionner As à Six. À partir de `63`, le bonus vaut `+35`, sinon `0`. La cible de rythme est trois dés de chaque valeur : `3 + 6 + 9 + 12 + 15 + 18 = 63`. L’indicateur est vert pour un delta `>= 0`, orange de `-1` à `-5` et rouge à `<= -6`. Tant que la section n’est pas complète, il affiche les points restant pour atteindre 63.

### Chances et combinaisons

- Paire : valeur de la paire (`2, 4, 6, 8, 10, 12`).
- Double paire : deux paires, de valeurs identiques ou différentes, somme des quatre dés (`4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24`). Ainsi, quatre dés identiques comptent aussi comme une double paire.
- Brelan : `20` ; Carré : `30` ; Full : `25` ; Petite suite : `30` ; Grande suite : `40` ; Yams : `50`.
- Yams Bonus : après un Yams inscrit à 50, chaque Yams supplémentaire ajoute 100 points au cumul (`100, 200, …`).
- Chance + et Chance - : somme des cinq dés, de `5` à `30`. Si les deux sont positives, Chance + doit être strictement supérieure à Chance -. Une Chance raturée (`0`) ne contraint pas l’autre.

Une case raturée contient `0` : elle est jouée. Une case vide contient `null` : elle n’est pas jouée. Les totaux automatiques additionnent les valeurs jouées ; les cases vides contribuent temporairement à `0`.

## Persistance

Les composants n’accèdent pas directement à `localStorage`. `src/app/storage.ts` gère l’état actif (`yams-score/game-v1`), les archives (`yams-score/archives-v1`) et les préférences (`yams-score/preferences-v1`). Les données lues sont normalisées pour préserver une partie existante en cas de donnée incomplète.

La migration d’apparence lit l’ancienne clé `yams-score/theme-v1` si nécessaire : `ocean` devient la grille Océan et `plum` la grille Violet, avec le fond Nuit (proche de l’ancien fond) par défaut.

## Apparence et thèmes

Les préférences sont indépendantes : un fond sombre (Nuit, Forêt, Ardoise, Marine, Aubergine ou Sépia) ou clair (Ivoire, Brume ou Sable), et une couleur de grille (Forêt, Émeraude, Ardoise, Violet, Rose, Océan, Braise, Or ou Corail). Les variables CSS séparent surfaces et accents ; les couleurs sémantiques du bonus restent inchangées. Les chiffres de la ligne Total utilisent automatiquement une couleur contrastée : claire sur fond sombre, foncée sur fond clair.

La palette du header ouvre le sélecteur rapide ; Paramètres > Apparence ouvre le même composant. Réinitialiser l’apparence ne touche ni la partie, ni les joueurs, ni l’historique.

## Historique et statistiques

Une nouvelle partie archive la feuille si au moins un score — y compris une rature — est joué. L’archive contient les totaux, rangs et gagnants. Les statistiques locales agrègent parties, victoires, moyenne et meilleur score. Paramètres permet d’effacer l’historique après confirmation.

## Test sur iPhone

Lancer `npm run dev -- --host`, puis ouvrir dans Safari l’URL **Network** affichée par Vite depuis le même Wi-Fi. Cette adresse HTTP est adaptée au développement ; elle ne fournit pas l’installation hors ligne.

## PWA sur iPhone

Sur la version HTTPS publiée, ouvrir l’application dans Safari, puis **Partager > Ajouter à l’écran d’accueil**. Après la première visite complète, les ressources précachées restent disponibles hors ligne.

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit puis publie `dist/` à chaque push sur `main`. Dans GitHub, activer **Settings > Pages > Build and deployment > GitHub Actions**. En production, Vite calcule automatiquement le `base` d’un dépôt de projet ; le développement reste servi sur `/`.

## Tests

`npm test` vérifie le moteur de score, l’archivage, les valeurs fixes, le bonus, les Chances, la migration et le catalogue d’apparence. `npm run lint` contrôle TypeScript/React et `npm run build` exécute TypeScript puis la construction PWA.

## État du développement

- [x] Moteur de règles et scoring centralisés
- [x] Saisie, bonus, historique et statistiques locaux
- [x] Paramètres, règles à l’écran et apparence séparée
- [x] PWA et GitHub Pages
- [x] Tests, lint et build de production
