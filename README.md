# Yam's Score

> Une feuille de score de Yam's rapide, tactile et installable sur iPhone ou Android.

Yam's Score est une application web progressive (PWA), mobile-first et en français, conçue pour compter les points d'une partie autour d'une table. Elle remplace la feuille papier, ne demande aucun compte, n'utilise ni backend ni ressource distante, et conserve les parties directement sur l'appareil.

## Objectif fonctionnel

- Deux joueurs (`Joueur 1`, `Joueur 2`) à la création, et gestion d'au moins six joueurs.
- Ajout, renommage et suppression de joueurs, en conservant toujours au moins un joueur.
- Feuille de score à colonnes défilantes horizontalement sur petit écran, avec la colonne des catégories fixe.
- Un appui sur toute case jouable ouvre un popup proposant les scores autorisés, une rature, un score personnalisé et la remise à vide de la case.
- Les lignes automatiques (`Bonus`, `Total I`, `Total II`, `Total`) ne sont pas modifiables.
- Toute modification, l'historique, les statistiques et le thème sont sauvegardés localement dans `localStorage`.
- La PWA fonctionne hors ligne après la première visite de la version HTTPS publiée et peut être ajoutée à l'écran d'accueil d'un iPhone depuis Safari.

## Stack technique

- React 18, TypeScript et Vite
- CSS moderne natif (aucun framework CSS)
- `localStorage` pour la persistance
- `vite-plugin-pwa` et Workbox pour le manifeste et le service worker
- Vitest pour le moteur de règles métier
- `lucide-react` pour les icônes locales empaquetées

Il n'y a ni API, ni police web, ni CDN requis à l'exécution.

## Architecture

```text
src/
  app/             # état React, persistance et interface
  components/      # feuille, modales et contrôles de joueurs
  game/            # règles pures, types et calcul de score
  styles/          # style global mobile-first
  test/            # configuration Vitest
public/            # icônes et ressources PWA
```

Les règles sont volontairement centralisées dans `src/game/` : les composants React ne décident jamais des valeurs de score ni des totaux.

## Règles de score

Les catégories apparaissent exactement dans cet ordre :

1. **SECTION I** — As, Deux, Trois, Quatre, Cinq, Six, Bonus, Total I
2. **SECTION II** — Chance +, Chance -, Total II
3. **SECTION PRINCIPALE** — Paire, Double paire, Brelan, Carré, Full, Petite suite, Grande suite, Yams, Yams Bonus
4. **TOTAL** — Total

### Section I

Les valeurs proposées représentent le nombre de dés de la face concernée :

- As : 1, 2, 3, 4, 5
- Deux : 2, 4, 6, 8, 10
- Trois : 3, 6, 9, 12, 15
- Quatre : 4, 8, 12, 16, 20
- Cinq : 5, 10, 15, 20, 25
- Six : 6, 12, 18, 24, 30

Une ligne peut toujours être raturée pour valoir 0.

### Calculs automatiques

- **Bonus** : 35 si la somme As à Six est supérieure ou égale à 63, sinon 0. Il est intégré au Total I dès que le seuil est atteint.
- **Total I** : somme As à Six et Bonus.
- **Total II** : somme de Chance + et Chance -.
- **Total** : Total I, Total II et toutes les catégories de la section principale. Une catégorie non encore jouée contribue temporairement 0 au total affiché.

### Section II

- **Chance +** : de 5 à 30. Si Chance - contient un score positif, la valeur doit lui être strictement supérieure.
- **Chance -** : de 5 à 30. Si Chance + contient un score positif, la valeur doit lui être strictement inférieure.

Une Chance raturée (`0`) est considérée comme non jouée pour la contrainte comparative : l'autre Chance peut donc recevoir toute valeur de 5 à 30.

### Section principale

- **Paire** : somme de la paire choisie : 2, 4, 6, 8, 10 ou 12.
- **Double paire** : somme de deux paires distinctes : 6, 8, 10, 12, 14, 16, 18, 20 ou 22.
- **Brelan** : 20.
- **Carré** : 30.
- **Full** : 25.
- **Petite suite** : 30.
- **Grande suite** : 40.
- **Yams** : 50.
- **Yams Bonus** : 100 points par Yams supplémentaire. Après avoir inscrit le Yams à 50, saisir le cumul des bonus obtenus (100, 200, etc.).

## Indicateur du bonus

La ligne **Bonus** affiche la progression vers le seuil de 63 plutôt que le bonus final tant que les six catégories de la section I ne sont pas terminées. Le nombre affiché est toujours `max(0, 63 - sous-total)`.

Le rythme est calculé uniquement sur les lignes déjà jouées, à partir des cibles correspondant à trois dés par face : As 3, Deux 6, Trois 9, Quatre 12, Cinq 15 et Six 18. Pour chaque ligne jouée, l'application additionne `score - cible` : une rature à 0 est bien prise en compte, tandis qu'une case vide ne l'est pas.

- Cercle orange : aucune ligne jouée, ou retard léger (delta de -1 à -5).
- Cercle vert : delta positif ou nul.
- Cercle rouge : delta inférieur ou égal à -6.

