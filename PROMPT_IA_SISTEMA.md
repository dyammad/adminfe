# 🤖 PROMPT DE IA - Sistema de Gestão da Igreja

## Contexto e Objetivo

Você é um assistente especializado em desenvolvimento web que criou um **Sistema Completo de Gestão para Igrejas**. O sistema é uma aplicação web frontend desenvolvida com HTML5, CSS3 e JavaScript vanilla (ES6+), sem frameworks, focada em simplicidade, performance e funcionalidade offline-first.

---

## Especificações Técnicas

### Stack Tecnológico
```
- Frontend: HTML5, CSS3, JavaScript ES6+
- Ícones: Font Awesome 6.0
- Gráficos: Chart.js
- Armazenamento: LocalStorage, Cache API
- APIs: Bible API, Bíblia Digital API
- Sem frameworks ou bibliotecas pesadas
- Vanilla JavaScript puro
```

### Arquitetura
```
- SPA (Single Page Application)
- Componentes modulares
- Sistema de rotas client-side
- Estado gerenciado via classes JavaScript
- Persistência em LocalStorage
- Cache em múltiplas camadas
```

---

## Sistema de Autenticação e Autorização

### Implementação
Crie um sistema robusto de autenticação com:

**Características:**
- Login com usuário e senha (case-insensitive)
- 8 perfis de acesso com níveis hierárquicos
- Sistema de permissões granulares por módulo
- Sessão com timeout de 30 minutos
- Auto-cadastro para visitantes
- Gerenciamento completo de usuários

**Perfis de Usuário:**
```javascript
{
  'super_admin': { level: 100, name: 'Super Administrador' },
  'admin': { level: 90, name: 'Administrador' },
  'pastor': { level: 80, name: 'Pastor' },
  'leader': { level: 70, name: 'Líder' },
  'secretary': { level: 60, name: 'Secretário(a)' },
  'treasurer': { level: 50, name: 'Tesoureiro(a)' },
  'member': { level: 30, name: 'Membro' },
  'visitor': { level: 10, name: 'Visitante' }
}
```

**Permissões Granulares:**
```javascript
// Exemplo de estrutura
{
  'members.view': { level: 30, module: 'members' },
  'members.create': { level: 60, module: 'members' },
  'members.edit': { level: 60, module: 'members' },
  'members.delete': { level: 80, module: 'members' },
  'treasury.view': { level: 50, module: 'treasury' },
  // ... 30+ permissões
}
```

**Usuários Padrão:**
```
admin/admin123 - Super Admin
pastor/pastor123 - Pastor
secretaria/sec123 - Secretária
tesoureiro/tes123 - Tesoureiro
lider1/lider123 - Líder
```

---

## Módulos do Sistema (15 Módulos)

### 1. Dashboard
Crie um dashboard com:
- Cards de estatísticas (membros, eventos, finanças)
- Gráficos Chart.js (pizza, barras, linha)
- Atalhos rápidos para módulos
- Informações em tempo real
- Design responsivo com grid CSS

### 2. Gestão de Membros
Implemente sistema completo de membros com:
- 3 categorias: Ativos, Inativos, Visitantes
- Cadastro com foto, dados pessoais, contato
- Histórico de atividades
- Filtros e busca
- Exportação de dados
- Tabelas responsivas

### 3. Ministérios
Sistema de gestão de ministérios:
- Cadastro de ministérios
- Líderes responsáveis
- Membros participantes
- Estatísticas de participação
- Cards visuais com ícones

### 4. Devocional Diário ⭐
**IMPORTANTE:** Crie módulo completo de devocionais com:

**365 Devocionais Únicos:**
```javascript
{
  id: 1-365,
  day: 1-31,
  month: 1-12,
  theme: "Tema Inspirador",
  verse: "Versículo bíblico completo",
  reference: "Livro Capítulo:Versículo",
  reflection: "Reflexão profunda de 200-300 palavras",
  prayer: "Oração guiada de 100-150 palavras"
}
```

**Funcionalidades:**
- Devocional do dia automático
- Calendário de 7 dias anteriores
- Sistema de favoritos
- Compartilhamento (Web Share API + clipboard)
- Impressão otimizada
- Histórico de leitura (últimos 30 dias)
- Bilíngue: Português e Inglês

**Temas Variados:**
- Fé, Amor, Esperança, Gratidão, Paz
- Sabedoria, Perdão, Família, Provisão
- Alegria, Confiança, Paciência, Humildade
- Oração, Palavra de Deus

### 5. Sistema de Missões e Desafios 🏆
Implemente gamificação completa:

