const infoEl = document.getElementById('op_info');
function showInfo(key){
  if(!infoEl) return;
  infoEl.dataset.info = key;
  infoEl.textContent = '';
  if(typeof applyInfoTexts==='function') applyInfoTexts(infoEl);
}
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.op-list li').forEach(li => {
    const key = li.dataset.infoKey;
    if(!key) return;
    li.tabIndex = 0;
    li.addEventListener('click', () => showInfo(key));
    li.addEventListener('keydown', e => {
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        showInfo(key);
      }
    });
  });
});
