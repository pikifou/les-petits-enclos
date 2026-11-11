const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const Logic=require('../src/logic.js'), S=require('../src/state.js');
const scope={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/../src/levels.js','utf8'),scope);
const levels=JSON.parse(JSON.stringify(scope.window.PUZZLES.levels));
function solutions(level) {
  const answers=[],n=level.size;
  function visit(row,cols,zones,chosen) {
    if(answers.length>1)return;
    if(row===n){answers.push(chosen);return;}
    for(let c=0;c<n;c++){
      const zone=level.regions[row*n+c];
      if(cols.has(c)||zones.has(zone)||row&&Math.abs(c-chosen[row-1])<=1)continue;
      visit(row+1,new Set([...cols,c]),new Set([...zones,zone]),[...chosen,c]);
    }
  }
  visit(0,new Set(),new Set(),[]);return answers;
}
test('200 grilles uniques, enclos connexes, difficulté mesurée croissante, déductions justes',()=>{
  assert.equal(levels.length,200);let score=-1;
  for(const level of levels){
    const n=level.size;assert.deepEqual(solutions(level),[level.solution],`solution ${level.id}`);
    assert.ok(level.rating.score>=score);score=level.rating.score;
    for(let zone=0;zone<n;zone++){
      const cells=level.regions.flatMap((z,i)=>z===zone?[i]:[]),seen=new Set(),queue=[cells[0]];
      while(queue.length){const i=queue.pop();if(seen.has(i))continue;seen.add(i);const r=Math.floor(i/n),c=i%n;for(const [a,b]of[[r-1,c],[r+1,c],[r,c-1],[r,c+1]])if(a>=0&&a<n&&b>=0&&b<n&&level.regions[a*n+b]===zone)queue.push(a*n+b);}
      assert.equal(seen.size,cells.length);
    }
    const marks=Array(n*n).fill(0),answer=new Set(level.solution.map((c,r)=>r*n+c));
    let steps=0;
    while(!Logic.inspect(level,marks).won&&steps++<250){
      const state={...S.fresh(level),marks},before=JSON.stringify(state),lesson=S.lesson(level,state,Logic);assert.equal(typeof lesson,'string');assert.equal(JSON.stringify(state),before);
      const action=Logic.hint(level,marks);
      if(action.kind==='place'){assert.ok(answer.has(action.cell));marks[action.cell]=1;}
      else {assert.equal(action.kind,'remove');for(const cell of action.cells){assert.ok(!answer.has(cell));marks[cell]=2;}}
    }
    assert.ok(Logic.inspect(level,marks).won,`résolution ${level.id}`);
  }
});
test('huit identités stables, retour, annulation et sauvegarde abîmée',()=>{
  const level=levels.find(l=>l.size===8),s=S.fresh(level),snapshots=[];
  for(let i=0;i<8;i++){snapshots.push(S.clone(s));S.animal(s,i,8);}
  assert.equal(new Set(s.heads.filter(h=>h>=0)).size,8);assert.equal(S.animal(s,9,8),false);
  S.animal(s,2,8);assert.equal(s.selected,2);S.animal(s,10,8);assert.equal(s.heads[10],2);
  assert.equal(s.heads[3],3);assert.deepEqual(S.restore(level,JSON.parse(JSON.stringify(s))),s);
  const before=S.clone(s);S.cross(s,3,2);assert.deepEqual(s,before,'une peinture ne remplace pas un animal');
  const corrupt=S.clone(s);corrupt.heads[1]=corrupt.heads[0];corrupt.selected=999;
  const recovered=S.restore(level,corrupt);assert.equal(new Set(recovered.heads.filter(h=>h>=0)).size,recovered.marks.filter(m=>m===1).length);
  assert.deepEqual(S.restore(level,null),S.fresh(level));assert.equal(snapshots[3].heads[2],2);
});
test('les diagonales éloignées sont permises et les coins voisins interdits',()=>{
  const level={size:4,regions:Array.from({length:16},(_,i)=>Math.floor(i/4))};
  let marks=Array(16).fill(0);marks[1]=marks[11]=1;assert.equal(Logic.inspect(level,marks).rule,null);
  marks=Array(16).fill(0);marks[0]=marks[5]=1;assert.equal(Logic.inspect(level,marks).rule,'touch');
});
