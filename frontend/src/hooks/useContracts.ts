/* import { useState, useEffect, useCallback } from 'react';

import {
  fetchContracts,
  fetchRedFlagsSummary
} from '../services/api';

import type {
  ContractsResponse,
  RedFlagsSummary
} from '../services/api';

export const useContracts = (filters: any = {}) => {

  const [contractsData, setContractsData] =
    useState<ContractsResponse | null>(null);

  const [summary, setSummary] =
    useState<RedFlagsSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadData = useCallback(async () => {

    try {

      setLoading(true);

      setError(null);

      const contractsRes =
        await fetchContracts(filters);

      setContractsData(contractsRes);

      // SOLO cargar resumen si NO estamos cargando 1000 contratos
      if (filters.limit !== 1000) {

        const summaryData =
          await fetchRedFlagsSummary();

        setSummary(summaryData);
      }

    } catch (err: any) {

      setError(
        err.message ||
        'Error al cargar los datos'
      );

    } finally {

      setLoading(false);
    }

  }, [filters.page, filters.limit]);

  useEffect(() => {

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

    refetch: loadData,
  };
}; */

import { useState, useEffect, useCallback } from 'react';
import { fetchContracts, fetchRedFlagsSummary } from '../services/api';
import type { ContractsResponse, RedFlagsSummary, Contract } from '../services/api';

// ========== DATOS DE PRUEBA (MOCK) ==========
const mockContracts: Contract[] = [
  {
    id: 'mock-1',
    processNumber: 'CM-DTAM NACION-IP No. 035-2019',
    entity: 'Alcaldía de Medellín',
    contractor: 'Constructora XYZ SAS',
    value: 125000000,
    date: '2024-01-15',
    endDate: '2025-01-15',
    contractType: 'Obra pública',
    flags: ['overcost', 'unique_bidder'],
    riskScore: 85,
  },
  {
    id: 'mock-2',
    processNumber: 'CO1.PCCNTR.1234567',
    entity: 'Gobernación de Antioquia',
    contractor: 'Consultores SAS',
    value: 45000000,
    date: '2024-02-10',
    endDate: '2024-08-10',
    contractType: 'Consultoría',
    flags: ['unusual_deadline'],
    riskScore: 65,
  },
  {
    id: 'mock-3',
    processNumber: 'LIC-PUB-2024-089',
    entity: 'Ministerio de Educación',
    contractor: 'TecnoSoluciones',
    value: 280000000,
    date: '2024-03-05',
    endDate: '2026-03-05',
    contractType: 'Suministros',
    flags: ['tailor_made_clause'],
    riskScore: 72,
  },
  {
    id: 'mock-4',
    processNumber: 'CON-2024-0012',
    entity: 'EPS Sanitas',
    contractor: 'SaludTotal',
    value: 98000000,
    date: '2024-01-20',
    endDate: '2024-12-20',
    contractType: 'Prestación de servicios',
    flags: ['overcost'],
    riskScore: 55,
  },
  {
    id: 'mock-5',
    processNumber: 'MC-2024-045',
    entity: 'Alcaldía de Bogotá',
    contractor: 'Ingeniería JP',
    value: 187000000,
    date: '2024-03-15',
    endDate: '2025-03-15',
    contractType: 'Obra pública',
    flags: [],
    riskScore: 28,
  },
  {
    id: 'mock-6',
    processNumber: 'SECOP-II-2024-987',
    entity: 'Ministerio de Transporte',
    contractor: 'Vías y Puentes',
    value: 520000000,
    date: '2024-02-28',
    endDate: '2026-02-28',
    contractType: 'Obra pública',
    flags: ['unique_bidder', 'overcost'],
    riskScore: 92,
  },
];

const mockSummary: RedFlagsSummary = {
  totalContracts: mockContracts.length,
  totalRedFlags: mockContracts.reduce((acc, c) => acc + c.flags.length, 0),
  avgRiskScore: Math.round(mockContracts.reduce((acc, c) => acc + c.riskScore, 0) / mockContracts.length),
  highRiskCount: mockContracts.filter(c => c.riskScore >= 70).length,
  flagsDistribution: {
    overcost: mockContracts.filter(c => c.flags.includes('overcost')).length,
    unique_bidder: mockContracts.filter(c => c.flags.includes('unique_bidder')).length,
    unusual_deadline: mockContracts.filter(c => c.flags.includes('unusual_deadline')).length,
    tailor_made_clause: mockContracts.filter(c => c.flags.includes('tailor_made_clause')).length,
  },
};

// Función para paginar los datos mock
const getMockData = (page: number, limit: number): ContractsResponse => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = mockContracts.slice(start, end);
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: mockContracts.length,
      totalPages: Math.ceil(mockContracts.length / limit),
    },
  };
};

export const useContracts = (filters: any = {}) => {
  const [contractsData, setContractsData] = useState<ContractsResponse | null>(null);
  const [summary, setSummary] = useState<RedFlagsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(true);

  // Cargar datos iniciales con mock inmediato
  useEffect(() => {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const mockResponse = getMockData(page, limit);
    setContractsData(mockResponse);
    setSummary(mockSummary);
    setLoading(false);
    setUsingMock(true);
  }, [filters.page, filters.limit]);

  // Luego, intentar obtener datos reales en segundo plano (si el backend está disponible)
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const realContracts = await fetchContracts(filters);
        if (realContracts.data && realContracts.data.length > 0) {
          setContractsData(realContracts);
          if (filters.limit !== 1000) {
            const realSummary = await fetchRedFlagsSummary();
            setSummary(realSummary);
          }
          setUsingMock(false);
        }
      } catch (err) {
        console.warn('No se pudieron cargar datos reales, se mantienen los datos de prueba');
      }
    };
    fetchRealData();
  }, [filters.page, filters.limit]);

  return {
    contracts: contractsData?.data || [],
    pagination: contractsData?.pagination,
    summary,
    loading,
    error,
    usingMock,
  };
};