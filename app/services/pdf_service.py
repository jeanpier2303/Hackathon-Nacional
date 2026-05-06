import pdfplumber
import re


def extraer_texto_pdf(ruta_pdf):

    texto = ""

    with pdfplumber.open(ruta_pdf) as pdf:
        for pagina in pdf.pages:
            contenido = pagina.extract_text()
            if contenido:
                texto += contenido + "\n"

    return texto


def extraer_datos_inteligentes(texto):

    
    # UTILIDADES
    

    def buscar(patron):
        match = re.search(patron, texto, re.IGNORECASE)
        return match.group(1).strip() if match else None

    def buscar_todos(patron):
        return list(set(re.findall(patron, texto, re.IGNORECASE)))

    def limpiar_valor(valor):
        if not valor:
            return None
        return re.sub(r"[^\d]", "", valor)

    def limpiar_lista(lista):
        limpio = []
        for item in lista:
            item = re.sub(r"\d+\s*Recomendación.*", "", item)
            item = re.sub(r"\s{2,}", " ", item)
            item = item.strip()

            if len(item) > 3:
                limpio.append(item)

        return list(set(limpio))

    
    #  EXTRACCIÓN DE OFERENTES (CORREGIDA)
    

    def extraer_oferentes(texto):

        candidatos = re.findall(
            r"(?:INDUSTRIAS|INVERSIONES|REPRESENTACIONES|ALMAC[ÉE]N|PARKER)[A-Z\s\.\,]+(?:S\.A\.S|LTDA)?",
            texto,
            re.IGNORECASE
        )

        limpio = []

        for c in candidatos:
            c = re.sub(r"\d+.*", "", c)  # elimina basura tipo UI
            c = re.sub(r"\s{2,}", " ", c)
            c = c.strip()

            # mínimo 2 palabras para evitar fragmentos
            if len(c.split()) >= 2:
                limpio.append(c.upper())

        return list(set(limpio))

    
    #  DATOS
    

    datos = {

        # IDENTIFICACIÓN
        "proceso": buscar(r"(CM-[A-Z0-9\-\s\.]+No\.\s*\d+-\d+)"),
        "entidad": buscar(r"(PARQUES NACIONALES NATURALES DE COLOMBIA.*?)"),

        # VALORES
        "valor_contrato": limpiar_valor(
            buscar(r"(\d{1,3}(?:\.\d{3}){1,3})\s*COP")
        ),
        "valor_total_estimado": limpiar_valor(
            buscar(r"(?:valor estimado|estimado total)[^\d]*(\d{1,3}(?:\.\d{3}){1,3})")
        ),

        # FECHAS (únicas y ordenadas)
        "fechas": sorted(buscar_todos(r"\d{2}/\d{2}/\d{4}")),

        # OFERENTES (CORRECTOS)
        "oferentes": extraer_oferentes(texto),

        # GARANTÍAS
        "garantias": limpiar_lista(
            buscar_todos(r"(\d{1,3}%\s*del contrato)")
        ),

        # LOTES
        "lotes": sorted(buscar_todos(r"(Lote\s*\d+)"))
    }

    
    #  DERIVADOS
    

    datos["cantidad_oferentes"] = len(datos["oferentes"])

    return datos