const {test}=require('node:test'),assert=require('node:assert/strict');
const T=require('../src/training.js'),S=require('../src/state.js');
test('12 grilles dédiées, progression des formes et seules règles déjà introduites',()=>{
 assert.equal(T.steps.length,12);
 assert.deepEqual(T.steps.map(s=>[s.rows,s.cols]),[[1,4],[1,4],[1,4],[1,4],[1,4],[1,4],[4,1],[2,4],[2,4],[3,4],[3,4],[4,4]]);
 for(let i=0;i<T.steps.length;i++){
  const {level,state}=T.create(i,S);assert.equal(state.marks.length,level.rows*level.cols);assert.equal(state.heads.length,state.marks.length);
  assert.equal(T.inspect(level,state).rule,null);assert.equal(T.check(i,S.clone(state),state,'none'),false);
  for(const lang of ['fr','en'])for(const phase of ['watch','try'])assert.ok(T.text(i,phase,lang).instruction);
  assert.deepEqual(S.restore(level,state),state);
 }
 assert.deepEqual(T.steps[7].rules,['row']);assert.deepEqual(T.steps[8].rules,['row','column']);
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
 const targets=[1,1,null,2,2,null,null,7,7,8,2,null];
 for(let i=0;i<T.steps.length;i++){
  const {level,state,history}=T.create(i,S),before=S.clone(state),step=T.steps[i];let action=step.kind;
  if(step.kind==='animal'){
   for(const cell of step.answers||[targets[i]]){const result=T.place(i,level,state,cell,S);assert.ok(['placed','removed'].includes(result.kind));}
  }else if(step.kind==='undo')Object.assign(state,S.clone(history[0]));
  else if(step.kind==='cross')S.cross(state,2,step.id==='erase'?0:2);
  else {step.targets.forEach(cell=>S.cross(state,cell,2));assert.equal(T.check(i,before,state,'cross'),false);}
  assert.equal(T.check(i,before,state,action),true,step.id);
 }
 const {level,state}=T.create(8,S);assert.equal(T.place(8,level,state,5,S).rule,'column');
 const space=T.create(10,S);assert.equal(T.place(10,space.level,space.state,1,S).rule,'touch');
});
