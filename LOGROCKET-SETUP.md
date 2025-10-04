# 🎥 Configuração LogRocket - Guia Completo

## ✅ App ID Obtido

```
drznes/crm-schulze
```

---

## 📝 Passo 1: Configuração Local (CONCLUÍDO ✅)

**Arquivo criado:** `.env.local`

```env
VITE_LOGROCKET_APP_ID=drznes/crm-schulze
```

**Código atualizado:** `src/index.tsx`
- ✅ LogRocket inicializado
- ✅ Integração com Sentry (session URLs)
- ✅ Sanitização de dados sensíveis (Authorization headers)

---

## 🔧 Passo 2: Configurar Vercel

### 2.1 Acessar Environment Variables

```
https://vercel.com/[seu-usuario]/crm-honorarios/settings/environment-variables
```

### 2.2 Adicionar Variável

Clique em **"Add New"**:

```
Key:   VITE_LOGROCKET_APP_ID
Value: drznes/crm-schulze

Environments:
☑ Production
☑ Preview
☐ Development
```

### 2.3 Redeploy

```
Vercel Dashboard > Deployments > (três pontinhos) > Redeploy
```

---

## 🔐 Passo 3: Configurar GitHub Secrets

### 3.1 Acessar GitHub Secrets

```
https://github.com/Maycon-adv/crm-honorarios/settings/secrets/actions
```

### 3.2 Adicionar Secret

Clique em **"New repository secret"**:

```
Name:  VITE_LOGROCKET_APP_ID
Value: drznes/crm-schulze
```

---

## 🧪 Passo 4: Testar o LogRocket

### 4.1 Testar Localmente

```bash
# 1. Iniciar o projeto
npm run dev

# 2. Abrir http://localhost:5173

# 3. Abrir o Console (F12) - você deve ver:
✅ LogRocket initialized: drznes/crm-schulze

# 4. Usar o app normalmente:
   - Fazer login
   - Navegar por algumas páginas
   - Criar um acordo
   - Etc.

# 5. Ver sessão no LogRocket:
https://app.logrocket.com/drznes/crm-schulze/sessions

# Deve aparecer sua sessão!
```

### 4.2 Testar em Produção

```bash
# 1. Após redeploy, acessar:
https://crm-honorarios.vercel.app

# 2. Abrir console (F12) - verificar:
✅ LogRocket initialized: drznes/crm-schulze

# 3. Usar o app normalmente

# 4. Verificar sessão:
https://app.logrocket.com/drznes/crm-schulze/sessions
```

---

## 📊 Recursos do LogRocket

### O que o LogRocket Captura

Para cada sessão, você verá:

1. **Replay da Sessão**
   - Vídeo completo da navegação do usuário
   - Cliques, scrolls, interações

2. **Console Logs**
   - Todos os console.log, console.error, etc.
   - Warnings e erros

3. **Network Activity**
   - Todas as requisições HTTP
   - Respostas da API
   - Tempos de carregamento

4. **Redux/State**
   - Mudanças de estado (se configurado)
   - Actions dispatched

5. **Performance**
   - Métricas de carregamento
   - FPS
   - Memória

6. **User Info**
   - Browser e versão
   - Sistema operacional
   - Resolução de tela
   - Localização (opcional)

---

## 🔗 Integração com Sentry

**Status:** ✅ JÁ CONFIGURADO

Quando um erro ocorre no Sentry, a URL da sessão do LogRocket é anexada automaticamente:

```typescript
// Em src/index.tsx (linhas 41-47)
beforeSend(event) {
  event.extra = event.extra || {};
  event.extra.sessionURL = LogRocket.sessionURL;
  return event;
}
```

**Resultado:** No Sentry, cada erro terá um link direto para a sessão do LogRocket! 🎯

---

## 👤 Identificar Usuários (Opcional)

Para rastrear usuários específicos, adicione em `src/hooks/useAuth.ts`:

