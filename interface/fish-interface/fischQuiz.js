let fishData = [];
let quizLength = 0;
let asked = 0;
let score = 0;

async function loadFishData() {
  try {
    fishData = await fetch('../../sources/fish/swiss-fish.json').then(r => r.json());
  } catch {
    document.getElementById('start_screen').innerHTML = '<p>Daten konnten nicht geladen werden.</p>';
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startQuiz() {
  quizLength = parseInt(document.getElementById('quiz_length').value, 10) || 0;
  asked = 0;
  score = 0;
  document.getElementById('start_screen').style.display = 'none';
  document.getElementById('quiz_result').style.display = 'none';
  document.getElementById('quiz_area').style.display = 'block';
  nextQuestion();
}

function nextQuestion() {
  if (quizLength && asked >= quizLength) return finishQuiz();
  asked++;
  const fish = fishData[Math.floor(Math.random() * fishData.length)];
  const options = [fish.name];
  while (options.length < 4) {
    const r = fishData[Math.floor(Math.random() * fishData.length)].name;
    if (!options.includes(r)) options.push(r);
  }
  shuffle(options);
  const img = document.getElementById('quiz_image');
  img.src = '../../' + (fish.image || '');
  img.alt = fish.name;
  document.getElementById('quiz_question').textContent = 'Welcher Fisch ist das?';
  const optDiv = document.getElementById('quiz_options');
  optDiv.innerHTML = '';
  options.forEach(o => {
    const btn = document.createElement('button');
    btn.textContent = o;
    btn.addEventListener('click', () => {
      if (o === fish.name) score++;
      nextQuestion();
    });
    optDiv.appendChild(btn);
  });
}

function finishQuiz() {
  document.getElementById('quiz_area').style.display = 'none';
  const result = `Ergebnis: ${score} von ${asked}`;
  const resDiv = document.getElementById('quiz_result');
  resDiv.textContent = result;
  resDiv.style.display = 'block';
  document.getElementById('start_screen').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  loadFishData();
  document.getElementById('start_btn').addEventListener('click', startQuiz);
  document.getElementById('stop_btn').addEventListener('click', finishQuiz);
});
