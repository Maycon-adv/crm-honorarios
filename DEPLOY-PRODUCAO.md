# Guia de Deploy para Produção

Este guia contém as instruções para configurar as variáveis de ambiente no Vercel e GitHub Actions para ativar o monitoramento em produção.

## 1. Configurar Variáveis de Ambiente no Vercel

Acesse o dashboard do Vercel e adicione as seguintes variáveis de ambiente:

### Acessar Configurações
1. Vá para https://vercel.com/dashboard
2. Selecione seu projeto **crm-honorarios**
3. Clique em **Settings** → **Environment Variables**

### Adicionar Variáveis

#### Frontend (VITE_*)
```
Nome: VITE_SENTRY_DSN
Valor: https://9d32a840111ec2a651c0c98d6ae8d543@o4510131274711040.ingest.us.sentry.io/4510131279233024
Ambiente: Production, Preview, Development
```

```
Nome: VITE_LOGROCKET_APP_ID
Valor: drznes/crm-schulze
Ambiente: Production, Preview, Development
```

```
Nome: VITE_API_URL
Valor: https://seu-dominio.vercel.app/api
Ambiente: Production
```

#### Backend (Sem VITE_)
```
Nome: SENTRY_DSN
Valor: https://4d3a3b481a04bbc8f4d039be584ed488@o4510131274711040.ingest.us.sentry.io/4510131494125568
Ambiente: Production, Preview, Development
```

```
Nome: DATABASE_URL
Valor: postgresql://seu-usuario:sua-senha@seu-host:5432/seu-banco
Ambiente: Production
```

```
Nome: JWT_SECRET
Valor: (seu JWT secret seguro)
Ambiente: Production
```

```
Nome: NODE_ENV
Valor: production
Ambiente: Production
```

### ⚠️ Importante
- **Não** exponha suas variáveis sensíveis (JWT_SECRET, DATABASE_URL) publicamente
- Mantenha as DSNs do Sentry conforme fornecidas acima
- Após adicionar as variáveis, **Redeploy** o projeto para aplicar as mudanças

## 2. Configurar Secrets no GitHub Actions

Para habilitar o CI/CD e backups automáticos, adicione os seguintes secrets no GitHub:

### Acessar Secrets
1. Vá para https://github.com/Maycon-adv/crm-honorarios
2. Clique em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**

### Adicionar Secrets

#### Monitoramento
```
Nome: VITE_SENTRY_DSN
Valor: https://9d32a840111ec2a651c0c98d6ae8d543@o4510131274711040.ingest.us.sentry.io/4510131279233024
```

```
Nome: SENTRY_DSN
Valor: https://4d3a3b481a04bbc8f4d039be584ed488@o4510131274711040.ingest.us.sentry.io/4510131494125568
```

```
Nome: VITE_LOGROCKET_APP_ID
Valor: drznes/crm-schulze
```

#### Deployment (Vercel)
```
Nome: VERCEL_TOKEN
Valor: (obter em https://vercel.com/account/tokens)
```

```
Nome: VERCEL_ORG_ID
Valor: (obter rodando: vercel whoami)
```

```
Nome: VERCEL_PROJECT_ID
Valor: (obter em Settings do projeto no Vercel)
```

#### Database Backup
```
Nome: DATABASE_URL
Valor: postgresql://seu-usuario:sua-senha@seu-host:5432/seu-banco
```

### Como Obter os IDs da Vercel

#### VERCEL_TOKEN
1. Acesse https://vercel.com/account/tokens
2. Clique em **Create Token**
3. Dê um nome (ex: "GitHub Actions")
4. Copie o token gerado

#### VERCEL_ORG_ID e VERCEL_PROJECT_ID
Opção 1 - Via CLI:
```bash
# Instalar Vercel CLI se não tiver
npm i -g vercel

# Login
vercel login

# Ver informações
vercel whoami
```

Opção 2 - Via .vercel/project.json:
```bash
# No diretório do projeto
vercel link

# Isso criará .vercel/project.json com os IDs
cat .vercel/project.json
```

