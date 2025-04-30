import React, { useEffect, useState } from 'react';
import AlumnoCard from './AlumnoCard';

function ListaAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (loggedUser) {
      setUser(loggedUser); 
      console.log('Usuario logueado:', loggedUser);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alumnosResponse = await fetch('http://127.0.0.1:8000/api/alumnos/grupo');
        const alumnosData = await alumnosResponse.json();
        setAlumnos(alumnosData);
      } catch (error) {
        console.error('Error al cargar los alumnos:', error);
      }
    };

    fetchData();
  }, []);

  const handleAlumnoClick = async (id_alumno) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/alumno/${id_alumno}`);
      const data = await response.json();
      setAlumnoSeleccionado(data);
    } catch (error) {
      console.error('Error al obtener la información del alumno:', error);
    }
  };

  const cerrar = () => {
    setAlumnoSeleccionado(null);
  };

  const filterAlumnos = () => {
    if (!user) return [];

    if (user.tipo === 'administrador') {
      return alumnos;
    }

    if (user.tipo === 'profesor') {
      console.log('Filtrando alumnos :', user.id_usuario);

      return alumnos.filter(alumno => alumno.id_profesor === user.id_usuario);
    }

    return [];
  };

  const alumnosFiltrados = filterAlumnos();

  return (
     <div className="background3">
     <div className="content">
      <div>
        <img src="/logo.PNG" className="w-16 h-16" alt="Escuela Metropolitana la Luz" />
        <div className="text-6xl font-extrabold text-gray-900 mb-0" style={{ color: '#3D3B52' }}>Alumnos</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {alumnosFiltrados.map((alumno) => (
          <AlumnoCard key={alumno.id_alumno} alumno={alumno} onClick={handleAlumnoClick} />
         ))}
      </div>

      {alumnoSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="cuadro_azul w-[90vw] max-w-[700px] min-h-[350px] p-10 text-center shadow-xl rounded-xl">
            <h2 className="text-2xl mb-4 text-white">Información del Alumno</h2>
            <p><strong>ID:</strong> {alumnoSeleccionado.id_alumno}</p>
            <p><strong>No. Lista:</strong> {alumnoSeleccionado.no_lista}</p>
            <p><strong>Username:</strong> {alumnoSeleccionado.username}</p>
            <p><strong>Género:</strong> {alumnoSeleccionado.genero}</p>
            <p><strong>Monedas:</strong> {alumnoSeleccionado.monedas}</p>

            <button onClick={cerrar} className="mt-6 bg-blue-900 text-white font-bold py-2 px-4 rounded hover:scale-110 transition">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div></div>
  );
}

export default ListaAlumnos;
