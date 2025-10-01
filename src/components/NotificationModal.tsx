import React, { useState } from 'react';
import { Agreement, InstallmentStatus, Contact } from '../types';
import { ICONS } from '../constants';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useContactsContext } from '../contexts';

interface NotificationModalProps {
    agreement: Agreement;
    onClose: () => void;
}

const WEBHOOK_URL_KEY = 'crm_webhook_url';

const NotificationModal: React.FC<NotificationModalProps> = ({ agreement, onClose }) => {
    const { contacts } = useContactsContext();
    const contact = contacts.find(c => c.id === agreement.contactId);
    
    const [automationStatus, setAutomationStatus] = useState<{ type: 'info' | 'success' | 'error', text: string } | null>(null);

    const overdueInstallments = agreement.installments.filter(i => i.status === InstallmentStatus.Overdue);
    const totalOverdueValue = overdueInstallments.reduce((sum, i) => sum + i.value, 0);

    // Generate a standard message from a template
    const message = `Prezado(a) ${contact?.name || 'Cliente'},

Gostaríamos de lembrá-lo(a) sobre uma pendência financeira referente ao acordo da Ficha nº ${agreement.recordNumber}.

Atualmente, constam ${overdueInstallments.length} parcela(s) em atraso, totalizando um valor de ${formatCurrency(totalOverdueValue)}. A parcela mais antiga venceu em ${formatDate(overdueInstallments[0]?.dueDate || '')}.

Para evitar transtornos, por favor, entre em contato para regularizar a situação.

Atenciosamente,`;

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(message);
        alert('Mensagem copiada para a área de transferência!');
    };
    
    const handleSendAutomation = async () => {
        const webhookUrl = localStorage.getItem(WEBHOOK_URL_KEY);
        if (!webhookUrl) {
            setAutomationStatus({ type: 'error', text: 'URL do webhook não configurada na página de Configurações.' });
            return;
        }

        setAutomationStatus({ type: 'info', text: 'Enviando dados para a automação...' });

        try {
            const payload = {
                event: 'overdue_notification',
                agreement: {
                    id: agreement.id,
                    recordNumber: agreement.recordNumber,
                    processNumber: agreement.processNumber,
                    agreedValue: agreement.agreedValue,
                },
                contact: {
                    name: contact?.name,
                    email: contact?.email,
                    phone: contact?.phone,
                    document: contact?.document,
                },
                overdue: {
                    installmentsCount: overdueInstallments.length,
                    totalValue: totalOverdueValue,
                    oldestDueDate: overdueInstallments[0]?.dueDate,
                },
                generatedMessage: message,
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`O servidor respondeu com o status: ${response.status}`);
            }
            
            setAutomationStatus({ type: 'success', text: 'Notificação enviada para a automação com sucesso!' });

        } catch (error) {
            console.error('Webhook send error:', error);
            setAutomationStatus({ type: 'error', text: 'Falha ao enviar. Verifique a URL e o console.' });
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">Gerar Notificação</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{ICONS.close}</button>
                </div>
                <div className="p-8">
                     <textarea
                        value={message}
                        readOnly
                        rows={12}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-800"
                    />
                    {automationStatus && (
                        <div className={`text-sm p-3 rounded-md mt-4 ${
                            automationStatus.type === 'success' ? 'bg-green-100 text-green-800' : 
                            automationStatus.type === 'error' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {automationStatus.text}
                        </div>
                    )}
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <button onClick={handleSendAutomation} className="bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary mr-2">
                           Enviar via Automação
                        </button>
                         <a href={`mailto:${contact?.email}`} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 mr-2">E-mail</a>
                         <a href={`https://wa.me/${contact?.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">WhatsApp</a>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={handleCopyToClipboard} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Copiar</button>
                        <button type="button" onClick={onClose} className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;