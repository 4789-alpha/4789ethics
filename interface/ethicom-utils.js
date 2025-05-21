
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

// Calculate a SHA-256 hash in both browser and Node.js environments
async function sha256(message) {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const data = new TextEncoder().encode(message);
    const buffer = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  if (typeof require !== "undefined") {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(message).digest("hex");
  }

  throw new Error("SHA-256 hashing not supported in this environment");
}
