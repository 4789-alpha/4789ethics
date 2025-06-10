export function setupChat(container) {
  const output = document.createElement('div');
  output.id = 'chat';
  const inputArea = document.createElement('div');
  inputArea.id = 'input-area';
  const inp = document.createElement('input');
  const btn = document.createElement('button');
  btn.textContent = 'Send';
  inputArea.append(inp, btn);
  container.append(output, inputArea);
  btn.addEventListener('click', async () => {
    const msg = inp.value;
    output.textContent += `You: ${msg}\n`;
    const res = await fetch('/aari/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({message: msg})
    });
    const data = await res.json();
    output.textContent += `Aari: ${data.reply}\n`;
    inp.value='';
  });
}
