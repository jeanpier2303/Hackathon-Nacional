import json

from app.services.database_service import (
    guardar_analisis_completo
)

contrato_secop = {

    "id_contrato":
    "MC-ALCALDIA-CALI-045-2022",

    "proceso_de_compra":
    "CO1.BDOS.987654",

    "nombre_entidad":
    "ALCALDIA DE SANTIAGO DE CALI",

    "proveedor_adjudicado":
    "TECNOLOGIAS DEL PACIFICO SAS",

    "modalidad_de_contratacion":
    "Mínima Cuantía",

    "descripcion_del_proceso":
    "Adquisición de equipos tecnológicos para oficinas administrativas",

    "valor_del_contrato":
    "185000000",

    "url_proceso":
    "https://community.secop.gov.co/"
}

respuesta_n8n = {

    "contrato_id":
    "MC-ALCALDIA-CALI-045-2022",

    "entidad":
    "ALCALDIA DE SANTIAGO DE CALI",

    "valor_cop":
    185000000,

    "contratista":
    "TECNOLOGIAS DEL PACIFICO SAS",

    "error":
    "Error al parsear respuesta del agente",

    "raw":
    """
{
    "score_riesgo": 78,

    "dictamen_final":
    "RIESGO ALTO",

    "justificacion_dictamen":
    "Se detectaron múltiples alertas asociadas al proceso contractual.",

    "analisis_financiero": {

        "valor_total_cop": 185000000,

        "valor_por_dia": 6166666,

        "evaluacion_precio":
        "POSIBLE SOBRECOSTO",

        "sobrecosto_detectado": true
    },

    "analisis_contratista": {

        "nombre_completo":
        "TECNOLOGIAS DEL PACIFICO SAS",

        "perfil_riesgo":
        "ALTO"
    },

    "analisis_plazo": {

        "alerta_mismo_dia": true,

        "evaluacion_plazo":
        "MUY SOSPECHOSO"
    },

    "analisis_fraccionamiento": {

        "evidencia_fraccionamiento": true
    },

    "cumplimiento_legal": {

        "art_24_transparencia":
        "NO CUMPLE",

        "art_25_economia":
        "CUMPLE PARCIAL",

        "art_26_responsabilidad":
        "NO CUMPLE"
    },

    "banderas_rojas": [

        "Posible fraccionamiento",

        "Sobrecosto detectado",

        "Firma e inicio el mismo día",

        "Único oferente"
    ],

    "violacion_ley": [

        "Art. 24 Ley 80/1993",

        "Art. 25 Ley 80/1993"
    ],

    "recomendaciones": [

        "Revisar estudios previos",

        "Auditar cotizaciones",

        "Verificar pluralidad de oferentes"
    ],

    "resumen_ejecutivo":
    "Contrato con múltiples indicadores de riesgo y posible sobrecosto."
}
"""
}

resultado = guardar_analisis_completo(
    contrato_secop,
    respuesta_n8n
)

print("\n========== RESULTADO ==========")
print(resultado)