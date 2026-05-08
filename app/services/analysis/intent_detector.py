import re


def detectar_contrato_id(texto:str):

    patrones=[
        r"CO1\.PCCNTR\.\d+",
        r"[A-Z]{2,}-[A-Z0-9\-]+-\d{4}",
        r"[A-Z]+-[A-Z]+-[A-Z]+-\d{3,}"
    ]

    for patron in patrones:

        match=re.search(
            patron,
            texto,
            re.IGNORECASE
        )

        if match:
            return match.group()

    return None


def detectar_intencion(
    pregunta:str
):

    pregunta=pregunta.lower()

    palabras_analisis=[
        "riesgo",
        "sobrecosto",
        "corrupción",
        "contrato",
        "secop",
        "proveedor",
        "licitación",
        "oferente",
        "auditoría"
    ]

    if any(
        palabra in pregunta
        for palabra in palabras_analisis
    ):
        return "contrato"

    return "general"