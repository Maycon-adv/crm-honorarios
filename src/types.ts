// FIX: Removed self-import of `AgreementStatus`. The type is defined below in this file, and importing it was causing a declaration conflict.

export type Page = 
    | 'dashboard'
    | 'agreements'
    | 'calendar'
    | 'reports'
    | 'contacts'
    | 'activity-log'
    | 'user-management'
    | 'integrations'
    | 'settings';

export enum UserRole {
    Admin = 'Admin',
    Dev = 'Dev',
    Collaborator = 'Colaborador',
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
}

export enum AgreementStatus {
    OnTime = 'Em Dia',
    Overdue = 'Atrasado',
    Paid = 'Pago',
    Cancelled = 'Cancelado',
}

export enum InstallmentStatus {
    Pending = 'Pendente',
    Overdue = 'Vencida',
    Paid = 'Paga',
}

export enum AgreementType {
    PreExecution = 'Pré-execução',
    PostExecution = 'Pós-execução',
}

export enum PaymentMethod {
    Boleto = 'Boleto Bancário',
    Pix = 'Pix',
    Transferencia = 'Transferência Bancária',
    Cartao = 'Cartão de Crédito',
}

export interface Installment {
    id: string;
    installmentNumber: number;
    value: number;
    dueDate: string; // YYYY-MM-DD
    status: InstallmentStatus;
    paymentDate?: string; // YYYY-MM-DD
}

export interface Contact {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    document?: string;
}

export interface Agreement {
    id: string;
    recordNumber: string;
    processNumber: string;
    contactId: string;
    responsibleCollaborator: string;
    agreementType: AgreementType;
    paymentMethod: PaymentMethod;
    agreedValue: number;
    agreementDate: string; // YYYY-MM-DD
    installments: Installment[];
    status: AgreementStatus;
    observations?: string;
}

export interface ActivityLog {
    id: string;
    timestamp: string; // ISO string
    userId: string;
    userName: string;
    action: string;
    agreementId?: string;
    agreementRecordNumber?: string;
}

export enum NotificationType {
    Overdue = 'Overdue',
    Upcoming = 'Upcoming',
}

export interface Notification {
    id: string;
    agreementId: string;
    agreementParty: string;
    message: string;
    type: NotificationType;
    date: string; // ISO string
}

export interface GoalRecord {
    month: string; // YYYY-MM
    goal: number;
    achieved: number;
}

export enum TaskStatus {
    Pending = 'Pendente',
    Completed = 'Concluída',
}

export interface Task {
    id: string;
    title: string;
    dueDate: string; // YYYY-MM-DD
    status: TaskStatus;
    userId: string;
}