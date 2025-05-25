// chat-interface.js – Local OP chat with greeting dummy

function initChatInterface() {
  const container = document.getElementById("op_interface");
  if (!container) return;

  verifySignature("OP-1").then(result => {
    if (!result.valid) {
      container.innerHTML = "<p>Signature required. Please create and verify your signature first.</p>";
      return;
    }

    container.innerHTML = `
      <div class="card">
        <h3>OP Chat</h3>
        <div id="chat_messages" style="height:200px; overflow-y:auto; border:1px solid #555; padding:0.5em; margin-bottom:1em;"></div>
        <input type="text" id="chat_input" placeholder="Enter your message" style="width:80%;" />
        <button onclick="sendChatMessage('${result.id}')" class="accent-button">Send</button>
      </div>
    `;

    loadChatMessages();
    if (!localStorage.getItem('chat_welcomed')) {
      pushChatMessage('system', 'Willkommen im OP Chat. Bleib verantwortungsbewusst.');
      localStorage.setItem('chat_welcomed', '1');
    }
  });
}

function loadChatMessages() {
  const chatDiv = document.getElementById('chat_messages');
  if (!chatDiv) return;
  const arr = JSON.parse(localStorage.getItem('op_chat_messages') || '[]');
  chatDiv.innerHTML = arr.map(m => `<p><strong>${m.sig}:</strong> ${m.msg}</p>`).join('');
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function pushChatMessage(sig, msg) {
  const arr = JSON.parse(localStorage.getItem('op_chat_messages') || '[]');
  arr.push({ sig, msg, ts: new Date().toISOString() });
  localStorage.setItem('op_chat_messages', JSON.stringify(arr));
  loadChatMessages();
}

function sendChatMessage(sig) {
  const input = document.getElementById('chat_input');
  if (input && input.value.trim()) {
    pushChatMessage(sig, input.value.trim());
    input.value = '';
  }
}
