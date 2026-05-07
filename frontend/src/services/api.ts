// src/services/api.ts
import { normalizeContracts } from './normalizeContract';

// =====================================================
// DATOS MOCK (para pruebas, sin depender de API externa)
// =====================================================
const MOCK_CONTRACTS_RAW = Array.from({ length: 50 }, (_, i) => ({
  id_contrato: `mock-${i}`,
  proceso_de_compra: `PROC-MOCK-${1000 + i}`,
  nombre_entidad: ['Alcaldía de Medellín', 'Gobernación de Antioquia', 'Ministerio de Educación', 'Alcaldía de Bogotá', 'EPS Sanitas'][i % 5],
  proveedor_adjudicado: ['Constructora XYZ', 'Consultores SAS', 'TecnoSoluciones', 'SaludTotal', 'Ingeniería JP'][i % 5],
  valor_del_contrato: Math.floor(Math.random() * 500000000) + 10000000,
  fecha_de_firma: 44500 + Math.floor(Math.random() * 800),
  tipo_de_contrato: ['Prestación de servicios', 'Obra pública', 'Consultoría'][i % 3],
  modalidad_de_contratacion: ['Mínima cuantía', 'Contratación directa', 'Selección Abreviada'][i % 3],
  estado_contrato: Math.random() > 0.3 ? 'En ejecución' : 'Liquidado',
  fecha_fin_liquidacion: '',
}));

// =====================================================
// TIPOS
// =====================================================
export interface Contract {
  id: string;
  processNumber: string;
  entity: string;
  contractor: string;
  value: number;
  date: string;
  endDate?: string;
  contractType: string;
  flags: string[];
  riskScore: number;
}

export interface RedFlagsSummary {
  totalContracts: number;
  totalRedFlags: number;
  avgRiskScore: number;
  highRiskCount: number;
  flagsDistribution: Record<string, number>;
}

export interface ContractsResponse {
  data: Contract[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// =====================================================
// FUNCIONES DE CARGA (usando datos mock directamente)
// =====================================================
let cachedContracts: Contract[] | null = null;

function loadMockContracts(): Contract[] {
  if (cachedContracts) return cachedContracts;
  const normalized = normalizeContracts(MOCK_CONTRACTS_RAW);
  cachedContracts = normalized;
  console.log(`📦 Mock: ${normalized.length} contratos cargados`);
  return normalized;
}

function filterAndPaginate(contracts: Contract[], filters: any) {
  let filtered = [...contracts];
  if (filters.processNumber) {
    const search = filters.processNumber.toLowerCase().replace(/\s/g, '');
    filtered = filtered.filter(c =>
      c.processNumber.toLowerCase().replace(/\s/g, '').includes(search)
    );
  }
  if (filters.entity) {
    filtered = filtered.filter(c =>
      c.entity.toLowerCase().includes(filters.entity.toLowerCase())
    );
  }
  if (filters.contractor) {
    filtered = filtered.filter(c =>
      c.contractor.toLowerCase().includes(filters.contractor.toLowerCase())
    );
  }
  if (filters.contractType) {
    filtered = filtered.filter(c =>
      c.contractType.toLowerCase().includes(filters.contractType.toLowerCase())
    );
  }
  if (filters.startDate) {
    filtered = filtered.filter(c => c.date >= filters.startDate);
  }
  if (filters.endDate) {
    filtered = filtered.filter(c => c.date <= filters.endDate);
  }
  if (filters.minRisk) {
    filtered = filtered.filter(c => c.riskScore >= filters.minRisk);
  }
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const start = (page - 1) * limit;
  const paginatedData = filtered.slice(start, start + limit);
  const totalPages = Math.ceil(filtered.length / limit);
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages,
    },
  };
}

export const fetchContracts = async (filters: any = {}): Promise<ContractsResponse> => {
  const allContracts = loadMockContracts();
  return filterAndPaginate(allContracts, filters);
};

export const fetchContractById = async (id: string): Promise<Contract> => {
  const allContracts = loadMockContracts();
  const contract = allContracts.find(c => c.id === id);
  if (!contract) throw new Error('Contrato no encontrado');
  return contract;
};

export const fetchRedFlagsSummary = async (): Promise<RedFlagsSummary> => {
  const allContracts = loadMockContracts();
  const totalContracts = allContracts.length;
  const totalRedFlags = allContracts.reduce((acc, c) => acc + c.flags.length, 0);
  const avgRiskScore = totalContracts ? Math.round(allContracts.reduce((acc, c) => acc + c.riskScore, 0) / totalContracts) : 0;
  const highRiskCount = allContracts.filter(c => c.riskScore >= 70).length;
  const flagsDistribution = {
    unique_bidder: allContracts.filter(c => c.flags.includes('unique_bidder')).length,
    overcost: allContracts.filter(c => c.flags.includes('overcost')).length,
    unusual_deadline: allContracts.filter(c => c.flags.includes('unusual_deadline')).length,
    tailor_made_clause: allContracts.filter(c => c.flags.includes('tailor_made_clause')).length,
  };
  return { totalContracts, totalRedFlags, avgRiskScore, highRiskCount, flagsDistribution };
};

export const sendChatMessage = async (message: string): Promise<{ reply: string }> => {
  await new Promise(r => setTimeout(r, 500));
  return {
    reply: `🤖 [MODO DEMO] Respuesta a: "${message}".\n\nEsto es una simulación del asistente IA. En producción se conectará a un modelo real.`
  };
};
