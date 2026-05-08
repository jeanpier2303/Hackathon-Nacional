from app.services.llm.openrouter_client import json_completion
from app.core.prompts import CONTRACT_ANALYSIS_PROMPT


def normalizar_analisis(obj):

    riesgo = obj.get("riesgo", 50)

    try:
        riesgo = int(riesgo)
    except:
        riesgo = 50

    riesgo = max(0, min(100, riesgo))

    alertas = obj.get("alertas", [])

    if not isinstance(alertas, list):
        alertas = ["Formato inválido"]

    nivel = obj.get("nivel", "MEDIO")

    dictamen = (
        f"El contrato presenta un nivel de riesgo {nivel.lower()} "
        f"según las condiciones contractuales analizadas."
    )

    recomendaciones = [
        "Validar trazabilidad contractual.",
        "Revisar soportes técnicos y financieros.",
        "Verificar cumplimiento de obligaciones contractuales."
    ]

    return {
        "score_riesgo": riesgo,
        "perfil_riesgo": nivel,
        "dictamen_final": dictamen,
        "banderas_rojas": alertas[:5],
        "recomendaciones": recomendaciones
    }


def analizar_contrato(contrato:dict):

    messages=[
        {
            "role":"system",
            "content":CONTRACT_ANALYSIS_PROMPT
        },
        {
            "role":"user",
            "content":f"""
Analiza este contrato:

Entidad: {contrato.get("entidad")}
Proveedor: {contrato.get("proveedor")}
Valor: {contrato.get("valor_contrato")}
Modalidad: {contrato.get("modalidad_contratacion")}
Objeto: {contrato.get("objeto_contrato")}
Descripción: {contrato.get("descripcion_proceso")}
"""
        }
    ]

    try:

        response=json_completion(messages)

        return normalizar_analisis(response)

    except Exception as e:

        return {
            "score_riesgo": 50,
            "perfil_riesgo": "MEDIO",
            "dictamen_final": "No fue posible generar el análisis del contrato.",
            "banderas_rojas": [
                "No fue posible analizar el contrato"
            ],
            "recomendaciones": [
                "Revisar manualmente la información contractual en la parte de contractos de la página."
            ],
            "debug": str(e)
        }