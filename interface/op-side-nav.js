function setupOpSideNav(container){
  const list = container.querySelector('#op_side_nav');
  if(!list) return;
  const levels=['OP-0','OP-1','OP-2','OP-3','OP-4','OP-5','OP-5.U','OP-6','OP-7','OP-7.U','OP-8','OP-8.M','OP-9','OP-9.M','OP-9.A','OP-10','OP-11','OP-12','chat'];
  list.innerHTML = levels.map(l => `<li><button class="accent-button" data-level="${l}">${l}</button></li>`).join('');
  list.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      if(typeof handleOpButton==='function') handleOpButton(btn.dataset.level);
      if(typeof toggleSideDrop==='function') toggleSideDrop();
    });
  });
}
if(typeof window!=='undefined') window.setupOpSideNav=setupOpSideNav;
