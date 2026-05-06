from sodapy import Socrata

# Cliente Socrata (SECOP datos abiertos)
client = Socrata("www.datos.gov.co", None)


def get_contracts(limit=100):
    results = client.get(
        "jbjy-vk9h",  # Dataset SECOP II
        select="""
            id_contrato,
            proceso_de_compra,
            nombre_entidad,
            proveedor_adjudicado,
            valor_del_contrato,
            descripcion_del_proceso,
            modalidad_de_contratacion,
            urlproceso
        """,
        limit=limit
    )

    contratos_limpios = []

    for c in results:
        contratos_limpios.append({
            "id_contrato": c.get("id_contrato"),
            "proceso_de_compra": c.get("proceso_de_compra"),
            "nombre_entidad": c.get("nombre_entidad"),
            "proveedor_adjudicado": c.get("proveedor_adjudicado"),
            "valor_del_contrato": c.get("valor_del_contrato"),
            "descripcion_del_proceso": c.get("descripcion_del_proceso"),
            "modalidad_de_contratacion": c.get("modalidad_de_contratacion"),
            "url_proceso": c.get("urlproceso", {}).get("url")  # 🔥 clave
        })

    return contratos_limpios