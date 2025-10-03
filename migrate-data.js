// ========================================
// SCRIPT DE MIGRAÇÃO DE DADOS
// LocalStorage → Supabase
// ========================================

class DataMigration {
    constructor() {
        this.supabase = window.supabaseClient
        this.stats = {
            branches: 0,
            users: 0,
            members: 0,
            ministries: 0,
            cells: 0,
            events: 0,
            donations: 0,
            baptisms: 0,
            prayers: 0,
            agenda: 0,
            leaders: 0,
            errors: []
        }
    }

    // ========================================
    // FUNÇÃO PRINCIPAL DE MIGRAÇÃO
    // ========================================

    async migrate() {
        console.log('🚀 INICIANDO MIGRAÇÃO PARA SUPABASE...\n')
        
        try {
            // 1. Migrar Filiais (primeiro, pois outras tabelas dependem)
            await this.migrateBranches()
            
            // 2. Migrar Usuários
            await this.migrateUsers()
            
            // 3. Migrar Membros
            await this.migrateMembers()
            
            // 4. Migrar Ministérios
            await this.migrateMinistries()
            
            // 5. Migrar Células
            await this.migrateCells()
            
            // 6. Migrar Eventos
            await this.migrateEvents()
            
            // 7. Migrar Doações
            await this.migrateDonations()
            
            // 8. Migrar Batismos
            await this.migrateBaptisms()
            
            // 9. Migrar Pedidos de Oração
            await this.migratePrayerRequests()
            
            // 10. Migrar Agenda
            await this.migrateAgenda()
            
            // 11. Migrar Líderes
            await this.migrateLeaders()
            
            // Mostrar resumo
            this.showSummary()
            
        } catch (error) {
            console.error('❌ ERRO CRÍTICO NA MIGRAÇÃO:', error)
            this.stats.errors.push({ type: 'CRITICAL', error: error.message })
        }
    }

    // ========================================
    // 1. MIGRAR FILIAIS
    // ========================================

    async migrateBranches() {
        console.log('📍 Migrando Filiais...')
        
        const branches = window.branches || []
        
        for (const branch of branches) {
            try {
                // Extrair cidade do nome da filial se não existir
                let city = branch.city
                let state = branch.state
                
                if (!city && branch.name) {
                    // Tentar extrair do nome (ex: "Filial - São Paulo")
                    const parts = branch.name.split('-')
                    if (parts.length > 1) {
                        city = parts[1].trim()
                    } else {
                        city = 'São Paulo' // Padrão
                    }
                }
                
                if (!state) {
                    state = 'SP' // Padrão
                }
                
                const { data, error } = await this.supabase
                    .from('branches')
                    .insert({
                        name: branch.name,
                        city: city,
                        state: state,
                        address: branch.address || '',
                        phone: branch.phone || '',
                        email: branch.email || ''
                    })
                    .select()
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar filial "${branch.name}":`, error.message)
                    this.stats.errors.push({ type: 'branch', name: branch.name, error: error.message })
                } else {
                    this.stats.branches++
                    console.log(`  ✅ Filial "${branch.name}" migrada`)
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar filial:`, err)
                this.stats.errors.push({ type: 'branch', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.branches} filiais migradas\n`)
    }

    // ========================================
    // 2. MIGRAR USUÁRIOS
    // ========================================

    async migrateUsers() {
        console.log('👤 Migrando Usuários...')
        console.log('⚠️ Pulando migração de usuários (use autenticação do Supabase)')
        console.log('✅ 0 usuários migrados (criar manualmente no Supabase)\n')
        
        // NOTA: A migração de usuários é complexa porque:
        // 1. Requer validação de email
        // 2. Precisa de confirmação de email
        // 3. IDs precisam ser UUIDs válidos
        // 
        // Recomendação: Criar usuários manualmente no Supabase ou
        // usar o sistema de auto-cadastro do frontend
    }

    // ========================================
    // 3. MIGRAR MEMBROS
    // ========================================

    async migrateMembers() {
        console.log('👥 Migrando Membros...')
        
        const members = window.sampleData?.members || []
        
        // Buscar primeira filial para usar como padrão
        const { data: branches } = await this.supabase
            .from('branches')
            .select('id')
            .limit(1)
        
        const defaultBranchId = branches && branches.length > 0 ? branches[0].id : null
        
        if (!defaultBranchId) {
            console.log('⚠️ Nenhuma filial encontrada. Pulando membros.')
            return
        }
        
        for (const member of members) {
            try {
                const { error } = await this.supabase
                    .from('members')
                    .insert({
                        branch_id: defaultBranchId, // Usar primeira filial
                        name: member.name,
                        email: member.email || '',
                        phone: member.phone || '',
                        birthdate: member.birthDate || null,
                        address: member.address || '',
                        cell: member.cell || '',
                        status: member.status || 'active'
                    })
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar membro "${member.name}":`, error.message)
                    this.stats.errors.push({ type: 'member', name: member.name, error: error.message })
                } else {
                    this.stats.members++
                    if (this.stats.members % 100 === 0) {
                        console.log(`  📊 ${this.stats.members} membros migrados...`)
                    }
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar membro:`, err)
                this.stats.errors.push({ type: 'member', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.members} membros migrados\n`)
    }

