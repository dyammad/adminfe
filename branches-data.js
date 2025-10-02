// ============================================
// BANCO DE DADOS DE 300 FILIAIS
// Sistema Multi-Filial com Isolamento Completo
// ============================================

class BranchDatabase {
    constructor() {
        this.branches = this.generateBranches();
        this.initializeBranches();
    }

    // Gera 300 filiais automaticamente
    generateBranches() {
        const branches = [];
        const states = [
            { uf: 'SP', name: 'São Paulo', cities: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'] },
            { uf: 'RJ', name: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Petrópolis'] },
            { uf: 'MG', name: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'] },
            { uf: 'RS', name: 'Rio Grande do Sul', cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'] },
            { uf: 'BA', name: 'Bahia', cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna'] },
            { uf: 'PR', name: 'Paraná', cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'] },
            { uf: 'PE', name: 'Pernambuco', cities: ['Recife', 'Jaboatão', 'Olinda', 'Caruaru', 'Petrolina'] },
            { uf: 'CE', name: 'Ceará', cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'] },
            { uf: 'PA', name: 'Pará', cities: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Castanhal'] },
            { uf: 'SC', name: 'Santa Catarina', cities: ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma'] },
            { uf: 'GO', name: 'Goiás', cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia'] },
            { uf: 'MA', name: 'Maranhão', cities: ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias'] },
            { uf: 'ES', name: 'Espírito Santo', cities: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Linhares'] },
            { uf: 'PB', name: 'Paraíba', cities: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux'] },
            { uf: 'AM', name: 'Amazonas', cities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'] },
            { uf: 'RN', name: 'Rio Grande do Norte', cities: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo', 'Macaíba'] },
            { uf: 'MT', name: 'Mato Grosso', cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra'] },
            { uf: 'AL', name: 'Alagoas', cities: ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'União dos Palmares'] },
            { uf: 'PI', name: 'Piauí', cities: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano'] },
            { uf: 'DF', name: 'Distrito Federal', cities: ['Brasília', 'Taguatinga', 'Ceilândia', 'Samambaia', 'Planaltina'] }
        ];

        const regions = ['Centro', 'Norte', 'Sul', 'Leste', 'Oeste'];
        let branchId = 1;

        // Distribuir 300 filiais pelos estados
        const branchesPerState = Math.floor(300 / states.length);
        const remainder = 300 % states.length;

        states.forEach((state, stateIndex) => {
            const numBranches = branchesPerState + (stateIndex < remainder ? 1 : 0);
            
            for (let i = 0; i < numBranches; i++) {
                const city = state.cities[i % state.cities.length];
                const region = regions[i % regions.length];
                const branchNumber = Math.floor(i / state.cities.length) + 1;
                
                const branchCode = `BR${String(branchId).padStart(4, '0')}`;
                const branchName = branchNumber > 1 
                    ? `Igreja ${city} - ${region} ${branchNumber}`
                    : `Igreja ${city} - ${region}`;

                branches.push({
                    id: branchId,
                    code: branchCode,
                    name: branchName,
                    city: city,
                    state: state.name,
                    stateUF: state.uf,
                    region: region,
                    address: `Rua da Igreja, ${100 + branchId}`,
                    neighborhood: `Bairro ${region}`,
                    zipCode: `${10000 + branchId}-000`,
                    phone: `(${10 + stateIndex}) ${3000 + branchId}-${1000 + (branchId % 9000)}`,
                    email: `${branchCode.toLowerCase()}@igreja.com.br`,
                    pastor: `Pastor ${this.generatePastorName()}`,
                    foundedDate: this.generateFoundedDate(),
                    active: true,
                    memberCount: Math.floor(Math.random() * 500) + 50,
                    createdAt: new Date().toISOString(),
                    settings: {
                        timezone: 'America/Sao_Paulo',
                        currency: 'BRL',
                        language: 'pt-BR',
                        theme: 'default'
                    }
                });

                branchId++;
            }
        });

        return branches;
    }

    // Gera nome de pastor aleatório
    generatePastorName() {
        const firstNames = ['João', 'Pedro', 'Paulo', 'Marcos', 'Lucas', 'Mateus', 'Tiago', 'José', 'Daniel', 'Samuel', 
                           'David', 'Elias', 'Josué', 'Moisés', 'Abraão', 'Isaac', 'Jacó', 'Benjamim', 'Calebe', 'Gideão'];
        const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Ferreira', 'Costa', 'Rodrigues', 'Almeida', 'Nascimento',
                          'Araújo', 'Ribeiro', 'Carvalho', 'Gomes', 'Martins', 'Rocha', 'Dias', 'Castro', 'Barbosa', 'Cardoso'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        return `${firstName} ${lastName}`;
    }

    // Gera data de fundação aleatória
    generateFoundedDate() {
        const year = 1990 + Math.floor(Math.random() * 35); // 1990-2024
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // Inicializa filiais no LocalStorage
    initializeBranches() {
        const existingBranches = localStorage.getItem('churchBranches');
        if (!existingBranches) {
            localStorage.setItem('churchBranches', JSON.stringify(this.branches));
            console.log('✅ 300 filiais inicializadas com sucesso!');
        } else {
            this.branches = JSON.parse(existingBranches);
            console.log('✅ Filiais carregadas do LocalStorage');
        }
    }

    // Busca todas as filiais
    getAllBranches() {
        return this.branches;
    }

    // Busca filial por ID
    getBranchById(branchId) {
        return this.branches.find(b => b.id === parseInt(branchId));
    }

    // Busca filial por código
    getBranchByCode(code) {
        return this.branches.find(b => b.code === code);
    }

    // Busca filiais por estado
    getBranchesByState(stateUF) {
        return this.branches.filter(b => b.stateUF === stateUF);
    }

    // Busca filiais por cidade
    getBranchesByCity(city) {
        return this.branches.filter(b => b.city === city);
    }

    // Busca filiais ativas
    getActiveBranches() {
        return this.branches.filter(b => b.active);
    }

    // Atualiza filial
    updateBranch(branchId, updates) {
        const index = this.branches.findIndex(b => b.id === parseInt(branchId));
        if (index !== -1) {
            this.branches[index] = { ...this.branches[index], ...updates };
            localStorage.setItem('churchBranches', JSON.stringify(this.branches));
            return this.branches[index];
        }
        return null;
    }

    // Adiciona nova filial
    addBranch(branchData) {
        const newId = Math.max(...this.branches.map(b => b.id)) + 1;
        const newBranch = {
            id: newId,
            code: `BR${String(newId).padStart(4, '0')}`,
            ...branchData,
            active: true,
            createdAt: new Date().toISOString()
        };
        this.branches.push(newBranch);
        localStorage.setItem('churchBranches', JSON.stringify(this.branches));
        return newBranch;
    }

    // Desativa filial
    deactivateBranch(branchId) {
        return this.updateBranch(branchId, { active: false });
    }

    // Estatísticas
    getStatistics() {
        return {
            total: this.branches.length,
            active: this.branches.filter(b => b.active).length,
            inactive: this.branches.filter(b => !b.active).length,
            byState: this.getByStateStats(),
            totalMembers: this.branches.reduce((sum, b) => sum + b.memberCount, 0)
        };
    }

    getByStateStats() {
        const stats = {};
        this.branches.forEach(branch => {
            if (!stats[branch.stateUF]) {
                stats[branch.stateUF] = {
                    state: branch.state,
                    count: 0,
                    members: 0
                };
            }
            stats[branch.stateUF].count++;
            stats[branch.stateUF].members += branch.memberCount;
        });
        return stats;
    }

    // Busca com filtros
    searchBranches(filters) {
        let results = this.branches;

        if (filters.search) {
            const search = filters.search.toLowerCase();
            results = results.filter(b => 
                b.name.toLowerCase().includes(search) ||
                b.code.toLowerCase().includes(search) ||
                b.city.toLowerCase().includes(search) ||
                b.pastor.toLowerCase().includes(search)
            );
        }

        if (filters.state) {
            results = results.filter(b => b.stateUF === filters.state);
        }

        if (filters.city) {
            results = results.filter(b => b.city === filters.city);
        }

        if (filters.active !== undefined) {
            results = results.filter(b => b.active === filters.active);
        }

        return results;
    }
}

// Instância global
const branchDB = new BranchDatabase();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.branchDB = branchDB;
}

console.log('🏢 Sistema de Filiais Carregado!');
console.log(`📊 Total de Filiais: ${branchDB.branches.length}`);
