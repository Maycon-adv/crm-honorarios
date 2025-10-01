import React, { useState, useMemo } from 'react';
import { useContactsContext } from '../contexts';
import { Contact } from '../types';
import { ICONS } from '../constants';
import AddContactModal from './AddContactModal';
import ContactDetailModal from './ContactDetailModal';

const ContactManagementPage: React.FC = () => {
    const { contacts, deleteContact } = useContactsContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
    const [contactToView, setContactToView] = useState<Contact | null>(null);

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (contact.phone && contact.phone.includes(searchTerm))
        );
    }, [contacts, searchTerm]);

    const handleEdit = (contact: Contact) => {
        setContactToEdit(contact);
        setIsAddModalOpen(true);
    };

    const handleDelete = (contactId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este contato?")) {
            deleteContact(contactId);
        }
    };

    const handleOpenAddModal = () => {
        setContactToEdit(null);
        setIsAddModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-700">Gerenciar Contatos</h2>
                <button onClick={handleOpenAddModal} className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">
                    + Novo Contato
                </button>
            </div>
            <input
                type="text"
                placeholder="Buscar contatos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-6"
            />
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredContacts.map(contact => (
                            <tr key={contact.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap"><button onClick={() => setContactToView(contact)} className="font-medium text-gray-900 hover:text-brand-accent">{contact.name}</button></td>
                                <td className="px-6 py-4 whitespace-nowrap">{contact.email || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{contact.phone || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-3">
                                        <button onClick={() => setContactToView(contact)} className="text-gray-500 hover:text-brand-accent">{ICONS.view}</button>
                                        <button onClick={() => handleEdit(contact)} className="text-gray-500 hover:text-brand-accent">{ICONS.edit}</button>
                                        <button onClick={() => handleDelete(contact.id)} className="text-gray-500 hover:text-red-600">{ICONS.delete}</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredContacts.length === 0 && <div className="text-center py-10 text-gray-500">Nenhum contato encontrado.</div>}
            </div>
            {isAddModalOpen && <AddContactModal onClose={() => setIsAddModalOpen(false)} contactToEdit={contactToEdit} />}
            {contactToView && <ContactDetailModal contact={contactToView} onClose={() => setContactToView(null)} />}
        </div>
    );
};

export default ContactManagementPage;