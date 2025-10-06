# CRM de Honorários Advocatícios

Sistema completo de gerenciamento de honorários advocatícios com frontend React e backend Node.js.

## 🚀 Tecnologias

### Frontend
- **React 19** com TypeScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **React Hooks** - Gerenciamento de estado
- **Vitest** - Framework de testes
- **Sentry** - Monitoramento de erros e performance
- **LogRocket** - Session replay e analytics

### Backend
- **Node.js** com Express
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados (produção) / SQLite (desenvolvimento)
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Zod** - Validação de dados
- **express-rate-limit** - Proteção contra ataques de força bruta
- **Jest** - Framework de testes
- **Sentry** - Monitoramento de erros e profiling

### DevOps & Infraestrutura
- **GitHub Actions** - CI/CD automatizado
- **CodeQL** - Análise de segurança
- **Backup Automático** - Backup diário do banco de dados
- **Vercel** - Deploy e hosting

## 📋 Funcionalidades

### Core Features
- ✅ **Gestão de Contatos** - Cadastro e gerenciamento de clientes
- ✅ **Gestão de Acordos** - Controle completo de acordos e parcelas
- ✅ **Dashboard** - Visão geral com estatísticas e gráficos
- ✅ **Relatórios** - Análise de desempenho e métricas
- ✅ **Tarefas** - Gerenciamento de tarefas e prazos
- ✅ **Calendário** - Visualização de vencimentos
- ✅ **Autenticação** - Sistema de login seguro com JWT
- ✅ **Notificações** - Alertas de vencimentos e atrasos
- ✅ **Log de Atividades** - Histórico de ações

### Monitoramento & Observabilidade
- ✅ **Error Tracking** - Sentry integrado (frontend e backend)
- ✅ **Session Replay** - LogRocket para debug de problemas
- ✅ **Performance Monitoring** - Métricas de performance em tempo real
- ✅ **Health Checks** - Endpoint de monitoramento de saúde

### Qualidade & Automação
- ✅ **Testes Automatizados** - Vitest (frontend) e Jest (backend)
- ✅ **CI/CD Pipeline** - GitHub Actions com deploy automático
- ✅ **Security Scanning** - CodeQL para análise de segurança
- ✅ **Backup Automático** - Backup diário do banco de dados
- ✅ **Code Coverage** - Relatórios de cobertura de testes

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/Maycon-adv/crm-honorarios.git
cd crm-honorarios
```

### 2. Instale as dependências do Frontend
```bash
npm install
```

### 3. Instale as dependências do Backend
```bash
cd backend
npm install
```

### 4. Configure as variáveis de ambiente

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api

# Opcional - Monitoramento (obtenha em sentry.io e logrocket.com)
VITE_SENTRY_DSN=
VITE_LOGROCKET_APP_ID=
VITE_GEMINI_API_KEY=
```

**Frontend (produção):** copie `.env.production.example` para `.env.production.local` e reutilize as credenciais existentes (o arquivo `.env.production` fica fora do versionamento).

**Backend (backend/.env):**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu-secret-super-seguro-aqui"
PORT=3001

# Opcional - Monitoramento (obtenha em sentry.io)
SENTRY_DSN=
```

### 5. Configure o banco de dados
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
npm run seed
```

Isso criará um usuário admin padrão:
- **Email:** admin@crm.com
- **Senha:** admin123

## 🚀 Executando o projeto

### Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Servidor rodará em: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Aplicação rodará em: http://localhost:5173

## 📁 Estrutura do Projeto

```
crm-honorarios/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Schema do banco de dados
│   │   ├── migrations/          # Migrações do Prisma
│   │   └── seed.ts             # Seed do banco
│   ├── src/
│   │   ├── controllers/        # Lógica de negócio
│   │   ├── middleware/         # Middlewares (auth, errors)
│   │   ├── routes/             # Rotas da API
│   │   ├── validators/         # Validação com Zod
│   │   ├── types/              # Tipos TypeScript
│   │   └── server.ts           # Servidor Express
│   └── package.json
├── src/
│   ├── components/             # Componentes React
│   ├── hooks/                  # Custom hooks
│   ├── services/               # API client
│   ├── contexts.ts             # Contextos React
│   ├── types.ts                # Tipos TypeScript
│   └── App.tsx                 # Component principal
├── public/                     # Arquivos estáticos
└── package.json
```

## 🔐 API Endpoints

📖 **Documentação completa da API:** [API.md](./API.md)

### Principais Endpoints

**Autenticação:**
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login (max 5 tentativas/15min)

**Contatos:**
- `GET /api/contacts` - Listar contatos
- `POST /api/contacts` - Criar contato
- `PUT /api/contacts/:id` - Atualizar contato
- `DELETE /api/contacts/:id` - Deletar contato

**Acordos:**
- `GET /api/agreements` - Listar acordos
- `POST /api/agreements` - Criar acordo
- `PUT /api/agreements/:id` - Atualizar acordo
- `DELETE /api/agreements/:id` - Deletar acordo

