// interface-loader.js – Lädt das passende OP-Modul ins Interface

function loadInterfaceForOP(op_level) {
  const target = document.getElementById("op_interface");
  if (!target) return;

  const normalized = op_level
    .toLowerCase()
    .replace("+", "plus")
    .replace(/[-.]/g, "");
  const moduleMap = {
    "op0": "op-0-interface.js",
    "op1": "op-1-interface.js",
    "op2": "op-2-interface.js",
    "op3": "op-3-interface.js",
    "op4": "op-4-interface.js",
    "op5": "op-5-interface.js",
    "op6": "op-6-interface.js",
    "op7": "op-7-interface.js",
    "op8": "op-8-interface.js",
    "op9": "op-9-interface.js",
    "op9a": "op-9-interface.js",
    "op10": "op-10-analysis.js",
    "op11": "op-11-interface.js",
    "op12": "op-12-interface.js",
    "search": "source-search.js",
    "integrator": "source-integrator.js",
    "manifestviewer": "manifest-viewer.js",
    "revisionoverview": "revision-overview.js",
    "permissionsviewer": "permissions-viewer.js",
    "languagemanager": "language-manager.js",
    "translation": "op-3-translation.js"
  };

  const script = document.createElement("script");
  const file = moduleMap[normalized];
  const status = document.getElementById("status");

  if (!file) {
    target.innerHTML = "<p>OP-level not recognized or unsupported.</p>";
    if (status) status.textContent = "Unknown OP level";
    if (window.hideLoadingBadge) window.hideLoadingBadge();
    return;
  }

  if (status) status.textContent = "Loading module...";
  if (window.showLoadingBadge) window.showLoadingBadge(op_level);

  script.src = `modules/${file}`;
  script.onload = () => {
    const initFunc = `init${op_level
      .replace(/[-.]/g, "")
      .replace("+", "plus")}Interface`;
    if (typeof window[initFunc] === "function") {
      window[initFunc]();
    } else if (normalized === "op9a" && typeof window["initOP9Interface"] === "function") {
      window["initOP9Interface"]();
    } else if (op_level === "OP-10") {
      initOP10Analysis();
    } else if (op_level.toLowerCase() === "search") {
      initSourceSearch();
    } else if (op_level.toLowerCase() === "integrator") {
      initSourceIntegrator();
    } else if (op_level.toLowerCase() === "manifest-viewer") {
      initManifestViewer();
    } else if (op_level.toLowerCase() === "revision-overview") {
      initRevisionOverview();
    } else if (op_level.toLowerCase() === "permissions-viewer") {
      initPermissionsViewer();
    } else if (op_level.toLowerCase() === "language-manager") {
      initLanguageManager();

    }
    if (status) status.textContent = "Module loaded";
    if (window.hideLoadingBadge) window.hideLoadingBadge();
  };
  document.body.appendChild(script);
}
