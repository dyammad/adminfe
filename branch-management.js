// ============================================
// MÓDULO DE GERENCIAMENTO DE FILIAIS
// Interface administrativa para gerenciar filiais
// ============================================

class BranchManagement {
    constructor() {
        this.currentFilters = {
            search: '',
            state: '',
            active: true
        };
    }

    // Renderizar página de gerenciamento de filiais
    renderBranchesPage() {
        const container = document.getElementById('branches-management');
        if (!container) return;

        const stats = branchDB.getStatistics();

        container.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-building"></i> Gerenciamento de Filiais</h2>
                <button class="btn btn-primary" onclick="branchManagement.openAddBranchModal()">
                    <i class="fas fa-plus"></i> Adicionar Filial
                </button>
            </div>

            <!-- Estatísticas -->
            <div class="branch-stats">
                <div class="branch-stat-card">
                    <div class="branch-stat-icon total">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="branch-stat-value">${stats.total}</div>
                    <div class="branch-stat-label">Total de Filiais</div>
                </div>
                <div class="branch-stat-card">
                    <div class="branch-stat-icon active">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="branch-stat-value">${stats.active}</div>
                    <div class="branch-stat-label">Filiais Ativas</div>
                </div>
                <div class="branch-stat-card">
                    <div class="branch-stat-icon inactive">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="branch-stat-value">${stats.inactive}</div>
                    <div class="branch-stat-label">Filiais Inativas</div>
                </div>
                <div class="branch-stat-card">
                    <div class="branch-stat-icon members">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="branch-stat-value">${stats.totalMembers.toLocaleString()}</div>
                    <div class="branch-stat-label">Total de Membros</div>
                </div>
            </div>

            <!-- Filtros -->
            <div class="branch-filters">
                <input type="text" 
                       id="branchSearchInput" 
                       placeholder="🔍 Buscar por nome, código ou cidade..."
                       value="${this.currentFilters.search}">
                
                <select id="branchStateFilter">
                    <option value="">Todos os Estados</option>
                    ${this.renderStateOptions()}
                </select>

                <select id="branchStatusFilter">
                    <option value="">Todos os Status</option>
                    <option value="true" ${this.currentFilters.active === true ? 'selected' : ''}>Ativas</option>
                    <option value="false" ${this.currentFilters.active === false ? 'selected' : ''}>Inativas</option>
                </select>

                <button class="btn btn-secondary" onclick="branchManagement.resetFilters()">
                    <i class="fas fa-redo"></i> Limpar Filtros
                </button>
            </div>

            <!-- Grid de Filiais -->
            <div class="branches-grid" id="branchesGrid">
                ${this.renderBranchCards()}
            </div>
        `;

        // Adicionar event listeners
        this.attachFilterListeners();
    }

    // Renderizar opções de estados
    renderStateOptions() {
        const states = [...new Set(branchDB.getAllBranches().map(b => b.stateUF))].sort();
        return states.map(state => {
            const selected = this.currentFilters.state === state ? 'selected' : '';
            return `<option value="${state}" ${selected}>${state}</option>`;
        }).join('');
    }

    // Renderizar cards de filiais
    renderBranchCards() {
        const branches = branchDB.searchBranches(this.currentFilters);

        if (branches.length === 0) {
            return `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-building" style="font-size: 48px; color: #bdc3c7;"></i>
                    <p>Nenhuma filial encontrada</p>
                </div>
            `;
        }

        return branches.map(branch => `
            <div class="branch-card" data-branch-id="${branch.id}">
                <div class="branch-card-header">
                    <span class="branch-card-code">${branch.code}</span>
                    <span class="branch-card-status ${branch.active ? 'active' : 'inactive'}">
                        <i class="fas fa-circle"></i>
                        ${branch.active ? 'Ativa' : 'Inativa'}
                    </span>
                </div>
                <div class="branch-card-name">${branch.name}</div>
                <div class="branch-card-details">
                    <div class="branch-card-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${branch.city} - ${branch.stateUF}</span>
                    </div>
                    <div class="branch-card-detail">
                        <i class="fas fa-user-tie"></i>
                        <span>${branch.pastor}</span>
                    </div>
                    <div class="branch-card-detail">
                        <i class="fas fa-users"></i>
                        <span>${branch.memberCount} membros</span>
                    </div>
                    <div class="branch-card-detail">
                        <i class="fas fa-calendar"></i>
                        <span>Fundada em ${new Date(branch.foundedDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
                <div class="branch-card-actions">
                    <button class="btn-view" onclick="branchManagement.viewBranch(${branch.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="branchManagement.editBranch(${branch.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Adicionar listeners aos filtros
    attachFilterListeners() {
        const searchInput = document.getElementById('branchSearchInput');
        const stateFilter = document.getElementById('branchStateFilter');
        const statusFilter = document.getElementById('branchStatusFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.updateBranchCards();
            });
        }

        if (stateFilter) {
            stateFilter.addEventListener('change', (e) => {
                this.currentFilters.state = e.target.value;
                this.updateBranchCards();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                const value = e.target.value;
                this.currentFilters.active = value === '' ? undefined : value === 'true';
                this.updateBranchCards();
            });
        }
    }

    // Atualizar apenas os cards
    updateBranchCards() {
        const grid = document.getElementById('branchesGrid');
        if (grid) {
            grid.innerHTML = this.renderBranchCards();
        }
    }

    // Resetar filtros
    resetFilters() {
        this.currentFilters = {
            search: '',
            state: '',
            active: undefined
        };
        this.renderBranchesPage();
    }

    // Ver detalhes da filial
    viewBranch(branchId) {
        const branch = branchDB.getBranchById(branchId);
        if (!branch) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3><i class="fas fa-building"></i> Detalhes da Filial</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="branch-detail-view">
                        <div class="detail-row">
                            <strong>Código:</strong>
                            <span>${branch.code}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Nome:</strong>
                            <span>${branch.name}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Cidade:</strong>
                            <span>${branch.city} - ${branch.stateUF}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Região:</strong>
                            <span>${branch.region}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Endereço:</strong>
                            <span>${branch.address}, ${branch.neighborhood}</span>
                        </div>
                        <div class="detail-row">
                            <strong>CEP:</strong>
                            <span>${branch.zipCode}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Telefone:</strong>
                            <span>${branch.phone}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Email:</strong>
                            <span>${branch.email}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Pastor:</strong>
                            <span>${branch.pastor}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Data de Fundação:</strong>
                            <span>${new Date(branch.foundedDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Membros:</strong>
                            <span>${branch.memberCount}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Status:</strong>
                            <span class="badge ${branch.active ? 'badge-success' : 'badge-danger'}">
                                ${branch.active ? 'Ativa' : 'Inativa'}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        Fechar
                    </button>
                    <button class="btn btn-primary" onclick="branchManagement.editBranch(${branch.id}); this.closest('.modal-overlay').remove();">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Editar filial
    editBranch(branchId) {
        const branch = branchDB.getBranchById(branchId);
        if (!branch) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Editar Filial</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="editBranchForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Nome da Filial *</label>
                                <input type="text" id="editBranchName" value="${branch.name}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Cidade *</label>
                                <input type="text" id="editBranchCity" value="${branch.city}" required>
                            </div>
                            <div class="form-group">
                                <label>Estado (UF) *</label>
                                <input type="text" id="editBranchState" value="${branch.stateUF}" maxlength="2" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Pastor Responsável *</label>
                            <input type="text" id="editBranchPastor" value="${branch.pastor}" required>
                        </div>
                        <div class="form-group">
                            <label>Telefone</label>
                            <input type="tel" id="editBranchPhone" value="${branch.phone}">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="editBranchEmail" value="${branch.email}">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="editBranchActive" ${branch.active ? 'checked' : ''}>
                                Filial Ativa
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" onclick="branchManagement.saveBranch(${branch.id})">
                        <i class="fas fa-save"></i> Salvar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Salvar alterações da filial
    saveBranch(branchId) {
        const updates = {
            name: document.getElementById('editBranchName').value,
            city: document.getElementById('editBranchCity').value,
            stateUF: document.getElementById('editBranchState').value.toUpperCase(),
            pastor: document.getElementById('editBranchPastor').value,
            phone: document.getElementById('editBranchPhone').value,
            email: document.getElementById('editBranchEmail').value,
            active: document.getElementById('editBranchActive').checked
        };

        const result = branchDB.updateBranch(branchId, updates);
        
        if (result) {
            showNotification('Filial atualizada com sucesso!', 'success');
            document.querySelector('.modal-overlay').remove();
            this.renderBranchesPage();
        } else {
            showNotification('Erro ao atualizar filial', 'error');
        }
    }

    // Abrir modal para adicionar filial
    openAddBranchModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> Adicionar Nova Filial</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addBranchForm">
                        <div class="form-group">
                            <label>Nome da Filial *</label>
                            <input type="text" id="newBranchName" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Cidade *</label>
                                <input type="text" id="newBranchCity" required>
                            </div>
                            <div class="form-group">
                                <label>Estado (UF) *</label>
                                <input type="text" id="newBranchState" maxlength="2" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Pastor Responsável *</label>
                            <input type="text" id="newBranchPastor" required>
                        </div>
                        <div class="form-group">
                            <label>Telefone</label>
                            <input type="tel" id="newBranchPhone">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="newBranchEmail">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" onclick="branchManagement.addNewBranch()">
                        <i class="fas fa-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Adicionar nova filial
    addNewBranch() {
        const branchData = {
            name: document.getElementById('newBranchName').value,
            city: document.getElementById('newBranchCity').value,
            state: document.getElementById('newBranchState').value,
            stateUF: document.getElementById('newBranchState').value.toUpperCase(),
            pastor: document.getElementById('newBranchPastor').value,
            phone: document.getElementById('newBranchPhone').value,
            email: document.getElementById('newBranchEmail').value,
            address: 'A definir',
            neighborhood: 'A definir',
            zipCode: '00000-000',
            region: 'Centro',
            foundedDate: new Date().toISOString().split('T')[0],
            memberCount: 0
        };

        const result = branchDB.addBranch(branchData);
        
        if (result) {
            showNotification('Filial adicionada com sucesso!', 'success');
            document.querySelector('.modal-overlay').remove();
            this.renderBranchesPage();
        } else {
            showNotification('Erro ao adicionar filial', 'error');
        }
    }
}

// Instância global
const branchManagement = new BranchManagement();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.branchManagement = branchManagement;
}

console.log('✅ Módulo de Gerenciamento de Filiais carregado!');
