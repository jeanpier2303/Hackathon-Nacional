from app.database.connection import engine
from app.models.contract_model import Contrato
from app.models.analysis_model import AnalisisIA

print("Creando tablas...")

Contrato.metadata.create_all(bind=engine)
AnalisisIA.metadata.create_all(bind=engine)

print("Tablas creadas correctamente")