import React, { useMemo } from 'react';
import { useAgreementsContext, useAuthContext as _useAuthContext } from '../contexts';
import { AgreementType, PaymentMethod, InstallmentStatus } from '../types';
import { formatCurrency } from '../utils/helpers';

interface ChartData {
    label: string;
    value: number;
    color: string;
}

const BarChart: React.FC<{ data: ChartData[]; title: string; valueFormatter?: (value: number) => string }> = ({ data, title, valueFormatter = (v) => String(v) }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
            <div className="space-y-4">
                {data.length > 0 ? data.map(item => (
                    <div key={item.label}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium text-gray-600">{item.label}</span>
                            <span className="font-semibold text-gray-800">{valueFormatter(item.value)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="h-4 rounded-full"
                                style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`, backgroundColor: item.color }}
                                title={`${valueFormatter(item.value)}`}
                            ></div>
                        </div>
                    </div>
                )) : <p className="text-gray-500">Nenhum dado para exibir.</p>}
            </div>
        </div>
    );
};

const ReportsPage: React.FC = () => {
    const { agreements } = useAgreementsContext();
    const colors = ['#163e4d', '#175468', '#0095b7', '#4e4e4c', '#778DA9'];

    const performanceByCollaborator = useMemo(() => {
        const stats: { [key: string]: { received: number; total: number } } = {};

        agreements.forEach(agreement => {
            if (!stats[agreement.responsibleCollaborator]) {
                 stats[agreement.responsibleCollaborator] = { received: 0, total: 0 };
            }
            stats[agreement.responsibleCollaborator].total += agreement.agreedValue;
            const received = agreement.installments
                .filter(i => i.status === InstallmentStatus.Paid)
                .reduce((sum, i) => sum + i.value, 0);
            stats[agreement.responsibleCollaborator].received += received;
        });

        return Object.entries(stats)
            .map(([label, data], index) => ({
                label,
                value: data.received,
                color: colors[index % colors.length]
            }))
            .sort((a, b) => b.value - a.value);

    }, [agreements]);

    const agreementsByType = useMemo(() => {
        const stats: { [key in AgreementType]: number } = {
            [AgreementType.PreExecution]: 0,
            [AgreementType.PostExecution]: 0,
        };
        agreements.forEach(a => {
            stats[a.agreementType] += a.agreedValue;
        });
        return [
            { label: 'Pré-execução', value: stats[AgreementType.PreExecution], color: colors[0] },
            { label: 'Pós-execução', value: stats[AgreementType.PostExecution], color: colors[1] }
        ];
    }, [agreements]);
    
    const agreementsByPaymentMethod = useMemo(() => {
        const stats: { [key: string]: number } = {};
         Object.values(PaymentMethod).forEach(method => {
            stats[method] = 0;
        });
        agreements.forEach(a => {
            if(a.paymentMethod in stats) {
                 stats[a.paymentMethod] += 1;
            }
        });
        return Object.entries(stats)
            .map(([label, value], index) => ({
                label,
                value: value!,
                color: colors[index % colors.length]
            }))
            .sort((a,b) => b.value - a.value);
    }, [agreements]);

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">Relatórios</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart data={performanceByCollaborator} title="Performance por Colaborador (Total Recebido)" valueFormatter={formatCurrency} />
                <BarChart data={agreementsByType} title="Valor Total por Tipo de Acordo" valueFormatter={formatCurrency}/>
                <div className="lg:col-span-2">
                    <BarChart data={agreementsByPaymentMethod} title="Quantidade de Acordos por Forma de Pagamento" valueFormatter={(v) => `${v} acordo(s)`}/>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
