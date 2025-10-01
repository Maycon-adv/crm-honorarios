import React from 'react';
import { Agreement, Installment, InstallmentStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ICONS } from '../constants';
import { useAgreementsContext, useActivityLogContext, useAuthContext, useContactsContext } from '../contexts';
import { getTodayISO } from '../utils/helpers';

interface AgreementDetailModalProps {
    agreement: Agreement;
    onClose: () => void;
}

const AgreementDetailModal: React.FC<AgreementDetailModalProps> = ({ agreement, onClose }) => {
    const { updateInstallment } = useAgreementsContext();
    const { addLog } = useActivityLogContext();
    const { currentUser } = useAuthContext();
    const { contacts } = useContactsContext();

    const contact = contacts.find(c => c.id === agreement.contactId);

    const handleMarkAsPaid = (installment: Installment) => {
        const paymentDate = getTodayISO();
        updateInstallment(agreement.id, installment.id, { ...installment, status: InstallmentStatus.Paid, paymentDate });
        addLog(`Marcou a parcela #${installment.installmentNumber} do acordo #${agreement.recordNumber} como paga.`, currentUser, { agreementId: agreement.id, agreementRecordNumber: agreement.recordNumber });
    };

    const handleMarkAsPending = (installment: Installment) => {
        updateInstallment(agreement.id, installment.id, { ...installment, status: InstallmentStatus.Pending, paymentDate: undefined });
        addLog(`Marcou a parcela #${installment.installmentNumber} do acordo #${agreement.recordNumber} como pendente.`, currentUser, { agreementId: agreement.id, agreementRecordNumber: agreement.recordNumber });
    };

    const getStatusBadge = (status: InstallmentStatus) => {
        switch (status) {
            case InstallmentStatus.Pending: return 'bg-yellow-100 text-yellow-800';
            case InstallmentStatus.Overdue: return 'bg-red-100 text-red-800';
            case InstallmentStatus.Paid: return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start py-10 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">Detalhes do Acordo</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{ICONS.close}</button>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                        <div><strong className="text-gray-600">Parte:</strong> <span className="text-gray-800">{contact?.name || 'N/A'}</span></div>
                        <div><strong className="text-gray-600">Ficha:</strong> <span className="text-gray-800">{agreement.recordNumber}</span></div>
                        <div><strong className="text-gray-600">CPF/CNPJ:</strong> <span className="text-gray-800">{contact?.document || 'N/A'}</span></div>
                        <div><strong className="text-gray-600">Processo:</strong> <span className="text-gray-800">{agreement.processNumber}</span></div>
                        <div><strong className="text-gray-600">Colaborador:</strong> <span className="text-gray-800">{agreement.responsibleCollaborator}</span></div>
                        <div><strong className="text-gray-600">Data do Acordo:</strong> <span className="text-gray-800">{formatDate(agreement.agreementDate)}</span></div>
                        <div><strong className="text-gray-600">Valor Total:</strong> <span className="text-gray-800 font-bold">{formatCurrency(agreement.agreedValue)}</span></div>
                        <div><strong className="text-gray-600">Status:</strong> <span className="text-gray-800">{agreement.status}</span></div>
                    </div>

                    <h4 className="text-xl font-semibold text-gray-700 mb-4 border-t pt-6">Parcelas</h4>
                    <div className="max-h-80 overflow-y-auto pr-2">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nº</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Pagto.</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {agreement.installments.map(inst => (
                                    <tr key={inst.id}>
                                        <td className="px-4 py-3">{inst.installmentNumber}</td>
                                        <td className="px-4 py-3">{formatDate(inst.dueDate)}</td>
                                        <td className="px-4 py-3">{formatCurrency(inst.value)}</td>
                                        <td className="px-4 py-3"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(inst.status)}`}>{inst.status}</span></td>
                                        <td className="px-4 py-3">{inst.paymentDate ? formatDate(inst.paymentDate) : '-'}</td>
                                        <td className="px-4 py-3 text-center">
                                            {inst.status !== InstallmentStatus.Paid ? (
                                                <button onClick={() => handleMarkAsPaid(inst)} className="text-green-600 hover:text-green-800 text-sm font-medium">Quitar</button>
                                            ) : (
                                                <button onClick={() => handleMarkAsPending(inst)} className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">Estornar</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-end">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default AgreementDetailModal;