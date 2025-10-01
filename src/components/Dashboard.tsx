import React, { useMemo, useState } from 'react';
import { useAppContext, useAgreementsContext, useContactsContext } from '../contexts';
import { AgreementStatus, InstallmentStatus, Agreement } from '../types';
import DashboardStats from './dashboard/DashboardStats';
import MonthlyGoalCard from './dashboard/MonthlyGoalCard';
import TopOverdueCard from './dashboard/TopOverdueCard';
import RecentActivityCard from './dashboard/RecentActivityCard';
import AgreementDetailModal from './AgreementDetailModal';
import NotificationModal from './NotificationModal';
import TasksCard from './dashboard/TasksCard';

type Period = 'thisMonth' | 'lastMonth' | 'thisYear' | 'all';

const Dashboard: React.FC = () => {
    const { agreements } = useAgreementsContext();
    const { contacts } = useContactsContext();
    const { navigateTo } = useAppContext();
    const [period, setPeriod] = useState<Period>('thisMonth');

    // State for modals
    const [agreementToView, setAgreementToView] = useState<Agreement | null>(null);
    const [agreementToNotify, setAgreementToNotify] = useState<Agreement | null>(null);

    // Fix: Enrich agreements with contact names for child components
    const agreementsWithContactInfo = useMemo(() => {
        return agreements.map(agreement => {
            const contact = contacts.find(c => c.id === agreement.contactId);
            return {
                ...agreement,
                partyName: contact?.name || 'Contato não encontrado',
            };
        });
    }, [agreements, contacts]);


    const filteredAgreements = useMemo(() => {
        if (period === 'all') {
            return agreements;
        }

        const now = new Date();
        let startDate: Date;
        let endDate: Date;

        switch (period) {
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                break;
            case 'lastMonth':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
                break;
            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                break;
        }

        return agreements.filter(agreement => {
            const agreementDate = new Date(agreement.agreementDate + 'T00:00:00');
            return agreementDate >= startDate && agreementDate <= endDate;
        });
    }, [agreements, period]);

    const stats = useMemo(() => {
        const source = period === 'all' ? agreements : filteredAgreements;
        
        const totalValue = source.reduce((sum, a) => sum + a.agreedValue, 0);
        const receivedValue = source
            .flatMap(a => a.installments)
            .filter(i => i.status === InstallmentStatus.Paid)
            .reduce((sum, i) => sum + i.value, 0);
        const pendingValue = totalValue - receivedValue;
        const overdue = source.filter(a => a.status === AgreementStatus.Overdue).length;
        const active = source.filter(a => a.status === AgreementStatus.OnTime || a.status === AgreementStatus.Overdue).length;

        return { totalValue, receivedValue, pendingValue, overdue, active };
    }, [filteredAgreements, agreements, period]);

    const receivedThisMonth = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return agreements // always calculate for the real current month for the goal
            .flatMap(a => a.installments)
            .filter(i => {
                if (i.status === InstallmentStatus.Paid && i.paymentDate) {
                    try {
                        const paymentDate = new Date(i.paymentDate + 'T00:00:00');
                        if (isNaN(paymentDate.getTime())) return false;
                        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
                    } catch (e) {
                        return false;
                    }
                }
                return false;
            })
            .reduce((sum, i) => sum + i.value, 0);
    }, [agreements]);

    return (
        <div>
            <div className="flex justify-end mb-4">
                <select 
                    value={period} 
                    onChange={(e) => setPeriod(e.target.value as Period)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
                >
                    <option value="thisMonth">Este Mês</option>
                    <option value="lastMonth">Mês Passado</option>
                    <option value="thisYear">Este Ano</option>
                    <option value="all">Todo o Período</option>
                </select>
            </div>
            
            <DashboardStats stats={stats} navigateTo={navigateTo} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <MonthlyGoalCard receivedThisMonth={receivedThisMonth} />
                <TasksCard />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <TopOverdueCard 
                    agreements={agreementsWithContactInfo} 
                    onViewAgreement={setAgreementToView} 
                    onNotifyAgreement={setAgreementToNotify} 
                />
                 <RecentActivityCard agreements={agreementsWithContactInfo} onViewAgreement={setAgreementToView} />
            </div>


            {agreementToView && <AgreementDetailModal agreement={agreementToView} onClose={() => setAgreementToView(null)} />}
            {agreementToNotify && <NotificationModal agreement={agreementToNotify} onClose={() => setAgreementToNotify(null)} />}
        </div>
    );
};

export default Dashboard;