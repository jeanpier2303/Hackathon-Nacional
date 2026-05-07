from fastapi import (
    APIRouter,
    HTTPException
)

from pydantic import BaseModel

from typing import Optional

import os

from app.services.chat_service import (
    construir_contexto_desde_pdf,
    construir_contexto_desde_api,
    generar_respuesta_chat
)

router = APIRouter()


class ChatRequest(BaseModel):

    pregunta: str

    contrato_id: Optional[str] = None

    ruta_pdf: Optional[str] = None


@router.post("/chat")
def chat(data: ChatRequest):

    contexto = None

    if (
        data.ruta_pdf
        and data.ruta_pdf != "string"
    ):

        if not os.path.exists(
            data.ruta_pdf
        ):

            raise HTTPException(
                status_code=400,
                detail="Archivo no existe"
            )

        contexto = (
            construir_contexto_desde_pdf(
                data.ruta_pdf
            )
        )

    elif data.contrato_id:

        contexto = (
            construir_contexto_desde_api(
                data.contrato_id
            )
        )

        if not contexto:

            raise HTTPException(
                status_code=404,
                detail="No se encontró el contrato"
            )

    respuesta = (
        generar_respuesta_chat(
            data.pregunta,
            contexto
        )
    )

    return {

        "pregunta":
            data.pregunta,

        "respuesta":
            respuesta
    }