// ============================================
// INTERFACE DE USUÁRIO PARA SISTEMA DE FILIAIS
// Popula selects e gerencia UI de filiais
// ============================================

// Popular select de filiais no login
function populateLoginBranchSelect() {
    const select = document.getElementById('loginBranch');
    if (!select) return;

    // Limpar opções existentes (exceto a primeira)
    while (select.options.length > 1) {
        select.remove(1);
    }

    // Obter filiais ativas
    const branches = branchDB.getActiveBranches();
    
    // Agrupar por estado
    const branchesByState = {};
    branches.forEach(branch => {
        if (!branchesByState[branch.stateUF]) {
            branchesByState[branch.stateUF] = [];
        }
        branchesByState[branch.stateUF].push(branch);
    });

    // Adicionar filiais agrupadas por estado
    Object.keys(branchesByState).sort().forEach(stateUF => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = `${branchesByState[stateUF][0].state} (${branchesByState[stateUF].length})`;
        
        branchesByState[stateUF].forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.id;
            option.textContent = `${branch.code} - ${branch.name}`;
            option.dataset.city = branch.city;
            option.dataset.pastor = branch.pastor;
            optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
    });

    console.log(`✅ ${branches.length} filiais carregadas no select de login`);
}

// Popular select de filiais no registro
function populateRegisterBranchSelect() {
    const select = document.getElementById('registerBranch');
    if (!select) return;

    // Limpar opções existentes (exceto a primeira)
    while (select.options.length > 1) {
        select.remove(1);
    }

    // Obter filiais ativas
    const branches = branchDB.getActiveBranches();
    
    // Agrupar por estado
    const branchesByState = {};
    branches.forEach(branch => {
        if (!branchesByState[branch.stateUF]) {
            branchesByState[branch.stateUF] = [];
        }
        branchesByState[branch.stateUF].push(branch);
    });

    // Adicionar filiais agrupadas por estado
    Object.keys(branchesByState).sort().forEach(stateUF => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = `${branchesByState[stateUF][0].state} (${branchesByState[stateUF].length})`;
        
        branchesByState[stateUF].forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.id;
            option.textContent = `${branch.code} - ${branch.name}`;
            option.dataset.city = branch.city;
            option.dataset.pastor = branch.pastor;
            optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
    });

    console.log(`✅ ${branches.length} filiais carregadas no select de registro`);
}

// Adicionar filtro de busca no select de filiais
function addBranchSearchFilter(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Criar input de busca
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'branch-search-input';
    searchInput.placeholder = '🔍 Buscar filial por nome, código ou cidade...';
    
    // Inserir antes do select
    select.parentNode.insertBefore(searchInput, select);

    // Guardar todas as opções originais
    const allOptions = Array.from(select.querySelectorAll('option, optgroup'));
    
    // Evento de busca
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (!searchTerm) {
            // Mostrar todas as opções
            allOptions.forEach(el => el.style.display = '');
            return;
        }

        // Filtrar opções
        select.querySelectorAll('option').forEach(option => {
            if (option.value === '') {
                option.style.display = '';
                return;
            }

            const text = option.textContent.toLowerCase();
            const city = (option.dataset.city || '').toLowerCase();
            const matches = text.includes(searchTerm) || city.includes(searchTerm);
            
            option.style.display = matches ? '' : 'none';
        });

        // Ocultar optgroups vazios
        select.querySelectorAll('optgroup').forEach(optgroup => {
            const visibleOptions = Array.from(optgroup.querySelectorAll('option'))
                .filter(opt => opt.style.display !== 'none');
            optgroup.style.display = visibleOptions.length > 0 ? '' : 'none';
        });
    });
}

