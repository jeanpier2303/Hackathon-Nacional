def build_contract_context(
    contrato: dict,
    analisis: dict = None
):

    if not contrato:
        return "No hay información contractual disponible."

    texto = f"""
CONTRATO ENCONTRADO EN LA PLATAFORMA

ID DEL PROCESO:
{contrato.get("contrato_id")}

ENTIDAD CONTRATANTE:
{contrato.get("entidad")}

PROVEEDOR:
{contrato.get("proveedor")}

VALOR DEL CONTRATO:
{contrato.get("valor_contrato")}

MODALIDAD DE CONTRATACIÓN:
{contrato.get("modalidad_contratacion")}

ESTADO DEL CONTRATO:
{contrato.get("estado_contrato")}

OBJETO CONTRACTUAL:
{contrato.get("objeto_contrato")}

DESCRIPCIÓN DEL PROCESO:
{contrato.get("descripcion_proceso")}

ENLACE OFICIAL SECOP II:
{contrato.get("url_proceso")}

IMPORTANTE:
- El enlace SECOP II debe incluirse siempre en la respuesta final
- No omitir la URL del proceso
"""

    if analisis:

        texto += f"""

ANÁLISIS DE RIESGO

PUNTAJE DE RIESGO:
{analisis.get("score_riesgo")}

PERFIL DE RIESGO:
{analisis.get("perfil_riesgo")}

DICTAMEN:
{analisis.get("dictamen_final")}

ALERTAS DETECTADAS:
{analisis.get("banderas_rojas")}

RECOMENDACIONES:
{analisis.get("recomendaciones")}
"""

    return texto.strip()