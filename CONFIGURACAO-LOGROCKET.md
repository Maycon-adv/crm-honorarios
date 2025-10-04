# Configuração do LogRocket

## ✅ Status: Configurado e Funcionando

### 📊 Informações da Conta

**App ID**: `drznes/crm-schulze`
**API Key**: `drznes:crm-schulze:WGaOrbYiynJIIvxDEQmQ`
**Dashboard**: https://app.logrocket.com/drznes/crm-schulze/

---

## 🔧 Configuração Atual

### Frontend (React)
Localização: `src/index.tsx`

```typescript
// Initialize LogRocket
const logRocketAppId = import.meta.env.VITE_LOGROCKET_APP_ID;
if (logRocketAppId && logRocketAppId !== 'false' && logRocketAppId.trim() !== '') {
  try {
    LogRocket.init(logRocketAppId, {
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      network: {
        requestSanitizer: (request) => {
          // Sanitize sensitive data from requests
          if (request.headers['Authorization']) {
            request.headers['Authorization'] = '[REDACTED]';
          }
          return request;
        },
      },
    });
    console.log('✅ LogRocket initialized:', logRocketAppId);
  } catch (error) {
    console.error('❌ LogRocket initialization failed:', error);
  }
} else {
  console.warn('⚠️ LogRocket not initialized: VITE_LOGROCKET_APP_ID not configured');
}
```

### Variáveis de Ambiente

#### Local (.env.local)
```env
VITE_LOGROCKET_APP_ID=drznes/crm-schulze
```

#### Vercel (Produção)
```bash
# Já configurado via CLI
VITE_LOGROCKET_APP_ID=drznes/crm-schulze
```

Verificar em: https://vercel.com/maycon-ruhans-projects/crm-honorarios/settings/environment-variables

---

## 🎯 Funcionalidades Ativas

### ✅ Session Replay
- Grava todas as interações do usuário
- Reproduz sessões completas com mouse, cliques, scrolls
- Captura estados da aplicação

### ✅ Network Sanitization
- Remove automaticamente headers de autenticação (`Authorization`)
- Protege dados sensíveis nas requisições gravadas

### ✅ Error Tracking Integration
- Integrado com Sentry via `sessionURL`
- Cada erro no Sentry inclui link para a sessão LogRocket
- Facilita debug ao ver exatamente o que o usuário fez

### ✅ Release Tracking
- Versão da aplicação registrada em cada sessão
- Variável: `VITE_APP_VERSION` (default: '1.0.0')

---

## 📝 Notas Importantes

### React 19 Compatibility
O plugin `logrocket-react` **não é compatível** com React 19.

**Solução Implementada**:
- ❌ Removido: `setupLogRocketReact(LogRocket)`
- ✅ Mantido: LogRocket core (session replay funciona perfeitamente)
- ℹ️ Funcionalidade perdida: Integração automática com React DevTools

### Validação Rigorosa
A inicialização do LogRocket agora valida:
1. Variável `VITE_LOGROCKET_APP_ID` está definida
2. Valor não é string vazia ou 'false'
3. Try-catch para capturar erros de inicialização

**Por quê?**
Evita erro em produção: "LogRocket: must pass a valid application id"

---

## 🧪 Como Testar

### 1. Ambiente Local
```bash
# Iniciar aplicação
npm run dev

# Verificar no console do navegador
# Deve aparecer: ✅ LogRocket initialized: drznes/crm-schulze
```

### 2. Ambiente de Produção
1. Acesse: https://crm-honorarios-maycon-ruhans-projects.vercel.app
2. Abra DevTools (F12) → Console
3. Verifique a mensagem: `✅ LogRocket initialized: drznes/crm-schulze`
4. Navegue pela aplicação (login, criar contato, etc.)
5. Acesse o dashboard: https://app.logrocket.com/drznes/crm-schulze/
6. Veja sua sessão gravada e assista o replay

### 3. Integração com Sentry
1. Force um erro na aplicação (ex: login inválido)
2. Acesse Sentry: https://crm-schulze.sentry.io/
3. Abra o erro capturado
4. Procure o campo `sessionURL` nos detalhes do erro
5. Clique para ver a sessão LogRocket exata onde o erro ocorreu

---

## 🔗 Links Úteis

- **Dashboard LogRocket**: https://app.logrocket.com/drznes/crm-schulze/
- **Sentry Dashboard**: https://crm-schulze.sentry.io/
- **Documentação LogRocket**: https://docs.logrocket.com/
- **Documentação React Integration**: https://docs.logrocket.com/reference/react
- **Network Sanitization**: https://docs.logrocket.com/reference/network

---

## 🐛 Troubleshooting

### Problema: "LogRocket: must pass a valid application id"
**Causa**: Variável de ambiente não configurada ou vazia
**Solução**:
```bash
# Verificar no Vercel
vercel env ls production | grep LOGROCKET

# Reconfigurar se necessário
echo "drznes/crm-schulze" | vercel env add VITE_LOGROCKET_APP_ID production --force
```

### Problema: Sessões não aparecem no dashboard
**Causa**: LogRocket não inicializou corretamente
**Solução**:
1. Abra DevTools → Console
2. Procure por erros relacionados a LogRocket
3. Verifique se aparece: `✅ LogRocket initialized`
4. Se aparecer warning, corrija a variável de ambiente

### Problema: Dados sensíveis sendo gravados
**Causa**: Sanitização de rede não configurada corretamente
**Solução**: Já implementada! Headers de Authorization são automaticamente removidos:
```typescript
network: {
  requestSanitizer: (request) => {
    if (request.headers['Authorization']) {
      request.headers['Authorization'] = '[REDACTED]';
    }
    return request;
  },
}
```

---

## 📈 Próximos Passos (Opcional)

### 1. Adicionar Identificação de Usuário
```typescript
// Após login bem-sucedido
LogRocket.identify(user.id, {
  name: user.name,
  email: user.email,
  role: user.role,
});
```

### 2. Custom Events
```typescript
// Rastrear ações importantes
LogRocket.track('Novo Acordo Criado', {
  valor: agreement.totalValue,
  tipo: agreement.paymentType,
});
```

### 3. Console Logs
```typescript
// Adicionar contexto aos logs
LogRocket.log('Iniciando processamento de pagamento', {
  agreementId,
  amount,
});
```

---

**Status Final**: 🟢 LogRocket configurado e operacional em produção!

Última atualização: 2025-10-04
