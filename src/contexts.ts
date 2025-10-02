import React, { createContext, useContext, useState, PropsWithChildren, useCallback } from 'react';
import { Page, User, UserRole, Agreement, AgreementStatus, ActivityLog, Notification, Contact, Task, TaskStatus } from './types';
import { useAuth } from './hooks/useAuth';
import { useAgreements } from './hooks/useAgreements';
import { useActivityLog } from './hooks/useActivityLog';
import { useNotifications } from './hooks/useNotifications';
import { useContacts } from './hooks/useContacts';
import { useTasks } from './hooks/useTasks';

// App Context
interface AppContextType {
    currentPage: Page;
    navigateTo: (page: Page, filter?: AgreementStatus | AgreementStatus[] | 'all') => void;
    agreementListFilter: AgreementStatus | AgreementStatus[] | 'all';
}
export const AppContext = createContext<AppContextType | undefined>(undefined);
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within an AppProvider");
    return context;
};
export const AppProvider = ({ children }: PropsWithChildren) => {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [agreementListFilter, setAgreementListFilter] = useState<AgreementStatus | AgreementStatus[] | 'all'>('all');

    const navigateTo = useCallback((page: Page, filter?: AgreementStatus | AgreementStatus[] | 'all') => {
        if (filter) {
            setAgreementListFilter(filter);
        } else {
            setAgreementListFilter('all');
        }
        setCurrentPage(page);
    }, []);
    
    return React.createElement(AppContext.Provider, { value: { currentPage, navigateTo, agreementListFilter } }, children);
};


// Auth Context
interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
    addUser: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean, message: string }>;
    login: (email: string, password: string) => Promise<{ success: boolean, message: string }>;
    logout: () => void;
    updateUserPassword: (userId: string, currentPassword: string, newPassword: string) => Promise<{ success: boolean, message: string }>;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
    return context;
};
export const AuthProvider = ({ children }: PropsWithChildren) => {
    const auth = useAuth();
    return React.createElement(AuthContext.Provider, { value: auth }, children);
};


// Agreements Context
interface AgreementsContextType {
    agreements: Agreement[];
    isLoading: boolean;
    error: string | null;
    addAgreement: (agreement: Omit<Agreement, 'id' | 'status'>) => Promise<Agreement>;
    updateAgreement: (agreement: Agreement) => Promise<Agreement>;
    deleteAgreement: (agreementId: string) => Promise<void>;
    updateInstallment: (agreementId: string, installmentId: string, updatedInstallment: any) => Promise<void>;
}
export const AgreementsContext = createContext<AgreementsContextType | undefined>(undefined);
export const useAgreementsContext = () => {
    const context = useContext(AgreementsContext);
    if (!context) throw new Error("useAgreementsContext must be used within an AgreementsProvider");
    return context;
};
export const AgreementsProvider = ({ children }: PropsWithChildren) => {
    const agreementsData = useAgreements();
    return React.createElement(AgreementsContext.Provider, { value: agreementsData }, children);
};


// ActivityLog Context
interface ActivityLogContextType {
    logs: ActivityLog[];
    isLoading: boolean;
    addLog: (action: string, user: User | null, details?: { agreementId?: string; agreementRecordNumber?: string; }) => void;
}
export const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);
export const useActivityLogContext = () => {
    const context = useContext(ActivityLogContext);
    if (!context) throw new Error("useActivityLogContext must be used within an ActivityLogProvider");
    return context;
};
export const ActivityLogProvider = ({ children }: PropsWithChildren) => {
    const logData = useActivityLog();
    return React.createElement(ActivityLogContext.Provider, { value: logData }, children);
};

// Contacts Context
interface ContactsContextType {
    contacts: Contact[];
    isLoading: boolean;
    error: string | null;
    addContact: (contact: Omit<Contact, 'id'>) => Promise<Contact>;
    updateContact: (contact: Contact) => Promise<Contact>;
    deleteContact: (contactId: string) => Promise<void>;
}
export const ContactsContext = createContext<ContactsContextType | undefined>(undefined);
export const useContactsContext = () => {
    const context = useContext(ContactsContext);
    if (!context) throw new Error("useContactsContext must be used within a ContactsProvider");
    return context;
};
export const ContactsProvider = ({ children }: PropsWithChildren) => {
    const contactsData = useContacts();
    return React.createElement(ContactsContext.Provider, { value: contactsData }, children);
};

// Tasks Context
interface TasksContextType {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    addTask: (title: string, dueDate: string, userId: string) => Promise<Task>;
    updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
}
export const TasksContext = createContext<TasksContextType | undefined>(undefined);
export const useTasksContext = () => {
    const context = useContext(TasksContext);
    if (!context) throw new Error("useTasksContext must be used within a TasksProvider");
    return context;
};
export const TasksProvider = ({ children }: PropsWithChildren) => {
    const tasksData = useTasks();
    return React.createElement(TasksContext.Provider, { value: tasksData }, children);
};

// Notifications Context
interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (notificationId: string) => void;
}
export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);
export const useNotificationsContext = () => {
    const context = useContext(NotificationsContext);
    if (!context) throw new Error("useNotificationsContext must be used within a NotificationsProvider");
    return context;
}
export const NotificationsProvider = ({ children }: PropsWithChildren) => {
    const { agreements, isLoading: isLoadingAgreements } = useAgreementsContext();
    const { contacts } = useContactsContext();
    const notificationsData = useNotifications(agreements, isLoadingAgreements, contacts);
    return React.createElement(NotificationsContext.Provider, { value: notificationsData }, children);
};