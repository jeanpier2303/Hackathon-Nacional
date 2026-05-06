import { useState, useEffect, useCallback } from 'react';
import { fetchContracts, fetchRedFlagsSummary } from '../services/api';
import type { ContractsFilters, ContractsResponse, RedFlagsSummary } from '../services/api';

export const useContracts = (filters: ContractsFilters = {}) => {
  const [contractsData, setContractsData] = useState<ContractsResponse | null>(null);
  const [summary, setSummary] = useState<RedFlagsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [contractsRes, summaryData] = await Promise.all([
        fetchContracts(filters),
        fetchRedFlagsSummary(),
      ]);
      setContractsData(contractsRes);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    contracts: contractsData?.data || [],
    pagination: contractsData?.pagination,
    summary,
    loading,
    error,
    refetch: loadData,
  };
};