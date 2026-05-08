import re


def detectar_intencion(
    pregunta: str
):

    pregunta = pregunta.lower()

    if any(
        palabra in pregunta
        for palabra in [
            "riesgo",
            "corrupción",
            "corrupcion",
            "irregularidad",
            "sobrecosto",
            "sobreprecio",
            "fraccionamiento"
        ]
    ):

        return "analisis_riesgo"

    if any(
        palabra in pregunta
        for palabra in [
            "resumen",
            "explica",
            "explicame",
            "qué es",
            "que es"
        ]
    ):

        return "consulta_general"

    return "general"


def detectar_contrato_id(
    texto: str
):

    patron = r"CO1\.PCCNTR\.\d+"

    resultado = re.search(
        patron,
        texto,
        re.IGNORECASE
    )

    if resultado:

        return resultado.group(0)

    return None