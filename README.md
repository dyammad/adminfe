# Sistema de Gestão da Igreja com Controle de Usuários Granular

Um sistema completo para gerenciamento de igrejas com sistema avançado de autenticação e autorização, incluindo membros, ministérios, células, eventos, finanças e controle granular de permissões.

## 🆕 NOVO: Sistema de Usuários Granular

### 🔐 Autenticação e Autorização
- **Sistema de Login Seguro**: Autenticação com diferentes níveis de acesso
- **Roles Hierárquicos**: 8 níveis diferentes de usuário (Super Admin a Visitante)
- **Permissões Granulares**: Controle específico por funcionalidade
- **Sessões Seguras**: Timeout automático e controle de sessão
- **Logs de Auditoria**: Registro completo de atividades do sistema

### 👤 Usuários Padrão
| Usuário | Senha | Role | Acesso |
|---------|-------|------|--------|
| `admin` | `admin123` | Super Administrador | Acesso total |
| `pastor` | `pastor123` | Pastor | Acesso pastoral |
| `secretaria` | `sec123` | Secretário(a) | Membros e eventos |
| `tesoureiro` | `tes123` | Tesoureiro(a) | Finanças |
| `lider1` | `lider123` | Líder | Ministérios e células |

### 🎯 Níveis de Acesso
1. **Super Administrador (100)** - Controle total do sistema
2. **Administrador (90)** - Gestão administrativa completa
3. **Pastor (80)** - Acesso pastoral e administrativo
4. **Líder (70)** - Ministérios, células e eventos
5. **Secretário(a) (60)** - Membros, visitantes e eventos
6. **Tesoureiro(a) (50)** - Controle financeiro completo
7. **Membro (30)** - Visualização básica
8. **Visitante (10)** - Acesso muito limitado

## 📋 Funcionalidades Principais

### 📊 Dashboard Adaptativo
- Visão geral personalizada por role
- Estatísticas baseadas nas permissões
- Gráficos de crescimento
- Resumo financeiro (se autorizado)

### 👥 Gestão de Membros
- **Membros Ativos**: Cadastro e gerenciamento (permissão: `members.view/create/edit`)
- **Membros Inativos**: Controle de afastados
- **Visitantes**: Registro e acompanhamento
- **Exportação**: Dados para relatórios (permissão: `members.export`)

### ⛪ Ministérios e Liderança
- **Ministérios**: Criação e gestão (permissão: `ministries.*`)
- **Líderes**: Cadastro hierárquico (permissão: `leaders.*`)
- **Células**: Organização domiciliar (permissão: `cells.*`)

### 📅 Eventos e Agenda
- **Eventos**: Criação e gestão (permissão: `events.*`)
- **Agenda do Pastor**: Controle pastoral (permissão: `agenda.*`)
- **Compromissos**: Agendamento de atividades

### 💰 Gestão Financeira
- **Tesouraria**: Receitas e despesas (permissão: `treasury.*`)
- **Doações**: Dízimos e ofertas (permissão: `donations.*`)
- **Relatórios**: Financeiros detalhados (permissão: `treasury.reports`)

### 🙏 Atividades Espirituais
- **Pedidos de Oração**: Gestão de pedidos (permissão: `prayers.*`)
- **Batismos**: Agendamento e controle (permissão: `baptisms.*`)

### 🛡️ Administração do Sistema
- **Gerenciamento de Usuários**: CRUD completo de usuários
- **Controle de Permissões**: Visualização e edição granular
- **Logs de Atividade**: Auditoria completa do sistema
- **Backup e Restauração**: Controle de dados (Super Admin)

## 🔑 Permissões Granulares

### Módulos de Permissão
- **members**: Gestão de membros
- **treasury**: Controle financeiro
- **ministries**: Ministérios
- **cells**: Células
- **events**: Eventos
- **leaders**: Liderança
- **baptisms**: Batismos
- **prayers**: Pedidos de oração
- **donations**: Doações
- **agenda**: Agenda pastoral
- **system**: Administração do sistema
- **dashboard**: Painel de controle

### Tipos de Ação
- **view**: Visualizar dados
- **create**: Criar novos registros
- **edit**: Editar registros existentes
- **delete**: Excluir registros
- **export**: Exportar dados
- **reports**: Gerar relatórios

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilização responsiva e moderna
- **JavaScript ES6+**: Funcionalidades avançadas
- **Chart.js**: Gráficos e visualizações
- **Font Awesome**: Ícones
- **LocalStorage**: Armazenamento seguro local

## 📁 Estrutura do Projeto

```
├── index.html              # Página principal
├── styles.css              # Estilos principais
├── auth-styles.css         # Estilos do sistema de autenticação
├── script.js               # Funcionalidades principais
├── auth-system.js          # Sistema de autenticação
├── user-management.js      # Gerenciamento de usuários
├── sample-data.js          # Dados de exemplo
├── SISTEMA_USUARIOS.md     # Documentação do sistema de usuários
└── README.md              # Documentação principal
```

## 🔧 Como Usar

### 1. Primeiro Acesso
1. Abra o sistema no navegador
2. Use as credenciais de Super Admin: `admin` / `admin123`
3. Acesse "Gerenciar Usuários" no menu lateral
4. Crie usuários adicionais conforme necessário

### 2. Login com Diferentes Roles
1. Faça logout do sistema
2. Teste com diferentes usuários (pastor, secretaria, etc.)
3. Observe como a interface se adapta às permissões
4. Explore as funcionalidades disponíveis para cada role

### 3. Gerenciamento de Usuários
1. **Criar Usuário**: Defina nome, email, role e permissões
2. **Editar Usuário**: Modifique dados e permissões
3. **Visualizar Permissões**: Veja todas as permissões de um usuário
4. **Logs de Atividade**: Monitore ações no sistema

## 🛡️ Segurança

### Recursos Implementados
- ✅ Autenticação baseada em sessão
- ✅ Timeout automático (30 minutos)
- ✅ Logs de auditoria completos
- ✅ Controle granular de permissões
- ✅ Prevenção de auto-exclusão
- ✅ Validação de dados

### Para Produção (Recomendações)
- 🔒 Implementar hash de senhas (bcrypt)
- 🔒 HTTPS obrigatório
- 🔒 Autenticação 2FA
- 🔒 Rate limiting para login
- 🔒 Backup automático
- 🔒 Monitoramento de segurança

## 📱 Interface Responsiva

### Características
- **Adaptativa**: Interface muda baseada nas permissões
- **Responsiva**: Funciona em todos os dispositivos
- **Moderna**: Design limpo e intuitivo
- **Acessível**: Suporte a navegação por teclado

### Dispositivos Suportados
- 💻 Desktops (1920px+)
- 💻 Laptops (1366px+)
- 📱 Tablets (768px+)
- 📱 Smartphones (320px+)

## 🎨 Personalização

### Cores por Role
Cada role tem uma cor específica para identificação visual:
- **Super Admin**: Vermelho (#e74c3c)
- **Admin**: Laranja (#f39c12)
- **Pastor**: Roxo (#9b59b6)
- **Líder**: Azul (#3498db)
- **Secretário**: Verde (#2ecc71)
- **Tesoureiro**: Turquesa (#1abc9c)
- **Membro**: Cinza (#95a5a6)
- **Visitante**: Cinza claro (#bdc3c7)

### Customização
1. **Adicionar Permissões**: Edite `auth-system.js`
2. **Criar Roles**: Adicione novos níveis de acesso
3. **Modificar Interface**: Ajuste `auth-styles.css`
4. **Personalizar Cores**: Altere esquema de cores

## 📊 Dados de Exemplo

### Inclusos no Sistema
- 400+ membros fictícios
- 30+ ministérios
- 25+ células
- 5 usuários padrão
- Dados financeiros
- Eventos programados
- Pedidos de oração
- Batismos agendados

## 🔧 Personalização

O sistema pode ser facilmente personalizado:
- **Cores**: Modifique as variáveis CSS
- **Logo**: Substitua o ícone da igreja
- **Dados**: Adapte os dados de exemplo
- **Funcionalidades**: Adicione novas seções conforme necessário

## 📈 Próximas Funcionalidades

- Sistema de relatórios avançados
- Integração com sistemas de pagamento
- Notificações automáticas
- Backup automático de dados
- Integração com redes sociais
- Sistema de mensagens

## 🤝 Suporte

Para suporte e melhorias, entre em contato com a equipe de desenvolvimento.

---

**Sistema de Gestão da Igreja** - Desenvolvido para facilitar a administração eclesiástica com eficiência e modernidade.

## 🐉 Ifrit Inventory — Coleção Final Fantasy

O repositório inclui uma mini‑aplicação estática para organizar coleções de Final Fantasy.

• Caminho: `ifrit-inventory/`

• Como abrir:
  1. Abra `ifrit-inventory/index.html` no navegador
  2. Use a barra de busca, filtros e categorias (Jogos, Livros, Loterias FFVII Remake/FFXVI, etc.)
  3. Ordene por nome, ano ou raridade

• Observações de deploy (Hostinger):
  - Envie a pasta `ifrit-inventory/` para `public_html/`
  - Acesse por `https://seu-dominio/ifrit-inventory/`
  - Garanta que permissões estejam em 755 (pastas) e 644 (arquivos)
