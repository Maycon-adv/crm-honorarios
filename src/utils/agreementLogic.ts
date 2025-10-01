import { AgreementStatus, Installment, InstallmentStatus } from '../types';
import { getTodayISO } from './helpers';

// Helper to update installment statuses based on date
export const getUpdatedInstallments = (installments: Installment[]): Installment[] => {
    const today = getTodayISO();
    return installments.map(inst => {
        // Defensive check to prevent crash on malformed installment data
        if (!inst || typeof inst.dueDate !== 'string') {
            return inst;
        }
        if (inst.status === InstallmentStatus.Pending && inst.dueDate < today) {
            return { ...inst, status: InstallmentStatus.Overdue };
        }
        if (inst.status === InstallmentStatus.Overdue && inst.dueDate >= today) {
            return { ...inst, status: InstallmentStatus.Pending };
        }
        return inst;
    });
};

// Helper to calculate agreement status based on its installments
export const calculateAgreementStatus = (installments: Installment[]): AgreementStatus => {
    const today = getTodayISO();
    let hasOverdue = false;
    const allPaid = installments.every(i => i && i.status === InstallmentStatus.Paid);

    if (allPaid) {
        return AgreementStatus.Paid;
    }

    for (const inst of installments) {
        // Defensive check to prevent crash on malformed installment data
        if (!inst || typeof inst.dueDate !== 'string') {
            continue;
        }
        if (inst.status === InstallmentStatus.Pending && inst.dueDate < today) {
            hasOverdue = true;
            break;
        }
        if (inst.status === InstallmentStatus.Overdue) {
            hasOverdue = true;
            break;
        }
    }

    return hasOverdue ? AgreementStatus.Overdue : AgreementStatus.OnTime;
};
