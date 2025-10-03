// Function to populate the branch selection dropdown
window.populateBranchSelect = function(selectElementId) {
    console.log('populateBranchSelect chamada para:', selectElementId);
    const select = document.getElementById(selectElementId);
    console.log('Elemento select encontrado:', select);
    console.log('window.branches disponível:', window.branches);
    
    // Ensure branches are loaded and the dropdown is not already populated
    if (select && window.branches) {
        // Limpar opções existentes primeiro (exceto a primeira se houver)
        while (select.options.length > 0) {
            select.remove(0);
        }
        
        // Adicionar opção padrão (obrigatória)
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione uma filial *';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);
        
        // Adicionar filiais
        window.branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.id;
            option.textContent = branch.name;
            select.appendChild(option);
        });
        console.log('Filiais adicionadas ao dropdown:', window.branches.length);
    } else {
        console.error('Não foi possível popular o dropdown. Select:', select, 'Branches:', window.branches);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');


    // Nota: O login e registro são gerenciados pelo auth-system.js e script.js
    // Este arquivo apenas popula a lista de filiais no cadastro
});
