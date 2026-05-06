import json

from app.services.ai_service import (
    _post_llm_text,
    analizar_contrato
)

from app.services.pdf_service import (
    extraer_texto_pdf,
    extraer_datos_inteligentes
)

from app.services.secop_service import get_contracts


def construir_contexto_desde_pdf(ruta):

    texto = extraer_texto_pdf(ruta)
    datos = extraer_datos_inteligentes(texto)

    return {
        "tipo": "pdf",
        "datos": datos,
        "texto": texto[:4000]
    }


def construir_contexto_desde_api(contrato_id):

    contratos = get_contracts(100)

    for c in contratos:

        print("CONTRATO ENCONTRADO:")
        print(c)

        if c.get("id_contrato") == contrato_id:

            return {
                "tipo": "api",
                "datos": c
            }

    return None


def generar_respuesta_chat(pregunta, contexto=None):

    try:

        if not contexto:

            prompt = f"""
Eres GobIA Auditor.

Un asistente inteligente especializado en:

- contratación pública en Colombia
- SECOP II
- riesgos de corrupción
- auditoría contractual
- análisis de proveedores
- análisis de contratos públicos

OBJETIVO:
Mantener conversaciones naturales pero siempre orientadas
al análisis de contratación pública.

REGLAS:
- Responde en español
- Sé natural y conversacional
- Sé breve pero útil
- Si el usuario quiere analizar un contrato,
  pídele el ID del contrato SECOP
- NO inventes información
- NO respondas en JSON

USUARIO:
{pregunta}

RESPUESTA:
"""

            respuesta = _post_llm_text(prompt)

            print("\n========== RESPUESTA IA ==========")
            print(respuesta)

            return respuesta

        datos = contexto.get("datos", {})

        analisis = analizar_contrato(datos)

        contexto_reducido = {
            "tipo": contexto.get("tipo"),
            "id_contrato": datos.get("id_contrato"),
            "entidad": datos.get("nombre_entidad"),
            "proveedor": datos.get("proveedor_adjudicado"),
            "valor": datos.get("valor_del_contrato"),
            "modalidad": datos.get("modalidad_de_contratacion"),
            "descripcion": datos.get("descripcion_del_proceso"),
            "url_proceso": datos.get("url_proceso"),
            "riesgo": analisis.get("riesgo"),
            "alertas": analisis.get("alertas")
        }

        print("\n========== CONTEXTO REDUCIDO ==========")
        print(contexto_reducido)

        prompt = f"""
Eres GobIA Auditor.

Asistente experto en contratación pública colombiana
y análisis de riesgos de corrupción en SECOP II.

Tu tarea es analizar contratos y responder preguntas
basadas en el contexto entregado.

REGLAS:
- Usa SOLO la información del contexto
- NO inventes datos
- Si falta información dilo claramente
- Responde en lenguaje natural
- Sé profesional
- Sé claro y preciso
- Incluye el nivel de riesgo
- Incluye alertas detectadas
- Incluye la URL del proceso si existe
- NO respondas en JSON

CONTEXTO:
{json.dumps(contexto_reducido, indent=2, ensure_ascii=False)}

PREGUNTA:
{pregunta}

RESPUESTA:
"""

        respuesta = _post_llm_text(prompt)

        print("\n========== RESPUESTA IA ==========")
        print(respuesta)

        return respuesta

    except Exception as e:

        print("\n========== ERROR CHAT ==========")
        print(str(e))

        return (
            "Lo siento, ocurrió un error procesando "
            "la consulta."
        )