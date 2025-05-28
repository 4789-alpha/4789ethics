(function(){
  const KEY='ethicom_slow_mode';
  function set(val){
    localStorage.setItem(KEY,val?'true':'false');
    document.body.classList.toggle('slow-mode',val);
    if(window.slowMode) window.slowMode.enabled=val;
  }
  const state=localStorage.getItem(KEY)==='true';
  window.slowMode={
    enabled:state,
    toggle(){set(!this.enabled);},
    pause(ms){return new Promise(res=>setTimeout(res,this.enabled?ms:0));}
  };
  document.addEventListener('DOMContentLoaded',()=>set(state));
})();
