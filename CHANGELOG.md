# Changelog - CRM Honorários

Todas as mudanças importantes do projeto serão documentadas neste arquivo.

## [1.1.0] - 2025-10-03

### ✅ Adicionado

#### Segurança
- **Rate Limiting** implementado para prevenir ataques de força bruta
  - Rotas de autenticação: 5 tentativas a cada 15 minutos por IP
  - API geral: 100 requisições a cada 15 minutos por IP
- Validação aprimorada de dados no backend

#### Documentação
- **API.md**: Documentação completa da API REST
  - Todos os endpoints documentados
  - Exemplos de requisições e respostas
  - Códigos de erro e tratamento
  - Informações sobre rate limiting
- **DEPLOY-GUIDE.md** atualizado com:
  - Seção de troubleshooting completa
  - Solução para erro FUNCTION_INVOCATION_FAILED
  - Instruções para atualizar domínio principal
  - Configurações de CORS
  - Informações sobre rate limiting
- **README.md** melhorado com:
  - Informações sobre deploy em produção
  - Links para documentação da API
  - Detalhes sobre segurança implementada
  - URLs de produção

#### Infraestrutura
- Tailwind CSS v4 via PostCSS (já estava configurado, confirmado)
- Script `vercel-build` para build em produção

### 🔧 Corrigido
- Erro de sintaxe no console.log do servidor
- Configuração do Vercel para serverless functions
- Problema de alias do domínio principal

### 📝 Alterado
- Backend agora usa PostgreSQL em produção (Neon)
- Melhorias na configuração de CORS
- Health check endpoint com mais informações

---

## [1.0.0] - 2025-10-01

### ✅ Lançamento Inicial

#### Features
- Sistema completo de CRM para gestão de honorários advocatícios
- Gestão de Contatos com CRUD completo
- Gestão de Acordos com controle de parcelas
- Dashboard com estatísticas e gráficos
- Sistema de Tarefas com prioridades
- Calendário de vencimentos
- Autenticação JWT segura
- Notificações de vencimentos
- Log de atividades

#### Tecnologias
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: Prisma ORM + PostgreSQL/SQLite
- Segurança: JWT + bcrypt + Zod validation

---

## 🔜 Próximas Versões

### Planejado para v1.2.0
- [ ] Configuração de domínio customizado
- [ ] Integração com serviço de email para notificações
- [ ] Relatórios em PDF exportáveis
- [ ] Filtros avançados no dashboard
- [ ] Backup automático de dados
- [ ] Logs de auditoria detalhados
- [ ] Testes automatizados (frontend e backend)
- [ ] CI/CD pipeline

### Ideias Futuras
- [ ] Aplicativo mobile (React Native)
- [ ] Integração com sistemas de pagamento
- [ ] Assinaturas eletrônicas
- [ ] Chat interno para colaboração
- [ ] Notificações push
- [ ] Dashboard personalizável
- [ ] Exportação de dados para Excel/CSV
- [ ] API pública com documentação Swagger
