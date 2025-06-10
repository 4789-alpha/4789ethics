document.getElementById('chat-send').addEventListener('click', async () => {
  const input = document.getElementById('chat-input').value;
  const response = await fetch('/aari/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input })
  });
  const data = await response.json();
  document.getElementById('chat-output').innerText += `Aari: ${data.reply}\n`;
});
