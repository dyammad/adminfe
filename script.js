// Church Management System JavaScript

// Global variables
let currentUser = null;
let members = [];
let ministries = [];
let cells = [];
let events = [];
let prayerRequests = [];
let baptisms = [];
let donations = [];
let leaders = [];
let transactions = [];
let agenda = [];
let sampleData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema da igreja...');
    initializeApp();
    loadSampleData();
    
    // Verificar sessão existente
    if (window.authSystem && window.authSystem.checkExistingSession()) {
        window.authSystem.showMainApp();
        // Aguardar um pouco para garantir que os dados foram carregados
        setTimeout(() => {
            updateDashboard();
        }, 100);
    }
});

function initializeApp() {
    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form handler
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Logout button handler
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Mobile menu handlers
    initializeMobileMenu();
    
    // Navigation handlers
    const navLinks = document.querySelectorAll('.sidebar-menu a[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToSection(this.dataset.section);
            // Fechar menu mobile após navegação
            closeMobileMenu();
        });
    });

    // Form handlers
    document.getElementById('memberForm').addEventListener('submit', handleMemberSubmit);
    document.getElementById('ministryForm').addEventListener('submit', handleMinistrySubmit);
    document.getElementById('leaderForm').addEventListener('submit', handleLeaderSubmit);
    document.getElementById('cellForm').addEventListener('submit', handleCellSubmit);
    document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);
    document.getElementById('prayerForm').addEventListener('submit', handlePrayerSubmit);
    document.getElementById('baptismForm').addEventListener('submit', handleBaptismSubmit);
    document.getElementById('donationForm').addEventListener('submit', handleDonationSubmit);
    document.getElementById('agendaForm').addEventListener('submit', handleAgendaSubmit);
    document.getElementById('transactionForm').addEventListener('submit', handleTransactionSubmit);
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);
    
    // Transaction type change handler
    document.getElementById('transactionType').addEventListener('change', handleTransactionTypeChange);
}

// Mobile Menu Functions
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (sidebar && sidebarOverlay) {
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

function openMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (sidebar) sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }
    
    // Prevenir scroll do body quando menu está aberto
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Restaurar scroll do body
    document.body.style.overflow = '';
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!window.authSystem) {
        alert('Sistema de autenticação não carregado!');
        return;
    }
    
    const result = await window.authSystem.authenticate(username, password);
    
    if (result.success) {
        currentUser = result.user;
        window.authSystem.showMainApp();
        document.getElementById('currentUser').textContent = result.user.name;
        
        // Atualizar interface baseada nas permissões
        updateUIBasedOnPermissions();
        
        // Aguardar um pouco para garantir que os dados foram carregados
        setTimeout(() => {
            updateDashboard();
            navigateToSection('dashboard');
        }, 100);
        
        // Resetar formulário
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        window.authSystem.showMessage(result.message, 'error');
    }
}

function handleLogout() {
    if (window.authSystem) {
        window.authSystem.logout();
    } else {
        // Fallback para o sistema antigo
        currentUser = null;
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

// Funções de controle do formulário de cadastro
function showRegisterForm() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'flex';
    // Populate the branch selection dropdown when the form is shown
    if (window.populateBranchSelect) {
        window.populateBranchSelect('registerBranchSelect');
    }
}

function showLoginForm() {
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
}

// Processar cadastro de visitante
async function handleRegister(e) {
    e.preventDefault();
    
    if (!window.authSystem) {
        alert('Sistema de autenticação não carregado!');
        return;
    }
    
    // Obter dados do formulário
    const formData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        phone: document.getElementById('registerPhone').value,
        birthdate: document.getElementById('registerBirthdate').value,
        username: document.getElementById('registerUsername').value,
        password: document.getElementById('registerPassword').value,
        howFound: document.getElementById('registerHowFound').value,
        branchId: document.getElementById('registerBranchSelect').value
    };
    
    // Validar seleção de filial
    if (!formData.branchId) {
        window.authSystem.showMessage('Você deve selecionar uma filial', 'error');
        return;
    }
    
    // Validar confirmação de senha
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    if (formData.password !== passwordConfirm) {
        window.authSystem.showMessage('As senhas não coincidem', 'error');
        return;
    }
    
    // Verificar termos de uso
    if (!document.getElementById('registerTerms').checked) {
        window.authSystem.showMessage('Você deve aceitar os termos de uso', 'error');
        return;
    }
    
    // Tentar fazer o cadastro
    const result = await window.authSystem.selfRegister(formData);
    
    if (result.success) {
        window.authSystem.showMessage(result.message, 'success');
        
        // Limpar formulário
        document.getElementById('registerForm').reset();
        
        // Voltar para tela de login após 3 segundos
        setTimeout(() => {
            showLoginForm();
        }, 3000);
    } else {
        window.authSystem.showMessage(result.message, 'error');
    }
}

// Atualizar interface baseada nas permissões do usuário
function updateUIBasedOnPermissions() {
    if (!window.authSystem || !window.authSystem.currentUser) return;
    
    const user = window.authSystem.currentUser;
    const permissions = user.permissions;
    
    // Ocultar/mostrar itens do menu baseado nas permissões
    const menuItems = [
        { element: '[data-section="members-active"]', permission: 'members.view' },
        { element: '[data-section="members-inactive"]', permission: 'members.view' },
        { element: '[data-section="members-visitors"]', permission: 'members.view' },
        { element: '[data-section="ministries"]', permission: 'ministries.view' },
        { element: '[data-section="leaders"]', permission: 'leaders.view' },
        { element: '[data-section="cells"]', permission: 'cells.view' },
        { element: '[data-section="events"]', permission: 'events.view' },
        { element: '[data-section="pastor-agenda"]', permission: 'agenda.view' },
        { element: '[data-section="treasury"]', permission: 'treasury.view' },
        { element: '[data-section="prayer-requests"]', permission: 'prayers.view' },
        { element: '[data-section="baptisms"]', permission: 'baptisms.view' }
        // Doações sempre visível para todos (membros podem doar)
    ];
    
    menuItems.forEach(item => {
        const element = document.querySelector(item.element);
        if (element) {
            const listItem = element.closest('li');
            if (permissions[item.permission]) {
                listItem.style.display = 'block';
            } else {
                listItem.style.display = 'none';
            }
        }
    });
    
    // Ocultar/mostrar botões de ação baseado nas permissões
    updateActionButtons();
    
    // Mostrar informações do usuário
    updateUserInfo();
}

// Atualizar botões de ação baseado nas permissões
function updateActionButtons() {
    if (!window.authSystem || !window.authSystem.currentUser) return;
    
    const permissions = window.authSystem.currentUser.permissions;
    
    // Botões de criar/adicionar
    const createButtons = [
        { selector: 'button[onclick="openMemberModal()"]', permission: 'members.create' },
        { selector: 'button[onclick="openVisitorModal()"]', permission: 'members.create' },
        { selector: 'button[onclick="openMinistryModal()"]', permission: 'ministries.create' },
        { selector: 'button[onclick="openLeaderModal()"]', permission: 'leaders.create' },
        { selector: 'button[onclick="openCellModal()"]', permission: 'cells.create' },
        { selector: 'button[onclick="openEventModal()"]', permission: 'events.create' },
        { selector: 'button[onclick="openAgendaModal()"]', permission: 'agenda.create' },
        { selector: 'button[onclick="openPrayerModal()"]', permission: 'prayers.create' },
        { selector: 'button[onclick="openBaptismModal()"]', permission: 'baptisms.create' }
        // Botão de doação sempre visível (membros podem doar)
    ];
    
    createButtons.forEach(button => {
        const element = document.querySelector(button.selector);
        if (element) {
            element.style.display = permissions[button.permission] ? 'inline-flex' : 'none';
        }
    });
}

