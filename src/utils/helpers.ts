import { AgreementStatus } from "../types";

export const getTodayISO = (): string => {
    return new Date().toISOString().split('T')[0];
};

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
        // The date from input is YYYY-MM-DD, which is interpreted as UTC.
        // Adding a time and Z ensures it's treated as UTC, then we get local date parts.
        const date = new Date(`${dateString}T00:00:00Z`);
        
        // Check if the date is valid before attempting to format it.
        if (isNaN(date.getTime())) {
            console.warn(`Invalid date string received: ${dateString}`);
            return 'Data inválida';
        }
        
        // Now use UTC methods to avoid timezone shift issues.
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
        }).format(date);
    } catch (error) {
        console.error(`Error formatting date: ${dateString}`, error);
        return 'Erro na data';
    }
};
