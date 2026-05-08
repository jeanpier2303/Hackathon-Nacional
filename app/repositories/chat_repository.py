from app.database.connection import SessionLocal
from app.models.chat_model import ChatSesion,ChatMensaje


def crear_sesion_chat(
    titulo:str="Nuevo chat"
):

    db=SessionLocal()

    try:

        sesion=ChatSesion(
            titulo=titulo
        )

        db.add(sesion)

        db.commit()

        db.refresh(sesion)

        return sesion

    finally:

        db.close()


def guardar_mensaje(
    sesion_id:int,
    role:str,
    contenido:str,
    contrato_id:str=None
):

    db=SessionLocal()

    try:

        mensaje=ChatMensaje(
            sesion_id=sesion_id,
            role=role,
            contenido=contenido,
            contrato_id=contrato_id
        )

        db.add(mensaje)

        db.commit()

        return mensaje

    finally:

        db.close()


def obtener_historial_chat(
    sesion_id:int,
    limite:int=10
):

    db=SessionLocal()

    try:

        mensajes=db.query(ChatMensaje).filter(
            ChatMensaje.sesion_id==sesion_id
        ).order_by(
            ChatMensaje.fecha.asc()
        ).limit(limite).all()

        return [
            {
                "role":m.role,
                "content":m.contenido
            }
            for m in mensajes
        ]

    finally:

        db.close()


def obtener_sesion(sesion_id:int):

    db=SessionLocal()

    try:

        return db.query(ChatSesion).filter(
            ChatSesion.id==sesion_id
        ).first()

    finally:

        db.close()

def actualizar_titulo_chat(
    sesion_id:int,
    titulo:str
):

    db=SessionLocal()

    try:

        sesion=db.query(ChatSesion).filter(
            ChatSesion.id==sesion_id
        ).first()

        if not sesion:
            return

        sesion.titulo=titulo

        db.commit()

    finally:

        db.close()

def listar_sesiones_chat():

    db=SessionLocal()

    try:

        sesiones=db.query(
            ChatSesion
        ).order_by(
            ChatSesion.fecha_creacion.desc()
        ).all()

        return [
            {
                "id":s.id,
                "titulo":s.titulo
            }
            for s in sesiones
        ]

    finally:

        db.close()