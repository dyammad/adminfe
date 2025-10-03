# 🚀 GUIA RÁPIDO - MIGRAÇÃO PARA SUPABASE

## ⚡ 3 Passos Simples

---

## 📋 PASSO 1: CONFIGURAR SUPABASE

### 1.1 Criar Conta e Projeto
1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub
4. Clique em **"New Project"**
5. Preencha:
   - **Name:** `igreja-gestao`
   - **Database Password:** (anote em local seguro!)
   - **Region:** `South America (São Paulo)`
6. Clique em **"Create new project"**
7. Aguarde 2-3 minutos

### 1.2 Obter Credenciais
1. No projeto, vá em **Settings** (⚙️) → **API**
2. Copie:
   - **Project URL:** `https://xxxxxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (chave longa)

---

## 📋 PASSO 2: CRIAR BANCO DE DADOS

### 2.1 Executar Schema SQL
1. No Supabase, clique em **SQL Editor** (ícone de código)
2. Clique em **"New query"**
3. Abra o arquivo `supabase-schema.sql`
4. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
5. **Cole no SQL Editor** do Supabase
6. Clique em **"Run"** (ou F5)
7. Aguarde aparecer: ✅ **"Success. No rows returned"**

### 2.2 Verificar Tabelas
1. Clique em **Table Editor** (ícone de tabela)
2. Deve aparecer 11 tabelas:
   - ✅ branches
   - ✅ users
   - ✅ members
   - ✅ ministries
   - ✅ cells
   - ✅ events
   - ✅ donations
   - ✅ baptisms
   - ✅ prayer_requests
   - ✅ agenda
   - ✅ leaders

---

## 📋 PASSO 3: CONFIGURAR FRONTEND

### 3.1 Adicionar Biblioteca Supabase

Abra `index.html` e adicione **ANTES** do `</body>`:

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Configuração do Supabase -->
<script src="supabase-config.js"></script>

<!-- Script de Migração -->
<script src="migrate-data.js"></script>
```

### 3.2 Configurar Credenciais

Abra `supabase-config.js` e substitua:

```javascript
// ANTES:
const SUPABASE_URL = 'https://seu-projeto.supabase.co'
const SUPABASE_ANON_KEY = 'sua-chave-publica-aqui'

// DEPOIS (com suas credenciais):
const SUPABASE_URL = 'https://xxxxxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### 3.3 Testar Conexão

1. Abra `index.html` no navegador
2. Abra o **Console** (F12)
3. Deve aparecer:
   ```
   ✅ Supabase conectado com sucesso!
   📦 Script de migração carregado!
   ```

---

## 📋 PASSO 4: MIGRAR DADOS

### 4.1 Executar Migração

No **Console do navegador** (F12), digite:

```javascript
runMigration()
```

### 4.2 Acompanhar Progresso

Você verá no console:

```
🚀 INICIANDO MIGRAÇÃO PARA SUPABASE...

📍 Migrando Filiais...
  ✅ Filial "Filial Principal - São Paulo" migrada
  ✅ Filial "Filial - Rio de Janeiro" migrada
✅ 300 filiais migradas

👥 Migrando Membros...
  📊 100 membros migrados...
  📊 200 membros migrados...
✅ 300 membros migrados

...

📊 RESUMO DA MIGRAÇÃO
==================================================
✅ Filiais:           300
✅ Usuários:          90000
✅ Membros:           90000
✅ Ministérios:       45
✅ Células:           150
✅ Eventos:           2700
✅ Doações:           109500
✅ Batismos:          500
✅ Pedidos Oração:    200
✅ Agenda:            50
✅ Líderes:           100
==================================================
📦 TOTAL MIGRADO:     293545 registros
✅ SEM ERROS!
==================================================
🎉 MIGRAÇÃO CONCLUÍDA!
```

### 4.3 Verificar Dados Migrados

1. Volte ao Supabase
2. Clique em **Table Editor**
3. Selecione uma tabela (ex: `members`)
4. Veja os dados migrados!

---

## ✅ PRONTO!

### Seu sistema agora está rodando com Supabase! 🎉

### Próximos Passos:

1. **Testar funcionalidades:**
   - Login/Logout
   - Criar membro
   - Fazer doação
   - Criar evento

2. **Configurar Realtime:**
   - Atualizações automáticas
   - Notificações em tempo real

3. **Deploy:**
   - Vercel (recomendado)
   - Netlify
   - GitHub Pages

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Supabase não está configurado"
**Solução:** Verifique se adicionou os scripts no `index.html`

### ❌ "Error: Invalid API key"
**Solução:** Verifique se copiou a chave correta do Supabase

### ❌ "Permission denied"
**Solução:** Execute o schema SQL novamente

### ❌ Dados não aparecem
**Solução:** Verifique RLS (Row Level Security) no Supabase

---

## 🔧 COMANDOS ÚTEIS

### Limpar todos os dados (CUIDADO!)
```javascript
clearSupabaseData()
```

### Ver estatísticas
```javascript
// No Supabase SQL Editor:
SELECT * FROM branch_stats;
```

### Verificar conexão
```javascript
supabaseClient.from('branches').select('count')
```

---

## 📚 DOCUMENTAÇÃO

- **Supabase Docs:** https://supabase.com/docs
- **JavaScript Client:** https://supabase.com/docs/reference/javascript
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

---

## 💡 DICAS

1. ✅ Faça backup do localStorage antes de migrar
2. ✅ Teste em ambiente de desenvolvimento primeiro
3. ✅ Monitore o console durante a migração
4. ✅ Anote as credenciais em local seguro
5. ✅ Configure RLS para segurança

---

**🎉 Parabéns! Seu sistema agora é profissional e escalável!**