// Atualizar informações do usuário na interface
function updateUserInfo() {
    if (!window.authSystem || !window.authSystem.currentUser) return;
    
    const user = window.authSystem.currentUser;
    const role = window.authSystem.getCurrentUserRole();
    
    // Atualizar nome do usuário
    const userNameElement = document.getElementById('currentUser');
    if (userNameElement) {
        userNameElement.textContent = user.name;
        userNameElement.title = `${user.name} (${role?.name || user.role})`;
    }
    
    // Atualizar informação da filial
    const branchInfoElement = document.getElementById('userBranchInfo');
    if (branchInfoElement && user.branchId && window.branches) {
        const branch = window.branches.find(b => b.id == user.branchId);
        if (branch) {
            branchInfoElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${branch.name}`;
            branchInfoElement.style.color = '#3498db';
        } else {
            branchInfoElement.textContent = 'Filial não definida';
        }
    } else if (branchInfoElement) {
        branchInfoElement.textContent = '';
    }
    
    // Adicionar indicador de role se não existir
    let roleIndicator = document.querySelector('.user-role-indicator');
    if (!roleIndicator && role) {
        roleIndicator = document.createElement('span');
        roleIndicator.className = 'user-role-indicator';
        roleIndicator.style.cssText = `
            background-color: ${role.color};
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 10px;
            margin-left: 8px;
            text-transform: uppercase;
        `;
        roleIndicator.textContent = role.name;
        
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.appendChild(roleIndicator);
        }
    }
}

// Funções de busca para membros
function searchMembers(type) {
    const searchInput = document.getElementById(`search${type === 'active' ? 'Active' : type === 'inactive' ? 'Inactive' : 'Visitors'}Members`);
    const searchTerm = searchInput.value.toLowerCase();
    
    let tableId;
    let dataArray;
    
    switch(type) {
        case 'active':
            tableId = 'activeMembersTable';
            dataArray = sampleData.members.filter(m => m.status === 'active');
            break;
        case 'inactive':
            tableId = 'inactiveMembersTable';
            dataArray = sampleData.members.filter(m => m.status === 'inactive');
            break;
        case 'visitors':
            tableId = 'visitorsTable';
            dataArray = sampleData.visitors;
            break;
    }
    
    if (!dataArray) return;
    
    // Filtrar dados baseado na busca
    const filteredData = dataArray.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) ||
               item.email.toLowerCase().includes(searchTerm) ||
               (item.phone && item.phone.toLowerCase().includes(searchTerm));
    });
    
    // Atualizar tabela com dados filtrados
    updateMemberTable(tableId, filteredData, type);
}

// Filtrar membros por célula
function filterMembersByCell(type) {
    const filterSelect = document.getElementById(`filter${type === 'active' ? 'Active' : 'Inactive'}MembersByCell`);
    const selectedCell = filterSelect.value;
    
    let tableId = type === 'active' ? 'activeMembersTable' : 'inactiveMembersTable';
    let dataArray = sampleData.members.filter(m => m.status === type);
    
    if (selectedCell) {
        dataArray = dataArray.filter(member => member.cell === selectedCell);
    }
    
    updateMemberTable(tableId, dataArray, type);
}

// Filtrar membros inativos por motivo
function filterMembersByReason(type) {
    const filterSelect = document.getElementById('filterInactiveMembersByReason');
    const selectedReason = filterSelect.value;
    
    let dataArray = sampleData.members.filter(m => m.status === 'inactive');
    
    if (selectedReason) {
        dataArray = dataArray.filter(member => member.inactiveReason === selectedReason);
    }
    
    updateMemberTable('inactiveMembersTable', dataArray, 'inactive');
}

// Filtrar visitantes por fonte
function filterVisitorsBySource() {
    const filterSelect = document.getElementById('filterVisitorsBySource');
    const selectedSource = filterSelect.value;
    
    let dataArray = sampleData.visitors;
    
    if (selectedSource) {
        dataArray = dataArray.filter(visitor => visitor.howFound === selectedSource);
    }
    
    updateMemberTable('visitorsTable', dataArray, 'visitors');
}

// Atualizar tabela de membros
function updateMemberTable(tableId, data, type) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        if (type === 'active') {
            const itemId = typeof item.id === 'string' ? `'${item.id}'` : item.id;
            const isNewMember = item.isNew === true;
            const rowStyle = isNewMember ? 'style="color: #e74c3c; font-weight: bold;"' : '';
            const newBadge = isNewMember ? '<span style="background: #e74c3c; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; margin-left: 5px;">NOVO</span>' : '';
            
            row.innerHTML = `
                <td ${rowStyle}>${item.name}${newBadge}</td>
                <td ${rowStyle}>${item.email}</td>
                <td ${rowStyle}>${item.phone}</td>
                <td ${rowStyle}>${item.birthDate ? new Date(item.birthDate).toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td ${rowStyle}>${item.cell || 'Não definida'}</td>
                <td>
                    <button class="btn-icon btn-info" onclick="requestBaptism(${itemId})" title="Solicitar Batismo">
                        <i class="fas fa-water"></i>
                    </button>
                    <button class="btn-icon" onclick="editMember(${itemId})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteMember(${itemId})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        } else if (type === 'inactive') {
            const itemId = typeof item.id === 'string' ? `'${item.id}'` : item.id;
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>${item.inactiveDate ? new Date(item.inactiveDate).toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td>${item.inactiveReason || 'Não informado'}</td>
                <td>
                    <button class="btn-icon" onclick="reactivateMember(${itemId})" title="Reativar">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteMember(${itemId})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        } else if (type === 'visitors') {
            const itemId = typeof item.id === 'string' ? `'${item.id}'` : item.id;
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>${item.branchName || 'Não informado'}</td>
                <td>${item.visitDate ? new Date(item.visitDate).toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td>${getHowFoundText(item.howFound)}</td>
                <td>
                    <button class="btn-icon" onclick="convertToMember(${itemId})" title="Converter em Membro">
                        <i class="fas fa-user-plus"></i>
                    </button>
                    <button class="btn-icon" onclick="editVisitor(${itemId})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteVisitor(${itemId})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        }
        
        tbody.appendChild(row);
    });
}

// Obter texto legível para "como conheceu"
function getHowFoundText(value) {
    const options = {
        'amigo': 'Indicação de amigo',
        'internet': 'Internet',
        'redes_sociais': 'Redes sociais',
        'passando': 'Passando pela rua',
        'evento': 'Evento da igreja',
        'outro': 'Outro'
    };
    return options[value] || value;
}

// Verificar e mostrar alerta de cadastros pendentes
function checkPendingRegistrations() {
    if (!window.authSystem) {
        console.log('AuthSystem não encontrado.');
        return;
    }

    // Verificar se usuário tem permissão para ver usuários
    const canViewUsers = window.authSystem.hasPermission('users.view');
    if (!canViewUsers) {
        console.log('Usuário atual NÃO TEM permissão para ver usuários pendentes (users.view). O alerta não será exibido.');
        hidePendingRegistrationsAlert(); // Garante que o alerta seja escondido se não houver permissão
        return;
    }

    console.log('Usuário atual TEM permissão para ver usuários pendentes.');
    const result = window.authSystem.getPendingUsers();
    console.log('Resultado da busca por usuários pendentes:', result);

    if (result.success && result.users.length > 0) {
        console.log(`Encontrado(s) ${result.users.length} usuário(s) pendente(s). Exibindo alerta.`);
        showPendingRegistrationsAlert(result.users.length);
    } else {
        console.log('Nenhum usuário pendente encontrado. Ocultando alerta.');
        hidePendingRegistrationsAlert();
    }
}

// Mostrar alerta de cadastros pendentes
function showPendingRegistrationsAlert(count) {
    const alertContainer = document.getElementById('pendingRegistrationsAlert');
    const messageElement = document.getElementById('pendingRegistrationsMessage');
    
    if (alertContainer && messageElement) {
        messageElement.textContent = `${count} ${count === 1 ? 'visitante se cadastrou' : 'visitantes se cadastraram'} e ${count === 1 ? 'aguarda' : 'aguardam'} aprovação.`;
        alertContainer.style.display = 'block';
    }
}

// Ocultar alerta de cadastros pendentes
function hidePendingRegistrationsAlert() {
    const alertContainer = document.getElementById('pendingRegistrationsAlert');
    if (alertContainer) {
        alertContainer.style.display = 'none';
    }
}

// Dispensar alerta temporariamente
function dismissPendingAlert() {
    hidePendingRegistrationsAlert();
    // Salvar no localStorage que foi dispensado (opcional)
    localStorage.setItem('pendingAlertDismissed', Date.now().toString());
}

// Navigation functions
function navigateToSection(sectionId) {
    // Caso especial para o gerenciamento de usuários, que é dinâmico
    if (sectionId === 'user-management') {
        if (window.userManager && typeof window.userManager.showUserManagement === 'function') {
            window.userManager.showUserManagement();
        } else {
            console.error('User Manager não está inicializado.');
            alert('Erro ao carregar o gerenciamento de usuários.');
        }
        return; // A função showUserManagement cuidará da navegação
    }

    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.add('active');
    } else {
        console.error(`Seção com ID '${sectionId}' não encontrada.`);
        return; // Interrompe se a seção não existe
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.sidebar-menu a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'members-active': 'Membros Ativos',
        'members-inactive': 'Membros Inativos',
        'members-visitors': 'Visitantes',
        'ministries': 'Ministérios',
        'devotional': 'Devocional Diário',
        'leaders': 'Líderes',
        'cells': 'Células',
        'events': 'Eventos',
        'pastor-agenda': 'Agenda do Pastor',
        'treasury': 'Tesouraria',
        'prayer-requests': 'Pedidos de Oração',
        'baptisms': 'Batismos',
        'donations': 'Doações',
        'bible': 'Bíblia Sagrada'
    };
    document.getElementById('pageTitle').textContent = titles[sectionId] || 'Sistema';
    
    // Load section-specific data
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'members-active':
            loadActiveMembers();
            break;
        case 'members-inactive':
            loadInactiveMembers();
            break;
        case 'members-visitors':
            loadVisitors();
            break;
        case 'ministries':
            loadMinistries();
            break;
        case 'devotional':
            loadDevotional();
            break;
        case 'leaders':
            loadLeaders();
            break;
        case 'cells':
            loadCells();
            break;
        case 'events':
            loadEvents();
            break;
        case 'pastor-agenda':
            loadPastorAgenda();
            break;
        case 'treasury':
            loadTreasury();
            break;
        case 'prayer-requests':
            loadPrayerRequests();
            break;
        case 'baptisms':
            loadBaptisms();
            break;
        case 'donations':
            loadDonations();
            break;
        case 'bible':
            loadBible();
            break;
    }
}

function updateDashboard() {
    console.log('updateDashboard() chamada');
    console.log('sampleData:', sampleData);
    
    if (!sampleData.members || !sampleData.cells || !sampleData.donations) {
        console.warn('Dados ainda não carregados, tentando novamente...');
        setTimeout(updateDashboard, 200);
        return;
    }
    
    console.log('Dados carregados, atualizando dashboard...');
    
    // Update member statistics
    const activeMembers = sampleData.members.filter(m => m.status === 'active').length;
    const totalMembers = sampleData.members.length;
    const totalCells = sampleData.cells.length;
    
    document.getElementById('activeMembers').textContent = activeMembers;
    document.getElementById('totalMembers').textContent = totalMembers;
    document.getElementById('totalCells').textContent = totalCells;
    
    // Calculate monthly offering
    const currentMonth = new Date().getMonth();
    const monthlyOffering = sampleData.donations
        .filter(d => new Date(d.date).getMonth() === currentMonth)
        .reduce((sum, d) => sum + d.amount, 0);
    
    document.getElementById('monthlyOffering').textContent = 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyOffering);
    
    // Verificar cadastros pendentes (apenas para admins)
    checkPendingRegistrations();
    
    // Preencher filtros de células
    populateCellFilters();
    
    // Update charts
    updateCharts();
}

