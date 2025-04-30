import { useState } from 'react';
import './style.css';

function Aprofesor() {
  const [idProfesor, setIdProfesor] = useState('');
  const [profesor, setProfesor] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      setUsername(encontrado.username);
    } catch (error) {
      setProfesor(null);
      setErrorMessage(error.message);
    }
  };

  const actualizarProfesor = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const updateData = {
        username: username.trim(),
        password: password.trim()
      };


      if (!updateData.username && !updateData.password) {
        throw new Error("Ingresar al menos un dato para actualizar.");
      }

      const res = await fetch(`http://127.0.0.1:8000/api/profesor/update/${profesor.id_profesor}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al actualizar profesor');
      }

      alert("Profesor actualizado exitosamente.");
      setPassword('');
    } catch (error) {
      setErrorMessage(error.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background3">
      <div className="content">
        <img src="/logo.PNG" className="w-12 h-12" alt="Escuela Metropolitana la Luz" />
        <div className="text-5xl font-extrabold text-gray-900 mb-8" style={{ color: '#3D3B52' }}>Actualizar Profesor</div>

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
            <form onSubmit={actualizarProfesor}>
              <div className="flex items-center mb-3">
                <label htmlFor="username" className="label text-sm h-8 w-5/8 !p-0">Nuevo Usuario</label>
                <input
                  type="text"
                  id="username"
                  className="input text-sm h-7 w-full p-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                />
              </div>

              <div className="flex items-center mb-3">
                <label htmlFor="password" className="label text-sm h-8 w-5/8 !p-0">Nueva Contraseña</label>
                <input
                  type="password"
                  id="password"
                  className="input text-sm h-7 w-full p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dejarlo vacío si no cambia"
                />
              </div>

              <button
                type="submit"
                className="button text-sm h-9 w-full p-2"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar Profesor'}
              </button>
            </form>
          )}

          {errorMessage && <div className="error text-sm">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default Aprofesor;
