# Sistema de Usuários Granular - Igreja

## 📋 Visão Geral

Este sistema implementa um controle de acesso granular para o sistema de gestão da igreja, com diferentes níveis de usuários e permissões específicas para cada funcionalidade.

## 🔐 Usuários Padrão

O sistema vem com os seguintes usuários pré-configurados:

| Usuário | Senha | Role | Descrição |
|---------|-------|------|-----------|
| `admin` | `admin123` | Super Administrador | Acesso total ao sistema |
| `pastor` | `pastor123` | Pastor | Acesso pastoral e administrativo |
| `secretaria` | `sec123` | Secretário(a) | Acesso a membros e eventos |
| `tesoureiro` | `tes123` | Tesoureiro(a) | Acesso financeiro |
| `lider1` | `lider123` | Líder | Acesso a ministérios e células |

## 👥 Roles e Níveis de Acesso

### Super Administrador (Nível 100)
- ✅ Acesso total ao sistema
- ✅ Gerenciamento de usuários
- ✅ Backup e restauração
- ✅ Logs do sistema

### Administrador (Nível 90)
- ✅ Acesso administrativo completo
- ✅ Criação de usuários
- ✅ Backup do sistema
- ❌ Exclusão de usuários

### Pastor (Nível 80)
- ✅ Acesso pastoral e administrativo
- ✅ Gerenciamento de líderes
- ✅ Agenda pastoral
- ✅ Batismos e ministérios

### Líder (Nível 70)
- ✅ Ministérios e células
- ✅ Eventos
- ✅ Agenda
- ❌ Finanças

### Secretário(a) (Nível 60)
- ✅ Membros e visitantes
- ✅ Eventos
- ✅ Pedidos de oração
- ❌ Finanças avançadas

### Tesoureiro(a) (Nível 50)
- ✅ Finanças completas
- ✅ Doações
- ✅ Relatórios financeiros
- ❌ Gerenciamento de usuários

### Membro (Nível 30)
- ✅ Visualização básica
- ✅ Pedidos de oração
- ❌ Edição de dados

### Visitante (Nível 10)
- ✅ Acesso muito limitado
- ❌ Maioria das funcionalidades

## 🔑 Permissões Granulares

### Membros
- `members.view` - Visualizar membros
- `members.create` - Criar membros
- `members.edit` - Editar membros
- `members.delete` - Excluir membros
- `members.export` - Exportar dados

### Finanças
- `treasury.view` - Visualizar finanças
- `treasury.create` - Criar transações
- `treasury.edit` - Editar transações
- `treasury.delete` - Excluir transações
- `treasury.reports` - Relatórios financeiros

### Ministérios
- `ministries.view` - Visualizar ministérios
- `ministries.create` - Criar ministérios
- `ministries.edit` - Editar ministérios
- `ministries.delete` - Excluir ministérios

### Células
- `cells.view` - Visualizar células
- `cells.create` - Criar células
- `cells.edit` - Editar células
- `cells.delete` - Excluir células

### Eventos
- `events.view` - Visualizar eventos
- `events.create` - Criar eventos
- `events.edit` - Editar eventos
- `events.delete` - Excluir eventos

### Sistema
- `users.view` - Visualizar usuários
- `users.create` - Criar usuários
- `users.edit` - Editar usuários
- `users.delete` - Excluir usuários
- `system.backup` - Backup do sistema
- `system.logs` - Visualizar logs

## 🔧 Como Usar

### 1. Auto-Cadastro (Pessoas de Fora)
1. **Acesse a página principal** do sistema
2. **Clique em "Cadastre-se como Visitante"** na tela de login
3. **Preencha o formulário** com seus dados:
   - Nome completo
   - Email
   - Telefone (opcional)
   - Data de nascimento (opcional)
   - Nome de usuário (para login)
   - Senha (mínimo 6 caracteres)
   - Como conheceu a igreja
4. **Aceite os termos** de uso
5. **Clique em "Cadastrar"**
6. **Aguarde aprovação** de um administrador

### 2. Login no Sistema
1. Acesse a página principal
2. Use um dos usuários padrão listados acima OU suas credenciais após aprovação
3. O sistema redirecionará automaticamente baseado nas permissões

### 3. Gerenciar Usuários (Admin/Super Admin)
1. Faça login como `admin` ou usuário com permissões administrativas
2. No menu lateral, clique em "Gerenciar Usuários"
3. Visualize, crie, edite ou exclua usuários
4. Configure permissões customizadas se necessário

### 4. Aprovar Novos Cadastros (Admin/Super Admin)
1. **Acesse "Gerenciar Usuários"** no menu lateral
2. **Visualize a seção "Cadastros Pendentes"** (aparece quando há novos cadastros)
3. **Revise os dados** do visitante que se cadastrou
4. **Clique em "Aprovar"** para ativar o usuário OU **"Rejeitar"** para negar
5. **Usuários aprovados** podem fazer login imediatamente
6. **Usuários rejeitados** são removidos do sistema

### 3. Interface Adaptativa
- O menu lateral mostra apenas as opções que o usuário tem permissão
- Botões de ação (criar, editar, excluir) aparecem baseados nas permissões
- Indicador visual do role do usuário no cabeçalho

### 4. Sessão e Segurança
- Sessões expiram automaticamente em 30 minutos
- Logs de atividade são mantidos para auditoria
- Tentativas de login falhadas são registradas

## 🔧 Funcionalidades Técnicas

### Autenticação
- Sistema de login seguro
- Verificação de sessão automática
- Timeout de sessão configurável
- Logs de auditoria

### Autorização
- Permissões baseadas em roles
- Permissões customizadas por usuário
- Verificação granular de acesso
- Interface adaptativa

### Gerenciamento
- CRUD completo de usuários
- Filtros e busca avançada
- Estatísticas de usuários
- Logs de atividade

### Segurança
- Senhas protegidas (em produção usar hash)
- Prevenção de auto-exclusão
- Validação de dados
- Controle de sessão

## 📱 Interface do Usuário

### Dashboard Adaptativo
- Estatísticas baseadas nas permissões
- Gráficos e métricas relevantes
- Acesso rápido às funcionalidades

### Menu Lateral Dinâmico
- Itens mostrados baseados nas permissões
- Indicadores visuais de role
- Navegação intuitiva

### Notificações
- Sistema de mensagens integrado
- Feedback visual das ações
- Alertas de segurança

## 🛠️ Personalização

### Adicionar Novas Permissões
1. Edite o arquivo `auth-system.js`
2. Adicione a nova permissão no objeto `permissions`
3. Configure o nível mínimo necessário
4. Atualize a interface conforme necessário

### Criar Novos Roles
1. Adicione o novo role no objeto `roles`
2. Configure nome, descrição, nível e cor
3. Teste as permissões resultantes

### Customizar Interface
1. Edite `auth-styles.css` para estilos
2. Modifique `user-management.js` para funcionalidades
3. Atualize `script.js` para integrações

## 🔍 Logs e Auditoria

O sistema mantém logs detalhados de:
- Logins e logouts
- Criação/edição/exclusão de usuários
- Tentativas de acesso negadas
- Ações administrativas

Acesse os logs através do botão "Logs de Atividade" na tela de gerenciamento de usuários.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs de atividade
2. Confirme as permissões do usuário
3. Teste com usuário administrativo
4. Consulte a documentação técnica

---

**Nota**: Este sistema foi desenvolvido para demonstração. Em produção, implemente:
- Hash de senhas
- HTTPS obrigatório
- Autenticação 2FA
- Backup automático
- Monitoramento de segurança
