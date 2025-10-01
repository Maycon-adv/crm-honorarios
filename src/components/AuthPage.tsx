import React, { useState, FormEvent } from 'react';
import { useAuthContext } from '../contexts';
import { UserRole } from '../types';

const AuthPage: React.FC = () => {
    const { login, addUser } = useAuthContext();

    // State for login/register toggle
    const [isRegistering, setIsRegistering] = useState(false);

    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Register form state
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Feedback state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const result = await login(loginEmail, loginPassword);
        if (!result.success) {
            setError(result.message);
        }
    };

    const handleRegisterSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (registerPassword !== confirmPassword) {
            setError("As senhas não correspondem.");
            return;
        }

        if (registerPassword.length < 8) {
            setError("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        if (!registerEmail.endsWith('@schulze.com.br')) {
            setError("Apenas e-mails institucionais (@schulze.com.br) são permitidos.");
            return;
        }

        const result = await addUser(registerName, registerEmail, registerPassword, UserRole.Collaborator);

        if (result.success) {
            setSuccess("Cadastro realizado com sucesso! Agora você pode fazer o login.");
            // Reset form and switch to login view
            setIsRegistering(false);
            setRegisterName('');
            setRegisterEmail('');
            setRegisterPassword('');
            setConfirmPassword('');
        } else {
            setError(result.message);
        }
    };
    
    // Reset errors when switching forms
    const toggleForm = () => {
        setError('');
        setSuccess('');
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
             <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-brand-primary">Acordo$</h1>
                <p className="text-brand-gray mt-2">Seu CRM de Honorários Sucumbenciais</p>
            </div>
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                {isRegistering ? (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            Criar Nova Conta
                        </h2>
                        <p className="text-center text-sm text-gray-500 mb-6">
                           Cadastre-se para começar a gerenciar os acordos.
                        </p>
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">{error}</div>}
                            
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                <div className="mt-1">
                                    <input id="name" name="name" type="text" autoComplete="name" required value={registerName} onChange={(e) => setRegisterName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">E-mail Institucional</label>
                                <div className="mt-1">
                                    <input id="register-email" name="email" type="email" autoComplete="email" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" placeholder="seu.nome@schulze.com.br"/>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Senha</label>
                                <div className="mt-1">
                                    <input id="register-password" name="password" type="password" required value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                                </div>
                            </div>
                            
                             <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                                <div className="mt-1">
                                    <input id="confirm-password" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                                </div>
                            </div>
                            
                            <div>
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent">
                                    Cadastrar
                                </button>
                            </div>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-600">
                           Já tem uma conta?{' '}
                            <button onClick={toggleForm} className="font-medium text-brand-accent hover:text-brand-secondary">
                                Faça login
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            Acessar sua Conta
                        </h2>
                        <p className="text-center text-sm text-gray-500 mb-6">
                           Bem-vindo(a) de volta!
                        </p>

                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">{error}</div>}
                            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-sm" role="alert">{success}</div>}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" autoComplete="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                                <div className="mt-1">
                                    <input id="password" name="password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                                </div>
                            </div>
                            
                            <div>
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent">
                                    Entrar
                                </button>
                            </div>
                        </form>
                         <p className="mt-6 text-center text-sm text-gray-600">
                            Não tem uma conta?{' '}
                            <button onClick={toggleForm} className="font-medium text-brand-accent hover:text-brand-secondary">
                                Cadastre-se
                            </button>
                        </p>
                    </>
                )}
            </div>
             <div className="mt-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Acordo$ CRM. Todos os direitos reservados.</p>
            </div>
        </div>
    );
};

export default AuthPage;