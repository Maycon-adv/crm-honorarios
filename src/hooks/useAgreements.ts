import { useState, useEffect, useCallback, useMemo } from 'react';
import { Agreement, Installment } from '../types';
import { agreementsAPI } from '../services/api';
import { getUpdatedInstallments, calculateAgreementStatus } from '../utils/agreementLogic';

export const useAgreements = () => {
    const [agreements, setAgreements] = useState<Agreement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch agreements from backend on mount (only if authenticated)
    useEffect(() => {
        const fetchAgreements = async () => {
            // Check if user is authenticated
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await agreementsAPI.getAll();

                // Update statuses on load
                const updatedAgreements = data.map((agreement: Agreement) => {
                    const updatedInstallments = getUpdatedInstallments(agreement.installments);
                    const status = calculateAgreementStatus(updatedInstallments);
                    return { ...agreement, installments: updatedInstallments, status };
                });

                setAgreements(updatedAgreements);
            } catch (err) {
                console.error("Failed to load agreements from backend", err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar acordos');
                setAgreements([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgreements();
    }, []);

    const addAgreement = useCallback(async (agreement: Omit<Agreement, 'id' | 'status'>) => {
        try {
            setError(null);
            const status = calculateAgreementStatus(agreement.installments);

            const newAgreement = await agreementsAPI.create({
                recordNumber: agreement.recordNumber,
                processNumber: agreement.processNumber,
                contactId: agreement.contactId,
                responsibleCollaborator: agreement.responsibleCollaborator,
                agreementType: agreement.agreementType,
                paymentMethod: agreement.paymentMethod,
                agreedValue: agreement.agreedValue,
                agreementDate: agreement.agreementDate,
                status: status,
                observations: agreement.observations,
                installments: agreement.installments.map(inst => ({
                    installmentNumber: inst.installmentNumber,
                    value: inst.value,
                    dueDate: inst.dueDate,
                    status: inst.status,
                    paymentDate: inst.paymentDate,
                })),
            });

            setAgreements(prev => [newAgreement, ...prev]);
            return newAgreement;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar acordo';
            setError(errorMessage);
            console.error("Failed to create agreement", err);
            throw err;
        }
    }, []);

    const updateAgreement = useCallback(async (updatedAgreement: Agreement) => {
        try {
            setError(null);
            const updatedInstallments = getUpdatedInstallments(updatedAgreement.installments);
            const status = calculateAgreementStatus(updatedInstallments);

            const updated = await agreementsAPI.update(updatedAgreement.id, {
                recordNumber: updatedAgreement.recordNumber,
                processNumber: updatedAgreement.processNumber,
                contactId: updatedAgreement.contactId,
                responsibleCollaborator: updatedAgreement.responsibleCollaborator,
                agreementType: updatedAgreement.agreementType,
                paymentMethod: updatedAgreement.paymentMethod,
                agreedValue: updatedAgreement.agreedValue,
                agreementDate: updatedAgreement.agreementDate,
                status: status,
                observations: updatedAgreement.observations,
            });

            const finalAgreement = { ...updated, installments: updatedInstallments, status };
            setAgreements(prev => prev.map(a => a.id === finalAgreement.id ? finalAgreement : a));
            return finalAgreement;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar acordo';
            setError(errorMessage);
            console.error("Failed to update agreement", err);
            throw err;
        }
    }, []);

    const deleteAgreement = useCallback(async (agreementId: string) => {
        try {
            setError(null);
            await agreementsAPI.delete(agreementId);
            setAgreements(prev => prev.filter(a => a.id !== agreementId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir acordo';
            setError(errorMessage);
            console.error("Failed to delete agreement", err);
            throw err;
        }
    }, []);

    const updateInstallment = useCallback(async (agreementId: string, installmentId: string, updatedInstallment: Installment) => {
        try {
            setError(null);

            // Update installment on backend
            await agreementsAPI.updateInstallment(agreementId, installmentId, {
                status: updatedInstallment.status,
                paymentDate: updatedInstallment.paymentDate,
            });

            // Update local state
            setAgreements(prev => {
                const agreementToUpdate = prev.find(a => a.id === agreementId);
                if (!agreementToUpdate) return prev;

                const newInstallments = agreementToUpdate.installments.map(i =>
                    i.id === installmentId ? updatedInstallment : i
                );
                const newStatus = calculateAgreementStatus(newInstallments);

                const updatedAgreement = {
                    ...agreementToUpdate,
                    installments: newInstallments,
                    status: newStatus
                };

                return prev.map(a => a.id === agreementId ? updatedAgreement : a);
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar parcela';
            setError(errorMessage);
            console.error("Failed to update installment", err);
            throw err;
        }
    }, []);

    const value = useMemo(() => ({
        agreements,
        isLoading,
        error,
        addAgreement,
        updateAgreement,
        deleteAgreement,
        updateInstallment,
    }), [agreements, isLoading, error, addAgreement, updateAgreement, deleteAgreement, updateInstallment]);

    return value;
};