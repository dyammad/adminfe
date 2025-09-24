// Sistema de Autenticação e Autorização Granular
// Church Management System - User Management

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.roles = this.initializeRoles();
        this.permissions = this.initializePermissions();
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
        this.sessionTimer = null;
    }

    // Inicializar roles do sistema
    initializeRoles() {
        return {
            'super_admin': {
                name: 'Super Administrador',
                description: 'Acesso total ao sistema',
                level: 100,
                color: '#e74c3c'
            },
            'admin': {
                name: 'Administrador',
                description: 'Acesso administrativo completo',
                level: 90,
                color: '#f39c12'
            },
            'pastor': {
                name: 'Pastor',
                description: 'Acesso pastoral e administrativo',
                level: 80,
                color: '#9b59b6'
            },
            'leader': {
                name: 'Líder',
                description: 'Acesso a ministérios e células',
                level: 70,
                color: '#3498db'
            },
            'secretary': {
                name: 'Secretário(a)',
                description: 'Acesso a membros e eventos',
                level: 60,
                color: '#2ecc71'
            },
            'treasurer': {
                name: 'Tesoureiro(a)',
                description: 'Acesso financeiro',
                level: 50,
                color: '#1abc9c'
            },
            'member': {
                name: 'Membro',
                description: 'Acesso básico de visualização',
                level: 30,
                color: '#95a5a6'
            },
            'visitor': {
                name: 'Visitante',
                description: 'Acesso muito limitado',
                level: 10,
                color: '#bdc3c7'
            }
        };
    }

    // Inicializar permissões granulares
    initializePermissions() {
        return {
            // Permissões de Membros
            'members.view': { name: 'Visualizar Membros', module: 'members', level: 30 },
            'members.create': { name: 'Criar Membros', module: 'members', level: 60 },
            'members.edit': { name: 'Editar Membros', module: 'members', level: 60 },
            'members.delete': { name: 'Excluir Membros', module: 'members', level: 80 },
            'members.export': { name: 'Exportar Membros', module: 'members', level: 70 },
            
            // Permissões Financeiras
            'treasury.view': { name: 'Visualizar Finanças', module: 'treasury', level: 50 },
            'treasury.create': { name: 'Criar Transações', module: 'treasury', level: 50 },
            'treasury.edit': { name: 'Editar Transações', module: 'treasury', level: 60 },
            'treasury.delete': { name: 'Excluir Transações', module: 'treasury', level: 80 },
            'treasury.reports': { name: 'Relatórios Financeiros', module: 'treasury', level: 70 },
            
            // Permissões de Ministérios
            'ministries.view': { name: 'Visualizar Ministérios', module: 'ministries', level: 30 },
            'ministries.create': { name: 'Criar Ministérios', module: 'ministries', level: 70 },
            'ministries.edit': { name: 'Editar Ministérios', module: 'ministries', level: 70 },
            'ministries.delete': { name: 'Excluir Ministérios', module: 'ministries', level: 80 },
            
            // Permissões de Células
            'cells.view': { name: 'Visualizar Células', module: 'cells', level: 30 },
            'cells.create': { name: 'Criar Células', module: 'cells', level: 70 },
            'cells.edit': { name: 'Editar Células', module: 'cells', level: 70 },
            'cells.delete': { name: 'Excluir Células', module: 'cells', level: 80 },
            
            // Permissões de Eventos
            'events.view': { name: 'Visualizar Eventos', module: 'events', level: 30 },
            'events.create': { name: 'Criar Eventos', module: 'events', level: 60 },
            'events.edit': { name: 'Editar Eventos', module: 'events', level: 60 },
            'events.delete': { name: 'Excluir Eventos', module: 'events', level: 70 },
            
            // Permissões de Líderes
            'leaders.view': { name: 'Visualizar Líderes', module: 'leaders', level: 50 },
            'leaders.create': { name: 'Criar Líderes', module: 'leaders', level: 80 },
            'leaders.edit': { name: 'Editar Líderes', module: 'leaders', level: 80 },
            'leaders.delete': { name: 'Excluir Líderes', module: 'leaders', level: 90 },
            
            // Permissões de Batismos
            'baptisms.view': { name: 'Visualizar Batismos', module: 'baptisms', level: 30 },
            'baptisms.create': { name: 'Agendar Batismos', module: 'baptisms', level: 70 },
            'baptisms.edit': { name: 'Editar Batismos', module: 'baptisms', level: 70 },
            'baptisms.delete': { name: 'Excluir Batismos', module: 'baptisms', level: 80 },
            
            // Permissões de Pedidos de Oração
            'prayers.view': { name: 'Visualizar Pedidos', module: 'prayers', level: 30 },
            'prayers.create': { name: 'Criar Pedidos', module: 'prayers', level: 30 },
            'prayers.edit': { name: 'Editar Pedidos', module: 'prayers', level: 60 },
            'prayers.delete': { name: 'Excluir Pedidos', module: 'prayers', level: 70 },
            
            // Permissões de Doações
            'donations.view': { name: 'Visualizar Doações', module: 'donations', level: 50 },
            'donations.create': { name: 'Registrar Doações', module: 'donations', level: 50 },
            'donations.edit': { name: 'Editar Doações', module: 'donations', level: 60 },
            'donations.delete': { name: 'Excluir Doações', module: 'donations', level: 80 },
            
            // Permissões de Agenda
            'agenda.view': { name: 'Visualizar Agenda', module: 'agenda', level: 50 },
            'agenda.create': { name: 'Criar Compromissos', module: 'agenda', level: 70 },
            'agenda.edit': { name: 'Editar Compromissos', module: 'agenda', level: 70 },
            'agenda.delete': { name: 'Excluir Compromissos', module: 'agenda', level: 80 },
            
            // Permissões de Sistema
            'users.view': { name: 'Visualizar Usuários', module: 'system', level: 80 },
            'users.create': { name: 'Criar Usuários', module: 'system', level: 90 },
            'users.edit': { name: 'Editar Usuários', module: 'system', level: 90 },
            'users.delete': { name: 'Excluir Usuários', module: 'system', level: 100 },
            'system.backup': { name: 'Backup do Sistema', module: 'system', level: 90 },
            'system.restore': { name: 'Restaurar Sistema', module: 'system', level: 100 },
            'system.logs': { name: 'Visualizar Logs', module: 'system', level: 80 },
            
            // Permissões de Dashboard
            'dashboard.view': { name: 'Visualizar Dashboard', module: 'dashboard', level: 30 },
            'dashboard.stats': { name: 'Estatísticas Avançadas', module: 'dashboard', level: 60 }
        };
    }

    // Carregar usuários (em produção, viria do servidor)
    loadUsers() {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123', // Em produção, seria hash
                name: 'Administrador do Sistema',
                email: 'admin@igreja.com',
                role: 'super_admin',
                active: true,
                lastLogin: null,
                createdAt: new Date().toISOString(),
                customPermissions: []
            },
            {
                id: 2,
                username: 'pastor',
                password: 'pastor123',
                name: 'Pastor Principal',
                email: 'pastor@igreja.com',
                role: 'pastor',
                active: true,
                lastLogin: null,
                createdAt: new Date().toISOString(),
                customPermissions: []
            },
            {
                id: 3,
                username: 'secretaria',
                password: 'sec123',
                name: 'Secretária da Igreja',
                email: 'secretaria@igreja.com',
                role: 'secretary',
                active: true,
                lastLogin: null,
                createdAt: new Date().toISOString(),
                customPermissions: []
            },
            {
                id: 4,
                username: 'tesoureiro',
                password: 'tes123',
                name: 'Tesoureiro da Igreja',
                email: 'tesoureiro@igreja.com',
                role: 'treasurer',
                active: true,
                lastLogin: null,
                createdAt: new Date().toISOString(),
                customPermissions: []
            },
            {
                id: 5,
                username: 'lider1',
                password: 'lider123',
                name: 'Líder de Ministério',
                email: 'lider@igreja.com',
                role: 'leader',
                active: true,
                lastLogin: null,
                createdAt: new Date().toISOString(),
                customPermissions: []
            }
        ];

        // Tentar carregar do localStorage
        const savedUsers = localStorage.getItem('churchUsers');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }

        // Salvar usuários padrão
        localStorage.setItem('churchUsers', JSON.stringify(defaultUsers));
        return defaultUsers;
    }

    // Salvar usuários no localStorage
    saveUsers() {
        localStorage.setItem('churchUsers', JSON.stringify(this.users));
    }

    // Autenticar usuário
    async authenticate(username, password) {
        const user = this.users.find(u => 
            u.username === username && 
            u.password === password && 
            u.active
        );

        if (user) {
            // Atualizar último login
            user.lastLogin = new Date().toISOString();
            this.saveUsers();

            // Definir usuário atual
            this.currentUser = {
                ...user,
                permissions: this.getUserPermissions(user)
            };

            // Iniciar sessão
            this.startSession();

            // Log de auditoria
            this.logActivity('login', `Usuário ${username} fez login`);

            return {
                success: true,
                user: this.currentUser,
                message: 'Login realizado com sucesso'
            };
        }

        // Log de tentativa de login falhada
        this.logActivity('login_failed', `Tentativa de login falhada para ${username}`);

        return {
            success: false,
            message: 'Usuário ou senha incorretos'
        };
    }

    // Obter permissões do usuário
    getUserPermissions(user) {
        const roleLevel = this.roles[user.role]?.level || 0;
        const permissions = {};

        // Adicionar permissões baseadas no nível do role
        Object.keys(this.permissions).forEach(permission => {
            const permissionData = this.permissions[permission];
            if (roleLevel >= permissionData.level) {
                permissions[permission] = true;
            }
        });

        // Adicionar permissões customizadas
        if (user.customPermissions) {
            user.customPermissions.forEach(permission => {
                if (permission.granted) {
                    permissions[permission.name] = true;
                } else {
                    delete permissions[permission.name];
                }
            });
        }

        return permissions;
    }

    // Verificar se usuário tem permissão
    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions[permission] === true;
    }

    // Verificar se usuário tem nível mínimo
    hasMinimumLevel(requiredLevel) {
        if (!this.currentUser) return false;
        const userLevel = this.roles[this.currentUser.role]?.level || 0;
        return userLevel >= requiredLevel;
    }

    // Iniciar sessão com timeout
    startSession() {
        this.resetSessionTimer();
        
        // Salvar sessão
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        sessionStorage.setItem('sessionStart', new Date().toISOString());
    }

    // Resetar timer da sessão
    resetSessionTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }

        this.sessionTimer = setTimeout(() => {
            this.logout('session_timeout');
        }, this.sessionTimeout);
    }

    // Logout
    logout(reason = 'manual') {
        if (this.currentUser) {
            this.logActivity('logout', `Usuário ${this.currentUser.username} fez logout (${reason})`);
        }

        this.currentUser = null;
        
        // Limpar sessão
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('sessionStart');
        
        // Limpar timer
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }

        // Redirecionar para login
        this.showLoginScreen();

        if (reason === 'session_timeout') {
            this.showMessage('Sessão expirada. Faça login novamente.', 'warning');
        }
    }

    // Verificar sessão existente
    checkExistingSession() {
        const savedUser = sessionStorage.getItem('currentUser');
        const sessionStart = sessionStorage.getItem('sessionStart');

        if (savedUser && sessionStart) {
            const sessionAge = Date.now() - new Date(sessionStart).getTime();
            
            if (sessionAge < this.sessionTimeout) {
                this.currentUser = JSON.parse(savedUser);
                this.startSession();
                return true;
            } else {
                // Sessão expirada
                this.logout('session_timeout');
                return false;
            }
        }

        return false;
    }

    // Criar novo usuário
    createUser(userData) {
        // Validar dados
        if (!userData.username || !userData.password || !userData.name || !userData.email || !userData.role) {
            return { success: false, message: 'Todos os campos obrigatórios devem ser preenchidos' };
        }

        // Verificar se usuário já existe
        if (this.users.find(u => u.username === userData.username)) {
            return { success: false, message: 'Nome de usuário já existe' };
        }

        if (this.users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email já está em uso' };
        }

        // Verificar permissão (exceto para auto-cadastro)
        if (!userData.selfRegister && !this.hasPermission('users.create')) {
            return { success: false, message: 'Sem permissão para criar usuários' };
        }

        // Criar usuário
        const newUser = {
            id: Math.max(...this.users.map(u => u.id)) + 1,
            username: userData.username,
            password: userData.password, // Em produção, seria hash
            name: userData.name,
            email: userData.email,
            role: userData.role,
            active: userData.active !== false,
            lastLogin: null,
            createdAt: new Date().toISOString(),
            customPermissions: userData.customPermissions || [],
            // Campos específicos para visitantes
            phone: userData.phone || '',
            birthdate: userData.birthdate || '',
            howFound: userData.howFound || '',
            // Status de aprovação para auto-cadastro
            approved: userData.selfRegister ? false : true,
            approvedBy: userData.selfRegister ? null : this.currentUser?.username || 'system',
            approvedAt: userData.selfRegister ? null : new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        const action = userData.selfRegister ? 'self_register' : 'user_created';
        const description = userData.selfRegister ? 
            `Visitante ${userData.username} se auto-cadastrou` : 
            `Usuário ${userData.username} foi criado`;
        
        this.logActivity(action, description);

        return { success: true, message: 'Usuário criado com sucesso', user: newUser };
    }

    // Auto-cadastro para visitantes
    selfRegister(userData) {
        // Validar dados específicos do auto-cadastro
        if (!userData.username || !userData.password || !userData.name || !userData.email) {
            return { success: false, message: 'Todos os campos obrigatórios devem ser preenchidos' };
        }

        // Validar formato do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return { success: false, message: 'Email inválido' };
        }

        // Validar senha
        if (userData.password.length < 6) {
            return { success: false, message: 'A senha deve ter pelo menos 6 caracteres' };
        }

        // Verificar se usuário já existe
        if (this.users.find(u => u.username === userData.username)) {
            return { success: false, message: 'Nome de usuário já existe' };
        }

        if (this.users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email já está em uso' };
        }

        // Criar usuário visitante
        const visitorData = {
            ...userData,
            role: 'visitor',
            active: false, // Inativo até aprovação
            selfRegister: true
        };

        const result = this.createUser(visitorData);
        
        if (result.success) {
            // Notificar administradores sobre novo cadastro
            this.notifyAdminsNewRegistration(result.user);
            
            return {
                success: true,
                message: 'Cadastro realizado com sucesso! Aguarde a aprovação de um administrador para acessar o sistema.',
                user: result.user
            };
        }

        return result;
    }

    // Notificar administradores sobre novo cadastro
    notifyAdminsNewRegistration(user) {
        this.logActivity('pending_approval', `Novo visitante ${user.name} aguarda aprovação`);
        
        // Em produção, aqui seria enviado email/notificação para admins
        console.log(`Novo cadastro pendente: ${user.name} (${user.email})`);
    }

    // Aprovar usuário
    approveUser(userId) {
        if (!this.hasPermission('users.edit')) {
            return { success: false, message: 'Sem permissão para aprovar usuários' };
        }

        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        const user = this.users[userIndex];
        user.approved = true;
        user.active = true;
        user.approvedBy = this.currentUser?.username || 'system';
        user.approvedAt = new Date().toISOString();

        this.saveUsers();
        this.logActivity('user_approved', `Usuário ${user.username} foi aprovado`);

        return { success: true, message: 'Usuário aprovado com sucesso', user: user };
    }

    // Rejeitar usuário
    rejectUser(userId, reason = '') {
        if (!this.hasPermission('users.delete')) {
            return { success: false, message: 'Sem permissão para rejeitar usuários' };
        }

        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        const user = this.users[userIndex];
        this.users.splice(userIndex, 1);
        this.saveUsers();

        this.logActivity('user_rejected', `Usuário ${user.username} foi rejeitado. Motivo: ${reason}`);

        return { success: true, message: 'Usuário rejeitado e removido do sistema' };
    }

    // Obter usuários pendentes de aprovação
    getPendingUsers() {
        if (!this.hasPermission('users.view')) {
            return { success: false, message: 'Sem permissão para visualizar usuários' };
        }

        const pendingUsers = this.users.filter(u => !u.approved);
        return { success: true, users: pendingUsers };
    }

    // Atualizar usuário
    updateUser(userId, userData) {
        if (!this.hasPermission('users.edit')) {
            return { success: false, message: 'Sem permissão para editar usuários' };
        }

        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        // Verificar se username/email já existem em outros usuários
        if (userData.username && this.users.find(u => u.username === userData.username && u.id !== userId)) {
            return { success: false, message: 'Nome de usuário já existe' };
        }

        if (userData.email && this.users.find(u => u.email === userData.email && u.id !== userId)) {
            return { success: false, message: 'Email já está em uso' };
        }

        // Atualizar usuário
        this.users[userIndex] = { ...this.users[userIndex], ...userData };
        this.saveUsers();

        this.logActivity('user_updated', `Usuário ${this.users[userIndex].username} foi atualizado`);

        return { success: true, message: 'Usuário atualizado com sucesso', user: this.users[userIndex] };
    }

    // Excluir usuário
    deleteUser(userId) {
        if (!this.hasPermission('users.delete')) {
            return { success: false, message: 'Sem permissão para excluir usuários' };
        }

        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        // Não permitir excluir o próprio usuário
        if (this.currentUser && this.currentUser.id === userId) {
            return { success: false, message: 'Não é possível excluir o próprio usuário' };
        }

        const deletedUser = this.users[userIndex];
        this.users.splice(userIndex, 1);
        this.saveUsers();

        this.logActivity('user_deleted', `Usuário ${deletedUser.username} foi excluído`);

        return { success: true, message: 'Usuário excluído com sucesso' };
    }

    // Obter todos os usuários
    getUsers() {
        if (!this.hasPermission('users.view')) {
            return { success: false, message: 'Sem permissão para visualizar usuários' };
        }

        return { 
            success: true, 
            users: this.users.map(u => ({ ...u, password: undefined })) // Não retornar senhas
        };
    }

    // Log de atividades
    logActivity(action, description) {
        const logs = JSON.parse(localStorage.getItem('churchLogs') || '[]');
        
        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: this.currentUser?.username || 'system',
            action: action,
            description: description,
            ip: 'localhost', // Em produção, capturar IP real
            userAgent: navigator.userAgent
        };

        logs.unshift(logEntry);
        
        // Manter apenas os últimos 1000 logs
        if (logs.length > 1000) {
            logs.splice(1000);
        }

        localStorage.setItem('churchLogs', JSON.stringify(logs));
    }

    // Obter logs de atividade
    getActivityLogs(limit = 100) {
        if (!this.hasPermission('system.logs')) {
            return { success: false, message: 'Sem permissão para visualizar logs' };
        }

        const logs = JSON.parse(localStorage.getItem('churchLogs') || '[]');
        return { success: true, logs: logs.slice(0, limit) };
    }

    // Mostrar tela de login
    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }

    // Mostrar aplicação principal
    showMainApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
    }

    // Mostrar mensagem
    showMessage(message, type = 'info') {
        // Implementar sistema de notificações
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="notification-close">&times;</button>
        `;

        // Adicionar ao DOM
        let container = document.getElementById('notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Obter informações do usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Obter role do usuário atual
    getCurrentUserRole() {
        return this.currentUser ? this.roles[this.currentUser.role] : null;
    }

    // Verificar se é admin
    isAdmin() {
        return this.hasMinimumLevel(80);
    }

    // Verificar se é super admin
    isSuperAdmin() {
        return this.hasMinimumLevel(100);
    }
}

// Instância global do sistema de autenticação
window.authSystem = new AuthSystem();
