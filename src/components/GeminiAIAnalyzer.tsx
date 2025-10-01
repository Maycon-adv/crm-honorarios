import React, { useState } from 'react';
import { Agreement, InstallmentStatus } from '../types';
import { ICONS } from '../constants';
import { GoogleGenAI } from '@google/genai';

interface GeminiAIAnalyzerProps {
    agreements: Agreement[];
    stats: {
        totalValue: number;
        receivedValue: number;
        pendingValue: number;
        overdue: number;
        active: number;
    };
}

const GeminiAIAnalyzer: React.FC<GeminiAIAnalyzerProps> = ({ agreements, stats }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!query.trim()) {
            setError("Por favor, insira uma pergunta para análise.");
            return;
        }

        if (!process.env.API_KEY) {
            setError("A chave da API Gemini não está configurada.");
            return;
        }

        setIsLoading(true);
        setResult('');
        setError('');

        try {
            // Fix: Initialize GoogleGenAI with API key from environment variables as per guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // Create a simplified summary of the data for the prompt
            const dataSummary = {
                totalAgreements: agreements.length,
                ...stats,
                agreementsByType: agreements.reduce((acc, a) => {
                    const type = a.agreementType || 'N/A';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
                agreementsByStatus: agreements.reduce((acc, a) => {
                    acc[a.status] = (acc[a.status] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
                performanceByCollaborator: agreements.reduce((acc, a) => {
                    const received = a.installments.filter(i => i.status === InstallmentStatus.Paid).reduce((sum, i) => sum + i.value, 0);
                    if (!acc[a.responsibleCollaborator]) {
                        acc[a.responsibleCollaborator] = { totalAgreed: 0, totalReceived: 0, count: 0 };
                    }
                    acc[a.responsibleCollaborator].totalAgreed += a.agreedValue;
                    acc[a.responsibleCollaborator].totalReceived += received;
                    acc[a.responsibleCollaborator].count += 1;
                    return acc;
                }, {} as Record<string, { totalAgreed: number, totalReceived: number, count: number }>)
            };

            const prompt = `
                Você é um analista de dados especialista em um CRM de honorários advocatícios. 
                Com base no resumo de dados a seguir, responda à pergunta do usuário de forma concisa e direta. 
                Use os dados para embasar sua resposta. Formate a resposta de maneira clara usando markdown simples (negrito com **, listas com *).

                RESUMO DOS DADOS:
                ${JSON.stringify(dataSummary, null, 2)}

                PERGUNTA DO USUÁRIO:
                "${query}"
            `;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt
            });

            setResult(response.text);

        } catch (e: any) {
            console.error("Error calling Gemini API:", e);
            setError("Não foi possível obter a análise. Verifique a chave da API e a sua conexão com a internet.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderGeminiResult = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const elements = [];
        let listItems: string[] = [];

        const flushList = (key: string) => {
            if (listItems.length > 0) {
                elements.push(
                    <ul key={key} className="list-disc pl-5 space-y-1">
                        {listItems.map((item, idx) => (
                            <li key={idx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        ))}
                    </ul>
                );
                listItems = [];
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('* ')) {
                listItems.push(line.substring(2));
            } else {
                flushList(`ul-${i}`);
                elements.push(<p key={`p-${i}`} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />);
            }
        }
        flushList('ul-last');

        return elements;
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="text-brand-secondary mr-2">{ICONS.gemini}</span>
                Análise Inteligente com Gemini
            </h3>
            <div className="flex items-center space-x-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ex: Qual colaborador tem o maior valor recebido?"
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <button 
                    onClick={handleAnalyze} 
                    disabled={isLoading}
                    className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors duration-200 disabled:bg-gray-400"
                >
                    {isLoading ? 'Analisando...' : 'Analisar'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {result && (
                <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-md border">
                   {renderGeminiResult(result)}
                </div>
            )}
        </div>
    );
};

export default GeminiAIAnalyzer;
