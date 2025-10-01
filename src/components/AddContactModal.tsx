import React, { useState, FormEvent, useEffect } from 'react';
import { Contact } from '../types';
import { ICONS } from '../constants';
import { useContactsContext } from '../contexts';

interface AddContactModalProps {
    onClose: () => void;
    contactToEdit: Contact | null;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, contactToEdit }) => {
    const { addContact, updateContact } = useContactsContext();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        document: '',
    });

    useEffect(() => {
        if (contactToEdit) {
            // Fix: Construct form data from contactToEdit, providing default empty strings for optional fields
            // to align with the non-optional string type of the component's state.
            setFormData({
                name: contactToEdit.name,
                email: contactToEdit.email || '',
                phone: contactToEdit.phone || '',
                document: contactToEdit.document || '',
            });
        }
    }, [contactToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (contactToEdit) {
            updateContact({ ...contactToEdit, ...formData });
        } else {
            addContact(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">{contactToEdit ? 'Editar Contato' : 'Novo Contato'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{ICONS.close}</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome Completo / Razão Social" className="w-full p-2 border rounded" required />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" className="w-full p-2 border rounded" />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefone" className="w-full p-2 border rounded" />
                        <input name="document" value={formData.document} onChange={handleChange} placeholder="CPF/CNPJ" className="w-full p-2 border rounded" />
                    </div>
                    <div className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md">Cancelar</button>
                        <button type="submit" className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg">{contactToEdit ? 'Salvar Alterações' : 'Adicionar Contato'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContactModal;
