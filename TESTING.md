# 🧪 Guia de Testes

## Visão Geral

O projeto possui testes separados para frontend e backend:

- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest

## 📋 Executando os Testes

### Frontend (Vitest)

```bash
# Rodar todos os testes
npm run test

# Modo watch (reexecuta ao salvar arquivos)
npm run test -- --watch

# Interface visual
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

### Backend (Jest)

```bash
cd backend

# Rodar todos os testes
npm run test

# Modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## 📁 Estrutura de Testes

### Frontend
```
src/
├── components/
│   └── __tests__/
│       └── Dashboard.test.tsx
├── utils/
│   └── __tests__/
│       └── helpers.test.ts
└── test/
    └── setup.ts
```

### Backend
```
backend/src/
├── controllers/
│   └── __tests__/
│       └── authController.test.ts
└── test/
    └── setup.ts
```

## ✅ Testes Implementados

### Frontend

#### 1. Helpers Utils (`src/utils/__tests__/helpers.test.ts`)
- ✅ `formatCurrency()` - Formatação de moeda
- ✅ `formatDate()` - Formatação de data
- ✅ `calculateDaysOverdue()` - Cálculo de dias em atraso

#### 2. Dashboard Component (`src/components/__tests__/Dashboard.test.tsx`)
- ✅ Renderização com providers
- ✅ Aceitação de props (agreements, contacts, tasks)

### Backend

#### 1. Auth Controller (`backend/src/controllers/__tests__/authController.test.ts`)
- ✅ Login validation
- ✅ Token generation
- ✅ Password hashing
- ✅ User registration

## 🔧 Configuração

### Frontend (Vitest)

**Arquivo:** `vitest.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'backend/**/*'],
  },
});
```

### Backend (Jest)

**Arquivo:** `backend/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
};
```

## 📝 Escrevendo Testes

### Frontend (Vitest)

**Teste de Componente:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

**Teste de Função:**
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../utils';

describe('myFunction', () => {
  it('should return expected value', () => {
    expect(myFunction(5)).toBe(10);
  });
});
```

### Backend (Jest)

**Teste de Controller:**
```typescript
import { Request, Response } from 'express';

describe('MyController', () => {
  it('should return 200', async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await myController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
```

## 🎯 Melhores Práticas

### ✅ DO

- ✅ Escreva testes para novas funcionalidades
- ✅ Use nomes descritivos para os testes
- ✅ Teste casos de sucesso e erro
- ✅ Mock dependências externas (APIs, banco de dados)
- ✅ Mantenha testes isolados e independentes
- ✅ Use `beforeEach` e `afterEach` para setup/cleanup

### ❌ DON'T

- ❌ Não teste implementação, teste comportamento
- ❌ Não faça testes dependentes uns dos outros
- ❌ Não use dados reais do banco de dados
- ❌ Não ignore testes falhando
- ❌ Não teste código de terceiros

## 🐛 Troubleshooting

### Problema: "jest is not defined"

**Causa:** Teste do backend está sendo executado pelo Vitest

**Solução:** Certifique-se de rodar testes do backend com:
```bash
cd backend && npm run test
```

### Problema: "useContext must be used within a Provider"

**Causa:** Componente precisa de React Context Provider

**Solução:** Envolva o componente com os providers necessários:
```typescript
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MyProvider>
      {ui}
    </MyProvider>
  );
};
```

### Problema: Testes do backend sendo encontrados pelo Vitest

**Causa:** Vitest está buscando em toda a árvore do projeto

**Solução:** Verifique `vitest.config.ts`:
```typescript
exclude: ['node_modules', 'backend/**/*']
```

### Problema: "Cannot find module '@testing-library/react'"

**Causa:** Dependências não instaladas

**Solução:**
```bash
npm install
```

### Problema: "Invalid hook call" ou "Cannot read properties of null (reading 'useState')" no coverage

**Causa:** Múltiplas cópias do React instaladas por gerenciadores de pacote diferentes (npm + pnpm)

**Solução:**
```bash
# Opção 1: Use apenas npm
rm -rf node_modules
npm install
npm run test:coverage

# Opção 2: Use apenas pnpm
rm -rf node_modules
pnpm install
pnpm test:coverage

# Opção 3: Reinicie a instalação
npm run test  # Este funciona normalmente
# O coverage pode falhar em componentes complexos mas funciona em utils
```

**Nota:** Os testes normais (`npm run test`) funcionam perfeitamente. O problema ocorre apenas com `--coverage` quando há múltiplas cópias do React.

### Problema: "pg_dump não é reconhecido" no Windows

**Causa:** PostgreSQL client tools não instalados no Windows

**Solução:**
```bash
# Opção 1: Instalar PostgreSQL no Windows
# Baixe em: https://www.postgresql.org/download/windows/
# Após instalação, adicione ao PATH: C:\Program Files\PostgreSQL\16\bin

# Opção 2: Use o backup automático do GitHub Actions
# O backup roda automaticamente no CI/CD (Linux) onde pg_dump está disponível

# Opção 3: Use Docker
docker run --rm postgres:16 pg_dump --help
```

**Nota:** O backup local é opcional. O backup automático via GitHub Actions funciona perfeitamente sem necessidade de instalação local do PostgreSQL.

## 📊 Coverage

### Executar Coverage

**Frontend:**
```bash
npm run test:coverage
```

**Backend:**
```bash
cd backend && npm run test:coverage
```

### Visualizar Relatório

Após executar coverage, abra:
- Frontend: `coverage/index.html`
- Backend: `backend/coverage/lcov-report/index.html`

### Metas de Coverage

- **Frontend:** 70%+
- **Backend:** 80%+
- **Utils/Helpers:** 90%+

## 🚀 CI/CD

Os testes rodam automaticamente no GitHub Actions:

- ✅ Em cada push
- ✅ Em cada pull request
- ✅ Antes do deploy

**Workflow:** `.github/workflows/ci.yml`

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/ladjs/supertest)

## 🔄 Atualizando Testes

Quando adicionar novas funcionalidades:

1. Escreva o teste **antes** de implementar (TDD)
2. Execute os testes: `npm run test`
3. Implemente a funcionalidade
4. Verifique se todos os testes passam
5. Adicione testes de edge cases
6. Verifique coverage: `npm run test:coverage`

---

**Última atualização:** Outubro 2025
**Versão:** 1.0
