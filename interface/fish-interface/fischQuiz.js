let fishData = [];
let quizLength = 0;
let asked = 0;
let score = 0;
let answers = [];
let currentFish = null;

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
  answers = [];
  currentFish = null;
  document.getElementById('start_screen').style.display = 'none';
  document.getElementById('quiz_result').style.display = 'none';
  document.getElementById('quiz_area').style.display = 'block';
  nextQuestion();
}

function nextQuestion() {
  if (quizLength && asked >= quizLength) return finishQuiz();
  asked++;
  currentFish = fishData[Math.floor(Math.random() * fishData.length)];
  const options = [currentFish.name];
  while (options.length < 4) {
    const r = fishData[Math.floor(Math.random() * fishData.length)].name;
    if (!options.includes(r)) options.push(r);
  }
  shuffle(options);
  const img = document.getElementById('quiz_image');
  img.src = '../../' + (currentFish.image || '');
  img.alt = currentFish.name;
  document.getElementById('quiz_question').textContent = 'Welcher Fisch ist das?';
  const optDiv = document.getElementById('quiz_options');
  optDiv.innerHTML = '';
  options.forEach(o => {
    const btn = document.createElement('button');
    btn.textContent = o;
    btn.addEventListener('click', () => {
      answers.push({ question: currentFish.name, selected: o });
      if (o === currentFish.name) score++;
      nextQuestion();
    });
    optDiv.appendChild(btn);
  });
}

function finishQuiz() {
  document.getElementById('quiz_area').style.display = 'none';
  let result = `Ergebnis: ${score} von ${asked}`;
  const wrong = answers.filter(a => a.selected !== a.question);
  if (wrong.length) {
    result += '<h2>Falsche Antworten</h2><ul>';
    wrong.forEach(a => {
      result += `<li>Gewählt: ${a.selected} – Richtig: ${a.question}</li>`;
    });
    result += '</ul>';
  }
  const resDiv = document.getElementById('quiz_result');
  resDiv.innerHTML = result;
  resDiv.style.display = 'block';
  document.getElementById('start_screen').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  loadFishData();
  document.getElementById('start_btn').addEventListener('click', startQuiz);
  document.getElementById('stop_btn').addEventListener('click', finishQuiz);
});
