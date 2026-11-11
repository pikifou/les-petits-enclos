const {test}=require('node:test'),assert=require('node:assert/strict');
const T=require('../src/training.js'),S=require('../src/state.js');
test('dix missions progressives avec objectifs contrôlés et actions réelles',()=>{
  assert.equal(T.steps.length,10);
  for(let index=0;index<T.steps.length;index++){
    const {level,state}=T.create(index,S),before=S.clone(state);
    assert.equal(T.check(index,0,before,state,'none').done,false);
    for(const lang of ['fr','en']){assert.ok(T.text(index,0,lang).title);assert.ok(T.text(index,0,lang).instruction);}
    if(index===0)S.animal(state,2,4);
    else if(index===1){S.animal(state,2,4);assert.equal(T.check(index,0,before,state,'animal').phase,1);assert.equal(T.check(index,0,before,state,'animal').done,false);S.animal(state,2,4);assert.equal(T.check(index,1,before,state,'animal').done,false);assert.equal(T.check(index,1,before,state,'undo').done,true);continue;}
    else if(index===2){S.cross(state,6,2);assert.equal(T.check(index,0,before,state,'cross').phase,1);const crossed=S.clone(state);S.cross(state,6,0);assert.equal(T.check(index,1,crossed,state,'cross').done,true);continue;}
    else if(index===3||index===4){for(const cell of T.steps[index].focus)S.cross(state,cell,2);assert.equal(T.check(index,0,before,state,'cross').done,false);assert.equal(T.check(index,0,before,state,'drag').done,true);continue;}
    else if(index===5)S.animal(state,2,4);
    else if(index===6)S.animal(state,4,4);
    else if(index===7)S.animal(state,11,4);
    else if(index===8)S.animal(state,2,4);
    else for(const [row,col]of level.solution.entries())S.animal(state,row*4+col,4);
    assert.equal(T.check(index,0,before,state,'animal').done,true,`mission ${index+1}`);
  }
});