Même si 63 est atteint avant la fin de la section, l'indicateur reste une flèche verte avec `0` restant. Lorsque les six lignes sont remplies, il affiche définitivement `+35` en vert si le seuil est atteint, sinon `0` dans un style négatif.

## Popup de score

Chaque catégorie jouable ouvre une modale avec les scores prédéfinis et trois actions toujours disponibles :

- **0 / Raturer** inscrit réellement `0` : la catégorie est jouée et participe aux calculs, notamment au rythme du bonus.
- **Personnalisé** ouvre un clavier numérique ; la valeur est validée par les mêmes règles métier que les boutons proposés, y compris les contraintes entre les deux Chances.
- **Case vide** inscrit `null`, afin de corriger une saisie : la catégorie n'est plus jouée et ne participe plus aux calculs.

Les choix proposés restent ceux de chaque catégorie. Toute action est sauvegardée immédiatement. Les lignes Bonus, Total I, Total II et Total restent calculées et n'ouvrent jamais de popup.

## Header

Le header ne contient que quatre actions sous forme d'icônes Lucide :

- **Palette** : change la couleur de la grille entre les thèmes Ambre, Océan et Prune.
- **Historique** : affiche les parties archivées, leurs scores, leur classement et leurs gagnants.
- **Statistiques** : affiche les statistiques agrégées locales (parties, victoires, moyenne et meilleur score) des joueurs archivés.
- **Nouvelle partie** : ouvre la confirmation de création d'une manche.

Les quatre boutons ont des cibles tactiles de 44 px minimum et le thème choisi reste actif entre les manches et après le rechargement.

## Nouvelle partie

Le bouton circulaire à flèche complète ouvre une confirmation, sans utiliser de boîte de dialogue native. Lors de la confirmation :

- Si au moins un score est joué — y compris une rature à `0` — la feuille actuelle est archivée avant la réinitialisation. L'archive contient la date, les scores, les totaux, le classement et le ou les gagnants.
- Une feuille ne contenant que des cases vides (`null`) ne crée aucune archive.
- Les noms et la liste des joueurs sont conservés, tandis que toutes leurs cases de score sont remises à vide.
- Les totaux affichés au moment du reset sont archivés même pour une partie incomplète.
- Les archives sont enregistrées avant la nouvelle feuille afin d'éviter toute perte de résultats; une protection empêche la création de doublons lors d'un double déclenchement.

## Modèle de données et sauvegarde

```ts
type CategoryId = /* catégories jouables */
type Scores = Partial<Record<CategoryId, number | null>>
type Player = { id: string; name: string; scores: Scores }
type GameState = { id: string; version: 1; players: Player[] }
```

L'état actif est validé et normalisé à la lecture de la clé `yams-score/game-v1` de `localStorage`. Les archives et le thème sont enregistrés dans leurs propres clés locales. Une nouvelle partie conserve les joueurs actuels; seuls les scores sont remis à vide.

## Développement

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

`npm run dev` expose le serveur sur le réseau local. Sur l'iPhone connecté au même Wi-Fi, ouvrir l'URL affichée par Vite (par exemple `http://192.168.x.x:5173`). Cette adresse HTTP est utile pour le développement, mais ne permet pas à Safari d'installer une PWA hors ligne.

## Installer sur iPhone

1. Ouvrir le site déployé dans **Safari** (pas un navigateur intégré à une application).
2. Utiliser Partager, puis **Sur l'écran d'accueil** / **Ajouter à l'écran d'accueil**.
3. Confirmer : Yam's Score apparaît alors comme une application et reste utilisable hors ligne après sa première visite complète.

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit le projet lors de chaque push sur `main` puis publie `dist/` avec GitHub Pages. La publication HTTPS permet à Safari d'installer l'application et de conserver ses ressources pour une utilisation hors ligne.

1. Créer/pousser le dépôt GitHub `yams-score`.
2. Dans GitHub, activer **Settings → Pages → Build and deployment → GitHub Actions**.
3. Pousser sur `main`.

Après le premier déploiement, l'application sera disponible à l'adresse `https://lordverton.github.io/yams-score/`.

Le `base` Vite est calculé en production pour les pages de projet (`/<nom-du-repo>/`) ; il reste `/` en développement ou pour un domaine personnalisé.

## Choix techniques importants

- Toutes les catégories et valeurs admissibles appartiennent au moteur pur `src/game/rules.ts`.
- Les valeurs de score restent validées par le moteur métier ; elles peuvent être corrigées ou vidées via le popup.
- Les icônes PWA sont des SVG locaux ; l'apparence évite toute dépendance à une police ou image distante.
- Le cache PWA est généré à la construction avec stratégie précache des assets Vite.

## État du développement

- [x] initialisation Vite / React / TypeScript
- [x] moteur de score et tests
- [x] interface joueurs
- [x] popup de score
- [x] sauvegarde locale
- [x] PWA
- [x] GitHub Pages
- [x] lint, tests et build de production validés
