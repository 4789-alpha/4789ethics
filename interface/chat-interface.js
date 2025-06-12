let chatTexts = {};

function sig(){
  try{ return JSON.parse(localStorage.getItem('ethicom_signature')||'{}'); }catch{return {};}}

function loadConnections(){
  const sel = document.getElementById('chat_target');
  if(!sel) return;
  const id = sig().id;
  if(!id) return;
  fetch('/api/connect/list?id='+encodeURIComponent(id))
    .then(r=>r.json())
    .then(data=>{
      sel.innerHTML = data.connections.map(c=>`<option value="${c.id}">${c.id} (${c.op_level})</option>`).join('');
    });
}

function loadMessages(){
  const hist = document.getElementById('chat_history');
  const target = document.getElementById('chat_target').value;
  const id = sig().id;
  if(!hist || !target || !id) return;
  fetch(`/api/chat/list?user=${encodeURIComponent(id)}&target=${encodeURIComponent(target)}`)
    .then(r=>r.json())
    .then(data=>{
      hist.innerHTML = data.messages.map(m=>`<div><strong>${m.from===id?'You':m.from}:</strong> ${m.text}</div>`).join('');
      hist.scrollTop = hist.scrollHeight;
    });
}

function sendMessage(){
  const msgEl = document.getElementById('chat_message');
  const target = document.getElementById('chat_target').value;
  const id = sig().id;
  const text = msgEl.value.trim();
  if(!text || !id || !target) return;
  fetch('/api/chat/send', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ from:id, to:target, text })
  }).then(()=>{
    msgEl.value='';
    loadMessages();
  });
}

function initChatInterface(){
  loadConnections();
  document.getElementById('chat_send').addEventListener('click', sendMessage);
  document.getElementById('chat_target').addEventListener('change', loadMessages);
  setInterval(loadMessages, 5000);
  loadMessages();
}

if(typeof window!=='undefined') window.initChatInterface=initChatInterface;
