import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgreementList from '../AgreementList';
import { AgreementStatus, AgreementType, PaymentMethod, InstallmentStatus, Agreement } from '../../types';
import { vi } from 'vitest';

const mockAgreements: Agreement[] = [
  {
    id: 'agreement-1',
    recordNumber: 'REC-001',
    processNumber: 'PROC-001',
    contactId: 'contact-1',
    responsibleCollaborator: 'Colaborador A',
    agreementType: AgreementType.PreExecution,
    paymentMethod: PaymentMethod.Pix,
    agreedValue: 1500,
    agreementDate: '2025-01-10',
    installments: [
      {
        id: 'inst-1',
        installmentNumber: 1,
        value: 1500,
        dueDate: '2025-02-10',
        status: InstallmentStatus.Paid,
        paymentDate: '2025-02-11',
      },
    ],
    status: AgreementStatus.Paid,
    observations: 'Pago sem pendências.',
  },
  {
    id: 'agreement-2',
    recordNumber: 'REC-002',
    processNumber: 'PROC-002',
    contactId: 'contact-2',
    responsibleCollaborator: 'Colaborador B',
    agreementType: AgreementType.PostExecution,
    paymentMethod: PaymentMethod.Boleto,
    agreedValue: 3200,
    agreementDate: '2025-02-15',
    installments: [
      {
        id: 'inst-2',
        installmentNumber: 1,
        value: 1600,
        dueDate: '2025-03-15',
        status: InstallmentStatus.Overdue,
      },
    ],
    status: AgreementStatus.Overdue,
    observations: 'Primeira parcela em atraso.',
  },
];

const mockAgreementsContext = {
  agreements: mockAgreements,
  isLoading: false,
  error: null,
  addAgreement: vi.fn(),
  updateAgreement: vi.fn(),
  deleteAgreement: vi.fn(),
  updateInstallment: vi.fn(),
};

const mockContactsContext = {
  contacts: [
    { id: 'contact-1', name: 'Cliente Alfa', email: 'alfa@example.com', phone: '11 99999-9999', document: '123' },
    { id: 'contact-2', name: 'Cliente Beta', email: 'beta@example.com', phone: '21 88888-8888', document: '456' },
  ],
  isLoading: false,
  error: null,
  addContact: vi.fn(),
  updateContact: vi.fn(),
  deleteContact: vi.fn(),
};

const mockActivityLogContext = {
  logs: [],
  isLoading: false,
  addLog: vi.fn(),
};

const mockAuthContext = {
  currentUser: { id: 'user-1', name: 'Tester', email: 'tester@example.com', role: 'Admin', createdAt: '', updatedAt: '' },
  isLoading: false,
  error: null,
  addUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  updateUserPassword: vi.fn(),
};

const mockAppContext = {
  currentPage: 'agreements' as const,
  agreementListFilter: 'all' as const,
  navigateTo: vi.fn(),
};

vi.mock('../../contexts', () => ({
  useAgreementsContext: () => mockAgreementsContext,
  useContactsContext: () => mockContactsContext,
  useActivityLogContext: () => mockActivityLogContext,
  useAuthContext: () => mockAuthContext,
  useAppContext: () => mockAppContext,
}));

describe('AgreementList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('filtra acordos pelo termo de busca', async () => {
    const user = userEvent.setup();
    render(<AgreementList />);

    expect(await screen.findByText('Cliente Alfa')).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText('Buscar por nome, ficha, processo...');

    await user.clear(searchInput);
    await user.type(searchInput, 'Beta');

    expect(await screen.findByText('Cliente Beta')).toBeInTheDocument();
    expect(screen.queryByText('Cliente Alfa')).not.toBeInTheDocument();
  });

  it('exibe mensagem quando nenhum acordo corresponde aos filtros', async () => {
    const user = userEvent.setup();
    render(<AgreementList />);

    const searchInput = await screen.findByPlaceholderText('Buscar por nome, ficha, processo...');
    await user.clear(searchInput);
    await user.type(searchInput, 'Sem resultados');

    expect(await screen.findByText('Nenhum acordo encontrado.')).toBeInTheDocument();
  });
});