import { useState, useMemo } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { formatCurrency, formatDate, getRiskColor, getFlagLabel } from '../../utils/formatters';
import { Card } from '../common/Card';
import { ExportButton } from '../common/ExportButton';
import { SearchInput } from '../common/SearchInput';
import ContractModal from './ContractModal';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('processNumber', { header: 'Nº Proceso', cell: info => <span className="font-mono text-xs">{info.getValue()?.slice(0, 30)}</span> }),
  columnHelper.accessor('entity', { header: ({ column }) => <button onClick={() => column.toggleSorting()} className="flex items-center gap-1">Entidad <ArrowUpDown size={14} /></button> }),
  columnHelper.accessor('contractor', { header: 'Contratista' }),
  columnHelper.accessor('value', { header: 'Valor', cell: info => <span className="font-semibold">{formatCurrency(info.getValue())}</span> }),
  columnHelper.accessor('date', { header: 'Fecha', cell: info => formatDate(info.getValue()) }),
  columnHelper.accessor('riskScore', { header: 'Riesgo', cell: info => <span className={`font-bold ${getRiskColor(info.getValue())}`}>{info.getValue()}%</span> }),
  columnHelper.accessor('flags', { header: 'Alertas', cell: info => ( <div className="flex flex-wrap gap-1">{info.getValue().map(flag => <span key={flag} className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">{getFlagLabel(flag)}</span>)}</div> ) }),
  columnHelper.display({ id: 'actions', header: '', cell: ({ row }) => <button onClick={(e) => { e.stopPropagation(); row.original.onViewClick?.(); }} className="text-purple-600 hover:text-purple-800"><Eye size={16} /></button> }),
];

export const ContractsTable = ({ contracts, pagination, onPageChange, globalFilter, onGlobalFilterChange, hideSearch = false }) => {
  const [sorting, setSorting] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Enriquecer contratos con función para abrir modal
  const enrichedContracts = useMemo(() => {
    return contracts.map(contract => ({
      ...contract,
      onViewClick: () => {
        setSelectedContractId(contract.id);
        setModalOpen(true);
      }
    }));
  }, [contracts]);

  const filteredData = useMemo(() => {
    if (!globalFilter) return enrichedContracts;
    const search = globalFilter.toLowerCase();
    return enrichedContracts.filter(c => 
      c.processNumber?.toLowerCase().includes(search) ||
      c.entity?.toLowerCase().includes(search) ||
      c.contractor?.toLowerCase().includes(search)
    );
  }, [enrichedContracts, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Card className="overflow-hidden p-0 shadow-xl">
        {!hideSearch && (
          <div className="p-4 flex flex-wrap justify-between items-center gap-3 border-b bg-gray-50/50 dark:bg-gray-800/30">
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
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition cursor-pointer" 
                  onClick={() => row.original.onViewClick?.()}
                >
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
          <div className="flex justify-between items-center p-4 border-t bg-gray-50/50 dark:bg-gray-800/30">
            <span className="text-sm text-gray-500">Página {pagination.page} de {pagination.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={pagination.page === 1} onClick={() => onPageChange(pagination.page - 1)} className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 transition">Anterior</button>
              <button disabled={pagination.page === pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)} className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 transition">Siguiente</button>
            </div>
          </div>
        )}
      </Card>
      <ContractModal contractId={selectedContractId} isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedContractId(null); }} />
    </>
  );
};