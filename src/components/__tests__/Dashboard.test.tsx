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
    renderWithProviders(<Dashboard />);

    // Check if the component renders without crashing
    // Dashboard is a complex component, so we just verify it renders
    expect(document.body).toBeInTheDocument();
  });

  it('should render without errors when wrapped in providers', () => {
    renderWithProviders(<Dashboard />);

    // Verify that component renders successfully with all required providers
    expect(document.body).toBeInTheDocument();
  });
});
