import sqlite3

def get_db_connection():
    conn = sqlite3.connect("db/videojuego.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    print("Conectado a SQLite")
    return conn

def init_db():
    try:
        with get_db_connection() as conn:
            cur = conn.cursor()
            
            # Habilitar claves foráneas
            cur.execute("PRAGMA foreign_keys = ON;")
            
            # Crear tablas
            cur.execute("""
                CREATE TABLE IF NOT EXISTS Administrador (
                    id_administrador INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    email TEXT NOT NULL,
                    password TEXT NOT NULL
                )
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS Profesor (
                    id_profesor INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL
                )
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS Grupo (
                    id_grupo INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_profesor INTEGER,
                    id_alumno INTEGER,
                    nombre_grupo TEXT NOT NULL,
                    FOREIGN KEY (id_profesor) REFERENCES Profesor(id_profesor) ON DELETE CASCADE,
                    FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno) ON DELETE CASCADE
                )
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS Alumno (
                    id_alumno INTEGER PRIMARY KEY AUTOINCREMENT,
                    no_lista INTEGER NOT NULL,
                    genero TEXT NOT NULL,
                    monedas INTEGER DEFAULT 0,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL
                )
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS Compra (
                    id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_alumno INTEGER,
                    id_cosmetico INTEGER,
                    fecha_compra TEXT NOT NULL,
                    FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno) ON DELETE CASCADE,
                    FOREIGN KEY (id_cosmetico) REFERENCES Cosmetico(id_cosmetico) ON DELETE CASCADE
                )
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS Cosmetico (
                    id_cosmetico INTEGER PRIMARY KEY AUTOINCREMENT,
                    cosmetico TEXT NOT NULL
                )
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS Respuesta (
                    id_respuesta INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_alumno INTEGER,
                    id_ejercicio INTEGER,
                    intentos INTEGER DEFAULT 0,
                    errores INTEGER DEFAULT 0,
                    FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno) ON DELETE CASCADE,
                    FOREIGN KEY (id_ejercicio) REFERENCES Ejercicio(id_ejercicio) ON DELETE CASCADE
                )
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS Ejercicio (
                    id_ejercicio INTEGER PRIMARY KEY AUTOINCREMENT,
                    nivel INTEGER NOT NULL,
                    titulo TEXT NOT NULL,
                    enunciado TEXT NOT NULL,
                    respuesta TEXT NOT NULL
                )
            """)
            
            conn.commit()
            print("Base de datos creada exitosamente.")
    except sqlite3.OperationalError as e:
        print("Error al conectarse a la base de datos:", e)