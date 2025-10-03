# Guia de Deploy - CRM Honorários

## ✅ O que já foi feito:

1. ✅ Backend configurado para Vercel (serverless)
2. ✅ Schema do Prisma atualizado para PostgreSQL
3. ✅ Frontend já deployed no Vercel
4. ✅ Backend deployed no Vercel: https://backend-50a7gq00c-maycon-ruhans-projects.vercel.app

## 📋 Próximos Passos (SIGA NA ORDEM):

### 1️⃣ Criar Banco de Dados PostgreSQL no Vercel

1. Acesse: https://vercel.com/dashboard
2. Vá em **Storage** no menu lateral
3. Clique em **Create Database**
4. Escolha **Postgres**
5. Nomeie como: `crm-honorarios-db`
6. Selecione a região mais próxima (ex: Washington, D.C.)
7. Clique em **Create**

### 2️⃣ Conectar o Banco ao Projeto Backend

1. No Vercel Storage, clique no banco criado
2. Vá na aba **`.env.local`**
3. Copie a variável `POSTGRES_PRISMA_URL`
4. Cole no terminal abaixo para configurar:

```bash
cd C:\Users\mayco\crm-honorarios\backend
vercel env add DATABASE_URL
# Cole o valor de POSTGRES_PRISMA_URL quando pedir
# Escolha: Production, Preview e Development

vercel env add JWT_SECRET
# Cole um valor seguro (ex: use um gerador de senha forte)
# Escolha: Production, Preview e Development
```

### 3️⃣ Deploy do Backend

```bash
cd C:\Users\mayco\crm-honorarios\backend
npx vercel --prod
```

**Após o deploy, você receberá uma URL como:**
`https://crm-honorarios-backend.vercel.app`

### 4️⃣ Configurar Variáveis de Ambiente no Vercel (Frontend)

O frontend já possui o arquivo `.env.production.local` configurado, mas você precisa adicionar essas variáveis no Vercel:

1. Acesse o projeto do frontend no Vercel Dashboard
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

| Nome | Valor | Environments |
|------|-------|--------------|
| `VITE_API_URL` | `https://crm-honorarios-backend.vercel.app/api` | Production, Preview |
| `GEMINI_API_KEY` | *(sua chave do Gemini)* | Production, Preview |

**⚠️ Importante:** Substitua a URL do backend pela URL real que você recebeu no passo 3.

4. Faça um novo deploy do frontend para aplicar as variáveis:

```bash
git push origin main
# ou
vercel --prod
```

### 5️⃣ Rodar Migrações do Prisma

Depois do deploy do backend, você precisa criar as tabelas no PostgreSQL:

```bash
cd C:\Users\mayco\crm-honorarios\backend
npx prisma migrate deploy
```

### 6️⃣ Popular o Banco (Seed)

Cria o usuário admin inicial:

- **Email:** `admin@crm.com`
- **Senha:** `admin123`

```bash
cd C:\Users\mayco\crm-honorarios\backend
npx prisma db seed
```

**⚠️ Atenção:** Altere a senha do admin após o primeiro login!

---

## 🚀 Comando Rápido (Fazer Tudo):

Depois de criar o banco no Vercel e configurar as variáveis de ambiente, rode:

```bash
cd C:\Users\mayco\crm-honorarios\backend && npx vercel --prod
```

---

## ✅ Verificações Finais

### 1. CORS está configurado

O backend já aceita requisições de:

- `localhost` (desenvolvimento)
- `*.vercel.app` (Vercel deployments)
- `*.schulze.com.br` (domínio custom)

### 2. Variáveis de Ambiente Backend

Certifique-se de configurar no Vercel (backend):

- `DATABASE_URL` - URL do PostgreSQL (POSTGRES_PRISMA_URL)
- `JWT_SECRET` - Chave secreta para tokens (gere uma senha forte)
- `CORS_ALLOWED_ORIGINS` (opcional) - URLs adicionais permitidas

### 3. Seed do Prisma

O arquivo `backend/prisma/seed.ts` já está configurado e cria:

- 1 usuário admin (email: `admin@crm.com`, senha: `admin123`)

### 4. Rate Limiting Configurado

O backend possui proteção contra ataques de força bruta:

- **Rotas de autenticação:** Máximo 5 tentativas a cada 15 minutos
- **API geral:** Máximo 100 requisições a cada 15 minutos

---

## ⚠️ Importante:

- O banco SQLite local (`dev.db`) **NÃO** será migrado automaticamente
- Você terá um banco novo vazio no PostgreSQL
- Será necessário recriar usuários e dados iniciais

---

## 🔧 Troubleshooting:

### Erro "FUNCTION_INVOCATION_FAILED" no Vercel

**Problema:** O backend retorna erro 500 e falha ao iniciar.

**Solução:**
1. Certifique-se de que o script `vercel-build` está no `package.json`:
   ```json
   "scripts": {
     "vercel-build": "npx prisma generate && npm run build"
   }
   ```

2. Verifique se existe o arquivo `backend/api/index.js`:
   ```javascript
   const app = require('../dist/server').default;
   module.exports = app;
   ```

3. Verifique se o `vercel.json` está configurado corretamente:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/api/index.js"
       }
     ]
   }
   ```

### Domínio principal não atualiza

**Problema:** O domínio `crm-honorarios-backend.vercel.app` não aponta para o último deployment.

**Solução:**
```bash
cd backend
vercel alias set [URL_DO_NOVO_DEPLOYMENT] crm-honorarios-backend.vercel.app
```

### Erro "Module not found" no Vercel

- Verifique se o `vercel.json` está correto
- Rode `npm install` no backend antes do deploy
- Certifique-se de que todas as dependências estão em `dependencies` (não em `devDependencies`)

### Erro de CORS

Se o frontend não conseguir se conectar ao backend:
- Verifique se a URL do frontend está nas origens permitidas
- O backend já aceita `*.vercel.app` automaticamente
- Para domínios customizados, adicione à variável `CORS_ALLOWED_ORIGINS`
