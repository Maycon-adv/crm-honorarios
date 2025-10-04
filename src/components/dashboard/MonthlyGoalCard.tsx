import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts';
import { UserRole, GoalRecord } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import GoalProgress from '../GoalProgress';
import { ICONS } from '../../constants';

interface MonthlyGoalCardProps {
    receivedThisMonth: number;
}

const MonthlyGoalCard: React.FC<MonthlyGoalCardProps> = ({ receivedThisMonth }) => {
    const { currentUser } = useAuthContext();
    const [monthlyGoal, setMonthlyGoal] = useState<number>(() => {
        try {
            const savedGoal = localStorage.getItem('monthlyGoal');
            return savedGoal ? JSON.parse(savedGoal) : 50000;
        } catch { return 50000; }
    });
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [goalInput, setGoalInput] = useState<string>(String(monthlyGoal));
    const [_goalHistory, _setGoalHistory] = useState<GoalRecord[]>(() => {
         try {
            const savedHistory = localStorage.getItem('goalHistory');
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch { return []; }
    });

    // This effect archives the previous month's goal when a new month starts.
    useEffect(() => {
        try {
            const lastArchiveStr = localStorage.getItem('lastGoalArchive');
            const today = new Date();
            const currentMonthMarker = `${today.getFullYear()}-${today.getMonth()}`;

            if (lastArchiveStr !== currentMonthMarker) {
                if (lastArchiveStr) {
                    // Logic to calculate previous month's achievement will need access to all agreements data.
                    // This is a simplification. A more robust solution might need a global context for goals.
                }
                localStorage.setItem('lastGoalArchive', currentMonthMarker);
            }
        } catch (error) {
            console.error("Failed to process goal history archiving", error);
        }
    }, []);

    const handleSaveGoal = () => {
        const newGoal = Number(goalInput);
        if (!isNaN(newGoal) && newGoal >= 0) {
            setMonthlyGoal(newGoal);
            try {
                localStorage.setItem('monthlyGoal', JSON.stringify(newGoal));
            } catch (error) {
                console.error("Failed to save monthly goal", error);
            }
            setIsEditingGoal(false);
        }
    };

    const canEditMetrics = currentUser?.role === UserRole.Admin || currentUser?.role === UserRole.Dev;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex justify-between items-center">
                <span>Meta Mensal de Recuperação</span>
                {canEditMetrics && !isEditingGoal && (
                    <button onClick={() => { setIsEditingGoal(true); setGoalInput(String(monthlyGoal)); }} className="text-gray-500 hover:text-brand-accent" aria-label="Editar Meta">
                        {ICONS.edit}
                    </button>
                )}
            </h3>
            {isEditingGoal && canEditMetrics ? (
                <div>
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">R$</span>
                        <input type="number" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent" autoFocus />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={() => setIsEditingGoal(false)} className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button onClick={handleSaveGoal} className="px-4 py-2 text-sm bg-brand-accent text-white rounded-md hover:bg-brand-secondary">Salvar</button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-3xl font-bold text-gray-800 mb-4">{formatCurrency(monthlyGoal)}</p>
                    <GoalProgress current={receivedThisMonth} target={monthlyGoal} />
                </div>
            )}
        </div>
    );
};

export default MonthlyGoalCard;
