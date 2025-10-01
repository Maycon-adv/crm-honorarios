import React, { useState, useMemo } from 'react';
import { useAgreementsContext, useContactsContext } from '../contexts';
import { Installment, Agreement, InstallmentStatus } from '../types';
import { formatCurrency } from '../utils/helpers';
import AgreementDetailModal from './AgreementDetailModal';

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    agreement: Agreement;
    installment: Installment;
}

const CalendarView: React.FC = () => {
    const { agreements } = useAgreementsContext();
    const { contacts } = useContactsContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ...

    const daysInMonth: (Date | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        daysInMonth.push(null);
    }
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
        daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    const events: CalendarEvent[] = useMemo(() => agreements.flatMap(agreement => {
        const contact = contacts.find(c => c.id === agreement.contactId);
        const partyName = contact?.name || 'Contato desconhecido';
        return agreement.installments.map(installment => ({
            id: installment.id,
            title: `${partyName} - ${formatCurrency(installment.value)}`,
            date: new Date(installment.dueDate + 'T00:00:00'),
            agreement: agreement,
            installment: installment
        }));
    }), [agreements, contacts]);

    const getEventsForDay = (day: Date) => {
        return events.filter(event => 
            event.date.getFullYear() === day.getFullYear() &&
            event.date.getMonth() === day.getMonth() &&
            event.date.getDate() === day.getDate()
        );
    };

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
         <div>
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">Calendário de Vencimentos</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">&lt;</button>
                    <h3 className="text-xl font-semibold">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={() => changeMonth(1)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {weekdays.map(day => (
                        <div key={day} className="text-center font-medium text-gray-600 p-2">{day}</div>
                    ))}
                    {daysInMonth.map((day, index) => {
                        const dayEvents = day ? getEventsForDay(day) : [];
                        const totalForDay = dayEvents.reduce((sum, event) => sum + event.installment.value, 0);
                        const tooltipText = totalForDay > 0 ? `Total do dia: ${formatCurrency(totalForDay)}` : '';

                        return (
                            <div 
                                key={index} 
                                className={`border rounded-md h-32 p-1 overflow-y-auto ${day ? 'cursor-pointer' : 'bg-gray-50'}`}
                                title={tooltipText}
                            >
                                {day && (
                                    <>
                                        <div className={`text-sm ${new Date().toDateString() === day.toDateString() ? 'bg-brand-accent text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                                            {day.getDate()}
                                        </div>
                                        <div className="mt-1 space-y-1">
                                            {dayEvents.map(event => {
                                                const { installment, date } = event;
                                                let colorClass = '';
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);

                                                if (installment.status === InstallmentStatus.Paid) {
                                                    colorClass = 'bg-green-100 text-green-800'; // VERDE
                                                } else if (installment.status === InstallmentStatus.Overdue || (date < today && installment.status === InstallmentStatus.Pending)) {
                                                    colorClass = 'bg-red-100 text-red-800'; // VERMELHO
                                                } else {
                                                    colorClass = 'bg-gray-200 text-gray-800'; // PRETO/CINZA
                                                }
                                                
                                                return (
                                                    <div 
                                                        key={event.id}
                                                        onClick={() => setSelectedAgreement(event.agreement)}
                                                        className={`p-1 rounded-md text-xs ${colorClass}`}
                                                    >
                                                        {event.title}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
             {selectedAgreement && <AgreementDetailModal agreement={selectedAgreement} onClose={() => setSelectedAgreement(null)} />}
        </div>
    );
};

export default CalendarView;