```typescript
import LogRocket from 'logrocket';

// Após login bem-sucedido:
const handleLogin = async (email, password) => {
  // ... seu código de login ...

  // Identificar usuário no LogRocket
  LogRocket.identify(user.id, {
    name: user.name,
    email: user.email,
    role: user.role,
  });

  // Identificar no Sentry também
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
};
```

**Benefício:** Filtrar sessões por usuário específico!

---

## 🎯 Filtros e Busca

No dashboard do LogRocket, você pode filtrar por:

- **URL visitada**
- **Tempo de sessão**
- **Erros ocorridos**
- **Browser/OS**
- **Custom events**
- **Console errors**

---

## 🚨 Casos de Uso Comuns

### 1. Usuário Reporta Bug

```
1. Usuário: "Não consigo criar acordo"
2. Você: "Qual seu email?"
3. Buscar sessões do usuário no LogRocket
4. Ver exatamente o que ele fez
5. Reproduzir o bug
6. Corrigir
```

### 2. Erro em Produção

```
1. Sentry alerta: "TypeError em AgreementList"
2. Clicar no link da sessão LogRocket
3. Ver o que o usuário fez antes do erro
4. Entender o contexto
5. Corrigir
```

### 3. Performance Issues

```
1. Usuário: "App está lento"
2. Ver sessão no LogRocket
3. Verificar network tab (requests lentos)
4. Ver performance metrics
5. Otimizar
```

---

## ⚙️ Configurações Avançadas (Opcional)

### Privacy Settings

Para mascarar dados sensíveis:

```typescript
LogRocket.init('drznes/crm-schulze', {
  // Mascarar inputs com classe 'sensitive'
  dom: {
    inputSanitizer: true,
  },

  // Não capturar certas requisições
  network: {
    requestSanitizer: (request) => {
      // Já configurado para Authorization
      if (request.url.includes('/password')) {
        return null; // Não captura
      }
      return request;
    },
  },
});
```

### Performance Optimization

```typescript
// Reduzir FPS do replay (economiza banda)
LogRocket.init('drznes/crm-schulze', {
  console: {
    shouldAggregateConsoleErrors: true,
  },
  network: {
    isEnabled: true,
  },
  dom: {
    baseHref: window.location.origin,
  },
});
```

---

## 📈 Métricas e Analytics

### Dashboard Principal

```
https://app.logrocket.com/drznes/crm-schulze/analytics
```

Métricas disponíveis:
- Sessões ativas
- Erros por usuário
- Páginas mais visitadas
- Performance médio
- Browser/OS distribution

---

## ✅ Checklist Final

### Configuração Local
- [x] Código atualizado com App ID
- [x] `.env.local` criado
- [ ] Testado localmente
- [ ] Sessão visível no dashboard

### Configuração Vercel
- [ ] VITE_LOGROCKET_APP_ID adicionado
- [ ] Redeploy realizado
- [ ] Testado em produção

### Configuração GitHub
- [ ] VITE_LOGROCKET_APP_ID nos secrets
- [ ] CI/CD usando a variável

### Integração
- [x] Integração com Sentry configurada
- [ ] User identification (opcional)
- [ ] Custom events (opcional)

---

## 🎓 Próximos Passos

1. **Testar Localmente**
   - Rodar `npm run dev`
   - Navegar pelo app
   - Ver sessão no LogRocket

2. **Deploy para Produção**
   - Adicionar variável no Vercel
   - Redeploy
   - Testar em produção

3. **Configurar Alertas**
   - Alertas de erro
   - Alertas de performance
   - Email notifications

4. **Adicionar User Tracking**
   - Identificar usuários após login
   - Custom properties
   - Tags personalizadas

---

## 📚 Recursos

- **Dashboard:** https://app.logrocket.com/drznes/crm-schulze
- **Documentação:** https://docs.logrocket.com/
- **React Guide:** https://docs.logrocket.com/docs/react
- **Sentry Integration:** https://docs.logrocket.com/docs/sentry

---

**Configuração criada em:** 04 de Outubro de 2025
**Status:** ✅ Configurado localmente, pronto para testar
