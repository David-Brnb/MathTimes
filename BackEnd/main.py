import hashlib
import random
from fastapi import FastAPI, HTTPException
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from database import get_db_connection, init_db
from schemas import (Autentificar_login_Alumno, 
                     RespuestaLogin, 
                     StaffAutentificar_login, 
                     StaffRespuesta_login, 
                     InfoAlumno, 
                     InfoAdministrador,
                     InfoProfesor, 
                     InfoEjercicio,
                     InfoEjercicioRandom,
                     InfoCosmetico,
                     InfoAdministradorUpdate,
                     InfoProfesorUpdate,
                     InfoGrupo,
                     InfoRespuesta,
                     ActualizacionRespuesta,
                     InfoCompra,
                     ActualizacionCompra,
                     AlumnoGrupo, 
                     ObtenerAlumno

                    )

init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# endopint1, validacion de login alumno,Admin y profesor
@app.post("/api/verif/alumno", response_model=RespuestaLogin)
def validar_login(request: Autentificar_login_Alumno):
    conn = get_db_connection()
    cursor = conn.cursor()

    request.password = hashlib.sha256(request.password.encode()).hexdigest()

    cursor.execute("""
        SELECT id_alumno, no_lista, genero, monedas, username
        FROM Alumno
        WHERE username = ? AND password = ?
    """, (request.username, request.password))

    alumno = cursor.fetchone()

    if not alumno:
        raise HTTPException(status_code=401, detail="Login incorrecto")
    
    # Hacer request de la tabla ejercicios para saber el nivel mas alto. 
    cursor.execute("""
        SELECT r.id_respuesta, r.id_ejercicio, r.intentos, r.errores, e.titulo as titulo_ejercicio, e.nivel
        FROM Respuesta r
        JOIN Ejercicio e ON r.id_ejercicio = e.id_ejercicio
        WHERE r.id_alumno = ?
    """, (alumno["id_alumno"],))

    level = 0

    for row in cursor.fetchall():
        level = max(level, row["nivel"])

    # Obtener todos los ejercicios existentes
    cursor.execute("""
        SELECT id_ejercicio, titulo
        FROM Ejercicio
    """)
    ejercicios_list=[]
    for row in cursor.fetchall():
        ejercicios_list.append({
            "titulo": row["titulo"], 
            "id_ejercicio": row["id_ejercicio"]
        })

    conn.close()

    return RespuestaLogin(
        valido=True,
        id_alumno=alumno["id_alumno"],
        no_lista=alumno["no_lista"],
        genero=alumno["genero"],
        monedas=alumno["monedas"],
        username=alumno["username"], 
        nivel=level,
        ejercicios=ejercicios_list
    )

#endpoint,Login Admin y profesor    
@app.post("/api/auth/staff", response_model=StaffRespuesta_login)
def validar_login_staff(request: StaffAutentificar_login):
    conn = get_db_connection()
    cursor = conn.cursor()

    request.password = hashlib.sha256(request.password.encode()).hexdigest()
    
    cursor.execute("SELECT id_administrador FROM Administrador WHERE username = ? AND password = ?", (request.username, request.password))
    admin = cursor.fetchone()
    if admin:
        conn.close()
        return StaffRespuesta_login(valido=True, tipo="administrador", id_usuario=int(admin[0]))
    
    cursor.execute("SELECT id_profesor FROM Profesor WHERE username = ? AND password = ?", (request.username, request.password))
    profesor = cursor.fetchone()
    if profesor:
        conn.close()
        return StaffRespuesta_login(valido=True, tipo="profesor", id_usuario=profesor[0])
    
    conn.close()
    raise HTTPException(status_code=401, detail="Credenciales incorrectas")

# endpoint, create administrador
@app.post("/api/administrador/create")
def create_adminstrador(admin: InfoAdministrador):
    conn = get_db_connection()
    cursor = conn.cursor()

    admin.password = hashlib.sha256(admin.password.encode()).hexdigest()

    # Insertar nuevo admin en la base de datos
    cursor.execute("""
        INSERT INTO Administrador (username, email, password) 
        VALUES (?, ?, ?)
    """, (admin.username, admin.email, admin.password))
    
    conn.commit()
    admin_id = cursor.lastrowid  # Obtener el ID del admin insertado
    conn.close()
    
    return {"message": "Admin registrado exitosamente", "id_admin": admin_id}

