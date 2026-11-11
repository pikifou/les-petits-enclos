const {test}=require('node:test'),assert=require('node:assert/strict');
const T=require('../src/training.js'),S=require('../src/state.js');
test('15 grilles dédiées sans retrait, progression des formes et seules règles déjà introduites',()=>{
 assert.equal(T.steps.length,15);assert.equal(T.steps.some(step=>step.id==='remove'),false);assert.equal(T.steps[1].id,'undo');
 assert.deepEqual(T.steps.map(s=>[s.rows,s.cols]),[[1,4],[1,4],[1,4],[1,4],[1,4],[4,1],[2,4],[4,2],[3,4],[3,4],[5,5],[5,5],[5,5],[5,5],[4,4]]);
 for(let i=0;i<T.steps.length;i++){
  const {level,state}=T.create(i,S);assert.equal(state.marks.length,level.rows*level.cols);assert.equal(state.heads.length,state.marks.length);
  assert.equal(T.inspect(level,state).rule,null);assert.equal(T.check(i,S.clone(state),state,'none'),false);
  for(const lang of ['fr','en'])for(const phase of ['watch','try'])assert.ok(T.text(i,phase,lang).instruction);
  assert.deepEqual(S.restore(level,state),state);
 }
 assert.deepEqual(T.steps[6].rules,['row']);assert.deepEqual(T.steps[7].rules,['row','column']);
});
test('aucun animal hors cible et aucune modification en cas de refus',()=>{
 for(let i=0;i<T.steps.length;i++){
  const step=T.steps[i];
  for(let cell=0;cell<step.rows*step.cols;cell++){
   const {level,state}=T.create(i,S),before=S.clone(state),result=T.place(i,level,state,cell,S);
   if(step.kind!=='animal'||step.targets&&!step.targets.includes(cell)){assert.equal(result.kind,'blocked');assert.deepEqual(state,before);}
  }
 }
});
test('chaque objectif valide la vraie action attendue',()=>{
 const targets=[1,null,2,2,null,null,7,7,8,2];
 for(let i=0;i<T.steps.length;i++){
  const {level,state,history}=T.create(i,S),before=S.clone(state),step=T.steps[i];let action=step.kind;
  if(step.kind==='animal'){
   for(const cell of step.answers||[targets[i]]){const result=T.place(i,level,state,cell,S);assert.ok(['placed','removed'].includes(result.kind));}
  }else if(step.kind==='undo')Object.assign(state,S.clone(history[0]));
  else if(step.kind==='cross')S.cross(state,2,step.id==='erase'?0:2);
  else {step.targets.forEach(cell=>S.cross(state,cell,2));if(step.kind==='drag')assert.equal(T.check(i,before,state,'cross'),false);else action='cross';}
  assert.equal(T.check(i,before,state,action),true,step.id);
 }
 const {level,state}=T.create(7,S);assert.equal(T.place(7,level,state,6,S).rule,'column');assert.equal(T.place(7,level,state,7,S).kind,'placed');
 const space=T.create(9,S);assert.equal(T.place(9,space.level,space.state,1,S).rule,'touch');
});
test('la suppression du retrait conserve les missions acquises et décale la reprise',()=>{
 const session={index:8,revision:2,stage:'try',state:{marks:[1,0,0,0,0,0,0,0]},done:false},old={version:3,completed:[0,1,2,7],session};
 const migrated=T.migrate(old);assert.equal(migrated.version,T.version);assert.deepEqual(migrated.completed,[0,1,6]);assert.equal(migrated.session.index,7);assert.equal(migrated.session.state,session.state);assert.equal(session.index,8);
 assert.deepEqual(T.migrate({...old,session:{index:1,state:{marks:[0,1,0,0]},done:true}}).session,{index:1});
 assert.equal(T.migrate(migrated),migrated);assert.deepEqual(T.migrate(null),{});
});
test('le travail pratique élimine exactement la ligne, la colonne et les huit voisines du chat',()=>{
 const index=T.steps.findIndex(step=>step.id==='exclude-all'),step=T.steps[index],{level,state}=T.create(index,S);
 const cat=step.animals[0],row=Math.floor(cat/level.cols),col=cat%level.cols;
 assert.ok(row>=2&&row<level.rows-2&&col>=2&&col<level.cols-2,'deux cases de chaque côté du chat pour dépasser les voisines');
 const expected=[];
 for(let cell=0;cell<level.rows*level.cols;cell++){
  const r=Math.floor(cell/level.cols),c=cell%level.cols;
  if(cell!==cat&&(r===row||c===col||Math.abs(r-row)<=1&&Math.abs(c-col)<=1))expected.push(cell);
 }
 assert.deepEqual(step.targets,expected);assert.equal(expected.length,12);assert.equal(state.marks[cat],1);assert.equal(step.species,'chats');
 assert.equal(T.allows(index,'animal',cat),false);
 const free=state.marks.flatMap((_,cell)=>cell!==cat&&!expected.includes(cell)?[cell]:[]);assert.equal(free.length,12);
 for(const cell of free)assert.equal(T.allows(index,'cross',cell),false);
 for(const id of ['exclude-row','exclude-column','exclude-corners']){
  const part=T.steps.find(s=>s.id===id),partTargets=expected.filter(cell=>id==='exclude-row'?Math.floor(cell/level.cols)===row:id==='exclude-column'?cell%level.cols===col:Math.floor(cell/level.cols)!==row&&cell%level.cols!==col);
  assert.deepEqual(part.targets,partTargets);assert.equal(part.rows,level.rows);assert.equal(part.cols,level.cols);assert.deepEqual(part.animals,[cat]);
 }
 const before=S.clone(state);for(const cell of expected.slice(0,-1))S.cross(state,cell,2);assert.equal(T.check(index,before,state,'cross'),false);
 S.cross(state,expected.at(-1),2);assert.equal(T.check(index,before,state,'cross'),true);for(const cell of free)assert.equal(state.marks[cell],0);
});
