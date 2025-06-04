
// ethicom-utils.js – Hilfsfunktionen für Interface-Anzeige
(function() {
  const FG_OPACITY_MAX = 65;
  function setForegroundOpacity(percent) {
    let p = parseInt(percent, 10);
    if (isNaN(p)) p = 0;
    if (p < 0) p = 0;
    if (p > FG_OPACITY_MAX) p = FG_OPACITY_MAX;
    document.documentElement.style.setProperty('--foreground-opacity', (p / 100).toString());
  }
  function applyTextColor(obj) {
    if (!obj) return;
    const css = `rgb(${obj.r},${obj.g},${obj.b})`;
    document.documentElement.style.setProperty('--text-color', css);
  }

  function applyStoredColors() {
    try {
      const custom = JSON.parse(localStorage.getItem('ethicom_colors') || '{}');
      if (custom && typeof custom === 'object') {
        Object.entries(custom).forEach(([name, val]) => {
          document.documentElement.style.setProperty(name, String(val));
        });
      }
    } catch {}

    try {
      const bg = JSON.parse(localStorage.getItem('ethicom_bg_color') || 'null');
      if (bg) {
        const val = `rgb(${bg.r},${bg.g},${bg.b})`;
        document.documentElement.style.setProperty('--bg-color', val);
        if (document.body) document.body.style.setProperty('--bg-color', val);
      }
    } catch {}

    try {
      const mod = JSON.parse(
        localStorage.getItem('ethicom_module_color') || 'null'
      );
      if (mod) {
        document.documentElement.style.setProperty(
          '--module-color',
          `rgb(${mod.r},${mod.g},${mod.b})`
        );
      }
    } catch {}

    try {
      const tanna = JSON.parse(
        localStorage.getItem('ethicom_tanna_color') || 'null'
      );
      if (
        tanna &&
        (document.body.classList.contains('theme-tanna') ||
          document.body.classList.contains('theme-tanna-dark'))
      ) {
        const css = `rgb(${tanna.r},${tanna.g},${tanna.b})`;
        document.documentElement.style.setProperty('--primary-color', css);
        document.documentElement.style.setProperty('--accent-color', css);
        const h = `rgba(${Math.round(tanna.r * 0.2)},${Math.round(
          tanna.g * 0.2
        )},${Math.round(tanna.b * 0.2)},0.9)`;
        const n = `rgba(${Math.round(tanna.r * 0.3)},${Math.round(
          tanna.g * 0.3
        )},${Math.round(tanna.b * 0.3)},0.9)`;
        document.documentElement.style.setProperty('--header-bg', h);
        document.documentElement.style.setProperty('--nav-bg', n);
      }
    } catch {}
  }
  window.setForegroundOpacity = setForegroundOpacity;
  window.applyTextColor = applyTextColor;
  window.applyStoredColors = applyStoredColors;
  document.addEventListener('DOMContentLoaded', () => {
    let stored = parseInt(localStorage.getItem('ethicom_fg_opacity') || '0', 10);
    if (stored > FG_OPACITY_MAX) stored = FG_OPACITY_MAX;
    setForegroundOpacity(stored);
    try {
      const tc = JSON.parse(localStorage.getItem('ethicom_text_color') || 'null');
      if (tc) applyTextColor(tc);
    } catch {}
    applyStoredColors();
  });
  document.addEventListener('themeChanged', () => {
    try {
      const tc = JSON.parse(localStorage.getItem('ethicom_text_color') || 'null');
      if (tc) applyTextColor(tc);
    } catch {}
    applyStoredColors();
  });
  window.addEventListener('storage', e => {
    if (!e.key) return;
    const colorKeys = [
      'ethicom_colors',
      'ethicom_bg_color',
      'ethicom_module_color',
      'ethicom_tanna_color',
      'ethicom_text_color'
    ];
    if (colorKeys.includes(e.key)) {
      try {
        const tc = JSON.parse(localStorage.getItem('ethicom_text_color') || 'null');
        if (tc) applyTextColor(tc);
      } catch {}
      applyStoredColors();
    } else if (e.key === 'ethicom_theme' && typeof applyTheme === 'function') {
      applyTheme(e.newValue || 'tanna-dark');
    }
  });
})();

function getReadmePath(lang) {
  const prefix = window.location.pathname.includes('/interface/') ? '..' : '.';
  return lang === 'en'
    ? `${prefix}/docs/README.html`
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
    "OP-5.U",
    "OP-6",
    "OP-7",
    "OP-7.U",
    "OP-8",
    "OP-8.M",
    "OP-9",
    "OP-9.M",
    "OP-9.A",
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

// Check if user confirmed responsibility via "Sana"
function getSanaConfirmed() {
  try {
    return localStorage.getItem('sana_confirmed') === 'true';
  } catch (err) {
    return false;
  }
}

window.getSanaConfirmed = getSanaConfirmed;

