import requests
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def _post_llm_json(prompt: str):
    if not OPENROUTER_API_KEY:
        raise ValueError("Falta OPENROUTER_API_KEY en .env")

    resp = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta-llama/llama-3-8b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
            "response_format": {"type": "json_object"}
        },
        timeout=30
    )

    resp.raise_for_status()
    data = resp.json()

    if "choices" not in data or not data["choices"]:
        raise ValueError("Respuesta inválida del modelo")

    content = data["choices"][0]["message"]["content"]

    # Limpieza por si el modelo mete texto extra
    match = re.search(r"\{.*\}", content, re.DOTALL)
    if not match:
        raise ValueError("No se encontró JSON en la respuesta")

    return json.loads(match.group())


def _normalizar_salida(obj):
    riesgo = obj.get("riesgo", 50)
    try:
        riesgo = int(riesgo)
    except:
        riesgo = 50
    riesgo = max(0, min(100, riesgo))

    alertas = obj.get("alertas", [])
    if not isinstance(alertas, list):
        alertas = ["Formato de alertas inválido"]

    # limitar a 5
    alertas = alertas[:5]

    return {"riesgo": riesgo, "alertas": alertas}


def analizar_contrato(contrato):

    prompt = f"""
Eres un auditor experto en contratación pública en Colombia, con enfoque en detección de riesgos de corrupción en SECOP II.

INSTRUCCIONES:
- Evalúa riesgo (0-100)
- Genera 3 a 5 alertas bien redactadas, claras y explicativas
- NO texto adicional, SOLO JSON

FORMATO:
{{
  "riesgo": número,
  "alertas": ["...", "..."]
}}

DATOS:
Entidad: {contrato.get('nombre_entidad')}
Proveedor: {contrato.get('proveedor_adjudicado')}
Valor: {contrato.get('valor_del_contrato')}
Modalidad: {contrato.get('modalidad_de_contratacion')}
Descripción: {contrato.get('descripcion_del_proceso')}
"""

    try:
        raw = _post_llm_json(prompt)
        return _normalizar_salida(raw)

    except Exception as e:
        return {
            "riesgo": 50,
            "alertas": ["No fue posible analizar el contrato con el modelo"],
            "debug": str(e)
        }


from app.services.pdf_service import extraer_datos_inteligentes

def analizar_texto(texto: str):

    from app.services.pdf_service import extraer_datos_inteligentes

    datos = extraer_datos_inteligentes(texto)

    prompt = f"""
Eres un auditor experto en contratación pública en Colombia (SECOP II).

Debes analizar el contrato con criterio profesional real, no superficial.

IMPORTANTE:
- Usa los datos estructurados como base principal
- No inventes información
- No hagas suposiciones incorrectas

DATOS DEL CONTRATO:
{json.dumps(datos, indent=2, ensure_ascii=False)}

CRITERIOS DE ANÁLISIS (OBLIGATORIOS):

Evalúa el riesgo considerando:

1. Modalidad de contratación
   - Mínima cuantía puede reducir controles

2. Competencia real
   - Menos de 3 oferentes = alto riesgo
   - 3 a 5 oferentes = competencia normal (NO es riesgo por sí solo)

3. Valores del contrato
   - Si valor adjudicado = valor estimado → posible falta de competencia

4. Tiempo del proceso
   - Procesos muy rápidos pueden indicar riesgo

5. Claridad del contrato
   - Ambigüedad en objeto o condiciones

6. Estructura del contrato
   - Lotes pueden indicar fragmentación

7. Garantías
   - Ausencia o debilidad incrementa riesgo

8. Tipo contractual
   - Monto agotable puede aumentar discrecionalidad

INSTRUCCIONES:

- Calcula un riesgo de corrupción (0 a 100)
- Clasifica nivel:
  - 0–30 → BAJO
  - 31–60 → MEDIO
  - 61–100 → ALTO

- Genera 3 a 5 alertas:
  • técnicas
  • específicas
  • bien justificadas

PROHIBIDO:
- decir que 4 oferentes es bajo automáticamente
- decir "valor alto" sin contexto
- generar alertas genéricas

RESPONDE SOLO JSON:

{{
  "riesgo": número,
  "nivel": "BAJO | MEDIO | ALTO",
  "alertas": [
    "alerta técnica bien explicada",
    "alerta técnica bien explicada"
  ]
}}
"""

    try:
        raw = _post_llm_json(prompt)
        return _normalizar_salida(raw)

    except Exception as e:
        return {
            "riesgo": 50,
            "alertas": ["No fue posible analizar el documento"],
            "debug": str(e)
        }
    


def _post_llm_text(prompt: str):

    if not OPENROUTER_API_KEY:
        raise ValueError("Falta OPENROUTER_API_KEY en .env")

    resp = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta-llama/llama-3-8b-instruct",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2
        },
        timeout=30
    )

    resp.raise_for_status()

    data = resp.json()

    if "choices" not in data or not data["choices"]:
        raise ValueError("Respuesta inválida del modelo")

    return data["choices"][0]["message"]["content"]