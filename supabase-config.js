// ========================================
// CONFIGURAÇÃO DO SUPABASE
// ========================================

// IMPORTANTE: Credenciais do Supabase configuradas
// Obtenha em: https://supabase.com → Seu Projeto → Settings → API
const SUPABASE_URL = 'https://fhtxblnwqporqgeflybl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodHhibG53cXBvcnFnZWZseWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTY4MDMsImV4cCI6MjA3NTAzMjgwM30.HwBMDhSJ3C2ln10QIgbth3x1FoKQezJuQMStjAlqAJ0'

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Exportar para uso global
window.supabaseClient = supabase

// Verificar conexão
supabase.from('branches').select('count').then(({ data, error }) => {
    if (error) {
        console.error('❌ Erro ao conectar com Supabase:', error.message)
    } else {
        console.log('✅ Supabase conectado com sucesso!')
    }
})

// Listener para mudanças de autenticação
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event)
    
    if (event === 'SIGNED_IN') {
        console.log('✅ Usuário logado:', session.user.email)
    } else if (event === 'SIGNED_OUT') {
        console.log('👋 Usuário deslogado')
    }
})
