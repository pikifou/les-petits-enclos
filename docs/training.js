(function(root) {
  'use strict';
  const base={size:4,regions:[0,0,0,0,1,0,0,0,3,0,0,2,3,3,2,2],solution:[2,0,3,1]};
  const steps=[
    {id:'place',animals:[],focus:[2],fr:['Pose un animal','Reste appuyé sur la case entourée, ou fais un double appui, pour y poser une luciole.'],en:['Place an animal','Hold the outlined square, or double tap it, to place a firefly.']},
    {id:'undo',animals:[2],focus:[2],fr:['Retire, puis annule','Reste appuyé sur la luciole, ou fais un double appui, pour la retirer.','Appuie maintenant sur Annuler pour retrouver la luciole.'],en:['Remove, then undo','Hold the firefly, or double tap it, to remove it.','Now press Undo to bring the firefly back.']},
    {id:'cross',animals:[],focus:[6],fr:['Une croix, puis plus de croix','Fais un appui bref sur la case entourée pour y mettre une croix.','Fais un nouvel appui bref sur la croix pour l’effacer.'],en:['Mark, then erase','Tap the outlined square briefly to mark a cross.','Tap the cross briefly again to erase it.']},
    {id:'drag-row',animals:[],focus:[0,1,2,3],fr:['Glisse sur une ligne','Pars d’une case vide de la ligne entourée, garde le doigt posé et glisse sur ses quatre cases pour tracer des croix.'],en:['Drag across a row','Start on an empty square of the outlined row, keep your finger down and drag across its four squares to mark crosses.']},
    {id:'drag-column',animals:[],focus:[0,4,8,12],fr:['Glisse dans une colonne','Pars d’une case vide de la colonne entourée, garde le doigt posé et glisse sur ses quatre cases.'],en:['Drag down a column','Start on an empty square of the outlined column, keep your finger down and drag across its four squares.']},
    {id:'row',animals:[4,11,13],focus:[0,1,2,3],fr:['Un animal par ligne','Il manque une luciole sur la ligne du haut. Trouve sa place : chaque ligne accueille un seul animal.'],en:['One animal per row','The top row is missing a firefly. Find its place: each row has just one animal.']},
    {id:'column',animals:[2,11,13],focus:[0,4,8,12],fr:['Un animal par colonne','Il manque une luciole dans la colonne de gauche. Chaque colonne accueille un seul animal.'],en:['One animal per column','The left column is missing a firefly. Each column has just one animal.']},
    {id:'region',animals:[2,4,13],focus:[11,14,15],fr:['Un animal par enclos','L’enclos violet est encore vide. Trouve où poser sa luciole : un seul animal par couleur.'],en:['One animal per enclosure','The purple enclosure is still empty. Find its firefly’s place: just one animal per color.']},
    {id:'touch',animals:[4,11],focus:[0,1,2,3],fr:['Même par un coin','Pose une luciole sur la ligne du haut. Elle ne doit toucher aucun voisin, même en diagonale.'],en:['Even at a corner','Place a firefly in the top row. It must not touch any neighbor, even diagonally.']},
    {id:'finish',animals:[],focus:[],fr:['À toi de tout ranger','Complète cette petite grille avec les quatre règles. Annuler et Indice peuvent t’aider.'],en:['Settle everyone in','Complete this little grid using all four rules. Undo and Hint can help you.']}
  ];
  function create(index, stateAPI) {
    const step=steps[index],level={...base,regions:[...base.regions],solution:[...base.solution]},state=stateAPI.fresh(level);
    for(const cell of step.animals)stateAPI.animal(state,cell,level.size);
    return {level,state};
  }
  function check(index,phase,before,state,action) {
    const id=steps[index].id;
    if(id==='place')return {phase,done:state.marks[2]===1};
    if(id==='undo')return {phase:phase===0&&state.marks[2]===0?1:phase,done:phase===1&&action==='undo'&&state.marks[2]===1};
    if(id==='cross')return {phase:phase===0&&state.marks[6]===2?1:phase,done:phase===1&&before.marks[6]===2&&state.marks[6]===0&&action==='cross'};
    if(id==='drag-row'||id==='drag-column')return {phase,done:action==='drag'&&steps[index].focus.every(cell=>state.marks[cell]===2)};
    const target={row:2,column:4,region:11,touch:2}[id];
    return {phase,done:id==='finish'?base.solution.every((col,row)=>state.marks[row*4+col]===1):state.marks[target]===1};
  }
  function text(index,phase,lang) {const values=steps[index][lang];return {title:values[0],instruction:values[Math.min(1+phase,values.length-1)]};}
  const api={steps,create,check,text};
  if(typeof module!=='undefined')module.exports=api;else root.EnclosTraining=api;
})(typeof window!=='undefined'?window:globalThis);
