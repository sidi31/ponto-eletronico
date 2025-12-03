// registro.js
const API_BASE = 'http://localhost:4000/api';

// UI helpers
const toast = document.getElementById('toast');
function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2500);
}

// modal
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

// elements
const btnEntrada = document.getElementById('btnEntrada');
const btnSaida = document.getElementById('btnSaida');
const btnSync = document.getElementById('btnSync');
const historicoBody = document.querySelector('#historicoTable tbody');
const statusLine = document.getElementById('statusLine');

// storage
const PEND_KEY = 'pend_ponto';

function getPendentes(){ return JSON.parse(localStorage.getItem(PEND_KEY) || '[]'); }
function setPendentes(a){ localStorage.setItem(PEND_KEY, JSON.stringify(a)); btnSync.textContent = `Sincronizar (${a.length})`; }

// load user
(function(){
  const u = JSON.parse(localStorage.getItem('user') || 'null');
  const box = document.getElementById('userBox');
  if(!u) box.textContent = 'Não logado';
  else box.textContent = `Logado como: ${u.nome}`;
})();

async function apiFetch(path, opts={}){
  const t = localStorage.getItem('token');
  const h = opts.headers || {};
  h['Content-Type'] = 'application/json';
  if(t) h['Authorization'] = `Bearer ${t}`;
  opts.headers = h;

  const res = await fetch(API_BASE + path, opts);
  const txt = await res.text();
  if(!res.ok){
    try{
      const j = JSON.parse(txt);
      throw new Error(j.message || txt);
    }catch(e){
      throw new Error(txt);
    }
  }
  return JSON.parse(txt);
}

// registrar ponto
async function registrar(tipo){
  const ok = await openModal(tipo);
  if(!ok) return;

  statusLine.textContent = 'Registrando…';
  try{
    const r = await apiFetch('/pontos/registrar', {
      method: 'POST',
      body: JSON.stringify({ tipo })
    });
    showToast('Ponto registrado no servidor');
    statusLine.textContent = 'Registrado com sucesso';
    carregarHistorico();
  }catch(e){
    showToast('API offline — salvo local');
    const arr = getPendentes();
    arr.push({ tipo, ts: new Date().toISOString() });
    setPendentes(arr);
    carregarHistoricoLocal();
    statusLine.textContent = 'Offline — registro local salvo';
  }
}

btnEntrada.onclick = () => registrar('entrada');
btnSaida.onclick = () => registrar('saida');

btnSync.onclick = syncPendentes;

async function syncPendentes(){
  const pend = getPendentes();
  if(!pend.length){ showToast('Nada a sincronizar'); return; }

  statusLine.textContent = 'Sincronizando...';

  let ok = 0;
  for(const p of pend.slice()){
    try{
      await apiFetch('/pontos/registrar',{
        method:'POST',
        body: JSON.stringify({ tipo:p.tipo })
      });
      ok++;
      const newArr = getPendentes();
      newArr.shift();
      setPendentes(newArr);
    }catch(e){
      break; 
    }
  }

  if(ok) showToast(`Sincronizado(s): ${ok}`);
  carregarHistorico();
  statusLine.textContent = '';
}

// carregar histórico
async function carregarHistorico(){
  try{
    const data = await apiFetch('/pontos/historico');
    renderHist(data);
  }catch(e){
    renderHist([]);
  }
  carregarHistoricoLocal();
}

function carregarHistoricoLocal(){
  const pend = getPendentes();
  if(!pend.length) return;
  const rows = pend.map(p=>({
    data_registro: p.ts.slice(0,10),
    hora_registro: p.ts.slice(11,19),
    tipo: `${p.tipo} (pend.)`,
    observacoes:''
  }));
  renderHist(rows, true);
}

function renderHist(list, append=false){
  if(!append) historicoBody.innerHTML = '';

  if(!list.length){
    if(!append) historicoBody.innerHTML = `<tr><td colspan="4">Nenhum registro</td></tr>`;
    return;
  }

  for(const r of list){
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
setInterval(syncPendentes, 60000);
