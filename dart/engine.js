/* Pure scoring rules, shared by the prototype and its tests. */
(function (root) {
  'use strict';
  function validDart(dart) {
    return Number.isInteger(dart.base) && Number.isInteger(dart.mult) &&
      ((dart.base >= 1 && dart.base <= 20 && dart.mult >= 1 && dart.mult <= 3) ||
       (dart.base === 25 && (dart.mult === 1 || dart.mult === 2)) ||
       (dart.base === 0 && dart.mult === 1));
  }
  function createGame(names, start = 501, out = 'double', board = 'steel') {
    if (!Array.isArray(names) || !names.length || names.length > 8 || names.some(n => typeof n !== 'string' || !n.trim())) throw Error('Bitte 1 bis 8 Spielernamen eingeben.');
    if (![301, 501, 701].includes(start) || !['double', 'single', 'master'].includes(out) || !['steel', 'soft'].includes(board)) throw Error('Ungültiger Spielmodus.');
    return {players: names.map(name => ({name: name.trim().slice(0,32), remaining: start})), start, out, board, active: 0, turnStart: start, turnDarts: 0, events: [], winner: null};
  }
  function nextTurn(game) {
    game.active = (game.active + 1) % game.players.length;
    game.turnStart = game.players[game.active].remaining;
    game.turnDarts = 0;
  }
  function throwDart(game, dart) {
    if (game.winner !== null) throw Error('Das Leg ist bereits beendet.');
    if (!validDart(dart)) throw Error('Ungültiger Dart.');
    const g = JSON.parse(JSON.stringify(game));
    const p = g.players[g.active];
    const points = dart.base * dart.mult;
    const remaining = p.remaining - points;
    const finish = g.out === 'single' || dart.mult === 2 || (g.out === 'master' && dart.mult === 3);
    const bust = remaining < 0 || (remaining === 1 && g.out !== 'single') || (remaining === 0 && !finish);
    g.events.push({player: g.active, base: dart.base, mult: dart.mult, points, bust, turnStart: g.turnStart, before: p.remaining});
    g.turnDarts++;
    if (bust) {p.remaining = g.turnStart; nextTurn(g);}
    else {p.remaining = remaining; if (remaining === 0) g.winner = g.active; else if (g.turnDarts === 3) nextTurn(g);}
    return g;
  }
  function stats(game, index) {
    const events = game.events.filter(e => e.player === index);
    // A bust voids the points from the whole visit, while thrown darts still count.
    const scored = game.start - game.players[index].remaining;
    return {darts: events.length, points: scored, average: events.length ? scored / events.length * 3 : 0, busts: events.filter(e => e.bust).length};
  }
  const api = {createGame, throwDart, nextTurn, validDart, stats};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DartEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
