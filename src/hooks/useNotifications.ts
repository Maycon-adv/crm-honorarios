import { useState, useEffect, useMemo, useCallback } from 'react';
import { Agreement, InstallmentStatus, Notification, NotificationType, Contact } from '../types';

const READ_NOTIFICATIONS_STORAGE_KEY = 'crm_read_notifications';
const UPCOMING_DAYS = 7;

export const useNotifications = (agreements: Agreement[], isLoadingAgreements: boolean, contacts: Contact[]) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());

    // Load read notification IDs from local storage on mount
    useEffect(() => {
        try {
            const storedReadIds = localStorage.getItem(READ_NOTIFICATIONS_STORAGE_KEY);
            if (storedReadIds) {
                setReadIds(new Set(JSON.parse(storedReadIds)));
            }
        } catch (error) {
            console.error("Failed to load read notifications from localStorage", error);
        }
    }, []);
    
    // Generate notifications when agreements or read IDs change
    useEffect(() => {
        // Guard clause to prevent running notification logic before agreements are loaded.
        if (isLoadingAgreements) {
            setNotifications([]);
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingDateLimit = new Date(today);
        upcomingDateLimit.setDate(today.getDate() + UPCOMING_DAYS);

        const newNotifications: Notification[] = [];

        agreements.forEach(agreement => {
            // Defensive check to ensure installments is an array before processing
            if (!agreement.installments || !Array.isArray(agreement.installments)) {
                return;
            }
            
            // Fix: Look up contact name to use in notification
            const contact = contacts.find(c => c.id === agreement.contactId);
            const partyName = contact?.name || 'Parte desconhecida';

            agreement.installments.forEach(installment => {
                const installmentId = `${agreement.id}-${installment.id}`;
                if (readIds.has(installmentId)) {
                    return; // Skip if already read
                }
                
                // Defensive check for dueDate to prevent crashes
                if (!installment.dueDate || typeof installment.dueDate !== 'string') {
                    return; // Skip if dueDate is missing or not a string
                }
                
                const dueDate = new Date(installment.dueDate + 'T00:00:00');
                
                // Final check to ensure the created date is valid
                if (isNaN(dueDate.getTime())) {
                    return;
                }

                // Overdue notifications
                if (installment.status === InstallmentStatus.Overdue) {
                     newNotifications.push({
                        id: installmentId,
                        agreementId: agreement.id,
                        agreementParty: partyName,
                        message: `A parcela #${installment.installmentNumber} venceu em ${dueDate.toLocaleDateString('pt-BR')}.`,
                        type: NotificationType.Overdue,
                        date: new Date().toISOString(),
                    });
                } 
                // Upcoming notifications
                else if (installment.status === InstallmentStatus.Pending && dueDate > today && dueDate <= upcomingDateLimit) {
                    newNotifications.push({
                        id: installmentId,
                        agreementId: agreement.id,
                        agreementParty: partyName,
                        message: `A parcela #${installment.installmentNumber} vence em ${dueDate.toLocaleDateString('pt-BR')}.`,
                        type: NotificationType.Upcoming,
                        date: new Date().toISOString(),
                    });
                }
            });
        });
        
        // Sort by date, overdue first
        newNotifications.sort((a, b) => {
            if (a.type === NotificationType.Overdue && b.type !== NotificationType.Overdue) return -1;
            if (a.type !== NotificationType.Overdue && b.type === NotificationType.Overdue) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setNotifications(newNotifications);

    }, [agreements, readIds, isLoadingAgreements, contacts]);

    const markAsRead = useCallback((notificationId: string) => {
        setReadIds(prev => {
            const newReadIds = new Set(prev);
            newReadIds.add(notificationId);
            try {
                localStorage.setItem(READ_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(Array.from(newReadIds)));
            } catch (error) {
                console.error("Failed to save read notifications to localStorage", error);
            }
            return newReadIds;
        });
    }, []);

    const value = useMemo(() => ({
        notifications,
        markAsRead,
        unreadCount: notifications.length,
    }), [notifications, markAsRead]);

    return value;
};
