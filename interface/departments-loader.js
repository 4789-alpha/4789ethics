function loadDepartments(){
  const container = document.getElementById('departments_section');
  if(!container) return;
  fetch('sources/departments/bsvrb.json')
    .then(r => r.json())
    .then(list => {
      container.innerHTML = '';
      list.forEach(d => {
        if(d.dept_id === 'dept-qc'){
          const sec = document.createElement('section');
          sec.className = 'card';
          sec.innerHTML = `<h2>${d.title}</h2>` + (d.link ? `<p><a href="${d.link}">Details</a></p>` : '');
          container.appendChild(sec);
          return;
        }
        const details = document.createElement('details');
        details.className = 'card';
        const summary = document.createElement('summary');
        summary.innerHTML = `<a href="${d.link || `bsvrb-${d.dept_id}.html`}"><img src="${d.image}" alt="" class="inline-logo">${d.title}</a>`;
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
    })
    .catch(() => { container.textContent = 'Konnte Abteilungen nicht laden.'; });
}

document.addEventListener('DOMContentLoaded', loadDepartments);
