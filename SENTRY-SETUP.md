# 🎯 Configuração Sentry - Guia Completo

## ✅ DSNs Obtidos

### Frontend (React)
```
https://9d32a840111ec2a651c0c98d6ae8d543@o4510131274711040.ingest.us.sentry.io/4510131279233024
```

### Backend (Express/Node.js)
```
https://4d3a3b481a04bbc8f4d039be584ed488@o4510131274711040.ingest.us.sentry.io/4510131494125568
```

---

## 📝 Passo 1: Configuração Local (CONCLUÍDO ✅)

Arquivos criados:
- ✅ `.env.local` (frontend)
- ✅ `backend/.env.local` (backend)

**Testar localmente:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev

# Acesse: http://localhost:5173
# Cause um erro de propósito (ex: clicar em algo quebrado)
# Verifique no Sentry se apareceu: https://crm-schulze.sentry.io/
```

---

## 🔧 Passo 2: Configurar Vercel

### 2.1 Acessar Environment Variables

```
https://vercel.com/[seu-usuario]/crm-honorarios/settings/environment-variables
```

### 2.2 Adicionar Variáveis

Clique em **"Add New"** para cada variável abaixo:

#### Variável 1: VITE_SENTRY_DSN (Frontend)

```
Key:   VITE_SENTRY_DSN
Value: https://9d32a840111ec2a651c0c98d6ae8d543@o4510131274711040.ingest.us.sentry.io/4510131279233024

Environments:
☑ Production
☑ Preview
☐ Development
```

#### Variável 2: SENTRY_DSN (Backend)

```
Key:   SENTRY_DSN
Value: https://4d3a3b481a04bbc8f4d039be584ed488@o4510131274711040.ingest.us.sentry.io/4510131494125568

Environments:
☑ Production
☑ Preview
☐ Development
```

### 2.3 Redeploy

Após adicionar as variáveis:
```
Vercel Dashboard > Deployments > (três pontinhos) > Redeploy
```

---

## 🔐 Passo 3: Configurar GitHub Secrets

### 3.1 Acessar GitHub Secrets

```
https://github.com/Maycon-adv/crm-honorarios/settings/secrets/actions
```

### 3.2 Adicionar Secrets

Clique em **"New repository secret"** para cada um:

#### Secret 1: VITE_SENTRY_DSN

```
Name:  VITE_SENTRY_DSN
Value: https://9d32a840111ec2a651c0c98d6ae8d543@o4510131274711040.ingest.us.sentry.io/4510131279233024
```

#### Secret 2: SENTRY_DSN

```
Name:  SENTRY_DSN
Value: https://4d3a3b481a04bbc8f4d039be584ed488@o4510131274711040.ingest.us.sentry.io/4510131494125568
```

#### Secret 3: VERCEL_TOKEN (se ainda não tiver)

```bash
# 1. Ir em: https://vercel.com/account/tokens
# 2. Create Token
# 3. Copiar o token

Name:  VERCEL_TOKEN
Value: [seu-token-aqui]
```

#### Secret 4: VERCEL_ORG_ID (se ainda não tiver)

```bash
# No terminal do projeto:
vercel

# Copiar o "Scope" ou "Org ID" que aparecer

Name:  VERCEL_ORG_ID
Value: [org-id-aqui]
```

#### Secret 5: VERCEL_PROJECT_ID (se ainda não tiver)

```bash
# Mesmo comando acima
vercel

# Copiar o "Project ID"

Name:  VERCEL_PROJECT_ID
Value: [project-id-aqui]
```

#### Secret 6: DATABASE_URL (se ainda não tiver)

```bash
# Copiar do Vercel:
# Settings > Environment Variables > DATABASE_URL

Name:  DATABASE_URL
Value: [sua-database-url]
```

---

## 🧪 Passo 4: Testar o Monitoramento

### 4.1 Testar Localmente

```bash
# 1. Iniciar o projeto
npm run dev

# 2. Abrir o console do navegador (F12)

