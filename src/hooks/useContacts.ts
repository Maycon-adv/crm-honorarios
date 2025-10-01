import { useState, useEffect, useCallback, useMemo } from 'react';
import { Contact } from '../types';
import { contactsAPI } from '../services/api';

export const useContacts = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch contacts from backend on mount (only if authenticated)
    useEffect(() => {
        const fetchContacts = async () => {
            // Check if user is authenticated
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await contactsAPI.getAll();
                setContacts(data);
            } catch (err) {
                console.error("Failed to load contacts from backend", err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar contatos');
                setContacts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, []);

    const addContact = useCallback(async (contact: Omit<Contact, 'id'>) => {
        try {
            setError(null);
            const newContact = await contactsAPI.create({
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                document: contact.document,
            });
            setContacts(prev => [newContact, ...prev]);
            return newContact;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar contato';
            setError(errorMessage);
            console.error("Failed to create contact", err);
            throw err;
        }
    }, []);

    const updateContact = useCallback(async (updatedContact: Contact) => {
        try {
            setError(null);
            const updated = await contactsAPI.update(updatedContact.id, {
                name: updatedContact.name,
                email: updatedContact.email,
                phone: updatedContact.phone,
                document: updatedContact.document,
            });
            setContacts(prev => prev.map(c => c.id === updatedContact.id ? updated : c));
            return updated;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar contato';
            setError(errorMessage);
            console.error("Failed to update contact", err);
            throw err;
        }
    }, []);

    const deleteContact = useCallback(async (contactId: string) => {
        try {
            setError(null);
            await contactsAPI.delete(contactId);
            setContacts(prev => prev.filter(c => c.id !== contactId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir contato';
            setError(errorMessage);
            console.error("Failed to delete contact", err);
            // Show user-friendly error message
            if (errorMessage.includes('acordos')) {
                alert('Não é possível excluir este contato, pois ele está vinculado a um ou mais acordos.');
            }
            throw err;
        }
    }, []);

    return useMemo(() => ({
        contacts,
        isLoading,
        error,
        addContact,
        updateContact,
        deleteContact,
    }), [contacts, isLoading, error, addContact, updateContact, deleteContact]);
};