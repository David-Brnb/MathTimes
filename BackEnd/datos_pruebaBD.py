

conn = sqlite3.connect("db/videojuego.db")
cursor = conn.cursor()

try:
    cursor.execute("""INSERT INTO Administrador (username, email, password) 
                      VALUES ('admintest', 'admin1@example.com', 'adminpass')""")

    cursor.execute("""INSERT INTO Profesor ( username, password) 
                      VALUES ('profesortest', 'profepass')""")

    cursor.execute("""INSERT INTO Grupo (numero) VALUES (101)""")
    cursor.execute("""INSERT INTO Grupo (numero) VALUES (102)""")

    cursor.execute("""INSERT INTO Cosmetico (cosmetico) VALUES ('Skin Azul')""")
    cursor.execute("""INSERT INTO Cosmetico (cosmetico) VALUES ('Skin Rojo')""")

    cursor.execute("""INSERT INTO Alumno (id_grupo, no_lista, genero, progreso, errores_1, errores_2, errores_3, monedas, username, password) 
                      VALUES (1, 5, 'F', 10, 1, 2, 3, 200, 'alumno1', 'pass123')""")

    cursor.execute("""INSERT INTO Alumno (id_grupo, no_lista, genero, progreso, errores_1, errores_2, errores_3, monedas, username, password) 
                      VALUES (1, 8, 'M', 20, 0, 1, 2, 500, 'alumno2', 'pass456')""")

    cursor.execute("""INSERT INTO Profesor_Grupo (id_profesor, id_grupo) VALUES (1, 1)""")
    cursor.execute("""INSERT INTO Profesor_Grupo (id_profesor, id_grupo) VALUES (1, 2)""")

    cursor.execute("""INSERT INTO Alumno_Cosmetico (id_alumno, id_cosmetico) VALUES (1, 1)""")
    cursor.execute("""INSERT INTO Alumno_Cosmetico (id_alumno, id_cosmetico) VALUES (2, 2)""")

finally:
    conn.close()
