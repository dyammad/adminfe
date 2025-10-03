# 🚀 MIGRAÇÃO PARA SUPABASE - GUIA COMPLETO

## Sistema de Gestão Eclesiástica Multi-Filiais

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Preparação](#preparação)
3. [Estrutura do Banco](#estrutura-do-banco)
4. [Configuração](#configuração)
5. [Migração de Dados](#migração-de-dados)
6. [Implementação Frontend](#implementação-frontend)
7. [Row Level Security](#row-level-security)
8. [Realtime](#realtime)
9. [Deployment](#deployment)

---

## 🎯 VISÃO GERAL

### O que vamos fazer?

**Antes (Sistema Atual):**
- Frontend: HTML + JavaScript
- Storage: LocalStorage
- Sem backend real
- Dados apenas no navegador

**Depois (Com Supabase):**
- Frontend: Mesmo (HTML + JS)
- Backend: Supabase (PostgreSQL)
- Autenticação: Supabase Auth
- Realtime: WebSockets automáticos
- Multi-filiais: Row Level Security

### Benefícios da Migração

1. ✅ **Dados Persistentes** - Não perde mais dados
2. ✅ **Multi-dispositivo** - Acessa de qualquer lugar
3. ✅ **Colaborativo** - Múltiplos usuários simultâneos
4. ✅ **Seguro** - Backup automático
5. ✅ **Escalável** - Suporta milhares de usuários
6. ✅ **Realtime** - Atualizações instantâneas

---

## 🛠️ PREPARAÇÃO

### Passo 1: Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Crie um novo projeto:
   - Nome: `igreja-gestao`
   - Database Password: (anote em local seguro)
   - Region: South America (São Paulo)

### Passo 2: Obter Credenciais

Após criar o projeto, vá em **Settings > API**:

```javascript
// Anote estas informações:
const SUPABASE_URL = 'https://seu-projeto.supabase.co'
const SUPABASE_ANON_KEY = 'sua-chave-publica-aqui'
```

### Passo 3: Instalar Biblioteca

Adicione no seu `index.html` antes do `</body>`:

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

---

## 🗄️ ESTRUTURA DO BANCO

### Tabelas Principais

#### 1. **branches (Filiais)**

```sql
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_branches_city ON branches(city);
CREATE INDEX idx_branches_state ON branches(state);
```

#### 2. **users (Usuários)**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  birthdate DATE,
  branch_id UUID REFERENCES branches(id),
  role TEXT NOT NULL DEFAULT 'member',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
```

#### 3. **members (Membros)**

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birthdate DATE,
  address TEXT,
  cell TEXT,
  status TEXT DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_members_branch ON members(branch_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_cell ON members(cell);
```

#### 4. **ministries (Ministérios)**

```sql
CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  leader TEXT NOT NULL,
  leader_phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ministries_branch ON ministries(branch_id);
```

#### 5. **cells (Células)**

```sql
CREATE TABLE cells (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  name TEXT NOT NULL,
  leader TEXT NOT NULL,
  address TEXT,
  day_of_week TEXT,
  time TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cells_branch ON cells(branch_id);
```

#### 6. **events (Eventos)**

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_branch ON events(branch_id);
CREATE INDEX idx_events_date ON events(date);
```

#### 7. **donations (Doações)**

```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  donor TEXT NOT NULL,
  type TEXT NOT NULL, -- 'tithe', 'offering', 'special'
  amount DECIMAL(10,2) NOT NULL,
  method TEXT,
  date DATE NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_donations_branch ON donations(branch_id);
CREATE INDEX idx_donations_date ON donations(date);
CREATE INDEX idx_donations_type ON donations(type);
```

#### 8. **baptisms (Batismos)**

```sql
CREATE TABLE baptisms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  member_id UUID REFERENCES members(id),
  name TEXT NOT NULL,
  email TEXT,
  baptism_date DATE,
  pastor TEXT,
  location TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'scheduled', 'completed'
  request_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_baptisms_branch ON baptisms(branch_id);
CREATE INDEX idx_baptisms_status ON baptisms(status);
```

#### 9. **prayer_requests (Pedidos de Oração)**

```sql
CREATE TABLE prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  requester TEXT NOT NULL,
  request TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'answered'
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prayer_branch ON prayer_requests(branch_id);
CREATE INDEX idx_prayer_status ON prayer_requests(status);
```

#### 10. **agenda (Agenda do Pastor)**

```sql
CREATE TABLE agenda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agenda_branch ON agenda(branch_id);
CREATE INDEX idx_agenda_date ON agenda(date);
```

---

## ⚙️ CONFIGURAÇÃO

### Arquivo: `supabase-config.js`

```javascript
// Configuração do Supabase
const SUPABASE_URL = 'https://seu-projeto.supabase.co'
const SUPABASE_ANON_KEY = 'sua-chave-publica'

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Exportar para uso global
window.supabaseClient = supabase

console.log('✅ Supabase inicializado')
```

### Adicionar no `index.html`:

```html
<!-- Antes do script.js -->
<script src="supabase-config.js"></script>
```

---

## 📦 MIGRAÇÃO DE DADOS

### Script de Migração: `migrate-to-supabase.js`

```javascript
// Migrar dados do localStorage para Supabase
async function migrateToSupabase() {
    console.log('🚀 Iniciando migração para Supabase...')
    
    try {
        // 1. Migrar Filiais
        console.log('📍 Migrando filiais...')
        const branches = window.branches || []
        for (const branch of branches) {
            const { error } = await supabase
                .from('branches')
                .insert({
                    name: branch.name,
                    city: branch.city,
                    state: branch.state,
                    address: branch.address,
                    phone: branch.phone,
                    email: branch.email
                })
            if (error) console.error('Erro ao migrar filial:', error)
        }
        console.log(`✅ ${branches.length} filiais migradas`)
        
        // 2. Migrar Membros
        console.log('👥 Migrando membros...')
        const members = sampleData.members || []
        for (const member of members) {
            const { error } = await supabase
                .from('members')
                .insert({
                    branch_id: member.branchId,
                    name: member.name,
                    email: member.email,
                    phone: member.phone,
                    birthdate: member.birthDate,
                    address: member.address,
                    cell: member.cell,
                    status: member.status
                })
            if (error) console.error('Erro ao migrar membro:', error)
        }
        console.log(`✅ ${members.length} membros migrados`)
        
        // 3. Migrar Ministérios
        console.log('🙏 Migrando ministérios...')
        const ministries = window.ministries || []
        for (const ministry of ministries) {
            const { error } = await supabase
                .from('ministries')
                .insert({
                    branch_id: ministry.branchId || 1,
                    name: ministry.name,
                    description: ministry.description,
                    leader: ministry.leader,
                    leader_phone: ministry.leaderPhone
                })
            if (error) console.error('Erro ao migrar ministério:', error)
        }
        console.log(`✅ ${ministries.length} ministérios migrados`)
        
        // 4. Migrar Eventos
        console.log('📅 Migrando eventos...')
        const events = window.events || []
        for (const event of events) {
            const { error } = await supabase
                .from('events')
                .insert({
                    branch_id: event.branchId || 1,
                    title: event.title,
                    description: event.description,
                    date: event.date,
                    time: event.time,
                    location: event.location
                })
            if (error) console.error('Erro ao migrar evento:', error)
        }
        console.log(`✅ ${events.length} eventos migrados`)
        
        // 5. Migrar Doações
        console.log('💰 Migrando doações...')
        const donations = window.donations || []
        for (const donation of donations) {
            const { error } = await supabase
                .from('donations')
                .insert({
                    branch_id: donation.branchId || 1,
                    donor: donation.donor,
                    type: donation.type,
                    amount: donation.amount,
                    method: donation.method,
                    date: donation.date,
                    notes: donation.notes
                })
            if (error) console.error('Erro ao migrar doação:', error)
        }
        console.log(`✅ ${donations.length} doações migradas`)
        
        console.log('🎉 Migração concluída com sucesso!')
        
    } catch (error) {
        console.error('❌ Erro na migração:', error)
    }
}

// Executar migração
// migrateToSupabase()
```

---

## 💻 IMPLEMENTAÇÃO FRONTEND

### Arquivo: `supabase-service.js`

```javascript
// Serviço para interagir com Supabase

class SupabaseService {
    constructor() {
        this.supabase = window.supabaseClient
        this.currentBranchId = null
    }
    
    // ========== AUTENTICAÇÃO ==========
    
    async signUp(email, password, userData) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        })
        return { data, error }
    }
    
    async signIn(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (data.user) {
            // Buscar dados do usuário
            const { data: userData } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single()
            
            this.currentBranchId = userData?.branch_id
        }
        
        return { data, error }
    }
    
    async signOut() {
        const { error } = await this.supabase.auth.signOut()
        this.currentBranchId = null
        return { error }
    }
    
    async getCurrentUser() {
        const { data: { user } } = await this.supabase.auth.getUser()
        return user
    }
    
    // ========== MEMBROS ==========
    
    async getMembers(status = 'active') {
        const { data, error } = await this.supabase
            .from('members')
            .select('*')
            .eq('status', status)
            .order('name')
        
        return { data, error }
    }
    
    async createMember(memberData) {
        const { data, error } = await this.supabase
            .from('members')
            .insert({
                ...memberData,
                branch_id: this.currentBranchId
            })
            .select()
        
        return { data, error }
    }
    
    async updateMember(id, memberData) {
        const { data, error } = await this.supabase
            .from('members')
            .update(memberData)
            .eq('id', id)
            .select()
        
        return { data, error }
    }
    
    async deleteMember(id) {
        const { error } = await this.supabase
            .from('members')
            .delete()
            .eq('id', id)
        
        return { error }
    }
    
    // ========== DOAÇÕES ==========
    
    async getDonations(startDate, endDate) {
        let query = this.supabase
            .from('donations')
            .select('*')
            .order('date', { ascending: false })
        
        if (startDate) query = query.gte('date', startDate)
        if (endDate) query = query.lte('date', endDate)
        
        const { data, error } = await query
        return { data, error }
    }
    
    async createDonation(donationData) {
        const { data, error } = await this.supabase
            .from('donations')
            .insert({
                ...donationData,
                branch_id: this.currentBranchId
            })
            .select()
        
        return { data, error }
    }
    
    async getDonationsSummary() {
        const { data, error } = await this.supabase
            .from('donations')
            .select('type, amount')
        
        if (error) return { error }
        
        const summary = {
            tithes: 0,
            offerings: 0,
            special: 0
        }
        
        data.forEach(donation => {
            if (donation.type === 'tithe') summary.tithes += donation.amount
            else if (donation.type === 'offering') summary.offerings += donation.amount
            else if (donation.type === 'special') summary.special += donation.amount
        })
        
        return { data: summary, error: null }
    }
    
    // ========== EVENTOS ==========
    
    async getEvents() {
        const { data, error } = await this.supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true })
        
        return { data, error }
    }
    
    async createEvent(eventData) {
        const { data, error } = await this.supabase
            .from('events')
            .insert({
                ...eventData,
                branch_id: this.currentBranchId
            })
            .select()
        
        return { data, error }
    }
    
    async updateEvent(id, eventData) {
        const { data, error } = await this.supabase
            .from('events')
            .update(eventData)
            .eq('id', id)
            .select()
        
        return { data, error }
    }
    
    async deleteEvent(id) {
        const { error } = await this.supabase
            .from('events')
            .delete()
            .eq('id', id)
        
        return { error }
    }
    
    // ========== PEDIDOS DE ORAÇÃO ==========
    
    async getPrayerRequests() {
        const { data, error } = await this.supabase
            .from('prayer_requests')
            .select('*')
            .order('date', { ascending: false })
        
        return { data, error }
    }
    
    async createPrayerRequest(requestData) {
        const { data, error } = await this.supabase
            .from('prayer_requests')
            .insert({
                ...requestData,
                branch_id: this.currentBranchId
            })
            .select()
        
        return { data, error }
    }
    
    async updatePrayerRequest(id, updates) {
        const { data, error } = await this.supabase
            .from('prayer_requests')
            .update(updates)
            .eq('id', id)
            .select()
        
        return { data, error }
    }
    
    // ========== REALTIME ==========
    
    subscribeToMembers(callback) {
        return this.supabase
            .channel('members-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'members' },
                callback
            )
            .subscribe()
    }
    
    subscribeToDonations(callback) {
        return this.supabase
            .channel('donations-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'donations' },
                callback
            )
            .subscribe()
    }
}

// Criar instância global
window.supabaseService = new SupabaseService()
```

---

## 🔒 ROW LEVEL SECURITY (RLS)

### Políticas de Segurança

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE baptisms ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;

-- Política: Usuários veem apenas dados da sua filial
CREATE POLICY "Users see only their branch data"
ON members
FOR SELECT
USING (
  branch_id = (
    SELECT branch_id FROM users WHERE id = auth.uid()
  )
);

-- Política: Super admins veem tudo
CREATE POLICY "Super admins see all"
ON members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Política: Membros podem inserir (doar, solicitar batismo, etc)
CREATE POLICY "Members can insert"
ON donations
FOR INSERT
WITH CHECK (
  branch_id = (
    SELECT branch_id FROM users WHERE id = auth.uid()
  )
);

-- Política: Apenas admins podem editar
CREATE POLICY "Only admins can update"
ON members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'branch_admin')
  )
);

-- Aplicar políticas similares para todas as tabelas
```

---

## ⚡ REALTIME

### Implementação de Atualizações em Tempo Real

```javascript
// No seu script.js

// Subscrever a mudanças em membros
supabaseService.subscribeToMembers((payload) => {
    console.log('Mudança em membros:', payload)
    
    if (payload.eventType === 'INSERT') {
        // Novo membro adicionado
        const newMember = payload.new
        // Atualizar interface
        loadActiveMembers()
    } else if (payload.eventType === 'UPDATE') {
        // Membro atualizado
        loadActiveMembers()
    } else if (payload.eventType === 'DELETE') {
        // Membro removido
        loadActiveMembers()
    }
})

// Subscrever a doações
supabaseService.subscribeToDonations((payload) => {
    console.log('Nova doação:', payload)
    
    if (payload.eventType === 'INSERT') {
        // Mostrar notificação
        showNotification('💰 Nova doação recebida!')
        // Atualizar totais
        loadDonations()
    }
})
```

---

## 🚀 DEPLOYMENT

### Passo 1: Configurar Variáveis de Ambiente

Crie arquivo `.env`:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-publica
```

### Passo 2: Deploy Frontend

**Opção 1: Vercel (Recomendado)**
```bash
npm install -g vercel
vercel
```

**Opção 2: Netlify**
```bash
npm install -g netlify-cli
netlify deploy
```

**Opção 3: GitHub Pages**
- Push para GitHub
- Habilitar GitHub Pages nas configurações

### Passo 3: Configurar Domínio Customizado

No Supabase:
1. Settings > API
2. Add custom domain
3. Configurar DNS

---

## 📊 MONITORAMENTO

### Dashboard do Supabase

Acesse: `https://app.supabase.com/project/seu-projeto`

**Métricas disponíveis:**
- Número de usuários ativos
- Queries por segundo
- Uso de storage
- Logs de erro
- Performance de queries

---

## ✅ CHECKLIST DE MIGRAÇÃO

- [ ] Criar conta no Supabase
- [ ] Criar projeto
- [ ] Criar todas as tabelas
- [ ] Configurar RLS
- [ ] Adicionar biblioteca no frontend
- [ ] Criar arquivo de configuração
- [ ] Migrar dados existentes
- [ ] Atualizar funções do frontend
- [ ] Testar autenticação
- [ ] Testar CRUD de cada módulo
- [ ] Configurar realtime
- [ ] Fazer deploy
- [ ] Configurar domínio
- [ ] Treinar usuários

---

## 🎯 PRÓXIMOS PASSOS

1. **Semana 1:** Setup e configuração
2. **Semana 2:** Migração de dados
3. **Semana 3:** Atualização do frontend
4. **Semana 4:** Testes e deploy

**Quer que eu crie os arquivos de código prontos para você começar?**
