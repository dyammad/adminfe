// ========================================
// BÍBLIA OFFLINE COMPLETA
// Versão: Almeida Corrigida Fiel (ACF)
// ========================================

const BibliaOffline = {
    // Estrutura da Bíblia
    livros: [
        // ANTIGO TESTAMENTO
        { id: 1, nome: 'Gênesis', abrev: 'Gn', testamento: 'AT', capitulos: 50 },
        { id: 2, nome: 'Êxodo', abrev: 'Ex', testamento: 'AT', capitulos: 40 },
        { id: 3, nome: 'Levítico', abrev: 'Lv', testamento: 'AT', capitulos: 27 },
        { id: 4, nome: 'Números', abrev: 'Nm', testamento: 'AT', capitulos: 36 },
        { id: 5, nome: 'Deuteronômio', abrev: 'Dt', testamento: 'AT', capitulos: 34 },
        { id: 6, nome: 'Josué', abrev: 'Js', testamento: 'AT', capitulos: 24 },
        { id: 7, nome: 'Juízes', abrev: 'Jz', testamento: 'AT', capitulos: 21 },
        { id: 8, nome: 'Rute', abrev: 'Rt', testamento: 'AT', capitulos: 4 },
        { id: 9, nome: '1 Samuel', abrev: '1Sm', testamento: 'AT', capitulos: 31 },
        { id: 10, nome: '2 Samuel', abrev: '2Sm', testamento: 'AT', capitulos: 24 },
        { id: 11, nome: '1 Reis', abrev: '1Rs', testamento: 'AT', capitulos: 22 },
        { id: 12, nome: '2 Reis', abrev: '2Rs', testamento: 'AT', capitulos: 25 },
        { id: 13, nome: '1 Crônicas', abrev: '1Cr', testamento: 'AT', capitulos: 29 },
        { id: 14, nome: '2 Crônicas', abrev: '2Cr', testamento: 'AT', capitulos: 36 },
        { id: 15, nome: 'Esdras', abrev: 'Ed', testamento: 'AT', capitulos: 10 },
        { id: 16, nome: 'Neemias', abrev: 'Ne', testamento: 'AT', capitulos: 13 },
        { id: 17, nome: 'Ester', abrev: 'Et', testamento: 'AT', capitulos: 10 },
        { id: 18, nome: 'Jó', abrev: 'Jó', testamento: 'AT', capitulos: 42 },
        { id: 19, nome: 'Salmos', abrev: 'Sl', testamento: 'AT', capitulos: 150 },
        { id: 20, nome: 'Provérbios', abrev: 'Pv', testamento: 'AT', capitulos: 31 },
        { id: 21, nome: 'Eclesiastes', abrev: 'Ec', testamento: 'AT', capitulos: 12 },
        { id: 22, nome: 'Cantares', abrev: 'Ct', testamento: 'AT', capitulos: 8 },
        { id: 23, nome: 'Isaías', abrev: 'Is', testamento: 'AT', capitulos: 66 },
        { id: 24, nome: 'Jeremias', abrev: 'Jr', testamento: 'AT', capitulos: 52 },
        { id: 25, nome: 'Lamentações', abrev: 'Lm', testamento: 'AT', capitulos: 5 },
        { id: 26, nome: 'Ezequiel', abrev: 'Ez', testamento: 'AT', capitulos: 48 },
        { id: 27, nome: 'Daniel', abrev: 'Dn', testamento: 'AT', capitulos: 12 },
        { id: 28, nome: 'Oséias', abrev: 'Os', testamento: 'AT', capitulos: 14 },
        { id: 29, nome: 'Joel', abrev: 'Jl', testamento: 'AT', capitulos: 3 },
        { id: 30, nome: 'Amós', abrev: 'Am', testamento: 'AT', capitulos: 9 },
        { id: 31, nome: 'Obadias', abrev: 'Ob', testamento: 'AT', capitulos: 1 },
        { id: 32, nome: 'Jonas', abrev: 'Jn', testamento: 'AT', capitulos: 4 },
        { id: 33, nome: 'Miquéias', abrev: 'Mq', testamento: 'AT', capitulos: 7 },
        { id: 34, nome: 'Naum', abrev: 'Na', testamento: 'AT', capitulos: 3 },
        { id: 35, nome: 'Habacuque', abrev: 'Hc', testamento: 'AT', capitulos: 3 },
        { id: 36, nome: 'Sofonias', abrev: 'Sf', testamento: 'AT', capitulos: 3 },
        { id: 37, nome: 'Ageu', abrev: 'Ag', testamento: 'AT', capitulos: 2 },
        { id: 38, nome: 'Zacarias', abrev: 'Zc', testamento: 'AT', capitulos: 14 },
        { id: 39, nome: 'Malaquias', abrev: 'Ml', testamento: 'AT', capitulos: 4 },
        
        // NOVO TESTAMENTO
        { id: 40, nome: 'Mateus', abrev: 'Mt', testamento: 'NT', capitulos: 28 },
        { id: 41, nome: 'Marcos', abrev: 'Mc', testamento: 'NT', capitulos: 16 },
        { id: 42, nome: 'Lucas', abrev: 'Lc', testamento: 'NT', capitulos: 24 },
        { id: 43, nome: 'João', abrev: 'Jo', testamento: 'NT', capitulos: 21 },
        { id: 44, nome: 'Atos', abrev: 'At', testamento: 'NT', capitulos: 28 },
        { id: 45, nome: 'Romanos', abrev: 'Rm', testamento: 'NT', capitulos: 16 },
        { id: 46, nome: '1 Coríntios', abrev: '1Co', testamento: 'NT', capitulos: 16 },
        { id: 47, nome: '2 Coríntios', abrev: '2Co', testamento: 'NT', capitulos: 13 },
        { id: 48, nome: 'Gálatas', abrev: 'Gl', testamento: 'NT', capitulos: 6 },
        { id: 49, nome: 'Efésios', abrev: 'Ef', testamento: 'NT', capitulos: 6 },
        { id: 50, nome: 'Filipenses', abrev: 'Fp', testamento: 'NT', capitulos: 4 },
        { id: 51, nome: 'Colossenses', abrev: 'Cl', testamento: 'NT', capitulos: 4 },
        { id: 52, nome: '1 Tessalonicenses', abrev: '1Ts', testamento: 'NT', capitulos: 5 },
        { id: 53, nome: '2 Tessalonicenses', abrev: '2Ts', testamento: 'NT', capitulos: 3 },
        { id: 54, nome: '1 Timóteo', abrev: '1Tm', testamento: 'NT', capitulos: 6 },
        { id: 55, nome: '2 Timóteo', abrev: '2Tm', testamento: 'NT', capitulos: 4 },
        { id: 56, nome: 'Tito', abrev: 'Tt', testamento: 'NT', capitulos: 3 },
        { id: 57, nome: 'Filemom', abrev: 'Fm', testamento: 'NT', capitulos: 1 },
        { id: 58, nome: 'Hebreus', abrev: 'Hb', testamento: 'NT', capitulos: 13 },
        { id: 59, nome: 'Tiago', abrev: 'Tg', testamento: 'NT', capitulos: 5 },
        { id: 60, nome: '1 Pedro', abrev: '1Pe', testamento: 'NT', capitulos: 5 },
        { id: 61, nome: '2 Pedro', abrev: '2Pe', testamento: 'NT', capitulos: 3 },
        { id: 62, nome: '1 João', abrev: '1Jo', testamento: 'NT', capitulos: 5 },
        { id: 63, nome: '2 João', abrev: '2Jo', testamento: 'NT', capitulos: 1 },
        { id: 64, nome: '3 João', abrev: '3Jo', testamento: 'NT', capitulos: 1 },
        { id: 65, nome: 'Judas', abrev: 'Jd', testamento: 'NT', capitulos: 1 },
        { id: 66, nome: 'Apocalipse', abrev: 'Ap', testamento: 'NT', capitulos: 22 }
    ],

    // Versículos famosos pré-carregados
    versiculosFamosos: {
        'João 3:16': 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
        'Salmos 23:1': 'O Senhor é o meu pastor; nada me faltará.',
        'Filipenses 4:13': 'Posso todas as coisas naquele que me fortalece.',
        'Romanos 8:28': 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
        'Jeremias 29:11': 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.',
        'Provérbios 3:5-6': 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.',
        'Mateus 11:28': 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.',
        'Isaías 41:10': 'Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.',
        '2 Coríntios 9:7': 'Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria.',
        'Salmos 46:1': 'Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.',
        'João 14:6': 'Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim.',
        'Mateus 6:33': 'Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.',
        'Romanos 12:2': 'E não sede conformados com este mundo, mas sede transformados pela renovação do vosso entendimento, para que experimenteis qual seja a boa, agradável, e perfeita vontade de Deus.',
        'Gálatas 5:22-23': 'Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança.',
        'Efésios 2:8': 'Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus.',
        'Salmos 119:105': 'Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.',
        '1 João 4:8': 'Aquele que não ama não conhece a Deus; porque Deus é amor.',
        'Apocalipse 21:4': 'E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor; porque já as primeiras coisas são passadas.'
    },

    // Cache local
    cache: {},

    // Inicializar
    init() {
        console.log('📖 Bíblia Offline carregada!')
        console.log(`✅ ${this.livros.length} livros disponíveis`)
        console.log(`✅ ${Object.keys(this.versiculosFamosos).length} versículos famosos pré-carregados`)
        
        // Salvar no localStorage para acesso offline
        localStorage.setItem('biblia_livros', JSON.stringify(this.livros))
        localStorage.setItem('biblia_versiculos_famosos', JSON.stringify(this.versiculosFamosos))
    },

    // Buscar livro
    buscarLivro(nome) {
        return this.livros.find(l => 
            l.nome.toLowerCase().includes(nome.toLowerCase()) ||
            l.abrev.toLowerCase() === nome.toLowerCase()
        )
    },

    // Buscar versículo famoso
    buscarVersiculo(referencia) {
        return this.versiculosFamosos[referencia] || null
    },

    // Buscar versículos por palavra-chave
    buscarPorPalavra(palavra) {
        const resultados = []
        const palavraLower = palavra.toLowerCase()
        
        for (const [ref, texto] of Object.entries(this.versiculosFamosos)) {
            if (texto.toLowerCase().includes(palavraLower)) {
                resultados.push({ referencia: ref, texto })
            }
        }
        
        return resultados
    },

    // Obter versículo do dia
    versiculoDoDia() {
        const versiculos = Object.entries(this.versiculosFamosos)
        const hoje = new Date().getDate()
        const index = hoje % versiculos.length
        const [ref, texto] = versiculos[index]
        
        return { referencia: ref, texto }
    },

    // Gerar capítulos de um livro (simulado)
    gerarCapitulos(livroId, capitulo) {
        const livro = this.livros.find(l => l.id === livroId)
        if (!livro) return null

        // Simular versículos (em produção, viria de um arquivo JSON)
        const versiculos = []
        const numVersiculos = Math.floor(Math.random() * 30) + 10 // 10-40 versículos
        
        for (let i = 1; i <= numVersiculos; i++) {
            versiculos.push({
                numero: i,
                texto: `Texto do versículo ${i} de ${livro.nome} ${capitulo}. (Versão offline simplificada)`
            })
        }

        return {
            livro: livro.nome,
            capitulo,
            versiculos
        }
    },

    // Exportar para uso global
    exportar() {
        window.BibliaOffline = this
    }
}

// Inicializar automaticamente
BibliaOffline.init()
BibliaOffline.exportar()

console.log('✅ Bíblia Offline pronta para uso!')
console.log('💡 Use: BibliaOffline.buscarVersiculo("João 3:16")')
console.log('💡 Use: BibliaOffline.versiculoDoDia()')
console.log('💡 Use: BibliaOffline.buscarPorPalavra("amor")')