// Mostrar informações da filial selecionada
function showBranchInfo(branchId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const branch = branchDB.getBranchById(parseInt(branchId));
    if (!branch) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="branch-info-card">
            <div class="branch-info-header">
                <i class="fas fa-building"></i>
                <strong>${branch.name}</strong>
            </div>
            <div class="branch-info-details">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${branch.city} - ${branch.stateUF}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-user-tie"></i>
                    <span>${branch.pastor}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-users"></i>
                    <span>${branch.memberCount} membros</span>
                </div>
            </div>
        </div>
    `;
}

// Atualizar formulário de login para usar sistema de filiais
function updateLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const branchId = document.getElementById('loginBranch').value;

        if (!branchId) {
            showNotification('Por favor, selecione uma filial', 'error');
            return;
        }

        // Mostrar loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        submitBtn.disabled = true;

        try {
            // Autenticar com filial
            const result = await authSystem.authenticate(username, password, branchId);

            if (result.success) {
                showNotification(result.message, 'success');
                
                // Aguardar um pouco antes de redirecionar
                setTimeout(() => {
                    document.getElementById('loginScreen').style.display = 'none';
                    document.getElementById('mainApp').style.display = 'flex';
                    
                    // Atualizar informações do usuário e filial
                    updateUserInfo();
                    updateBranchInfo();
                    
                    // Carregar dashboard
                    if (typeof loadDashboard === 'function') {
                        loadDashboard();
                    }
                }, 500);
            } else {
                showNotification(result.message, 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Erro no login:', error);
            showNotification('Erro ao fazer login. Tente novamente.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Atualizar formulário de registro para usar sistema de filiais
function updateRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const branchId = document.getElementById('registerBranch').value;
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const birthdate = document.getElementById('registerBirthdate').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        const howFound = document.getElementById('registerHowFound').value;
        const terms = document.getElementById('registerTerms').checked;

        // Validações
        if (!branchId) {
            showNotification('Por favor, selecione uma filial', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            showNotification('As senhas não coincidem', 'error');
            return;
        }

        if (!terms) {
            showNotification('Você deve aceitar os termos de uso', 'error');
            return;
        }

        // Mostrar loading
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
        submitBtn.disabled = true;

        try {
            // Criar novo usuário com filial
            const newUser = {
                username: username,
                password: password,
                name: name,
                email: email,
                phone: phone,
                birthdate: birthdate,
                role: 'visitor',
                branchId: parseInt(branchId),
                howFound: howFound,
                active: false, // Precisa ser aprovado
                pendingApproval: true,
                createdAt: new Date().toISOString()
            };

            const result = authSystem.registerUser(newUser);

            if (result.success) {
                showNotification('Cadastro realizado com sucesso! Aguarde aprovação.', 'success');
                
                // Voltar para tela de login após 2 segundos
                setTimeout(() => {
                    showLoginForm();
                    registerForm.reset();
                }, 2000);
            } else {
                showNotification(result.message, 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            showNotification('Erro ao realizar cadastro. Tente novamente.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Atualizar informações da filial no header
function updateBranchInfo() {
    const branch = branchIsolation.getCurrentBranch();
    if (!branch) return;

    // Adicionar informação da filial no header
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        let branchInfo = document.getElementById('headerBranchInfo');
        if (!branchInfo) {
            branchInfo = document.createElement('div');
            branchInfo.id = 'headerBranchInfo';
            branchInfo.className = 'branch-info-header';
            userInfo.insertBefore(branchInfo, userInfo.firstChild);
        }
        
        branchInfo.innerHTML = `
            <div class="branch-badge" title="${branch.name}">
                <i class="fas fa-building"></i>
                <span>${branch.code}</span>
            </div>
        `;
    }

    // Atualizar título da página
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
        pageTitle.textContent = `${branch.name} - Sistema de Gestão`;
    }
}

// Adicionar seletor de filial no header (para super admin)
function addBranchSwitcher() {
    const user = authSystem.getCurrentUser();
    if (!user || user.role !== 'super_admin') return;

    const userInfo = document.querySelector('.user-info');
    if (!userInfo) return;

    const switcherContainer = document.createElement('div');
    switcherContainer.className = 'branch-switcher';
    switcherContainer.innerHTML = `
        <button class="btn-branch-switch" onclick="showBranchSwitchModal()">
            <i class="fas fa-exchange-alt"></i>
            Trocar Filial
        </button>
    `;
    
    userInfo.insertBefore(switcherContainer, userInfo.firstChild);
}

// Modal para trocar de filial
function showBranchSwitchModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content branch-switch-modal">
            <div class="modal-header">
                <h3><i class="fas fa-exchange-alt"></i> Trocar de Filial</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="switchBranchSelect">Selecione a nova filial:</label>
                    <select id="switchBranchSelect" class="form-control">
                        <option value="">Escolha uma filial...</option>
                    </select>
                </div>
                <div id="switchBranchInfo"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                    Cancelar
                </button>
                <button class="btn btn-primary" onclick="executeBranchSwitch()">
                    <i class="fas fa-check"></i> Confirmar Troca
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Popular select
    const select = document.getElementById('switchBranchSelect');
    const branches = branchDB.getActiveBranches();
    const currentBranch = branchIsolation.getCurrentBranch();
    
    branches.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch.id;
        option.textContent = `${branch.code} - ${branch.name} (${branch.city})`;
        if (currentBranch && branch.id === currentBranch.id) {
            option.textContent += ' (Atual)';
            option.disabled = true;
        }
        select.appendChild(option);
    });
    
    // Mostrar info ao selecionar
    select.addEventListener('change', (e) => {
        showBranchInfo(e.target.value, 'switchBranchInfo');
    });
}

// Executar troca de filial
function executeBranchSwitch() {
    const select = document.getElementById('switchBranchSelect');
    const branchId = select.value;
    
    if (!branchId) {
        showNotification('Selecione uma filial', 'error');
        return;
    }
    
    const result = authSystem.switchBranch(branchId);
    
    if (result.success) {
        showNotification(result.message, 'success');
        
        // Fechar modal
        document.querySelector('.modal-overlay').remove();
        
        // Recarregar página
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        showNotification(result.message, 'error');
    }
}

// Inicializar sistema de filiais na UI
function initializeBranchUI() {
    // Popular selects
    populateLoginBranchSelect();
    populateRegisterBranchSelect();
    
    // Adicionar filtros de busca
    // addBranchSearchFilter('loginBranch');
    // addBranchSearchFilter('registerBranch');
    
    // Atualizar formulários
    updateLoginForm();
    updateRegisterForm();
    
    console.log('✅ Interface de filiais inicializada');
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBranchUI);
} else {
    initializeBranchUI();
}

// Exportar funções globais
if (typeof window !== 'undefined') {
    window.populateLoginBranchSelect = populateLoginBranchSelect;
    window.populateRegisterBranchSelect = populateRegisterBranchSelect;
    window.showBranchInfo = showBranchInfo;
    window.updateBranchInfo = updateBranchInfo;
    window.showBranchSwitchModal = showBranchSwitchModal;
    window.executeBranchSwitch = executeBranchSwitch;
}
