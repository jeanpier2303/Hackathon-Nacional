import { api } from './apiClient';

// TIPOS

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


// NORMALIZADOR

function normalizeContract(
  item: any
): Contract {

  return {

    id:
      item.contrato_id,

    processNumber:
      item.contrato_id || 'SIN ID',

    entity:
      item.entidad || 'Sin entidad',

    contractor:
      item.proveedor || 'Sin proveedor',

    value:
      Number(item.valor_contrato || 0),

    date:
      item.fecha_firma ||
      new Date().toISOString(),

    endDate:
      item.fecha_fin || '',

    contractType:
      item.modalidad || 'No especificado',

    flags:
      item.banderas_rojas || [],

    riskScore:
      item.score_riesgo || 0
  };
}


// LISTAR CONTRATOS

export const fetchContracts = async (
  filters: any = {}
): Promise<ContractsResponse> => {

  const limit =
    filters.limit || 10;

  const page =
    filters.page || 1;

  const params =
    new URLSearchParams();

  params.append(
    'page',
    String(page)
  );

  params.append(
    'limit',
    String(limit)
  );

  // BUSQUEDA

  if(filters.busqueda){

    params.append(
      'busqueda',
      filters.busqueda
    );
  }

  // RIESGO

  if(filters.riesgo){

    params.append(
      'riesgo',
      filters.riesgo
    );
  }

  // DEPARTAMENTO

  if(filters.departamento){

    params.append(
      'departamento',
      filters.departamento
    );
  }

  // MODALIDAD

  if(filters.modalidad){

    params.append(
      'modalidad',
      filters.modalidad
    );
  }

  // SOBRECOSTO

  if(
    filters.sobrecosto !== undefined &&
    filters.sobrecosto !== ''
  ){

    params.append(
      'sobrecosto',
      filters.sobrecosto
    );
  }

  // FRACCIONAMIENTO

  if(
    filters.fraccionamiento !== undefined &&
    filters.fraccionamiento !== ''
  ){

    params.append(
      'fraccionamiento',
      filters.fraccionamiento
    );
  }

  // ALERTA

  if(
    filters.alerta !== undefined &&
    filters.alerta !== ''
  ){

    params.append(
      'alerta',
      filters.alerta
    );
  }

  const response =
    await api.get(
      `/contracts?${params.toString()}`
    );

  const contracts =
    response.data.map(
      normalizeContract
    );

  return {

    data: contracts,

    pagination: {

      page:
        response.pagination.page,

      limit:
        response.pagination.limit,

      total:
        response.pagination.total,

      totalPages:
        response.pagination.totalPages
    }
  };
};


// DETALLE CONTRATO

export const fetchContractById =
  async (
    id: string
  ): Promise<any> => {

    const response =
      await api.get(
        `/contracts/${encodeURIComponent(id)}`
      );

    const contrato =
      response.contrato;

    const analisis =
      response.analisis_ia;

    return {

      id:
        contrato.contrato_id,

      processNumber:
        contrato.contrato_id,

      entity:
        contrato.entidad,

      contractor:
        contrato.proveedor,

      value:
        Number(
          contrato.valor_contrato || 0
        ),

      date:
        contrato.fecha_firma ||
        new Date().toISOString(),

      endDate:
        contrato.fecha_fin || '',

      contractType:
        contrato.modalidad,

      processUrl:
        contrato.url_proceso ||
        contrato.processUrl ||
        '',

      nitEntidad:
        contrato.nit_entidad || '',

      departamento:
        contrato.departamento || '',

      ciudad:
        contrato.ciudad || '',

      descripcionProceso:
        contrato.descripcion_proceso || '',

      objetoContrato:
        contrato.objeto_contrato || '',

      flags:
        analisis?.banderas_rojas || [],

      riskScore:
        analisis?.score_riesgo || 0,

      resumenEjecutivo:
        analisis?.resumen_ejecutivo || '',

      dictamenFinal:
        analisis?.dictamen_final || '',

      justificacionDictamen:
        analisis?.justificacion_dictamen || '',

      perfilRiesgo:
        analisis?.perfil_riesgo || '',

      evaluacionPrecio:
        analisis?.evaluacion_precio || '',

      evaluacionPlazo:
        analisis?.evaluacion_plazo || '',

      cumplimientoTransparencia:
        analisis?.cumplimiento_transparencia || '',

      cumplimientoEconomia:
        analisis?.cumplimiento_economia || '',

      cumplimientoResponsabilidad:
        analisis?.cumplimiento_responsabilidad || '',

      alertaMismoDia:
        analisis?.alerta_mismo_dia || false,

      sobrecostoDetectado:
        analisis?.sobrecosto_detectado || false,

      evidenciaFraccionamiento:
        analisis?.evidencia_fraccionamiento || false,

      recomendaciones:
        analisis?.recomendaciones || [],

      violacionesLey:
        analisis?.violaciones_ley || [],

      analisisFinanciero:
        analisis?.analisis_financiero || {},

      analisisContratista:
        analisis?.analisis_contratista || {},

      analisisTransparencia:
        analisis?.analisis_transparencia || {},

      analisisPlazo:
        analisis?.analisis_plazo || {},

      analisisFraccionamiento:
        analisis?.analisis_fraccionamiento || {},

      cumplimientoLegal:
        analisis?.cumplimiento_legal || {},

      raw:
        contrato
    };
};

