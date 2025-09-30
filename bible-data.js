// Bible Data Structure - Complete Bible in Portuguese and English
// This file contains the structure and sample data for the Bible module

const bibleData = {
    currentLanguage: 'pt',
    fontSize: 16,
    
    // Bible Books Structure
    books: {
        pt: {
            old: [
                { id: 'genesis', name: 'Gênesis', abbr: 'Gn', chapters: 50 },
                { id: 'exodus', name: 'Êxodo', abbr: 'Êx', chapters: 40 },
                { id: 'leviticus', name: 'Levítico', abbr: 'Lv', chapters: 27 },
                { id: 'numbers', name: 'Números', abbr: 'Nm', chapters: 36 },
                { id: 'deuteronomy', name: 'Deuteronômio', abbr: 'Dt', chapters: 34 },
                { id: 'joshua', name: 'Josué', abbr: 'Js', chapters: 24 },
                { id: 'judges', name: 'Juízes', abbr: 'Jz', chapters: 21 },
                { id: 'ruth', name: 'Rute', abbr: 'Rt', chapters: 4 },
                { id: '1samuel', name: '1 Samuel', abbr: '1Sm', chapters: 31 },
                { id: '2samuel', name: '2 Samuel', abbr: '2Sm', chapters: 24 },
                { id: '1kings', name: '1 Reis', abbr: '1Rs', chapters: 22 },
                { id: '2kings', name: '2 Reis', abbr: '2Rs', chapters: 25 },
                { id: '1chronicles', name: '1 Crônicas', abbr: '1Cr', chapters: 29 },
                { id: '2chronicles', name: '2 Crônicas', abbr: '2Cr', chapters: 36 },
                { id: 'ezra', name: 'Esdras', abbr: 'Ed', chapters: 10 },
                { id: 'nehemiah', name: 'Neemias', abbr: 'Ne', chapters: 13 },
                { id: 'esther', name: 'Ester', abbr: 'Et', chapters: 10 },
                { id: 'job', name: 'Jó', abbr: 'Jó', chapters: 42 },
                { id: 'psalms', name: 'Salmos', abbr: 'Sl', chapters: 150 },
                { id: 'proverbs', name: 'Provérbios', abbr: 'Pv', chapters: 31 },
                { id: 'ecclesiastes', name: 'Eclesiastes', abbr: 'Ec', chapters: 12 },
                { id: 'song', name: 'Cânticos', abbr: 'Ct', chapters: 8 },
                { id: 'isaiah', name: 'Isaías', abbr: 'Is', chapters: 66 },
                { id: 'jeremiah', name: 'Jeremias', abbr: 'Jr', chapters: 52 },
                { id: 'lamentations', name: 'Lamentações', abbr: 'Lm', chapters: 5 },
                { id: 'ezekiel', name: 'Ezequiel', abbr: 'Ez', chapters: 48 },
                { id: 'daniel', name: 'Daniel', abbr: 'Dn', chapters: 12 },
                { id: 'hosea', name: 'Oséias', abbr: 'Os', chapters: 14 },
                { id: 'joel', name: 'Joel', abbr: 'Jl', chapters: 3 },
                { id: 'amos', name: 'Amós', abbr: 'Am', chapters: 9 },
                { id: 'obadiah', name: 'Obadias', abbr: 'Ob', chapters: 1 },
                { id: 'jonah', name: 'Jonas', abbr: 'Jn', chapters: 4 },
                { id: 'micah', name: 'Miquéias', abbr: 'Mq', chapters: 7 },
                { id: 'nahum', name: 'Naum', abbr: 'Na', chapters: 3 },
                { id: 'habakkuk', name: 'Habacuque', abbr: 'Hc', chapters: 3 },
                { id: 'zephaniah', name: 'Sofonias', abbr: 'Sf', chapters: 3 },
                { id: 'haggai', name: 'Ageu', abbr: 'Ag', chapters: 2 },
                { id: 'zechariah', name: 'Zacarias', abbr: 'Zc', chapters: 14 },
                { id: 'malachi', name: 'Malaquias', abbr: 'Ml', chapters: 4 }
            ],
            new: [
                { id: 'matthew', name: 'Mateus', abbr: 'Mt', chapters: 28 },
                { id: 'mark', name: 'Marcos', abbr: 'Mc', chapters: 16 },
                { id: 'luke', name: 'Lucas', abbr: 'Lc', chapters: 24 },
                { id: 'john', name: 'João', abbr: 'Jo', chapters: 21 },
                { id: 'acts', name: 'Atos', abbr: 'At', chapters: 28 },
                { id: 'romans', name: 'Romanos', abbr: 'Rm', chapters: 16 },
                { id: '1corinthians', name: '1 Coríntios', abbr: '1Co', chapters: 16 },
                { id: '2corinthians', name: '2 Coríntios', abbr: '2Co', chapters: 13 },
                { id: 'galatians', name: 'Gálatas', abbr: 'Gl', chapters: 6 },
                { id: 'ephesians', name: 'Efésios', abbr: 'Ef', chapters: 6 },
                { id: 'philippians', name: 'Filipenses', abbr: 'Fp', chapters: 4 },
                { id: 'colossians', name: 'Colossenses', abbr: 'Cl', chapters: 4 },
                { id: '1thessalonians', name: '1 Tessalonicenses', abbr: '1Ts', chapters: 5 },
                { id: '2thessalonians', name: '2 Tessalonicenses', abbr: '2Ts', chapters: 3 },
                { id: '1timothy', name: '1 Timóteo', abbr: '1Tm', chapters: 6 },
                { id: '2timothy', name: '2 Timóteo', abbr: '2Tm', chapters: 4 },
                { id: 'titus', name: 'Tito', abbr: 'Tt', chapters: 3 },
                { id: 'philemon', name: 'Filemom', abbr: 'Fm', chapters: 1 },
                { id: 'hebrews', name: 'Hebreus', abbr: 'Hb', chapters: 13 },
                { id: 'james', name: 'Tiago', abbr: 'Tg', chapters: 5 },
                { id: '1peter', name: '1 Pedro', abbr: '1Pe', chapters: 5 },
                { id: '2peter', name: '2 Pedro', abbr: '2Pe', chapters: 3 },
                { id: '1john', name: '1 João', abbr: '1Jo', chapters: 5 },
                { id: '2john', name: '2 João', abbr: '2Jo', chapters: 1 },
                { id: '3john', name: '3 João', abbr: '3Jo', chapters: 1 },
                { id: 'jude', name: 'Judas', abbr: 'Jd', chapters: 1 },
                { id: 'revelation', name: 'Apocalipse', abbr: 'Ap', chapters: 22 }
            ]
        },
        en: {
            old: [
                { id: 'genesis', name: 'Genesis', abbr: 'Gen', chapters: 50 },
                { id: 'exodus', name: 'Exodus', abbr: 'Exo', chapters: 40 },
                { id: 'leviticus', name: 'Leviticus', abbr: 'Lev', chapters: 27 },
                { id: 'numbers', name: 'Numbers', abbr: 'Num', chapters: 36 },
                { id: 'deuteronomy', name: 'Deuteronomy', abbr: 'Deu', chapters: 34 },
                { id: 'joshua', name: 'Joshua', abbr: 'Jos', chapters: 24 },
                { id: 'judges', name: 'Judges', abbr: 'Jdg', chapters: 21 },
                { id: 'ruth', name: 'Ruth', abbr: 'Rut', chapters: 4 },
                { id: '1samuel', name: '1 Samuel', abbr: '1Sa', chapters: 31 },
                { id: '2samuel', name: '2 Samuel', abbr: '2Sa', chapters: 24 },
                { id: '1kings', name: '1 Kings', abbr: '1Ki', chapters: 22 },
                { id: '2kings', name: '2 Kings', abbr: '2Ki', chapters: 25 },
                { id: '1chronicles', name: '1 Chronicles', abbr: '1Ch', chapters: 29 },
                { id: '2chronicles', name: '2 Chronicles', abbr: '2Ch', chapters: 36 },
                { id: 'ezra', name: 'Ezra', abbr: 'Ezr', chapters: 10 },
                { id: 'nehemiah', name: 'Nehemiah', abbr: 'Neh', chapters: 13 },
                { id: 'esther', name: 'Esther', abbr: 'Est', chapters: 10 },
                { id: 'job', name: 'Job', abbr: 'Job', chapters: 42 },
                { id: 'psalms', name: 'Psalms', abbr: 'Psa', chapters: 150 },
                { id: 'proverbs', name: 'Proverbs', abbr: 'Pro', chapters: 31 },
                { id: 'ecclesiastes', name: 'Ecclesiastes', abbr: 'Ecc', chapters: 12 },
                { id: 'song', name: 'Song of Solomon', abbr: 'SoS', chapters: 8 },
                { id: 'isaiah', name: 'Isaiah', abbr: 'Isa', chapters: 66 },
                { id: 'jeremiah', name: 'Jeremiah', abbr: 'Jer', chapters: 52 },
                { id: 'lamentations', name: 'Lamentations', abbr: 'Lam', chapters: 5 },
                { id: 'ezekiel', name: 'Ezekiel', abbr: 'Eze', chapters: 48 },
                { id: 'daniel', name: 'Daniel', abbr: 'Dan', chapters: 12 },
                { id: 'hosea', name: 'Hosea', abbr: 'Hos', chapters: 14 },
                { id: 'joel', name: 'Joel', abbr: 'Joe', chapters: 3 },
                { id: 'amos', name: 'Amos', abbr: 'Amo', chapters: 9 },
                { id: 'obadiah', name: 'Obadiah', abbr: 'Oba', chapters: 1 },
                { id: 'jonah', name: 'Jonah', abbr: 'Jon', chapters: 4 },
                { id: 'micah', name: 'Micah', abbr: 'Mic', chapters: 7 },
                { id: 'nahum', name: 'Nahum', abbr: 'Nah', chapters: 3 },
                { id: 'habakkuk', name: 'Habakkuk', abbr: 'Hab', chapters: 3 },
                { id: 'zephaniah', name: 'Zephaniah', abbr: 'Zep', chapters: 3 },
                { id: 'haggai', name: 'Haggai', abbr: 'Hag', chapters: 2 },
                { id: 'zechariah', name: 'Zechariah', abbr: 'Zec', chapters: 14 },
                { id: 'malachi', name: 'Malachi', abbr: 'Mal', chapters: 4 }
            ],
            new: [
                { id: 'matthew', name: 'Matthew', abbr: 'Mat', chapters: 28 },
                { id: 'mark', name: 'Mark', abbr: 'Mar', chapters: 16 },
                { id: 'luke', name: 'Luke', abbr: 'Luk', chapters: 24 },
                { id: 'john', name: 'John', abbr: 'Joh', chapters: 21 },
                { id: 'acts', name: 'Acts', abbr: 'Act', chapters: 28 },
                { id: 'romans', name: 'Romans', abbr: 'Rom', chapters: 16 },
                { id: '1corinthians', name: '1 Corinthians', abbr: '1Co', chapters: 16 },
                { id: '2corinthians', name: '2 Corinthians', abbr: '2Co', chapters: 13 },
                { id: 'galatians', name: 'Galatians', abbr: 'Gal', chapters: 6 },
                { id: 'ephesians', name: 'Ephesians', abbr: 'Eph', chapters: 6 },
                { id: 'philippians', name: 'Philippians', abbr: 'Php', chapters: 4 },
                { id: 'colossians', name: 'Colossians', abbr: 'Col', chapters: 4 },
                { id: '1thessalonians', name: '1 Thessalonians', abbr: '1Th', chapters: 5 },
                { id: '2thessalonians', name: '2 Thessalonians', abbr: '2Th', chapters: 3 },
                { id: '1timothy', name: '1 Timothy', abbr: '1Ti', chapters: 6 },
                { id: '2timothy', name: '2 Timothy', abbr: '2Ti', chapters: 4 },
                { id: 'titus', name: 'Titus', abbr: 'Tit', chapters: 3 },
                { id: 'philemon', name: 'Philemon', abbr: 'Phm', chapters: 1 },
                { id: 'hebrews', name: 'Hebrews', abbr: 'Heb', chapters: 13 },
                { id: 'james', name: 'James', abbr: 'Jam', chapters: 5 },
                { id: '1peter', name: '1 Peter', abbr: '1Pe', chapters: 5 },
                { id: '2peter', name: '2 Peter', abbr: '2Pe', chapters: 3 },
                { id: '1john', name: '1 John', abbr: '1Jo', chapters: 5 },
                { id: '2john', name: '2 John', abbr: '2Jo', chapters: 1 },
                { id: '3john', name: '3 John', abbr: '3Jo', chapters: 1 },
                { id: 'jude', name: 'Jude', abbr: 'Jud', chapters: 1 },
                { id: 'revelation', name: 'Revelation', abbr: 'Rev', chapters: 22 }
            ]
        }
    },

    // Sample verses - In production, this would be loaded from an API or database
    // For demonstration, including key passages
    verses: {
        pt: {
            'genesis-1': [
                { verse: 1, text: 'No princípio, criou Deus os céus e a terra.' },
                { verse: 2, text: 'E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.' },
                { verse: 3, text: 'E disse Deus: Haja luz. E houve luz.' },
                { verse: 4, text: 'E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas.' },
                { verse: 5, text: 'E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã: o dia primeiro.' }
                // ... more verses would be loaded dynamically
            ],
            'john-3': [
                { verse: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
                { verse: 17, text: 'Porque Deus enviou o seu Filho ao mundo não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' }
            ],
            'psalms-23': [
                { verse: 1, text: 'O SENHOR é o meu pastor; nada me faltará.' },
                { verse: 2, text: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.' },
                { verse: 3, text: 'Refrigera a minha alma; guia-me pelas veredas da justiça por amor do seu nome.' },
                { verse: 4, text: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
                { verse: 5, text: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.' },
                { verse: 6, text: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na Casa do SENHOR por longos dias.' }
            ]
        },
        en: {
            'genesis-1': [
                { verse: 1, text: 'In the beginning God created the heaven and the earth.' },
                { verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
                { verse: 3, text: 'And God said, Let there be light: and there was light.' },
                { verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
                { verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' }
            ],
            'john-3': [
                { verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
                { verse: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' }
            ],
            'psalms-23': [
                { verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
                { verse: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
                { verse: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.' },
                { verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
                { verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
                { verse: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' }
            ]
        }
    },

    // Daily verses collection
    dailyVerses: {
        pt: [
            { text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', reference: 'João 3:16' },
            { text: 'O SENHOR é o meu pastor; nada me faltará.', reference: 'Salmos 23:1' },
            { text: 'Confia no SENHOR de todo o teu coração e não te estribes no teu próprio entendimento.', reference: 'Provérbios 3:5' },
            { text: 'Tudo posso naquele que me fortalece.', reference: 'Filipenses 4:13' },
            { text: 'Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.', reference: 'Mateus 18:20' }
        ],
        en: [
            { text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', reference: 'John 3:16' },
            { text: 'The LORD is my shepherd; I shall not want.', reference: 'Psalms 23:1' },
            { text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.', reference: 'Proverbs 3:5' },
            { text: 'I can do all things through Christ which strengtheneth me.', reference: 'Philippians 4:13' },
            { text: 'For where two or three are gathered together in my name, there am I in the midst of them.', reference: 'Matthew 18:20' }
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = bibleData;
}