# endpoint, read administrador
@app.get("/api/administrador/read")
def read_administradores():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM Administrador
    """)

    data = cursor.fetchall()

    conn.close()
    return {"administradores": data} 

# endpoint, update administrador
@app.put("/api/administrador/update/{admin_id}")
def update_administrador(admin_id: int, update_data: InfoAdministradorUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Verificar si el nuevo username o email ya existen en otro administrador
    if update_data.username:
        cursor.execute("""
            SELECT * FROM Administrador 
            WHERE username = ? AND id_administrador != ?
        """, (update_data.username, admin_id))
        if cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado por otro administrador")

    if update_data.email:
        cursor.execute("""
            SELECT * FROM Administrador 
            WHERE email = ? AND id_administrador != ?
        """, (update_data.email, admin_id))
        if cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=400, detail="El correo electrónico ya está registrado por otro administrador")


    # Construir la consulta dinámicamente
    fields = []
    values = []

    if update_data.username:
        fields.append("username = ?")
        values.append(update_data.username)
    
    if update_data.email:
        fields.append("email = ?")
        values.append(update_data.email)
    
    if update_data.password:
        hashed_password = hashlib.sha256(update_data.password.encode()).hexdigest()
        fields.append("password = ?")
        values.append(hashed_password)
    
    if not fields:
        raise HTTPException(status_code=400, detail="No se proporcionaron campos para actualizar")

    query = f"UPDATE Administrador SET {', '.join(fields)} WHERE id_administrador = ?"
    values.append(admin_id)

    cursor.execute(query, values)
    conn.commit()
    conn.close()

    return {"message": "Administrador actualizado exitosamente"}



# endpoint, delete administrador
@app.delete("/api/administrador/delete/{admin_id}")
def delete_administrador(admin_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Verificar que el administrador exista
    cursor.execute("SELECT * FROM Administrador WHERE id_administrador = ?", (admin_id,))
    admin = cursor.fetchone()

    if admin is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Administrador no encontrado")

    # Eliminar el administrador
    cursor.execute("DELETE FROM Administrador WHERE id_administrador = ?", (admin_id,))
    conn.commit()
    conn.close()

    return {"message": "Administrador eliminado exitosamente"}

# endpoint, registrar profesor
@app.post("/api/profesor/create")
def create_profesor(profesor: InfoProfesor):
    conn = get_db_connection()
    cursor = conn.cursor()

    profesor.password = hashlib.sha256(profesor.password.encode()).hexdigest()

    # Insertar nuevo profesor en la base de datos
    cursor.execute("""
        INSERT INTO Profesor (username, password) 
        VALUES (?, ?)
    """, (profesor.username, profesor.password))

    conn.commit()
    profesor_id = cursor.lastrowid  # Obtener el ID del profesor insertado
    conn.close()

    return {"message": "Profesor registrado exitosamente", "id_profesor": profesor_id}

# endpoint, read profesores
@app.get("/api/profesor/read")
def read_profesores():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM Profesor
    """)

    data = cursor.fetchall()
    conn.close()

    return{"profesores":data}

