# Les Petits Enclos

Un petit jeu de logique bilingue, autonome et compatible Ludiworld. 200 grilles à solution unique dans cinq mondes : lucioles, pandas, hiboux, moutons, chats. Chaque monde propose huit visages distincts.

Un animal par ligne, colonne et enclos de couleur. Deux animaux ne se touchent pas, même par un coin.

L’entrée « Entraînement » de l’accueil propose seize exercices dédiés, directement jouables avec une flèche. Seuls les deux glissements montrent une brève main animée, puis laissent essayer automatiquement. Les premières grilles ont une seule ligne de quatre cases. Une colonne, deux lignes puis trois lignes introduisent progressivement les gestes et les règles. Quatre travaux pratiques montrent comment marquer les cases interdites autour d’un chat déjà posé : sa ligne, sa colonne, les coins, puis l’ensemble. Seul le dernier exercice utilise une grille complète 4 × 4, à résoudre sans flèche, avec les règles illustrées accessibles par l’aide. Les cibles de chaque exercice sont contrôlées, et seules les règles déjà expliquées s’appliquent. L’entraînement se reprend en cours et garde une progression séparée des 200 niveaux. Un maintien ne pose jamais d’animal ; le double appui est le seul geste tactile de placement.

- Appui simple : marquer ou effacer une croix.
- Appui maintenu et glissement : tracer plusieurs croix, ou les effacer en partant d’une croix.
- Double appui : placer l’animal choisi, ou le retirer.
- Clavier : flèches, Espace pour une croix, Entrée pour un animal.

Les indices donnent une règle générale. La progression reste sur l’appareil. Chaque grille terminée offre une pause naturelle. Le classement de difficulté repose sur un solveur logique ; la difficulté ressentie peut varier.

Un placement incorrect est signalé immédiatement et ne reste pas sur la grille. Trois étoiles sans erreur, deux avec une ou deux erreurs, une à partir de trois erreurs. Les croix restent des notes libres. L’annulation conserve le nombre d’erreurs de l’essai ; Reprendre commence un nouvel essai. Le meilleur résultat de chaque niveau est conservé.

Dans le premier monde (niveaux 1 à 40), une erreur affiche la règle dans un panneau en bas, à confirmer avec « J’ai compris ». Le plateau reste net et visible, avec la tentative et la ligne, colonne ou zone concernée. Les indices s’affichent aussi sous le plateau. Ensuite, les erreurs restent visibles sept secondes. Rester appuyé ne pose aucun animal : ce geste sert seulement à tracer des croix en glissant.

## Développement

`python build.py` construit `docs/`, publié par GitHub Pages. Servir ce dossier avec un serveur HTTP pour tester le service worker. Le jeu fonctionne seul et dans Ludiworld. Aucun service extérieur, aucune dépendance JavaScript.

`node --test tests/*.test.cjs` vérifie la logique, les identités et les placements. `python tests/navigateur.py` vérifie les gestes et le mode hors ligne sur un serveur local. `python tests/retours.py` vérifie les retours d’erreur, les étoiles, l’appui long souris/tactile et les dispositions portrait/paysage. Ces scripts visent par défaut le port 7374 ; `ENCLOS_URL` permet de viser une autre adresse.

`python tests/entrainement.py` parcourt les seize exercices avec les vrais gestes, les démonstrations automatiques, les cibles contrôlées, les croix d’élimination, la reprise et la sauvegarde séparée de l’aventure. `python tests/regles-visibles.py` vérifie que règle et plateau sont visibles ensemble sur cinq formats d’écran.

Illustrations créées avec l’outil intégré de génération d’images, dans la direction artistique de Ludiworld.
