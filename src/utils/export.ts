import { formatCurrency, formatDate } from './helpers';

const createDownloadLink = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const getHeaders = () => [
    'Ficha', 'Processo', 'Parte', 'Email', 'Telefone', 'Colaborador', 'Data Acordo', 'Valor Total', 'Status'
];

const agreementToRow = (a: any): (string | number)[] => [
    a.recordNumber,
    a.processNumber,
    a.partyName,
    a.partyEmail,
    a.partyPhone,
    a.responsibleCollaborator,
    formatDate(a.agreementDate),
    formatCurrency(a.agreedValue),
    a.status
];

export const exportToCSV = (data: any[], filename: string) => {
    const headers = getHeaders();
    const rows = data.map(agreementToRow);
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    createDownloadLink(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
};

export const exportToXLSX = (data: any[], filename: string) => {
    // This is a simplified version that creates a CSV file but names it .xlsx
    // Excel can usually open this correctly.
    exportToCSV(data, `${filename}.xlsx`);
};

export const exportToTXT = (data: any[], filename: string) => {
    const headers = getHeaders();
    const rows = data.map(agreementToRow);
    const columnWidths = headers.map((header, index) => 
        Math.max(header.length, ...rows.map(row => String(row[index]).length))
    );
    const formatRow = (row: (string|number)[]) => row.map((cell, index) => String(cell).padEnd(columnWidths[index])).join(' | ');

    const txtContent = [
        formatRow(headers),
        columnWidths.map(w => '-'.repeat(w)).join('-|-'),
        ...rows.map(formatRow)
    ].join('\n');
    createDownloadLink(txtContent, `${filename}.txt`, 'text/plain;charset=utf-8;');
};

export const exportToMD = (data: any[], filename: string) => {
    const headers = getHeaders();
    const rows = data.map(agreementToRow);

    const formatRow = (row: (string|number)[]) => `| ${row.join(' | ')} |`;

    const mdContent = [
        formatRow(headers),
        `| ${headers.map(h => '-'.repeat(h.length)).join(' | ')} |`,
        ...rows.map(formatRow)
    ].join('\n');
    createDownloadLink(mdContent, `${filename}.md`, 'text/markdown;charset=utf-8;');
};


export const exportToPDF = (data: any[], _filename: string) => {
    // A simple text-based "PDF" via window.print
    const headers = getHeaders();
    const rows = data.map(agreementToRow);
    
    const html = `
        <html>
            <head>
                <title>Relatório de Acordos</title>
                <style>
                    body { font-family: sans-serif; font-size: 10px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Relatório de Acordos</h1>
                <table>
                    <thead>
                        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        // The user can then "Save as PDF".
    } else {
        alert('Por favor, permita pop-ups para gerar o PDF.');
    }
};
