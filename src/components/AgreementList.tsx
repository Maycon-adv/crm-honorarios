import React, { useState, useMemo, FC, useEffect } from 'react';
import { useAgreementsContext, useActivityLogContext, useAuthContext, useAppContext, useContactsContext } from '../contexts';
import { Agreement, AgreementStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ICONS } from '../constants';
import AddAgreementModal from './AddAgreementModal';
import AgreementDetailModal from './AgreementDetailModal';
import ImportModal from './ImportModal';
import { exportToCSV, exportToXLSX, exportToPDF, exportToTXT, exportToMD } from '../utils/export';
import NotificationModal from './NotificationModal';

type SortKey = 'partyName' | 'agreementDate' | 'agreedValue' | 'status';

const ITEMS_PER_PAGE = 15;

const AgreementList: FC = () => {
    const { agreements, deleteAgreement } = useAgreementsContext();
    const { contacts } = useContactsContext();
    const { addLog } = useActivityLogContext();
    const { currentUser } = useAuthContext();
    const { agreementListFilter, navigateTo } = useAppContext();
    
    // Search & Sort
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>({ key: 'agreementDate', direction: 'desc' });

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [agreementToEdit, setAgreementToEdit] = useState<Agreement | null>(null);
    const [agreementToView, setAgreementToView] = useState<Agreement | null>(null);
    const [agreementToNotify, setAgreementToNotify] = useState<Agreement | null>(null);
    
    // UI State
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Advanced Filters
    const [advancedFilters, setAdvancedFilters] = useState({
        statuses: [] as AgreementStatus[],
        collaborator: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        if (agreementListFilter && agreementListFilter !== 'all') {
            const filters = Array.isArray(agreementListFilter) ? agreementListFilter : [agreementListFilter];
            setAdvancedFilters(prev => ({ ...prev, statuses: filters }));
            setIsFilterPanelOpen(true);
            navigateTo('agreements', 'all'); // Reset the context filter
        }
    }, [agreementListFilter, navigateTo]);
    
    const collaborators = useMemo(() => {
        // Get unique collaborators from agreements
        const collaboratorSet = new Set(agreements.map(a => a.responsibleCollaborator));
        return Array.from(collaboratorSet);
    }, [agreements]);

    const agreementsWithContactInfo = useMemo(() => {
        return agreements.map(agreement => {
            const contact = contacts.find(c => c.id === agreement.contactId);
            return {
                ...agreement,
                partyName: contact?.name || 'Contato não encontrado',
                partyEmail: contact?.email,
                partyPhone: contact?.phone,
            };
        });
    }, [agreements, contacts]);

    const filteredAgreements = useMemo(() => {
        let filtered = agreementsWithContactInfo;

        // Apply advanced filters
        if(advancedFilters.statuses.length > 0) {
            filtered = filtered.filter(a => advancedFilters.statuses.includes(a.status));
        }
        if(advancedFilters.collaborator) {
            filtered = filtered.filter(a => a.responsibleCollaborator === advancedFilters.collaborator);
        }
        if(advancedFilters.startDate) {
            filtered = filtered.filter(a => a.agreementDate >= advancedFilters.startDate);
        }
        if(advancedFilters.endDate) {
            filtered = filtered.filter(a => a.agreementDate <= advancedFilters.endDate);
        }
        
        // Apply search term
        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = filtered.filter(agreement =>
                agreement.partyName.toLowerCase().includes(lowercasedFilter) ||
                agreement.recordNumber.toLowerCase().includes(lowercasedFilter) ||
                agreement.processNumber.toLowerCase().includes(lowercasedFilter) ||
                agreement.responsibleCollaborator.toLowerCase().includes(lowercasedFilter)
            );
        }

        return filtered;
    }, [agreementsWithContactInfo, searchTerm, advancedFilters]);

    const sortedAgreements = useMemo(() => {
        const sortableItems = [...filteredAgreements];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredAgreements, sortConfig]);

    const paginatedAgreements = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedAgreements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedAgreements, currentPage]);

    const totalPages = Math.ceil(sortedAgreements.length / ITEMS_PER_PAGE);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAdvancedFilters(prev => ({...prev, [name]: value}));
    };

    const handleStatusFilterChange = (status: AgreementStatus) => {
        setAdvancedFilters(prev => {
            const newStatuses = prev.statuses.includes(status) 
                ? prev.statuses.filter(s => s !== status)
                : [...prev.statuses, status];
            return {...prev, statuses: newStatuses};
        });
    };
    
    const resetFilters = () => {
        setAdvancedFilters({ statuses: [], collaborator: '', startDate: '', endDate: '' });
        setSearchTerm('');
    };

    const requestSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) {
            return ICONS.sort;
        }
        return sortConfig.direction === 'asc' ? ICONS.sortAsc : ICONS.sortDesc;
    };

    const handleEdit = (agreement: Agreement) => {
        setAgreementToEdit(agreement);
        setIsAddModalOpen(true);
    };
    
    const handleDelete = (agreement: (typeof agreementsWithContactInfo)[0]) => {
        if(window.confirm(`Tem certeza que deseja excluir o acordo de ${agreement.partyName}?`)) {
            deleteAgreement(agreement.id);
            addLog(`Excluiu o acordo #${agreement.recordNumber} de ${agreement.partyName}.`, currentUser, { agreementId: agreement.id, agreementRecordNumber: agreement.recordNumber });
        }
    };

    const handleOpenAddModal = () => {
        setAgreementToEdit(null);
        setIsAddModalOpen(true);
    };

    const getStatusBadge = (status: AgreementStatus) => {
        switch (status) {
            case AgreementStatus.OnTime: return 'bg-blue-100 text-blue-800';
            case AgreementStatus.Overdue: return 'bg-red-100 text-red-800';
            case AgreementStatus.Paid: return 'bg-green-100 text-green-800';
            case AgreementStatus.Cancelled: return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    
    const handleExport = (format: 'xlsx' | 'csv' | 'pdf' | 'txt' | 'md') => {
        const exportData = sortedAgreements.map(a => {
            const contact = contacts.find(c => c.id === a.contactId);
            return {
                ...a,
                partyName: contact?.name || 'N/A',
                partyEmail: contact?.email || 'N/A',
                partyPhone: contact?.phone || 'N/A',
            }
        })
        switch(format) {
            case 'xlsx': exportToXLSX(exportData, 'acordos'); break;
            case 'csv': exportToCSV(exportData, 'acordos'); break;
            case 'pdf': exportToPDF(exportData, 'acordos'); break;
            case 'txt': exportToTXT(exportData, 'acordos'); break;
            case 'md': exportToMD(exportData, 'acordos'); break;
        }
        setIsExportMenuOpen(false);
    }
    
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-semibold text-gray-700">Lista de Acordos ({sortedAgreements.length})</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsImportModalOpen(true)} className="bg-white text-brand-accent font-bold py-2 px-4 rounded-lg border border-brand-accent hover:bg-blue-50 transition-colors duration-200">
                        Importar
                    </button>
                     <div className="relative">
                        <button onClick={() => setIsExportMenuOpen(prev => !prev)} className="bg-white text-brand-accent font-bold py-2 px-4 rounded-lg border border-brand-accent hover:bg-blue-50 transition-colors duration-200">
                            Exportar
                        </button>
                        {isExportMenuOpen && (
                             <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 border py-1">
                                <a href="#" onClick={(e) => { e.preventDefault(); handleExport('xlsx'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Excel (.xlsx)</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleExport('csv'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">CSV (.csv)</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleExport('pdf'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PDF (.pdf)</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleExport('txt'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Texto (.txt)</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleExport('md'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Markdown (.md)</a>
                            </div>
                        )}
                    </div>
                    <button onClick={handleOpenAddModal} className="bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors duration-200">
                        + Novo Acordo
                    </button>
                </div>
            </div>

            <div className="flex items-center mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nome, ficha, processo..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-accent focus:border-brand-accent"
                />
                <button onClick={() => setIsFilterPanelOpen(prev => !prev)} className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50">Filtros</button>
            </div>

            {isFilterPanelOpen && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <div className="mt-1 space-y-1">
                                {Object.values(AgreementStatus).map(status => (
                                    <label key={status} className="flex items-center">
                                        <input type="checkbox" checked={advancedFilters.statuses.includes(status)} onChange={() => handleStatusFilterChange(status)} className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-gray-300 rounded"/>
                                        <span className="ml-2 text-sm text-gray-600">{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Colaborador</label>
                            <select name="collaborator" value={advancedFilters.collaborator} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent">
                                <option value="">Todos</option>
                                {collaborators.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Data do Acordo (Início)</label>
                             <input type="date" name="startDate" value={advancedFilters.startDate} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Data do Acordo (Fim)</label>
                             <input type="date" name="endDate" value={advancedFilters.endDate} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={resetFilters} className="text-sm text-gray-600 hover:text-brand-accent underline">Limpar Filtros</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => requestSort('partyName')}>
                                Parte {getSortIcon('partyName')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Ficha / Processo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => requestSort('agreementDate')}>
                                Data Acordo {getSortIcon('agreementDate')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => requestSort('agreedValue')}>
                                Valor {getSortIcon('agreedValue')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => requestSort('status')}>
                                Status {getSortIcon('status')}
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedAgreements.map(agreement => (
                            <tr key={agreement.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => setAgreementToView(agreement)} className="font-medium text-gray-900 hover:text-brand-accent text-left transition-colors">
                                        {agreement.partyName}
                                    </button>
                                    <div className="text-sm text-gray-500">{agreement.responsibleCollaborator}</div>
                                    {agreement.partyEmail && <div className="text-xs text-gray-400 truncate max-w-xs">{agreement.partyEmail}</div>}
                                    {agreement.partyPhone && <div className="text-xs text-gray-400">{agreement.partyPhone}</div>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    <div>Ficha: {agreement.recordNumber}</div>
                                    <div>Proc: {agreement.processNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatDate(agreement.agreementDate)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{formatCurrency(agreement.agreedValue)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(agreement.status)}`}>
                                        {agreement.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-3">
                                        {agreement.status === AgreementStatus.Overdue && (
                                            <button onClick={() => setAgreementToNotify(agreement)} className="text-gray-500 hover:text-brand-accent" aria-label="Gerar Notificação">{ICONS.send}</button>
                                        )}
                                        <button onClick={() => setAgreementToView(agreement)} className="text-gray-500 hover:text-brand-accent" aria-label="Visualizar Detalhes">{ICONS.view}</button>
                                        <button onClick={() => handleEdit(agreement)} className="text-gray-500 hover:text-brand-accent" aria-label="Editar">{ICONS.edit}</button>
                                        <button onClick={() => handleDelete(agreement)} className="text-gray-500 hover:text-red-600" aria-label="Excluir">{ICONS.delete}</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {paginatedAgreements.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        Nenhum acordo encontrado.
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50">Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50">Próxima</button>
                </div>
            )}

            {isAddModalOpen && <AddAgreementModal onClose={() => setIsAddModalOpen(false)} agreementToEdit={agreementToEdit} />}
            {agreementToView && <AgreementDetailModal agreement={agreementToView} onClose={() => setAgreementToView(null)} />}
            {isImportModalOpen && <ImportModal onClose={() => setIsImportModalOpen(false)} />}
            {agreementToNotify && <NotificationModal agreement={agreementToNotify} onClose={() => setAgreementToNotify(null)} />}
        </div>
    );
};

export default AgreementList;