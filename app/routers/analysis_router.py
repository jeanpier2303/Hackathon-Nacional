from fastapi import APIRouter, HTTPException

from app.services.secop_service import (
    get_contracts
)

from app.services.ai_service import (
    analizar_contrato
)

from app.services.n8n_service import (
    analizar_contrato_n8n
)

from app.services.database_service import (
    guardar_analisis_completo
)

router = APIRouter()


@router.get("/analyze")
def analyze(limit: int = 5):

    try:

        contracts = get_contracts(limit)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    results = []

    for c in contracts:

        analysis = analizar_contrato(c)

        results.append({

            "contrato": c,

            "analisis": analysis
        })

    return results


@router.post("/analizar-y-guardar/{contrato_id}")
def analizar_y_guardar(
    contrato_id: str
):

    try:

        contratos = get_contracts(100)

        contrato_encontrado = None

        for contrato in contratos:

            if (
                contrato.get("id_contrato")
                == contrato_id
            ):

                contrato_encontrado = contrato
                break

        if not contrato_encontrado:

            raise HTTPException(
                status_code=404,
                detail="Contrato no encontrado"
            )

        respuesta_n8n = (
            analizar_contrato_n8n(
                contrato_id
            )
        )

        resultado_guardado = (
            guardar_analisis_completo(
                contrato_encontrado,
                respuesta_n8n
            )
        )

        return {

            "success": True,

            "contrato": contrato_id,

            "n8n": respuesta_n8n,

            "mysql": resultado_guardado
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )