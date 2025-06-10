import {setupChat} from '../components/chat.js';

function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
  }
  const app = document.getElementById('app');
  setupChat(app);
}

init();
export default init;