# endpoint, update profesor
@app.put("/api/profesor/update/{profesor_id}")
def update_profesor(profesor_id: int, update_data: InfoProfesorUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()

    if update_data.username:
        cursor.execute("""
            SELECT * FROM Profesor
            WHERE username = ? AND id_profesor = ?
        """, (update_data.username, profesor_id))
        if cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado por otro administrador")
    
    fields=[]
    values=[]

    if(update_data.username):
        fields.append("username = ?")
        values.append(update_data.username)
    
    if update_data.password:
        hashed_password = hashlib.sha256(update_data.password.encode()).hexdigest()
        fields.append("password = ?")
        values.append(hashed_password)

    if not fields:
        raise HTTPException(status_code=400, detail="No se proporcionaron campos para actualizar")
    
    query = f"UPDATE Profesor SET {', '.join(fields)} WHERE id_profesor = ?"
    values.append(profesor_id)

    cursor.execute(query, values)
    conn.commit()
    conn.close()

    return {"message": "Profesor actualizado exitosamente"}

# endpoint, delete profesor
@app.delete("/api/profesor/delete/{profesor_id}")
def delete_profesor(profesor_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Profesor WHERE id_profesor = ?", (profesor_id,))
    profesor = cursor.fetchone()

    if profesor is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    
    cursor.execute("DELETE FROM Profesor WHERE id_profesor = ?", (profesor_id,))
    conn.commit()
    conn.close()

    return {"message": "Profesor eliminado exitosamente"}

# endpoint, registro alumnos
@app.post("/api/registra/alumno")
def registra_alumno(alumno: InfoAlumno):
    conn = get_db_connection()
    cursor = conn.cursor()

    alumno.password = hashlib.sha256(alumno.password.encode()).hexdigest()

    # Insertar nuevo alumno en la base de datos
    cursor.execute("""
        INSERT INTO Alumno (no_lista, genero, monedas, username, password) 
        VALUES (?, ?, ?, ?, ?)
    """, (alumno.no_lista, alumno.genero, alumno.monedas, alumno.username, alumno.password))
    
    conn.commit()
    alumno_id = cursor.lastrowid  # Obtener el ID del alumno insertado
    conn.close()
    
    return {"message": "Alumno registrado exitosamente", "id_alumno": alumno_id}

#endpoint para obtener el alumno por ID
@app.get("/api/alumno/{id_alumno}", response_model=ObtenerAlumno)
def obtener_alumno(id_alumno: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id_alumno, no_lista, genero, monedas, username FROM Alumno WHERE id_alumno = ?", (id_alumno,))
    alumno = cursor.fetchone()
    conn.close()

    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    return ObtenerAlumno(
        valido=True,
        id_alumno=alumno["id_alumno"],
        no_lista=alumno["no_lista"],
        genero=alumno["genero"],
        monedas=alumno["monedas"],
        username=alumno["username"],
        nivel=0
    )

#Endpoint para actualizar los datos del alumno
@app.put("/api/alumno/{id_alumno}")
def actualizar_alumno(id_alumno: int, alumno: InfoAlumno):
    conn = get_db_connection()
    cursor = conn.cursor()

    alumno.password = hashlib.sha256(alumno.password.encode()).hexdigest()

    cursor.execute("""
        UPDATE Alumno 
        SET no_lista = ?, genero = ?, monedas = ?, username = ?, password = ?
        WHERE id_alumno = ?
    """, (alumno.no_lista, alumno.genero, alumno.monedas, alumno.username, alumno.password, id_alumno))

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    conn.commit()
    conn.close()
    return {"message": "Alumno actualizado exitosamente"}

#Endpoint para eliminar el alumno

@app.delete("/api/alumno/{id_alumno}")
def eliminar_alumno(id_alumno: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM Alumno WHERE id_alumno = ?", (id_alumno,))

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    conn.commit()
    conn.close()
    return {"message": "Alumno eliminado exitosamente"}

#endpoint, registro ejercicios
@app.post("/api/registra/ejercicio")
def registra_ejercicio(ejercicio: InfoEjercicio):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Insertar nuevo alumno en la base de datos
    cursor.execute("""
        INSERT INTO Ejercicio (nivel, titulo, enunciado, respuesta) 
        VALUES (?, ?, ?, ?)
    """, (ejercicio.nivel, ejercicio.titulo, ejercicio.enunciado, ejercicio.respuesta))
    
    conn.commit()
    ejercicio_id = cursor.lastrowid  # Obtener el ID del alumno insertado
    conn.close()
    
    return {"message": "Ejercicio registrado exitosamente", "id_ejercicio": ejercicio_id}

#endpoint para obtener el ejercicio por su ID

@app.get("/api/ejercicio/{id_ejercicio}", response_model=InfoEjercicio)
def obtener_ejercicio(id_ejercicio: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT nivel, titulo, enunciado, respuesta FROM Ejercicio WHERE id_ejercicio = ?", (id_ejercicio,))
    ejercicio = cursor.fetchone()
    conn.close()

    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")

    return InfoEjercicio(
        nivel=ejercicio["nivel"],
        titulo=ejercicio["titulo"],
        enunciado=ejercicio["enunciado"],
        respuesta=ejercicio["respuesta"]
    )

#Endpoint para obtener un ejercicio aleatorio para un ejercicio
@app.get("/api/ejercicio_random/{nombre_ejercicio}", response_model=InfoEjercicioRandom)
def obtener_ejercicio(nombre_ejercicio: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Ejercicio WHERE titulo = ?", (nombre_ejercicio,))
    ejercicios = cursor.fetchall()
    conn.close()

    if not ejercicios:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    
    long = len(ejercicios)
    indice = random.randint(0, long - 1)  # número aleatorio entre 0 y long-1
    ejercicio = ejercicios[indice]
    print(long)


    return InfoEjercicioRandom(
        id_ejercicio=ejercicio["id_ejercicio"],
        nivel=ejercicio["nivel"],
        titulo=ejercicio["titulo"],
        enunciado=ejercicio["enunciado"],
        respuesta=ejercicio["respuesta"]
    )

#Endpoint para actualiar el ejercicio

@app.put("/api/ejercicio/{id_ejercicio}")
def actualizar_ejercicio(id_ejercicio: int, ejercicio: InfoEjercicio):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE Ejercicio 
        SET nivel = ?, titulo = ?, enunciado = ?, respuesta = ?
        WHERE id_ejercicio = ?
    """, (ejercicio.nivel, ejercicio.titulo, ejercicio.enunciado, ejercicio.respuesta, id_ejercicio))

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")

    conn.commit()
    conn.close()
    return {"message": "Ejercicio actualizado exitosamente"}

#Endpoint para eliminar el ejercicio

@app.delete("/api/ejercicio/{id_ejercicio}")
def eliminar_ejercicio(id_ejercicio: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM Ejercicio WHERE id_ejercicio = ?", (id_ejercicio,))

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")

    conn.commit()
    conn.close()
    return {"message": "Ejercicio eliminado exitosamente"}



# endpoint, registro cosmetico
@app.post("/api/registra/cosmeticos")
def registra_cosmetico(cosmetico: InfoCosmetico):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Cosmetico (cosmetico) 
        VALUES (?)
    """, (cosmetico.cosmetico,))
    conn.commit()
    cosmetico_id = cursor.lastrowid
    conn.close()

    return {"message": "Cosmetico registrado exitosamente", "id_cosmetico": cosmetico_id}

# endopint, cosmeticos read
@app.get("/api/cosmeticos")
def obtener_cosmeticos():
    conn = get_db_connection()
    cursor= conn.cursor()
    cursor.execute("SELECT id_cosmetico, cosmetico FROM Cosmetico")
    cosmeticos = [{"id_cosmetico": row[0], "cosmetico": row[1]} for row in cursor.fetchall()]
    conn.close()
    return {"cosmeticos": cosmeticos}

# Update cosmeticos
@app.put("/api/cosmeticos/{id_cosmetico}")
def update_cosmetico(id_cosmetico: int, cosmetico: InfoCosmetico):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE Cosmetico 
        SET cosmetico = ?
        WHERE id_cosmetico = ?
    """, (cosmetico.cosmetico, id_cosmetico))
    conn.commit()
    conn.close()
    return {"message": "Cosmetico actualizado exitosamente", "id_cosmetico": id_cosmetico}

#delete cosmetico
@app.delete("/api/cosmeticos/{id_cosmetico}")
def delete_cosmetico(id_cosmetico: int):
    conn = get_db_connection()
    cursor = conn.cursor()  
    cursor.execute("SELECT * FROM Cosmetico WHERE id_cosmetico = ?", (id_cosmetico,))
    cosmetico = cursor.fetchone()
    if cosmetico is None:
        conn.close()
        raise HTTPException(status_code=404, detail="No se encontró el cosmético")
    cursor.execute("DELETE FROM Cosmetico WHERE id_cosmetico = ?", (id_cosmetico,))
    conn.commit()
    conn.close()
    return {"message": "Cosmetico eliminado exitosamente", "id_cosmetico": id_cosmetico}

# Create grupo
@app.post("/api/grupo")
def create_grupo(grupo: InfoGrupo):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Grupo (id_profesor, id_alumno, nombre_grupo)
        VALUES (?, ?, ?)
    """, (grupo.id_profesor, grupo.id_alumno, grupo.nombre))
    conn.commit()
    grupo_id = cursor.lastrowid
    conn.close()
    return {"message": "Grupo registrado exitosamente", "id_grupo": grupo_id}

# Read grupo
@app.get("/api/grupo")
def get_grupo():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id_grupo, id_profesor, id_alumno, nombre_grupo FROM grupo")
    grupo = [{"id_grupo": row[0], "id_profesor": row[1], "id_alumno": row[2], "nombre_grupo": row[3]} for row in cursor.fetchall()]
    conn.close()
    return {"grupo": grupo}


# Update grupo
@app.put("/api/grupo/{id_grupo}")
def update_grupo(id_grupo: int, grupo: InfoGrupo):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE Grupo 
        SET id_profesor = ?, id_alumno = ?, nombre_grupo = ?
        WHERE id_grupo = ?
    """, (grupo.id_profesor, grupo.id_alumno, grupo.nombre, id_grupo))
    conn.commit()
    conn.close()
    return {"message": "Grupo actualizado exitosamente", "id_grupo": id_grupo}


#delete grupo
@app.delete("/api/grupo/{id_grupo}")
def delete_grupo(id_grupo: int):
    conn = get_db_connection()
    cursor = conn.cursor()  
    cursor.execute("SELECT * FROM Grupo WHERE id_grupo = ?", (id_grupo,))
    grupo = cursor.fetchone()
    if grupo is None:
        conn.close()
        raise HTTPException(status_code=404, detail="No se encontró el grupo")
    cursor.execute("DELETE FROM Grupo WHERE id_grupo = ?", (id_grupo,))
    conn.commit()
    conn.close()
    return {"message": "Grupo eliminado exitosamente", "id_grupo": id_grupo}



# ------- ENDPOINTS PARA RESPUESTAS -------

# CREATE - Registrar una nueva respuesta
@app.post("/api/registra/respuesta")
def registra_respuesta(respuesta: InfoRespuesta):
    conn = get_db_connection()
    cursor = conn.cursor()
    
# Verificar si es que existe el alumno
    cursor.execute("SELECT id_alumno FROM Alumno WHERE id_alumno = ?", (respuesta.id_alumno,))
    alumno = cursor.fetchone()
    if not alumno:
        conn.close()
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    # Verificar si es que existe el ejercicio
    cursor.execute("SELECT id_ejercicio FROM Ejercicio WHERE id_ejercicio = ?", (respuesta.id_ejercicio,))
    ejercicio = cursor.fetchone()
    if not ejercicio:
        conn.close()
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    
    # Insertar nueva respuesta
    cursor.execute("""
        INSERT INTO Respuesta (id_alumno, id_ejercicio, intentos, errores)
        VALUES (?, ?, ?, ?)
    """, (respuesta.id_alumno, respuesta.id_ejercicio, respuesta.intentos, respuesta.errores))
    
    conn.commit()
    respuesta_id = cursor.lastrowid
    conn.close()
    
    return {"message": "Respuesta registrada exitosamente", "id_respuesta": respuesta_id}

# READ - Obtener respuestas de un alumno
@app.get("/api/respuestas/alumno/{id_alumno}")
def obtener_respuestas_alumno(id_alumno: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si es que existe el alumno
    cursor.execute("SELECT id_alumno FROM Alumno WHERE id_alumno = ?", (id_alumno,))
    alumno = cursor.fetchone()
    if not alumno:
        conn.close()
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    # Obtener respuestas del alumno con innfo del ejercicio
    cursor.execute("""
        SELECT r.id_respuesta, r.id_ejercicio, r.intentos, r.errores, e.titulo as titulo_ejercicio, e.nivel
        FROM Respuesta r
        JOIN Ejercicio e ON r.id_ejercicio = e.id_ejercicio
        WHERE r.id_alumno = ?
    """, (id_alumno,))
    
    respuestas = []
    for row in cursor.fetchall():
        respuestas.append({
            "id_respuesta": row["id_respuesta"],
            "id_ejercicio": row["id_ejercicio"],
            "intentos": row["intentos"],
            "errores": row["errores"],
            "titulo_ejercicio": row["titulo_ejercicio"], 
            "nivel":row["nivel"]
        })
    
    conn.close()
    
    return {"respuestas": respuestas}

# UPDATE - Actualizar respuesta
@app.put("/api/actualiza/respuesta")
def actualiza_respuesta(respuesta: ActualizacionRespuesta):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si es que existe la respuesta
    cursor.execute("SELECT id_respuesta FROM Respuesta WHERE id_respuesta = ?", (respuesta.id_respuesta,))
    resp = cursor.fetchone()
    if not resp:
        conn.close()
        raise HTTPException(status_code=404, detail="Respuesta no encontrada")
    
    # Actualizar la respuesta
    cursor.execute("""
        UPDATE Respuesta
        SET intentos = ?, errores = ?
        WHERE id_respuesta = ?
    """, (respuesta.intentos, respuesta.errores, respuesta.id_respuesta))
    
    conn.commit()
    conn.close()
    
    return {"message": "Respuesta actualizada"}

# DELETE - Eliminar respuesta
@app.delete("/api/elimina/respuesta/{id_respuesta}")
def elimina_respuesta(id_respuesta: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
# Verificar si es que existe la respuesta
    cursor.execute("SELECT id_respuesta FROM Respuesta WHERE id_respuesta = ?", (id_respuesta,))
    resp = cursor.fetchone()
    if not resp:
        conn.close()
        raise HTTPException(status_code=404, detail="Respuesta no encontrada")
    
    # Eliminar la respuesta
    cursor.execute("DELETE FROM Respuesta WHERE id_respuesta = ?", (id_respuesta,))
    
    conn.commit()
    conn.close()
    
    return {"message": "Respuesta eliminada "}

# ------- ENDPOINTS PARA COMPRAS -------

# CREATE - Registrar una nueva compra
@app.post("/api/registra/compra")
def registra_compra(compra: InfoCompra):
    conn = get_db_connection()
    cursor = conn.cursor()
    
# Verificar si es que existe el alumno
    cursor.execute("SELECT id_alumno, monedas FROM Alumno WHERE id_alumno = ?", (compra.id_alumno,))
    alumno = cursor.fetchone()
    if not alumno:
        conn.close()
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    # Verificar si el cosmético existe
    cursor.execute("SELECT id_cosmetico FROM Cosmetico WHERE id_cosmetico = ?", (compra.id_cosmetico,))
    cosmetico = cursor.fetchone()
    if not cosmetico:
        conn.close()
        raise HTTPException(status_code=404, detail="Cosmético no encontrado")
    
    # Verificar si el alumno ya tiene este cosmético
    cursor.execute("""
        SELECT id_compra FROM Compra 
        WHERE id_alumno = ? AND id_cosmetico = ?
    """, (compra.id_alumno, compra.id_cosmetico))
    
    compra_existente = cursor.fetchone()
    if compra_existente:
        conn.close()
        raise HTTPException(status_code=400, detail="El alumno ya tiene este cosmético")
    
    # Costo del cosmetico (supongamos que vale 10 monedas)
    costo_cosmetico = 10
    
    # Verificar si el alumno tiene suficientes monedas
    if alumno["monedas"] < costo_cosmetico:
        conn.close()
        raise HTTPException(status_code=400, detail="El alumno no tiene suficientes monedas")
    
    # Actualizar monedas 
    cursor.execute("""
        UPDATE Alumno 
        SET monedas = monedas - ? 
        WHERE id_alumno = ?
    """, (costo_cosmetico, compra.id_alumno))
    
    # nueva compra
    cursor.execute("""
        INSERT INTO Compra (id_alumno, id_cosmetico, fecha_compra)
        VALUES (?, ?, ?)
    """, (compra.id_alumno, compra.id_cosmetico, compra.fecha_compra))
    
    conn.commit()
    compra_id = cursor.lastrowid
    conn.close()
    
    return {"message": "Compra registrada exitosamente", "id_compra": compra_id}

# READ - Obtener compras alumno
@app.get("/api/compras/alumno/{id_alumno}")
def obtener_compras_alumno(id_alumno: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si es que existe el alumno
    cursor.execute("SELECT id_alumno FROM Alumno WHERE id_alumno = ?", (id_alumno,))
    alumno = cursor.fetchone()
    if not alumno:
        conn.close()
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    # Obtener compras del alumno 
    cursor.execute("""
        SELECT c.id_compra, c.id_cosmetico, c.fecha_compra, co.cosmetico as nombre_cosmetico
        FROM Compra c
        JOIN Cosmetico co ON c.id_cosmetico = co.id_cosmetico
        WHERE c.id_alumno = ?
    """, (id_alumno,))
    
    compras = []
    for row in cursor.fetchall():
        compras.append({
            "id_compra": row["id_compra"],
            "id_cosmetico": row["id_cosmetico"],
            "fecha_compra": row["fecha_compra"],
            "nombre_cosmetico": row["nombre_cosmetico"]
        })
    
    conn.close()
    
    return {"compras": compras}

# UPDATE - Actualizar compra
@app.put("/api/actualiza/compra")
def actualiza_compra(compra: ActualizacionCompra):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si es que existe la compra
    cursor.execute("SELECT id_compra FROM Compra WHERE id_compra = ?", (compra.id_compra,))
    comp = cursor.fetchone()
    if not comp:
        conn.close()
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    
    # Actualizar 
    cursor.execute("""
        UPDATE Compra
        SET fecha_compra = ?
        WHERE id_compra = ?
    """, (compra.fecha_compra, compra.id_compra))
    
    conn.commit()
    conn.close()
    
    return {"message": "Compra actualizada exitosamente"}

# DELETE - Eliminar compra
@app.delete("/api/elimina/compra/{id_compra}")
def elimina_compra(id_compra: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si es que existe la compra
    cursor.execute("SELECT id_compra FROM Compra WHERE id_compra = ?", (id_compra,))
    comp = cursor.fetchone()
    if not comp:
        conn.close()
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    
    # Eliminar la compra
    cursor.execute("DELETE FROM Compra WHERE id_compra = ?", (id_compra,))
    
    conn.commit()
    conn.close()
    
    return {"message": "Compra eliminada exitosamente"}


# Consulta del alumno con su grupo
@app.get("/api/alumnos/grupo", response_model=List[AlumnoGrupo])
def obtener_alumnos_con_grupo():
    conn = get_db_connection() 
    cursor = conn.cursor()

    cursor.execute("""
        SELECT A.id_alumno, A.no_lista, A.username, G.nombre_grupo, G.id_profesor
        FROM Alumno A
        JOIN Grupo G ON A.id_alumno = G.id_alumno
    """)

    rows = cursor.fetchall()
    conn.close()

    alumnos_con_grupo = [
        AlumnoGrupo(
            id_alumno=row[0],  
            no_lista=row[1],    
            username=row[2],    
            nombre_grupo=row[3],
            id_profesor=row[4]  
        )
        for row in rows
    ]
    
    return alumnos_con_grupo


#endpoint para estadisticas
@app.get("/api/{id_profesor}/estadisticas_dashboard")
def estadisticas_dashboard(id_profesor: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT A.id_alumno, A.username, A.no_lista, A.genero
            FROM Grupo G
            JOIN Alumno A ON G.id_alumno = A.id_alumno
            WHERE G.id_profesor = ?
        """, (id_profesor,))
        alumnos = cursor.fetchall()

        alumnos_stats = []
        total_intentos_global = 0
        total_errores_global = 0

        for alumno in alumnos:
            id_alumno = alumno["id_alumno"]

            cursor.execute("""
                SELECT r.intentos, r.errores, e.nivel
                FROM Respuesta r
                JOIN Ejercicio e ON r.id_ejercicio = e.id_ejercicio
                WHERE r.id_alumno = ?
            """, (id_alumno,))
            respuestas = cursor.fetchall()

            intentos = sum([r["intentos"] for r in respuestas])
            errores = sum([r["errores"] for r in respuestas])
            exito = 1 - (errores / intentos) if intentos > 0 else 0

            radar = {1: {"intentos": 0, "errores": 0}, 2: {"intentos": 0, "errores": 0}, 3: {"intentos": 0, "errores": 0}}
            for r in respuestas:
                nivel = r["nivel"]
                if nivel in radar:
                    radar[nivel]["intentos"] += r["intentos"]
                    radar[nivel]["errores"] += r["errores"]

            nivel_stats = {}
            for nivel in radar:
                ni = radar[nivel]["intentos"]
                ne = radar[nivel]["errores"]
                nivel_stats[f"nivel_{nivel}"] = round((1 - ne / ni) * 100, 2) if ni > 0 else 0

            alumnos_stats.append({
                "id_alumno": id_alumno,
                "no_lista": alumno["no_lista"],
                "username": alumno["username"],
                "genero": alumno["genero"],
                "intentos": intentos,
                "errores": errores,
                "porcentaje_exito": round(exito * 100, 2),
                "radar": nivel_stats
            })

            total_intentos_global += intentos
            total_errores_global += errores

        porcentaje_global_exito = 1 - (total_errores_global / total_intentos_global) if total_intentos_global > 0 else 0

        return {
            "alumnos": alumnos_stats,
            "promedio_exito": round(porcentaje_global_exito * 100, 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        conn.close()
