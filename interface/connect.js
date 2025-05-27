let uiText = {};

function applyTexts(){
  document.documentElement.lang = localStorage.getItem('ethicom_lang') || 'de';
  const t = uiText;
  document.querySelector('[data-ui="connect_title"]').textContent = t.connect_title || 'Connect';
  document.querySelector('[data-ui="connect_request"]').textContent = t.connect_request || 'Request connection';
  document.querySelector('[data-ui="connect_enter_sig"]').textContent = t.connect_enter_sig || 'Target signature:';
  document.querySelector('[data-ui="connect_pending"]').textContent = t.connect_pending || 'Pending requests';
  document.querySelector('[data-ui="connect_connections"]').textContent = t.connect_connections || 'Your connections';
  document.querySelectorAll('[data-ui="connect_approve"]').forEach(el=>{
    el.textContent = t.connect_approve || 'Approve';
  });
}

function init(){
  const lang = getLanguage();
  fetch('../i18n/ui-text.json')
    .then(r=>r.json())
    .then(data=>{ uiText = data[lang] || data.en || {}; applyTexts(); load(); });
  document.getElementById('request_btn').addEventListener('click', sendRequest);
}

function sig(){
  try{ return JSON.parse(localStorage.getItem('ethicom_signature')||'{}'); }catch{return {};}
}

function sendRequest(){
  const target = document.getElementById('sig_input').value.trim();
  const status = document.getElementById('connect_status');
  status.textContent='';
  fetch('/api/connect/request', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ id: sig().id, target_id: target })
  })
  .then(r=>{ if(!r.ok) throw new Error('fail'); return r.json(); })
  .then(()=>{ status.textContent = uiText.connect_request_sent || 'Request sent.'; load(); })
  .catch(()=>{ status.textContent = uiText.connect_error || 'Request failed.'; });
}

function approve(reqId){
  fetch('/api/connect/approve', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ id: sig().id, requester_id: reqId })
  }).then(()=> load());
}

function load(){
  const id = sig().id;
  if(!id) return;
  fetch('/api/connect/list?id='+encodeURIComponent(id))
    .then(r=>r.json())
    .then(data=>{
      const pendingList=document.getElementById('pending_list');
      const connList=document.getElementById('conn_list');
      pendingList.innerHTML='';
      connList.innerHTML='';
      data.pending.forEach(p=>{
        const li=document.createElement('li');
        li.textContent=p.requester;
        const btn=document.createElement('button');
        btn.dataset.ui='connect_approve';
        btn.addEventListener('click',()=>approve(p.requester));
        li.appendChild(btn);
        pendingList.appendChild(li);
      });
      applyTexts();
      data.connections.forEach(c=>{
        const li=document.createElement('li');
        li.textContent=`${c.id} (${c.op_level})`;
        connList.appendChild(li);
      });
    });
}

document.addEventListener('DOMContentLoaded', init);
