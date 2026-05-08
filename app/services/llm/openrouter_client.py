import json
import re
import requests

from app.core.config import (
    OPENROUTER_API_KEY,
    BASE_LLM_URL,
    CHAT_MODEL,
    ANALYSIS_MODEL,
    CHAT_TEMPERATURE,
    ANALYSIS_TEMPERATURE
)


def extract_json(content:str):

    try:
        return json.loads(content)

    except:

        match=re.search(r"\{[\s\S]*\}",content)

        if not match:
            raise ValueError("No se encontró JSON válido")

        return json.loads(match.group())


def _request(payload:dict):

    if not OPENROUTER_API_KEY:
        raise ValueError("Falta OPENROUTER_API_KEY")

    headers={
        "Authorization":f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type":"application/json"
    }

    response=requests.post(
        BASE_LLM_URL,
        headers=headers,
        json=payload,
        timeout=120
    )

    response.raise_for_status()

    data=response.json()

    if "choices" not in data or not data["choices"]:
        raise ValueError("Respuesta inválida del modelo")

    return data["choices"][0]["message"]["content"]


def text_completion(messages:list,model:str=CHAT_MODEL):

    payload={
        "model":model,
        "messages":messages,
        "temperature":CHAT_TEMPERATURE,
        "max_tokens":300
    }

    return _request(payload)


def json_completion(messages:list,model:str=ANALYSIS_MODEL):

    payload={
        "model":model,
        "messages":messages,
        "temperature":ANALYSIS_TEMPERATURE,
        "response_format":{"type":"json_object"}
    }

    content=_request(payload)

    return extract_json(content)