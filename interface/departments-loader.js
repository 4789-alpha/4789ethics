const FALLBACK_DEPARTMENTS = [
  {
    "dept_id": "dept-1",
    "title": "Gesellschaft / Bewegung / Plattform",
    "image": "sources/images/departments/logo-dept-1.png",
    "alt": "Logo für Gesellschaft / Bewegung / Plattform",
    "points": [
      "Bündnis für sinnvolle Verantwortung in regionalen Belangen",
      "Bewegung für soziale Vielfalt und respektvolle Begegnung",
      "Berner Struktur für verbindende regionale Beiträge"
    ]
  },
  {
    "dept_id": "dept-2",
    "title": "Bildung / Zukunft / Ethik",
    "image": "sources/images/departments/logo-dept-2.png",
    "alt": "Logo für Bildung / Zukunft / Ethik",
    "points": [
      "Bildungsstelle für Selbstverantwortung, Vielfalt, Respekt & Bewusstsein",
      "Berner Schule für vorausschauendes, resilientes Bewusstsein",
      "Bildungs-Syndikat für Vernunft und regionale Bildung"
    ]
  },
  {
    "dept_id": "dept-3",
    "title": "Technik / Innovation / Forschung",
    "image": "sources/images/departments/logo-dept-3.png",
    "alt": "Logo für Technik / Innovation / Forschung",
    "points": [
      "Bionik-Systeme für vernetzte regionale Bewegungen",
      "Berner Studio für visionäre robotische Begleiter (z. B. Aarulon, Mechafisch)",
      "Baukasten-System für variable, regionale Beteiligung"
    ]
  },
  {
    "dept_id": "dept-4",
    "title": "Gesellschaft + Genuss",
    "image": "sources/images/departments/logo-dept-4.png",
    "alt": "Logo für Gesellschaft + Genuss",
    "points": [
      "Bier, Solidarität, Vielfalt, Region, Begegnung",
      "Brauchbare Strukturen für Verantwortung, Respekt und Beziehung",
      "Bündnis für Substanz, Vielfalt, Rausch & Bewusstsein (sanft anarchisch)"
    ]
  },
  {
    "dept_id": "dept-5",
    "title": "Für Kultur, Natur, Mensch & Region",
    "image": "sources/images/departments/logo-dept-5.png",
    "alt": "Logo für Kultur, Natur, Mensch & Region",
    "points": [
      "Begegnungsstätte für Sinnsuchende, Verbindende, Regional Bewusste",
      "Bündnis Schweizer Volkskultur & regionale Biodiversität",
      "Berner Szene für Veränderung, Ruhe & Beteiligung",
      "Fischerei im Sinne der Biodiversität in \u201eVita Fera\u201c verankern"
    ]
  },
  {
    "dept_id": "beatclub",
    "title": "Beatclub Basel",
    "image": "sources/images/departments/logo-dept-5.png",
    "alt": "Logo des Beatclub Basel",
    "link": "beatclub-basel.html",
    "points": [
      "Bier, Solidarität, Vielfalt, Rave & Beats"
    ]
  },
  {
    "dept_id": "grimmhorn",
    "title": "Grimmhorn",
    "image": "sources/images/departments/logo-dept-5.png",
    "alt": "Logo von Grimmhorn",
    "link": "grimmhorn.html",
    "points": [
      "Raum für laute Experimente"
    ]
  },
  {
    "dept_id": "dept-qc",
    "title": "Qualitätskontrolle / Verantwortungssystem",
    "image": "sources/images/institutions/logo-bsvrb-qc.png",
    "alt": "Logo der Qualitätskontrolle des BSVRB",
    "link": "bsvrb-quality.html"
  }
];

function renderDepartments(list, container) {
  list.forEach(d => {
    if (d.dept_id === 'dept-qc') {
      const sec = document.createElement('section');
      sec.className = 'card';
      sec.innerHTML = `<h2>${d.title}</h2>` + (d.link ? `<p><a href="${d.link}">Details</a></p>` : '');
      container.appendChild(sec);
      return;
    }
    const details = document.createElement('details');
    details.className = 'card';
    const summary = document.createElement('summary');
    summary.innerHTML = `<a href="${d.link || `bsvrb-${d.dept_id}.html`}"><img src="${d.image}" alt="${d.alt || ''}" class="inline-logo">${d.title}</a>`;
    details.appendChild(summary);
    const ul = document.createElement('ul');
    (d.points || []).forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      ul.appendChild(li);
    });
    details.appendChild(ul);
    container.appendChild(details);
  });
}

function loadDepartments() {
  const container = document.getElementById('departments_section');
  const fallback = document.getElementById('departments_fallback');
  if (!container) return;
  fetch('sources/departments/bsvrb.json')
    .then(r => r.json())
    .then(list => {
      renderDepartments(list, container);
      if (fallback) fallback.classList.add('hidden');
    })
    .catch(err => {
      console.error(err);
      renderDepartments(FALLBACK_DEPARTMENTS, container);
      if (fallback) fallback.classList.add('hidden');
    });
}

document.addEventListener('DOMContentLoaded', loadDepartments);
