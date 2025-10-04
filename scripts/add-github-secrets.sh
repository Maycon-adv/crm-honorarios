#!/bin/bash

# Script para adicionar secrets ao GitHub Actions
# Requer: GitHub CLI (gh) autenticado

REPO="Maycon-adv/crm-honorarios"

echo "🔐 Adicionando secrets ao GitHub Actions..."
echo ""

# Secrets de monitoramento
echo "📊 Adicionando secrets de monitoramento..."
echo "https://9d32a840111ec2a651c0c98d6ae8d543@o4510131274711040.ingest.us.sentry.io/4510131279233024" | gh secret set VITE_SENTRY_DSN --repo $REPO
echo "https://4d3a3b481a04bbc8f4d039be584ed488@o4510131274711040.ingest.us.sentry.io/4510131494125568" | gh secret set SENTRY_DSN --repo $REPO
echo "drznes/crm-schulze" | gh secret set VITE_LOGROCKET_APP_ID --repo $REPO

echo ""
echo "✅ Secrets de monitoramento adicionados!"
echo ""

# Instruções para secrets que precisam de valores do usuário
echo "⚠️  ATENÇÃO: Você ainda precisa adicionar manualmente:"
echo ""
echo "1. VERCEL_TOKEN - Obter em: https://vercel.com/account/tokens"
echo "   gh secret set VERCEL_TOKEN --repo $REPO"
echo ""
echo "2. VERCEL_ORG_ID - Obter rodando: vercel whoami"
echo "   gh secret set VERCEL_ORG_ID --repo $REPO"
echo ""
echo "3. VERCEL_PROJECT_ID - Obter em: vercel env ls (campo 'Project')"
echo "   gh secret set VERCEL_PROJECT_ID --repo $REPO"
echo ""
echo "4. DATABASE_URL - Sua connection string do PostgreSQL"
echo "   gh secret set DATABASE_URL --repo $REPO"
echo ""

# Listar secrets configurados
echo "📋 Secrets atualmente configurados:"
gh secret list --repo $REPO
