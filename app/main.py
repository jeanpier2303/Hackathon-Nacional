from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

from app.services.secop_service import get_contracts
from app.services.ai_service import analizar_contrato, analizar_texto
from app.services.pdf_service import extraer_texto_pdf
from app.services.pdf_service import extraer_datos_inteligentes
from fastapi.middleware.cors import CORSMiddleware
from app.routers.import_routes import router as import_router
from app.routers.contracts_router import router as contracts_router
from app.routers.import_routes import router as import_router

# chat service
from app.services.chat_service import (
    construir_contexto_desde_pdf,
    construir_contexto_desde_api,
    generar_respuesta_chat
)

app = FastAPI()

app.include_router(import_router)
app.include_router(contracts_router)
app.include_router(import_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SECOP AI Agent funcionando"}


@app.get("/analyze")
def analyze(limit: int = 5):

    try:
        contracts = get_contracts(limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    results = []

    for c in contracts:
        analysis = analizar_contrato(c)
        results.append({
            "contrato": c,
            "analisis": analysis
        })

    return results



# PDF ANALYSIS 


class PDFRequest(BaseModel):
    ruta: str


@app.post("/analyze-pdf")
def analyze_pdf(data: PDFRequest):

    if not os.path.exists(data.ruta):
        raise HTTPException(status_code=400, detail="Archivo no existe")

    texto = extraer_texto_pdf(data.ruta)

    if not texto.strip():
        raise HTTPException(status_code=400, detail="No se pudo extraer texto del PDF")

    datos = extraer_datos_inteligentes(texto)
    analysis = analizar_texto(texto)

    return {
        "archivo": data.ruta,
        "datos_extraidos": datos,
        "analisis": analysis
    }



# CHAT BOT ENDPOINT


from typing import Optional

class ChatRequest(BaseModel):
    pregunta: str
    contrato_id: Optional[str] = None
    ruta_pdf: Optional[str] = None


@app.post("/chat")
def chat(data: ChatRequest):

    contexto = None

    if data.ruta_pdf and data.ruta_pdf != "string":

        if not os.path.exists(data.ruta_pdf):
            raise HTTPException(
                status_code=400,
                detail="Archivo no existe"
            )

        contexto = construir_contexto_desde_pdf(
            data.ruta_pdf
        )

    elif data.contrato_id:

        contexto = construir_contexto_desde_api(
            data.contrato_id
        )

        if not contexto:
            raise HTTPException(
                status_code=404,
                detail="No se encontró el contrato"
            )

    respuesta = generar_respuesta_chat(
        data.pregunta,
        contexto
    )

    return {
        "pregunta": data.pregunta,
        "respuesta": respuesta
    }