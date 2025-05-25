function initAccessibilitySetup() {
  const container = document.getElementById("access_setup");
  if (!container) return;

  const saved = JSON.parse(localStorage.getItem("ethicom_access") || "{}");
  const vision = saved.vision || "yes";
  const hearing = saved.hearing || "yes";
  const speech = saved.speech || "no";
  const font = saved.font || "normal";
  const simple = saved.simple || "no";

  container.innerHTML = `
    <h3 data-ui="access_title">Accessibility Setup</h3>
    <label for="vision_select" data-ui="access_label_vision">Can you see the screen?</label>
    <select id="vision_select">
      <option value="yes" data-ui="access_opt_yes">Yes</option>
      <option value="no" data-ui="access_opt_no">No</option>
    </select>

    <label for="hearing_select" data-ui="access_label_hearing">Can you hear from this device?</label>
    <select id="hearing_select">
      <option value="yes_nospeech" data-ui="access_opt_yes_nospeech">Yes, but cannot speak</option>
      <option value="yes" data-ui="access_opt_yes">Yes</option>
      <option value="no" data-ui="access_opt_no">No</option>
    </select>

    <label for="speech_select" data-ui="access_label_speech">Can you speak?</label>
    <select id="speech_select">
      <option value="no" data-ui="access_opt_no">No</option>
      <option value="yes" data-ui="access_opt_yes">Yes</option>
    </select>

    <label for="simple_select" data-ui="access_label_simple">Simplified interface?</label>
    <select id="simple_select">
      <option value="no" data-ui="access_opt_no">No</option>
      <option value="yes" data-ui="access_opt_yes">Yes</option>
    </select>

    <label for="font_select">Font size:</label>
    <select id="font_select">
      <option value="normal">Normal</option>
      <option value="large">Large</option>
    </select>

    <button id="access_save" data-ui="access_save_btn">Save Setup</button>
  `;

  document.getElementById("vision_select").value = vision;
  document.getElementById("hearing_select").value = hearing;
  document.getElementById("speech_select").value = speech;
  document.getElementById("simple_select").value = simple;
  document.getElementById("font_select").value = font;

  function applyFont(val) {
    document.body.classList.toggle("large-font", val === "large");
  }
  applyFont(font);

  function applySimple(val) {
    const enabled = val === "yes";
    document.body.classList.toggle("simple-mode", enabled);
    localStorage.setItem("simple_mode", enabled ? "true" : "false");
  }
  applySimple(simple);

  document.getElementById("access_save").addEventListener("click", () => {
    const data = {
      vision: document.getElementById("vision_select").value,
      hearing: document.getElementById("hearing_select").value,
      speech: document.getElementById("speech_select").value,
      font: document.getElementById("font_select").value,
      simple: document.getElementById("simple_select").value
    };
    localStorage.setItem("ethicom_access", JSON.stringify(data));
    applyFont(data.font);
    applySimple(data.simple);
    loadUiTexts().then(txt => {
      const t = txt[getLanguage()] || txt.en || {};
      alert(t.access_saved || "Accessibility preferences saved.");
    });
  });
}

window.addEventListener("DOMContentLoaded", initAccessibilitySetup);
