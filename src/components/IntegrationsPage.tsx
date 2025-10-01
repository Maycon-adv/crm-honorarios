import React from 'react';

const IntegrationsPage: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">Integrações</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
                <p className="text-gray-600">As configurações de integração foram movidas para a página de <span className="font-semibold">Configurações</span>.</p>
            </div>
        </div>
    );
};

export default IntegrationsPage;