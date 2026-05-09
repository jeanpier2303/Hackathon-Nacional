import {
  useState,
  useEffect,
  useCallback
} from 'react';

import {
  fetchContracts,
  fetchRedFlagsSummary
} from '../services/api';

import type {
  ContractsResponse,
  RedFlagsSummary
} from '../services/api';

export const useContracts = (
  filters:any = {}
) => {

  const [
    contractsData,
    setContractsData
  ] = useState<ContractsResponse | null>(null);

  const [
    summary,
    setSummary
  ] = useState<RedFlagsSummary | null>(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState<string | null>(null);

  const loadData =
    useCallback(async()=>{

      try{

        setLoading(true);

        setError(null);

        const contractsRes =
          await fetchContracts(filters);

        setContractsData(
          contractsRes
        );

        if(filters.limit !== 1000){

          const summaryData =
            await fetchRedFlagsSummary();

          setSummary(
            summaryData
          );
        }

      }catch(err:any){

        setError(
          err.message ||
          'Error al cargar contratos'
        );

      }finally{

        setLoading(false);
      }

    }, [
      filters.page,
      filters.limit,
      filters.busqueda,
      filters.riesgo,
      filters.departamento,
      filters.modalidad,
      filters.sobrecosto,
      filters.fraccionamiento,
      filters.alerta
    ]);

  useEffect(()=>{

    loadData();

  }, [loadData]);

  return {

    contracts:
      contractsData?.data || [],

    pagination:
      contractsData?.pagination,

    summary,

    loading,

    error,

    refetch:loadData
  };
};