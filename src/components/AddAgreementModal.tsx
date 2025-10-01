import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { useAgreementsContext, useActivityLogContext, useAuthContext, useContactsContext } from '../contexts';
import { Agreement, Installment, AgreementType, PaymentMethod, InstallmentStatus, Contact } from '../types';
import { ICONS } from '../constants';
import { getTodayISO } from '../utils/helpers';
import AddContactModal from './AddContactModal';

interface AddAgreementModalProps {
    onClose: () => void;
    agreementToEdit: Agreement | null;
}

const AddAgreementModal: React.FC<AddAgreementModalProps> = ({ onClose, agreementToEdit }) => {
    const { addAgreement, updateAgreement, agreements } = useAgreementsContext();
    const { addLog } = useActivityLogContext();
    const { currentUser } = useAuthContext();
    const { contacts } = useContactsContext();

    // Get unique collaborators from existing agreements
    const users = useMemo(() => {
        const collaborators = new Set(agreements.map(a => a.responsibleCollaborator));
        if (currentUser?.name) collaborators.add(currentUser.name);
        return Array.from(collaborators).map(name => ({ id: name, name }));
    }, [agreements, currentUser]);

    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        recordNumber: '',
        processNumber: '',
        contactId: '',
        responsibleCollaborator: currentUser?.name || '',
        agreementType: AgreementType.PreExecution,
        paymentMethod: PaymentMethod.Boleto,
        agreedValue: 0,
        agreementDate: getTodayISO(),
        installmentsCount: 1,
        observations: '',
    });
    const [installments, setInstallments] = useState<Partial<Installment>[]>([]);
    const [contactSearch, setContactSearch] = useState('');

    const selectedContact = useMemo(() => contacts.find(c => c.id === formData.contactId), [formData.contactId, contacts]);

    const filteredContacts = useMemo(() => {
        if (!contactSearch || selectedContact) return [];
        return contacts.filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase()));
    }, [contactSearch, contacts, selectedContact]);

    useEffect(() => {
        if (agreementToEdit) {
            const contact = contacts.find(c => c.id === agreementToEdit.contactId);
            setFormData({
                recordNumber: agreementToEdit.recordNumber,
                processNumber: agreementToEdit.processNumber,
                contactId: agreementToEdit.contactId,
                responsibleCollaborator: agreementToEdit.responsibleCollaborator,
                agreementType: agreementToEdit.agreementType,
                paymentMethod: agreementToEdit.paymentMethod,
                agreedValue: agreementToEdit.agreedValue,
                agreementDate: agreementToEdit.agreementDate,
                installmentsCount: agreementToEdit.installments.length,
                observations: agreementToEdit.observations || '',
            });
            setInstallments(agreementToEdit.installments);
            setContactSearch(contact?.name || '');
        }
    }, [agreementToEdit, contacts]);

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContactSelect = (contact: Contact) => {
        setFormData(prev => ({ ...prev, contactId: contact.id }));
        setContactSearch(contact.name);
    }

    const generateInstallments = () => {
        const newInstallments: Partial<Installment>[] = [];
        const valuePerInstallment = formData.agreedValue / formData.installmentsCount;
        const agreementDate = new Date(formData.agreementDate + 'T00:00:00');

        for (let i = 0; i < formData.installmentsCount; i++) {
            const dueDate = new Date(agreementDate);
            dueDate.setMonth(dueDate.getMonth() + i + 1);
            newInstallments.push({
                installmentNumber: i + 1,
                value: valuePerInstallment,
                dueDate: dueDate.toISOString().split('T')[0],
                status: InstallmentStatus.Pending,
            });
        }
        setInstallments(newInstallments);
    };
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.contactId) {
            alert("Por favor, selecione um contato para o acordo.");
            return;
        }

        const finalInstallments: Installment[] = installments.map((inst, index) => ({
            id: inst.id || `inst-${Date.now()}-${index}`,
            installmentNumber: inst.installmentNumber || index + 1,
            value: inst.value || 0,
            dueDate: inst.dueDate || '',
            status: inst.status || InstallmentStatus.Pending,
            paymentDate: inst.paymentDate,
        }));

        const contactName = contacts.find(c => c.id === formData.contactId)?.name || 'N/A';

        try {
            if (agreementToEdit) {
                const updatedAgreement: Agreement = {
                    ...agreementToEdit,
                    ...formData,
                    agreedValue: Number(formData.agreedValue),
                    installments: finalInstallments,
                };
                await updateAgreement(updatedAgreement);
                addLog(`Editou o acordo #${updatedAgreement.recordNumber} de ${contactName}.`, currentUser);
            } else {
                const newAgreement: Omit<Agreement, 'id' | 'status'> = {
                    ...formData,
                    agreedValue: Number(formData.agreedValue),
                    installments: finalInstallments,
                };
                const added = await addAgreement(newAgreement);
                addLog(`Adicionou o novo acordo #${added.recordNumber} de ${contactName}.`, currentUser);
            }
            onClose();
        } catch (error) {
            console.error('Erro ao salvar acordo:', error);
            alert('Erro ao salvar acordo. Tente novamente.');
        }
    };


    return (
        <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start py-10 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">{agreementToEdit ? 'Editar Acordo' : 'Novo Acordo'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{ICONS.close}</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                             <h4 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Dados da Parte</h4>
                        </div>
                        <div className="md:col-span-2 relative">
                            <label className="block text-sm font-medium text-gray-700">Selecionar Contato</label>
                            <input 
                                type="text"
                                value={contactSearch}
                                onChange={e => {
                                    setContactSearch(e.target.value);
                                    if (selectedContact) {
                                        setFormData(prev => ({ ...prev, contactId: '' }));
                                    }
                                }}
                                placeholder="Digite para buscar um contato..."
                                className="w-full p-2 border rounded mt-1"
                                required
                            />
                            {filteredContacts.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                                    {filteredContacts.map(contact => (
                                        <li key={contact.id} onClick={() => handleContactSelect(contact)} className="p-2 hover:bg-gray-100 cursor-pointer">
                                            {contact.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                             <button type="button" onClick={() => setIsAddContactModalOpen(true)} className="w-full mt-1 bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-3 rounded-md hover:bg-gray-200">
                                + Novo Contato
                             </button>
                        </div>
                        {selectedContact && (
                             <div className="md:col-span-3 bg-gray-50 p-3 rounded-md grid grid-cols-3 gap-4 text-sm">
                                <div><strong>Contato:</strong> {selectedContact.name}</div>
                                <div><strong>Email:</strong> {selectedContact.email || 'N/A'}</div>
                                <div><strong>Telefone:</strong> {selectedContact.phone || 'N/A'}</div>
                            </div>
                        )}
                        
                        <div className="md:col-span-3">
                             <h4 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4 mt-4">Dados do Acordo</h4>
                        </div>
                        <input name="recordNumber" value={formData.recordNumber} onChange={handleDataChange} placeholder="Nº da Ficha" className="p-2 border rounded" required />
                        <input name="processNumber" value={formData.processNumber} onChange={handleDataChange} placeholder="Nº do Processo" className="p-2 border rounded" required />

                        <select name="responsibleCollaborator" value={formData.responsibleCollaborator} onChange={handleDataChange} className="p-2 border rounded">
                            {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                        </select>
                         <select name="agreementType" value={formData.agreementType} onChange={handleDataChange} className="p-2 border rounded">
                            {Object.values(AgreementType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                         <select name="paymentMethod" value={formData.paymentMethod} onChange={handleDataChange} className="p-2 border rounded">
                            {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>

                         <div className="md:col-span-3">
                             <h4 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4 mt-4">Valores e Parcelas</h4>
                        </div>
                        
                        <input type="number" name="agreedValue" value={formData.agreedValue} onChange={handleDataChange} placeholder="Valor Acordado" className="p-2 border rounded" required />
                        <input type="date" name="agreementDate" value={formData.agreementDate} onChange={handleDataChange} className="p-2 border rounded" required />
                        
                        <div className="flex items-center gap-2">
                            <input type="number" name="installmentsCount" value={formData.installmentsCount} onChange={handleDataChange} min="1" className="p-2 border rounded w-24" />
                             <button type="button" onClick={generateInstallments} className="bg-blue-100 text-blue-800 text-sm font-semibold py-2 px-3 rounded-md hover:bg-blue-200">Gerar Parcelas</button>
                        </div>
                        
                         <div className="md:col-span-3">
                            <h4 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4 mt-4">Observações</h4>
                            <textarea name="observations" value={formData.observations} onChange={handleDataChange} rows={3} className="w-full p-2 border rounded" placeholder="Detalhes adicionais sobre o acordo..."></textarea>
                        </div>
                        
                        {installments.length > 0 && (
                            <div className="md:col-span-3">
                               <h4 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4 mt-4">Parcelas Geradas</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {installments.map((inst, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                            <span>Parcela {inst.installmentNumber}</span>
                                            <input type="date" value={inst.dueDate} onChange={(e) => {
                                                const newInst = [...installments];
                                                newInst[index].dueDate = e.target.value;
                                                setInstallments(newInst);
                                            }} className="p-1 border rounded" />
                                            <input type="number" value={inst.value} onChange={(e) => {
                                                const newInst = [...installments];
                                                newInst[index].value = Number(e.target.value);
                                                setInstallments(newInst);
                                            }} className="p-1 border rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        

                    </div>
                    <div className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                        <button type="submit" className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">{agreementToEdit ? 'Salvar Alterações' : 'Criar Acordo'}</button>
                    </div>
                </form>
            </div>
        </div>
        {isAddContactModalOpen && <AddContactModal onClose={() => setIsAddContactModalOpen(false)} contactToEdit={null} />}
        </>
    );
};

export default AddAgreementModal;