# 3. Executar no console:
throw new Error("Teste Sentry - Ambiente Local");

# 4. Verificar no Sentry:
https://crm-schulze.sentry.io/issues/

# Deve aparecer o erro!
```

### 4.2 Testar em Produção

```bash
# 1. Após redeploy, acessar:
https://crm-honorarios.vercel.app

# 2. Abrir console (F12)

# 3. Executar:
throw new Error("Teste Sentry - Produção");

# 4. Verificar no Sentry:
https://crm-schulze.sentry.io/issues/

# Deve aparecer o erro com informações de produção!
```

### 4.3 Testar Backend

```bash
# 1. Criar um erro de propósito no backend
# Por exemplo, fazer login com credenciais inválidas várias vezes

# 2. Ou adicionar temporariamente em alguma rota:
throw new Error("Teste Sentry Backend");

# 3. Verificar no projeto Node.js do Sentry
```

---

## 📊 Monitorando Erros

### Dashboard Sentry

Acesse: https://crm-schulze.sentry.io/

**O que você verá:**

1. **Issues** - Todos os erros capturados
2. **Performance** - Métricas de performance
3. **Releases** - Versões do seu app
4. **Alerts** - Configure alertas (email, Slack, etc.)

### Informações Capturadas

Para cada erro, o Sentry mostra:
- ✅ Stack trace completo
- ✅ Breadcrumbs (ações do usuário antes do erro)
- ✅ Variáveis e contexto
- ✅ Browser/OS do usuário
- ✅ URL onde ocorreu
- ✅ Session replay (se configurado)

---

## 🔔 Configurar Alertas (Opcional)

### 1. Ir em Settings > Alerts

```
https://crm-schulze.sentry.io/settings/projects/[project]/alerts/
```

### 2. Create Alert Rule

Exemplos de alertas úteis:

**Alerta 1: Erros Críticos**
```
When: an event is seen
If: level equals error
Then: send notification to email
```

**Alerta 2: Muitos Erros**
```
When: an issue is seen
If: event count > 10 in 1 hour
Then: send notification to email
```

**Alerta 3: Performance**
```
When: transaction duration
If: p95 > 3 seconds
Then: send notification to email
```

---

## ✅ Checklist Final

### Configuração Local
- [x] `.env.local` criado com VITE_SENTRY_DSN
- [x] `backend/.env.local` criado com SENTRY_DSN
- [ ] Testado localmente

### Configuração Vercel
- [ ] VITE_SENTRY_DSN adicionado
- [ ] SENTRY_DSN adicionado
- [ ] Redeploy realizado
- [ ] Testado em produção

### Configuração GitHub
- [ ] VITE_SENTRY_DSN adicionado aos secrets
- [ ] SENTRY_DSN adicionado aos secrets
- [ ] VERCEL_TOKEN adicionado
- [ ] VERCEL_ORG_ID adicionado
- [ ] VERCEL_PROJECT_ID adicionado
- [ ] DATABASE_URL adicionado

### Testes
- [ ] Erro testado no frontend local
- [ ] Erro testado no backend local
- [ ] Erro testado em produção
- [ ] Alertas configurados (opcional)

---

## 🚀 Próximos Passos

Após configurar o Sentry:

1. **LogRocket** (Session Replay)
   - Criar conta em https://logrocket.com
   - Adicionar App ID
   - Ver gravações de sessões

2. **Expandir Monitoramento**
   - Adicionar custom tags
   - Adicionar user context
   - Configurar releases

3. **Alertas Personalizados**
   - Integrar com Slack
   - Email para erros críticos
   - Webhook para automações

---

## 📚 Recursos

- **Documentação Sentry:** https://docs.sentry.io/
- **Sentry React:** https://docs.sentry.io/platforms/javascript/guides/react/
- **Sentry Node.js:** https://docs.sentry.io/platforms/node/
- **Dashboard:** https://crm-schulze.sentry.io/

---

**Configuração criada em:** 04 de Outubro de 2025
**Status:** ✅ DSNs configurados localmente, aguardando configuração em produção
