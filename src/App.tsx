import React from 'react';
import { AuthProvider, useAuthContext, AppProvider, useAgreementsContext, AgreementsProvider, ActivityLogProvider, NotificationsProvider, useAppContext, ContactsProvider, TasksProvider } from './contexts';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AgreementList from './components/AgreementList';
import CalendarView from './components/CalendarView';
import ReportsPage from './components/ReportsPage';
import UserManagementPage from './components/UserManagementPage';
import ActivityLogPage from './components/ActivityLogPage';
import UserSettingsPage from './components/UserSettingsPage';
import IntegrationsPage from './components/IntegrationsPage';
import ContactManagementPage from './components/ContactManagementPage';


const MainContent: React.FC = () => {
    const { currentPage } = useAppContext();

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'agreements':
                return <AgreementList />;
            case 'calendar':
                return <CalendarView />;
            case 'reports':
                return <ReportsPage />;
            case 'contacts':
                return <ContactManagementPage />;
            case 'activity-log':
                return <ActivityLogPage />;
            case 'user-management':
                return <UserManagementPage />;
            case 'integrations':
                return <IntegrationsPage />;
            case 'settings':
                return <UserSettingsPage />;
            default:
                return <Dashboard />;
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}

const AppContent: React.FC = () => {
    const { currentUser, isLoading } = useAuthContext();
    const { isLoading: isLoadingAgreements } = useAgreementsContext();

    if (isLoading || isLoadingAgreements) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Carregando...</p>
            </div>
        )
    }

    return currentUser ? <MainContent /> : <AuthPage />;
}


const App: React.FC = () => {
    return (
        <AppProvider>
            <AuthProvider>
                <ActivityLogProvider>
                    <AgreementsProvider>
                        <ContactsProvider>
                            <TasksProvider>
                                <NotificationsProvider>
                                    <AppContent />
                                </NotificationsProvider>
                            </TasksProvider>
                        </ContactsProvider>
                    </AgreementsProvider>
                </ActivityLogProvider>
            </AuthProvider>
        </AppProvider>
    );
};

export default App;