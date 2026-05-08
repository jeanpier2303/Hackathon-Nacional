import { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileWarning
} from 'lucide-react';

import {
  formatCurrency,
  formatDate,
  getRiskColor,
  getFlagLabel
} from '../../utils/formatters';

import { Card } from '../common/Card';
import { ExportButton } from '../common/ExportButton';
import { SearchInput } from '../common/SearchInput';
import ContractModal from './ContractModal';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('processNumber', {
    header: 'Nº Proceso',
    cell: info => (
      <span
        className="font-mono text-[11px] sm:text-xs truncate max-w-[150px] sm:max-w-[200px] block"
        title={info.getValue()}
      >
        {info.getValue()?.slice(0, 20)}
      </span>
    )
  }),

  columnHelper.accessor('entity', {
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting()}
        className="flex items-center gap-1 hover:text-purple-600 text-xs sm:text-sm"
      >
        Entidad
        <ArrowUpDown size={12} className="sm:size-14" />
      </button>
    )
  }),

  columnHelper.accessor('contractor', {
    header: 'Contratista',
    cell: info => (
      <span
        className="truncate max-w-[120px] sm:max-w-[180px] block text-xs sm:text-sm"
        title={info.getValue()}
      >
        {info.getValue()}
      </span>
    )
  }),

  columnHelper.accessor('value', {
    header: 'Valor',
    cell: info => (
      <span className="font-semibold text-green-600 dark:text-green-400 text-xs sm:text-sm">
        {formatCurrency(info.getValue())}
      </span>
    )
  }),

  columnHelper.accessor('date', {
    header: 'Fecha',
    cell: info => (
      <span className="text-xs sm:text-sm">
        {formatDate(info.getValue())}
      </span>
    )
  }),

  columnHelper.accessor('riskScore', {
    header: 'Riesgo',
    cell: info => (
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="w-8 sm:w-12 h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              info.getValue() >= 70
                ? 'bg-red-500'
                : info.getValue() >= 40
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${info.getValue()}%` }}
          />
        </div>

        <span
          className={`font-bold text-xs sm:text-sm ${getRiskColor(
            info.getValue()
          )}`}
        >
          {info.getValue()}%
        </span>
      </div>
    )
  }),

  columnHelper.accessor('flags', {
    header: 'Alertas',
    cell: info => (
      <div className="flex flex-wrap gap-1 max-w-[150px] sm:max-w-[200px]">
        {info.getValue().slice(0, 1).map(flag => (
          <span
            key={flag}
            className="px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 whitespace-nowrap"
          >
            {getFlagLabel(flag).slice(0, 15)}
          </span>
        ))}

        {info.getValue().length > 1 && (
          <span className="text-[10px] sm:text-xs text-gray-400">
            +{info.getValue().length - 1}
          </span>
        )}
      </div>
    )
  }),

  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <button
        onClick={e => {
          e.stopPropagation();
          row.original.onViewClick?.();
        }}
        className="text-purple-600 hover:text-purple-800 transition p-1 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30"
      >
        <Eye size={14} className="sm:size-16" />
      </button>
    )
  })
];

export const ContractsTable = ({
  contracts,
  pagination,
  onPageChange,
  globalFilter,
  onGlobalFilterChange,
  hideSearch = false
}) => {
  const [sorting, setSorting] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

    return enrichedContracts.filter(
      c =>
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
    getSortedRowModel: getSortedRowModel()
  });

  if (filteredData.length === 0 && !hideSearch) {
    return (
      <Card className="p-6 sm:p-8 text-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <FileWarning size={36} className="sm:size-48" strokeWidth={1} />

          <p className="text-base sm:text-lg font-medium">
            No se encontraron contratos
          </p>

          <p className="text-xs sm:text-sm">
            Intenta con otros filtros o términos de búsqueda
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden p-0 shadow-xl">
        {!hideSearch && (
          <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b bg-gray-50/50 dark:bg-gray-800/30">
            <SearchInput
              value={globalFilter}
              onChange={onGlobalFilterChange}
              placeholder="Buscar..."
            />

            <ExportButton
              data={filteredData}
              filename="contratos"
            />
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[640px] sm:min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition cursor-pointer group"
                  onClick={() => row.original.onViewClick?.()}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-2 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col xs:flex-row justify-between items-center gap-2 p-3 sm:p-4 border-t bg-gray-50/50 dark:bg-gray-800/30">
            <span className="text-xs sm:text-sm text-gray-500">
              Página {pagination.page} de {pagination.totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => onPageChange(pagination.page - 1)}
                className="px-2 sm:px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1 text-xs sm:text-sm"
              >
                <ChevronLeft size={12} className="sm:size-14" />
                Anterior
              </button>

              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
                className="px-2 sm:px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1 text-xs sm:text-sm"
              >
                Siguiente
                <ChevronRight size={12} className="sm:size-14" />
              </button>
            </div>
          </div>
        )}
      </Card>

      <ContractModal
        contractId={selectedContractId}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedContractId(null);
        }}
      />
    </>
  );
};