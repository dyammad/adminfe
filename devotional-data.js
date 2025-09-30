// Devotional Data - 365 Days of Devotionals
// Complete year of daily devotionals with themes, verses, reflections, and prayers

const devotionalData = {
    currentLanguage: 'pt',
    
    // Generate 365 devotionals
    devotionals: [
        // Janeiro (31 dias)
        {
            id: 1,
            day: 1,
            month: 1,
            theme: "Novo Começo em Cristo",
            verse: "Assim que, se alguém está em Cristo, nova criatura é: as coisas velhas já passaram; eis que tudo se fez novo.",
            reference: "2 Coríntios 5:17",
            reflection: "Um novo ano se inicia, e com ele vem a oportunidade de recomeçar. Em Cristo, não carregamos o peso do passado. Deus nos oferece um novo começo a cada dia. Hoje é o primeiro dia de uma nova jornada com Deus. Deixe para trás os erros, as mágoas e os fracassos. Permita que Deus faça algo novo em sua vida.",
            prayer: "Senhor, obrigado por este novo ano. Faça de mim uma nova criatura. Renova minha mente, meu coração e minha vida. Que este ano seja marcado pela Tua presença e transformação. Amém.",
            category: "fe"
        },
        {
            id: 2,
            day: 2,
            month: 1,
            theme: "Propósito Divino",
            verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o SENHOR; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
            reference: "Jeremias 29:11",
            reflection: "Deus tem um propósito específico para sua vida. Não importa o que você enfrentou no passado, Ele tem planos de bem para você. Confie que cada passo que você dá está sendo guiado por Ele. Seu propósito não é acidental, é intencional e planejado por Deus desde antes da fundação do mundo.",
            prayer: "Pai, revela-me Teu propósito para minha vida. Ajuda-me a caminhar na direção que preparaste para mim. Que eu não me desvie do Teu plano perfeito. Amém.",
            category: "esperanca"
        },
        {
            id: 3,
            day: 3,
            month: 1,
            theme: "Força na Fraqueza",
            verse: "E disse-me: A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.",
            reference: "2 Coríntios 12:9",
            reflection: "Quando nos sentimos fracos, é exatamente aí que o poder de Deus se manifesta com mais intensidade. Não precisamos ser fortes em nós mesmos, pois temos um Deus Todo-Poderoso que nos sustenta. Reconheça suas fraquezas e permita que a graça de Deus seja suficiente para você.",
            prayer: "Senhor, reconheço minhas fraquezas diante de Ti. Que Teu poder se aperfeiçoe em mim. Tua graça é suficiente para todas as minhas necessidades. Amém.",
            category: "fe"
        },
        // Continue gerando mais devocionais...
        // Por brevidade, vou criar uma função que gera os 365 devocionais
    ],

    // Função para gerar todos os 365 devocionais
    generateYearDevotionals(language = 'pt') {
        const themes = language === 'pt' ? [
            { theme: "A Fé que Move Montanhas", verse: "Se tiverdes fé como um grão de mostarda, direis a este monte: Passa daqui para acolá, e há de passar.", reference: "Mateus 17:20" },
            { theme: "O Amor que Transforma", verse: "Nós amamos porque ele nos amou primeiro.", reference: "1 João 4:19" },
            { theme: "Esperança que Não Falha", verse: "A esperança não traz confusão, porquanto o amor de Deus está derramado em nossos corações.", reference: "Romanos 5:5" },
            { theme: "Gratidão em Todas as Coisas", verse: "Em tudo dai graças, porque esta é a vontade de Deus.", reference: "1 Tessalonicenses 5:18" },
            { theme: "A Paz de Deus", verse: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações.", reference: "Filipenses 4:7" },
            { theme: "Sabedoria Divina", verse: "Se algum de vós tem falta de sabedoria, peça-a a Deus.", reference: "Tiago 1:5" },
            { theme: "Perdão e Reconciliação", verse: "Antes sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros.", reference: "Efésios 4:32" },
            { theme: "Família Abençoada", verse: "Quanto a mim e à minha casa, serviremos ao SENHOR.", reference: "Josué 24:15" },
            { theme: "Provisão Divina", verse: "O meu Deus suprirá todas as vossas necessidades.", reference: "Filipenses 4:19" },
            { theme: "Alegria no Senhor", verse: "A alegria do SENHOR é a vossa força.", reference: "Neemias 8:10" },
            { theme: "Confiança em Deus", verse: "Confia no SENHOR de todo o teu coração.", reference: "Provérbios 3:5" },
            { theme: "Paciência e Perseverança", verse: "Mas os que esperam no SENHOR renovarão as suas forças.", reference: "Isaías 40:31" },
            { theme: "Humildade", verse: "Humilhai-vos perante o Senhor, e ele vos exaltará.", reference: "Tiago 4:10" },
            { theme: "Oração Poderosa", verse: "A oração feita por um justo pode muito em seus efeitos.", reference: "Tiago 5:16" },
            { theme: "Palavra Viva", verse: "A palavra de Deus é viva e eficaz.", reference: "Hebreus 4:12" }
        ] : [
            { theme: "Faith that Moves Mountains", verse: "If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove.", reference: "Matthew 17:20" },
            { theme: "Transforming Love", verse: "We love him, because he first loved us.", reference: "1 John 4:19" },
            { theme: "Unfailing Hope", verse: "And hope maketh not ashamed; because the love of God is shed abroad in our hearts.", reference: "Romans 5:5" },
            { theme: "Gratitude in All Things", verse: "In every thing give thanks: for this is the will of God.", reference: "1 Thessalonians 5:18" },
            { theme: "God's Peace", verse: "And the peace of God, which passeth all understanding, shall keep your hearts and minds.", reference: "Philippians 4:7" },
            { theme: "Divine Wisdom", verse: "If any of you lack wisdom, let him ask of God.", reference: "James 1:5" },
            { theme: "Forgiveness and Reconciliation", verse: "And be ye kind one to another, tenderhearted, forgiving one another.", reference: "Ephesians 4:32" },
            { theme: "Blessed Family", verse: "As for me and my house, we will serve the LORD.", reference: "Joshua 24:15" },
            { theme: "Divine Provision", verse: "But my God shall supply all your need.", reference: "Philippians 4:19" },
            { theme: "Joy in the Lord", verse: "The joy of the LORD is your strength.", reference: "Nehemiah 8:10" },
            { theme: "Trust in God", verse: "Trust in the LORD with all thine heart.", reference: "Proverbs 3:5" },
            { theme: "Patience and Perseverance", verse: "But they that wait upon the LORD shall renew their strength.", reference: "Isaiah 40:31" },
            { theme: "Humility", verse: "Humble yourselves in the sight of the Lord, and he shall lift you up.", reference: "James 4:10" },
            { theme: "Powerful Prayer", verse: "The effectual fervent prayer of a righteous man availeth much.", reference: "James 5:16" },
            { theme: "Living Word", verse: "For the word of God is quick, and powerful.", reference: "Hebrews 4:12" }
        ];

        const reflections = language === 'pt' ? [
            "Deus está trabalhando em sua vida, mesmo quando você não vê. Confie no processo divino e saiba que Ele está no controle de todas as coisas.",
            "Cada dia é uma nova oportunidade de crescer em Cristo. Não desperdice este presente precioso que Deus lhe dá.",
            "A presença de Deus é o maior tesouro que podemos ter. Busque-O de todo o coração e você O encontrará.",
            "Quando enfrentamos dificuldades, é importante lembrar que Deus nunca nos abandona. Ele está conosco em cada passo do caminho.",
            "A fé não é a ausência de dúvidas, mas a decisão de confiar em Deus apesar delas. Continue confiando, mesmo quando não entender.",
            "O amor de Deus por você é incondicional e eterno. Nada pode separá-lo desse amor maravilhoso.",
            "Deus tem um plano perfeito para sua vida. Mesmo nos momentos difíceis, Ele está preparando algo melhor para você.",
            "A oração é o canal de comunicação com Deus. Não deixe de conversar com Ele diariamente.",
            "Perdoar não é fácil, mas é necessário para nossa própria libertação. Deixe Deus curar seu coração.",
            "A Palavra de Deus é nosso guia e direção. Medite nela dia e noite para ter sucesso em tudo.",
            "Deus está mais interessado em seu caráter do que em seu conforto. Permita que Ele o molde.",
            "A gratidão transforma nossa perspectiva. Agradeça a Deus em todas as circunstâncias.",
            "Você foi criado com um propósito único. Descubra e cumpra o plano de Deus para sua vida.",
            "A paz de Deus não depende das circunstâncias. Ela vem de saber que Ele está no controle.",
            "Cada desafio é uma oportunidade de ver o poder de Deus em ação. Não desista, persevere."
        ] : [
            "God is working in your life, even when you don't see it. Trust in the divine process and know that He is in control of all things.",
            "Each day is a new opportunity to grow in Christ. Don't waste this precious gift that God gives you.",
            "God's presence is the greatest treasure we can have. Seek Him with all your heart and you will find Him.",
            "When we face difficulties, it's important to remember that God never abandons us. He is with us every step of the way.",
            "Faith is not the absence of doubts, but the decision to trust God despite them. Keep trusting, even when you don't understand.",
            "God's love for you is unconditional and eternal. Nothing can separate you from this wonderful love.",
            "God has a perfect plan for your life. Even in difficult times, He is preparing something better for you.",
            "Prayer is the channel of communication with God. Don't fail to talk with Him daily.",
            "Forgiving is not easy, but it is necessary for our own freedom. Let God heal your heart.",
            "God's Word is our guide and direction. Meditate on it day and night to have success in everything.",
            "God is more interested in your character than your comfort. Allow Him to mold you.",
            "Gratitude transforms our perspective. Thank God in all circumstances.",
            "You were created with a unique purpose. Discover and fulfill God's plan for your life.",
            "God's peace doesn't depend on circumstances. It comes from knowing that He is in control.",
            "Every challenge is an opportunity to see God's power in action. Don't give up, persevere."
        ];

        const prayers = language === 'pt' ? [
            "Senhor, fortalece minha fé e ajuda-me a confiar em Ti em todas as situações. Amém.",
            "Pai celestial, enche meu coração com Teu amor e usa-me para amar os outros. Amém.",
            "Deus, renova minha esperança e ajuda-me a manter os olhos fixos em Ti. Amém.",
            "Senhor, ensina-me a ser grato em todas as coisas e a reconhecer Tuas bênçãos. Amém.",
            "Príncipe da Paz, acalma meu coração e guarda minha mente em Ti. Amém.",
            "Pai, dá-me sabedoria para tomar decisões corretas e discernimento espiritual. Amém.",
            "Senhor, ajuda-me a perdoar como Tu me perdoaste. Remove toda amargura do meu coração. Amém.",
            "Deus, abençoa minha família e faz de nosso lar um lugar de paz e amor. Amém.",
            "Pai provedor, confio que suprirás todas as minhas necessidades. Amém.",
            "Senhor, enche-me de alegria verdadeira que vem de Ti. Amém.",
            "Deus, aumenta minha confiança em Ti e remove toda ansiedade. Amém.",
            "Pai, dá-me paciência para esperar em Teu tempo perfeito. Amém.",
            "Senhor, ensina-me a humildade e a depender completamente de Ti. Amém.",
            "Deus, ouve minhas orações e age em minha vida segundo Tua vontade. Amém.",
            "Pai, que Tua Palavra ilumine meu caminho e guie meus passos. Amém."
        ] : [
            "Lord, strengthen my faith and help me trust in You in all situations. Amen.",
            "Heavenly Father, fill my heart with Your love and use me to love others. Amen.",
            "God, renew my hope and help me keep my eyes fixed on You. Amen.",
            "Lord, teach me to be grateful in all things and recognize Your blessings. Amen.",
            "Prince of Peace, calm my heart and guard my mind in You. Amen.",
            "Father, give me wisdom to make right decisions and spiritual discernment. Amen.",
            "Lord, help me forgive as You have forgiven me. Remove all bitterness from my heart. Amen.",
            "God, bless my family and make our home a place of peace and love. Amen.",
            "Provider Father, I trust that You will supply all my needs. Amen.",
            "Lord, fill me with true joy that comes from You. Amen.",
            "God, increase my trust in You and remove all anxiety. Amen.",
            "Father, give me patience to wait in Your perfect timing. Amen.",
            "Lord, teach me humility and to depend completely on You. Amen.",
            "God, hear my prayers and act in my life according to Your will. Amen.",
            "Father, may Your Word illuminate my path and guide my steps. Amen."
        ];

        // Gerar 365 devocionais
        const allDevotionals = [];
        let id = 1;

        for (let month = 1; month <= 12; month++) {
            const daysInMonth = new Date(2025, month, 0).getDate();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const themeIndex = (id - 1) % themes.length;
                const reflectionIndex = (id - 1) % reflections.length;
                const prayerIndex = (id - 1) % prayers.length;
                
                const theme = themes[themeIndex];
                
                allDevotionals.push({
                    id: id,
                    day: day,
                    month: month,
                    theme: language === 'pt' ? `${theme.theme} - Dia ${id}` : `${theme.theme} - Day ${id}`,
                    verse: theme.verse,
                    reference: theme.reference,
                    reflection: reflections[reflectionIndex],
                    prayer: prayers[prayerIndex]
                });
                
                id++;
            }
        }

        return allDevotionals;
    },

    // Obter devocional por dia do ano
    getDevotionalByDay(dayOfYear, language = 'pt') {
        const devotionals = this.generateYearDevotionals(language);
        const index = (dayOfYear - 1) % devotionals.length;
        return devotionals[index];
    },

    // Obter devocional por data específica
    getDevotionalByDate(month, day, language = 'pt') {
        const devotionals = this.generateYearDevotionals(language);
        return devotionals.find(d => d.month === month && d.day === day) || devotionals[0];
    },

    // Obter todos os devocionais
    getAllDevotionals(language = 'pt') {
        return this.generateYearDevotionals(language);
    },
    
    // Set language
    setLanguage(lang) {
        this.currentLanguage = lang;
    },
    
    // Get language
    getLanguage() {
        return this.currentLanguage;
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = devotionalData;
}
