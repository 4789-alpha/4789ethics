
// ethicom-consensus.js
// Berechnet anonyme Konsensbewertung auf Basis von SRC-Level-Stimmen

function computeAnonymousConsensus(votes) {
  const srcMap = {
    "SRC-0": 0, "SRC-1": 1, "SRC-2": 2,
    "SRC-3": 3, "SRC-4": 4, "SRC-5": 5,
    "SRC-6": 6, "SRC-7": 7, "SRC-8+": 8
  };

  const reverseMap = Object.fromEntries(Object.entries(srcMap).map(([k,v]) => [v,k]));

  const values = votes.map(v => srcMap[v.src_lvl] || 0);
  const total = values.reduce((a, b) => a + b, 0);
  const count = values.length;
  const average = count > 0 ? total / count : 0;
  const weight = +(average / 2).toFixed(2);
  const derived_level = reverseMap[Math.round(average)] || `SRC-${Math.round(average)}`;

  return {
    derived_src_level: derived_level,
    numeric_average: +average.toFixed(2),
    consensus_weight: weight,
    total_votes: count
  };
}

// Beispielverwendung:
// const result = computeAnonymousConsensus([{src_lvl: "SRC-3"}, {src_lvl: "SRC-4"}, ...]);
// console.log(result);
