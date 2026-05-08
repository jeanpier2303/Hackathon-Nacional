import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useContracts } from '../hooks/useContracts';
import { ContractsTable } from '../components/dashboard/ContractsTable';
import { AdvancedFilters } from '../components/advanced/AdvancedFilters';
import { TableSkeleton } from '../components/common/Skeleton';

const Contracts = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [globalFilter, setGlobalFilter] = useState('');
  const { contracts, pagination, loading, error } = useContracts(filters);

  const handleFilterApply = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  }, []);

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6">
      <AdvancedFilters filters={filters} onApply={handleFilterApply} />
      {loading ? <TableSkeleton /> : error ? <div className="text-red-600 p-4 rounded-lg text-center">Error: {error}</div> : (
        <ContractsTable
          contracts={contracts}
          pagination={pagination}
          onPageChange={handlePageChange}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
      )}
    </motion.div>
  );
};

export default Contracts;