// Popular filtros de células
function populateCellFilters() {
    const activeFilter = document.getElementById('filterActiveMembersByCell');
    const inactiveFilter = document.getElementById('filterInactiveMembersByCell');
    
    if (activeFilter && inactiveFilter && sampleData.cells) {
        // Limpar opções existentes (exceto a primeira)
        activeFilter.innerHTML = '<option value="">Todas as células</option>';
        inactiveFilter.innerHTML = '<option value="">Todas as células</option>';
        
        // Adicionar células
        sampleData.cells.forEach(cell => {
            const option1 = document.createElement('option');
            option1.value = cell.name;
            option1.textContent = cell.name;
            activeFilter.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = cell.name;
            option2.textContent = cell.name;
            inactiveFilter.appendChild(option2);
        });
    }
}


// Member management functions
function loadActiveMembers() {
    let allActiveMembers = [];
    
    // Adicionar membros do sample data
    if (sampleData.members) {
        const sampleMembers = sampleData.members
            .filter(m => m.status === 'active')
            .map(m => ({
                ...m,
                createdAt: m.joinedAt || m.createdAt,
                isNew: false
            }));
        allActiveMembers = sampleMembers;
    }
    
    // Adicionar membros do authSystem
    if (window.authSystem && window.authSystem.users) {
        const authMembers = window.authSystem.users
            .filter(u => u.role === 'member' && u.active)
            .map(u => {
                const createdDate = new Date(u.createdAt || u.approvedAt);
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                
                return {
                    id: `auth_${u.id}`,
                    name: u.name,
                    email: u.email,
                    phone: u.phone || 'Não informado',
                    birthDate: u.birthdate || '',
                    cell: u.cell || 'Não definida',
                    status: 'active',
                    branchId: u.branchId,
                    createdAt: u.createdAt || u.approvedAt,
                    isNew: createdDate > oneWeekAgo
                };
            });
        
        allActiveMembers = [...allActiveMembers, ...authMembers];
    }
    
    // Ordenar: novos membros primeiro (por data de criação decrescente)
    allActiveMembers.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Mais recentes primeiro
    });
    
    updateMemberTable('activeMembersTable', allActiveMembers, 'active');
}

function loadInactiveMembers() {
    if (!sampleData.members) return;
    
    const inactiveMembers = sampleData.members.filter(m => m.status === 'inactive');
    updateMemberTable('inactiveMembersTable', inactiveMembers, 'inactive');
}

function loadVisitors() {
    // Combinar visitantes do sample data com visitantes cadastrados
    let allVisitors = [];
    
    // Adicionar visitantes do sample data
    if (sampleData.visitors) {
        allVisitors = [...sampleData.visitors];
    }
    
    // Adicionar visitantes cadastrados pelo sistema de autenticação
    if (window.authSystem && window.authSystem.users) {
        const registeredVisitors = window.authSystem.users
            .filter(u => u.role === 'visitor')
            .map(u => ({
                id: `auth_${u.id}`,
                name: u.name,
                email: u.email,
                phone: u.phone || 'Não informado',
                visitDate: u.createdAt,
                howFound: u.howFound || 'Não informado',
                branchId: u.branchId,
                branchName: window.branches?.find(b => b.id == u.branchId)?.name || 'Não informado',
                approved: u.approved,
                active: u.active
            }));
        
        allVisitors = [...allVisitors, ...registeredVisitors];
    }
    
    updateMemberTable('visitorsTable', allVisitors, 'visitors');
}

