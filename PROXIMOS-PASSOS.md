# ✅ Próximos Passos - Deploy em Produção

## Status Atual

### ✅ Concluído
- [x] Variáveis de ambiente adicionadas no **Vercel**:
  - `VITE_SENTRY_DSN` ✓
  - `VITE_LOGROCKET_APP_ID` ✓
  - `SENTRY_DSN` ✓
- [x] Código commitado e enviado para GitHub
- [x] LogRocket funcionando localmente

### ⏳ Pendente
- [ ] Login no GitHub CLI
- [ ] Adicionar secrets ao GitHub Actions
- [ ] Redeploy no Vercel
- [ ] Testar monitoramento em produção

---

## 1️⃣ Fazer Login no GitHub CLI

Você tem o código de autenticação: **7F64-2E6D**

### Passos:
1. Abra o navegador em: https://github.com/login/device
2. Cole o código: `7F64-2E6D`
3. Clique em **Continue** e autorize o acesso
4. Volte ao terminal e aguarde a confirmação

**OU** use um Personal Access Token:

```bash
# Criar token em: https://github.com/settings/tokens/new
# Permissões necessárias: repo, admin:repo_hook, workflow

./gh-cli/bin/gh.exe auth login --with-token
# Cole o token quando solicitado
```

---

## 2️⃣ Adicionar Secrets ao GitHub Actions

Após autenticar, rode o script PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\add-github-secrets.ps1
```

### Secrets Automáticos (já no script):
- ✓ `VITE_SENTRY_DSN`
- ✓ `SENTRY_DSN`
- ✓ `VITE_LOGROCKET_APP_ID`

### Secrets Manuais (você precisa obter):

#### A) VERCEL_TOKEN
```powershell
# 1. Abra: https://vercel.com/account/tokens
# 2. Clique em "Create Token"
# 3. Nome: "GitHub Actions"
# 4. Copie o token e execute:

$token = Read-Host "Cole o VERCEL_TOKEN"
$token | ./gh-cli/bin/gh.exe secret set VERCEL_TOKEN --repo Maycon-adv/crm-honorarios
```

#### B) VERCEL_ORG_ID
```powershell
# Execute e copie o ID da organização:
vercel whoami

# Depois execute:
$orgId = Read-Host "Cole o VERCEL_ORG_ID (resultado do comando acima)"
$orgId | ./gh-cli/bin/gh.exe secret set VERCEL_ORG_ID --repo Maycon-adv/crm-honorarios
```

#### C) VERCEL_PROJECT_ID
```powershell
# Opção 1: Via CLI
vercel link
Get-Content .vercel/project.json

# Opção 2: Via Dashboard
# Vá para: https://vercel.com/maycon-ruhans-projects/crm-honorarios/settings
# Copie o "Project ID" em General

# Depois execute:
$projectId = Read-Host "Cole o VERCEL_PROJECT_ID"
$projectId | ./gh-cli/bin/gh.exe secret set VERCEL_PROJECT_ID --repo Maycon-adv/crm-honorarios
```

#### D) DATABASE_URL
```powershell
# Já está no Vercel, então vamos puxar:
vercel env pull .env.production

# Abra o arquivo .env.production e copie o DATABASE_URL
notepad .env.production

# Depois execute:
$dbUrl = Read-Host "Cole o DATABASE_URL (do arquivo .env.production)"
$dbUrl | ./gh-cli/bin/gh.exe secret set DATABASE_URL --repo Maycon-adv/crm-honorarios
```

---

## 3️⃣ Verificar Secrets Configurados

```powershell
./gh-cli/bin/gh.exe secret list --repo Maycon-adv/crm-honorarios
```

Deve mostrar:
```
VITE_SENTRY_DSN       Updated YYYY-MM-DD
SENTRY_DSN            Updated YYYY-MM-DD
VITE_LOGROCKET_APP_ID Updated YYYY-MM-DD
VERCEL_TOKEN          Updated YYYY-MM-DD
VERCEL_ORG_ID         Updated YYYY-MM-DD
VERCEL_PROJECT_ID     Updated YYYY-MM-DD
DATABASE_URL          Updated YYYY-MM-DD
```

---

## 4️⃣ Redeploy no Vercel

### Opção 1: Via CLI
```bash
vercel --prod
```

### Opção 2: Via Dashboard
1. Acesse: https://vercel.com/maycon-ruhans-projects/crm-honorarios
2. Vá em **Deployments**
3. No último deploy, clique nos **três pontos** → **Redeploy**
4. Aguarde o deploy completar

---

## 5️⃣ Testar Monitoramento em Produção

### A) Testar Sentry
1. Acesse sua aplicação em produção
2. Abra o Console do navegador (F12)
3. Verifique se não há erros de inicialização do Sentry
4. Force um erro (ex: tente fazer login com credenciais inválidas)
5. Acesse: https://crm-schulze.sentry.io/
6. Verifique se o erro foi capturado

### B) Testar LogRocket
1. Navegue pela aplicação (faça login, abra alguns módulos)
2. Acesse: https://app.logrocket.com/drznes/crm-schulze/
3. Verifique se sua sessão foi gravada
4. Assista ao replay da sessão

### C) Testar Integração Sentry + LogRocket
1. Force um erro na aplicação
2. No Sentry, abra o erro capturado
3. Procure por um campo chamado `sessionURL` com link do LogRocket
4. Clique no link para ver a sessão exata onde o erro ocorreu

---

## 6️⃣ Verificar GitHub Actions

1. Acesse: https://github.com/Maycon-adv/crm-honorarios/actions
2. Verifique se os workflows estão executando:
   - ✅ **CI/CD Pipeline** - Deve rodar em cada push
   - ✅ **Database Backup** - Agendado para 2h UTC diariamente
   - ✅ **CodeQL Analysis** - Agendado semanalmente

---

## 📝 Checklist Final

### Vercel
- [x] Variáveis adicionadas
- [ ] Projeto redeployado
- [ ] Frontend funcionando
- [ ] API backend respondendo

### GitHub Actions
- [ ] GitHub CLI autenticado
- [ ] Secrets configurados (7 no total)
- [ ] Workflow CI executou com sucesso
- [ ] Backup agendado aparece nos workflows

### Monitoramento
- [ ] Sentry capturando erros
- [ ] LogRocket gravando sessões
- [ ] Integração funcionando (sessionURL em erros)

---

## 🆘 Problemas Comuns

### GitHub CLI não autentica
**Solução**: Use Personal Access Token:
1. Vá em: https://github.com/settings/tokens/new
2. Marque: `repo`, `workflow`, `admin:repo_hook`
3. Copie o token
4. Execute: `./gh-cli/bin/gh.exe auth login --with-token`
5. Cole o token

### Vercel redeploy não aplica variáveis
**Solução**: Force um novo deploy:
```bash
vercel --prod --force
```

### Secrets não aparecem no GitHub
**Solução**: Verifique permissões do token:
```bash
./gh-cli/bin/gh.exe auth status
./gh-cli/bin/gh.exe auth refresh -h github.com -s admin:org
```

---

## 📚 Documentação Relacionada

- [Guia de Deploy](./DEPLOY-PRODUCAO.md) - Instruções detalhadas
- [Setup Sentry](./SENTRY-SETUP.md) - Configuração do Sentry
- [Setup LogRocket](./LOGROCKET-SETUP.md) - Configuração do LogRocket
- [Monitoramento](./MONITORING.md) - Guia técnico completo
