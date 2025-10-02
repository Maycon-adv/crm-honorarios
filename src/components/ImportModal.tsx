import React, { useState } from 'react';
import { ICONS } from '../constants';
import { useAgreementsContext, useContactsContext, useAuthContext } from '../contexts';
import { Agreement, AgreementType, Contact, Installment, InstallmentStatus, PaymentMethod } from '../types';
import { getTodayISO } from '../utils/helpers';
import { calculateAgreementStatus, getUpdatedInstallments } from '../utils/agreementLogic';

interface ImportModalProps {
    onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose }) => {
    const { addAgreement } = useAgreementsContext();
    const { contacts, addContact } = useContactsContext();
    const { currentUser } = useAuthContext();
    const [file, setFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setFeedback('');
        }
    };

    const handleImport = () => {
        if (!file) {
            setFeedback('Por favor, selecione um arquivo CSV.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const csv = event.target?.result as string;
            try {
                const lines = csv.split('\n').slice(1); // Skip header
                let importedCount = 0;
                for (const line of lines) {
                    if (line.trim() === '') continue;
                    
                    const [partyName, recordNumber, processNumber, agreedValueStr, agreementDate, installmentsCountStr] = line.split(',');

                    if (partyName && recordNumber && agreedValueStr && agreementDate && installmentsCountStr) {
                        let contact = contacts.find(c => c.name.toLowerCase() === partyName.trim().toLowerCase());
                        if (!contact) {
                           contact = await addContact({ name: partyName.trim() });
                        }

                        const agreedValue = Number(agreedValueStr);
                        const installmentsCount = parseInt(installmentsCountStr, 10);

                        const newInstallments: Installment[] = [];
                        const valuePerInstallment = agreedValue / installmentsCount;
                        const agreementDateObj = new Date(agreementDate.trim() + 'T00:00:00');

                        for (let i = 0; i < installmentsCount; i++) {
                            const dueDate = new Date(agreementDateObj);
                            dueDate.setMonth(dueDate.getMonth() + i + 1);
                            newInstallments.push({
                                id: `inst-import-${Date.now()}-${i}`,
                                installmentNumber: i + 1,
                                value: valuePerInstallment,
                                dueDate: dueDate.toISOString().split('T')[0],
                                status: InstallmentStatus.Pending,
                            });
                        }

                        const finalInstallments = getUpdatedInstallments(newInstallments);
                        const status = calculateAgreementStatus(finalInstallments);

                        const newAgreement: Omit<Agreement, 'id'> = {
                            recordNumber: recordNumber.trim(),
                            processNumber: processNumber ? processNumber.trim() : 'N/A',
                            contactId: contact.id,
                            responsibleCollaborator: currentUser?.name || 'Importado',
                            agreementType: AgreementType.PreExecution,
                            paymentMethod: PaymentMethod.Boleto,
                            agreedValue,
                            agreementDate: agreementDate.trim(),
                            installments: finalInstallments,
                            status: status,
                        };
                        await addAgreement(newAgreement as Omit<Agreement, 'id' | 'status'>);
                        importedCount++;
                    }
                }
                setFeedback(`${importedCount} acordos importados com sucesso!`);
            } catch (error) {
                setFeedback('Erro ao processar o arquivo. Verifique o formato do CSV.');
                console.error("Import error:", error);
            }
        };
        reader.readAsText(file);
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">Importar Acordos</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{ICONS.close}</button>
                </div>
                <div className="p-8 space-y-4">
                    <p className="text-gray-600">Selecione um arquivo CSV para importar acordos em massa. O arquivo não deve conter cabeçalho.</p>
                    <p className="text-sm text-gray-500">Formato esperado: <code>Nome da Parte,Nº Ficha,Nº Processo,Valor Total,Data do Acordo (AAAA-MM-DD),Nº de Parcelas</code></p>
                    <input type="file" accept=".csv" onChange={handleFileChange} className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
                    {feedback && <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-md">{feedback}</p>}
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md">Cancelar</button>
                    <button onClick={handleImport} className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg">Importar</button>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
