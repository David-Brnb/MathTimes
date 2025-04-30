import { useState} from 'react';
import './style.css';

function Aalumno() {
  const [idAlumno, setIdAlumno] = useState('');
  const [alumno, setAlumno] = useState(null);
  const [profesorName, setProfesorName] = useState('');
  const [noLista, setNoLista] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [genero, setGenero] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const buscarAlumno = async () => {
    if (!idAlumno) {
      setErrorMessage("Ingresa un ID de alumno válido.");
      return;
    }

    try {
      setErrorMessage('');
      const res = await fetch(`http://127.0.0.1:8000/api/alumno/${idAlumno}`);
      if (!res.ok) {
        throw new Error("Alumno no encontrado.");
      }
      const data = await res.json();
      setAlumno(data);
      setNoLista(data.no_lista);
      setUsername(data.username);
      setGenero(data.genero);
      setPassword(''); 
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo encontrar al alumno.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
  
    try {
      const profesorResponse = await fetch('http://127.0.0.1:8000/api/profesor/read');
      const profesorData = await profesorResponse.json();
  
      const profesor = profesorData?.profesores?.find(prof => prof.username === profesorName);
  
      if (!profesor) {
        throw new Error("Profesor no encontrado.");
      }
  
      const nuevoIdProfesor = profesor.id_profesor;
  
      const datosAlumnoActualizados = {
        no_lista: Number(noLista),
        genero: genero,
        monedas: alumno.monedas,
        username: username,
        password: password,
        grupo: profesorName 
      };
  

      const actualizarAlumno = await fetch(`http://127.0.0.1:8000/api/alumno/${alumno.id_alumno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosAlumnoActualizados)
      });
  
      if (!actualizarAlumno.ok) {
        const err = await actualizarAlumno.json();
        throw new Error(err.detail || 'Error al actualizar el alumno');
      }
  
      alert("Alumno actualizado correctamente.");
  
      const alumnosConGrupoResponse = await fetch('http://127.0.0.1:8000/api/alumnos/grupo');
      const alumnosConGrupoData = await alumnosConGrupoResponse.json();
  
      const alumnoConGrupo = alumnosConGrupoData.find(
        ag => ag.id_alumno === alumno.id_alumno
      );
  
      if (alumnoConGrupo) {
        const gruposResponse = await fetch('http://127.0.0.1:8000/api/grupo');
        const gruposData = await gruposResponse.json();
  
        const grupoExistente = gruposData.grupo.find(
          g => g.id_alumno === alumno.id_alumno
        );
  
        if (!grupoExistente) {
          throw new Error("No se encontró un grupo con ese alumno.");
        }
  
        if (grupoExistente.id_profesor !== nuevoIdProfesor) {
          const datosGrupo = {
            id_profesor: nuevoIdProfesor,
            id_alumno: alumno.id_alumno,
            nombre: profesor.username,
          };
  
          const updateGrupoResponse = await fetch(`http://127.0.0.1:8000/api/grupo/${grupoExistente.id_grupo}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosGrupo),
          });
  
          if (!updateGrupoResponse.ok) {
            const errorData = await updateGrupoResponse.json();
            throw new Error(errorData.detail || "Error al actualizar grupo.");
          }
  
          alert("Grupo actualizado correctamente.");
        } 
  
      } else {
        const datosGrupo = {
          id_profesor: nuevoIdProfesor,
          id_alumno: alumno.id_alumno,
          nombre: profesor.username,
        };
  
        const grupoResponse = await fetch('http://127.0.0.1:8000/api/grupo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosGrupo),
        });
  
        if (!grupoResponse.ok) {
          const errorData = await grupoResponse.json();
          throw new Error(errorData.detail || "Error al crear grupo.");
        }
  
        alert("Grupo creado correctamente.");
      }
  
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "Error inesperado al actualizar.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="background3">
      <div className="content">
        <img src="/logo.PNG" className="w-12 h-12" alt="Escuela Metropolitana la Luz" />
        <div className="text-5xl font-extrabold text-gray-900 mb-8" style={{ color: '#3D3B52' }}>Actualizar Alumno</div>

        <div className="form_login max-w-lg mx-auto">
          <div className="flex items-center mb-3">
            <label htmlFor="id_alumno" className="label text-sm h-8 w-5/8 !p-0">ID Alumno</label>
            <input
              type="number"
              id="id_alumno"
              className="input text-sm h-7 w-full p-2"
              placeholder="Ej. 1"
              value={idAlumno}
              onChange={(e) => setIdAlumno(e.target.value)}
              required
            />
            <button type="button" onClick={buscarAlumno} className="ml-3 px-3 py-2 bg-blue-600 text-white text-xs rounded">Buscar</button>
          </div>

          {alumno && (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-3">
                <label htmlFor="profesor" className="label text-sm h-8 w-5/8 !p-0">Profesor</label>
                <input
                  type="text"
                  id="profesor"
                  className="input text-sm h-7 w-full p-2"
                  value={profesorName}
                  onChange={(e) => setProfesorName(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center mb-3">
                <label htmlFor="no_lista" className="label text-sm h-8 w-5/8 !p-0">No. Lista</label>
                <input
                  type="number"
                  id="no_lista"
                  className="input text-sm h-7 w-full p-2"
                  value={noLista}
                  onChange={(e) => setNoLista(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center mb-3">
                <label htmlFor="username" className="label text-sm h-8 w-5/8 !p-0">Nickname</label>
                <input
                  type="text"
                  id="username"
                  className="input text-sm h-7 w-full p-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center mb-3">
                <label htmlFor="password" className="label text-sm h-8 w-5/8 !p-0">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  className="input text-sm h-7 w-full p-2"
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>


              <div className="flex items-center mb-3">
                <label className="label text-sm h-8 w-23/64 !p-0">Género</label>
                <div className="flex items-center space-x-6 w-1/2 ml-6">
                  <div className="flex flex-col items-center">
                    <label htmlFor="masculino" className="text-xs mb-0.3">Masculino</label>
                    <input type="radio" id="masculino" name="genero" value="M" className="hidden peer"
                      checked={genero === 'M'} onChange={(e) => setGenero(e.target.value)} />
                    <label htmlFor="masculino" className="w-5 h-5 rounded-full bg-[#D9D9D9] peer-checked:bg-[#00DB4E] border-4 peer-checked:border-[#00DB4E]" />
                  </div>
                  <div className="flex flex-col items-center">
                    <label htmlFor="femenino" className="text-xs mb-0.3">Femenino</label>
                    <input type="radio" id="femenino" name="genero" value="F" className="hidden peer"
                      checked={genero === 'F'} onChange={(e) => setGenero(e.target.value)} />
                    <label htmlFor="femenino" className="w-5 h-5 rounded-full bg-[#D9D9D9] peer-checked:bg-[#00DB4E] border-4 peer-checked:border-[#00DB4E]" />
                  </div>
                </div>
              </div>

              <button type="submit" className="button text-sm h-9 w-full p-2" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Alumno"}
              </button>
              {errorMessage && <div className="error text-sm">{errorMessage}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Aalumno;
