// ============================================
// SISTEMA DE ISOLAMENTO DE DADOS POR FILIAL
// Garante que cada filial tenha dados completamente isolados
// ============================================

class BranchIsolation {
    constructor() {
        this.currentBranch = null;
        this.loadCurrentBranch();
    }

    // Carrega filial atual da sessão
    loadCurrentBranch() {
        const branchData = sessionStorage.getItem('currentBranch');
        if (branchData) {
            this.currentBranch = JSON.parse(branchData);
        }
    }

    // Define filial atual
    setCurrentBranch(branchId) {
        const branch = branchDB.getBranchById(branchId);
        if (branch) {
            this.currentBranch = branch;
            sessionStorage.setItem('currentBranch', JSON.stringify(branch));
            console.log(`✅ Filial ativa: ${branch.name} (${branch.code})`);
            return true;
        }
        return false;
    }

    // Obtém filial atual
    getCurrentBranch() {
        return this.currentBranch;
    }

    // Limpa filial atual
    clearCurrentBranch() {
        this.currentBranch = null;
        sessionStorage.removeItem('currentBranch');
    }

    // Verifica se há filial selecionada
    hasBranch() {
        return this.currentBranch !== null;
    }

    // Gera chave de storage isolada por filial
    getBranchKey(key) {
        if (!this.currentBranch) {
            throw new Error('Nenhuma filial selecionada!');
        }
        return `branch_${this.currentBranch.id}_${key}`;
    }

    // Salva dados isolados por filial
    setItem(key, value) {
        const branchKey = this.getBranchKey(key);
        localStorage.setItem(branchKey, JSON.stringify(value));
    }

    // Obtém dados isolados por filial
    getItem(key) {
        const branchKey = this.getBranchKey(key);
        const data = localStorage.getItem(branchKey);
        return data ? JSON.parse(data) : null;
    }

    // Remove dados isolados por filial
    removeItem(key) {
        const branchKey = this.getBranchKey(key);
        localStorage.removeItem(branchKey);
    }

    // Limpa todos os dados da filial atual
    clearBranchData() {
        if (!this.currentBranch) return;

        const prefix = `branch_${this.currentBranch.id}_`;
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`🗑️ Dados da filial ${this.currentBranch.code} limpos`);
    }

    // Migra dados antigos para sistema de filiais
    migrateOldData(branchId) {
        const oldKeys = [
            'churchMembers',
            'churchMinistries',
            'churchEvents',
            'churchCells',
            'churchLeaders',
            'churchTreasury',
            'prayerRequests',
            'baptisms',
            'donations'
        ];

        this.setCurrentBranch(branchId);

        oldKeys.forEach(oldKey => {
            const oldData = localStorage.getItem(oldKey);
            if (oldData) {
                const newKey = oldKey.replace('church', '');
                this.setItem(newKey, JSON.parse(oldData));
                console.log(`✅ Migrado: ${oldKey} → ${this.getBranchKey(newKey)}`);
            }
        });
    }

    // Exporta dados da filial
    exportBranchData() {
        if (!this.currentBranch) return null;

        const branchData = {
            branch: this.currentBranch,
            data: {},
            exportDate: new Date().toISOString()
        };

        const prefix = `branch_${this.currentBranch.id}_`;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                const dataKey = key.replace(prefix, '');
                branchData.data[dataKey] = JSON.parse(localStorage.getItem(key));
            }
        }

        return branchData;
    }

    // Importa dados para filial
    importBranchData(branchData) {
        if (!branchData.branch || !branchData.data) {
            throw new Error('Dados de importação inválidos');
        }

        this.setCurrentBranch(branchData.branch.id);

        Object.keys(branchData.data).forEach(key => {
            this.setItem(key, branchData.data[key]);
        });

        console.log(`✅ Dados importados para filial ${this.currentBranch.code}`);
    }

    // Estatísticas de armazenamento por filial
    getBranchStorageStats() {
        if (!this.currentBranch) return null;

        const prefix = `branch_${this.currentBranch.id}_`;
        let totalSize = 0;
        const items = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                const value = localStorage.getItem(key);
                const size = new Blob([value]).size;
                totalSize += size;
                
                const dataKey = key.replace(prefix, '');
                items[dataKey] = {
                    size: size,
                    sizeKB: (size / 1024).toFixed(2)
                };
            }
        }

        return {
            branch: this.currentBranch,
            totalSize: totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
            items: items,
            itemCount: Object.keys(items).length
        };
    }

    // Lista todas as filiais com dados
    listBranchesWithData() {
        const branchesWithData = new Set();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('branch_')) {
                const branchId = parseInt(key.split('_')[1]);
                branchesWithData.add(branchId);
            }
        }

        return Array.from(branchesWithData).map(id => branchDB.getBranchById(id));
    }
}

// Instância global
const branchIsolation = new BranchIsolation();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.branchIsolation = branchIsolation;
}

console.log('🔒 Sistema de Isolamento de Filiais Carregado!');
