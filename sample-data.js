// Sample data for Church Management System
// 400 members and 30 ministries

// Sample data generation functions
function generateSampleData() {
    const firstNames = [
        'João', 'Maria', 'José', 'Ana', 'Pedro', 'Francisca', 'Antonio', 'Antonia', 'Marcos', 'Marcia',
        'Francisco', 'Adriana', 'Carlos', 'Juliana', 'Paulo', 'Luciana', 'Daniel', 'Fernanda', 'Rafael', 'Patricia',
        'Lucas', 'Aline', 'Mateus', 'Cristina', 'Felipe', 'Vanessa', 'Gabriel', 'Simone', 'Bruno', 'Priscila',
        'Diego', 'Camila', 'Rodrigo', 'Leticia', 'Thiago', 'Renata', 'Leonardo', 'Monica', 'Gustavo', 'Sandra',
        'Eduardo', 'Claudia', 'Ricardo', 'Silvia', 'Fernando', 'Vera', 'Marcelo', 'Regina', 'Andre', 'Lucia',
        'Roberto', 'Eliane', 'Fabio', 'Rosana', 'Vinicius', 'Denise', 'Alexandre', 'Carla', 'Leandro', 'Tatiana',
        'Sergio', 'Viviane', 'Henrique', 'Solange', 'Cesar', 'Fatima', 'Renato', 'Angela', 'Claudio', 'Marisa',
        'Edson', 'Rosangela', 'Nelson', 'Sonia', 'Wilson', 'Aparecida', 'Joao', 'Conceicao', 'Luiz', 'Terezinha'
    ];

    const lastNames = [
        'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
        'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa',
        'Rocha', 'Dias', 'Monteiro', 'Cardoso', 'Reis', 'Araujo', 'Cavalcanti', 'Nascimento', 'Moreira', 'Freitas',
        'Pinto', 'Mendes', 'Castro', 'Moura', 'Cunha', 'Pires', 'Ramos', 'Nunes', 'Teixeira', 'Correia',
        'Machado', 'Farias', 'Brito', 'Santana', 'Campos', 'Duarte', 'Miranda', 'Fonseca', 'Batista', 'Melo'
    ];

    const streets = [
        'Rua das Flores', 'Av. Paulista', 'Rua Augusta', 'Rua da Consolação', 'Av. Brasil', 'Rua São João',
        'Av. Ipiranga', 'Rua Liberdade', 'Rua Oscar Freire', 'Av. Faria Lima', 'Rua Teodoro Sampaio',
        'Av. Rebouças', 'Rua Haddock Lobo', 'Av. Angélica', 'Rua Bela Cintra', 'Rua Estados Unidos',
        'Av. Europa', 'Rua Pamplona', 'Av. Nove de Julho', 'Rua Alameda Santos', 'Rua Cardeal Arcoverde',
        'Av. Brigadeiro Faria Lima', 'Rua Pedroso Alvarenga', 'Av. Santo Amaro', 'Rua Funchal'
    ];

    const neighborhoods = [
        'Centro', 'Vila Madalena', 'Pinheiros', 'Jardins', 'Moema', 'Vila Olímpia', 'Itaim Bibi',
        'Brooklin', 'Campo Belo', 'Santo Amaro', 'Perdizes', 'Higienópolis', 'Liberdade',
        'Bela Vista', 'Consolação', 'Santa Cecília', 'Barra Funda', 'Lapa', 'Vila Leopoldina',
        'Morumbi', 'Butantã', 'Cidade Universitária', 'Vila Sônia', 'Campo Limpo'
    ];

    const cellNames = [
        'Célula Esperança', 'Célula Fé', 'Célula Amor', 'Célula Paz', 'Célula Alegria',
        'Célula Vitória', 'Célula Graça', 'Célula Luz', 'Célula Vida', 'Célula União',
        'Célula Renovação', 'Célula Restauração', 'Célula Libertação', 'Célula Milagres',
        'Célula Adoração', 'Célula Louvor', 'Célula Comunhão', 'Célula Família',
        'Célula Jovens', 'Célula Casais', 'Célula Mulheres', 'Célula Homens',
        'Célula Idosos', 'Célula Crianças', 'Célula Adolescentes'
    ];

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function generatePhone() {
        return `(11) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    function generateEmail(firstName, lastName) {
        const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'uol.com.br'];
        const cleanFirst = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const cleanLast = lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return `${cleanFirst}.${cleanLast}@${getRandomItem(domains)}`;
    }

    function generateBirthdate() {
        const start = new Date(1940, 0, 1);
        const end = new Date(2005, 11, 31);
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString().split('T')[0];
    }

    function generateAddress() {
        const street = getRandomItem(streets);
        const number = Math.floor(Math.random() * 2000 + 1);
        const neighborhood = getRandomItem(neighborhoods);
        return `${street}, ${number} - ${neighborhood}, São Paulo - SP`;
    }

    // Generate 400 members
    const sampleMembers = [];
    const statuses = ['active', 'active', 'active', 'active', 'inactive', 'visitor']; // More active members

    for (let i = 1; i <= 400; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const status = getRandomItem(statuses);
        
        const member = {
            id: i,
            name: `${firstName} ${lastName}`,
            email: generateEmail(firstName, lastName),
            phone: generatePhone(),
            birthdate: generateBirthdate(),
            address: generateAddress(),
            cell: status === 'active' ? getRandomItem(cellNames) : null,
            status: status,
            joinedAt: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
        };

        if (status === 'inactive') {
            member.inactivatedAt = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString();
            member.inactivationReason = getRandomItem(['Mudança de cidade', 'Problemas pessoais', 'Transferência', 'Outros']);
        }

        if (status === 'visitor') {
            member.visitDate = new Date(2024, Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1).toISOString();
            member.howKnew = getRandomItem(['Amigo', 'Família', 'Internet', 'Evento', 'Convite', 'Passando na rua']);
        }

        sampleMembers.push(member);
    }

    // Generate 30 ministries
    const ministryData = [
        { name: 'Ministério de Louvor e Adoração', description: 'Responsável pela música e adoração nos cultos', leader: 'Carlos Silva' },
        { name: 'Ministério de Ensino', description: 'Coordena as aulas da Escola Bíblica Dominical', leader: 'Ana Santos' },
        { name: 'Ministério de Evangelismo', description: 'Organiza ações evangelísticas e missões', leader: 'Pedro Oliveira' },
        { name: 'Ministério de Intercessão', description: 'Grupo dedicado à oração e intercessão', leader: 'Maria Ferreira' },
        { name: 'Ministério Infantil', description: 'Cuidado e ensino das crianças', leader: 'Juliana Alves' },
        { name: 'Ministério de Jovens', description: 'Atividades e discipulado para jovens', leader: 'Rafael Pereira' },
        { name: 'Ministério de Casais', description: 'Fortalecimento dos relacionamentos conjugais', leader: 'Marcos e Fernanda Lima' },
        { name: 'Ministério da Melhor Idade', description: 'Atividades para idosos da igreja', leader: 'José Gomes' },
        { name: 'Ministério de Diaconia', description: 'Assistência social e cuidado aos necessitados', leader: 'Antonia Costa' },
        { name: 'Ministério de Recepção', description: 'Acolhimento de visitantes e membros', leader: 'Paulo Ribeiro' },
        { name: 'Ministério de Comunicação', description: 'Gestão das redes sociais e comunicação', leader: 'Adriana Martins' },
        { name: 'Ministério de Teatro', description: 'Apresentações teatrais e dramáticas', leader: 'Daniel Carvalho' },
        { name: 'Ministério de Dança', description: 'Coreografias e apresentações de dança', leader: 'Luciana Almeida' },
        { name: 'Ministério de Som', description: 'Operação de equipamentos de áudio', leader: 'Felipe Lopes' },
        { name: 'Ministério de Vídeo', description: 'Produção e transmissão de vídeos', leader: 'Gabriel Soares' },
        { name: 'Ministério de Limpeza', description: 'Manutenção e limpeza do templo', leader: 'Francisca Fernandes' },
        { name: 'Ministério de Segurança', description: 'Segurança e ordem durante os cultos', leader: 'Roberto Vieira' },
        { name: 'Ministério de Estacionamento', description: 'Organização do estacionamento', leader: 'Sergio Barbosa' },
        { name: 'Ministério de Células', description: 'Coordenação dos grupos de células', leader: 'Renata Rocha' },
        { name: 'Ministério de Discipulado', description: 'Acompanhamento de novos convertidos', leader: 'Lucas Dias' },
        { name: 'Ministério de Visitação', description: 'Visitas a membros e enfermos', leader: 'Sandra Monteiro' },
        { name: 'Ministério de Aconselhamento', description: 'Apoio psicológico e espiritual', leader: 'Eduardo Cardoso' },
        { name: 'Ministério de Missões', description: 'Apoio a missionários e projetos missionários', leader: 'Claudia Reis' },
        { name: 'Ministério de Restauração', description: 'Apoio a pessoas em recuperação', leader: 'Ricardo Araujo' },
        { name: 'Ministério de Profetas', description: 'Ministração profética e revelação', leader: 'Vera Cavalcanti' },
        { name: 'Ministério de Libertação', description: 'Oração por libertação espiritual', leader: 'Fernando Nascimento' },
        { name: 'Ministério de Cura e Milagres', description: 'Oração pelos enfermos', leader: 'Monica Moreira' },
        { name: 'Ministério de Hospedagem', description: 'Acolhimento de visitantes e pregadores', leader: 'Andre Freitas' },
        { name: 'Ministério de Transporte', description: 'Transporte para eventos e atividades', leader: 'Fabio Pinto' },
        { name: 'Ministério de Decoração', description: 'Decoração do templo para eventos especiais', leader: 'Simone Mendes' }
    ];

    const sampleMinistries = ministryData.map((ministry, index) => ({
        id: index + 1,
        ...ministry
    }));

    // Generate sample cells
    const sampleCells = cellNames.map((name, index) => {
        const leaders = sampleMembers.filter(m => m.status === 'active').slice(0, 25);
        const leader = leaders[index] ? leaders[index].name : 'Líder não definido';
        
        return {
            id: index + 1,
            name: name,
            leader: leader,
            address: generateAddress(),
            dayOfWeek: getRandomItem(['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']),
            time: getRandomItem(['19:00', '19:30', '20:00', '20:30'])
        };
    });

    // Generate sample leaders
    const sampleLeaders = [];
    const positions = ['Pastor', 'Pastor Auxiliar', 'Presbítero', 'Diácono', 'Líder de Ministério', 'Coordenador', 'Supervisor'];
    
    for (let i = 0; i < 50; i++) {
        const member = sampleMembers[i];
        sampleLeaders.push({
            id: i + 1,
            name: member.name,
            position: getRandomItem(positions),
            ministry: sampleMinistries[i % sampleMinistries.length].name,
            phone: member.phone
        });
    }

    // Generate sample events
    const sampleEvents = [
        {
            id: 1,
            title: 'Culto de Celebração',
            description: 'Culto especial de celebração com louvor e palavra',
            date: '2024-09-01',
            time: '19:00',
            location: 'Templo Principal'
        },
        {
            id: 2,
            title: 'Conferência de Jovens',
            description: 'Evento especial para jovens com palestrantes convidados',
            date: '2024-09-15',
            time: '18:00',
            location: 'Auditório'
        },
        {
            id: 3,
            title: 'Retiro de Casais',
            description: 'Final de semana de fortalecimento matrimonial',
            date: '2024-09-20',
            time: '08:00',
            location: 'Chácara Bethel'
        },
        {
            id: 4,
            title: 'Batismo nas Águas',
            description: 'Cerimônia de batismo para novos convertidos',
            date: '2024-09-29',
            time: '16:00',
            location: 'Batistério da Igreja'
        },
        {
            id: 5,
            title: 'Festa das Crianças',
            description: 'Celebração especial para as crianças da igreja',
            date: '2024-10-12',
            time: '15:00',
            location: 'Salão Social'
        }
    ];

    // Generate sample prayer requests
    const samplePrayerRequests = [
        {
            id: 1,
            requester: 'Maria Silva',
            request: 'Oração pela cura de minha mãe que está internada',
            date: '2024-08-15',
            status: 'pending'
        },
        {
            id: 2,
            requester: 'João Santos',
            request: 'Pedido de oração pelo emprego, estou desempregado há 3 meses',
            date: '2024-08-18',
            status: 'pending'
        },
        {
            id: 3,
            requester: 'Ana Oliveira',
            request: 'Oração pela reconciliação familiar',
            date: '2024-08-10',
            status: 'answered'
        },
        {
            id: 4,
            requester: 'Pedro Lima',
            request: 'Oração pela saúde financeira da família',
            date: '2024-08-20',
            status: 'pending'
        },
        {
            id: 5,
            requester: 'Juliana Costa',
            request: 'Pedido de oração pelos estudos do meu filho',
            date: '2024-08-22',
            status: 'pending'
        }
    ];

    // Generate sample baptisms
    const sampleBaptisms = [
        {
            id: 1,
            name: 'Carlos Ferreira',
            date: '2024-09-29',
            pastor: 'Pastor João Silva',
            location: 'Batistério da Igreja',
            status: 'scheduled'
        },
        {
            id: 2,
            name: 'Fernanda Alves',
            date: '2024-09-29',
            pastor: 'Pastor João Silva',
            location: 'Batistério da Igreja',
            status: 'scheduled'
        },
        {
            id: 3,
            name: 'Rafael Pereira',
            date: '2024-08-25',
            pastor: 'Pastor João Silva',
            location: 'Batistério da Igreja',
            status: 'completed'
        },
        {
            id: 4,
            name: 'Mariana Santos',
            date: '2024-10-27',
            pastor: 'Pastor João Silva',
            location: 'Batistério da Igreja',
            status: 'scheduled'
        }
    ];

    // Generate sample donations
    const sampleDonations = [
        {
            id: 1,
            donor: 'José Silva',
            type: 'Dízimo',
            amount: 500.00,
            date: '2024-08-01',
            method: 'PIX',
            notes: 'Dízimo mensal'
        },
        {
            id: 2,
            donor: 'Maria Santos',
            type: 'Oferta',
            amount: 100.00,
            date: '2024-08-04',
            method: 'Dinheiro',
            notes: 'Oferta de gratidão'
        },
        {
            id: 3,
            donor: 'Pedro Oliveira',
            type: 'Doação Especial',
            amount: 1000.00,
            date: '2024-08-10',
            method: 'Transferência',
            notes: 'Para reforma do templo'
        },
        {
            id: 4,
            donor: 'Ana Costa',
            type: 'Dízimo',
            amount: 300.00,
            date: '2024-08-15',
            method: 'PIX',
            notes: 'Dízimo mensal'
        }
    ];

    // Generate sample transactions
    const sampleTransactions = [
        {
            id: 1,
            description: 'Ofertas do culto dominical',
            amount: 2500.00,
            date: '2024-08-04',
            type: 'income',
            category: 'Ofertas',
            paymentMethod: 'Dinheiro',
            notes: 'Coleta do domingo'
        },
        {
            id: 2,
            description: 'Conta de luz',
            amount: 450.00,
            date: '2024-08-05',
            type: 'expense',
            category: 'Utilidades',
            paymentMethod: 'Transferência',
            notes: 'Conta mensal'
        },
        {
            id: 3,
            description: 'Dízimos recebidos',
            amount: 8500.00,
            date: '2024-08-01',
            type: 'income',
            category: 'Dízimos',
            paymentMethod: 'PIX',
            notes: 'Dízimos do mês'
        },
        {
            id: 4,
            description: 'Material de limpeza',
            amount: 150.00,
            date: '2024-08-08',
            type: 'expense',
            category: 'Manutenção',
            paymentMethod: 'Dinheiro',
            notes: 'Produtos de limpeza'
        }
    ];

    // Generate sample agenda
    const sampleAgenda = [
        {
            id: 1,
            title: 'Reunião de Liderança',
            description: 'Reunião mensal com todos os líderes de ministério',
            date: '2024-09-02',
            time: '19:00',
            location: 'Sala de Reuniões',
            priority: 'high'
        },
        {
            id: 2,
            title: 'Visita Hospitalar',
            description: 'Visita ao irmão José que está internado',
            date: '2024-08-30',
            time: '14:00',
            location: 'Hospital São Paulo',
            priority: 'medium'
        },
        {
            id: 3,
            title: 'Aconselhamento Matrimonial',
            description: 'Sessão de aconselhamento com casal da igreja',
            date: '2024-09-01',
            time: '16:00',
            location: 'Gabinete Pastoral',
            priority: 'medium'
        },
        {
            id: 4,
            title: 'Preparação da Mensagem',
            description: 'Tempo de estudo e preparação da mensagem dominical',
            date: '2024-08-31',
            time: '09:00',
            location: 'Escritório',
            priority: 'high'
        }
    ];

    return {
        members: sampleMembers,
        ministries: sampleMinistries,
        cells: sampleCells,
        leaders: sampleLeaders,
        events: sampleEvents,
        prayerRequests: samplePrayerRequests,
        baptisms: sampleBaptisms,
        donations: sampleDonations,
        transactions: sampleTransactions,
        agenda: sampleAgenda
    };
}

// Export the function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateSampleData };
}
