import React, { useState, FormEvent } from 'react';
import { useAuthContext, useActivityLogContext } from '../contexts';
import { UserRole } from '../types';
import { ICONS } from '../constants';
import { z } from 'zod';

interface AddUserModalProps {
    onClose: () => void;
}

const userSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    email: z.string().email("Formato de e-mail invÃ¡lido.").refine(email => email.endsWith('@schulze.com.br'), {
        message: "Apenas e-mails institucionais (@schulze.com.br) sÃ£o permitidos."
    }),
    password: z.string().min(8, "A senha deve ter no mÃ­nimo 8 caracteres."),
    role: z.nativeEnum(UserRole),
});

type FormData = z.infer<typeof userSchema>;

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose }) => {
    const { addUser, currentUser } = useAuthContext();
    const { addLog } = useActivityLogContext();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        role: UserRole.Collaborator,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
        setApiError('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');
        
        const result = userSchema.safeParse(formData);

        if(!result.success) {
            const newErrors: Record<string, string> = {};
            // FIX: Use Zod's flatten() method to safely get field-specific errors.
            const fieldErrors = result.error.flatten().fieldErrors;
            for (const [key, messages] of Object.entries(fieldErrors)) {
                if (messages && messages.length > 0) {
                    newErrors[key] = messages[0];
                }
            }
            setErrors(newErrors);
            return;
        }

        try {
            const addUserResult = await addUser(formData.name, formData.email, formData.password, formData.role);

            if (addUserResult.success) {
                addLog(`Adicionou o novo usuário: ${formData.name} (${formData.email}).`, currentUser);
                setSuccess(addUserResult.message);
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setApiError(addUserResult.message);
            }
        } catch (error) {
            console.error('Failed to add user', error);
            const message = error instanceof Error ? error.message : 'Erro ao cadastrar usuário. Tente novamente.';
            setApiError(message);
        }
    };
    
    // Fix: Correctly handle potential symbol keys from `keyof FormData` by casting to string when indexing the `errors` object.
    const getError = (fieldName: keyof FormData) => {
        const message = errors[fieldName as string];
        return message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">Adicionar Novo Usuário</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        {ICONS.close}
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-4">
                        {apiError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">{apiError}</div>}
                        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-sm" role="alert">{success}</div>}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent ${errors.name && 'border-red-500'}`} />
                            {getError('name')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">E-mail</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent ${errors.email && 'border-red-500'}`} />
                            {getError('email')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Senha ProvisÃ³ria</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent ${errors.password && 'border-red-500'}`} />
                            {getError('password')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cargo</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent">
                                <option value={UserRole.Collaborator}>Colaborador</option>
                                <option value={UserRole.Admin}>Admin</option>
                                <option value={UserRole.Dev}>Dev</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors duration-200">
                            Salvar usuário
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;




