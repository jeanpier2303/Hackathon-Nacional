import json

from app.database.connection import SessionLocal

from app.models.contract_model import Contrato
from app.models.analysis_model import AnalisisIA


def guardar_analisis_completo(
    contrato_secop,
    respuesta_n8n
):

    db = SessionLocal()

    try:

        contrato = Contrato(

            contrato_id=contrato_secop.get("id_contrato"),

            proceso_compra=contrato_secop.get(
                "proceso_de_compra"
            ),

            entidad=contrato_secop.get(
                "nombre_entidad"
            ),

            proveedor=contrato_secop.get(
                "proveedor_adjudicado"
            ),

            modalidad_contratacion=contrato_secop.get(
                "modalidad_de_contratacion"
            ),

            descripcion_proceso=contrato_secop.get(
                "descripcion_del_proceso"
            ),

            valor_contrato=int(
                contrato_secop.get(
                    "valor_del_contrato",
                    0
                )
            ),

            url_proceso=contrato_secop.get(
                "url_proceso"
            ),

            datos_secop=contrato_secop
        )

        existe = db.query(Contrato).filter(
            Contrato.contrato_id ==
            contrato.contrato_id
        ).first()

        if not existe:

            db.add(contrato)
            db.commit()

        raw_json = json.loads(
            respuesta_n8n["raw"]
        )

        analisis = AnalisisIA(

            contrato_id=respuesta_n8n.get(
                "contrato_id"
            ),

            score_riesgo=raw_json.get(
                "score_riesgo"
            ),

            dictamen_final=raw_json.get(
                "dictamen_final"
            ),

            justificacion_dictamen=raw_json.get(
                "justificacion_dictamen"
            ),

            resumen_ejecutivo=raw_json.get(
                "resumen_ejecutivo"
            ),

            perfil_riesgo=raw_json.get(
                "analisis_contratista",
                {}
            ).get("perfil_riesgo"),

            evaluacion_precio=raw_json.get(
                "analisis_financiero",
                {}
            ).get("evaluacion_precio"),

            evaluacion_plazo=raw_json.get(
                "analisis_plazo",
                {}
            ).get("evaluacion_plazo"),

            evidencia_fraccionamiento=raw_json.get(
                "analisis_fraccionamiento",
                {}
            ).get("evidencia_fraccionamiento"),

            alerta_mismo_dia=raw_json.get(
                "analisis_plazo",
                {}
            ).get("alerta_mismo_dia"),

            sobrecosto_detectado=raw_json.get(
                "analisis_financiero",
                {}
            ).get("sobrecosto_detectado"),

            cumplimiento_transparencia=raw_json.get(
                "cumplimiento_legal",
                {}
            ).get("art_24_transparencia"),

            cumplimiento_economia=raw_json.get(
                "cumplimiento_legal",
                {}
            ).get("art_25_economia"),

            cumplimiento_responsabilidad=raw_json.get(
                "cumplimiento_legal",
                {}
            ).get("art_26_responsabilidad"),

            banderas_rojas=raw_json.get(
                "banderas_rojas"
            ),

            violaciones_ley=raw_json.get(
                "violacion_ley"
            ),

            recomendaciones=raw_json.get(
                "recomendaciones"
            ),

            analisis_financiero=raw_json.get(
                "analisis_financiero"
            ),

            analisis_contratista=raw_json.get(
                "analisis_contratista"
            ),

            analisis_transparencia=raw_json.get(
                "analisis_transparencia"
            ),

            analisis_plazo=raw_json.get(
                "analisis_plazo"
            ),

            analisis_fraccionamiento=raw_json.get(
                "analisis_fraccionamiento"
            ),

            cumplimiento_legal=raw_json.get(
                "cumplimiento_legal"
            ),

            respuesta_completa=raw_json
        )

        db.add(analisis)

        db.commit()

        return {
            "success": True
        }

    except Exception as e:

        db.rollback()

        return {
            "success": False,
            "error": str(e)
        }

    finally:

        db.close()