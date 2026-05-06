import { api } from './apiClient';

export interface Contract {
  id: string;
  entity: string;
  contractor: string;
  value: number;
  date: string;
  endDate?: string;
  processNumber: string;
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

export interface ContractsFilters {
  processNumber?: string;
  entity?: string;
  contractor?: string;
  contractType?: string;
  startDate?: string;
  endDate?: string;
  minRisk?: number;
  page?: number;
  limit?: number;
}



export const fetchContracts = async (
  filters: ContractsFilters = {}
): Promise<ContractsResponse> => {

  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  return api.get(`/contracts?${queryParams.toString()}`);
};



export const fetchContractById = async (
  id: string
): Promise<Contract> => {

  return api.get(`/contracts/${id}`);
};



export const fetchRedFlagsSummary = async (): Promise<RedFlagsSummary> => {

  return api.get('/summary');
};



export const fetchAlerts = async (): Promise<any[]> => {

  return api.get('/alerts');
};




export interface ChatRequest {
  pregunta: string;
  contrato_id?: string;
  ruta_pdf?: string;
}

export interface ChatResponse {
  pregunta: string;
  respuesta: string;
}



export const sendChatMessage = async (
  data: ChatRequest
): Promise<ChatResponse> => {

  return api.post('/chat', data);
};