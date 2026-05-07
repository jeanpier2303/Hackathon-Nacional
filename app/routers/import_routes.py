from fastapi import APIRouter

from app.database.connection import (
    SessionLocal
)

from app.services.secop_import_service import (
    import_contracts
)

router = APIRouter()


@router.post("/contracts/import")
def importar_contratos(
    limit: int = 1000, #
    offset: int = 0
):

    db = SessionLocal()

    try:

        resultado = import_contracts(
            db=db,
            limit=limit,
            offset=offset
        )

        return resultado

    finally:

        db.close()