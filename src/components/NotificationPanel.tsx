import React from 'react';
import { useNotificationsContext } from '../contexts';
import { ICONS } from '../constants';
import { NotificationType } from '../types';

interface NotificationPanelProps {
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const { notifications, markAsRead } = useNotificationsContext();

    const getIconForType = (type: NotificationType) => {
        switch (type) {
            case NotificationType.Overdue:
                return <div className="text-red-500">{ICONS.alert}</div>;
            case NotificationType.Upcoming:
                return <div className="text-blue-500">{ICONS.calendar}</div>;
            default:
                return null;
        }
    };
    
    return (
        <div className="absolute top-14 right-0 w-80 bg-white rounded-lg shadow-xl border z-50">
            <div className="p-4 border-b flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">Notificações</h4>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    {ICONS.close}
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="text-center text-gray-500 p-6">Nenhuma notificação nova.</p>
                ) : (
                    <ul>
                        {notifications.map(n => (
                            <li key={n.id} className="border-b hover:bg-gray-50">
                                <div className="p-4 flex items-start">
                                    <div className="mr-4 mt-1">{getIconForType(n.type)}</div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700"><strong className="font-semibold">{n.agreementParty}</strong>: {n.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString('pt-BR')}</p>
                                    </div>
                                    <button onClick={() => markAsRead(n.id)} className="ml-2 p-1 text-gray-400 hover:text-gray-600" title="Marcar como lida">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
