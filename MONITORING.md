# 📊 Guia de Monitoramento e Observabilidade

## Índice
1. [Visão Geral](#visão-geral)
2. [Sentry - Monitoramento de Erros](#sentry---monitoramento-de-erros)
3. [LogRocket - Session Replay](#logrocket---session-replay)
4. [CI/CD e Testes](#cicd-e-testes)
5. [Backup Automático](#backup-automático)
6. [Métricas e Alertas](#métricas-e-alertas)

---

## Visão Geral

O sistema possui monitoramento completo implementado:

- **Sentry**: Rastreamento de erros e performance (frontend e backend)
- **LogRocket**: Gravação de sessões de usuários (frontend)
- **GitHub Actions**: CI/CD automatizado
- **Backup Automático**: Backup diário do banco de dados
- **CodeQL**: Análise de segurança do código

---

## Sentry - Monitoramento de Erros

### Configuração

#### Frontend

O Sentry está configurado em `src/index.tsx`:

```typescript
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

#### Backend

O Sentry está configurado em `backend/src/server.ts`:

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
```

### Variáveis de Ambiente

Adicione no `.env`:

```env
# Frontend
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Backend
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### Como Obter o DSN

1. Acesse [sentry.io](https://sentry.io)
2. Crie uma conta gratuita
3. Crie dois projetos:
   - **Frontend**: React
   - **Backend**: Node.js/Express
4. Copie o DSN de cada projeto
5. Adicione às variáveis de ambiente

### Recursos Disponíveis

- **Error Tracking**: Rastreamento automático de erros
- **Performance Monitoring**: Análise de performance de transações
- **Release Tracking**: Acompanhamento de versões
- **Breadcrumbs**: Histórico de ações antes do erro
- **Session Replay**: Reprodução de sessões com erros (frontend)

### Alertas Configurados

- Erros críticos em produção
- Taxa de erros acima de 5%
- Performance degradada (transações > 3s)
- Erros de autenticação em massa

---

## LogRocket - Session Replay

### Configuração

O LogRocket está configurado em `src/index.tsx`:

```typescript
LogRocket.init(import.meta.env.VITE_LOGROCKET_APP_ID, {
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',
  network: {
    requestSanitizer: (request) => {
      if (request.headers['Authorization']) {
        request.headers['Authorization'] = '[REDACTED]';
      }
      return request;
    },
  },
});
```

### Integração com Sentry

LogRocket e Sentry estão integrados. Quando um erro ocorre no Sentry, a URL da sessão do LogRocket é anexada automaticamente:

```typescript
beforeSend(event) {
  event.extra = event.extra || {};
  event.extra.sessionURL = LogRocket.sessionURL;
  return event;
}
```

### Variáveis de Ambiente

```env
VITE_LOGROCKET_APP_ID=your-app-id/project-name
```

### Como Obter o App ID

1. Acesse [logrocket.com](https://logrocket.com)
2. Crie uma conta (14 dias grátis)
3. Crie um novo projeto
4. Copie o App ID (formato: `app-id/project-name`)
5. Adicione à variável de ambiente

### Recursos Disponíveis

- **Session Replay**: Gravação de sessões de usuários
- **Console Logs**: Captura de logs do console
- **Network Activity**: Monitoramento de requisições
- **Redux/State**: Rastreamento de mudanças de estado
- **User Identification**: Identificação de usuários

### Privacidade e Segurança

O LogRocket está configurado para sanitizar dados sensíveis:
- Tokens de autorização são removidos
- Senhas não são gravadas
- Dados de formulários sensíveis são mascarados

---

## CI/CD e Testes

### GitHub Actions

Três workflows estão configurados:

#### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push para `main` ou `develop`
- Pull requests para `main` ou `develop`

**Jobs:**
- **Frontend CI**:
  - Instala dependências
  - Executa linter
  - Roda testes com coverage
  - Faz build
  - Upload de artifacts

- **Backend CI**:
  - Instala dependências
  - Gera Prisma Client
  - Roda testes com coverage
  - Faz build
  - Upload de artifacts

- **Security Audit**:
  - Executa `npm audit` no frontend e backend
  - Reporta vulnerabilidades

- **Deploy** (apenas em push para `main`):
  - Deploy automático para Vercel

#### 2. Database Backup (`.github/workflows/database-backup.yml`)

**Triggers:**
- Diariamente às 2h UTC
- Manualmente via `workflow_dispatch`

**Ações:**
- Cria backup do PostgreSQL usando `pg_dump`
- Comprime o backup com gzip
- Faz upload para GitHub Artifacts (30 dias)
- Remove backups antigos (> 30 dias)

#### 3. CodeQL Security Scan (`.github/workflows/codeql.yml`)

**Triggers:**
- Push para `main` ou `develop`
- Pull requests para `main`
- Semanalmente às segundas-feiras 6h UTC

**Ações:**
- Análise de segurança do código
- Detecta vulnerabilidades comuns
- Reporta no Security tab do GitHub

### Executando Testes Localmente

**Frontend:**
```bash
# Rodar testes
npm run test

# Rodar com UI
npm run test:ui

# Gerar coverage
npm run test:coverage
```

**Backend:**
```bash
cd backend

# Rodar testes
npm run test

# Watch mode
npm run test:watch

# Gerar coverage
npm run test:coverage
```

### Configuração de Secrets no GitHub

Para o CI/CD funcionar, configure os seguintes secrets:

1. Acesse **Settings** > **Secrets and variables** > **Actions**
2. Adicione:

```
VITE_API_URL
VITE_SENTRY_DSN
VITE_LOGROCKET_APP_ID
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
DATABASE_URL
```

---

## Backup Automático

### Script de Backup

Um script completo foi criado em `backend/src/scripts/backup.ts`:

**Recursos:**
- Backup usando `pg_dump`
- Compressão automática com gzip
- Rotação de backups (mantém os 7 mais recentes)
- Restore de backups
- Listagem de backups disponíveis

### Comandos Disponíveis

```bash
cd backend

# Criar backup
npm run backup:create

# Listar backups
npm run backup:list

# Restaurar backup
npm run backup:restore caminho/do/backup.sql.gz
```

### Backup Automático via GitHub Actions

O workflow de backup roda diariamente às 2h UTC e:
- Cria backup do banco de dados
- Comprime o arquivo
- Faz upload para GitHub Artifacts
- Mantém backups por 30 dias

### Backup Manual

Para fazer backup manual:

```bash
cd backend
npm run backup:create
```

Os backups ficam salvos em `backend/backups/`

### Configuração de Backup em Cloud

Para enviar backups para cloud storage, edite `.github/workflows/database-backup.yml`:

**AWS S3:**
```yaml
- name: Upload to AWS S3
  run: |
    aws s3 cp backups/*.sql.gz s3://your-bucket/database-backups/
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**Google Cloud Storage:**
```yaml
- name: Upload to GCS
  run: |
    gsutil cp backups/*.sql.gz gs://your-bucket/database-backups/
  env:
    GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.GCS_CREDENTIALS }}
```

---

## Métricas e Alertas

### Métricas Importantes

**Performance:**
- Tempo de resposta das APIs (< 300ms)
- Tempo de carregamento da página (< 2s)
- Taxa de erro de requisições (< 1%)

**Disponibilidade:**
- Uptime do sistema (> 99.5%)
- Health check status

**Usuários:**
- Sessões ativas
- Taxa de conversão
- Tempo médio de sessão

**Negócio:**
- Total de acordos criados
- Valor total gerenciado
- Taxa de inadimplência

### Configurando Alertas no Sentry

1. Acesse seu projeto no Sentry
2. Vá em **Alerts** > **Create Alert**
3. Configure alertas para:
   - Taxa de erros > 5%
   - Erros específicos (ex: falha de autenticação)
   - Performance degradada

### Health Check Endpoint

O sistema possui um endpoint de health check:

```
GET /health
```

Resposta:
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

Use esse endpoint para monitoramento externo (UptimeRobot, Pingdom, etc.)

---

## Troubleshooting

### Sentry não está capturando erros

1. Verifique se o DSN está correto
2. Confirme que as variáveis de ambiente estão configuradas
3. Em desenvolvimento, erros podem não ser enviados (check `environment`)

### LogRocket não está gravando

1. Verifique o App ID
2. Confirme que está em um ambiente HTTPS (produção)
3. Verifique se há bloqueadores de ads/trackers

### Testes falhando no CI

1. Verifique os logs do GitHub Actions
2. Confirme que todas as dependências estão instaladas
3. Verifique se as variáveis de ambiente de teste estão configuradas

### Backup falhando

1. Verifique se `pg_dump` está instalado
2. Confirme que `DATABASE_URL` está correto
3. Verifique permissões de escrita na pasta `backups/`

---

## Recursos Adicionais

- [Documentação Sentry](https://docs.sentry.io/)
- [Documentação LogRocket](https://docs.logrocket.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Prisma Backup Best Practices](https://www.prisma.io/docs/guides/deployment/deployment-guides)

---

**Última atualização:** Outubro 2025
**Versão:** 1.0

🤖 Desenvolvido com [Claude Code](https://claude.com/claude-code)