    // ========================================
    // 4. MIGRAR MINISTÉRIOS
    // ========================================

    async migrateMinistries() {
        console.log('🙏 Migrando Ministérios...')
        
        const ministries = Array.isArray(window.ministries) ? window.ministries : []
        
        if (ministries.length === 0) {
            console.log('⚠️ Nenhum ministério encontrado. Pulando.\n')
            return
        }
        
        for (const ministry of ministries) {
            try {
                const { error } = await this.supabase
                    .from('ministries')
                    .insert({
                        branch_id: ministry.branchId || null,
                        name: ministry.name,
                        description: ministry.description || '',
                        leader: ministry.leader,
                        leader_phone: ministry.leaderPhone || ''
                    })
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar ministério "${ministry.name}":`, error.message)
                    this.stats.errors.push({ type: 'ministry', name: ministry.name, error: error.message })
                } else {
                    this.stats.ministries++
                    console.log(`  ✅ Ministério "${ministry.name}" migrado`)
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar ministério:`, err)
                this.stats.errors.push({ type: 'ministry', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.ministries} ministérios migrados\n`)
    }

    // ========================================
    // 5. MIGRAR CÉLULAS
    // ========================================

    async migrateCells() {
        console.log('🏠 Migrando Células...')
        
        const cells = Array.isArray(window.cells) ? window.cells : []
        
        if (cells.length === 0) {
            console.log('⚠️ Nenhuma célula encontrada. Pulando.\n')
            return
        }
        
        for (const cell of cells) {
            try {
                const { error } = await this.supabase
                    .from('cells')
                    .insert({
                        branch_id: cell.branchId || null,
                        name: cell.name,
                        leader: cell.leader,
                        address: cell.address || '',
                        day_of_week: cell.dayOfWeek || '',
                        time: cell.time || ''
                    })
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar célula "${cell.name}":`, error.message)
                    this.stats.errors.push({ type: 'cell', name: cell.name, error: error.message })
                } else {
                    this.stats.cells++
                    console.log(`  ✅ Célula "${cell.name}" migrada`)
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar célula:`, err)
                this.stats.errors.push({ type: 'cell', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.cells} células migradas\n`)
    }

    // ========================================
    // 6. MIGRAR EVENTOS
    // ========================================

    async migrateEvents() {
        console.log('📅 Migrando Eventos...')
        
        const events = Array.isArray(window.events) ? window.events : []
        
        if (events.length === 0) {
            console.log('⚠️ Nenhum evento encontrado. Pulando.\n')
            return
        }
        
        for (const event of events) {
            try {
                const { error } = await this.supabase
                    .from('events')
                    .insert({
                        branch_id: event.branchId || null,
                        title: event.title,
                        description: event.description || '',
                        date: event.date,
                        time: event.time || '',
                        location: event.location || ''
                    })
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar evento "${event.title}":`, error.message)
                    this.stats.errors.push({ type: 'event', name: event.title, error: error.message })
                } else {
                    this.stats.events++
                    if (this.stats.events % 50 === 0) {
                        console.log(`  📊 ${this.stats.events} eventos migrados...`)
                    }
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar evento:`, err)
                this.stats.errors.push({ type: 'event', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.events} eventos migrados\n`)
    }

    // ========================================
    // 7. MIGRAR DOAÇÕES
    // ========================================

    async migrateDonations() {
        console.log('💰 Migrando Doações...')
        
        const donations = Array.isArray(window.donations) ? window.donations : []
        
        if (donations.length === 0) {
            console.log('⚠️ Nenhuma doação encontrada. Pulando.\n')
            return
        }
        
        for (const donation of donations) {
            try {
                const { error } = await this.supabase
                    .from('donations')
                    .insert({
                        branch_id: donation.branchId || null,
                        donor: donation.donor,
                        type: donation.type,
                        amount: donation.amount,
                        method: donation.method || '',
                        date: donation.date,
                        notes: donation.notes || ''
                    })
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar doação:`, error.message)
                    this.stats.errors.push({ type: 'donation', error: error.message })
                } else {
                    this.stats.donations++
                    if (this.stats.donations % 100 === 0) {
                        console.log(`  📊 ${this.stats.donations} doações migradas...`)
                    }
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar doação:`, err)
                this.stats.errors.push({ type: 'donation', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.donations} doações migradas\n`)
    }

