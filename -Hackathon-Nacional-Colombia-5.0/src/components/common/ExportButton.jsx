import { Download } from 'lucide-react';
import { Button } from './Button';

export const ExportButton = ({ data, filename = 'contratos' }) => {
  const handleExportCSV = () => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    for (const row of data) {
      const values = headers.map(header => JSON.stringify(row[header] || ''));
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return <Button variant="outline" onClick={handleExportCSV}><Download size={16} className="mr-2" /> Exportar CSV</Button>;
};