**Tarefas:**
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

## 🎨 Features Técnicas

### Mapeamento de Enums
O sistema possui mapeamento automático entre valores em português (frontend) e inglês (backend):
- `Pré-execução` ↔ `PreExecution`
- `Em Dia` ↔ `OnTime`
- `Boleto Bancário` ↔ `Boleto`
- etc.

### Validação
- Frontend: Validação de formulários
- Backend: Validação com Zod schemas

### Segurança
- Senhas hasheadas com bcrypt (salt rounds: 10)
- Autenticação JWT com tokens de 7 dias
- Rate limiting (5 tentativas de login por 15 min)
- CORS configurado para domínios permitidos
- Validação de dados no backend e frontend

## 📝 Scripts Disponíveis

### Frontend
- `npm run dev` - Inicia dev server
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa ESLint
- `npm run test` - Executa testes
- `npm run test:ui` - Interface visual de testes
- `npm run test:coverage` - Relatório de cobertura

### Backend
- `npm run dev` - Inicia servidor em modo dev
- `npm run build` - Compila TypeScript
- `npm run start` - Inicia servidor compilado
- `npm run vercel-build` - Build para produção (Vercel)
- `npm run prisma:migrate` - Executa migrações
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:seed` - Popula banco com dados iniciais
- `npm run test` - Executa testes
- `npm run test:watch` - Testes em watch mode
- `npm run test:coverage` - Relatório de cobertura
- `npm run backup:create` - Cria backup do banco
- `npm run backup:list` - Lista backups disponíveis
- `npm run backup:restore` - Restaura backup

## 🚀 Deploy

### Produção (Vercel)

O projeto está configurado para deploy no Vercel. Consulte o [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) para instruções detalhadas.

**URLs de Produção:**
- Frontend: `https://crm-honorarios.vercel.app`
- Backend: `https://crm-honorarios-backend.vercel.app`

**Pré-requisitos para deploy:**
1. Conta no Vercel
2. Banco de dados PostgreSQL (Neon ou Vercel Postgres)
3. Variáveis de ambiente configuradas

## 📚 Documentação

- **[Guia do Usuário](./GUIA-USUARIO.md)** - Documentação completa para usuários finais
- **[Guia de Testes](./TESTING.md)** - Como escrever e executar testes
- **[Guia de Monitoramento](./MONITORING.md)** - Configuração de Sentry, LogRocket e CI/CD
- **[API Documentation](./API.md)** - Documentação detalhada da API
- **[Deploy Guide](./DEPLOY-GUIDE.md)** - Guia de deploy no Vercel

## 🧪 Testes

### Executando Testes

**Frontend:**
```bash
npm run test          # Roda todos os testes
npm run test:ui       # Interface visual
npm run test:coverage # Relatório de cobertura
```

**Backend:**
```bash
cd backend
npm run test          # Roda todos os testes
npm run test:watch    # Watch mode
npm run test:coverage # Relatório de cobertura
```

### CI/CD

O projeto possui pipeline completo no GitHub Actions:
- ✅ Testes automatizados (frontend e backend)
- ✅ Linting e code quality
- ✅ Security audit (npm audit + CodeQL)
- ✅ Deploy automático no Vercel (branch main)
- ✅ Backup diário do banco de dados

## 📊 Monitoramento

### Sentry (Error Tracking)

Configure o Sentry para monitoramento de erros:

1. Crie conta em [sentry.io](https://sentry.io)
2. Crie projetos para frontend (React) e backend (Node.js)
3. Adicione os DSNs no `.env`:
   ```env
   VITE_SENTRY_DSN=your-frontend-dsn
   SENTRY_DSN=your-backend-dsn
   ```

### LogRocket (Session Replay)

Configure o LogRocket para gravação de sessões:

1. Crie conta em [logrocket.com](https://logrocket.com)
2. Crie um novo projeto
3. Adicione o App ID no `.env`:
   ```env
   VITE_LOGROCKET_APP_ID=your-app-id/project-name
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

Consulte o [MONITORING.md](./MONITORING.md) para configuração detalhada.

## 💾 Backup

### Backup Automático

O sistema possui backup automático via GitHub Actions:
- Roda diariamente às 2h UTC
- Mantém backups por 30 dias
- Pode ser executado manualmente

### Backup Manual

```bash
cd backend
npm run backup:create    # Criar backup
npm run backup:list      # Listar backups
npm run backup:restore   # Restaurar backup
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Escreva testes para sua feature
4. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
5. Push para a branch (`git push origin feature/MinhaFeature`)
6. Abra um Pull Request

O CI/CD irá executar automaticamente:
- Testes
- Linting
- Security scan
- Build

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Maycon**
- GitHub: [@Maycon-adv](https://github.com/Maycon-adv)

---

🤖 Desenvolvido com [Claude Code](https://claude.com/claude-code)