// Ministry management
function loadMinistries() {
    const grid = document.getElementById('ministriesGrid');
    grid.innerHTML = '';
    
    // Verificar se usuário pode gerenciar ministérios
    const canManageMinistries = window.authSystem && window.authSystem.hasPermission('ministries.edit');
    
    // Mostrar/ocultar botão de adicionar ministério
    const addMinistryBtn = document.getElementById('addMinistryBtn');
    if (addMinistryBtn) {
        addMinistryBtn.style.display = canManageMinistries ? 'inline-flex' : 'none';
    }
    
    ministries.forEach(ministry => {
        const card = document.createElement('div');
        card.className = 'ministry-card';
        
        // Buscar telefone do líder (simulado - em produção viria do banco)
        const leaderPhone = ministry.leaderPhone || '(11) 98765-4321';
        
        card.innerHTML = `
            <h3>${ministry.name}</h3>
            <p>${ministry.description}</p>
            <div class="leader">
                Líder: <span class="leader-name" onclick="showLeaderContact('${ministry.leader}', '${leaderPhone}')" 
                       style="color: #3498db; cursor: pointer; text-decoration: underline;" 
                       title="Clique para ver contato">
                    ${ministry.leader}
                </span>
            </div>
            ${canManageMinistries ? `
                <div style="margin-top: 15px;">
                    <button class="btn btn-secondary" onclick="editMinistry(${ministry.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger" onclick="deleteMinistry(${ministry.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            ` : ''}
        `;
        grid.appendChild(card);
    });
}

// Função para mostrar contato do líder
function showLeaderContact(leaderName, leaderPhone) {
    const message = `
        📞 Contato do Líder
        
        Nome: ${leaderName}
        Telefone: ${leaderPhone}
        
        Clique em OK para copiar o número
    `;
    
    if (confirm(message)) {
        // Copiar para clipboard
        navigator.clipboard.writeText(leaderPhone).then(() => {
            if (window.authSystem) {
                window.authSystem.showMessage(`Telefone copiado: ${leaderPhone}`, 'success');
            } else {
                alert(`Telefone copiado: ${leaderPhone}`);
            }
        }).catch(() => {
            alert(`Telefone: ${leaderPhone}`);
        });
    }
}

// Modal functions - Removidas funções duplicadas, mantidas apenas as versões completas abaixo

function handleMemberSubmit(e) {
    e.preventDefault();
    
    const memberId = document.getElementById('memberId').value;
    const memberData = {
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        birthdate: document.getElementById('memberBirthdate').value,
        address: document.getElementById('memberAddress').value,
        cell: document.getElementById('memberCell').value,
        status: 'active'
    };
    
    if (memberId) {
        // Edit existing member
        const memberIndex = members.findIndex(m => m.id == memberId);
        if (memberIndex !== -1) {
            members[memberIndex] = { ...members[memberIndex], ...memberData };
            showAlert('Membro atualizado com sucesso!', 'success');
        }
    } else {
        // Add new member
        memberData.id = Date.now();
        memberData.joinedAt = new Date().toISOString();
        members.push(memberData);
        showAlert('Membro adicionado com sucesso!', 'success');
    }
    
    closeMemberModal();
    loadActiveMembers();
    updateDashboard();
}

function handleMinistrySubmit(e) {
    e.preventDefault();
    
    const ministryId = document.getElementById('ministryId').value;
    const ministryData = {
        name: document.getElementById('ministryName').value,
        description: document.getElementById('ministryDescription').value,
        leader: document.getElementById('ministryLeader').value
    };
    
    if (ministryId) {
        // Edit existing ministry
        const ministryIndex = ministries.findIndex(m => m.id == ministryId);
        if (ministryIndex !== -1) {
            ministries[ministryIndex] = { ...ministries[ministryIndex], ...ministryData };
            showAlert('Ministério atualizado com sucesso!', 'success');
        }
    } else {
        // Add new ministry
        ministryData.id = Date.now();
        ministries.push(ministryData);
        showAlert('Ministério adicionado com sucesso!', 'success');
    }
    
    closeMinistryModal();
    loadMinistries();
}

function handleLeaderSubmit(e) {
    e.preventDefault();
    
    const leaderId = document.getElementById('leaderId').value;
    const leaderData = {
        name: document.getElementById('leaderName').value,
        position: document.getElementById('leaderPosition').value,
        ministry: document.getElementById('leaderMinistry').value,
        phone: document.getElementById('leaderPhone').value
    };
    
    if (leaderId) {
        // Edit existing leader
        const leaderIndex = leaders.findIndex(l => l.id == leaderId);
        if (leaderIndex !== -1) {
            leaders[leaderIndex] = { ...leaders[leaderIndex], ...leaderData };
            showAlert('Líder atualizado com sucesso!', 'success');
        }
    } else {
        // Add new leader
        leaderData.id = Date.now();
        leaders.push(leaderData);
        showAlert('Líder adicionado com sucesso!', 'success');
    }
    
    closeLeaderModal();
    loadLeaders();
}

function handleCellSubmit(e) {
    e.preventDefault();
    
    const cellId = document.getElementById('cellId').value;
    const cellData = {
        name: document.getElementById('cellName').value,
        leader: document.getElementById('cellLeader').value,
        address: document.getElementById('cellAddress').value,
        dayOfWeek: document.getElementById('cellDayOfWeek').value,
        time: document.getElementById('cellTime').value
    };
    
    if (cellId) {
        // Edit existing cell
        const cellIndex = cells.findIndex(c => c.id == cellId);
        if (cellIndex !== -1) {
            cells[cellIndex] = { ...cells[cellIndex], ...cellData };
            showAlert('Célula atualizada com sucesso!', 'success');
        }
    } else {
        // Add new cell
        cellData.id = Date.now();
        cells.push(cellData);
        showAlert('Célula adicionada com sucesso!', 'success');
    }
    
    closeCellModal();
    loadCells();
    updateDashboard();
}

function handleEventSubmit(e) {
    e.preventDefault();
    
    const eventId = document.getElementById('eventId').value;
    const eventData = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value
    };
    
    if (eventId) {
        // Edit existing event
        const eventIndex = events.findIndex(e => e.id == eventId);
        if (eventIndex !== -1) {
            events[eventIndex] = { ...events[eventIndex], ...eventData };
            showAlert('Evento atualizado com sucesso!', 'success');
        }
    } else {
        // Add new event
        eventData.id = Date.now();
        events.push(eventData);
        showAlert('Evento adicionado com sucesso!', 'success');
    }
    
    closeEventModal();
    loadEvents();
}

function handlePrayerSubmit(e) {
    e.preventDefault();
    
    const prayerId = document.getElementById('prayerId').value;
    const prayerData = {
        requester: document.getElementById('prayerRequester').value,
        request: document.getElementById('prayerRequest').value,
        date: document.getElementById('prayerDate').value,
        status: 'pending'
    };
    
    if (prayerId) {
        // Edit existing prayer request
        const prayerIndex = prayerRequests.findIndex(p => p.id == prayerId);
        if (prayerIndex !== -1) {
            prayerRequests[prayerIndex] = { ...prayerRequests[prayerIndex], ...prayerData };
            showAlert('Pedido de oração atualizado com sucesso!', 'success');
        }
    } else {
        // Add new prayer request
        prayerData.id = Date.now();
        prayerRequests.push(prayerData);
        showAlert('Pedido de oração adicionado com sucesso!', 'success');
    }
    
    closePrayerModal();
    loadPrayerRequests();
}

function handleBaptismSubmit(e) {
    e.preventDefault();
    
    const baptismId = document.getElementById('baptismId').value;
    const baptismData = {
        name: document.getElementById('baptismName').value,
        date: document.getElementById('baptismDate').value,
        pastor: document.getElementById('baptismPastor').value,
        location: document.getElementById('baptismLocation').value,
        status: 'scheduled'
    };
    
    if (baptismId) {
        // Edit existing baptism
        const baptismIndex = baptisms.findIndex(b => b.id == baptismId);
        if (baptismIndex !== -1) {
            baptisms[baptismIndex] = { ...baptisms[baptismIndex], ...baptismData };
            showAlert('Batismo atualizado com sucesso!', 'success');
        }
    } else {
        // Add new baptism
        baptismData.id = Date.now();
        baptisms.push(baptismData);
        showAlert('Batismo agendado com sucesso!', 'success');
    }
    
    closeBaptismModal();
    loadBaptisms();
}

function handleDonationSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const donationData = {
        donor: formData.get('donor'),
        type: formData.get('type'),
        amount: parseFloat(formData.get('amount')),
        date: formData.get('date'),
        method: formData.get('method'),
        notes: formData.get('notes')
    };
    
    if (currentEditId) {
        const index = donations.findIndex(d => d.id === currentEditId);
        if (index > -1) {
            donations[index] = { ...donations[index], ...donationData };
            showAlert('Doação atualizada com sucesso!', 'success');
        }
    } else {
        donationData.id = Date.now();
        donations.push(donationData);
        showAlert('Doação adicionada com sucesso!', 'success');
    }
    
    loadDonations();
    updateDashboard();
    closeDonationModal();
}

function handleAgendaSubmit(e) {
    e.preventDefault();
    
    const agendaData = {
        title: document.getElementById('agendaTitle').value,
        description: document.getElementById('agendaDescription').value,
        date: document.getElementById('agendaDate').value,
        time: document.getElementById('agendaTime').value,
        location: document.getElementById('agendaLocation').value,
        priority: document.getElementById('agendaPriority').value
    };
    
    if (currentEditId) {
        const index = agenda.findIndex(a => a.id === currentEditId);
        if (index > -1) {
            agenda[index] = { ...agenda[index], ...agendaData };
            if (window.authSystem) {
                window.authSystem.showMessage('Compromisso atualizado com sucesso!', 'success');
            } else {
                alert('Compromisso atualizado com sucesso!');
            }
        }
    } else {
        agendaData.id = Date.now();
        agenda.push(agendaData);
        if (window.authSystem) {
            window.authSystem.showMessage('Compromisso adicionado com sucesso!', 'success');
        } else {
            alert('Compromisso adicionado com sucesso!');
        }
    }
    
    loadPastorAgenda();
    closeAgendaModal();
}

function handleTransactionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const transactionData = {
        description: formData.get('description'),
        amount: parseFloat(formData.get('amount')),
        date: formData.get('date'),
        type: formData.get('type'),
        category: formData.get('category'),
        paymentMethod: formData.get('paymentMethod'),
        notes: formData.get('notes')
    };
    
    if (currentEditId) {
        const index = transactions.findIndex(t => t.id === currentEditId);
        if (index > -1) {
            transactions[index] = { ...transactions[index], ...transactionData };
            showAlert('Transação atualizada com sucesso!', 'success');
        }
    } else {
        transactionData.id = Date.now();
        transactions.push(transactionData);
        showAlert('Transação adicionada com sucesso!', 'success');
    }
    
    loadTreasury();
    updateDashboard();
    closeTransactionModal();
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function editMember(id) {
    alert('Função de edição em desenvolvimento');
}

function deactivateMember(id) {
    if (confirm('Deseja realmente inativar este membro?')) {
        const member = members.find(m => m.id === id);
        if (member) {
            member.status = 'inactive';
            member.inactivatedAt = new Date().toISOString();
            loadActiveMembers();
            updateDashboard();
            showAlert('Membro inativado com sucesso!', 'success');
        }
    }
}

function reactivateMember(id) {
    const member = members.find(m => m.id === id);
    if (member) {
        member.status = 'active';
        member.inactivatedAt = null;
        loadInactiveMembers();
        updateDashboard();
        showAlert('Membro reativado com sucesso!', 'success');
    }
}

function convertToMember(id) {
    const visitor = members.find(m => m.id === id);
    if (visitor) {
        visitor.status = 'active';
        visitor.joinedAt = new Date().toISOString();
        loadVisitors();
        updateDashboard();
        showAlert('Visitante convertido em membro!', 'success');
    }
}

function editMinistry(id) {
    alert('Função de edição de ministério em desenvolvimento');
}

function deleteMinistry(id) {
    if (confirm('Deseja realmente excluir este ministério?')) {
        ministries = ministries.filter(m => m.id !== id);
        loadMinistries();
        showAlert('Ministério excluído com sucesso!', 'success');
    }
}

// Additional section loading functions
function loadLeaders() {
    const grid = document.getElementById('leadersGrid');
    grid.innerHTML = '';
    
    leaders.forEach(leader => {
        const card = document.createElement('div');
        card.className = 'leader-card';
        card.innerHTML = `
            <div class="avatar">
                <i class="fas fa-user"></i>
            </div>
            <h3>${leader.name}</h3>
            <p>${leader.position}</p>
            <p><strong>Ministério:</strong> ${leader.ministry}</p>
            <p><strong>Telefone:</strong> ${leader.phone}</p>
            <div style="margin-top: 15px;">
                <button class="btn btn-secondary" onclick="editLeader(${leader.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function loadCells() {
    // Mostrar/ocultar botões baseado nas permissões
    const canManageCells = window.authSystem && window.authSystem.hasPermission('cells.create');
    const requestCellBtn = document.getElementById('requestCellBtn');
    const addCellBtn = document.getElementById('addCellBtn');
    
    if (requestCellBtn && addCellBtn) {
        if (canManageCells) {
            // Admin vê apenas o botão de adicionar célula
            requestCellBtn.style.display = 'none';
            addCellBtn.style.display = 'inline-flex';
        } else {
            // Membro vê apenas o botão de solicitar participação
            requestCellBtn.style.display = 'inline-flex';
            addCellBtn.style.display = 'none';
        }
    }
    
    const tbody = document.querySelector('#cellsTable tbody');
    tbody.innerHTML = '';
    
    cells.forEach(cell => {
        const memberCount = members.filter(m => m.cell === cell.name && m.status === 'active').length;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cell.name}</td>
            <td>${cell.leader}</td>
            <td>${cell.address}</td>
            <td>${cell.dayOfWeek || 'Não definido'}</td>
            <td>${cell.time || 'Não definido'}</td>
            <td>${memberCount}</td>
            <td>
                ${canManageCells ? `
                    <button class="btn btn-secondary" onclick="editCell(${cell.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteCell(${cell.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : `
                    <button class="btn btn-success btn-sm" onclick="requestJoinCell(${cell.id})">
                        <i class="fas fa-user-plus"></i> Participar
                    </button>
                `}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadEvents() {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';
    
    // Verificar se usuário pode gerenciar eventos
    const canManageEvents = window.authSystem && window.authSystem.hasPermission('events.edit');
    
    // Mostrar/ocultar botão de adicionar evento
    const addEventBtn = document.getElementById('addEventBtn');
    if (addEventBtn) {
        addEventBtn.style.display = canManageEvents ? 'inline-flex' : 'none';
    }
    
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-date">
                <div style="font-size: 24px; font-weight: bold;">${formatDate(event.date)}</div>
                <div>${event.time}</div>
            </div>
            <div class="event-content">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><strong>Local:</strong> ${event.location}</p>
                ${canManageEvents ? `
                    <div style="margin-top: 15px;">
                        <button class="btn btn-secondary" onclick="editEvent(${event.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger" onclick="deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

function generateSimpleCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    let calendarHTML = `
        <div style="text-align: center; margin-bottom: 10px; font-weight: bold;">
            ${monthNames[currentMonth]} ${currentYear}
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
            <thead>
                <tr style="background: #ecf0f1;">
                    <th style="padding: 5px; font-size: 12px;">Dom</th>
                    <th style="padding: 5px; font-size: 12px;">Seg</th>
                    <th style="padding: 5px; font-size: 12px;">Ter</th>
                    <th style="padding: 5px; font-size: 12px;">Qua</th>
                    <th style="padding: 5px; font-size: 12px;">Qui</th>
                    <th style="padding: 5px; font-size: 12px;">Sex</th>
                    <th style="padding: 5px; font-size: 12px;">Sáb</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let day = 1;
    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                calendarHTML += '<td style="padding: 8px;"></td>';
            } else if (day > daysInMonth) {
                calendarHTML += '<td style="padding: 8px;"></td>';
            } else {
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasEvent = agenda.some(a => a.date === dateStr);
                const isToday = day === today.getDate();
                
                let style = 'padding: 8px; border-radius: 4px;';
                if (isToday) style += ' background: #3498db; color: white; font-weight: bold;';
                else if (hasEvent) style += ' background: #e74c3c; color: white;';
                
                calendarHTML += `<td style="${style}" title="${hasEvent ? 'Há compromissos neste dia' : ''}">${day}</td>`;
                day++;
            }
        }
        calendarHTML += '</tr>';
        if (day > daysInMonth) break;
    }
    
    calendarHTML += '</tbody></table>';
    
    const calendarDiv = document.getElementById('simpleCalendar');
    if (calendarDiv) {
        calendarDiv.innerHTML = calendarHTML;
    }
}

function loadPastorAgenda() {
    // Inicializar agenda com dados de exemplo se estiver vazia
    if (agenda.length === 0) {
        const today = new Date();
        agenda = [
            {
                id: 1,
                title: 'Culto Dominical',
                description: 'Pregação e louvor',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString().split('T')[0],
                time: '10:00',
                location: 'Templo Principal',
                priority: 'high'
            },
            {
                id: 2,
                title: 'Reunião de Líderes',
                description: 'Planejamento mensal',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
                time: '19:00',
                location: 'Sala de Reuniões',
                priority: 'medium'
            },
            {
                id: 3,
                title: 'Visita Hospitalar',
                description: 'Visitar irmão João',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0],
                time: '14:00',
                location: 'Hospital São Lucas',
                priority: 'high'
            },
            {
                id: 4,
                title: 'Estudo Bíblico',
                description: 'Estudo sobre Romanos',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString().split('T')[0],
                time: '20:00',
                location: 'Templo Principal',
                priority: 'medium'
            }
        ];
    }
    
    // Gerar calendário
    generateSimpleCalendar();
    
    const agendaList = document.getElementById('agendaList');
    agendaList.innerHTML = '<h3>Próximos Compromissos</h3>';
    
    const sortedAgenda = [...agenda].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedAgenda.slice(0, 5).forEach(item => {
        const agendaItem = document.createElement('div');
        agendaItem.className = 'agenda-item';
        const priorityClass = item.priority || 'medium';
        agendaItem.innerHTML = `
            <div style="font-weight: bold;">${item.title}</div>
            <div style="font-size: 12px; color: #7f8c8d;">${formatDate(item.date)} às ${item.time}</div>
            <div style="margin-top: 5px;">${item.description}</div>
            <div style="margin-top: 5px;"><span class="priority-badge ${priorityClass}">${getPriorityText(priorityClass)}</span></div>
        `;
        agendaList.appendChild(agendaItem);
    });
    
    // Load agenda table
    const tbody = document.querySelector('#agendaTable tbody');
    tbody.innerHTML = '';
    
    sortedAgenda.forEach(item => {
        const row = document.createElement('tr');
        const priorityClass = item.priority || 'medium';
        row.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>${item.time}</td>
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>${item.location || 'Não informado'}</td>
            <td><span class="priority-badge ${priorityClass}">${getPriorityText(priorityClass)}</span></td>
            <td>
                <button class="btn btn-secondary" onclick="editAgenda(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteAgenda(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadTreasury() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    document.getElementById('monthlyIncome').textContent = `R$ ${income.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('monthlyExpense').textContent = `R$ ${expense.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('currentBalance').textContent = `R$ ${balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    
    const tbody = document.querySelector('#transactionsTable tbody');
    tbody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const typeClass = transaction.type === 'income' ? 'transaction-income' : 'transaction-expense';
        const typeText = transaction.type === 'income' ? 'Receita' : 'Despesa';
        const amountText = transaction.type === 'income' ? '+' : '-';
        
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td><span class="${typeClass}">${typeText}</span></td>
            <td>${transaction.category}</td>
            <td class="${typeClass}">${amountText} R$ ${transaction.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
            <td>
                <button class="btn btn-secondary" onclick="editTransaction(${transaction.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadPrayerRequests() {
    const grid = document.getElementById('prayerRequestsGrid');
    grid.innerHTML = '';
    
    // Verificar se usuário pode gerenciar pedidos de oração
    const canManagePrayer = window.authSystem && window.authSystem.hasPermission('prayer.edit');
    
    prayerRequests.forEach(request => {
        const card = document.createElement('div');
        card.className = `prayer-card ${request.status === 'answered' ? 'answered' : ''}`;
        card.innerHTML = `
            <div class="prayer-meta">
                <span>${request.requester}</span>
                <span>${formatDate(request.date)}</span>
            </div>
            <div class="prayer-text">${request.request}</div>
            ${canManagePrayer ? `
                <div>
                    <button class="btn btn-success" onclick="markAnswered(${request.id})">
                        <i class="fas fa-check"></i> Marcar como Respondido
                    </button>
                    <button class="btn btn-secondary" onclick="editPrayerRequest(${request.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            ` : ''}
        `;
        grid.appendChild(card);
    });
}

function loadBaptisms() {
    const totalBaptisms = baptisms.length;
    const thisYearBaptisms = baptisms.filter(b => {
        const date = b.baptismDate || b.date;
        return date && new Date(date).getFullYear() === new Date().getFullYear();
    }).length;
    const pendingBaptisms = baptisms.filter(b => b.status === 'scheduled' || b.status === 'pending').length;
    
    document.getElementById('totalBaptisms').textContent = totalBaptisms;
    document.getElementById('thisYearBaptisms').textContent = thisYearBaptisms;
    document.getElementById('pendingBaptisms').textContent = pendingBaptisms;
    
    // Mostrar/ocultar botões baseado nas permissões
    const canManageBaptisms = window.authSystem && window.authSystem.hasPermission('baptisms.edit');
    const requestBtn = document.getElementById('requestBaptismBtn');
    const scheduleBtn = document.getElementById('scheduleBaptismBtn');
    
    if (requestBtn && scheduleBtn) {
        if (canManageBaptisms) {
            // Admin vê apenas o botão de agendar
            requestBtn.style.display = 'none';
            scheduleBtn.style.display = 'inline-flex';
        } else {
            // Membro vê apenas o botão de solicitar
            requestBtn.style.display = 'inline-flex';
            scheduleBtn.style.display = 'none';
        }
    }
    
    const tbody = document.querySelector('#baptismsTable tbody');
    tbody.innerHTML = '';
    
    baptisms.forEach(baptism => {
        const row = document.createElement('tr');
        const baptismDate = baptism.baptismDate || baptism.date;
        
        let statusText = 'Agendado';
        let statusClass = 'scheduled';
        if (baptism.status === 'completed') {
            statusText = 'Realizado';
            statusClass = 'completed';
        } else if (baptism.status === 'pending') {
            statusText = 'Pendente';
            statusClass = 'pending';
        }
        
        // Verificar se o usuário tem permissão para gerenciar batismos
        const canManageBaptisms = window.authSystem && window.authSystem.hasPermission('baptisms.edit');
        
        row.innerHTML = `
            <td>${baptism.name}</td>
            <td>${baptismDate ? formatDate(baptismDate) : 'A definir'}</td>
            <td>${baptism.pastor || 'A definir'}</td>
            <td>${baptism.location || 'A definir'}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                ${canManageBaptisms && baptism.status === 'pending' ? `
                    <button class="btn btn-primary" onclick="scheduleBaptism(${baptism.id})">
                        <i class="fas fa-calendar"></i> Agendar
                    </button>
                ` : ''}
                ${canManageBaptisms && baptism.status === 'scheduled' ? `
                    <button class="btn btn-success" onclick="completeBaptism(${baptism.id})">
                        <i class="fas fa-check"></i> Concluir
                    </button>
                ` : ''}
                ${canManageBaptisms ? `
                    <button class="btn btn-secondary" onclick="editBaptism(${baptism.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                ` : ''}
                ${!canManageBaptisms ? `
                    <span class="text-muted">Aguardando aprovação</span>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadDonations() {
    // Verificar se usuário pode ver histórico de doações
    const canViewDonations = window.authSystem && window.authSystem.hasPermission('donations.view');
    
    const tithes = donations.filter(d => d.type === 'tithe').reduce((sum, d) => sum + d.amount, 0);
    const offerings = donations.filter(d => d.type === 'offering').reduce((sum, d) => sum + d.amount, 0);
    const special = donations.filter(d => d.type === 'special').reduce((sum, d) => sum + d.amount, 0);
    
    // Mostrar/ocultar resumo e tabela baseado nas permissões
    const summaryDiv = document.getElementById('donationsSummary');
    const tableContainer = document.getElementById('donationsTableContainer');
    
    if (canViewDonations) {
        // Admin vê tudo
        if (summaryDiv) summaryDiv.style.display = 'grid';
        if (tableContainer) tableContainer.style.display = 'block';
        
        document.getElementById('tithesTotal').textContent = `R$ ${tithes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        document.getElementById('offeringsTotal').textContent = `R$ ${offerings.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        document.getElementById('specialDonationsTotal').textContent = `R$ ${special.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        
        const tbody = document.querySelector('#donationsTable tbody');
        tbody.innerHTML = '';
        
        donations.forEach(donation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(donation.date)}</td>
                <td>${donation.donor}</td>
                <td>${donation.type === 'tithe' ? 'Dízimo' : donation.type === 'offering' ? 'Oferta' : 'Especial'}</td>
                <td>R$ ${donation.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td>${donation.method}</td>
                <td>${donation.notes || ''}</td>
                <td>
                    <button class="btn btn-secondary" onclick="editDonation(${donation.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        // Membro vê apenas mensagem para doar
        if (summaryDiv) summaryDiv.style.display = 'none';
        if (tableContainer) {
            tableContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #ecf0f1; border-radius: 8px;">
                    <i class="fas fa-heart" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                    <h3>Faça sua Doação</h3>
                    <p style="color: #7f8c8d; margin: 20px 0;">
                        Clique no botão "Registrar Doação" acima para fazer sua contribuição.
                    </p>
                    <p style="color: #95a5a6; font-size: 14px;">
                        "Cada um contribua segundo propôs no seu coração, não com tristeza ou por necessidade; porque Deus ama ao que dá com alegria." - 2 Coríntios 9:7
                    </p>
                </div>
            `;
        }
    }
}

// Utility functions
function getPriorityText(priority) {
    const priorities = {
        'low': 'Baixa',
        'medium': 'Média',
        'high': 'Alta',
        'urgent': 'Urgente'
    };
    return priorities[priority] || 'Média';
}

// Modal functions
function openMemberModal(memberId = null) {
    currentEditId = memberId;
    const modal = document.getElementById('memberModal');
    const form = document.getElementById('memberForm');
    
    if (!modal || !form) {
        console.error('Modal ou formulário de membro não encontrado');
        return;
    }
    
    if (memberId) {
        // Buscar membro no sampleData ou authSystem
        let member = null;
        
        if (typeof memberId === 'string' && memberId.startsWith('auth_')) {
            // Buscar no authSystem
            const userId = parseInt(memberId.replace('auth_', ''));
            if (window.authSystem && window.authSystem.users) {
                member = window.authSystem.users.find(u => u.id === userId);
            }
        } else {
            // Buscar no sampleData
            member = sampleData.members?.find(m => m.id === memberId);
        }
        
        if (member) {
            const nameField = document.getElementById('memberName');
            const emailField = document.getElementById('memberEmail');
            const phoneField = document.getElementById('memberPhone');
            const addressField = document.getElementById('memberAddress');
            const birthdateField = document.getElementById('memberBirthdate');
            
            if (nameField) nameField.value = member.name || '';
            if (emailField) emailField.value = member.email || '';
            if (phoneField) phoneField.value = member.phone || '';
            if (addressField) addressField.value = member.address || '';
            if (birthdateField) birthdateField.value = member.birthdate || member.birthDate || '';
        }
    } else {
        form.reset();
    }
    
    // Populate cell options
    const cellSelect = document.getElementById('memberCell');
    if (cellSelect && sampleData.cells) {
        cellSelect.innerHTML = '<option value="">Selecione uma célula</option>';
        sampleData.cells.forEach(cell => {
            cellSelect.innerHTML += `<option value="${cell.name}">${cell.name}</option>`;
        });
    }
    
    modal.style.display = 'block';
}

function closeMemberModal() {
    document.getElementById('memberModal').style.display = 'none';
    document.getElementById('memberForm').reset();
}

function openVisitorModal() {
    // Usar o mesmo modal de membro para visitantes
    openMemberModal();
}

function openMinistryModal(id = null) {
    const modal = document.getElementById('ministryModal');
    const title = document.getElementById('ministryModalTitle');
    const form = document.getElementById('ministryForm');
    
    if (id) {
        const ministry = ministries.find(m => m.id === id);
        if (ministry) {
            title.textContent = 'Editar Ministério';
            document.getElementById('ministryId').value = ministry.id;
            document.getElementById('ministryName').value = ministry.name;
            document.getElementById('ministryDescription').value = ministry.description;
            document.getElementById('ministryLeader').value = ministry.leader;
        }
    } else {
        title.textContent = 'Adicionar Ministério';
        form.reset();
        document.getElementById('ministryId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeMinistryModal() {
    document.getElementById('ministryModal').style.display = 'none';
    document.getElementById('ministryForm').reset();
}

function openLeaderModal(id = null) {
    const modal = document.getElementById('leaderModal');
    const title = document.getElementById('leaderModalTitle');
    const form = document.getElementById('leaderForm');
    
    if (id) {
        const leader = leaders.find(l => l.id === id);
        if (leader) {
            title.textContent = 'Editar Líder';
            document.getElementById('leaderId').value = leader.id;
            document.getElementById('leaderName').value = leader.name;
            document.getElementById('leaderPosition').value = leader.position;
            document.getElementById('leaderMinistry').value = leader.ministry;
            document.getElementById('leaderPhone').value = leader.phone;
        }
    } else {
        title.textContent = 'Adicionar Líder';
        form.reset();
        document.getElementById('leaderId').value = '';
    }
    
    // Populate ministry options
    const ministrySelect = document.getElementById('leaderMinistry');
    ministrySelect.innerHTML = '<option value="">Selecione um ministério</option>';
    ministries.forEach(ministry => {
        ministrySelect.innerHTML += `<option value="${ministry.name}">${ministry.name}</option>`;
    });
    
    modal.style.display = 'block';
}

function closeLeaderModal() {
    document.getElementById('leaderModal').style.display = 'none';
    document.getElementById('leaderForm').reset();
}

function openCellModal(id = null) {
    const modal = document.getElementById('cellModal');
    const title = document.getElementById('cellModalTitle');
    const form = document.getElementById('cellForm');
    
    if (id) {
        const cell = cells.find(c => c.id === id);
        if (cell) {
            title.textContent = 'Editar Célula';
            document.getElementById('cellId').value = cell.id;
            document.getElementById('cellName').value = cell.name;
            document.getElementById('cellLeader').value = cell.leader;
            document.getElementById('cellAddress').value = cell.address;
            document.getElementById('cellDayOfWeek').value = cell.dayOfWeek || '';
            document.getElementById('cellTime').value = cell.time || '';
        }
    } else {
        title.textContent = 'Adicionar Célula';
        form.reset();
        document.getElementById('cellId').value = '';
    }
    
    // Populate leader options
    const leaderSelect = document.getElementById('cellLeader');
    leaderSelect.innerHTML = '<option value="">Selecione um líder</option>';
    leaders.forEach(leader => {
        leaderSelect.innerHTML += `<option value="${leader.name}">${leader.name}</option>`;
    });
    
    modal.style.display = 'block';
}

function closeCellModal() {
    document.getElementById('cellModal').style.display = 'none';
    document.getElementById('cellForm').reset();
}

function openEventModal(id = null) {
    const modal = document.getElementById('eventModal');
    const title = document.getElementById('eventModalTitle');
    const form = document.getElementById('eventForm');
    
    if (id) {
        const event = events.find(e => e.id === id);
        if (event) {
            title.textContent = 'Editar Evento';
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDescription').value = event.description;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventTime').value = event.time;
            document.getElementById('eventLocation').value = event.location;
        }
    } else {
        title.textContent = 'Adicionar Evento';
        form.reset();
        document.getElementById('eventId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
    document.getElementById('eventForm').reset();
}

function openPrayerModal(id = null) {
    const modal = document.getElementById('prayerModal');
    const title = document.getElementById('prayerModalTitle');
    const form = document.getElementById('prayerForm');
    
    if (id) {
        const prayer = prayerRequests.find(p => p.id === id);
        if (prayer) {
            title.textContent = 'Editar Pedido de Oração';
            document.getElementById('prayerId').value = prayer.id;
            document.getElementById('prayerRequester').value = prayer.requester;
            document.getElementById('prayerRequest').value = prayer.request;
            document.getElementById('prayerDate').value = prayer.date;
        }
    } else {
        title.textContent = 'Adicionar Pedido de Oração';
        form.reset();
        document.getElementById('prayerId').value = '';
        document.getElementById('prayerDate').value = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'block';
}

function closePrayerModal() {
    document.getElementById('prayerModal').style.display = 'none';
    document.getElementById('prayerForm').reset();
}

function openBaptismModal(id = null) {
    const modal = document.getElementById('baptismModal');
    const title = document.getElementById('baptismModalTitle');
    const form = document.getElementById('baptismForm');
    
    if (id) {
        const baptism = baptisms.find(b => b.id === id);
        if (baptism) {
            title.textContent = 'Editar Batismo';
            document.getElementById('baptismId').value = baptism.id;
            document.getElementById('baptismName').value = baptism.name;
            document.getElementById('baptismDate').value = baptism.date;
            document.getElementById('baptismPastor').value = baptism.pastor;
            document.getElementById('baptismLocation').value = baptism.location;
        }
    } else {
        title.textContent = 'Agendar Batismo';
        form.reset();
        document.getElementById('baptismId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeBaptismModal() {
    document.getElementById('baptismModal').style.display = 'none';
    document.getElementById('baptismForm').reset();
}

function openDonationModal(id = null) {
    const modal = document.getElementById('donationModal');
    const title = document.getElementById('donationModalTitle');
    const form = document.getElementById('donationForm');
    
    if (id) {
        const donation = donations.find(d => d.id === id);
        if (donation) {
            title.textContent = 'Editar Doação';
            document.getElementById('donationId').value = donation.id;
            document.getElementById('donationDonor').value = donation.donor;
            document.getElementById('donationType').value = donation.type;
            document.getElementById('donationAmount').value = donation.amount;
            document.getElementById('donationMethod').value = donation.method;
            document.getElementById('donationDate').value = donation.date;
            document.getElementById('donationNotes').value = donation.notes || '';
        }
    } else {
        title.textContent = 'Registrar Doação';
        form.reset();
        document.getElementById('donationId').value = '';
        document.getElementById('donationDate').value = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'block';
}

function closeDonationModal() {
    document.getElementById('donationModal').style.display = 'none';
    document.getElementById('donationForm').reset();
}

function openAgendaModal(id = null) {
    const modal = document.getElementById('agendaModal');
    const form = document.getElementById('agendaForm');
    
    if (id) {
        const agendaItem = agenda.find(a => a.id === id);
        if (agendaItem) {
            document.getElementById('agendaTitle').value = agendaItem.title;
            document.getElementById('agendaDescription').value = agendaItem.description;
            document.getElementById('agendaDate').value = agendaItem.date;
            document.getElementById('agendaTime').value = agendaItem.time;
            document.getElementById('agendaLocation').value = agendaItem.location || '';
            document.getElementById('agendaPriority').value = agendaItem.priority || 'medium';
        }
        currentEditId = id;
    } else {
        form.reset();
        currentEditId = null;
    }
    
    modal.style.display = 'block';
}

function closeAgendaModal() {
    document.getElementById('agendaModal').style.display = 'none';
}

function openTransactionModal(type, id = null) {
    const modal = document.getElementById('transactionModal');
    const form = document.getElementById('transactionForm');
    const typeSelect = document.getElementById('transactionType');
    
    if (id) {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            document.getElementById('transactionDescription').value = transaction.description;
            document.getElementById('transactionAmount').value = transaction.amount;
            document.getElementById('transactionDate').value = transaction.date;
            document.getElementById('transactionType').value = transaction.type;
            document.getElementById('transactionPaymentMethod').value = transaction.paymentMethod || '';
            document.getElementById('transactionNotes').value = transaction.notes || '';
            handleTransactionTypeChange(); // Update categories
            document.getElementById('transactionCategory').value = transaction.category;
        }
        currentEditId = id;
    } else {
        form.reset();
        typeSelect.value = type;
        handleTransactionTypeChange();
        currentEditId = null;
    }
    
    modal.style.display = 'block';
}

function closeTransactionModal() {
    document.getElementById('transactionModal').style.display = 'none';
}

function handleTransactionTypeChange() {
    const type = document.getElementById('transactionType').value;
    const categorySelect = document.getElementById('transactionCategory');
    
    const incomeCategories = ['Dízimos', 'Ofertas', 'Doações', 'Eventos', 'Outros'];
    const expenseCategories = ['Manutenção', 'Utilidades', 'Materiais', 'Eventos', 'Salários', 'Pagamentos', 'Outros'];
    
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

// Edit functions
function editMember(id) {
    openMemberModal(id);
}

function editMinistry(id) {
    openMinistryModal(id);
}

function editLeader(id) {
    openLeaderModal(id);
}

function editCell(id) {
    openCellModal(id);
}

function editEvent(id) {
    openEventModal(id);
}

function editPrayerRequest(id) {
    openPrayerModal(id);
}

function editBaptism(id) {
    openBaptismModal(id);
}

function editDonation(id) {
    openDonationModal(id);
}

// Delete functions
function deleteCell(id) {
    if (confirm('Deseja realmente excluir esta célula?')) {
        cells = cells.filter(c => c.id !== id);
        loadCells();
        showAlert('Célula excluída com sucesso!', 'success');
    }
}

function deleteEvent(id) {
    if (confirm('Deseja realmente excluir este evento?')) {
        events = events.filter(e => e.id !== id);
        loadEvents();
        showAlert('Evento excluído com sucesso!', 'success');
    }
}

// Other functions
function markAnswered(id) { 
    const request = prayerRequests.find(r => r.id === id);
    if (request) {
        request.status = 'answered';
        loadPrayerRequests();
        showAlert('Pedido marcado como respondido!', 'success');
    }
}

function scheduleBaptism(id) {
    const baptism = baptisms.find(b => b.id === id);
    if (baptism) {
        // Abrir modal de batismo para agendar
        openBaptismModal(id);
    }
}

function completeBaptism(id) {
    const baptism = baptisms.find(b => b.id === id);
    if (baptism) {
        baptism.status = 'completed';
        loadBaptisms();
        if (window.authSystem) {
            window.authSystem.showMessage('Batismo marcado como concluído!', 'success');
        } else {
            alert('Batismo marcado como concluído!');
        }
    }
}

// Placeholder functions for future features (removidas duplicações)
function openIncomeModal() { alert('Modal de receita em desenvolvimento'); }
function openExpenseModal() { alert('Modal de despesa em desenvolvimento'); }
function editTransaction(id) { alert('Função de edição em desenvolvimento'); }
function deleteTransaction(id) { alert('Função de exclusão em desenvolvimento'); }

// Load sample data
function loadSampleData() {
    // Check if generateSampleData function is available
    if (typeof generateSampleData === 'function') {
        sampleData = generateSampleData();
        
        // Load all the generated data
        members = sampleData.members || [];
        ministries = sampleData.ministries || [];
        cells = sampleData.cells || [];
        leaders = sampleData.leaders || [];
        events = sampleData.events || [];
        prayerRequests = sampleData.prayerRequests || [];
        baptisms = sampleData.baptisms || [];
        donations = sampleData.donations || [];
        transactions = sampleData.transactions || [];
        agenda = sampleData.agenda || [];
        
        console.log(`Dados carregados: ${members.length} membros, ${ministries.length} ministérios, ${cells.length} células`);
    } else {
        // Fallback to basic sample data if generateSampleData is not available
        console.warn('Função generateSampleData não encontrada, carregando dados básicos');
        
        // Basic sample data as fallback
        members = [
            {
                id: 1,
                name: 'João Silva',
                email: 'joao@email.com',
                phone: '(11) 99999-9999',
                birthdate: '1985-05-15',
                address: 'Rua das Flores, 123',
                cell: 'Célula Central',
                status: 'active',
                joinedAt: '2020-01-15T00:00:00Z'
            }
        ];

        ministries = [
            {
                id: 1,
                name: 'Louvor e Adoração',
                description: 'Ministério responsável pela música e adoração nos cultos',
                leader: 'Carlos Mendes'
            }
        ];

        cells = [
            { id: 1, name: 'Célula Central', leader: 'João Silva', address: 'Rua A, 100', dayOfWeek: 'Quarta-feira', time: '19:30' }
        ];

        leaders = [
            { id: 1, name: 'Pastor João', position: 'Pastor Principal', ministry: 'Geral', phone: '(11) 99999-0001' }
        ];

        events = [
            { id: 1, title: 'Culto de Domingo', description: 'Culto dominical de adoração', date: '2024-08-25', time: '19:00', location: 'Templo Principal' }
        ];

        agenda = [
            { id: 1, title: 'Visita Hospitalar', description: 'Visitar irmão José no hospital', date: '2024-08-24', time: '14:00' }
        ];

        transactions = [
            { id: 1, date: '2024-08-01', description: 'Dízimos e Ofertas', type: 'income', category: 'Doações', amount: 5000 }
        ];

        prayerRequests = [
            { id: 1, requester: 'Maria Silva', request: 'Oração pela saúde da minha mãe', date: '2024-08-20', status: 'pending' }
        ];

        baptisms = [
            { id: 1, name: 'Carlos Oliveira', date: '2024-08-25', pastor: 'Pastor João', location: 'Rio Jordão', status: 'scheduled' }
        ];

        donations = [
            { id: 1, date: '2024-08-01', donor: 'João Silva', type: 'tithe', amount: 500, method: 'Dinheiro', notes: '' }
        ];
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = [
        { modal: document.getElementById('memberModal'), closeFunc: closeMemberModal },
        { modal: document.getElementById('ministryModal'), closeFunc: closeMinistryModal },
        { modal: document.getElementById('leaderModal'), closeFunc: closeLeaderModal },
        { modal: document.getElementById('cellModal'), closeFunc: closeCellModal },
        { modal: document.getElementById('eventModal'), closeFunc: closeEventModal },
        { modal: document.getElementById('prayerModal'), closeFunc: closePrayerModal },
        { modal: document.getElementById('baptismModal'), closeFunc: closeBaptismModal },
        { modal: document.getElementById('donationModal'), closeFunc: closeDonationModal }
    ];
    
    modals.forEach(({ modal, closeFunc }) => {
        if (event.target === modal) {
            closeFunc();
        }
    });
}

// Global variables to store chart instances
let membersChart = null;
let offeringsChart = null;

// Function to update/create charts
function updateCharts() {
    console.log('updateCharts() chamada - iniciando criação dos gráficos...');
    
    // Destroy existing charts if they exist
    if (membersChart) {
        membersChart.destroy();
        console.log('Gráfico de membros anterior destruído');
    }
    if (offeringsChart) {
        offeringsChart.destroy();
        console.log('Gráfico de ofertas anterior destruído');
    }
    
    // Create new charts
    initializeCharts();
    console.log('Gráficos inicializados');
}

// Modified initializeCharts function to store chart instances
function initializeCharts() {
    console.log('initializeCharts() chamada');
    
    // Members growth chart
    const membersCtx = document.getElementById('membersChart');
    console.log('Elemento membersChart encontrado:', membersCtx);
    if (membersCtx) {
        console.log('Criando gráfico de membros...');
        membersChart = new Chart(membersCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Membros',
                    data: [120, 125, 130, 128, 135, 142],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Offerings chart
    const offeringsCtx = document.getElementById('offeringsChart');
    console.log('Elemento offeringsChart encontrado:', offeringsCtx);
    if (offeringsCtx) {
        console.log('Criando gráfico de ofertas...');
        offeringsChart = new Chart(offeringsCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Ofertas (R$)',
                    data: [8500, 9200, 11000, 10500, 12000, 12450],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Bible Module Functions
function loadBible() {
    console.log('Loading Bible module...');
    
    // Initialize Bible Reader if not already initialized
    if (!window.bibleReader) {
        initBible();
    }
}

// Devotional Module Functions
function loadDevotional() {
    console.log('Loading Devotional module...');
    
    // Initialize Devotional Manager if not already initialized
    if (!window.devotionalManager) {
        initDevotional();
    }
}

// Member Management Functions
function deleteMember(id) {
    if (!confirm('Tem certeza que deseja excluir este membro?')) {
        return;
    }
    
    // Verificar se é um ID do sistema de autenticação
    if (typeof id === 'string' && id.startsWith('auth_')) {
        const userId = parseInt(id.replace('auth_', ''));
        if (window.authSystem) {
            const result = window.authSystem.deleteUser(userId);
            if (result.success) {
                window.authSystem.showMessage('Membro excluído com sucesso', 'success');
                loadActiveMembers();
                updateDashboard();
            } else {
                window.authSystem.showMessage(result.message, 'error');
            }
        }
        return;
    }
    
    // Excluir do sample data
    const index = sampleData.members.findIndex(m => m.id === id);
    if (index !== -1) {
        sampleData.members.splice(index, 1);
        loadActiveMembers();
        updateDashboard();
        alert('Membro excluído com sucesso!');
    }
}

function reactivateMember(id) {
    if (!confirm('Tem certeza que deseja reativar este membro?')) {
        return;
    }
    
    const member = sampleData.members.find(m => m.id === id);
    if (member) {
        member.status = 'active';
        delete member.inactiveDate;
        delete member.inactiveReason;
        loadInactiveMembers();
        loadActiveMembers();
        updateDashboard();
        alert('Membro reativado com sucesso!');
    }
}

// Visitor Management Functions
function editVisitor(id) {
    console.log('Editando visitante:', id);
    alert('Função de edição em desenvolvimento. ID: ' + id);
}

function deleteVisitor(id) {
    if (!confirm('Tem certeza que deseja excluir este visitante?')) {
        return;
    }
    
    // Verificar se é um ID do sistema de autenticação
    if (typeof id === 'string' && id.startsWith('auth_')) {
        const userId = parseInt(id.replace('auth_', ''));
        if (window.authSystem) {
            const result = window.authSystem.deleteUser(userId);
            if (result.success) {
                window.authSystem.showMessage('Visitante excluído com sucesso', 'success');
                loadVisitors();
            } else {
                window.authSystem.showMessage(result.message, 'error');
            }
        }
        return;
    }
    
    // Excluir do sample data
    const index = sampleData.visitors.findIndex(v => v.id === id);
    if (index !== -1) {
        sampleData.visitors.splice(index, 1);
        loadVisitors();
        alert('Visitante excluído com sucesso!');
    }
}

function convertToMember(id) {
    if (!confirm('Deseja converter este visitante em membro?')) {
        return;
    }
    
    // Verificar se é um ID do sistema de autenticação
    if (typeof id === 'string' && id.startsWith('auth_')) {
        const userId = parseInt(id.replace('auth_', ''));
        if (window.authSystem) {
            const result = window.authSystem.updateUser(userId, { 
                role: 'member',
                active: true,
                approved: true
            });
            if (result.success) {
                window.authSystem.showMessage('Visitante convertido em membro com sucesso!', 'success');
                loadVisitors();
                loadActiveMembers();
            } else {
                window.authSystem.showMessage(result.message, 'error');
            }
        }
        return;
    }
    
    // Converter do sample data
    const visitorIndex = sampleData.visitors.findIndex(v => v.id === id);
    if (visitorIndex !== -1) {
        const visitor = sampleData.visitors[visitorIndex];
        const newMember = {
            id: Date.now(),
            name: visitor.name,
            email: visitor.email,
            phone: visitor.phone,
            birthDate: visitor.birthdate || '',
            address: '',
            cell: null,
            status: 'active',
            joinedAt: new Date().toISOString()
        };
        
        sampleData.members.push(newMember);
        sampleData.visitors.splice(visitorIndex, 1);
        
        loadVisitors();
        loadActiveMembers();
        updateDashboard();
        alert('Visitante convertido em membro com sucesso!');
    }
}

// Profile Management Functions
function openProfileModal() {
    if (!window.authSystem || !window.authSystem.currentUser) {
        alert('Você precisa estar logado para editar o perfil!');
        return;
    }
    
    const user = window.authSystem.currentUser;
    const modal = document.getElementById('profileModal');
    
    // Preencher formulário com dados atuais
    document.getElementById('profileName').value = user.name || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profilePhone').value = user.phone || '';
    document.getElementById('profileBirthdate').value = user.birthdate || '';
    
    // Limpar campos de senha
    document.getElementById('profileCurrentPassword').value = '';
    document.getElementById('profileNewPassword').value = '';
    document.getElementById('profileConfirmPassword').value = '';
    
    modal.style.display = 'block';
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
    document.getElementById('profileForm').reset();
}

function handleProfileSubmit(e) {
    e.preventDefault();
    
    if (!window.authSystem || !window.authSystem.currentUser) {
        alert('Você precisa estar logado!');
        return;
    }
    
    const currentUser = window.authSystem.currentUser;
    const updateData = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        birthdate: document.getElementById('profileBirthdate').value
    };
    
    // Verificar se está alterando senha
    const currentPassword = document.getElementById('profileCurrentPassword').value;
    const newPassword = document.getElementById('profileNewPassword').value;
    const confirmPassword = document.getElementById('profileConfirmPassword').value;
    
    if (newPassword || confirmPassword) {
        // Validar senha atual
        if (!currentPassword) {
            window.authSystem.showMessage('Digite sua senha atual para alterar a senha', 'error');
            return;
        }
        
        if (currentPassword.toLowerCase() !== currentUser.password.toLowerCase()) {
            window.authSystem.showMessage('Senha atual incorreta', 'error');
            return;
        }
        
        // Validar nova senha
        if (newPassword !== confirmPassword) {
            window.authSystem.showMessage('As senhas não coincidem', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            window.authSystem.showMessage('A nova senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }
        
        updateData.password = newPassword;
    }
    
    // Atualizar usuário diretamente (bypass de permissões para edição própria)
    const userIndex = window.authSystem.users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        // Atualizar dados do usuário
        window.authSystem.users[userIndex] = {
            ...window.authSystem.users[userIndex],
            ...updateData
        };
        
        // Salvar no localStorage
        window.authSystem.saveUsers();
        
        // Atualizar currentUser
        window.authSystem.currentUser = {
            ...window.authSystem.currentUser,
            ...updateData
        };
        
        // Atualizar interface
        updateUserInfo();
        
        // Log da atividade
        window.authSystem.logActivity('profile_updated', `${currentUser.name} atualizou seu perfil`);
        
        window.authSystem.showMessage('Perfil atualizado com sucesso!', 'success');
        closeProfileModal();
        
        // Recarregar listas se necessário
        if (currentUser.role === 'member') {
            loadActiveMembers();
        } else if (currentUser.role === 'visitor') {
            loadVisitors();
        }
    } else {
        window.authSystem.showMessage('Erro ao atualizar perfil', 'error');
    }
}

// Agenda Management Functions
function editAgenda(id) {
    openAgendaModal(id);
}

function deleteAgenda(id) {
    if (!confirm('Deseja realmente excluir este compromisso?')) {
        return;
    }
    
    const index = agenda.findIndex(a => a.id === id);
    if (index !== -1) {
        agenda.splice(index, 1);
        loadPastorAgenda();
        if (window.authSystem) {
            window.authSystem.showMessage('Compromisso excluído com sucesso!', 'success');
        } else {
            alert('Compromisso excluído com sucesso!');
        }
    }
}

// Cell Participation Request Functions
function requestCellParticipation() {
    if (!window.authSystem || !window.authSystem.currentUser) {
        alert('Você precisa estar logado para solicitar participação em célula!');
        return;
    }
    
    // Mostrar modal ou lista de células disponíveis
    const cellsList = cells.map((cell, index) => 
        `${index + 1}. ${cell.name} - ${cell.leader} (${cell.dayOfWeek || 'Dia não definido'} às ${cell.time || 'Horário não definido'})`
    ).join('\n');
    
    const cellNumber = prompt(`Escolha uma célula para participar:\n\n${cellsList}\n\nDigite o número da célula:`);
    
    if (cellNumber) {
        const cellIndex = parseInt(cellNumber) - 1;
        if (cellIndex >= 0 && cellIndex < cells.length) {
            requestJoinCell(cells[cellIndex].id);
        } else {
            alert('Número de célula inválido!');
        }
    }
}

function requestJoinCell(cellId) {
    if (!window.authSystem || !window.authSystem.currentUser) {
        alert('Você precisa estar logado para solicitar participação!');
        return;
    }
    
    const currentUser = window.authSystem.currentUser;
    const cell = cells.find(c => c.id === cellId);
    
    if (!cell) {
        alert('Célula não encontrada!');
        return;
    }
    
    // Verificar se já está em uma célula
    if (currentUser.cell) {
        if (!confirm(`Você já participa da célula "${currentUser.cell}". Deseja solicitar mudança para "${cell.name}"?`)) {
            return;
        }
    } else {
        if (!confirm(`Deseja solicitar participação na célula "${cell.name}"?`)) {
            return;
        }
    }
    
    // Criar solicitação (em um sistema real, isso seria salvo no banco)
    const request = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        cellId: cell.id,
        cellName: cell.name,
        requestDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Salvar solicitação (simulado)
    if (!window.cellRequests) {
        window.cellRequests = [];
    }
    window.cellRequests.push(request);
    
    window.authSystem.showMessage(`Solicitação de participação na célula "${cell.name}" enviada com sucesso! O líder será notificado.`, 'success');
}

// Request My Baptism (for current user)
function requestMyBaptism() {
    if (!window.authSystem || !window.authSystem.currentUser) {
        alert('Você precisa estar logado para solicitar batismo!');
        return;
    }
    
    const currentUser = window.authSystem.currentUser;
    
    // Verificar se já existe uma solicitação pendente
    const existingRequest = baptisms.find(b => 
        b.email === currentUser.email && 
        (b.status === 'pending' || b.status === 'scheduled')
    );
    
    if (existingRequest) {
        alert('Você já possui uma solicitação de batismo em andamento!');
        return;
    }
    
    if (!confirm('Deseja solicitar seu batismo?')) {
        return;
    }
    
    // Criar solicitação de batismo
    const baptismRequest = {
        id: Date.now(),
        memberId: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        requestDate: new Date().toISOString(),
        baptismDate: null,
        pastor: 'A definir',
        location: 'A definir',
        status: 'pending'
    };
    
    baptisms.push(baptismRequest);
    
    window.authSystem.showMessage('Solicitação de batismo enviada com sucesso!', 'success');
    loadBaptisms();
}

// Baptism Request Function
function requestBaptism(id) {
    if (!confirm('Deseja solicitar batismo para este membro?')) {
        return;
    }
    
    let memberName = '';
    let memberEmail = '';
    
    // Buscar informações do membro
    if (typeof id === 'string' && id.startsWith('auth_')) {
        const userId = parseInt(id.replace('auth_', ''));
        if (window.authSystem && window.authSystem.users) {
            const user = window.authSystem.users.find(u => u.id === userId);
            if (user) {
                memberName = user.name;
                memberEmail = user.email;
            }
        }
    } else {
        const member = sampleData.members?.find(m => m.id === id);
        if (member) {
            memberName = member.name;
            memberEmail = member.email;
        }
    }
    
    if (!memberName) {
        alert('Membro não encontrado!');
        return;
    }
    
    // Criar solicitação de batismo
    const baptismRequest = {
        id: Date.now(),
        memberId: id,
        name: memberName,
        email: memberEmail,
        requestDate: new Date().toISOString(),
        baptismDate: null,
        pastor: 'A definir',
        location: 'A definir',
        status: 'pending'
    };
    
    // Adicionar à lista de batismos
    if (!baptisms) {
        baptisms = [];
    }
    baptisms.push(baptismRequest);
    
    // Mostrar mensagem de sucesso
    if (window.authSystem) {
        window.authSystem.showMessage('Solicitação de batismo enviada com sucesso!', 'success');
    } else {
        alert('Solicitação de batismo enviada com sucesso!');
    }
    
    // Atualizar a seção de batismos se estiver visível
    if (document.getElementById('baptisms').classList.contains('active')) {
        loadBaptisms();
    }
}
