import { useState } from 'react';
import './style.css';

function Eadmin() {
  const [idAdmin, setIdAdmin] = useState('');
  const [admin, setAdmin] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const buscarAdmin = async () => {
    setErrorMessage('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/administrador/read');
      const data = await res.json();
      const encontrado = data.administradores.find(a => a.id_administrador === parseInt(idAdmin));
      if (!encontrado) throw new Error('Administrador no encontrado');
      setAdmin(encontrado);
    } catch (error) {
      setAdmin(null);
      setErrorMessage(error.message);
    }
  };

  const eliminarAdmin = async () => {
    setErrorMessage('');
    const confirmacion = window.confirm("¿Estás seguro de eliminar este administrador?");
    if (!confirmacion) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/administrador/delete/${admin.id_administrador}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al eliminar administrador');
      }

      alert("Administrador eliminado exitosamente.");
      setAdmin(null);
      setIdAdmin('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="background3">
      <div className="content">
        <img src="/logo.PNG" className="w-12 h-12" alt="Escuela Metropolitana la Luz" />
        <div className="text-5xl font-extrabold text-gray-900 mb-8" style={{ color: '#3D3B52' }}>Eliminar Administrador</div>

        <div className="form_login max-w-lg mx-auto">
          <div className="flex items-center mb-4">
            <label htmlFor="id_admin" className="label text-sm h-8 w-5/8 !p-0">ID Administrador</label>
            <input
              type="number"
              id="id_admin"
              className="input text-sm h-7 w-full p-2"
              value={idAdmin}
              onChange={(e) => setIdAdmin(e.target.value)}
              placeholder="Ej. 1"
            />
            <button onClick={buscarAdmin} className="ml-3 px-3 py-2 bg-blue-600 text-white text-xs rounded">
              Buscar
            </button>
          </div>

          {admin && (
            <div className="mb-4">
              <p className="text-sm mb-2">Nombre de usuario: <strong>{admin.username}</strong></p>
              <p className="text-sm mb-4">Correo electrónico: <strong>{admin.email}</strong></p>

              <button
                onClick={eliminarAdmin}
                className="button text-sm h-9 w-full p-2"
              >
                Eliminar Administrador
              </button>
            </div>
          )}

          {errorMessage && <div className="error text-sm">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default Eadmin;

