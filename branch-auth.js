// ============================================
// EXTENSÃO DO SISTEMA DE AUTENTICAÇÃO COM FILIAIS
// Adiciona suporte a multi-filiais no sistema de auth
// ============================================

// Estender AuthSystem para incluir filiais
if (typeof AuthSystem !== 'undefined') {
    // Salvar método original de autenticação
    const originalAuthenticate = AuthSystem.prototype.authenticate;
    
    // Sobrescrever método de autenticação para incluir filial
    AuthSystem.prototype.authenticate = async function(username, password, branchId) {
        // Validar filial
        if (!branchId) {
            return {
                success: false,
                message: 'Por favor, selecione uma filial'
            };
        }

        const branch = branchDB.getBranchById(parseInt(branchId));
        if (!branch) {
            return {
                success: false,
                message: 'Filial inválida'
            };
        }

        if (!branch.active) {
            return {
                success: false,
                message: 'Esta filial está inativa'
            };
        }

        // Autenticar usuário (senha case-insensitive)
        const user = this.users.find(u => 
            u.username === username && 
            u.password.toLowerCase() === password.toLowerCase() && 
            u.active
        );

        if (!user) {
            return {
                success: false,
                message: 'Usuário ou senha inválidos'
            };
        }

        // Verificar se usuário tem acesso à filial
        if (user.branchId && user.branchId !== parseInt(branchId)) {
            // Super admin pode acessar qualquer filial
            if (user.role !== 'super_admin') {
                return {
                    success: false,
                    message: 'Você não tem acesso a esta filial'
                };
            }
        }

        // Definir filial atual
        branchIsolation.setCurrentBranch(parseInt(branchId));

        // Atualizar último login
        user.lastLogin = new Date().toISOString();
        user.currentBranchId = parseInt(branchId);
        this.saveUsers();

        // Definir usuário atual
        this.currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(user));

        // Iniciar timer de sessão
        this.startSessionTimer();

        // Log de auditoria
        this.logAudit('login', {
            userId: user.id,
            username: user.username,
            branchId: branchId,
            branchName: branch.name,
            timestamp: new Date().toISOString()
        });

        return {
            success: true,
            user: user,
            branch: branch,
            message: `Bem-vindo, ${user.name}!`
        };
    };

    // Adicionar método para trocar de filial
    AuthSystem.prototype.switchBranch = function(branchId) {
        if (!this.currentUser) {
            return {
                success: false,
                message: 'Usuário não autenticado'
            };
        }

        const branch = branchDB.getBranchById(parseInt(branchId));
        if (!branch) {
            return {
                success: false,
                message: 'Filial inválida'
            };
        }

        if (!branch.active) {
            return {
                success: false,
                message: 'Esta filial está inativa'
            };
        }

        // Verificar permissão
        if (this.currentUser.branchId && this.currentUser.branchId !== parseInt(branchId)) {
            if (this.currentUser.role !== 'super_admin') {
                return {
                    success: false,
                    message: 'Você não tem acesso a esta filial'
                };
            }
        }

        // Trocar filial
        branchIsolation.setCurrentBranch(parseInt(branchId));
        this.currentUser.currentBranchId = parseInt(branchId);
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Log de auditoria
        this.logAudit('branch_switch', {
            userId: this.currentUser.id,
            username: this.currentUser.username,
            fromBranchId: branchIsolation.getCurrentBranch()?.id,
            toBranchId: branchId,
            toBranchName: branch.name,
            timestamp: new Date().toISOString()
        });

        return {
            success: true,
            branch: branch,
            message: `Filial alterada para: ${branch.name}`
        };
    };

    // Adicionar método para obter filial atual
    AuthSystem.prototype.getCurrentBranch = function() {
        return branchIsolation.getCurrentBranch();
    };

    // Adicionar método para verificar acesso à filial
    AuthSystem.prototype.canAccessBranch = function(branchId) {
        if (!this.currentUser) return false;
        
        // Super admin pode acessar qualquer filial
        if (this.currentUser.role === 'super_admin') return true;
        
        // Usuário sem filial específica pode acessar qualquer uma
        if (!this.currentUser.branchId) return true;
        
        // Verificar se é a filial do usuário
        return this.currentUser.branchId === parseInt(branchId);
    };

    // Adicionar método para listar filiais acessíveis
    AuthSystem.prototype.getAccessibleBranches = function() {
        if (!this.currentUser) return [];
        
        // Super admin vê todas as filiais
        if (this.currentUser.role === 'super_admin') {
            return branchDB.getActiveBranches();
        }
        
        // Usuário com filial específica vê apenas a sua
        if (this.currentUser.branchId) {
            const branch = branchDB.getBranchById(this.currentUser.branchId);
            return branch ? [branch] : [];
        }
        
        // Outros usuários veem todas as filiais ativas
        return branchDB.getActiveBranches();
    };

    // Adicionar método de log de auditoria
    AuthSystem.prototype.logAudit = function(action, data) {
        const auditLog = {
            id: Date.now(),
            action: action,
            data: data,
            timestamp: new Date().toISOString()
        };

        // Salvar em log isolado por filial
        if (branchIsolation.hasBranch()) {
            const logs = branchIsolation.getItem('auditLogs') || [];
            logs.push(auditLog);
            
            // Manter apenas últimos 1000 logs
            if (logs.length > 1000) {
                logs.shift();
            }
            
            branchIsolation.setItem('auditLogs', logs);
        }
    };

    // Adicionar método para obter logs de auditoria
    AuthSystem.prototype.getAuditLogs = function(filters = {}) {
        if (!branchIsolation.hasBranch()) return [];
        
        let logs = branchIsolation.getItem('auditLogs') || [];
        
        // Aplicar filtros
        if (filters.action) {
            logs = logs.filter(log => log.action === filters.action);
        }
        
        if (filters.userId) {
            logs = logs.filter(log => log.data.userId === filters.userId);
        }
        
        if (filters.startDate) {
            logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
        }
        
        if (filters.endDate) {
            logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
        }
        
        // Ordenar por data (mais recente primeiro)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return logs;
    };

    console.log('✅ Sistema de Autenticação com Filiais carregado!');
}

// Adicionar campo de filial aos usuários padrão
function addBranchFieldToUsers() {
    const authSystem = window.authSystem;
    if (!authSystem) return;

    let updated = false;
    authSystem.users.forEach(user => {
        if (!user.hasOwnProperty('branchId')) {
            // Super admin não tem filial específica (pode acessar todas)
            user.branchId = user.role === 'super_admin' ? null : 1;
            updated = true;
        }
    });

    if (updated) {
        authSystem.saveUsers();
        console.log('✅ Campo de filial adicionado aos usuários');
    }
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addBranchFieldToUsers);
} else {
    addBranchFieldToUsers();
}
