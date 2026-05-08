from fastapi import (
    APIRouter,
    HTTPException
)
from app.repositories.chat_repository import (
    crear_sesion_chat
)
from fastapi import UploadFile, File
import shutil
import uuid

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

    pregunta:str
    contrato_id:Optional[str]=None
    ruta_pdf:Optional[str]=None
    sesion_id:Optional[int]=None

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

    respuesta=generar_respuesta_chat(
        pregunta=data.pregunta,
        contexto=contexto,
        sesion_id=data.sesion_id
    )

    return {

        "pregunta":
            data.pregunta,

        "respuesta":
            respuesta
    }

@router.post("/chat/session")
def crear_chat():

    sesion=crear_sesion_chat()

    return {
        "sesion_id":sesion.id,
        "titulo":sesion.titulo
    }

@router.get("/chat/sessions")
def obtener_chats():

    from app.repositories.chat_repository import (
        listar_sesiones_chat
    )

    sesiones=listar_sesiones_chat()

    return sesiones


@router.get("/chat/messages/{sesion_id}")
def obtener_mensajes(
    sesion_id:int
):

    from app.repositories.chat_repository import (
        obtener_historial_chat
    )

    mensajes=obtener_historial_chat(
        sesion_id
    )

    return mensajes


@router.post("/chat/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...)
):

    if file.content_type != "application/pdf":

        raise HTTPException(
            status_code=400,
            detail="Solo se permiten PDFs"
        )

    os.makedirs(
        "temp_pdfs",
        exist_ok=True
    )

    nombre_archivo = (
        f"{uuid.uuid4()}.pdf"
    )

    ruta_pdf = os.path.join(
        "temp_pdfs",
        nombre_archivo
    )

    with open(
        ruta_pdf,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "ruta_pdf": ruta_pdf
    }