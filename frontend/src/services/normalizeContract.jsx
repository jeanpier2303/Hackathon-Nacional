// src/services/normalizeContract.js
function excelDateToJSDate(serial) {
  if (!serial || typeof serial !== 'number') return new Date().toISOString().split('T')[0];
  const utc_days = Math.floor(serial - 25569);
  const date = new Date(utc_days * 86400000);
  return date.toISOString().split('T')[0];
}

function calculateRiskScore(raw) {
  let score = 0;
  const valor = raw.valor_del_contrato || 0;
  if (valor > 100000000) score += 40;
  else if (valor > 50000000) score += 20;
  if (raw.modalidad_de_contratacion === 'Contratación directa') score += 30;
  if (raw.modalidad_de_contratacion === 'Mínima cuantía') score += 10;
  if (raw.estado_contrato === 'En ejecución') score += 5;
  return Math.min(100, score + Math.floor(Math.random() * 15));
}

function detectFlags(raw) {
  const flags = [];
  if (raw.modalidad_de_contratacion === 'Contratación directa') flags.push('unique_bidder');
  if ((raw.valor_del_contrato || 0) > 200000000) flags.push('overcost');
  if (raw.tipo_de_contrato === 'Prestación de servicios' && (raw.valor_del_contrato || 0) > 50000000) flags.push('unusual_deadline');
  return flags;
}

export function normalizeContract(raw, index) {
  if (!raw) return null;
  return {
    id: raw.id_contrato || `contract-${index}`,
    processNumber: raw.proceso_de_compra || `PROC-${index}`,
    entity: raw.nombre_entidad || 'Entidad sin nombre',
    contractor: raw.proveedor_adjudicado || 'Contratista genérico',
    value: raw.valor_del_contrato || 0,
    date: excelDateToJSDate(raw.fecha_de_firma),
    endDate: raw.fecha_fin_liquidacion ? raw.fecha_fin_liquidacion.split('T')[0] : '',
    contractType: raw.tipo_de_contrato || 'No especificado',
    flags: detectFlags(raw),
    riskScore: calculateRiskScore(raw),
  };
}

export function normalizeContracts(rawData) {
  if (!Array.isArray(rawData)) return [];
  return rawData.map((raw, idx) => normalizeContract(raw, idx)).filter(c => c !== null);
}