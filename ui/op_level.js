// Display operator level from user data
fetch('../users/operator_levels.json')
  .then(r => r.json())
  .then(data => {
    document.getElementById('op-level').textContent = `OP-Level: ${data.OP1}`;
  })
  .catch(() => {});
