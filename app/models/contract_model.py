from sqlalchemy import Column, Integer, String, Text, BigInteger, Date, JSON, TIMESTAMP
from sqlalchemy.sql import func

from app.database.connection import Base


class Contrato(Base):

    __tablename__ = "contratos"

    id = Column(Integer, primary_key=True, index=True)

    contrato_id = Column(String(255), unique=True, nullable=False)

    proceso_compra = Column(String(255))

    entidad = Column(Text)

    nit_entidad = Column(String(100))

    departamento = Column(String(150))

    ciudad = Column(String(150))

    proveedor = Column(Text)

    documento_proveedor = Column(String(100))

    tipo_contrato = Column(String(255))

    modalidad_contratacion = Column(String(255))

    estado_contrato = Column(String(255))

    descripcion_proceso = Column(Text)

    objeto_contrato = Column(Text)

    valor_contrato = Column(BigInteger)

    valor_pagado = Column(BigInteger)

    valor_pendiente = Column(BigInteger)

    fecha_firma = Column(Date)

    fecha_inicio = Column(Date)

    fecha_fin = Column(Date)

    url_proceso = Column(Text)

    datos_secop = Column(JSON)

    fecha_creacion = Column(
        TIMESTAMP,
        server_default=func.now()
    )