export const analizarContrato = async (contratoId: string): Promise<any> => {

  return await api.post(
    `/analizar-y-guardar/${encodeURIComponent(contratoId)}`,
    {}
  );
};


// DASHBOARD
export const fetchRedFlagsSummary =
  async (): Promise<RedFlagsSummary> => {

    const response =
      await fetchContracts({
        limit:1000
      });

    const contracts =
      response.data;

    const totalContracts =
      contracts.length;

    const totalRedFlags =
      contracts.reduce(
        (acc:number, c:Contract)=>
          acc + c.flags.length,
        0
      );

    const avgRiskScore =
      totalContracts
        ? Math.round(

            contracts.reduce(
              (
                acc:number,
                c:Contract
              )=>
                acc + c.riskScore,
              0
            ) / totalContracts

          )
        : 0;

    const highRiskCount =
      contracts.filter(
        (c:Contract)=>
          c.riskScore >= 70
      ).length;

    // DISTRIBUCION REAL

    const flagsDistribution:
      Record<string, number> = {};

    contracts.forEach(
      (contract:Contract)=>{

        contract.flags.forEach(
          (flag:string)=>{

            flagsDistribution[flag] =
              (flagsDistribution[flag] || 0) + 1;
          }
        );
      }
    );

    return {

      totalContracts,

      totalRedFlags,

      avgRiskScore,

      highRiskCount,

      flagsDistribution
    };
};


// CHAT IA

export interface ChatMessageRequest{
  pregunta:string;
  sesion_id?:number;
  contrato_id?:string|null;
  ruta_pdf?:string|null;
}

export interface ChatMessageResponse{
  pregunta:string;
  respuesta:string;
}

export const sendChatMessage=async(
  data:ChatMessageRequest
):Promise<ChatMessageResponse>=>{

  return await api.post(
    '/chat',
    data
  );
};

export const uploadPdf = async (
  file: File
): Promise<{ ruta_pdf: string }> => {

  const formData = new FormData();

  formData.append(
    'file',
    file
  );

  const response = await fetch(
    'http://127.0.0.1:8000/chat/upload-pdf',
    {
      method:'POST',
      body:formData
    }
  );

  return await response.json();
};

export interface ChatSession{
  id:number;
  titulo:string;
  fecha:string;
}

export interface ChatMessage{
  role:string;
  content:string;
  fecha:string;
}
// chat de sesionespecifica
export const createChatSession=async()=>{

  return await api.post(
    '/chat/session',
    {}
  );
};
// listar sesiones de chat
export const getChatSessions=async():
Promise<ChatSession[]>=>{

  return await api.get(
    '/chat/sessions'
  );
};
// listar mensajes de una sesion de chat
export const getChatMessages=async(
  sesionId:number
):Promise<ChatMessage[]>=>{

  return await api.get(
    `/chat/messages/${sesionId}`
  );
};


