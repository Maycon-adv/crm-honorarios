import { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityLog, User } from '../types';

const ACTIVITY_LOG_STORAGE_KEY = 'crm_activity_log';

export const useActivityLog = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedLogs = localStorage.getItem(ACTIVITY_LOG_STORAGE_KEY);
            if (storedLogs) {
                setLogs(JSON.parse(storedLogs));
            }
        } catch (error) {
            console.error("Failed to load activity logs from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem(ACTIVITY_LOG_STORAGE_KEY, JSON.stringify(logs));
            } catch (error) {
                console.error("Failed to save activity logs to localStorage", error);
            }
        }
    }, [logs, isLoading]);

    const addLog = useCallback((action: string, user: User | null, details?: { agreementId?: string; agreementRecordNumber?: string; }) => {
        if (!user) {
            console.warn("addLog called without a user.");
            return;
        }

        const newLog: ActivityLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            action: action,
            ...details
        };
        
        setLogs(prevLogs => [newLog, ...prevLogs]);
    }, []);

    return useMemo(() => ({ 
        logs, 
        isLoading, 
        addLog 
    }), [logs, isLoading, addLog]);
};