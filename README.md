# CRM de Honorários Advocatícios

Sistema completo de gerenciamento de honorários advocatícios com frontend React e backend Node.js.

## 🚀 Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **React Hooks** - Gerenciamento de estado

### Backend
- **Node.js** com Express
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Gerenciamento de banco de dados
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Zod** - Validação de dados

## 📋 Funcionalidades

- ✅ **Gestão de Contatos** - Cadastro e gerenciamento de clientes
- ✅ **Gestão de Acordos** - Controle completo de acordos e parcelas
- ✅ **Dashboard** - Visão geral com estatísticas e gráficos
- ✅ **Relatórios** - Análise de desempenho e métricas
- ✅ **Tarefas** - Gerenciamento de tarefas e prazos
- ✅ **Calendário** - Visualização de vencimentos
- ✅ **Autenticação** - Sistema de login seguro com JWT
- ✅ **Notificações** - Alertas de vencimentos e atrasos
- ✅ **Log de Atividades** - Histórico de ações

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
```

**Frontend (produção):** copie `.env.production.example` para `.env.production.local` e reutilize as credenciais existentes (o arquivo `.env.production` fica fora do versionamento).

**Backend (backend/.env):**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu-secret-super-seguro-aqui"
PORT=3001
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

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login

### Contatos
- `GET /api/contacts` - Listar contatos
- `POST /api/contacts` - Criar contato
- `PUT /api/contacts/:id` - Atualizar contato
- `DELETE /api/contacts/:id` - Deletar contato

### Acordos
- `GET /api/agreements` - Listar acordos
- `POST /api/agreements` - Criar acordo
- `PUT /api/agreements/:id` - Atualizar acordo
- `DELETE /api/agreements/:id` - Deletar acordo
- `PUT /api/agreements/:agreementId/installments/:installmentId` - Atualizar parcela

### Tarefas
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
- Senhas hasheadas com bcrypt
- Autenticação JWT
- Tokens com expiração de 7 dias

## 📝 Scripts Disponíveis

### Frontend
- `npm run dev` - Inicia dev server
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa ESLint

### Backend
- `npm run dev` - Inicia servidor em modo dev
- `npm run build` - Compila TypeScript
- `npm run start` - Inicia servidor compilado
- `npm run prisma:migrate` - Executa migrações
- `npm run prisma:generate` - Gera Prisma Client
- `npm run seed` - Popula banco com dados iniciais

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Maycon**
- GitHub: [@Maycon-adv](https://github.com/Maycon-adv)

---

🤖 Desenvolvido com [Claude Code](https://claude.com/claude-code)