    // ========================================
    // 8. MIGRAR BATISMOS
    // ========================================

    async migrateBaptisms() {
        console.log('💧 Migrando Batismos...')
        
        const baptisms = Array.isArray(window.baptisms) ? window.baptisms : []
        
        if (baptisms.length === 0) {
            console.log('⚠️ Nenhum batismo encontrado. Pulando.\n')
            return
        }
        
        for (const baptism of baptisms) {
            try {
                const { error } = await this.supabase
                    .from('baptisms')
                    .insert({
                        branch_id: baptism.branchId || null,
                        name: baptism.name,
                        email: baptism.email || '',
                        baptism_date: baptism.baptismDate || baptism.date || null,
                        pastor: baptism.pastor || '',
                        location: baptism.location || '',
                        status: baptism.status || 'pending'
                    })
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar batismo "${baptism.name}":`, error.message)
                    this.stats.errors.push({ type: 'baptism', name: baptism.name, error: error.message })
                } else {
                    this.stats.baptisms++
                    console.log(`  ✅ Batismo de "${baptism.name}" migrado`)
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar batismo:`, err)
                this.stats.errors.push({ type: 'baptism', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.baptisms} batismos migrados\n`)
    }

    // ========================================
    // 9. MIGRAR PEDIDOS DE ORAÇÃO
    // ========================================

    async migratePrayerRequests() {
        console.log('🙏 Migrando Pedidos de Oração...')
        
        const prayers = Array.isArray(window.prayerRequests) ? window.prayerRequests : []
        
        if (prayers.length === 0) {
            console.log('⚠️ Nenhum pedido de oração encontrado. Pulando.\n')
            return
        }
        
        for (const prayer of prayers) {
            try {
                const { error } = await this.supabase
                    .from('prayer_requests')
                    .insert({
                        branch_id: prayer.branchId || null,
                        requester: prayer.requester,
                        request: prayer.request,
                        status: prayer.status || 'pending',
                        date: prayer.date || new Date().toISOString()
                    })
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar pedido de oração:`, error.message)
                    this.stats.errors.push({ type: 'prayer', error: error.message })
                } else {
                    this.stats.prayers++
                    console.log(`  ✅ Pedido de "${prayer.requester}" migrado`)
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar pedido:`, err)
                this.stats.errors.push({ type: 'prayer', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.prayers} pedidos migrados\n`)
    }

    // ========================================
    // 10. MIGRAR AGENDA
    // ========================================

