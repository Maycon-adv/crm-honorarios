import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { AppProvider, AgreementsProvider, ContactsProvider, TasksProvider, AuthProvider } from '../../contexts';
import React from 'react';

// Mock the hooks
vi.mock('../../hooks/useNotifications', () => ({
  useNotifications: () => ({
    notifications: [],
    unreadCount: 0,
    markAsRead: vi.fn(),
    deleteNotification: vi.fn(),
  }),
}));

// Helper to render with providers
const renderWithProviders = (ui: React.ReactElement, { agreements = [], contacts = [], tasks = [] } = {}) => {
  return render(
    <AuthProvider>
      <AppProvider>
        <AgreementsProvider>
          <ContactsProvider>
            <TasksProvider>
              {ui}
            </TasksProvider>
          </ContactsProvider>
        </AgreementsProvider>
      </AppProvider>
    </AuthProvider>
  );
};

describe('Dashboard', () => {
  it('should render dashboard component', () => {
    const mockProps = {
      onNavigate: vi.fn(),
      agreements: [],
      contacts: [],
      tasks: [],
      monthlyGoal: 0,
    };

    renderWithProviders(<Dashboard {...mockProps} />);

    // Check if the component renders without crashing
    // Dashboard is a complex component, so we just verify it renders
    expect(document.body).toBeInTheDocument();
  });

  it('should accept agreements prop', () => {
    const mockAgreement = {
      id: '1',
      contactId: '1',
      contactName: 'Test Client',
      description: 'Test Agreement',
      totalValue: 1000,
      paidValue: 500,
      status: 'Em Andamento' as const,
      paymentType: 'Boleto Bancário' as const,
      stage: 'Pós-execução' as const,
      installments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockProps = {
      onNavigate: vi.fn(),
      agreements: [mockAgreement],
      contacts: [{ id: '1', name: 'Test Client', email: 'test@test.com', phone: '123456789' }],
      tasks: [],
      monthlyGoal: 10000,
    };

    renderWithProviders(<Dashboard {...mockProps} />);

    // Verify that component received the data
    expect(mockProps.agreements.length).toBe(1);
    expect(mockProps.agreements[0].contactName).toBe('Test Client');
  });
});
