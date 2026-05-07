// Datos de ejemplo para modo mock
const entidades = [
  "Alcaldía de Medellín", "Gobernación de Antioquia", "Ministerio de Educación",
  "Alcaldía de Bogotá", "EPS Sanitas", "Alcaldía de Cali", "Ministerio de Transporte",
  "Alcaldía de Barranquilla", "Gobernación de Cundinamarca", "Universidad Nacional"
];
const contratistas = [
  "Constructora XYZ", "Consultores SAS", "TecnoSoluciones", "SaludTotal",
  "Ingeniería JP", "Vías y Puentes", "EMERMEDICA SA", "JAISSA TORRES",
  "SERVIENTREGA SA", "MAPFRE SEGUROS"
];
const tiposContrato = ["Prestación de servicios", "Obra pública", "Consultoría", "Suministros", "Seguros"];
const modalidades = ["Mínima cuantía", "Contratación directa", "Selección Abreviada", "Licitación Pública"];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
  // convert to Excel serial number (approximate)
  const excelEpoch = new Date(1899, 11, 30);
  const diffDays = Math.floor((date - excelEpoch) / (1000 * 60 * 60 * 24));
  return diffDays;
}

export const generateMockContracts = (count = 50) => {
  const contracts = [];
  for (let i = 0; i < count; i++) {
    const fechaFirma = randomDate(new Date(2022, 0, 1), new Date(2024, 11, 31));
    const valor = Math.floor(Math.random() * 500000000) + 10000000;
    const modalidad = modalidades[Math.floor(Math.random() * modalidades.length)];
    const tipo = tiposContrato[Math.floor(Math.random() * tiposContrato.length)];
    contracts.push({
      __EMPTY: i,
      nombre_entidad: entidades[Math.floor(Math.random() * entidades.length)],
      nit_entidad: String(Math.floor(Math.random() * 900000000) + 100000000),
      proceso_de_compra: `CO1.BDOS.${Math.floor(Math.random() * 9000000) + 1000000}`,
      id_contrato: `CO1.PCCNTR.${Math.floor(Math.random() * 9000000) + 1000000}`,
      referencia_del_contrato: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 30) + 2020}`,
      estado_contrato: Math.random() > 0.3 ? "En ejecución" : "Liquidado",
      tipo_de_contrato: tipo,
      modalidad_de_contratacion: modalidad,
      fecha_de_firma: formatDate(fechaFirma),
      tipodocproveedor: Math.random() > 0.5 ? "NIT" : "Cédula de Ciudadanía",
      documento_proveedor: String(Math.floor(Math.random() * 900000000) + 100000000),
      proveedor_adjudicado: contratistas[Math.floor(Math.random() * contratistas.length)],
      valor_del_contrato: valor,
      codigo_entidad: String(Math.floor(Math.random() * 900000000) + 100000000),
      fecha_inicio_liquidacion: "",
      fecha_fin_liquidacion: "",
      codigo_proveedor: String(Math.floor(Math.random() * 900000000) + 100000000),
    });
  }
  return contracts;
};

// Exportar un conjunto fijo para que siempre sean los mismos (útil para pruebas)
export const mockContractsRaw = generateMockContracts(50);