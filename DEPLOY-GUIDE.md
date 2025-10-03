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

### 4️⃣ Configurar Frontend para usar Backend em Produção

Você precisará atualizar o código do frontend para usar a URL do backend em produção.

1. Anote a URL do backend que recebeu no passo 3
2. Execute os comandos abaixo (vou fazer isso para você depois)

### 5️⃣ Rodar Migrações do Prisma

Depois do deploy do backend:

```bash
cd C:\Users\mayco\crm-honorarios\backend
npx prisma migrate deploy
```

### 6️⃣ Popular o Banco (Seed)

```bash
cd C:\Users\mayco\crm-honorarios\backend
npx prisma db seed
```

---

## 🚀 Comando Rápido (Fazer Tudo):

Depois de criar o banco no Vercel e configurar as variáveis de ambiente, rode:

```bash
cd C:\Users\mayco\crm-honorarios\backend && npx vercel --prod
```

---

## ⚠️ Importante:

- O banco SQLite local (`dev.db`) **NÃO** será migrado automaticamente
- Você terá um banco novo vazio no PostgreSQL
- Será necessário recriar usuários e dados iniciais

---

## 🔧 Troubleshooting:

Se der erro de "Module not found" no Vercel:
- Verifique se o `vercel.json` está correto
- Rode `npm install` no backend antes do deploy
