import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '../types';
import { authAPI, setAuthToken, removeAuthToken } from '../services/api';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = () => {
            try {
                const storedUser = localStorage.getItem('currentUser');
                const token = localStorage.getItem('authToken');

                if (storedUser && token) {
                    setCurrentUser(JSON.parse(storedUser));
                }
            } catch (err) {
                console.error("Failed to load session", err);
                removeAuthToken();
                localStorage.removeItem('currentUser');
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    const addUser = useCallback(async (
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<{ success: boolean, message: string }> => {
        try {
            setError(null);
            const { user, token } = await authAPI.register({ name, email, password, role });

            setAuthToken(token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            setCurrentUser(user);

            return { success: true, message: 'Usuário cadastrado com sucesso!' };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao cadastrar usuário';
            setError(errorMessage);
            console.error("Failed to register user", err);
            return { success: false, message: errorMessage };
        }
    }, []);

    const login = useCallback(async (
        email: string,
        password: string
    ): Promise<{ success: boolean, message: string }> => {
        try {
            setError(null);
            const { user, token } = await authAPI.login({ email, password });

            setAuthToken(token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            setCurrentUser(user);

            return { success: true, message: 'Login bem-sucedido!' };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'E-mail ou senha inválidos';
            setError(errorMessage);
            console.error("Failed to login", err);
            return { success: false, message: errorMessage };
        }
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        removeAuthToken();
        localStorage.removeItem('currentUser');
        setError(null);
    }, []);

    const updateUserPassword = useCallback(async (
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<{ success: boolean, message: string }> => {
        // Note: This would need a backend endpoint to update password
        // For now, returning a message that this feature needs backend implementation
        return {
            success: false,
            message: 'Atualização de senha requer implementação no backend.'
        };
    }, []);

    return useMemo(() => ({
        currentUser,
        isLoading,
        error,
        addUser,
        login,
        logout,
        updateUserPassword
    }), [currentUser, isLoading, error, addUser, login, logout, updateUserPassword]);
};