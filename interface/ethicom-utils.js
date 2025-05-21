
// ethicom-utils.js – Hilfsfunktionen für Interface-Anzeige

function renderBadge(currentRank, maxRank) {
  const badgeDisplay = document.getElementById("badge_display");
  if (!badgeDisplay) return;

  const mainSpan = document.createElement("span");
  mainSpan.className = `badge op-${currentRank.replace("OP-", "").replace(".", "")}`;
  mainSpan.textContent = currentRank;

  const mainLink = document.createElement("a");
  mainLink.href = `README.html#${currentRank.toLowerCase().replace(/\./g, '-')}`;
  mainLink.appendChild(mainSpan);

  badgeDisplay.innerHTML = "";
  badgeDisplay.appendChild(mainLink);

  if (parseFloat(maxRank.replace("OP-", "")) > parseFloat(currentRank.replace("OP-", ""))) {
    const shadow = document.createElement("span");
    shadow.className = "badge shadow";
    shadow.textContent = `max: ${maxRank}`;
    badgeDisplay.appendChild(shadow);
  }
}

// Display all available badges in a gallery
function renderAllBadges() {
  const gallery = document.getElementById("badge_gallery");
  if (!gallery) return;

  const levels = [
    "OP-0",
    "OP-1",
    "OP-2",
    "OP-3",
    "OP-4",
    "OP-5",
    "OP-6",
    "OP-7",
    "OP-8",
    "OP-9",
    "OP-10",
    "OP-11",
    "OP-12"
  ];

  gallery.innerHTML = "";
  levels.forEach(lvl => {
    const span = document.createElement("span");
    span.className = `badge op-${lvl.replace("OP-", "").replace(/\./g, "")}`;
    span.textContent = lvl;
    const link = document.createElement("a");
    link.href = `README.html#${lvl.toLowerCase().replace(/\./g, '-')}`;
    link.appendChild(span);
    gallery.appendChild(link);
  });
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

// Return HTML for a help icon with tooltip text
function help(text) {
  const safe = String(text).replace(/"/g, "&quot;");
  return `<span class="help-icon" title="${safe}">?</span>`;
}

// Retrieve stored OP level from localStorage
function getStoredOpLevel() {
  try {
    const sig = JSON.parse(localStorage.getItem("ethicom_signature") || "{}");
    return sig.op_level || null;
  } catch (err) {
    return null;
  }
}

// Convert OP-level string to numeric value (OP-8 → 8)
function opLevelToNumber(level) {
  if (!level) return 0;
  const n = parseFloat(String(level).replace("OP-", ""));
  return isNaN(n) ? 0 : n;
}

window.getStoredOpLevel = getStoredOpLevel;
window.opLevelToNumber = opLevelToNumber;
