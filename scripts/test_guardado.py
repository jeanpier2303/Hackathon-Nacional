import json

from app.services.database_service import (
    guardar_analisis_completo
)


contrato_secop = {

    "id_contrato": "CD-DTAM NACION-CPS No. 001-2019",

    "proceso_de_compra": "CO1.BDOS.123456",

    "nombre_entidad":
    "PARQUES NACIONALES NATURALES DE COLOMBIA - DIRECCION TERRITORIAL AMAZONIA",

    "proveedor_adjudicado":
    "LEIZA LANK",

    "modalidad_de_contratacion":
    "Contratación Directa",

    "descripcion_del_proceso":
    "Prestación de servicios jurídicos especializados",

    "valor_del_contrato":
    "5240183",

    "url_proceso":
    "https://community.secop.gov.co/",

}


respuesta_n8n = {

    "contrato_id":
    "CD-DTAM NACION-CPS No. 001-2019",

    "entidad":
    "PARQUES NACIONALES NATURALES DE COLOMBIA - DIRECCION TERRITORIAL AMAZONIA",

    "valor_cop":
    5240183,

    "contratista":
    "LEIZA LANK",

    "error":
    "Error al parsear respuesta del agente",

    "raw":
    """
{
    "score_riesgo": 20,

    "dictamen_final": "APROBADO",

    "justificacion_dictamen":
    "El contrato cumple con requisitos legales.",

    "analisis_financiero": {

        "valor_total_cop": 5240183,

        "valor_por_dia": 174672,

        "evaluacion_precio":
        "JUSTO",

        "sobrecosto_detectado": false
    },

    "analisis_contratista": {

        "nombre_completo":
        "LEIZA FERNANDA LANK MANRIQUE",

        "perfil_riesgo":
        "BAJO-MEDIO"
    },

    "analisis_plazo": {

        "alerta_mismo_dia": true,

        "evaluacion_plazo":
        "SOSPECHOSO"
    },

    "analisis_fraccionamiento": {

        "evidencia_fraccionamiento": false
    },

    "cumplimiento_legal": {

        "art_24_transparencia":
        "CUMPLE PARCIAL",

        "art_25_economia":
        "CUMPLE",

        "art_26_responsabilidad":
        "CUMPLE"
    },

    "banderas_rojas": [

        "Firma e inicio el mismo día",

        "Contratación directa"
    ],

    "violacion_ley": [

        "Art. 24 Ley 80/1993"
    ],

    "recomendaciones": [

        "Verificar hoja de vida",

        "Revisar estudio previo"
    ],

    "resumen_ejecutivo":
    "Contrato con riesgo bajo."
}
"""
}


resultado = guardar_analisis_completo(
    contrato_secop,
    respuesta_n8n
)

print("\n========== RESULTADO ==========")
print(resultado)