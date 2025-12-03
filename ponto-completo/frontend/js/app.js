const API_BASE = 'http://localhost:4000/api';

async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;
  opts.headers = headers;
  const res = await fetch(API_BASE + path, opts);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Erro na requisição');
  }
  return res.json();
}

/* Login */
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    try {
      const r = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });
      localStorage.setItem('token', r.token);
      localStorage.setItem('user', JSON.stringify(r.user));
      if (r.user.isadmin || r.user.isAdmin) {
        window.location = 'admin.html';
      } else {
        window.location = 'registro.html';
      }
    } catch (err) {
      document.getElementById('msg').innerText = 'Erro: ' + err.message;
    }
  });
}

/* Registro de ponto */
if (document.getElementById('btnEntrada')) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  document.getElementById('userInfo').innerText = user.nome ? `Logado como: ${user.nome}` : '';
  async function registrar(tipo) {
    try {
      const r = await apiFetch('/pontos/registrar', { method: 'POST', body: JSON.stringify({ tipo }) });
      document.getElementById('msg').innerText = r.message;
      await loadHistorico();
    } catch (err) {
      document.getElementById('msg').innerText = 'Erro: ' + err.message;
    }
  }
  document.getElementById('btnEntrada').addEventListener('click', () => registrar('entrada'));
  document.getElementById('btnSaida').addEventListener('click', () => registrar('saida'));

  async function loadHistorico() {
    try {
      const data = await apiFetch('/pontos/historico');
      const tbody = document.querySelector('#historicoTable tbody');
      tbody.innerHTML = '';
      data.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.data_registro}</td><td>${r.hora_registro}</td><td>${r.tipo}</td><td>${r.observacoes || ''}</td>`;
        tbody.appendChild(tr);
      });
    } catch (err) {
      document.getElementById('msg').innerText = 'Erro ao carregar histórico';
    }
  }
  loadHistorico();
}

/* Admin */
if (document.getElementById('btnLoadServ')) {
  document.getElementById('btnLoadServ').addEventListener('click', async () => {
    try {
      const servs = await apiFetch('/servidores');
      const tbody = document.querySelector('#servTable tbody');
      tbody.innerHTML = '';
      servs.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${s.nome}</td><td>${s.matricula || ''}</td><td>${s.email}</td>
          <td><button onclick="viewHistorico(${s.id})">Ver histórico</button></td>`;
        tbody.appendChild(tr);
      });
    } catch (err) {
      document.getElementById('msg').innerText = 'Erro ao listar servidores';
    }
  });
}

window.viewHistorico = async function(id) {
  try {
    const data = await apiFetch(`/pontos/admin/${id}`);
    let out = 'Histórico:\n';
    data.forEach(r => out += `${r.data_registro} ${r.hora_registro} ${r.tipo}\n`);
    alert(out);
  } catch (err) {
    alert('Erro ao buscar histórico');
  }
}

/* Logout handlers */
document.querySelectorAll('#logout').forEach(a => {
  if (a) a.addEventListener('click', (e) => { localStorage.removeItem('token'); localStorage.removeItem('user'); });
});
