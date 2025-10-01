import React from 'react';
import { useAppContext, useAuthContext } from '../contexts';
import { Page, UserRole } from '../types';
import { ICONS } from '../constants';

interface NavItemProps {
    page: Page;
    label: string;
    icon: React.ReactNode;
}

const Sidebar: React.FC = () => {
    const { currentPage, navigateTo } = useAppContext();
    const { currentUser } = useAuthContext();

    const NavItem: React.FC<NavItemProps> = ({ page, label, icon }) => {
        const isActive = currentPage === page;
        return (
            <li>
                <button
                    onClick={() => navigateTo(page)}
                    className={`flex items-center w-full text-left py-3 px-4 rounded-lg transition-colors duration-200 ${
                        isActive
                            ? 'bg-brand-secondary text-white'
                            : 'text-gray-300 hover:bg-brand-secondary'
                    }`}
                >
                    <span className="mr-3">{icon}</span>
                    <span className="font-medium">{label}</span>
                </button>
            </li>
        );
    };

    const isAdminOrDev = currentUser?.role === UserRole.Admin || currentUser?.role === UserRole.Dev;

    return (
        <aside className="w-64 bg-brand-primary text-white flex flex-col p-4">
            <div className="text-center py-6">
                <h1 className="text-3xl font-bold">Acordo$</h1>
                <p className="text-sm text-gray-300">CRM de Honorários</p>
            </div>
            <nav className="flex-1 flex flex-col justify-between">
                <ul className="space-y-2">
                    <NavItem page="dashboard" label="Dashboard" icon={ICONS.dashboard} />
                    <NavItem page="agreements" label="Acordos" icon={ICONS.agreements} />
                    <NavItem page="calendar" label="Calendário" icon={ICONS.calendar} />
                    <NavItem page="reports" label="Relatórios" icon={ICONS.reports} />
                    <NavItem page="contacts" label="Contatos" icon={ICONS.contacts} />
                    <NavItem page="activity-log" label="Histórico" icon={ICONS.activity} />
                </ul>
                
                <div>
                    <hr className="border-gray-600 my-4" />
                    <ul className="space-y-2">
                        {isAdminOrDev && (
                            <NavItem page="user-management" label="Usuários" icon={ICONS.users} />
                        )}
                        <NavItem page="settings" label="Configurações" icon={ICONS.settings} />
                    </ul>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;