    async migrateAgenda() {
        console.log('📆 Migrando Agenda do Pastor...')
        
        const agendaItems = Array.isArray(window.agenda) ? window.agenda : []
        
        if (agendaItems.length === 0) {
            console.log('⚠️ Nenhum item de agenda encontrado. Pulando.\n')
            return
        }
        
        for (const item of agendaItems) {
            try {
                const { error } = await this.supabase
                    .from('agenda')
                    .insert({
                        branch_id: item.branchId || null,
                        title: item.title,
                        description: item.description || '',
                        date: item.date,
                        time: item.time || '',
                        location: item.location || '',
                        priority: item.priority || 'medium'
                    })
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar agenda "${item.title}":`, error.message)
                    this.stats.errors.push({ type: 'agenda', name: item.title, error: error.message })
                } else {
                    this.stats.agenda++
                    console.log(`  ✅ Agenda "${item.title}" migrada`)
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar agenda:`, err)
                this.stats.errors.push({ type: 'agenda', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.agenda} itens de agenda migrados\n`)
    }

    // ========================================
    // 11. MIGRAR LÍDERES
    // ========================================

    async migrateLeaders() {
        console.log('👑 Migrando Líderes...')
        
        const leaders = Array.isArray(window.leaders) ? window.leaders : []
        
        if (leaders.length === 0) {
            console.log('⚠️ Nenhum líder encontrado. Pulando.\n')
            return
        }
        
        for (const leader of leaders) {
            try {
                const { error } = await this.supabase
                    .from('leaders')
                    .insert({
                        branch_id: leader.branchId || null,
                        name: leader.name,
                        role: leader.role || 'Líder',
                        phone: leader.phone || '',
                        email: leader.email || ''
                    })
                
                if (error) {
                    console.error(`  ❌ Erro ao migrar líder "${leader.name}":`, error.message)
                    this.stats.errors.push({ type: 'leader', name: leader.name, error: error.message })
                } else {
                    this.stats.leaders++
                    console.log(`  ✅ Líder "${leader.name}" migrado`)
                }
            } catch (err) {
                console.error(`  ❌ Exceção ao migrar líder:`, err)
                this.stats.errors.push({ type: 'leader', error: err.message })
            }
        }
        
        console.log(`✅ ${this.stats.leaders} líderes migrados\n`)
    }

    // ========================================
    // MOSTRAR RESUMO
    // ========================================

    showSummary() {
        console.log('\n' + '='.repeat(50))
        console.log('📊 RESUMO DA MIGRAÇÃO')
        console.log('='.repeat(50))
        console.log(`✅ Filiais:           ${this.stats.branches}`)
        console.log(`✅ Usuários:          ${this.stats.users}`)
        console.log(`✅ Membros:           ${this.stats.members}`)
        console.log(`✅ Ministérios:       ${this.stats.ministries}`)
        console.log(`✅ Células:           ${this.stats.cells}`)
        console.log(`✅ Eventos:           ${this.stats.events}`)
        console.log(`✅ Doações:           ${this.stats.donations}`)
        console.log(`✅ Batismos:          ${this.stats.baptisms}`)
        console.log(`✅ Pedidos Oração:    ${this.stats.prayers}`)
        console.log(`✅ Agenda:            ${this.stats.agenda}`)
        console.log(`✅ Líderes:           ${this.stats.leaders}`)
        console.log('='.repeat(50))
        
        const total = this.stats.branches + this.stats.users + this.stats.members + 
                     this.stats.ministries + this.stats.cells + this.stats.events + 
                     this.stats.donations + this.stats.baptisms + this.stats.prayers + 
                     this.stats.agenda + this.stats.leaders
        
        console.log(`📦 TOTAL MIGRADO:     ${total} registros`)
        
        if (this.stats.errors.length > 0) {
            console.log(`❌ ERROS:             ${this.stats.errors.length}`)
            console.log('\n📋 Detalhes dos erros:')
            this.stats.errors.forEach((err, i) => {
                console.log(`  ${i + 1}. [${err.type}] ${err.name || ''}: ${err.error}`)
            })
        } else {
            console.log('✅ SEM ERROS!')
        }
        
        console.log('='.repeat(50))
        console.log('🎉 MIGRAÇÃO CONCLUÍDA!\n')
    }
}

// ========================================
// FUNÇÕES DE UTILIDADE
// ========================================

// Executar migração
async function runMigration() {
    if (!window.supabaseClient) {
        console.error('❌ Supabase não está configurado! Configure primeiro.')
        return
    }
    
    if (!confirm('⚠️ ATENÇÃO: Isso irá migrar TODOS os dados para o Supabase.\n\nTem certeza que deseja continuar?')) {
        console.log('❌ Migração cancelada pelo usuário')
        return
    }
    
    const migration = new DataMigration()
    await migration.migrate()
}

// Limpar dados do Supabase (CUIDADO!)
async function clearSupabaseData() {
    if (!confirm('⚠️ PERIGO: Isso irá DELETAR TODOS os dados do Supabase!\n\nTem ABSOLUTA certeza?')) {
        return
    }
    
    if (!confirm('⚠️ ÚLTIMA CONFIRMAÇÃO: Deletar tudo mesmo?')) {
        return
    }
    
    console.log('🗑️ Limpando dados do Supabase...')
    
    const tables = [
        'agenda', 'prayer_requests', 'baptisms', 'donations', 
        'events', 'cells', 'ministries', 'leaders', 'members', 
        'users', 'branches'
    ]
    
    for (const table of tables) {
        const { error } = await window.supabaseClient
            .from(table)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // Deleta tudo
        
        if (error) {
            console.error(`❌ Erro ao limpar ${table}:`, error.message)
        } else {
            console.log(`✅ ${table} limpo`)
        }
    }
    
    console.log('✅ Limpeza concluída!')
}

// Exportar funções
window.runMigration = runMigration
window.clearSupabaseData = clearSupabaseData

console.log('📦 Script de migração carregado!')
console.log('💡 Para migrar, execute: runMigration()')
console.log('⚠️ Para limpar Supabase, execute: clearSupabaseData()')
