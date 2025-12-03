// login.js
// Grava token e user em localStorage e redireciona

const API_BASE = 'http://localhost:4000/api'; // ajuste conforme seu backend

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const msgEl = document.getElementById('msg');
const btnLogin = document.getElementById('btnLogin');
const btnDemo = document.getElementById('btnDemo');

function showMsg(text, isError = true){
  msgEl.textContent = text;
  msgEl.style.color = isError ? 'var(--danger)' : 'green';
}

async function apiFetch(path, opts = {}){
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  opts.headers = headers;
  const res = await fetch(API_BASE + path, opts);
  const text = await res.text();
  try { 
    const json = JSON.parse(text);
    if(!res.ok) throw new Error(json.message || text || 'Erro na requisição');
    return json;
  } catch(e){
    if(res.ok) return text;
    throw new Error(e.message || 'Erro na requisição');
  }
}

loginForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();
  if(!email || !senha){ showMsg('Preencha email e senha'); return; }

  btnLogin.disabled = true;
  showMsg('Entrando...', false);

  try{
    const r = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });

    if(!r.token || !r.user){
      throw new Error('Resposta inválida do servidor');
    }

    localStorage.setItem('token', r.token);
    localStorage.setItem('user', JSON.stringify(r.user));
    showMsg('Login efetuado!', false);

    setTimeout(() => {
      if(r.user.isAdmin || r.user.isadmin) {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'registro.html';
      }
    }, 600);

  }catch(err){
    console.error(err);
    showMsg('Falha ao entrar: ' + (err.message || err));
    btnLogin.disabled = false;
  }
});

// Quick fill demo
btnDemo.addEventListener('click', () => {
  emailInput.value = 'admin@ex.com';
  senhaInput.value = 'Senha123';
  loginForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
});

// redirect if logged
(function checkLogged(){
  try{
    const t = localStorage.getItem('token');
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    if(t && u){
      if(u.isAdmin || u.isadmin) window.location.href = 'admin.html';
      else window.location.href = 'registro.html';
    }
  }catch(e){}
})();
