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