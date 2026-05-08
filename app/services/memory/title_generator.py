from app.services.llm.openrouter_client import text_completion


def generar_titulo_chat(
    pregunta:str
):

    messages = [
        {
            "role":"system",
            "content":"""
Genera un título corto para un chat.

REGLAS:
- Máximo 40 caracteres
- Solo una línea
- Sin comillas
- Sin markdown
- Sin explicaciones
- Sin puntos
"""
        },
        {
            "role":"user",
            "content":pregunta
        }
    ]

    try:

        titulo = text_completion(
            messages
        )

        titulo = (
            titulo
            .replace('"', '')
            .replace("*", '')
            .strip()
        )

        return titulo[:40]

    except:

        return "Nuevo chat"