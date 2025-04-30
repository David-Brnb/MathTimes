import { useState } from 'react';
import './style.css';

function Eprofesor() {
  const [idProfesor, setIdProfesor] = useState('');
  const [profesor, setProfesor] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarProfesor = async () => {
    setErrorMessage('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/profesor/read');
      const data = await res.json();
      const encontrado = data.profesores.find(p => p.id_profesor === parseInt(idProfesor));
      if (!encontrado) throw new Error('Profesor no encontrado');
      setProfesor(encontrado);
    } catch (error) {
      setProfesor(null);
      setErrorMessage(error.message);
    }
  };

  const eliminarProfesor = async () => {
    if (!profesor) return;

    const confirmacion = window.confirm(`¿Estás seguro de eliminar al profesor ${profesor.username}?`);
    if (!confirmacion) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/profesor/delete/${profesor.id_profesor}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Error al eliminar profesor');
      }

      alert('Profesor eliminado exitosamente.');
      setProfesor(null);
      setIdProfesor('');
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
        <div className="text-5xl font-extrabold text-gray-900 mb-8" style={{ color: '#3D3B52' }}>Eliminar Profesor</div>

        <div className="form_login max-w-lg mx-auto">
          <div className="flex items-center mb-4">
            <label htmlFor="id_profesor" className="label text-sm h-8 w-5/8 !p-0">ID Profesor</label>
            <input
              type="number"
              id="id_profesor"
              className="input text-sm h-7 w-full p-2"
              value={idProfesor}
              onChange={(e) => setIdProfesor(e.target.value)}
              placeholder="Ej. 1"
            />
            <button onClick={buscarProfesor} className="ml-3 px-3 py-2 bg-blue-600 text-white text-xs rounded">
              Buscar
            </button>
          </div>

          {profesor && (
            <div className="mb-4">
              <p className="text-sm">Nombre de usuario: <strong>{profesor.username}</strong></p>

              <button
                onClick={eliminarProfesor}
                className="button text-sm h-9 w-full p-2 mt-3"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar Profesor'}
              </button>
            </div>
          )}

          {errorMessage && <div className="error text-sm">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default Eprofesor;
