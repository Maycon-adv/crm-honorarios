import React, { useState, useRef, useEffect } from 'react';
// Fix: Import useNotificationsContext
import { useAuthContext, useActivityLogContext, useNotificationsContext } from '../contexts';
import { ICONS } from '../constants';
// Fix: Import NotificationPanel
import NotificationPanel from './NotificationPanel';

const Header: React.FC = () => {
    const { currentUser, logout } = useAuthContext();
    const { addLog } = useActivityLogContext();
    // Fix: Get unread count from notifications context
    const { unreadCount } = useNotificationsContext();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    // Fix: Add state for notification panel visibility
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    const userMenuRef = useRef<HTMLDivElement>(null);
    // Fix: Add ref for notification panel
    const notificationsRef = useRef<HTMLDivElement>(null);

    const getUserInitials = (name: string | undefined) => {
        if (!name) return 'U';
        const nameParts = name.split(' ');
        if (nameParts.length > 1 && nameParts[nameParts.length - 1]) {
            return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            // Fix: Handle click outside for notification panel
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        if (currentUser) {
            addLog(`O usuário ${currentUser.name} saiu do sistema.`, currentUser);
        }
        logout();
    };


    return (
        <header className="h-20 bg-white shadow-md flex items-center justify-between px-8">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Bem-vindo(a) de volta, {currentUser?.name.split(' ')[0]}!</h1>
                <p className="text-sm text-gray-500">Aqui está o resumo da sua carteira de acordos.</p>
            </div>
            <div className="flex items-center space-x-6">
                 {/* Fix: Add notification bell and panel */}
                 <div className="relative" ref={notificationsRef}>
                    <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="relative text-gray-600 hover:text-brand-primary focus:outline-none">
                        {ICONS.notification}
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && <NotificationPanel onClose={() => setIsNotificationsOpen(false)} />}
                </div>
                 <div className="relative" ref={userMenuRef}>
                    <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                        <span>{getUserInitials(currentUser?.name)}</span>
                    </button>
                    {isUserMenuOpen && (
                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border py-1">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                <p className="font-semibold">{currentUser?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                            </div>
                            <a 
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {ICONS.logout}
                                <span className="ml-2">Sair</span>
                            </a>
                        </div>
                    )}
                 </div>
            </div>
        </header>
    );
};

export default Header;
