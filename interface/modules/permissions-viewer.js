// permissions-viewer.js – Display OP permissions table

function initPermissionsViewer() {
  const container = document.getElementById("op_interface");
  if (!container) return;
  container.innerHTML = `
    <div class="card">
      <h3>Operator Permissions</h3>
      <table id="perm_table" class="perm-table"></table>
    </div>
  `;
  loadPermissionTable();
}

async function loadPermissionTable() {
  const table = document.getElementById("perm_table");
  table.innerHTML = "<tr><th>OP Level</th><th>Permissions</th></tr>";
  try {
    const data = await fetch("../permissions/op-permissions-expanded.json").then(r => r.json());
    const order = [
      'OP-0','OP-1','OP-2','OP-3','OP-4','OP-5','OP-6',
      'OP-7','OP-7.5','OP-8','OP-9','OP-10','OP-11','OP-12'
    ];
    order.forEach(level => {
      if (!data[level]) return;
      const row = document.createElement("tr");
      const actions = Object.keys(data[level]).filter(k => data[level][k]);
      row.innerHTML = `<td>${level}</td><td>${actions.join(', ')}</td>`;
      table.appendChild(row);
    });
  } catch (e) {
    table.innerHTML += `<tr><td colspan='2'>Could not load permissions.</td></tr>`;
  }
}
