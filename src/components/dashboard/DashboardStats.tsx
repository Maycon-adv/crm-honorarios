import React from 'react';
import { AgreementStatus } from '../../types';
import StatCard from '../StatCard';
import { ICONS } from '../../constants';
import { formatCurrency } from '../../utils/helpers';

interface DashboardStatsProps {
    stats: {
        active: number;
        overdue: number;
        receivedValue: number;
        pendingValue: number;
    };
    navigateTo: (page: 'agreements', filter?: AgreementStatus | AgreementStatus[]) => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, navigateTo }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="cursor-pointer transition-transform transform hover:scale-105" onClick={() => navigateTo('agreements', [AgreementStatus.OnTime, AgreementStatus.Overdue])} title="Ver acordos ativos">
                <StatCard title="Acordos Ativos" value={stats.active} icon={ICONS.agreements} color="border-blue-500" />
            </div>
            <div className="cursor-pointer transition-transform transform hover:scale-105" onClick={() => navigateTo('agreements', AgreementStatus.Overdue)} title="Ver acordos atrasados">
                <StatCard title="Acordos Atrasados" value={stats.overdue} icon={ICONS.alert} color="border-red-500" />
            </div>
            <StatCard title="Total Recebido" value={formatCurrency(stats.receivedValue)} icon={ICONS.dollar} color="border-green-500" />
            <StatCard title="Total Pendente" value={formatCurrency(stats.pendingValue)} icon={ICONS.pending} color="border-yellow-500" />
        </div>
    );
};

export default DashboardStats;
