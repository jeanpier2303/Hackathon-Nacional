from fastapi import APIRouter, HTTPException

from app.database.connection import (
    SessionLocal
)

from app.models.contract_model import (
    Contrato
)

from app.models.analysis_model import (
    AnalisisIA
)

router = APIRouter()


@router.get("/contracts")
def listar_contratos(page: int = 1, limit: int = 10):
    
    db = SessionLocal()
    try:
        offset = (page - 1) * limit

        query = db.query(Contrato)

        total = query.count()

        contratos = (
            query
            .order_by(Contrato.id.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        resultado = []
        for c in contratos:
            analisis = (
                db.query(AnalisisIA)
                .filter(
                    AnalisisIA.contrato_id
                    == c.contrato_id
                )
                .first()
            )
            resultado.append({

                "contrato_id":
                    c.contrato_id,

                "entidad":
                    c.entidad,

                "proveedor":
                    c.proveedor,

                "valor_contrato":
                    c.valor_contrato,

                "modalidad":
                    c.modalidad_contratacion,

                "fecha_firma":
                    c.fecha_firma,

                "fecha_fin":
                    c.fecha_fin,

                "url_proceso":
                    c.url_proceso,

                "score_riesgo":
                    analisis.score_riesgo
                    if analisis else 0,

                "banderas_rojas":
                    analisis.banderas_rojas
                    if analisis else [],

                "analizado":
                    True if analisis else False
            })

        return {
                "data": resultado,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total": total,
                    "totalPages": (total + limit - 1) // limit
                }
            }

    finally:

        db.close()


@router.get("/contracts/{contrato_id}")
def obtener_contrato(
    contrato_id: str
):

    db = SessionLocal()

    try:

        contrato = (
            db.query(Contrato)
            .filter(
                Contrato.contrato_id
                == contrato_id
            )
            .first()
        )

        if not contrato:

            raise HTTPException(
                status_code=404,
                detail="Contrato no encontrado"
            )

        analisis = (
            db.query(AnalisisIA)
            .filter(
                AnalisisIA.contrato_id
                == contrato_id
            )
            .first()
        )
        print("URL BACKEND:", contrato.url_proceso)

        return {

                "contrato": {

        "contrato_id":
            contrato.contrato_id,

        "entidad":
            contrato.entidad,

        "proveedor":
            contrato.proveedor,

        "valor_contrato":
            contrato.valor_contrato,

        "modalidad":
            contrato.modalidad_contratacion,

        "fecha_firma":
            contrato.fecha_firma,

        "fecha_inicio":
            contrato.fecha_inicio,

        "fecha_fin":
            contrato.fecha_fin,

        "url_proceso":
            contrato.url_proceso,

        "nit_entidad":
            contrato.nit_entidad,

        "departamento":
            contrato.departamento,

        "ciudad":
            contrato.ciudad,

        "descripcion_proceso":
            contrato.descripcion_proceso,

        "objeto_contrato":
            contrato.objeto_contrato,

        "estado_contrato":
            contrato.estado_contrato,

        "documento_proveedor":
            contrato.documento_proveedor,

        "tipo_contrato":
            contrato.tipo_contrato,

        "valor_pagado":
            contrato.valor_pagado,

        "valor_pendiente":
            contrato.valor_pendiente
    },

            "analisis_ia": {

                "score_riesgo":
                    analisis.score_riesgo
                    if analisis else 0,

                "banderas_rojas":
                    analisis.banderas_rojas
                    if analisis else [],

                "dictamen_final":
                    analisis.dictamen_final
                    if analisis else "",

                "resumen_ejecutivo":
                    analisis.resumen_ejecutivo
                    if analisis else "",

                "justificacion_dictamen":
                    analisis.justificacion_dictamen
                    if analisis else "",

                "perfil_riesgo":
                    analisis.perfil_riesgo
                    if analisis else "",

                "evaluacion_precio":
                    analisis.evaluacion_precio
                    if analisis else "",

                "evaluacion_plazo":
                    analisis.evaluacion_plazo
                    if analisis else "",

                "cumplimiento_transparencia":
                    analisis.cumplimiento_transparencia
                    if analisis else "",

                "cumplimiento_economia":
                    analisis.cumplimiento_economia
                    if analisis else "",

                "cumplimiento_responsabilidad":
                    analisis.cumplimiento_responsabilidad
                    if analisis else "",

                "alerta_mismo_dia":
                    analisis.alerta_mismo_dia
                    if analisis else False,

                "sobrecosto_detectado":
                    analisis.sobrecosto_detectado
                    if analisis else False,

                "evidencia_fraccionamiento":
                    analisis.evidencia_fraccionamiento
                    if analisis else False,

                "violaciones_ley":
                    analisis.violaciones_ley
                    if analisis else [],

                "recomendaciones":
                    analisis.recomendaciones
                    if analisis else [],

                "analisis_financiero":
                    analisis.analisis_financiero
                    if analisis else {},

                "analisis_contratista":
                    analisis.analisis_contratista
                    if analisis else {},

                "analisis_transparencia":
                    analisis.analisis_transparencia
                    if analisis else {},

                "analisis_plazo":
                    analisis.analisis_plazo
                    if analisis else {},

                "analisis_fraccionamiento":
                    analisis.analisis_fraccionamiento
                    if analisis else {},

                "cumplimiento_legal":
                    analisis.cumplimiento_legal
                    if analisis else {}
            }
        }

    finally:

        db.close()