import requests

from app.database.connection import SessionLocal

from app.models.contract_model import Contrato


BASE_URL = (
    "https://www.datos.gov.co/resource/jbjy-vk9h.json"
)


def import_contracts(
    limit: int = 100,
    offset: int = 0
):

    response = requests.get(
        BASE_URL,
        params={
            "$limit": limit,
            "$offset": offset
        }
    )

    response.raise_for_status()

    contratos = response.json()

    db = SessionLocal()

    nuevos = 0

    try:

        for item in contratos:

            contrato_id = item.get(
                "id_del_proceso",
                ""
            )

            existe = db.query(Contrato).filter(
                Contrato.contrato_id == contrato_id
            ).first()

            if existe:
                continue

            nuevo = Contrato(

                contrato_id=contrato_id,

                entidad=item.get(
                    "nombre_de_la_entidad",
                    ""
                ),

                proveedor=item.get(
                    "proveedor_adjudicado",
                    ""
                ),

                valor_contrato=float(
                    item.get(
                        "valor_del_contrato",
                        0
                    ) or 0
                ),

                fecha_firma=item.get(
                    "fecha_de_firma",
                    None
                ),

                fecha_fin=item.get(
                    "fecha_de_fin_del_contrato",
                    None
                ),

                modalidad=item.get(
                    "modalidad_de_contratacion",
                    ""
                ),

                url_proceso=item.get(
                    "urlproceso",
                    ""
                ),

                departamento=item.get(
                    "departamento",
                    ""
                ),

                ciudad=item.get(
                    "ciudad",
                    ""
                ),

                descripcion_proceso=item.get(
                    "descripcion_del_proceso",
                    ""
                ),

                objeto_contrato=item.get(
                    "detalle_del_objeto_a_contratar",
                    ""
                )
            )

            db.add(nuevo)

            nuevos += 1

        db.commit()

        return {

            "status": "ok",

            "nuevos_contratos": nuevos,

            "total_recibidos": len(
                contratos
            )
        }

    finally:

        db.close()