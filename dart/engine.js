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
    else {p.remaining = remaining; if (remaining === 0) {g.winner = g.active;if(g.series){g.series.wins[g.active]++;if(g.series.wins[g.active]>=g.series.target)g.series.winner=g.active;}} else if (g.turnDarts === 3) nextTurn(g);}
    return g;
  }
  function createMatch(names, start, out, board, bestOf=3, starter=0) {
    if (![1,3,5,7,9,11].includes(bestOf) || !Number.isInteger(starter) || starter<0 || starter>=names.length) throw Error('Ungültige Matchoptionen.');
    const g=createGame(names,start,out,board);g.active=starter;
    g.series={bestOf,target:(bestOf+1)/2,wins:names.map(()=>0),number:1,starter,winner:null};return g;
  }
  function nextLeg(game) {
    if(game.winner===null || !game.series || game.series.winner!==null) throw Error('Kein weiteres Leg verfügbar.');
    const g=createGame(game.players.map(p=>p.name),game.start,game.out,game.board);
    g.series=JSON.parse(JSON.stringify(game.series));g.series.number++;g.series.starter=(g.series.starter+1)%g.players.length;g.active=g.series.starter;return g;
  }
  function checkout(remaining, darts=3, out='double') {
    if(!Number.isInteger(remaining)||(remaining<2&&out!=='single')||remaining<1||!Number.isInteger(darts)||darts<1||darts>3||!['single','double','master'].includes(out))return null;
    const hit=(base,mult)=>({base,mult,label:base===25?(mult===2?'Bull':'25'):['','S','D','T'][mult]+base});
    const doubles=[20,16,18,12,10,8,6,4,2,1,19,17,15,14,13,11,9,7,5,3].map(n=>hit(n,2));doubles.push(hit(25,2));
    const setup=[...Array.from({length:20},(_,i)=>hit(20-i,3)),...Array.from({length:20},(_,i)=>hit(20-i,1)),hit(25,1),...doubles];
    const finishes=out==='double'?doubles:out==='master'?[...doubles,...setup.filter(d=>d.mult===3)]:[...doubles,...setup];
    const last=new Map();for(const d of finishes)if(!last.has(d.base*d.mult))last.set(d.base*d.mult,d);
    const search=(r,n)=>{if(n===1)return last.has(r)?[last.get(r)]:null;for(const d of setup){const rest=r-d.base*d.mult;if(rest<1||(rest===1&&out!=='single'))continue;const tail=search(rest,n-1);if(tail)return [d,...tail];}return null;};
    for(let n=1;n<=darts;n++){if(remaining>180||out==='double'&&remaining>170)break;const route=search(remaining,n);if(route)return route;}return null;
  }
  function stats(game, index) {
    const events = game.events.filter(e => e.player === index);
    // A bust voids the points from the whole visit, while thrown darts still count.
    const scored = game.start - game.players[index].remaining;
    return {darts: events.length, points: scored, average: events.length ? scored / events.length * 3 : 0, busts: events.filter(e => e.bust).length};
  }
  const api = {createGame, throwDart, nextTurn, validDart, stats, createMatch, nextLeg, checkout};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DartEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
