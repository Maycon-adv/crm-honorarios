import React, { useMemo } from 'react';
import { Contact } from '../types';
import { ICONS } from '../constants';
import { useAgreementsContext } from '../contexts';

interface ContactDetailModalProps {
    contact: Contact;
    onClose: () => void;
}

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({ contact, onClose }) => {
    const { agreements } = useAgreementsContext();

    const relatedAgreements = useMemo(() => {
        return agreements.filter(a => a.contactId === contact.id);
    }, [agreements, contact.id]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">Detalhes do Contato</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{ICONS.close}</button>
                </div>
                <div className="p-8 space-y-3">
                    <p><strong>Nome:</strong> {contact.name}</p>
                    <p><strong>E-mail:</strong> {contact.email || 'N/A'}</p>
                    <p><strong>Telefone:</strong> {contact.phone || 'N/A'}</p>
                    <p><strong>Documento:</strong> {contact.document || 'N/A'}</p>
                    
                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold text-gray-700">Acordos Vinculados ({relatedAgreements.length}):</h4>
                        {relatedAgreements.length > 0 ? (
                            <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                                {relatedAgreements.map(a => <li key={a.id}>Ficha #{a.recordNumber}</li>)}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 mt-2">Nenhum acordo encontrado para este contato.</p>
                        )}
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-end">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md">Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default ContactDetailModal;