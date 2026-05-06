import { useState, useMemo } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, Download } from 'lucide-react';
import { formatCurrency, formatDate, getRiskColor, getFlagLabel } from '../../utils/formatters';
import { Card } from '../common/Card';
import { ExportButton } from '../common/ExportButton';
import { SearchInput } from '../common/SearchInput';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('processNumber', { 
    header: 'Nº Proceso', 
    cell: info => <span className="font-mono text-xs font-medium">{info.getValue()?.slice(0, 30)}</span> 
  }),
  columnHelper.accessor('entity', { 
    header: ({ column }) => <button onClick={() => column.toggleSorting()} className="flex items-center gap-1">Entidad <ArrowUpDown size={14} /></button> 
  }),
  columnHelper.accessor('contractor', { header: 'Contratista' }),
  columnHelper.accessor('value', { 
    header: 'Valor', 
    cell: info => <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(info.getValue())}</span> 
  }),
  columnHelper.accessor('date', { header: 'Fecha', cell: info => formatDate(info.getValue()) }),
  columnHelper.accessor('riskScore', { 
    header: 'Riesgo', 
    cell: info => {
      const score = info.getValue();
      const bgClass = score >= 70 ? 'risk-badge-high' : score >= 40 ? 'risk-badge-medium' : 'risk-badge-low';
      return <span className={`px-2 py-1 rounded-full text-xs font-bold ${bgClass}`}>{score}%</span>;
    }
  }),
  columnHelper.accessor('flags', { 
    header: 'Alertas', 
    cell: info => (
      <div className="flex flex-wrap gap-1">
        {info.getValue().map(flag => (
          <span key={flag} className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            {getFlagLabel(flag)}
          </span>
        ))}
        {info.getValue().length === 0 && <span className="text-gray-400 text-xs">Sin alertas</span>}
      </div>
    )
  }),
  columnHelper.display({ 
    id: 'actions', 
    header: 'Acciones', 
    cell: ({ row }) => (
      <a href={`/contract/${row.original.id}`} className="text-purple-600 hover:text-purple-800 transition flex items-center gap-1">
        <Eye size={16} /> Ver
      </a>
    )
  }),
];

export const ContractsTable = ({ contracts, pagination, onPageChange, globalFilter, onGlobalFilterChange, hideSearch = false }) => {
  const [sorting, setSorting] = useState([]);
  
  const filteredData = useMemo(() => {
    if (!globalFilter) return contracts;
    const search = globalFilter.toLowerCase();
    return contracts.filter(c => 
      c.processNumber?.toLowerCase().includes(search) ||
      c.entity?.toLowerCase().includes(search) ||
      c.contractor?.toLowerCase().includes(search)
    );
  }, [contracts, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className="overflow-hidden p-0 shadow-xl">
      {!hideSearch && (
        <div className="p-4 flex flex-wrap justify-between items-center gap-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
          <SearchInput value={globalFilter} onChange={onGlobalFilterChange} placeholder="Buscar por proceso, entidad o contratista..." />
          <ExportButton data={filteredData} filename="contratos" />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition duration-150 cursor-pointer group" onClick={() => window.location.href = `/contract/${row.original.id}`}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
          <span className="text-sm text-gray-500">Página {pagination.page} de {pagination.totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="px-3 py-1 rounded-lg border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="px-3 py-1 rounded-lg border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-1"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};