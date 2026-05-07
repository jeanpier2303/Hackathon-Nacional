# Hackathon-Nacional 🚀

##  Crear entorno virtual

### En Windows:

```bash
python -m venv venv
```

---

##  Activar entorno virtual

```bash
venv\Scripts\activate
```

---

##  Instalar dependencias

```bash
pip install -r requirements.txt
```

---

##  Ejecutar servidor (FastAPI)

```bash
uvicorn app.main:app --reload
```

---

##  Notas

* Asegúrate de tener Python instalado (recomendado 3.10 o superior).
* Si tienes problemas con `uvicorn`, puedes instalarlo manualmente:

```bash
pip install uvicorn
```

* Para salir del entorno virtual:

```bash
deactivate
```


en app\services\secop_import_service.py estoy descarganod y guardando en la base de datos el dataset