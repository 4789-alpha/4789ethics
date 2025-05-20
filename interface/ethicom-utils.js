
// ethicom-utils.js – Hilfsfunktionen für Interface-Anzeige

function renderBadge(currentRank, maxRank) {
  const badgeDisplay = document.getElementById("badge_display");
  if (!badgeDisplay) return;

  const main = document.createElement("span");
  main.className = `badge op-${currentRank.replace("OP-", "").replace(".", "")}`;
  main.textContent = currentRank;

  badgeDisplay.innerHTML = "";
  badgeDisplay.appendChild(main);

  if (parseFloat(maxRank.replace("OP-", "")) > parseFloat(currentRank.replace("OP-", ""))) {
    const shadow = document.createElement("span");
    shadow.className = "badge shadow";
    shadow.textContent = `max: ${maxRank}`;
    badgeDisplay.appendChild(shadow);
  }
}
