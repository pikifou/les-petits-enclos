(function(root) {
  'use strict';
  const palette = ['#e5bd62','#a4cbb0','#b7a1d7','#e6a08c','#93bdd9','#d1ca8d','#d6a0bf','#83b6b1'];
  function fresh(level) {
    return {marks: Array(level.size**2).fill(0), heads: Array(level.size**2).fill(-1), selected: 0};
  }
  const clone = state => ({marks: [...state.marks], heads: [...state.heads], selected: state.selected});
  function restore(level, data) {
    const state = fresh(level), used = new Set();
    if (!data || !Array.isArray(data.marks)) return state;
    state.marks.forEach((_, i) => {
      const mark = data.marks[i], head = data.heads?.[i];
      if (mark === 2) state.marks[i] = 2;
      if (mark === 1 && Number.isInteger(head) && head >= 0 && head < level.size && !used.has(head)) {
        state.marks[i] = 1; state.heads[i] = head; used.add(head);
      }
    });
    state.selected = Number.isInteger(data.selected) && data.selected >= 0 && data.selected < level.size && !used.has(data.selected) ? data.selected : nextFree(state, level.size);
    return state;
  }
  function nextFree(state, n) {
    for (let id = 0; id < n; id++) if (!state.heads.includes(id)) return id;
    return -1;
  }
  function cross(state, cell, value) {
    if (state.marks[cell] === 1) return false;
    state.marks[cell] = value; state.heads[cell] = -1;
    return true;
  }
  function animal(state, cell, n) {
    if (state.marks[cell] === 1) {
      const returned = state.heads[cell]; state.marks[cell] = 0; state.heads[cell] = -1; state.selected = returned;
      return true;
    }
    let head = state.selected;
    if (head < 0 || state.heads.includes(head)) head = nextFree(state, n);
    if (head < 0) return false;
    state.marks[cell] = 1; state.heads[cell] = head; state.selected = nextFree(state, n);
    return true;
  }
  // The UI receives only a rule key. Solver coordinates never cross this boundary.
  function lesson(level, state, logic) {
    const action = logic.hint(level, state.marks);
    if (action.kind === 'conflict') return action.rule;
    if (action.kind === 'place') return 'single';
    if (action.kind === 'remove') return action.technique === 2 ? 'hypothesis' : 'blocked';
    if (action.kind === 'contradiction') return 'possible';
    return action.kind === 'won' ? 'won' : 'stuck';
  }
  const api = {fresh, clone, restore, cross, animal, nextFree, lesson, palette};
  if (typeof module !== 'undefined') module.exports = api;
  else root.EnclosState = api;
})(typeof window !== 'undefined' ? window : globalThis);
