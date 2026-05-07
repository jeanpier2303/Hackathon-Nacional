from fastapi import (
    APIRouter,
    HTTPException
)

from pydantic import BaseModel

import os

from app.services.ai_service import (
    analizar_texto
)

from app.services.pdf_service import (
    extraer_texto_pdf,
    extraer_datos_inteligentes
)

router = APIRouter()


class PDFRequest(BaseModel):

    ruta: str


@router.post("/analyze-pdf")
def analyze_pdf(
    data: PDFRequest
):

    if not os.path.exists(
        data.ruta
    ):

        raise HTTPException(
            status_code=400,
            detail="Archivo no existe"
        )

    texto = extraer_texto_pdf(
        data.ruta
    )

    if not texto.strip():

        raise HTTPException(
            status_code=400,
            detail="No se pudo extraer texto del PDF"
        )

    datos = (
        extraer_datos_inteligentes(
            texto
        )
    )

    analysis = analizar_texto(
        texto
    )

    return {

        "archivo":
            data.ruta,

        "datos_extraidos":
            datos,

        "analisis":
            analysis
    }