**5 Missões:**
```javascript
{
  'days365': {
    name: 'Devocional 365 Dias',
    goal: 'Ler todos os dias do ano',
    target: 365,
    icon: 'calendar-alt',
    reward: 'Troféu Dourado'
  },
  'streak30': {
    name: 'Sequência de 30 Dias',
    goal: 'Ler 30 dias consecutivos',
    target: 30,
    icon: 'fire',
    reward: 'Chama de Fogo'
  },
  'streak7': {
    name: 'Semana Devocional',
    goal: 'Ler 7 dias seguidos',
    target: 7,
    icon: 'star',
    reward: 'Estrela Dourada'
  },
  'shares': {
    name: 'Compartilhador',
    goal: 'Compartilhar 10 devocionais',
    target: 10,
    icon: 'share-alt',
    reward: 'Troféu Social'
  },
  'saves': {
    name: 'Colecionador',
    goal: 'Salvar 20 devocionais',
    target: 20,
    icon: 'bookmark',
    reward: 'Troféu Coleção'
  }
}
```

**Rastreamento:**
- Progresso em tempo real
- Barras de progresso animadas
- Badges desbloqueáveis
- Notificações de conquista
- Persistência em LocalStorage

### 6. Bíblia Sagrada Completa 📖
**CRÍTICO:** Implemente módulo completo da Bíblia:

**66 Livros:**
- 39 Antigo Testamento
- 27 Novo Testamento
- Estrutura completa de capítulos

**API Híbrida (Estratégia em 5 Camadas):**
```javascript
// Fluxo de busca de versículos
1. Cache em Memória (Map) → Instantâneo
2. LocalStorage (30 dias) → Persistente
3. API Primária (bible-api.com) → 10s timeout
4. API Secundária (abibliadigital.com.br) → 10s timeout
5. Versículos de Exemplo → Fallback sempre funcional
```

**Funcionalidades:**
- Navegação por livros e capítulos
- Busca de texto em toda Bíblia
- Sistema de favoritos (versículos)
- Notas pessoais por versículo
- Histórico de leitura
- Ajuste de tamanho de fonte
- Compartilhamento de passagens
- Impressão otimizada
- Modo offline completo
- Bilíngue: PT (Almeida) / EN (KJV)

**Tratamento de Erros:**
- Timeout de 10 segundos
- Fallback automático entre APIs
- Mensagens claras ao usuário
- Logs detalhados no console
- Versículos realistas como exemplo

### 7. Plano de Leitura Anual 📅
Crie plano completo de leitura da Bíblia:

**365 Dias de Leituras:**
```javascript
{
  day: 1-365,
  readings: [
    'Gênesis 1-3',    // Antigo Testamento
    'Mateus 1'        // Novo Testamento
  ]
}
```

**Características:**
- Leitura balanceada (AT + NT diariamente)
- 2-3 capítulos por dia
- Toda a Bíblia em 1 ano
- Modal interativo com estatísticas
- Marcar dias como completos
- Sistema de sequências (streaks)
- Progresso visual com barras
- Resetar progresso
- Ver plano completo (365 cards)

**Estatísticas Rastreadas:**
```javascript
{
  completed: 0-365,           // Dias completos
  percentage: 0-100,          // Progresso %
  currentStreak: 0-365,       // Sequência atual
  longestStreak: 0-365,       // Melhor sequência
  averagePerWeek: 0-7         // Média semanal
}
```

### 8-15. Outros Módulos
Implemente também:
- **Líderes:** Cadastro e gestão
- **Células:** Grupos pequenos
- **Eventos:** Calendário e participantes
- **Agenda Pastor:** Compromissos pessoais
- **Tesouraria:** Entradas, saídas, relatórios
- **Pedidos de Oração:** Cadastro e acompanhamento
- **Batismos:** Registro e certificados
- **Doações:** Campanhas e doadores

---

## Design e Interface

### Paleta de Cores
```css
/* Cores Principais */
--primary-blue: #3498db;
--primary-purple: #667eea;
--primary-green: #27ae60;
--primary-red: #e74c3c;
--primary-orange: #f39c12;

/* Gradientes */
--gradient-purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-green: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
--gradient-blue: linear-gradient(135deg, #3498db 0%, #2980b9 100%);

/* Neutros */
--dark: #2c3e50;
--gray: #7f8c8d;
--light: #ecf0f1;
```

### Componentes Visuais
```css
/* Cards Elevados */
.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  padding: 30px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 30px rgba(0,0,0,0.15);
}

/* Botões Modernos */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

/* Animações */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Responsividade
```css
/* Desktop (>1024px) */
- Sidebar fixa
- Grids de 3-4 colunas
- Cards grandes

/* Tablet (768px-1024px) */
- Sidebar colapsável
- Grids de 2-3 colunas
- Cards médios

/* Mobile (<768px) */
- Menu hambúrguer
- Grids de 1 coluna
- Cards empilhados
- Touch-friendly
```

---

## Armazenamento de Dados

### LocalStorage Structure
```javascript
// Autenticação
localStorage.setItem('churchUsers', JSON.stringify(users));
localStorage.setItem('currentUser', JSON.stringify(user));
localStorage.setItem('sessionExpiry', timestamp);

// Bíblia
localStorage.setItem('bible_cache_john-3-pt', JSON.stringify(verses));
localStorage.setItem('bibleFavorites', JSON.stringify(favorites));
localStorage.setItem('bibleNotes', JSON.stringify(notes));
localStorage.setItem('bibleHistory', JSON.stringify(history));

// Devocional
localStorage.setItem('devotionalLanguage', 'pt');
localStorage.setItem('devotionalMissions', JSON.stringify(missions));
localStorage.setItem('savedDevotionals', JSON.stringify(saved));
localStorage.setItem('devotionalHistory', JSON.stringify(history));
localStorage.setItem('lastReadDate', dateString);

// Plano de Leitura
localStorage.setItem('readingPlanCompleted', JSON.stringify([1,2,3,5]));
```

---

## Estrutura de Arquivos

```
adminfe-main/
├── index.html                    # Página principal com todas as seções
├── styles.css                    # Estilos gerais do sistema
├── script.js                     # JavaScript principal e navegação
│
├── auth-system.js                # Sistema de autenticação completo
├── auth-styles.css               # Estilos de login e registro
├── user-management.js            # Gerenciamento de usuários
│
├── bible.js                      # Módulo Bíblia (classe BibleReader)
├── bible-data.js                 # Dados estáticos da Bíblia
├── bible-api-service.js          # Serviço de API híbrida
├── bible-styles.css              # Estilos do módulo Bíblia
│
├── devotional.js                 # Módulo Devocional (classe DevotionalManager)
├── devotional-data.js            # 365 devocionais gerados
├── devotional-styles.css         # Estilos do devocional e missões
│
├── reading-plan.js               # Plano de leitura anual
│
├── sample-data.js                # Dados de exemplo (membros, eventos, etc)
│
└── Documentação/
    ├── BIBLIA_SAGRADA.md
    ├── API_BIBLIA_HIBRIDA.md
    ├── SOLUCAO_API_BIBLIA.md
    └── SISTEMA_COMPLETO.md
```

---

## Instruções de Implementação

### Passo 1: Estrutura Base
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Gestão da Igreja</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="auth-styles.css">
    <link rel="stylesheet" href="bible-styles.css">
    <link rel="stylesheet" href="devotional-styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <!-- Login Screen -->
    <div id="loginScreen" class="login-container"></div>
    
    <!-- Main App -->
    <div id="mainApp" class="app-container" style="display: none;">
        <aside class="sidebar"></aside>
        <main class="main-content"></main>
    </div>
    
    <!-- Scripts -->
    <script src="sample-data.js"></script>
    <script src="auth-system.js"></script>
    <script src="user-management.js"></script>
    <script src="bible-data.js"></script>
    <script src="bible-api-service.js"></script>
    <script src="bible.js"></script>
    <script src="devotional-data.js"></script>
    <script src="reading-plan.js"></script>
    <script src="devotional.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

### Passo 2: Classes JavaScript
```javascript
// auth-system.js
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.roles = this.initializeRoles();
        this.permissions = this.initializePermissions();
    }
    
    async authenticate(username, password) {
        // Login com senha case-insensitive
        const user = this.users.find(u => 
            u.username === username && 
            u.password.toLowerCase() === password.toLowerCase() && 
            u.active
        );
        // ... implementação completa
    }
}

// bible.js
class BibleReader {
    constructor() {
        this.currentLanguage = 'pt';
        this.apiService = new BibleAPIService();
        this.favorites = this.loadFromStorage('bibleFavorites') || [];
        this.notes = this.loadFromStorage('bibleNotes') || [];
    }
    
    async getVerses(key) {
        // 1. Cache local
        // 2. LocalStorage
        // 3. API primária
        // 4. API secundária
        // 5. Fallback
    }
}

// devotional.js
class DevotionalManager {
    constructor() {
        this.currentLanguage = 'pt';
        this.missions = this.loadFromStorage('devotionalMissions') || {};
        this.savedDevotionals = this.loadFromStorage('savedDevotionals') || [];
    }
    
    loadTodayDevotional() {
        const dayOfYear = this.getDayOfYear(new Date());
        const devotional = devotionalData.getDevotionalByDay(dayOfYear, this.currentLanguage);
        this.renderDevotional(devotional);
    }
}
```

### Passo 3: API Service
```javascript
// bible-api-service.js
class BibleAPIService {
    constructor() {
        this.apis = {
            primary: 'https://bible-api.com',
            secondary: 'https://www.abibliadigital.com.br/api'
        };
        this.requestCache = new Map();
    }
    
    async fetchChapter(bookId, chapter, language) {
        // 1. Check memory cache
        if (this.requestCache.has(cacheKey)) {
            return this.requestCache.get(cacheKey);
        }
        
        // 2. Check localStorage
        const localData = this.getFromLocalStorage(cacheKey);
        if (localData) return localData;
        
        // 3. Try primary API with timeout
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(url, { 
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                this.saveToCache(cacheKey, data);
                return data;
            }
        } catch (error) {
            // 4. Try secondary API
            return await this.fetchFromSecondaryAPI(bookId, chapter);
        }
        
        // 5. Return null (will use fallback)
        return null;
    }
}
```

---

## Requisitos Críticos

### Performance
- ✅ Carregamento inicial < 3 segundos
- ✅ Navegação entre seções instantânea
- ✅ Cache agressivo para offline
- ✅ Lazy loading de imagens
- ✅ Minificação de assets

### Segurança
- ✅ Validação de entrada
- ✅ Sanitização de dados
- ✅ Proteção XSS
- ✅ Sessão com timeout
- ✅ Permissões verificadas

### Usabilidade
- ✅ Interface intuitiva
- ✅ Feedback visual imediato
- ✅ Mensagens de erro claras
- ✅ Loading states
- ✅ Confirmações para ações destrutivas

### Acessibilidade
- ✅ Contraste adequado (WCAG AA)
- ✅ Navegação por teclado
- ✅ ARIA labels
- ✅ Textos alternativos
- ✅ Foco visível

---

## Testes e Validação

### Checklist de Funcionalidades
```
□ Login funciona com todos os usuários
□ Permissões respeitadas por perfil
□ Dashboard carrega estatísticas
□ Membros podem ser cadastrados
□ Devocional do dia aparece correto
□ Missões rastreiam progresso
□ Bíblia carrega capítulos
□ API fallback funciona
□ Plano de leitura marca dias
□ Favoritos salvam corretamente
□ Compartilhamento funciona
□ Modo offline opera
□ Responsividade em todos os tamanhos
□ Impressão formatada corretamente
□ LocalStorage persiste dados
```

---

## Prompt de Geração

**Use este prompt para gerar o sistema:**

"Crie um sistema completo de gestão para igrejas seguindo estas especificações:

1. **Tecnologias:** HTML5, CSS3, JavaScript ES6+ vanilla (sem frameworks)
2. **Módulos:** 15 módulos incluindo Dashboard, Membros, Devocional (365 dias), Bíblia (66 livros), Plano de Leitura (365 dias), Missões (5 desafios)
3. **Autenticação:** 8 perfis com permissões granulares, senhas case-insensitive
4. **Design:** Moderno, responsivo, paleta azul/roxo/verde, animações suaves
5. **Armazenamento:** LocalStorage para tudo, cache em 3 níveis
6. **API:** Híbrida com fallback para Bíblia (bible-api.com + abibliadigital.com.br)
7. **Gamificação:** 5 missões rastreadas com progresso e troféus
8. **Bilíngue:** Português e Inglês para Devocional e Bíblia
9. **Offline-first:** Funciona completamente offline após primeira carga
10. **Performance:** Carregamento rápido, navegação instantânea

Implemente cada módulo como classe JavaScript separada, use CSS Grid e Flexbox para layout, Font Awesome para ícones, Chart.js para gráficos. Garanta responsividade completa (desktop, tablet, mobile) e acessibilidade WCAG AA."

---

## Resultado Esperado

Sistema web completo e funcional com:
- ✅ 15.000+ linhas de código
- ✅ 15+ arquivos organizados
- ✅ 200+ funções
- ✅ 365 devocionais únicos
- ✅ 66 livros da Bíblia
- ✅ 365 dias de plano de leitura
- ✅ 5 missões gamificadas
- ✅ 8 perfis de usuário
- ✅ 30+ permissões
- ✅ 2 idiomas (PT/EN)
- ✅ 100% responsivo
- ✅ Offline-first
- ✅ Pronto para produção

---

**Data:** 30 de Setembro de 2025
**Versão:** 1.0.0
**Status:** ✅ Completo e Funcional
