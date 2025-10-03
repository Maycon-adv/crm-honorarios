# Documentação da API - CRM Honorários

Base URL: `https://crm-honorarios-backend.vercel.app/api`

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

### Rate Limiting

- **Rotas de autenticação:** 5 requisições a cada 15 minutos por IP
- **Outras rotas da API:** 100 requisições a cada 15 minutos por IP

---

## 📍 Endpoints

### Autenticação

#### POST `/auth/register`

Cria um novo usuário.

**Body:**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha123",
  "role": "Admin" // ou "Collaborator"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nome do Usuário",
      "email": "usuario@email.com",
      "role": "Admin",
      "createdAt": "2025-10-03T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Usuário criado com sucesso"
}
```

---

#### POST `/auth/login`

Autentica um usuário existente.

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nome do Usuário",
      "email": "usuario@email.com",
      "role": "Admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login realizado com sucesso"
}
```

---

### Contatos

> 🔒 **Requer autenticação**

#### GET `/contacts`

Lista todos os contatos.

**Query Parameters:**
- `search` (opcional): Busca por nome, email ou telefone

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Nome do Contato",
      "email": "contato@email.com",
      "phone": "(11) 99999-9999",
      "company": "Empresa LTDA",
      "position": "Gerente",
      "notes": "Observações sobre o contato",
      "createdAt": "2025-10-03T12:00:00.000Z",
      "updatedAt": "2025-10-03T12:00:00.000Z"
    }
  ]
}
```

---

#### GET `/contacts/:id`

Retorna um contato específico.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nome do Contato",
    "email": "contato@email.com",
    "phone": "(11) 99999-9999",
    "company": "Empresa LTDA",
    "position": "Gerente",
    "notes": "Observações",
    "createdAt": "2025-10-03T12:00:00.000Z",
    "updatedAt": "2025-10-03T12:00:00.000Z"
  }
}
```

---

#### POST `/contacts`

Cria um novo contato.

**Body:**
```json
{
  "name": "Nome do Contato",
  "email": "contato@email.com",
  "phone": "(11) 99999-9999",
  "company": "Empresa LTDA",
  "position": "Gerente",
  "notes": "Observações sobre o contato"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nome do Contato",
    ...
  },
  "message": "Contato criado com sucesso"
}
```

---

#### PUT `/contacts/:id`

Atualiza um contato existente.

**Body:** (todos os campos opcionais)
```json
{
  "name": "Novo Nome",
  "email": "novoemail@email.com",
  "phone": "(11) 88888-8888"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Novo Nome",
    ...
  },
  "message": "Contato atualizado com sucesso"
}
```

---

#### DELETE `/contacts/:id`

Remove um contato.

**Response (200):**
```json
{
  "success": true,
  "message": "Contato removido com sucesso"
}
```

---

### Acordos (Agreements)

> 🔒 **Requer autenticação**

#### GET `/agreements`

Lista todos os acordos.

**Query Parameters:**
- `contactId` (opcional): Filtra por ID do contato
- `status` (opcional): Filtra por status (pending, active, completed, cancelled)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Acordo de Honorários",
      "description": "Descrição do acordo",
      "amount": 5000.00,
      "status": "active",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-12-31T00:00:00.000Z",
      "contactId": "uuid",
      "contact": {
        "name": "Nome do Contato"
      },
      "createdAt": "2025-10-03T12:00:00.000Z"
    }
  ]
}
```

---

#### POST `/agreements`

Cria um novo acordo.

**Body:**
```json
{
  "title": "Acordo de Honorários",
  "description": "Descrição detalhada",
  "amount": 5000.00,
  "status": "active",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "contactId": "uuid"
}
```

---

#### PUT `/agreements/:id`

Atualiza um acordo existente.

---

#### DELETE `/agreements/:id`

Remove um acordo.

---

### Tarefas (Tasks)

> 🔒 **Requer autenticação**

#### GET `/tasks`

Lista todas as tarefas.

**Query Parameters:**
- `status` (opcional): Filtra por status (pending, in_progress, completed)
- `priority` (opcional): Filtra por prioridade (low, medium, high)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Título da Tarefa",
      "description": "Descrição",
      "status": "pending",
      "priority": "high",
      "dueDate": "2025-10-10T00:00:00.000Z",
      "contactId": "uuid",
      "contact": {
        "name": "Nome do Contato"
      },
      "createdAt": "2025-10-03T12:00:00.000Z"
    }
  ]
}
```

---

#### POST `/tasks`

Cria uma nova tarefa.

**Body:**
```json
{
  "title": "Título da Tarefa",
  "description": "Descrição detalhada",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-10-10",
  "contactId": "uuid"
}
```

---

#### PUT `/tasks/:id`

Atualiza uma tarefa existente.

---

#### DELETE `/tasks/:id`

Remove uma tarefa.

---

## ❌ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Dados inválidos ou ausentes |
| 401 | Unauthorized - Token inválido ou ausente |
| 403 | Forbidden - Sem permissão para acessar o recurso |
| 404 | Not Found - Recurso não encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro no servidor |

**Formato de erro:**
```json
{
  "success": false,
  "error": "Mensagem de erro descritiva"
}
```

---

## 🔧 Health Check

#### GET `/health`

Verifica o status do servidor.

**Response (200):**
```json
{
  "status": "ok",
  "message": "Server is running",
  "env": {
    "hasDatabaseUrl": true,
    "hasJwtSecret": true,
    "nodeEnv": "production"
  }
}
```

---

## 📝 Notas

- Todas as datas devem estar no formato ISO 8601
- O token JWT expira em 7 dias
- Valores monetários são em formato decimal (ex: 1500.50)
- IDs são UUIDs v4
