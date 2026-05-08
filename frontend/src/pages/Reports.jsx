import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Calendar, Filter, X, BarChart3, 
  TrendingUp, AlertTriangle, FileSpreadsheet
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useContracts } from '../hooks/useContracts';
import { formatCurrency, formatDate, getRiskColor } from '../utils/formatters';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Reports = () => {
  const { contracts, loading, error } = useContracts({ limit: 1000 });
  const [reportType, setReportType] = useState('executive'); // executive, detailed, risk
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const reportContentRef = useRef(null);

  // Filtrar por fechas
  const filteredContracts = useMemo(() => {
    let filtered = [...contracts];
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(c => new Date(c.date) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter(c => new Date(c.date) <= end);
    }
    return filtered;
  }, [contracts, startDate, endDate]);

  // Métricas
  const metrics = useMemo(() => {
    const total = filteredContracts.length;
    const totalAlerts = filteredContracts.reduce((acc, c) => acc + c.flags.length, 0);
    const avgRisk = total ? Math.round(filteredContracts.reduce((acc, c) => acc + c.riskScore, 0) / total) : 0;
    const highRiskCount = filteredContracts.filter(c => c.riskScore >= 70).length;
    return { total, totalAlerts, avgRisk, highRiskCount };
  }, [filteredContracts]);

  // Datos para gráfico de línea (riesgo por mes)
  const lineChartData = useMemo(() => {
    const months = {};
    filteredContracts.forEach(c => {
      const date = new Date(c.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!months[key]) {
        months[key] = { month: key, avgRisk: 0, count: 0 };
      }
      months[key].avgRisk += c.riskScore;
      months[key].count += 1;
    });
    return Object.values(months).map(m => ({
      month: m.month,
      avgRisk: Math.round(m.avgRisk / m.count),
    })).sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredContracts]);

  const exportToCSV = () => {
    const headers = ['ID', 'Proceso', 'Entidad', 'Contratista', 'Valor', 'Fecha', 'Riesgo', 'Alertas'];
    const rows = filteredContracts.map(c => [
      c.id,
      c.processNumber,
      c.entity,
      c.contractor,
      c.value,
      c.date,
      c.riskScore,
      c.flags.join(', ')
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `reporte_contratos_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredContracts.map(c => ({
        ID: c.id,
        Proceso: c.processNumber,
        Entidad: c.entity,
        Contratista: c.contractor,
        Valor: c.value,
        Fecha: c.date,
        Riesgo: c.riskScore,
        Alertas: c.flags.join(', ')
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contratos');
    XLSX.writeFile(workbook, `reporte_contratos_${new Date().toISOString()}.xlsx`);
  };

  const exportToPDF = async () => {
    if (!reportContentRef.current) return;
    setGeneratingPdf(true);
    try {
      const element = reportContentRef.current;
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`reporte_${reportType}_${new Date().toISOString()}.pdf`);
    } catch (err) {
      console.error('Error PDF:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const clearDateFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse glass-card rounded-xl p-6 h-32"></div>
        <div className="animate-pulse glass-card rounded-xl p-6 h-64"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-xl">Error: {error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportToCSV} variant="outline" size="sm"><Download size={16} className="mr-1" /> CSV</Button>
          <Button onClick={exportToExcel} variant="outline" size="sm"><FileSpreadsheet size={16} className="mr-1" /> Excel</Button>
          <Button onClick={exportToPDF} variant="primary" size="sm" isLoading={generatingPdf}>
            <FileText size={16} className="mr-1" /> PDF
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-5">
        <div className="flex flex-wrap gap-4 justify-between items-end">
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo de reporte</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="px-3 py-2 border rounded-lg dark:bg-gray-800 text-sm">
                <option value="executive">Ejecutivo (Gráficos)</option>
                <option value="detailed">Detallado (Tabla)</option>
                <option value="risk">Riesgos (Alto riesgo)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Desde</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border rounded-lg dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hasta</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border rounded-lg dark:bg-gray-800 text-sm" />
            </div>
            {(startDate || endDate) && (
              <Button onClick={clearDateFilters} variant="outline" size="sm" className="self-end">
                <X size={14} className="mr-1" /> Limpiar fechas
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-500">{metrics.total} contratos encontrados</div>
        </div>
      </Card>

      {/* Contenido del reporte (para PDF) */}
      <div ref={reportContentRef} className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <FileText className="mx-auto text-purple-500 mb-2" size={24} />
            <p className="text-2xl font-bold">{metrics.total}</p>
            <p className="text-xs text-gray-500">Contratos</p>
          </Card>
          <Card className="p-4 text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-2" size={24} />
            <p className="text-2xl font-bold">{metrics.totalAlerts}</p>
            <p className="text-xs text-gray-500">Alertas detectadas</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="mx-auto text-yellow-500 mb-2" size={24} />
            <p className="text-2xl font-bold">{metrics.avgRisk}%</p>
            <p className="text-xs text-gray-500">Riesgo promedio</p>
          </Card>
          <Card className="p-4 text-center">
            <BarChart3 className="mx-auto text-orange-500 mb-2" size={24} />
            <p className="text-2xl font-bold">{metrics.highRiskCount}</p>
            <p className="text-xs text-gray-500">Alto riesgo</p>
          </Card>
        </div>

        {reportType === 'executive' && (
          <>
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={18} /> Evolución del riesgo por mes
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgRisk" stroke="#8B5CF6" name="Riesgo promedio (%)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-4">Resumen ejecutivo</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Se analizaron <strong>{metrics.total}</strong> contratos públicos en el período seleccionado. 
                Se detectaron <strong>{metrics.totalAlerts}</strong> alertas de riesgo, con un promedio de 
                <strong> {metrics.avgRisk}%</strong> en la puntuación de riesgo. 
                {metrics.highRiskCount > 0 && (
                  <> <strong>{metrics.highRiskCount}</strong> contratos presentan nivel de riesgo alto (≥70%), 
                  requiriendo revisión prioritaria.</>
                )}
              </p>
            </Card>
          </>
        )}

        {reportType === 'detailed' && (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Nº Proceso</th>
                    <th className="px-4 py-3 text-left">Entidad</th>
                    <th className="px-4 py-3 text-left">Contratista</th>
                    <th className="px-4 py-3 text-left">Valor</th>
                    <th className="px-4 py-3 text-left">Fecha</th>
                    <th className="px-4 py-3 text-left">Riesgo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredContracts.slice(0, 100).map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2 font-mono text-xs">{c.processNumber.slice(0, 25)}</td>
                      <td className="px-4 py-2">{c.entity.slice(0, 20)}</td>
                      <td className="px-4 py-2">{c.contractor.slice(0, 20)}</td>
                      <td className="px-4 py-2 font-semibold">{formatCurrency(c.value)}</td>
                      <td className="px-4 py-2">{formatDate(c.date)}</td>
                      <td className={`px-4 py-2 font-bold ${getRiskColor(c.riskScore)}`}>{c.riskScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredContracts.length > 100 && (
                <p className="p-3 text-center text-gray-500 text-sm">Mostrando 100 de {filteredContracts.length} contratos</p>
              )}
            </div>
          </Card>
        )}

        {reportType === 'risk' && (
          <div className="space-y-4">
            <Card className="p-5 bg-red-50/30 dark:bg-red-900/10 border-red-200">
              <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle size={20} /> Contratos con alto riesgo (≥70%)
              </h3>
            </Card>
            {filteredContracts.filter(c => c.riskScore >= 70).map(c => (
              <Card key={c.id} className="p-4 border-l-4 border-red-500">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-gray-500">{c.processNumber}</p>
                    <p className="font-semibold">{c.entity}</p>
                    <p className="text-sm">{c.contractor}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getRiskColor(c.riskScore)}`}>{c.riskScore}%</p>
                    <p className="text-sm">{formatCurrency(c.value)}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.flags.map(f => (
                    <span key={f} className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">{f.replace('_', ' ')}</span>
                  ))}
                </div>
              </Card>
            ))}
            {filteredContracts.filter(c => c.riskScore >= 70).length === 0 && (
              <Card className="p-8 text-center text-gray-500">No hay contratos con riesgo alto en el período seleccionado.</Card>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Reports;