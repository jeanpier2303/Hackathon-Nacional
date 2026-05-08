def build_pdf_context(datos:dict,texto:str):

    return f"""
DOCUMENTO PDF ANALIZADO

DATOS EXTRAÍDOS:
{datos}

CONTENIDO DOCUMENTO:
{texto[:8000]}
""".strip()