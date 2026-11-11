(function(root) {
  'use strict';
  const steps=[
    {id:'place',rows:1,cols:4,tokens:1,kind:'animal',targets:[1],demo:1,
      fr:['Deux petits appuis','Regarde : deux appuis rapides posent une luciole sous la flèche.','À toi ! Fais deux appuis rapides sur la case montrée.'],
      en:['Two little taps','Watch: two quick taps place a firefly under the arrow.','Your turn! Tap the pointed square twice quickly.']},
    {id:'remove',rows:1,cols:4,tokens:1,kind:'animal',targets:[1],demo:1,animals:[1],
      fr:['Retirer une luciole','Regarde : deux nouveaux appuis retirent la luciole.','À toi ! Tape deux fois sur la luciole pour la retirer.'],
      en:['Remove a firefly','Watch: two more taps remove the firefly.','Your turn! Tap the firefly twice to remove it.']},
    {id:'undo',rows:1,cols:4,tokens:1,kind:'undo',targets:[],demo:2,crosses:[2],
      fr:['Revenir en arrière','Regarde le bouton Annuler : il enlève la dernière action.','À toi ! Appuie sur Annuler pour enlever la croix.'],
      en:['Go back one step','Watch the Undo button: it takes back the last action.','Your turn! Press Undo to remove the cross.']},
    {id:'cross',rows:1,cols:4,tokens:1,kind:'cross',targets:[2],demo:2,
      fr:['Garder une idée de côté','Regarde : un seul appui dessine une croix. Elle veut dire « pas ici ».','À toi ! Fais un seul appui sur la case montrée.'],
      en:['Set a place aside','Watch: one tap draws a cross. It means “not here”.','Your turn! Tap the pointed square once.']},
    {id:'erase',rows:1,cols:4,tokens:1,kind:'cross',targets:[2],demo:2,crosses:[2],
      fr:['Effacer une croix','Regarde : un appui sur une croix l’efface.','À toi ! Fais un seul appui sur la croix.'],
      en:['Erase a cross','Watch: one tap on a cross erases it.','Your turn! Tap the cross once.']},
    {id:'drag-row',rows:1,cols:4,tokens:1,kind:'drag',targets:[0,1,2,3],demo:0,path:[0,1,2,3],
      fr:['Traverser une ligne','Regarde : le doigt reste posé et glisse vers la droite.','À toi ! Pars de la flèche et glisse sur les quatre cases sans lever le doigt.'],
      en:['Cross a row','Watch: the finger stays down and slides to the right.','Your turn! Start at the arrow and drag across all four squares without lifting.']},
    {id:'drag-column',rows:4,cols:1,tokens:1,kind:'drag',targets:[0,1,2,3],demo:0,path:[0,1,2,3],
      fr:['Descendre une colonne','Regarde : une colonne se suit de haut en bas.','À toi ! Pars de la flèche et glisse jusqu’en bas sans lever le doigt.'],
      en:['Go down a column','Watch: a column runs from top to bottom.','Your turn! Start at the arrow and drag all the way down without lifting.']},
    {id:'row',rows:2,cols:4,tokens:2,kind:'animal',targets:[4,5,6,7],demo:7,animals:[1],rules:['row'],regions:[0,0,0,0,1,1,1,1],
      fr:['Une luciole par ligne','La ligne du haut est remplie. Regarde la luciole rejoindre la ligne du bas.','À toi ! Pose une luciole dans la ligne du bas. Une seule par ligne.'],
      en:['One firefly per row','The top row is filled. Watch a firefly join the bottom row.','Your turn! Place a firefly in the bottom row. Just one per row.']},
    {id:'column',rows:2,cols:4,tokens:2,kind:'animal',targets:[4,5,6,7],demo:7,animals:[1],rules:['row','column'],regions:[0,0,0,0,1,1,1,1],
      fr:['Jamais deux dans une colonne','Regarde : la deuxième luciole choisit une autre colonne.','À toi ! Pose une luciole en bas, sans en mettre deux dans la même colonne.'],
      en:['Never two in a column','Watch: the second firefly chooses a different column.','Your turn! Place a firefly below, without putting two in the same column.']},
    {id:'region',rows:3,cols:4,tokens:3,kind:'animal',targets:[5,6,8,9],demo:8,animals:[1,7],rules:['row','column','region'],regions:[0,0,1,1,0,2,2,1,2,2,1,1],
      fr:['Une luciole par couleur','Regarde : l’enclos violet attend encore sa luciole.','À toi ! Trouve une place dans le violet, avec une seule luciole par ligne et par colonne.'],
      en:['One firefly per color','Watch: the purple enclosure is still waiting for a firefly.','Your turn! Find a place in purple, keeping just one firefly per row and column.']},
    {id:'touch',rows:3,cols:4,tokens:2,kind:'animal',targets:[0,1,2,3],demo:2,animals:[4],rules:['row','column','region','touch'],regions:[0,0,0,0,1,1,1,1,2,2,2,2],
      fr:['Même les coins comptent','Regarde : les lucioles gardent de l’espace, même entre leurs coins.','À toi ! Pose une luciole en haut, sans toucher celle qui est déjà là.'],
      en:['Corners count too','Watch: fireflies leave space, even between their corners.','Your turn! Place a firefly above without touching the one already there.']},
    {id:'exclude-row',rows:5,cols:5,tokens:1,kind:'notes',species:'chats',targets:[10,11,13,14],demo:10,animals:[12],regions:[0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],
      nudge:{fr:'Pour cette mission, marque seulement les autres cases de la ligne du chat.',en:'For this mission, mark only the other squares in the cat’s row.'},
      fr:['La ligne du chat','Un chat est déjà posé.','Marque toute la ligne du chat, jusqu’aux deux bords : aucun autre animal ne peut y aller, même loin de lui. Tu peux glisser.'],
      en:['The cat’s row','A cat is already placed.','Mark the cat’s whole row, all the way to both edges: no other animal can go there, even far away. You can drag.']},
    {id:'exclude-column',rows:5,cols:5,tokens:1,kind:'notes',species:'chats',targets:[2,7,17,22],demo:2,animals:[12],crosses:[10,11,13,14],regions:[0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],
      nudge:{fr:'La ligne est déjà faite. Pour cette mission, marque seulement les autres cases de la colonne du chat.',en:'The row is already done. For this mission, mark only the other squares in the cat’s column.'},
      fr:['La colonne du chat','La ligne est déjà marquée.','Marque toute sa colonne, jusqu’en haut et jusqu’en bas, même les cases qui ne touchent pas le chat.'],
      en:['The cat’s column','The row is already marked.','Mark its whole column, all the way to the top and bottom, even the squares that do not touch the cat.']},
    {id:'exclude-corners',rows:5,cols:5,tokens:1,kind:'notes',species:'chats',targets:[6,8,16,18],demo:6,animals:[12],crosses:[2,7,10,11,13,14,17,22],regions:[0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],
      nudge:{fr:'La ligne et la colonne sont déjà faites. Pour cette mission, marque seulement les quatre coins autour du chat.',en:'The row and column are already done. For this mission, mark only the four corners around the cat.'},
      fr:['Les coins aussi','La ligne et la colonne sont déjà marquées.','Ajoute les croix dans les quatre cases qui touchent le chat par un coin. Elles sont interdites aussi.'],
      en:['Corners too','The row and column are already marked.','Add crosses in the four squares that touch the cat at a corner. They are ruled out too.']},
    {id:'exclude-all',rows:5,cols:5,tokens:1,kind:'notes',species:'chats',targets:[2,6,7,8,10,11,13,14,16,17,18,22],demo:12,guided:false,animals:[12],regions:[0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4],
      fr:['À chaque animal, ses croix','Un chat est déjà posé.','Marque sa ligne et sa colonne jusqu’aux bords, puis ses voisines par un coin. Garde toutes les autres cases libres.'],
      en:['An animal, then its crosses','A cat is already placed.','Mark its row and column all the way to the edges, then its diagonal neighbors. Leave every other square free.']},
    {id:'finish',rows:4,cols:4,tokens:4,kind:'animal',targets:null,demo:2,rules:['row','column','region','touch'],regions:[0,0,0,0,1,0,0,0,3,0,0,2,3,3,2,2],answers:[2,4,11,13],
      fr:['À toi de tout ranger','Voici une vraie petite grille : les quatre règles vont servir ensemble.','À toi ! Range les quatre lucioles. Tu connais maintenant les gestes et les règles.'],
      en:['Settle everyone in','Here is a real little puzzle: all four rules work together.','Your turn! Settle all four fireflies. You now know the gestures and rules.']}
  ];
  function create(index,S) {
    const step=steps[index],level={size:step.cols,rows:step.rows,cols:step.cols,animals:step.tokens,regions:step.regions?[...step.regions]:Array(step.rows*step.cols).fill(0),rules:step.rules||[]};
    const state=S.fresh(level),empty=S.clone(state);
    for(const cell of step.animals||[])S.animal(state,cell,step.tokens);
    for(const cell of step.crosses||[])S.cross(state,cell,2);
    return {level,state,history:step.id==='undo'?[empty]:[]};
  }
  function inspect(level,state) {
    const occupied=state.marks.flatMap((v,i)=>v===1?[i]:[]);let rule=null;
    for(let i=0;i<occupied.length;i++)for(let j=i+1;j<occupied.length;j++){
      const a=occupied[i],b=occupied[j],ar=Math.floor(a/level.cols),br=Math.floor(b/level.cols),ac=a%level.cols,bc=b%level.cols;
      for(const r of level.rules)if(!rule&&({row:ar===br,column:ac===bc,region:level.regions[a]===level.regions[b],touch:Math.abs(ar-br)<=1&&Math.abs(ac-bc)<=1})[r])rule=r;
    }
    return {count:occupied.length,rule,won:occupied.length===level.animals&&!rule};
  }
  function allows(index,action,cell) {
    const step=steps[index];
    if(step.id==='finish')return ['animal','cross','drag','undo'].includes(action);
    if(step.kind==='undo')return action==='undo';
    if(step.kind==='notes')return ['notes','cross','drag'].includes(action)&&step.targets.includes(cell);
    return step.kind===action&&step.targets.includes(cell);
  }
  function place(index,level,state,cell,S) {
    if(!allows(index,'animal',cell))return {kind:'blocked'};
    const step=steps[index];
    if(step.id==='remove'){if(state.marks[cell]!==1)return {kind:'blocked'};S.animal(state,cell,level.animals);return {kind:'removed'};}
    if(state.marks[cell]===1){if(step.id!=='finish')return {kind:'blocked'};S.animal(state,cell,level.animals);return {kind:'removed'};}
    const trial=S.clone(state);if(!S.animal(trial,cell,level.animals))return {kind:'full'};
    const result=inspect(level,trial);if(result.rule)return {kind:'error',rule:result.rule};
    if(step.answers&&!step.answers.includes(cell))return {kind:'blocked'};
    S.animal(state,cell,level.animals);return {kind:'placed',head:state.heads[cell]};
  }
  function check(index,before,state,action) {
    const step=steps[index];
    if(step.id==='remove')return state.marks[1]===0&&action==='animal';
    if(step.kind==='undo')return action==='undo'&&state.marks[2]===0;
    if(step.id==='cross')return action==='cross'&&state.marks[2]===2;
    if(step.id==='erase')return action==='cross'&&state.marks[2]===0;
    if(step.kind==='drag')return action==='drag'&&step.targets.every(cell=>state.marks[cell]===2);
    if(step.kind==='notes')return ['cross','drag'].includes(action)&&step.targets.every(cell=>state.marks[cell]===2);
    if(step.id==='finish')return step.answers.every(cell=>state.marks[cell]===1);
    return action==='animal'&&state.marks.filter(v=>v===1).length===step.tokens;
  }
  function text(index,stage,lang) {const v=steps[index][lang];return {title:v[0],instruction:v[stage==='watch'?1:2].replace(/^À toi ! /,'').replace(/^Your turn! /,'')};}
  const api={version:3,steps,create,inspect,allows,place,check,text};
  if(typeof module!=='undefined')module.exports=api;else root.EnclosTraining=api;
})(typeof window!=='undefined'?window:globalThis);
