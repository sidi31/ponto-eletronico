// registro.js (VERSÃO COMPLETA)

// Ajuste conforme seu backend
const API_BASE = 'http://localhost:4000/api';

// UI
const toast = document.getElementById('toast');
function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2500);
}

const statusLine = document.getElementById('statusLine');

// Modal
const modal = document.getElementById('confirmModal');
const confirmTipoEl = document.getElementById('confirmTipo');
let modalResolve = null;

function openModal(tipo){
  confirmTipoEl.textContent = tipo;
  modal.setAttribute('aria-hidden', 'false');
  return new Promise(res => modalResolve = res);
}

function closeModal(){
  modal.setAttribute('aria-hidden', 'true');
  if(modalResolve) modalResolve(false);
  modalResolve = null;
}

document.getElementById('confirmOk').onclick = () => {
  if(modalResolve) modalResolve(true);
  closeModal();
};

document.getElementById('confirmCancel').onclick = () => closeModal();

modal.addEventListener('click', e => {
  if(e.target === modal) closeModal();
});

// ELEMENTOS
const btnEntrada = document.getElementById('btnEntrada');
const btnSaida   = document.getElementById('btnSaida');
const btnSync    = document.getElementById('btnSync');
const historicoBody = document.querySelector('#historicoTable tbody');
const userBox = document.getElementById('userBox');
const logoutLink = document.getElementById('logout');

// LOCAL STORAGE
const PEND_KEY = 'ponto_pendentes';

function getPendentes(){
  try{
    return JSON.parse(localStorage.getItem(PEND_KEY) || '[]');
  } catch(e){
    return [];
  }
}

function setPendentes(arr){
  localStorage.setItem(PEND_KEY, JSON.stringify(arr));
  btnSync.textContent = `Sincronizar (${arr.length})`;
}

function loadUserInfo(){
  try{
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    if(u && u.nome){
      userBox.textContent = `Logado como: ${u.nome}`;
    } else {
      userBox.textContent = 'Usuário não autenticado';
    }
  }catch(e){
    userBox.textContent = 'Usuário não autenticado';
  }
}

loadUserInfo();

// API HELPER
async function apiFetch(path, opts={}){
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  headers["Content-Type"] = "application/json";
  if(token) headers["Authorization"] = "Bearer " + token;
  opts.headers = headers;

  const r = await fetch(API_BASE + path, opts);
  const txt = await r.text();

  let json;
  try { json = JSON.parse(txt); } catch(e){ json = txt; }

  if(!r.ok){
    const msg = (json && json.message) ? json.message : txt;
    throw new Error(msg);
  }
  return json;
}

// REGISTRAR PONTO
async function registrar(tipo){
  const ok = await openModal(tipo);
  if(!ok) return;

  statusLine.textContent = "Registrando ponto...";

  try{
    const result = await apiFetch('/pontos/registrar', {
      method: 'POST',
      body: JSON.stringify({ tipo })
    });

    showToast("Ponto registrado no servidor");
    statusLine.textContent = "Registrado com sucesso!";
    carregarHistorico();
  }catch(e){
    showToast("API offline — registro salvo local");
    statusLine.textContent = "Salvo offline";

    const arr = getPendentes();
    arr.push({
      tipo,
      ts: new Date().toISOString()
    });
    setPendentes(arr);

    carregarHistoricoLocal();
  }
}

// SINCRONIZAR
async function sincronizar(){
  const pend = getPendentes();
  if(!pend.length){
    showToast("Nada a sincronizar");
    return;
  }

  statusLine.textContent = "Sincronizando...";

  let okCount = 0;
  for(const p of pend.slice()){
    try{
      await apiFetch('/pontos/registrar',{
        method: 'POST',
        body: JSON.stringify({ tipo: p.tipo })
      });
      okCount++;
      const arr = getPendentes();
      arr.shift();
      setPendentes(arr);
    }catch(e){
      break;
    }
  }

  if(okCount > 0)
    showToast(`Sincronizados: ${okCount}`);
  
  carregarHistorico();
  statusLine.textContent = "";
}

btnEntrada.onclick = () => registrar("entrada");
btnSaida.onclick   = () => registrar("saida");
btnSync.onclick    = () => sincronizar();

// HISTÓRICO
async function carregarHistorico(){
  try{
    const rows = await apiFetch('/pontos/historico');
    renderHistorico(rows);
  }catch(e){
    renderHistorico([]);
  }
  carregarHistoricoLocal();
}

function carregarHistoricoLocal(){
  const pend = getPendentes();
  if(!pend.length) return;

  const extra = pend.map(p => ({
    data_registro: p.ts.slice(0,10),
    hora_registro: p.ts.slice(11,19),
    tipo: p.tipo + " (pend.)",
    observacoes: ""
  }));

  renderHistorico(extra, true);
}

function renderHistorico(data, append=false){
  if(!append) historicoBody.innerHTML = "";

  if(!data.length){
    if(!append){
      historicoBody.innerHTML = `
        <tr><td colspan="4" style="color:#888">Nenhum registro</td></tr>
      `;
    }
    return;
  }

  for(const r of data){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.data_registro || ''}</td>
      <td>${r.hora_registro || ''}</td>
      <td>${r.tipo || ''}</td>
      <td>${r.observacoes || ''}</td>
    `;
    historicoBody.appendChild(tr);
  }
}

carregarHistorico();
setInterval(()=> {
  if(getPendentes().length>0) sincronizar();
}, 60000);

// LOGOUT
logoutLink.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});
