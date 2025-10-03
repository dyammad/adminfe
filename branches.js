// Define branches globally for browser access
window.branches = [
    { id: 1, name: 'Filial Principal - São Paulo' },
    { id: 2, name: 'Filial - Rio de Janeiro' },
    { id: 3, name: 'Filial - Belo Horizonte' },
    { id: 4, name: 'Filial - Salvador' },
    { id: 5, name: 'Filial - Brasília' }
];

// For Node.js compatibility (if needed)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = window.branches;
}