## 3. Testar Deploy

### Redeployar no Vercel
1. Vá para o dashboard do Vercel
2. Clique em **Deployments**
3. No último deployment, clique nos **três pontos** → **Redeploy**
4. Aguarde o deployment completar

### Verificar GitHub Actions
1. Vá para https://github.com/Maycon-adv/crm-honorarios/actions
2. Verifique se os workflows estão rodando com sucesso
3. O workflow de CI deve executar em cada push
4. O workflow de backup rodará diariamente às 2h UTC

## 4. Verificar Monitoramento em Produção

### Testar Sentry (Captura de Erros)
1. Acesse sua aplicação em produção
2. Force um erro (ex: erro de autenticação, formulário inválido)
3. Verifique em https://crm-schulze.sentry.io/ se o erro foi capturado
4. Confirme que o erro aparece com informações completas (stack trace, contexto)

### Testar LogRocket (Session Replay)
1. Acesse sua aplicação em produção
2. Navegue por algumas páginas
3. Faça algumas ações (login, criar contato, etc.)
4. Acesse https://app.logrocket.com/drznes/crm-schulze/
5. Verifique se sua sessão foi gravada
6. Teste o replay da sessão

### Verificar Integração Sentry + LogRocket
1. Force um erro na aplicação
2. No Sentry, abra o erro capturado
3. Verifique se há um campo **sessionURL** com o link do LogRocket
4. Clique no link para ver a sessão completa no momento do erro

## 5. Checklist de Verificação

### Vercel
- [ ] Variáveis de ambiente adicionadas
- [ ] Projeto redeployado com sucesso
- [ ] API backend funcionando (teste endpoints)
- [ ] Frontend carregando corretamente

### GitHub Actions
- [ ] Secrets configurados
- [ ] Workflow CI executando nos pushes
- [ ] Testes passando no CI
- [ ] Workflow de backup agendado

### Monitoramento
- [ ] Sentry capturando erros frontend
- [ ] Sentry capturando erros backend
- [ ] LogRocket gravando sessões
- [ ] Integração Sentry + LogRocket funcionando
- [ ] Console do navegador sem erros de inicialização

### Banco de Dados
- [ ] Backup automático configurado
- [ ] Pode restaurar backup manualmente se necessário

## 6. Problemas Comuns

### Erro: "Sentry DSN not configured"
**Solução**: Verifique se as variáveis VITE_SENTRY_DSN e SENTRY_DSN foram adicionadas corretamente no Vercel

### Erro: "LogRocket session not recording"
**Solução**: Verifique se VITE_LOGROCKET_APP_ID está configurado e se o console mostra "✅ LogRocket initialized"

### GitHub Actions falhando no deploy
**Solução**: Verifique se VERCEL_TOKEN, VERCEL_ORG_ID e VERCEL_PROJECT_ID estão corretos

### Backup falhando
**Solução**: Verifique se DATABASE_URL está correta e se o banco PostgreSQL está acessível

## 7. Próximos Passos Após Deploy

1. **Monitoramento Contínuo**: Verifique diariamente o Sentry e LogRocket nos primeiros dias
2. **Ajustar Alertas**: Configure alertas no Sentry para notificar sobre erros críticos
3. **Revisar Sessões**: Use LogRocket para entender comportamento dos usuários
4. **Otimizar Performance**: Use dados do Sentry Performance Monitoring
5. **Testar Backups**: Faça um teste de restore de backup em ambiente de desenvolvimento

## 8. Links Úteis

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Sentry**: https://crm-schulze.sentry.io/
- **LogRocket**: https://app.logrocket.com/drznes/crm-schulze/
- **GitHub Actions**: https://github.com/Maycon-adv/crm-honorarios/actions
- **Documentação Sentry**: [SENTRY-SETUP.md](./SENTRY-SETUP.md)
- **Documentação LogRocket**: [LOGROCKET-SETUP.md](./LOGROCKET-SETUP.md)

---

**Importante**: Mantenha este documento atualizado conforme você faz mudanças na configuração de produção.
