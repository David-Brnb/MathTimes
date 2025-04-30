from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class Autentificar_login_Alumno(BaseModel):
    username: str
    password: str
    
class RespuestaLogin(BaseModel):
    valido: bool
    id_alumno: int
    no_lista: int
    genero: str
    monedas: int
    username: str
    nivel: int
    ejercicios: list

class ObtenerAlumno(BaseModel):
    valido: bool
    id_alumno: int
    no_lista: int
    genero: str
    monedas: int
    username: str
    nivel: int

class StaffAutentificar_login(BaseModel):
    username: str
    password: str
    
class StaffRespuesta_login(BaseModel):
    valido: bool
    tipo: str
    id_usuario: int
    id_grupo: int | None = None

class Errores(BaseModel):
    id_alumno: int
    nivel: int
    porcentaje_Errores: int

class InfoAlumno(BaseModel):
    no_lista: int
    genero: str
    monedas: int
    username: str
    password: str

class InfoAdministrador(BaseModel):
    username: str
    email: str
    password: str

class InfoAdministradorUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

class InfoProfesor(BaseModel):
    username: str
    password: str

class InfoProfesorUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None

class InfoEjercicio(BaseModel):
    nivel: int
    titulo: str
    enunciado: str
    respuesta: str

class InfoEjercicioRandom(BaseModel):
    id_ejercicio: int
    nivel: int
    titulo: str
    enunciado: str
    respuesta: str

class InfoCosmetico(BaseModel):
    cosmetico: str
    
 
 
 
 ###----------------- grupo   
class InfoGrupo(BaseModel):
    id_profesor: int
    id_alumno: int
    nombre: str
    
    
    
#---------------------------------- class  respuesta
class InfoRespuesta(BaseModel):
    id_alumno: int
    id_ejercicio: int
    intentos: int = 0
    errores: int = 0

class ActualizacionRespuesta(BaseModel):
    id_respuesta: int
    intentos: Optional[int] = None
    errores: Optional[int] = None

# --------------------------------class  Compra
class InfoCompra(BaseModel):
    id_alumno: int
    id_cosmetico: int
    fecha_compra: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

class ActualizacionCompra(BaseModel):
    id_compra: int
    id_alumno: Optional[int] = None
    id_cosmetico: Optional[int] = None
    fecha_compra: Optional[str] = None

class AlumnoGrupo(BaseModel):
    id_alumno: int
    no_lista: int
    username: str
    nombre_grupo: str
    id_profesor: int
