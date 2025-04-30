import { useState } from 'react';
import './style.css';

function Ealumno() {
  const [idAlumno, setIdAlumno] = useState('');
  const [alumno, setAlumno] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarAlumno = async () => {
    setErrorMessage('');
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/alumno/${idAlumno}`);
      if (!res.ok) {
        throw new Error('Alumno no encontrado');
      }
      const data = await res.json();
      setAlumno(data);
    } catch (error) {
      setAlumno(null);
      setErrorMessage(error.message);
    }
  };

  const eliminarAlumno = async () => {
    if (!alumno) return;

    const confirmacion = window.confirm(`¿Estás seguro de eliminar al alumno ${alumno.username}?`);
    if (!confirmacion) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const gruposRes = await fetch('http://127.0.0.1:8000/api/grupo');
      const gruposData = await gruposRes.json();

      const grupoDelAlumno = gruposData.grupo.find(g => g.id_alumno === alumno.id_alumno);

      if (grupoDelAlumno) {
        const grupoDelRes = await fetch(`http://127.0.0.1:8000/api/grupo/${grupoDelAlumno.id_grupo}`, {
          method: 'DELETE'
        });

        if (!grupoDelRes.ok) {
          const errorGrupo = await grupoDelRes.json();
          throw new Error(errorGrupo.detail || 'Error al eliminar grupo');
        }

        alert("Se ha eliminado del grupo.");
      }

      const alumnoRes = await fetch(`http://127.0.0.1:8000/api/alumno/${alumno.id_alumno}`, {
        method: 'DELETE'
      });

      if (!alumnoRes.ok) {
        const errorAlumno = await alumnoRes.json();
        throw new Error(errorAlumno.detail || 'Error al eliminar alumno');
      }

      alert("Alumno eliminado exitosamente.");
      setAlumno(null);
      setIdAlumno('');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background3">
      <div className="content">
        <img src="/logo.PNG" className="w-12 h-12" alt="Escuela Metropolitana la Luz" />
        <div className="text-5xl font-extrabold text-gray-900 mb-8" style={{ color: '#3D3B52' }}>Eliminar Alumno</div>

        <div className="form_login max-w-lg mx-auto">
          <div className="flex items-center mb-4">
            <label htmlFor="id_alumno" className="label text-sm h-8 w-5/8 !p-0">ID Alumno</label>
            <input
              type="number"
              id="id_alumno"
              className="input text-sm h-7 w-full p-2"
              value={idAlumno}
              onChange={(e) => setIdAlumno(e.target.value)}
              placeholder="Ej. 1"
            />
            <button onClick={buscarAlumno} className="ml-3 px-3 py-2 bg-blue-600 text-white text-xs rounded">
              Buscar
            </button>
          </div>

          {alumno && (
            <div className="mb-4">
              <p className="text-sm">Nombre: <strong>{alumno.username}</strong></p>
              <p className="text-sm">Género: <strong>{alumno.genero}</strong></p>
              <p className="text-sm">No. Lista: <strong>{alumno.no_lista}</strong></p>

              <button
                onClick={eliminarAlumno}
                className="button text-sm h-9 w-full p-2 mt-3"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar Alumno'}
              </button>
            </div>
          )}

          {errorMessage && <div className="error text-sm">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default Ealumno;
