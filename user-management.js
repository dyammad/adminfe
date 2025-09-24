// Sistema de Gerenciamento de Usuários
// Interface para administração de usuários e permissões

class UserManagement {
    constructor() {
        this.currentEditingUser = null;
        this.initializeUserManagement();
    }

    initializeUserManagement() {
        // Adicionar seção de usuários ao menu se o usuário tem permissão
        if (window.authSystem && window.authSystem.hasPermission('users.view')) {
            this.addUserManagementToMenu();
        }
    }

    // Adicionar gerenciamento de usuários ao menu
    addUserManagementToMenu() {
        const sidebar = document.querySelector('.sidebar-menu');
        if (sidebar) {
            const userManagementItem = document.createElement('li');
            userManagementItem.innerHTML = `
                <a href="#" data-section="user-management">
                    <i class="fas fa-users-cog"></i> Gerenciar Usuários
                </a>
            `;
            sidebar.appendChild(userManagementItem);

            // Adicionar event listener
            userManagementItem.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                this.showUserManagement();
            });
        }
    }

    // Mostrar interface de gerenciamento de usuários
    showUserManagement() {
        // Criar seção se não existir
        let userSection = document.getElementById('user-management');
        if (!userSection) {
            userSection = this.createUserManagementSection();
            document.querySelector('.content-area').appendChild(userSection);
        }

        // Navegar para a seção
        this.navigateToSection('user-management');
        this.loadUsers();
    }

    // Criar seção de gerenciamento de usuários
    createUserManagementSection() {
        const section = document.createElement('section');
        section.id = 'user-management';
        section.className = 'content-section';
        section.innerHTML = `
            <div class="section-header">
                <h2>Gerenciamento de Usuários</h2>
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="userManager.openUserModal()">
                        <i class="fas fa-plus"></i> Novo Usuário
                    </button>
                    <button class="btn btn-secondary" onclick="userManager.showActivityLogs()">
                        <i class="fas fa-history"></i> Logs de Atividade
                    </button>
                </div>
            </div>

            <div class="user-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-info">
                        <h3 id="totalUsers">0</h3>
                        <p>Total de Usuários</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-user-check"></i></div>
                    <div class="stat-info">
                        <h3 id="activeUsers">0</h3>
                        <p>Usuários Ativos</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-user-shield"></i></div>
                    <div class="stat-info">
                        <h3 id="adminUsers">0</h3>
                        <p>Administradores</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-clock"></i></div>
                    <div class="stat-info">
                        <h3 id="onlineUsers">0</h3>
                        <p>Online Agora</p>
                    </div>
                </div>
            </div>

            <div class="users-filters">
                <div class="filter-group">
                    <label>Filtrar por Role:</label>
                    <select id="roleFilter" onchange="userManager.filterUsers()">
                        <option value="">Todos os Roles</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Status:</label>
                    <select id="statusFilter" onchange="userManager.filterUsers()">
                        <option value="">Todos</option>
                        <option value="active">Ativos</option>
                        <option value="inactive">Inativos</option>
                    </select>
                </div>
                <div class="filter-group">
                    <input type="text" id="searchUsers" placeholder="Buscar usuários..." onkeyup="userManager.searchUsers()">
                </div>
            </div>

            <div id="pendingUsersSection" class="pending-users-section" style="display: none;">
                <h3><i class="fas fa-clock"></i> Cadastros Pendentes de Aprovação</h3>
                <div class="pending-users-container">
                    <div id="pendingUsersList"></div>
                </div>
            </div>

            <div class="table-container">
                <table id="usersTable" class="data-table">
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Último Login</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;

        // Criar modal de usuário
        this.createUserModal();
        this.createPermissionsModal();
        this.createActivityLogsModal();

        return section;
    }

    // Criar modal de usuário
    createUserModal() {
        const modal = document.createElement('div');
        modal.id = 'userModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h3 id="userModalTitle">Novo Usuário</h3>
                    <span class="close" onclick="userManager.closeUserModal()">&times;</span>
                </div>
                <form id="userForm">
                    <input type="hidden" id="userId">
                    <div class="form-tabs">
                        <button type="button" class="tab-btn active" onclick="userManager.switchTab('basic')">Dados Básicos</button>
                        <button type="button" class="tab-btn" onclick="userManager.switchTab('permissions')">Permissões</button>
                        <button type="button" class="tab-btn" onclick="userManager.switchTab('security')">Segurança</button>
                    </div>
                    
                    <div id="basicTab" class="tab-content active">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="userName">Nome Completo *</label>
                                <input type="text" id="userName" required>
                            </div>
                            <div class="form-group">
                                <label for="userEmail">Email *</label>
                                <input type="email" id="userEmail" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="userUsername">Nome de Usuário *</label>
                                <input type="text" id="userUsername" required>
                            </div>
                            <div class="form-group">
                                <label for="userRole">Role *</label>
                                <select id="userRole" required></select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="userActive">Status</label>
                                <select id="userActive">
                                    <option value="true">Ativo</option>
                                    <option value="false">Inativo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div id="permissionsTab" class="tab-content">
                        <div class="permissions-container">
                            <h4>Permissões Customizadas</h4>
                            <p>As permissões abaixo são adicionais ao role selecionado:</p>
                            <div id="customPermissions"></div>
                        </div>
                    </div>

                    <div id="securityTab" class="tab-content">
                        <div class="form-group">
                            <label for="userPassword">Senha *</label>
                            <input type="password" id="userPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="userPasswordConfirm">Confirmar Senha *</label>
                            <input type="password" id="userPasswordConfirm" required>
                        </div>
                        <div class="security-options">
                            <label>
                                <input type="checkbox" id="forcePasswordChange">
                                Forçar mudança de senha no próximo login
                            </label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="userManager.closeUserModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Adicionar event listener ao formulário
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUser();
        });
    }

    // Carregar usuários
    loadUsers() {
        const result = window.authSystem.getUsers();
        if (result.success) {
            this.displayUsers(result.users);
            this.updateUserStats(result.users);
            this.populateRoleFilter();
            this.loadPendingUsers();
        } else {
            window.authSystem.showMessage(result.message, 'error');
        }
    }

    // Carregar usuários pendentes de aprovação
    loadPendingUsers() {
        const result = window.authSystem.getPendingUsers();
        if (result.success && result.users.length > 0) {
            this.showPendingUsersSection(result.users);
        } else {
            this.hidePendingUsersSection();
        }
    }

    // Exibir usuários na tabela
    displayUsers(users) {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const role = window.authSystem.roles[user.role];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="user-info">
                        <div class="user-avatar" style="background-color: ${role?.color || '#95a5a6'}">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>${user.username}</span>
                    </div>
                </td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge" style="background-color: ${role?.color || '#95a5a6'}">
                        ${role?.name || user.role}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${user.active ? 'active' : 'inactive'}">
                        ${user.active ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : 'Nunca'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="userManager.editUser(${user.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="userManager.viewPermissions(${user.id})" title="Permissões">
                            <i class="fas fa-key"></i>
                        </button>
                        ${user.id !== window.authSystem.currentUser?.id ? `
                            <button class="btn-icon danger" onclick="userManager.deleteUser(${user.id})" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Atualizar estatísticas
    updateUserStats(users) {
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('activeUsers').textContent = users.filter(u => u.active).length;
        document.getElementById('adminUsers').textContent = users.filter(u => 
            ['super_admin', 'admin'].includes(u.role)
        ).length;
        document.getElementById('onlineUsers').textContent = window.authSystem.currentUser ? 1 : 0;
    }

    // Abrir modal de usuário
    openUserModal(userId = null) {
        this.currentEditingUser = userId;
        const modal = document.getElementById('userModal');
        const title = document.getElementById('userModalTitle');
        
        if (userId) {
            title.textContent = 'Editar Usuário';
            this.loadUserData(userId);
        } else {
            title.textContent = 'Novo Usuário';
            this.clearUserForm();
        }

        this.populateRoleSelect();
        this.populateCustomPermissions();
        modal.style.display = 'block';
    }

    // Fechar modal de usuário
    closeUserModal() {
        document.getElementById('userModal').style.display = 'none';
        this.currentEditingUser = null;
    }

    // Salvar usuário
    saveUser() {
        const userData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            username: document.getElementById('userUsername').value,
            role: document.getElementById('userRole').value,
            active: document.getElementById('userActive').value === 'true',
            password: document.getElementById('userPassword').value
        };

        // Validar senhas
        const password = document.getElementById('userPassword').value;
        const confirmPassword = document.getElementById('userPasswordConfirm').value;
        
        if (password !== confirmPassword) {
            window.authSystem.showMessage('As senhas não coincidem', 'error');
            return;
        }

        let result;
        if (this.currentEditingUser) {
            result = window.authSystem.updateUser(this.currentEditingUser, userData);
        } else {
            result = window.authSystem.createUser(userData);
        }

        if (result.success) {
            window.authSystem.showMessage(result.message, 'success');
            this.closeUserModal();
            this.loadUsers();
        } else {
            window.authSystem.showMessage(result.message, 'error');
        }
    }

    // Editar usuário
    editUser(userId) {
        this.openUserModal(userId);
    }

    // Excluir usuário
    deleteUser(userId) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            const result = window.authSystem.deleteUser(userId);
            if (result.success) {
                window.authSystem.showMessage(result.message, 'success');
                this.loadUsers();
            } else {
                window.authSystem.showMessage(result.message, 'error');
            }
        }
    }

    // Navegar para seção
    navigateToSection(sectionId) {
        // Ocultar todas as seções
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar seção selecionada
        document.getElementById(sectionId).classList.add('active');

        // Atualizar navegação
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Atualizar título da página
        document.getElementById('pageTitle').textContent = 'Gerenciamento de Usuários';
    }

    // Alternar abas no modal
    switchTab(tabName) {
        // Remover classe active de todas as abas
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Ativar aba selecionada
        event.target.classList.add('active');
        document.getElementById(tabName + 'Tab').classList.add('active');
    }

    // Popular select de roles
    populateRoleSelect() {
        const select = document.getElementById('userRole');
        select.innerHTML = '';

        Object.keys(window.authSystem.roles).forEach(roleKey => {
            const role = window.authSystem.roles[roleKey];
            const option = document.createElement('option');
            option.value = roleKey;
            option.textContent = role.name;
            select.appendChild(option);
        });
    }

    // Popular filtro de roles
    populateRoleFilter() {
        const select = document.getElementById('roleFilter');
        select.innerHTML = '<option value="">Todos os Roles</option>';

        Object.keys(window.authSystem.roles).forEach(roleKey => {
            const role = window.authSystem.roles[roleKey];
            const option = document.createElement('option');
            option.value = roleKey;
            option.textContent = role.name;
            select.appendChild(option);
        });
    }

    // Popular permissões customizadas
    populateCustomPermissions() {
        const container = document.getElementById('customPermissions');
        container.innerHTML = '';

        Object.keys(window.authSystem.permissions).forEach(permissionKey => {
            const permission = window.authSystem.permissions[permissionKey];
            const div = document.createElement('div');
            div.className = 'permission-item';
            div.innerHTML = `
                <label>
                    <input type="checkbox" name="customPermission" value="${permissionKey}">
                    <span class="permission-name">${permission.name}</span>
                    <small class="permission-module">${permission.module}</small>
                </label>
            `;
            container.appendChild(div);
        });
    }

    // Carregar dados do usuário para edição
    loadUserData(userId) {
        const result = window.authSystem.getUsers();
        if (result.success) {
            const user = result.users.find(u => u.id === userId);
            if (user) {
                document.getElementById('userId').value = user.id;
                document.getElementById('userName').value = user.name;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userUsername').value = user.username;
                document.getElementById('userRole').value = user.role;
                document.getElementById('userActive').value = user.active.toString();
                
                // Não mostrar senha para edição
                document.getElementById('userPassword').required = false;
                document.getElementById('userPasswordConfirm').required = false;
                document.getElementById('userPassword').placeholder = 'Deixe em branco para manter a senha atual';
                document.getElementById('userPasswordConfirm').placeholder = 'Deixe em branco para manter a senha atual';
            }
        }
    }

    // Limpar formulário de usuário
    clearUserForm() {
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
        document.getElementById('userPassword').required = true;
        document.getElementById('userPasswordConfirm').required = true;
        document.getElementById('userPassword').placeholder = '';
        document.getElementById('userPasswordConfirm').placeholder = '';
    }

    // Filtrar usuários
    filterUsers() {
        const roleFilter = document.getElementById('roleFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        
        const result = window.authSystem.getUsers();
        if (result.success) {
            let filteredUsers = result.users;
            
            if (roleFilter) {
                filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
            }
            
            if (statusFilter) {
                const isActive = statusFilter === 'active';
                filteredUsers = filteredUsers.filter(user => user.active === isActive);
            }
            
            this.displayUsers(filteredUsers);
        }
    }

    // Buscar usuários
    searchUsers() {
        const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
        
        const result = window.authSystem.getUsers();
        if (result.success) {
            const filteredUsers = result.users.filter(user => 
                user.name.toLowerCase().includes(searchTerm) ||
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            );
            
            this.displayUsers(filteredUsers);
        }
    }

    // Visualizar permissões do usuário
    viewPermissions(userId) {
        const result = window.authSystem.getUsers();
        if (result.success) {
            const user = result.users.find(u => u.id === userId);
            if (user) {
                this.showPermissionsModal(user);
            }
        }
    }

    // Mostrar modal de permissões
    showPermissionsModal(user) {
        // Criar modal se não existir
        let modal = document.getElementById('permissionsModal');
        if (!modal) {
            this.createPermissionsModal();
            modal = document.getElementById('permissionsModal');
        }

        // Preencher dados do usuário
        const userPermissions = window.authSystem.getUserPermissions(user);
        const role = window.authSystem.roles[user.role];
        
        document.getElementById('permissionsUserName').textContent = user.name;
        document.getElementById('permissionsUserRole').textContent = role?.name || user.role;
        document.getElementById('permissionsUserRole').style.backgroundColor = role?.color || '#95a5a6';

        // Listar permissões
        const container = document.getElementById('userPermissionsList');
        container.innerHTML = '';

        Object.keys(window.authSystem.permissions).forEach(permissionKey => {
            const permission = window.authSystem.permissions[permissionKey];
            const hasPermission = userPermissions[permissionKey];
            
            const div = document.createElement('div');
            div.className = `permission-item ${hasPermission ? 'granted' : 'denied'}`;
            div.innerHTML = `
                <div class="permission-status">
                    <i class="fas fa-${hasPermission ? 'check' : 'times'}"></i>
                </div>
                <div class="permission-details">
                    <span class="permission-name">${permission.name}</span>
                    <small class="permission-module">${permission.module}</small>
                </div>
            `;
            container.appendChild(div);
        });

        modal.style.display = 'block';
    }

    // Criar modal de permissões
    createPermissionsModal() {
        const modal = document.createElement('div');
        modal.id = 'permissionsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Permissões do Usuário</h3>
                    <span class="close" onclick="document.getElementById('permissionsModal').style.display='none'">&times;</span>
                </div>
                <div class="permissions-user-info">
                    <div class="user-avatar-large">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-details">
                        <h4 id="permissionsUserName"></h4>
                        <span id="permissionsUserRole" class="role-badge"></span>
                    </div>
                </div>
                <div class="permissions-list" id="userPermissionsList">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('permissionsModal').style.display='none'">Fechar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Mostrar logs de atividade
    showActivityLogs() {
        const result = window.authSystem.getActivityLogs(50);
        if (result.success) {
            this.showActivityLogsModal(result.logs);
        } else {
            window.authSystem.showMessage(result.message, 'error');
        }
    }

    // Mostrar modal de logs
    showActivityLogsModal(logs) {
        // Criar modal se não existir
        let modal = document.getElementById('activityLogsModal');
        if (!modal) {
            this.createActivityLogsModal();
            modal = document.getElementById('activityLogsModal');
        }

        // Preencher logs
        const container = document.getElementById('activityLogsList');
        container.innerHTML = '';

        logs.forEach(log => {
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.innerHTML = `
                <div class="log-icon ${log.action}">
                    <i class="fas fa-${this.getLogIcon(log.action)}"></i>
                </div>
                <div class="log-info">
                    <div class="log-action">${log.action.replace('_', ' ').toUpperCase()}</div>
                    <div class="log-description">${log.description}</div>
                    <div class="log-user">Usuário: ${log.user}</div>
                </div>
                <div class="log-timestamp">
                    ${new Date(log.timestamp).toLocaleString('pt-BR')}
                </div>
            `;
            container.appendChild(div);
        });

        modal.style.display = 'block';
    }

    // Criar modal de logs
    createActivityLogsModal() {
        const modal = document.createElement('div');
        modal.id = 'activityLogsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h3>Logs de Atividade</h3>
                    <span class="close" onclick="document.getElementById('activityLogsModal').style.display='none'">&times;</span>
                </div>
                <div class="activity-logs" id="activityLogsList">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('activityLogsModal').style.display='none'">Fechar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Obter ícone para o tipo de log
    getLogIcon(action) {
        const icons = {
            'login': 'sign-in-alt',
            'logout': 'sign-out-alt',
            'login_failed': 'exclamation-triangle',
            'user_created': 'user-plus',
            'user_updated': 'user-edit',
            'user_deleted': 'user-minus',
            'session_timeout': 'clock'
        };
        return icons[action] || 'info-circle';
    }

    // Mostrar seção de usuários pendentes
    showPendingUsersSection(pendingUsers) {
        const section = document.getElementById('pendingUsersSection');
        const container = document.getElementById('pendingUsersList');
        
        section.style.display = 'block';
        container.innerHTML = '';

        pendingUsers.forEach(user => {
            const card = document.createElement('div');
            card.className = 'pending-user-card';
            card.innerHTML = `
                <div class="pending-user-info">
                    <div class="user-avatar" style="background-color: #f39c12">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-details">
                        <h4>${user.name}</h4>
                        <p><i class="fas fa-envelope"></i> ${user.email}</p>
                        <p><i class="fas fa-user"></i> ${user.username}</p>
                        ${user.phone ? `<p><i class="fas fa-phone"></i> ${user.phone}</p>` : ''}
                        ${user.howFound ? `<p><i class="fas fa-info-circle"></i> Conheceu: ${this.getHowFoundText(user.howFound)}</p>` : ''}
                        <small><i class="fas fa-clock"></i> Cadastrado em: ${new Date(user.createdAt).toLocaleString('pt-BR')}</small>
                    </div>
                </div>
                <div class="pending-user-actions">
                    <button class="btn btn-success" onclick="userManager.approveUser(${user.id})" title="Aprovar">
                        <i class="fas fa-check"></i> Aprovar
                    </button>
                    <button class="btn btn-danger" onclick="userManager.rejectUser(${user.id})" title="Rejeitar">
                        <i class="fas fa-times"></i> Rejeitar
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Ocultar seção de usuários pendentes
    hidePendingUsersSection() {
        const section = document.getElementById('pendingUsersSection');
        section.style.display = 'none';
    }

    // Obter texto legível para "como conheceu"
    getHowFoundText(value) {
        const options = {
            'amigo': 'Indicação de amigo/familiar',
            'internet': 'Pesquisa na internet',
            'redes_sociais': 'Redes sociais',
            'passando': 'Passando pela rua',
            'evento': 'Evento da igreja',
            'outro': 'Outro'
        };
        return options[value] || value;
    }

    // Aprovar usuário pendente
    approveUser(userId) {
        if (confirm('Tem certeza que deseja aprovar este usuário?')) {
            const result = window.authSystem.approveUser(userId);
            if (result.success) {
                window.authSystem.showMessage(result.message, 'success');
                this.loadUsers(); // Recarregar listas
            } else {
                window.authSystem.showMessage(result.message, 'error');
            }
        }
    }

    // Rejeitar usuário pendente
    rejectUser(userId) {
        const reason = prompt('Motivo da rejeição (opcional):');
        if (reason !== null) { // null = cancelou, string vazia = OK sem motivo
            const result = window.authSystem.rejectUser(userId, reason);
            if (result.success) {
                window.authSystem.showMessage(result.message, 'success');
                this.loadUsers(); // Recarregar listas
            } else {
                window.authSystem.showMessage(result.message, 'error');
            }
        }
    }
}

// Instanciar gerenciador de usuários
window.userManager = new UserManagement();
