import { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
} from 'lucide-react';

import {
  formatCurrency,
  formatDate,
  getRiskColor,
  getFlagLabel,
} from '../../utils/formatters';

import { Card } from '../common/Card';
import { ExportButton } from '../common/ExportButton';
import { SearchInput } from '../common/SearchInput';
import ContractModal from './ContractModal';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('processNumber', {
    header: 'Nº Proceso',
    cell: (info) => (
      <span className="font-mono text-xs break-all">
        {info.getValue()?.slice(0, 30)}
      </span>
    ),
  }),

  columnHelper.accessor('entity', {
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting()}
        className="flex items-center gap-1 whitespace-nowrap"
      >
        Entidad <ArrowUpDown size={14} />
      </button>
    ),
  }),

  columnHelper.accessor('contractor', {
    header: 'Contratista',
    cell: (info) => (
      <span className="break-words">{info.getValue()}</span>
    ),
  }),

  columnHelper.accessor('value', {
    header: 'Valor',
    cell: (info) => (
      <span className="font-semibold whitespace-nowrap">
        {formatCurrency(info.getValue())}
      </span>
    ),
  }),

  columnHelper.accessor('date', {
    header: 'Fecha',
    cell: (info) => (
      <span className="whitespace-nowrap">
        {formatDate(info.getValue())}
      </span>
    ),
  }),

  columnHelper.accessor('riskScore', {
    header: 'Riesgo',
    cell: (info) => (
      <span
        className={`font-bold ${getRiskColor(
          info.getValue()
        )} whitespace-nowrap`}
      >
        {info.getValue()}%
      </span>
    ),
  }),

  columnHelper.accessor('flags', {
    header: 'Alertas',
    cell: (info) => (
      <div className="flex flex-wrap gap-1">
        {info.getValue().map((flag) => (
          <span
            key={flag}
            className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 whitespace-nowrap"
          >
            {getFlagLabel(flag)}
          </span>
        ))}
      </div>
    ),
  }),

  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          row.original.onViewClick?.();
        }}
        className="text-purple-600 hover:text-purple-800 p-1"
      >
        <Eye size={16} />
      </button>
    ),
  }),
];

// PAGINACIÓN
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);

      if (start > 2) {
        pages.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-1.5 sm:p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Primera página"
      >
        <ChevronsLeft size={16} />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 sm:p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span
            key={`dots-${idx}`}
            className="px-1 sm:px-2 text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-1 sm:px-2 rounded-lg border transition ${
              currentPage === page
                ? 'bg-purple-600 text-white border-purple-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 sm:p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Página siguiente"
      >
        <ChevronRight size={16} />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1.5 sm:p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Última página"
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
};

export const ContractsTable = ({
  contracts,
  pagination,
  onPageChange,
  globalFilter,
  onGlobalFilterChange,
  hideSearch = false,
}) => {
  const [sorting, setSorting] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const enrichedContracts = useMemo(() => {
    return contracts.map((contract) => ({
      ...contract,
      onViewClick: () => {
        setSelectedContractId(contract.id);
        setModalOpen(true);
      },
    }));
  }, [contracts]);

  const filteredData = useMemo(() => {
    if (!globalFilter) return enrichedContracts;

    const search = globalFilter.toLowerCase();

    return enrichedContracts.filter(
      (c) =>
        c.processNumber?.toLowerCase().includes(search) ||
        c.entity?.toLowerCase().includes(search) ||
        c.contractor?.toLowerCase().includes(search)
    );
  }, [enrichedContracts, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Card className="overflow-hidden p-0 shadow-xl">
        {!hideSearch && (
          <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-b bg-gray-50/50 dark:bg-gray-800/30">
            <SearchInput
              value={globalFilter}
              onChange={onGlobalFilterChange}
              placeholder="Buscar por proceso, entidad o contratista..."
            />

            <ExportButton
              data={filteredData}
              filename="contratos"
            />
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-[800px] lg:min-w-full">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition cursor-pointer"
                    onClick={() => row.original.onViewClick?.()}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm"
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
        </div>

        {/* PAGINACIÓN */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t bg-gray-50/50 dark:bg-gray-800/30">
            <span className="text-sm text-gray-500 order-2 sm:order-1">
              Mostrando{' '}
              {(pagination.page - 1) * pagination.limit + 1}
              {' - '}
              {Math.min(
                pagination.page * pagination.limit,
                pagination.total
              )}{' '}
              de {pagination.total} contratos
            </span>

            <div className="order-1 sm:order-2">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={onPageChange}
              />
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