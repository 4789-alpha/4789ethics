const levels = ['OP-0','OP-1','OP-2','OP-3','OP-4','OP-5','OP-6','OP-7','OP-8','OP-9','OP-10','OP-11','OP-12'];
let index = 0;

function renderSlide(){
  const level = levels[index];
  const titleEl = document.getElementById('story_title');
  if(titleEl) titleEl.textContent = level;
  const infoEl = document.getElementById('story_info');
  if(infoEl){
    infoEl.dataset.info = level.toLowerCase();
    infoEl.textContent = '';
    if(typeof applyInfoTexts==='function') applyInfoTexts(infoEl);
  }
  if(typeof setHelpSection==='function') setHelpSection(level);
  const prev = document.getElementById('prev_btn');
  const next = document.getElementById('next_btn');
  if(prev) prev.disabled = index === 0;
  if(next) next.disabled = index === levels.length - 1;
}

function nextSlide(){ if(index < levels.length - 1){ index++; renderSlide(); } }
function prevSlide(){ if(index > 0){ index--; renderSlide(); } }

window.addEventListener('DOMContentLoaded', () => {
  const prev = document.getElementById('prev_btn');
  const next = document.getElementById('next_btn');
  if(prev) prev.addEventListener('click', prevSlide);
  if(next) next.addEventListener('click', nextSlide);
  renderSlide();
});
