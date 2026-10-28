if (window.lucide) {
  lucide.createIcons();
}

let pendingRedirectUrl = null;

// NAVEGAÇÃO ENTRE PASTAS
function navigateTo(targetUrl) {
  if (targetUrl.includes('menu.html')) {
    window.location.href = targetUrl;
    return;
  }

  const userRole = sessionStorage.getItem('userRole');

  if (!userRole) {
    pendingRedirectUrl = targetUrl;
    openPerfilModal();
  } else {
    window.location.href = targetUrl;
  }
}

// MODAL "ENTRAR"
function openPerfilModal() {
  const modal = document.getElementById('modal-perfil');
  if (modal) {
    document.getElementById('step-perfil-choice')?.classList.remove('hidden');
    document.getElementById('step-login-form')?.classList.add('hidden');
    modal.classList.remove('hidden');
  }
}

function closePerfilModal() {
  const modal = document.getElementById('modal-perfil');
  if (modal) modal.classList.add('hidden');
}

function selectRole(roleName) {
  sessionStorage.setItem('userRole', roleName);
  closePerfilModal();

  if (pendingRedirectUrl) {
    window.location.href = pendingRedirectUrl;
  } else {
    location.reload();
  }
}

function showLoginForm() {
  document.getElementById('step-perfil-choice')?.classList.add('hidden');
  document.getElementById('step-login-form')?.classList.remove('hidden');
}

function hideLoginForm() {
  document.getElementById('step-perfil-choice')?.classList.remove('hidden');
  document.getElementById('step-login-form')?.classList.add('hidden');
}

// LOGIN DE GESTÃO / PROFESSOR (admin / 1234)
function handleStaffLogin(event) {
  event.preventDefault();
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  const errorMsg = document.getElementById('login-error');

  if (user === 'admin' && pass === '1234') {
    if (errorMsg) errorMsg.classList.add('hidden');
    sessionStorage.setItem('userRole', 'Gestão/Professor');
    closePerfilModal();

    if (pendingRedirectUrl) {
      window.location.href = pendingRedirectUrl;
    } else {
      location.reload();
    }
  } else {
    if (errorMsg) errorMsg.classList.remove('hidden');
  }
}

function logout() {
  sessionStorage.removeItem('userRole');
  window.location.href = '../PAGINA_INICIAL/menu.html';
}

window.addEventListener('DOMContentLoaded', () => {
  const savedRole = sessionStorage.getItem('userRole');
  const badge = document.getElementById('user-badge');
  
  if (savedRole && badge) {
    badge.innerHTML = `Perfil: <strong>${savedRole}</strong> <button onclick="logout()" class="btn-logout">Sair</button>`;
    badge.classList.remove('hidden');
  }

  if (savedRole === 'Gestão/Professor') {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
  }
});