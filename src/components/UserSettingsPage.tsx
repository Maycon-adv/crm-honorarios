import React, { useState, useEffect } from 'react';
import { useAuthContext, useActivityLogContext } from '../contexts';
import { ICONS } from '../constants';

const WEBHOOK_URL_KEY = 'crm_webhook_url';

const UserSettingsPage: React.FC = () => {
    const { currentUser, updateUserPassword } = useAuthContext();
    const { addLog } = useActivityLogContext();

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Webhook state
    const [webhookUrl, setWebhookUrl] = useState('');
    const [webhookFeedback, setWebhookFeedback] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    
    useEffect(() => {
        const savedUrl = localStorage.getItem(WEBHOOK_URL_KEY);
        if (savedUrl) {
            setWebhookUrl(savedUrl);
        }
    }, []);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentUser) {
            setPasswordError('Usuário não autenticado.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('As novas senhas não correspondem.');
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError('A nova senha deve ter no mínimo 8 caracteres.');
            return;
        }

        try {
            const result = await updateUserPassword(currentUser.id, currentPassword, newPassword);

            if (result.success) {
                setPasswordSuccess(result.message);
                addLog('Alterou a própria senha.', currentUser);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setPasswordError(result.message);
            }
        } catch (error) {
            console.error('Failed to update password', error);
            const message = error instanceof Error ? error.message : 'Erro ao atualizar senha. Tente novamente.';
            setPasswordError(message);
        }
    };
    
    const handleWebhookSave = () => {
        try {
            if (webhookUrl) { // Only validate if not empty
                new URL(webhookUrl);
            }
            localStorage.setItem(WEBHOOK_URL_KEY, webhookUrl);
            setWebhookFeedback({ type: 'success', text: 'URL do Webhook salva com sucesso!' });
        } catch (error) {
            setWebhookFeedback({ type: 'error', text: 'URL inválida. Por favor, insira uma URL completa.' });
        }
         setTimeout(() => setWebhookFeedback(null), 3000);
    };
    
    const handleWebhookTest = async () => {
        const savedWebhookUrl = localStorage.getItem(WEBHOOK_URL_KEY);
        if (!savedWebhookUrl) {
            setWebhookFeedback({ type: 'error', text: 'Por favor, salve uma URL antes de testar.' });
            return;
        }

        setWebhookFeedback({ type: 'info', text: 'Enviando evento de teste...' });

        try {
             const response = await fetch(savedWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'test',
                    message: 'Esta é uma mensagem de teste do CRM de Honorários.',
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                 throw new Error(`O servidor respondeu com o status: ${response.status}`);
            }

            setWebhookFeedback({ type: 'success', text: 'Webhook de teste enviado com sucesso!' });
        } catch (error) {
            console.error('Webhook test error:', error);
            setWebhookFeedback({ type: 'error', text: 'Falha ao enviar o teste. Verifique a URL e o console.' });
        }
    };


    if (!currentUser) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">Configurações</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-8">
                        <div className="flex items-center mb-8">
                            <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                                {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{currentUser.name}</h3>
                                <p className="text-gray-500">{currentUser.email}</p>
                            </div>
                        </div>

                        <h4 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Alterar Senha</h4>
                        <form onSubmit={handlePasswordSubmit} className="space-y-6 mt-6">
                            {passwordError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">{passwordError}</div>}
                            {passwordSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-sm" role="alert">{passwordSuccess}</div>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" required />
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors duration-200">
                                    Salvar Senha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div className="space-y-8">
                     <div className="bg-white rounded-lg shadow-md p-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                            <div className="mr-3 text-brand-accent">{ICONS.integrations}</div>
                            Webhook de Notificações
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Configure uma URL para enviar dados de acordos para ferramentas de automação como n8n, Zapier ou Make.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">URL do Webhook</label>
                                <input id="webhookUrl" type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://seu-n8n.com/webhook/..." className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"/>
                            </div>
                            {webhookFeedback && (
                                <div className={`text-sm p-3 rounded-md ${
                                    webhookFeedback.type === 'success' ? 'bg-green-100 text-green-800' : 
                                    webhookFeedback.type === 'error' ? 'bg-red-100 text-red-800' : 
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {webhookFeedback.text}
                                </div>
                            )}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button onClick={handleWebhookTest} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Testar
                                </button>
                                <button onClick={handleWebhookSave} className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors duration-200">
                                    Salvar URL
                                </button>
                            </div>
                        </div>
                    </div>
                     <div className="bg-white rounded-lg shadow-md p-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Preferências</h3>
                        <div className="mt-4 opacity-50">
                            <label className="block text-sm font-medium text-gray-700">Idioma</label>
                            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" disabled>
                                <option>Português (Brasil)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Opções de idioma estarão disponíveis em breve.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserSettingsPage;