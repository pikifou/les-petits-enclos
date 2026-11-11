(function (root) {
  'use strict';
  const bit = cell => 1n << BigInt(cell);
  function cells(mask) {
    const values = [];
    for (let cell = 0; mask; cell++, mask >>= 1n) if (mask & 1n) values.push(cell);
    return values;
  }
  function model(level) {
    const n = level.size, groups = Array.from({ length: n * 3 }, () => 0n);
    for (let cell = 0; cell < n * n; cell++) {
      const row = Math.floor(cell / n), column = cell % n;
      groups[row] |= bit(cell); groups[n + column] |= bit(cell); groups[2 * n + level.regions[cell]] |= bit(cell);
    }
    const conflicts = [];
    for (let cell = 0; cell < n * n; cell++) {
      const row = Math.floor(cell / n), column = cell % n;
      let mask = groups[row] | groups[n + column] | groups[2 * n + level.regions[cell]];
      for (let r = Math.max(0, row - 1); r <= Math.min(n - 1, row + 1); r++) {
        for (let c = Math.max(0, column - 1); c <= Math.min(n - 1, column + 1); c++) mask |= bit(r * n + c);
      }
      conflicts.push(mask);
    }
    return { n, groups, conflicts, full: (1n << BigInt(n * n)) - 1n };
  }
  function inspect(level, marks) {
    const n = level.size, occupied = [], invalid = new Set();
    let rule = null;
    marks.forEach((mark, cell) => { if (mark === 1) occupied.push(cell); });
    for (let i = 0; i < occupied.length; i++) {
      for (let j = i + 1; j < occupied.length; j++) {
        const a = occupied[i], b = occupied[j], ar = Math.floor(a / n), br = Math.floor(b / n), ac = a % n, bc = b % n;
        let conflict = null;
        if (ar === br) conflict = 'row';
        else if (ac === bc) conflict = 'column';
        else if (level.regions[a] === level.regions[b]) conflict = 'region';
        else if (Math.abs(ar - br) <= 1 && Math.abs(ac - bc) <= 1) conflict = 'touch';
        if (conflict) { invalid.add(a); invalid.add(b); rule = rule || conflict; }
      }
    }
    return { count: occupied.length, invalid: [...invalid], rule, won: occupied.length === n && !invalid.size };
  }
  function nextBasic(data, candidates, placed) {
    const remaining = data.groups.map((group, index) => ({ group, index, options: group & candidates })).filter(unit => !(unit.group & placed));
    const blocked = remaining.find(unit => !unit.options);
    if (blocked) return { kind: 'contradiction', group: blocked.index };
    for (const unit of remaining) {
      if (!(unit.options & (unit.options - 1n))) return { kind: 'place', cell: cells(unit.options)[0], group: unit.index, technique: 0 };
    }
    for (const unit of remaining) {
      let common = data.full;
      for (const cell of cells(unit.options)) common &= data.conflicts[cell];
      const removal = common & candidates & ~unit.group;
      if (removal) return { kind: 'remove', cells: cells(removal), group: unit.index, technique: 1 };
    }
    return null;
  }
  function inconsistent(data, candidates, placed) {
    let steps = 0;
    while (true) {
      const action = nextBasic(data, candidates, placed);
      if (!action) return { impossible: false, steps };
      if (action.kind === 'contradiction') return { impossible: true, steps, group: action.group };
      if (action.kind === 'place') { placed |= bit(action.cell); candidates &= ~data.conflicts[action.cell]; }
      else for (const cell of action.cells) candidates &= ~bit(cell);
      steps++;
    }
  }
  function hint(level, marks) {
    const state = inspect(level, marks);
    if (state.rule) return { kind: 'conflict', rule: state.rule, cells: state.invalid };
    if (state.won) return { kind: 'won' };
    const data = model(level);
    let candidates = data.full, placed = 0n;
    marks.forEach((mark, cell) => {
      if (mark === 1) { placed |= bit(cell); candidates &= ~data.conflicts[cell]; }
      if (mark === 2) candidates &= ~bit(cell);
    });
    const action = nextBasic(data, candidates, placed);
    if (action) return action;
    for (const cell of cells(candidates)) {
      const trial = inconsistent(data, candidates & ~data.conflicts[cell], placed | bit(cell));
      if (trial.impossible) return { kind: 'remove', cells: [cell], group: trial.group, technique: 2, steps: trial.steps };
    }
    return { kind: 'stuck' };
  }
  const Logic = { inspect, hint };
  if (typeof module !== 'undefined') module.exports = Logic;
  else root.PlacementLogic = Logic;
})(typeof window !== 'undefined' ? window : globalThis);
