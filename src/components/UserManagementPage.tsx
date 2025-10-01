import React, { useState } from 'react';
import { useAuthContext } from '../contexts';
import AddUserModal from './AddUserModal';
import { UserRole } from '../types';

const getRoleBadge = (role: UserRole) => {
    switch(role) {
        case UserRole.Admin:
            return 'bg-red-100 text-red-800';
        case UserRole.Dev:
            return 'bg-indigo-100 text-indigo-800';
        case UserRole.Collaborator:
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

const UserManagementPage: React.FC = () => {
    const { currentUser } = useAuthContext();
    const users = currentUser ? [currentUser] : [];
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-700">Gerenciar Usuários</h2>
                <button 
                    onClick={() => setIsAddUserModalOpen(true)} 
                    className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors duration-200"
                >
                    + Adicionar Usuário
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAddUserModalOpen && <AddUserModal onClose={() => setIsAddUserModalOpen(false)} />}
        </div>
    );
};

export default UserManagementPage;
