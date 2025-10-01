import React, { useMemo } from 'react';
import { Agreement, AgreementStatus, InstallmentStatus } from '../../types';
import { formatDate } from '../../utils/helpers';
import { ICONS } from '../../constants';

interface TopOverdueCardProps {
    agreements: (Agreement & { partyName: string })[];
    onViewAgreement: (agreement: Agreement) => void;
    onNotifyAgreement: (agreement: Agreement) => void;
}

const TopOverdueCard: React.FC<TopOverdueCardProps> = ({ agreements, onViewAgreement, onNotifyAgreement }) => {
    const topOverdueAgreements = useMemo(() => {
        return agreements
            .filter(a => a.status === AgreementStatus.Overdue)
            .sort((a, b) => {
                const firstOverdueA = a.installments.find(i => i.status === InstallmentStatus.Overdue)?.dueDate || '9999-99-99';
                const firstOverdueB = b.installments.find(i => i.status === InstallmentStatus.Overdue)?.dueDate || '9999-99-99';
                return firstOverdueA.localeCompare(firstOverdueB);
            })
            .slice(0, 5);
    }, [agreements]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Principais Acordos Atrasados</h3>
            {topOverdueAgreements.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {topOverdueAgreements.map(agreement => (
                        <li key={agreement.id} className="py-3 flex justify-between items-center">
                            <div>
                                <button onClick={() => onViewAgreement(agreement)} className="font-medium text-gray-800 hover:text-brand-accent text-left transition-colors">
                                    {agreement.partyName}
                                </button>
                                <p className="text-sm text-gray-500">
                                    Atrasado desde: {formatDate(agreement.installments.find(i => i.status === 'Vencida')?.dueDate || '')}
                                </p>
                            </div>
                            <button
                                onClick={() => onNotifyAgreement(agreement)}
                                className="text-gray-500 hover:text-brand-accent p-2 rounded-full transition-colors"
                                aria-label="Gerar notificação de atraso"
                            >
                                {ICONS.send}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-4">Nenhum acordo em atraso.</p>
            )}
        </div>
    );
};

export default TopOverdueCard;
