// Inicializa os ícones da biblioteca Lucide
function initIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Variável global para armazenar o destino após o login/seleção de perfil
let pendingRedirectUrl = null;

// Função de navegação com verificação de login/perfil
function navigateTo(targetUrl) {
  if (!targetUrl) return;

  // A página inicial (index.html) pode ser acessada livremente
  if (targetUrl === 'index.html') {
    window.location.href = targetUrl;
    return;
  }

  const userRole = sessionStorage.getItem('userRole');

  // Se ainda não escolheu um perfil, salva o destino desejado e abre o modal de login
  if (!userRole) {
    pendingRedirectUrl = targetUrl;
    openPerfilModal();
  } else {
    // Se já tiver perfil selecionado, navega normalmente
    window.location.href = targetUrl;
  }
}

// Controle do Modal de Perfil e Login
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
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Seleção de perfis públicos (Aluno, Responsável, Visitante)
function selectRole(roleName) {
  sessionStorage.setItem('userRole', roleName);
  closePerfilModal();

  // Redireciona para a página solicitada antes do login ou recarrega a atual
  if (pendingRedirectUrl) {
    const destination = pendingRedirectUrl;
    pendingRedirectUrl = null;
    window.location.href = destination;
  } else {
    location.reload();
  }
}

// Alternar visualização do formulário de Login (Gestão / Professor)
function showLoginForm() {
  document.getElementById('step-perfil-choice')?.classList.add('hidden');
  document.getElementById('step-login-form')?.classList.remove('hidden');
}

function hideLoginForm() {
  document.getElementById('step-perfil-choice')?.classList.remove('hidden');
  document.getElementById('step-login-form')?.classList.add('hidden');
}

// Login restrito da Gestão / Professor (c@stello / c@stello123)
function handleStaffLogin(event) {
  event.preventDefault();
  const user = document.getElementById('login-user')?.value.trim();
  const pass = document.getElementById('login-pass')?.value.trim();
  const errorMsg = document.getElementById('login-error');

  if (user === 'c@stello' && pass === 'c@stello123') {
    if (errorMsg) errorMsg.classList.add('hidden');
    sessionStorage.setItem('userRole', 'Gestão/Professor');
    closePerfilModal();

    if (pendingRedirectUrl) {
      const destination = pendingRedirectUrl;
      pendingRedirectUrl = null;
      window.location.href = destination;
    } else {
      location.reload();
    }
  } else {
    if (errorMsg) errorMsg.classList.remove('hidden');
  }
}

// Logout do sistema
function logout() {
  sessionStorage.removeItem('userRole');
  window.location.href = 'index.html';
}

// RECURSO CTRL + V PARA COLAR IMAGENS NOS FORMULÁRIOS
document.addEventListener('paste', function (event) {
  const items = (event.clipboardData || event.originalEvent?.clipboardData)?.items;
  if (!items) return;

  for (let item of items) {
    if (item.type.indexOf('image') !== -1) {
      const blob = item.getAsFile();
      const reader = new FileReader();

      reader.onload = function (e) {
        const targetInput = document.getElementById('home-foto') ||
                            document.getElementById('hist-foto') ||
                            document.getElementById('arq-foto') || 
                            document.getElementById('eq-foto') || 
                            document.getElementById('vest-foto') ||
                            document.getElementById('parc-foto') ||
                            document.getElementById('matr-foto');

        if (targetInput) {
          targetInput.value = e.target.result;
          targetInput.style.border = '2px solid #25d366';
          setTimeout(() => { targetInput.style.border = '1px solid var(--border-color)'; }, 2000);
        }
      };

      reader.readAsDataURL(blob);
    }
  }
});

// Executado ao carregar qualquer página
window.addEventListener('DOMContentLoaded', () => {
  initIcons();

  const savedRole = sessionStorage.getItem('userRole');
  const badge = document.getElementById('user-badge');

  if (savedRole && badge) {
    badge.innerHTML = `Perfil: <strong>${savedRole}</strong> <button onclick="logout()" class="btn-logout">Sair</button>`;
    badge.classList.remove('hidden');
  }

  // Revela ferramentas administrativas caso seja Gestão/Professor
  if (savedRole === 'Gestão/Professor') {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
  }
});