# Script PowerShell para adicionar secrets ao GitHub Actions
# Requer: GitHub CLI (gh) autenticado

$REPO = "Maycon-adv/crm-honorarios"

Write-Host "🔐 Adicionando secrets ao GitHub Actions..." -ForegroundColor Cyan
Write-Host ""

# Secrets de monitoramento
Write-Host "📊 Adicionando secrets de monitoramento..." -ForegroundColor Yellow

"https://9d32a840111ec2a651c0c98d6ae8d543@o4510131274711040.ingest.us.sentry.io/4510131279233024" | gh secret set VITE_SENTRY_DSN --repo $REPO
"https://4d3a3b481a04bbc8f4d039be584ed488@o4510131274711040.ingest.us.sentry.io/4510131494125568" | gh secret set SENTRY_DSN --repo $REPO
"drznes/crm-schulze" | gh secret set VITE_LOGROCKET_APP_ID --repo $REPO

Write-Host ""
Write-Host "✅ Secrets de monitoramento adicionados!" -ForegroundColor Green
Write-Host ""

# Instruções para secrets que precisam de valores do usuário
Write-Host "⚠️  ATENÇÃO: Você ainda precisa adicionar manualmente:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. VERCEL_TOKEN - Obter em: https://vercel.com/account/tokens" -ForegroundColor White
Write-Host '   $token = Read-Host "Cole o VERCEL_TOKEN"; $token | gh secret set VERCEL_TOKEN --repo' $REPO -ForegroundColor Gray
Write-Host ""
Write-Host "2. VERCEL_ORG_ID - Obter rodando: vercel whoami" -ForegroundColor White
Write-Host '   vercel whoami' -ForegroundColor Gray
Write-Host '   $orgId = Read-Host "Cole o VERCEL_ORG_ID"; $orgId | gh secret set VERCEL_ORG_ID --repo' $REPO -ForegroundColor Gray
Write-Host ""
Write-Host "3. VERCEL_PROJECT_ID - Obter no Vercel: Settings > General > Project ID" -ForegroundColor White
Write-Host '   $projectId = Read-Host "Cole o VERCEL_PROJECT_ID"; $projectId | gh secret set VERCEL_PROJECT_ID --repo' $REPO -ForegroundColor Gray
Write-Host ""
Write-Host "4. DATABASE_URL - Sua connection string do PostgreSQL (já deve estar no Vercel)" -ForegroundColor White
Write-Host '   vercel env pull .env.production' -ForegroundColor Gray
Write-Host '   # Copie o DATABASE_URL do arquivo .env.production' -ForegroundColor Gray
Write-Host '   $dbUrl = Read-Host "Cole o DATABASE_URL"; $dbUrl | gh secret set DATABASE_URL --repo' $REPO -ForegroundColor Gray
Write-Host ""

# Listar secrets configurados
Write-Host "📋 Secrets atualmente configurados:" -ForegroundColor Cyan
gh secret list --repo $REPO
