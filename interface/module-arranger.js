function getModuleOrder(){
  try {
    return JSON.parse(localStorage.getItem('module_order') || '[]');
  } catch {
    return [];
  }
}

function setModuleOrder(order){
  localStorage.setItem('module_order', JSON.stringify(order));
}

function applyStoredModuleOrder(){
  const main = document.querySelector('main');
  if(!main) return;
  const order = getModuleOrder();
  order.forEach(id => {
    const el = document.getElementById(id);
    if(el) main.appendChild(el);
  });
}

if (typeof module !== 'undefined') {
  module.exports = { getModuleOrder, setModuleOrder, applyStoredModuleOrder };
}
