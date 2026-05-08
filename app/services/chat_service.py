from app.core.prompts import CHAT_SYSTEM_PROMPT
from app.repositories.analysis_repository import (
    obtener_analisis_por_contrato
)
from app.services.memory.title_generator import (
    generar_titulo_chat
)

from app.repositories.chat_repository import (
    actualizar_titulo_chat,
    obtener_sesion
)

from app.services.llm.openrouter_client import text_completion

from app.services.context.contract_context import (
    build_contract_context
)
from app.repositories.chat_repository import (
    guardar_mensaje,
    obtener_historial_chat
)

from app.services.context.pdf_context import (
    build_pdf_context
)

from app.services.pdf_service import (
    extraer_texto_pdf,
    extraer_datos_inteligentes
)
from app.repositories.analysis_repository import (
    obtener_contrato_por_id
)

from app.services.analysis.contract_analysis_service import (
    analizar_contrato
)

from app.services.secop.secop_service import get_contracts

from app.services.context.intent_detector import (
    detectar_contrato_id,
    detectar_intencion
)


def construir_contexto_desde_pdf(ruta:str):

    texto=extraer_texto_pdf(ruta)

    datos=extraer_datos_inteligentes(texto)

    return {
        "tipo":"pdf",
        "datos":datos,
        "texto":texto
    }


from app.repositories.analysis_repository import (
    obtener_contrato_por_id
)


def construir_contexto_desde_api(
    contrato_id:str
):

    contrato=obtener_contrato_por_id(
        contrato_id
    )

    if not contrato:
        return None

    return {
        "tipo":"contrato",
        "datos":{
            "contrato_id":contrato.contrato_id,
            "entidad":contrato.entidad,
            "proveedor":contrato.proveedor,
            "tipo_contrato":contrato.tipo_contrato,
            "modalidad_contratacion":contrato.modalidad_contratacion,
            "estado_contrato":contrato.estado_contrato,
            "valor_contrato":contrato.valor_contrato,
            "departamento":contrato.departamento,
            "ciudad":contrato.ciudad,
            "objeto_contrato":contrato.objeto_contrato,
            "descripcion_proceso":contrato.descripcion_proceso,
            "url_proceso":contrato.url_proceso
        }
    }

def generar_respuesta_chat(
    pregunta:str,
    contexto:dict=None,
    sesion_id:int=None
):

    historial=[]

    if sesion_id:

        historial = obtener_historial_chat(
            sesion_id
        )[-6:]


    contrato_detectado = detectar_contrato_id(
        pregunta
    )

    requiere_contexto = contexto is not None


    if contrato_detectado:

        contexto = construir_contexto_desde_api(
            contrato_detectado
        )

        if contexto:

            requiere_contexto = True


    messages = [
        {
            "role":"system",
            "content":CHAT_SYSTEM_PROMPT
        }
    ]


   
    # CHAT NORMAL
   

    if not requiere_contexto:

        messages.extend(historial)

        messages.append({
            "role":"user",
            "content":pregunta
        })

        respuesta = text_completion(
            messages
        )

        if sesion_id:

            guardar_mensaje(
                sesion_id,
                "user",
                pregunta
            )

            guardar_mensaje(
                sesion_id,
                "assistant",
                respuesta
            )

        return respuesta


   
# CONTEXTO CONTRATO

    if contexto and contexto["tipo"] == "contrato":

        contrato = contexto.get(
            "datos",
            {}
        )

        analisis_db = obtener_analisis_por_contrato(
            contrato.get("contrato_id")
        )

        if analisis_db:

            analisis = {
                "score_riesgo":analisis_db.score_riesgo,
                "perfil_riesgo":analisis_db.perfil_riesgo,
                "dictamen_final":analisis_db.dictamen_final,
                "evaluacion_precio":analisis_db.evaluacion_precio,
                "evaluacion_plazo":analisis_db.evaluacion_plazo,
                "resumen_ejecutivo":analisis_db.resumen_ejecutivo,
                "justificacion_dictamen":analisis_db.justificacion_dictamen,
                "banderas_rojas":analisis_db.banderas_rojas,
                "recomendaciones":analisis_db.recomendaciones
            }

        else:

            try:

                analisis = analizar_contrato(
                    contrato
                )

            except Exception:

                analisis = {
                    "score_riesgo":0,
                    "perfil_riesgo":"NO DISPONIBLE",
                    "dictamen_final":"No fue posible generar análisis.",
                    "banderas_rojas":[],
                    "recomendaciones":[]
                }

        contexto_texto = build_contract_context(
            contrato,
            analisis
        )

        messages.append({
            "role":"system",
            "content":contexto_texto
        })

        messages.append({
            "role":"system",
            "content":"""
    Responde como auditor contractual profesional.

    Incluye:
    - riesgo general
    - alertas relevantes
    - proveedor
    - enlace SECOP II si existe

    No inventes datos.
    """
        })


    # CONTEXTO PDF

    elif contexto and contexto["tipo"] == "pdf":

        contexto_texto = build_pdf_context(
            contexto.get("datos", {}),
            contexto.get("texto", "")
        )

        messages.append({
            "role":"system",
            "content":"""
    El usuario cargó un PDF relacionado con contratación pública.

    Debes analizar el contenido del documento y detectar:

    - riesgos contractuales
    - alertas jurídicas
    - posibles irregularidades
    - hallazgos relevantes
    - riesgos financieros

    Usa únicamente el contenido del PDF.

    No solicites nuevamente IDs de contrato.
    No sugieras buscar contratos.
    Responde como auditor profesional colombiano.
    """
        })

        messages.append({
            "role":"system",
            "content":contexto_texto
        })


    messages.extend(historial)

    messages.append({
        "role":"user",
        "content":pregunta
    })

    respuesta = text_completion(
        messages
    )
    


    if sesion_id:

        guardar_mensaje(
            sesion_id,
            "user",
            pregunta
        )

        guardar_mensaje(
            sesion_id,
            "assistant",
            respuesta
        )

        sesion = obtener_sesion(
            sesion_id
        )

        if sesion and (
            not sesion.titulo
            or sesion.titulo == "Nuevo chat"
        ):

            titulo = generar_titulo_chat(
                pregunta
            )

            actualizar_titulo_chat(
                sesion_id,
                titulo
            )

    return respuesta