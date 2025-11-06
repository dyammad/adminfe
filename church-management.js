// Church Management System

let churches = [];

// Mostrar menu apenas para administradores
function updateAdminMenuVisibility() {
    const adminMenu = document.getElementById('adminChurchMenu');
    if (!adminMenu) {
        console.log('Elemento adminChurchMenu não encontrado');
        return;
    }
    
    console.log('Verificando visibilidade do menu admin...');
    console.log('authSystem:', window.authSystem);
    console.log('currentUser:', window.authSystem?.currentUser);
    
    if (window.authSystem && window.authSystem.currentUser) {
        const user = window.authSystem.currentUser;
        console.log('User role:', user.role);
        
        if (user.role === 'admin' || user.role === 'super_admin') {
            adminMenu.style.removeProperty('display');
            adminMenu.style.display = 'list-item';
            console.log('✅ Menu admin MOSTRADO para usuário ' + user.role);
        } else {
            adminMenu.style.display = 'none';
            console.log('❌ Menu admin OCULTO - usuário não é admin ou super_admin');
        }
    } else {
        adminMenu.style.display = 'none';
        console.log('❌ Menu admin OCULTO - usuário não logado');
    }
}

// Carregar gerenciamento de igrejas
function loadChurchManagement() {
    // Verificar se o usuário é administrador
    if (!window.authSystem || !window.authSystem.currentUser) {
        alert('Acesso negado. Apenas administradores podem acessar esta funcionalidade.');
        navigateToSection('dashboard');
        return;
    }

    const user = window.authSystem.currentUser;
    if (user.role !== 'admin' && user.role !== 'super_admin') {
        alert('Acesso negado. Apenas administradores podem cadastrar igrejas.');
        navigateToSection('dashboard');
        return;
    }

    // Carregar igrejas do localStorage
    const storedChurches = localStorage.getItem('churches');
    if (storedChurches) {
        churches = JSON.parse(storedChurches);
    }

    // Carregar filiais já cadastradas do sistema
    if (window.branches && Array.isArray(window.branches)) {
        window.branches.forEach(branch => {
            // Verificar se a filial já existe na lista
            const exists = churches.find(c => c.id === 'branch_' + branch.id);
            if (!exists) {
                churches.push({
                    id: 'branch_' + branch.id,
                    name: 'Filial de ' + branch.name,
                    city: branch.city || '',
                    state: branch.state || '',
                    phone1: branch.phone || '',
                    email: branch.email || '',
                    cnpj: branch.cnpj || '',
                    street: branch.address || '',
                    neighborhood: branch.neighborhood || '',
                    country: 'BRASIL',
                    type: 'Residencial',
                    streetType: 'Rua',
                    number: '',
                    complement: '',
                    phone2: '',
                    cep: branch.cep || '',
                    principal: branch.principal || false,
                    foundationDate: branch.foundationDate || '',
                    createdAt: branch.createdAt || new Date().toISOString(),
                    fromBranch: true
                });
            }
        });
    }

    // Renderizar lista de igrejas
    renderChurchesList();

    // Adicionar event listener ao formulário
    const form = document.getElementById('churchForm');
    if (form) {
        form.addEventListener('submit', handleChurchSubmit);
    }

    // Adicionar máscaras ao CEP
    const cepInput = document.getElementById('churchCEP');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5, 8);
            }
            e.target.value = value;
        });
    }

    // Adicionar máscaras ao CNPJ
    const cnpjInput = document.getElementById('churchCNPJ');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 14) {
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }
}

function handleChurchSubmit(e) {
    e.preventDefault();

    const church = {
        id: Date.now(),
        principal: document.getElementById('churchPrincipal').checked,
        type: document.querySelector('input[name="churchType"]:checked').value,
        country: document.getElementById('churchCountry').value,
        cep: document.getElementById('churchCEP').value,
        state: document.getElementById('churchState').value,
        city: document.getElementById('churchCity').value,
        neighborhood: document.getElementById('churchNeighborhood').value,
        streetType: document.getElementById('churchStreetType').value,
        street: document.getElementById('churchStreet').value,
        number: document.getElementById('churchNumber').value,
        complement: document.getElementById('churchComplement').value,
        phone1: document.getElementById('churchPhone1').value,
        phone2: document.getElementById('churchPhone2').value,
        email: document.getElementById('churchEmail').value,
        name: document.getElementById('churchName').value,
        cnpj: document.getElementById('churchCNPJ').value,
        foundationDate: document.getElementById('churchFoundationDate').value,
        createdAt: new Date().toISOString()
    };

    churches.push(church);
    localStorage.setItem('churches', JSON.stringify(churches));

    alert('Igreja cadastrada com sucesso!');
    clearChurchForm();
    renderChurchesList();
}

function clearChurchForm() {
    document.getElementById('churchForm').reset();
}

function renderChurchesList() {
    const tbody = document.querySelector('#churchesTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (churches.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhuma igreja cadastrada</td></tr>';
        return;
    }

    churches.forEach(church => {
        const row = document.createElement('tr');
        const badge = church.fromBranch ? '<span style="background: #d1ecf1; color: #0c5460; padding: 2px 6px; border-radius: 3px; font-size: 11px; margin-left: 5px;">Filial do Sistema</span>' : '';
        row.innerHTML = `
            <td>${church.name}${badge}</td>
            <td>${church.city}/${church.state}</td>
            <td>${church.cnpj || '-'}</td>
            <td>${church.phone1 || '-'}</td>
            <td>${church.email || '-'}</td>
            <td>
                <button class="btn btn-edit" onclick="editChurch('${church.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-delete" onclick="deleteChurch('${church.id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editChurch(id) {
    // Converter para número se for timestamp
    const numId = isNaN(id) ? id : parseInt(id);
    const church = churches.find(c => c.id === numId || c.id === id);
    if (!church) return;

    // Preencher formulário com dados da igreja
    document.getElementById('churchPrincipal').checked = church.principal;
    document.querySelector(`input[name="churchType"][value="${church.type}"]`).checked = true;
    document.getElementById('churchCountry').value = church.country;
    document.getElementById('churchCEP').value = church.cep;
    document.getElementById('churchState').value = church.state;
    document.getElementById('churchCity').value = church.city;
    document.getElementById('churchNeighborhood').value = church.neighborhood;
    document.getElementById('churchStreetType').value = church.streetType;
    document.getElementById('churchStreet').value = church.street;
    document.getElementById('churchNumber').value = church.number;
    document.getElementById('churchComplement').value = church.complement;
    document.getElementById('churchPhone1').value = church.phone1;
    document.getElementById('churchPhone2').value = church.phone2;
    document.getElementById('churchEmail').value = church.email;
    document.getElementById('churchName').value = church.name;
    document.getElementById('churchCNPJ').value = church.cnpj;
    document.getElementById('churchFoundationDate').value = church.foundationDate;

    // Remover igreja antiga
    churches = churches.filter(c => c.id !== id);
    localStorage.setItem('churches', JSON.stringify(churches));

    // Scroll para o formulário
    document.getElementById('churchForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteChurch(id) {
    if (!confirm('Tem certeza que deseja excluir esta igreja?')) return;

    const numId = isNaN(id) ? id : parseInt(id);
    churches = churches.filter(c => c.id !== numId && c.id !== id);
    localStorage.setItem('churches', JSON.stringify(churches));
    renderChurchesList();
    alert('Igreja excluída com sucesso!');
}

// Inicializar verificação de menu admin ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    updateAdminMenuVisibility();
    
    // Verificar periodicamente
    setInterval(updateAdminMenuVisibility, 500);
});
