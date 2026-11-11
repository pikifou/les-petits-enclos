# Les Petits Enclos

Un petit jeu de logique bilingue, autonome et compatible Ludiworld. 200 grilles à solution unique dans cinq mondes : lucioles, pandas, hiboux, moutons, chats. Chaque monde propose huit visages distincts.

Un animal par ligne, colonne et enclos de couleur. Deux animaux ne se touchent pas, même par un coin.

L’entrée « Entraînement » de l’accueil propose dix petites missions : poser, retirer et annuler, marquer et effacer une croix, tracer une ligne et une colonne, comprendre les lignes, les colonnes, les enclos et les voisins en diagonale, puis réussir une grille complète. Chaque action est vérifiée avant de proposer la mission suivante. L’entraînement se reprend en cours et garde une progression séparée des 200 niveaux.

- Appui simple : marquer ou effacer une croix.
- Appui maintenu et glissement : tracer plusieurs croix, ou les effacer en partant d’une croix.
- Appui long immobile ou double appui : placer l’animal choisi, ou le retirer.
- Clavier : flèches, Espace pour une croix, Entrée pour un animal.

Les indices donnent une règle générale. La progression reste sur l’appareil. Chaque grille terminée offre une pause naturelle. Le classement de difficulté repose sur un solveur logique ; la difficulté ressentie peut varier.

Un placement incorrect est signalé immédiatement et ne reste pas sur la grille. Trois étoiles sans erreur, deux avec une ou deux erreurs, une à partir de trois erreurs. Les croix restent des notes libres. L’annulation conserve le nombre d’erreurs de l’essai ; Reprendre commence un nouvel essai. Le meilleur résultat de chaque niveau est conservé.

Dans le premier monde (niveaux 1 à 40), une erreur ouvre une fenêtre avec la règle en grand, à confirmer avec « J’ai compris ». Ensuite, le message reste visible sept secondes. Le cercle d’appui long apparaît après 600 ms immobile ; l’animal est posé à 900 ms. Tout glissement annule ce maintien.

## Développement

`python build.py` construit `docs/`, publié par GitHub Pages. Servir ce dossier avec un serveur HTTP pour tester le service worker. Le jeu fonctionne seul et dans Ludiworld. Aucun service extérieur, aucune dépendance JavaScript.

`node --test tests/*.test.cjs` vérifie la logique, les identités et les placements. `python tests/navigateur.py` vérifie les gestes et le mode hors ligne sur un serveur local. `python tests/retours.py` vérifie les retours d’erreur, les étoiles, l’appui long souris/tactile et les dispositions portrait/paysage. Ces scripts visent par défaut le port 7374 ; `ENCLOS_URL` permet de viser une autre adresse.

`python tests/entrainement.py` parcourt les dix missions avec les vrais gestes, leur reprise et la sauvegarde séparée de l’aventure. Il vérifie aussi les espaces blancs entre cases et l’affichage sur cinq tailles d’écran.

Illustrations créées avec l’outil intégré de génération d’images, dans la direction artistique de Ludiworld.
