import json
import re

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

        # DETECTAR AUTOMÁTICAMENTE ID SECOP
        if not contexto:

            match = re.search(
                r"CO1\.PCCNTR\.\d+",
                pregunta,
                re.IGNORECASE
            )

            if match:

                contrato_id = match.group()

                print("\n========== ID DETECTADO ==========")
                print(contrato_id)

                contexto = construir_contexto_desde_api(
                    contrato_id
                )

        # CHAT NORMAL
        if not contexto:

            prompt = f"""
Eres GobIA Auditor.

Un asistente inteligente especializado en:

- contratación pública en Colombia
- SECOP II
- auditoría contractual
- análisis documental
- análisis de proveedores
- análisis de contratos públicos

OBJETIVO:
Mantener conversaciones naturales orientadas
al análisis de contratación pública.

REGLAS:
- Responde en español
- Sé natural y conversacional
- Sé breve pero útil
- Si el usuario quiere analizar un contrato,
  pídele el ID del contrato SECOP
- NO inventes datos
- NO respondas en JSON
- Habla con claridad y seguridad

USUARIO:
{pregunta}

RESPUESTA:
"""

            respuesta = _post_llm_text(prompt)

            print("\n========== RESPUESTA IA ==========")
            print(respuesta)

            return respuesta

        # ANÁLISIS DEL CONTRATO
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

Asistente especializado en análisis documental
de contratos públicos y procesos SECOP II.

Tu tarea es responder usando únicamente
la información entregada en el contexto.

REGLAS:
- Usa SOLO la información del contexto
- NO inventes datos
- Responde en lenguaje natural
- Sé profesional
- Sé claro y preciso
- Explica el contrato de forma resumida
- Incluye nivel de riesgo
- Incluye alertas detectadas
- Incluye URL del proceso si existe
- NO respondas en JSON
- NO rechaces responder
- NO hables sobre políticas
- NO digas que no puedes ayudar

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