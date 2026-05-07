#este importa y guarda en la base de datos los contratos del secop

from sodapy import Socrata
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.contract_model import Contrato


client = Socrata("www.datos.gov.co", None)


def clean_value(value):

    if isinstance(value, (dict, list)):
        return str(value)

    return value


def parse_date(value):

    if not value:
        return None

    try:
        return datetime.fromisoformat(value.replace("Z", "")).date()

    except:
        return None


def parse_int(value):

    try:
        return int(float(value or 0))

    except:
        return 0


def import_contracts(db: Session, limit: int = 1000, offset: int = 0):

    results = client.get("jbjy-vk9h", limit=limit, offset=offset)

    contratos_nuevos = []

    ids_existentes = {
        item[0]
        for item in db.query(Contrato.contrato_id).all()
    }

    for item in results:

        contrato_id = item.get("id_contrato")

        if not contrato_id:
            continue

        if contrato_id in ids_existentes:
            continue

        contrato = Contrato(

            contrato_id=contrato_id,

            proceso_compra=clean_value(item.get("proceso_de_compra")),

            entidad=clean_value(item.get("nombre_entidad")),

            nit_entidad=clean_value(item.get("nit_entidad")),

            departamento=clean_value(item.get("departamento")),

            ciudad=clean_value(item.get("ciudad")),

            proveedor=clean_value(item.get("proveedor_adjudicado")),

            documento_proveedor=clean_value(item.get("documento_proveedor")),

            tipo_contrato=clean_value(item.get("tipo_de_contrato")),

            modalidad_contratacion=clean_value(item.get("modalidad_de_contratacion")),

            estado_contrato=clean_value(item.get("estado_contrato")),

            descripcion_proceso=clean_value(item.get("descripcion_del_proceso")),

            objeto_contrato=clean_value(item.get("objeto_del_contrato")),

            valor_contrato=parse_int(item.get("valor_del_contrato")),

            valor_pagado=parse_int(item.get("valor_pagado")),

            valor_pendiente=parse_int(item.get("valor_pendiente_de_pago")),

            fecha_firma=parse_date(item.get("fecha_de_firma")),

            fecha_inicio=parse_date(item.get("fecha_de_inicio_del_contrato")),

            fecha_fin=parse_date(item.get("fecha_de_fin_del_contrato")),

            url_proceso=clean_value(item.get("urlproceso")),

            datos_secop=item
        )

        contratos_nuevos.append(contrato)

    if contratos_nuevos:

        db.bulk_save_objects(contratos_nuevos)

        db.commit()

    return {
        "total_descargados": len(results),
        "insertados": len(contratos_nuevos)
    }