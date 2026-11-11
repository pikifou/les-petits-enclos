# Les Petits Enclos

Un petit jeu de logique bilingue, autonome et compatible Ludiworld. 200 grilles à solution unique dans cinq mondes : lucioles, pandas, hiboux, moutons, chats. Chaque monde propose huit visages distincts.

Un animal par ligne, colonne et enclos de couleur. Deux animaux ne se touchent pas, même par un coin.

- Appui simple : marquer ou effacer une croix.
- Appui maintenu et glissement : tracer plusieurs croix, ou les effacer en partant d’une croix.
- Double appui : placer l’animal choisi, ou le retirer.
- Clavier : flèches, Espace pour une croix, Entrée pour un animal.

Les indices donnent une règle générale. La progression reste sur l’appareil. Chaque grille terminée offre une pause naturelle. Le classement de difficulté repose sur un solveur logique ; la difficulté ressentie peut varier.

## Développement

`python build.py` construit `docs/`, publié par GitHub Pages. Servir ce dossier avec un serveur HTTP pour tester le service worker. Le jeu fonctionne seul et dans Ludiworld. Aucun service extérieur, aucune dépendance JavaScript.

`node --test tests/*.test.cjs` vérifie la logique et les identités. `python tests/navigateur.py` vérifie les gestes et le mode hors ligne sur un serveur local.

Illustrations créées avec l’outil intégré de génération d’images, dans la direction artistique de Ludiworld.
