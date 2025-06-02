
// ethicom-utils.js – Hilfsfunktionen für Interface-Anzeige

function getReadmePath(lang) {
  const prefix = window.location.pathname.includes('/interface/') ? '..' : '.';
  return lang === 'en'
    ? `${prefix}/README.md`
    : `${prefix}/i18n/README.${lang}.md`;
}

function renderBadge(currentRank, maxRank) {
  const badgeDisplay = document.getElementById("badge_display");
  if (!badgeDisplay) return;

  const mainSpan = document.createElement("span");
  mainSpan.className = `badge op-${currentRank.replace("OP-", "").replace(".", "")}`;
  mainSpan.textContent = currentRank;

  const lang = localStorage.getItem('ethicom_lang') || document.documentElement.lang || 'de';
  const mainLink = document.createElement("a");
  mainLink.href = `${getReadmePath(lang)}#${currentRank.toLowerCase().replace(/\./g, '-')}`;
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

  const lang = localStorage.getItem('ethicom_lang') || document.documentElement.lang || 'de';
  gallery.innerHTML = "";
  levels.forEach(lvl => {
    const span = document.createElement("span");
    span.className = `badge op-${lvl.replace("OP-", "").replace(/\./g, "")}`;
    span.textContent = lvl;
    const link = document.createElement("a");
    link.href = `${getReadmePath(lang)}#${lvl.toLowerCase().replace(/\./g, '-')}`;
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

// Use shared OP helpers
let opLevelToNumber;
let getStoredOpLevel;
if (typeof module !== 'undefined' && module.exports) {
  ({ opLevelToNumber, getStoredOpLevel } = require('../utils/op-level.js'));
} else if (typeof window !== 'undefined') {
  ({ opLevelToNumber, getStoredOpLevel } = window);
}

function showLoadingBadge(level) {
  const container = document.getElementById("loading_badge");
  if (!container) return;
  const span = container.querySelector("span");
  const lvl = level || "OP-0";
  if (span) {
    span.textContent = lvl;
    span.className = `badge op-${lvl.replace("OP-", "").replace(/\./g, "")} loading-badge`;
  }
  container.style.display = "block";
}

function hideLoadingBadge() {
  const container = document.getElementById("loading_badge");
  if (container) container.style.display = "none";
}

window.getStoredOpLevel = getStoredOpLevel;
window.opLevelToNumber = opLevelToNumber;
window.getReadmePath = getReadmePath;
window.showLoadingBadge = showLoadingBadge;
window.hideLoadingBadge = hideLoadingBadge;

