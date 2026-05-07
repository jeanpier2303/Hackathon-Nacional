import requests


N8N_URL = (
    "https://gustanpi2.app.n8n.cloud/"
    "webhook/auditoria-contrato"
)


def analizar_contrato_n8n(contrato_id):

    url = f"{N8N_URL}?ID_Contrato={contrato_id}"

    response = requests.get(url, timeout=120)

    response.raise_for_status()

    return response.json()