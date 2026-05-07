from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    JSON,
    TIMESTAMP,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database.connection import Base


class AnalisisIA(Base):

    __tablename__ = "analisis_ia"

    id = Column(Integer, primary_key=True)

    contrato_id = Column(
        String(255),
        ForeignKey("contratos.contrato_id")
    )

    score_riesgo = Column(Integer)

    dictamen_final = Column(String(100))

    justificacion_dictamen = Column(Text)

    resumen_ejecutivo = Column(Text)

    perfil_riesgo = Column(String(100))

    evaluacion_precio = Column(String(255))

    evaluacion_plazo = Column(String(255))

    evidencia_fraccionamiento = Column(Boolean)

    alerta_mismo_dia = Column(Boolean)

    sobrecosto_detectado = Column(Boolean)

    cumplimiento_transparencia = Column(String(255))

    cumplimiento_economia = Column(String(255))

    cumplimiento_responsabilidad = Column(String(255))

    banderas_rojas = Column(JSON)

    violaciones_ley = Column(JSON)

    recomendaciones = Column(JSON)

    analisis_financiero = Column(JSON)

    analisis_contratista = Column(JSON)

    analisis_transparencia = Column(JSON)

    analisis_plazo = Column(JSON)

    analisis_fraccionamiento = Column(JSON)

    cumplimiento_legal = Column(JSON)

    respuesta_completa = Column(JSON)

    fecha_analisis = Column(
        TIMESTAMP,
        server_default=func.now()
    )