const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  projects.forEach(project => {
    project.hidden = button.dataset.filter !== 'alle' && project.dataset.category !== button.dataset.filter;
    if (!project.hidden) count++;
  });
  document.getElementById('filter-status').textContent = `${count} Projekte angezeigt`;
}));
