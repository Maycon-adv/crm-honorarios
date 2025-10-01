import React from 'react';
import { formatCurrency } from '../utils/helpers';

interface GoalProgressProps {
    title?: string;
    current: number;
    target: number;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ title, current, target }) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

    return (
        <div>
            {title && <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>{formatCurrency(current)}</span>
                <span>{formatCurrency(target)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                    className="bg-brand-accent h-4 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progresso da meta: ${percentage.toFixed(1)}%`}
                ></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-2">{percentage.toFixed(1)}% alcançado</p>
        </div>
    );
};

export default GoalProgress;
