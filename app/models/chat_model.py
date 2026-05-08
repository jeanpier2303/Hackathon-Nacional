from sqlalchemy import Column,Integer,String,Text,TIMESTAMP,ForeignKey,Enum
from sqlalchemy.sql import func
from app.database.connection import Base


class ChatSesion(Base):

    __tablename__="chat_sesiones"

    id=Column(Integer,primary_key=True)
    usuario_id=Column(Integer,nullable=True)
    titulo=Column(String(255))
    resumen_contexto=Column(Text)

    fecha_creacion=Column(
        TIMESTAMP,
        server_default=func.now()
    )

    fecha_actualizacion=Column(
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now()
    )


class ChatMensaje(Base):

    __tablename__="chat_mensajes"

    id=Column(Integer,primary_key=True)

    sesion_id=Column(
        Integer,
        ForeignKey("chat_sesiones.id")
    )

    role=Column(
        Enum("system","user","assistant")
    )

    contenido=Column(Text)

    contrato_id=Column(
        String(255),
        nullable=True
    )

    fecha=Column(
        TIMESTAMP,
        server_default=func.now()
    )