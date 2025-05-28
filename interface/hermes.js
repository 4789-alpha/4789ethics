const hermesTopics = [
  {
    name: 'Einführung',
    subtopics: [
      {
        name: 'Start',
        articles: [
          { title: 'Was ist Hermes?', file: '../sources/hermes/intro.md' }
        ]
      }
    ]
  }
];

function createTree(data) {
  const ul = document.createElement('ul');
  data.forEach(topic => {
    const li = document.createElement('li');
    li.textContent = topic.name;
    if (topic.subtopics) li.appendChild(createTree(topic.subtopics));
    if (topic.articles) {
      const aList = document.createElement('ul');
      topic.articles.forEach(a => {
        const aLi = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = a.title;
        link.href = '#';
        link.dataset.file = a.file;
        link.addEventListener('click', e => {
          e.preventDefault();
          loadArticle(a.file);
        });
        aLi.appendChild(link);
        aList.appendChild(aLi);
      });
      li.appendChild(aList);
    }
    ul.appendChild(li);
  });
  return ul;
}

async function loadArticle(file) {
  const container = document.getElementById('hermes_content');
  if (!container) return;
  container.textContent = 'Lade...';
  try {
    const md = await fetch(file).then(r => r.text());
    if (typeof renderMarkdown === 'function') {
      container.innerHTML = renderMarkdown(md);
    } else {
      container.textContent = md;
    }
  } catch {
    container.textContent = 'Fehler beim Laden.';
  }
}

function initHermes() {
  const tree = document.getElementById('hermes_tree');
  if (tree) tree.appendChild(createTree(hermesTopics));
  loadArticle('../sources/hermes/intro.md');
}

if (typeof window !== 'undefined') window.initHermes = initHermes;
