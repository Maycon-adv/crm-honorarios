import React, { useMemo } from 'react';
import { Agreement, Installment, InstallmentStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface RecentActivityCardProps {
    agreements: (Agreement & { partyName: string })[];
    onViewAgreement: (agreement: Agreement) => void;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ agreements, onViewAgreement }) => {
    const recentActivity = useMemo(() => {
        const allInstallments = agreements.flatMap(a => a.installments.map(i => ({ ...i, agreement: a })));
        return allInstallments
            .filter(i => i.status === InstallmentStatus.Paid && i.paymentDate)
            .sort((a, b) => {
                const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
                const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
                if (isNaN(dateA)) return 1;
                if (isNaN(dateB)) return -1;
                return dateB - dateA;
            })
            .slice(0, 5);
    }, [agreements]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Pagamentos Recentes</h3>
            {recentActivity.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {recentActivity.map(installment => (
                        <li key={installment.id} className="py-3 flex justify-between items-center">
                            <div>
                                <button onClick={() => onViewAgreement(installment.agreement)} className="font-medium text-gray-800 hover:text-brand-accent text-left transition-colors">
                                    {installment.agreement.partyName}
                                </button>
                                <p className="text-sm text-gray-500">Parcela {installment.installmentNumber} paga em {formatDate(installment.paymentDate!)}</p>
                            </div>
                            <span className="text-green-600 font-semibold">{formatCurrency(installment.value)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-4">Nenhum pagamento recente.</p>
            )}
        </div>
    );
};

export default RecentActivityCard;
