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
    const temp = !!data.op8_temp_privilege;
    const order = [
      'OP-0','OP-1','OP-2','OP-3','OP-4','OP-5','OP-6',
      'OP-7','OP-8','OP-9','OP-10','OP-11','OP-12'
    ];
    order.forEach(level => {
      if (!data[level]) return;
      const row = document.createElement("tr");
      let actions = Object.keys(data[level]).filter(k => data[level][k]);
      if (level === 'OP-8') {
        const temps = ['can_accept_donations','can_override','can_vote_on_op9'];
        if (!temp) {
          actions = actions.filter(a => !temps.includes(a));
        } else {
          actions = actions.map(a => temps.includes(a) ? `${a}*` : a);
        }
      }
      row.innerHTML = `<td>${level}</td><td>${actions.join(', ')}</td>`;
      table.appendChild(row);
    });
    if (temp) {
      const note = document.createElement('p');
      note.textContent = '* temporary privilege granted by OP-9+';
      table.parentElement.appendChild(note);
    }
  } catch (e) {
    table.innerHTML += `<tr><td colspan='2'>Could not load permissions.</td></tr>`;
  }
}
