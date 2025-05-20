// trust-demotion-engine.js
// Erkennung systematischer Bewertungsfehler – automatischer Vorschlag zur OP-Herabstufung

function evaluateDemotion(operatorData, evaluations) {
  const minForReview = 5;
  const minContradictions = 3;
  const demotionResult = {
    demote: false,
    reason: "",
    affected_sources: [],
    lock_until: null
  };

  if (!Array.isArray(evaluations) || evaluations.length < minForReview) return demotionResult;

  const contradicting = evaluations.filter(e =>
    e.verified === false || e.overridden_by_op5plus === true
  );

  if (contradicting.length >= minContradictions) {
    demotionResult.demote = true;
    demotionResult.reason = "Mindestens drei Bewertungen wurden durch höherstufige Operatoren widersprochen.";
    demotionResult.affected_sources = contradicting.map(e => e.source_id);

    const now = new Date();
    now.setDate(now.getDate() + 21);
    demotionResult.lock_until = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  }

  return demotionResult;
}

// Beispiel:
// const result = evaluateDemotion(operatorProfile, evaluationList);
// if (result.demote) console.log("Abstufung empfohlen:", result);
