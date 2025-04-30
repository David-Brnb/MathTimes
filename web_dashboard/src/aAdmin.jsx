import { useState } from 'react';
import './style.css';

function Aadmin() {
  const [idAdmin, setIdAdmin] = useState('');
  const [admin, setAdmin] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarAdmin = async () => {
    setErrorMessage('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/administrador/read');
      const data = await res.json();
      const encontrado = data.administradores.find(a => a.id_administrador === parseInt(idAdmin));
      if (!encontrado) throw new Error('Administrador no encontrado');
      setAdmin(encontrado);
      setUsername(encontrado.username);
      setEmail(encontrado.email);
    } catch (error) {
      setAdmin(null);
      setErrorMessage(error.message);
    }
  };

  const actualizarAdmin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const datosActualizados = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim()
      };

      if (!datosActualizados.username && !datosActualizados.email && !datosActualizados.password) {
        throw new Error("Ingresar al menos un dato para actualizar.");
      }

      const res = await fetch(`http://127.0.0.1:8000/api/administrador/update/${admin.id_administrador}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al actualizar administrador');
      }

      alert("Administrador actualizado exitosamente.");
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
        <div className="text-5xl font-extrabold text-gray-900 mb-8" style={{ color: '#3D3B52' }}>Actualizar Administrador</div>

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
            <form onSubmit={actualizarAdmin}>
              <div className="flex items-center mb-3">
                <label htmlFor="username" className="label text-sm h-8 w-5/8 !p-0">Usuario</label>
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
                <label htmlFor="email" className="label text-sm h-8 w-5/8 !p-0">Correo</label>
                <input
                  type="email"
                  id="email"
                  className="input text-sm h-7 w-full p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="@gmail.com"
                />
              </div>

              <div className="flex items-center mb-3">
                <label htmlFor="password" className="label text-sm h-8 w-5/8 !p-0">Contraseña nueva</label>
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
                {loading ? 'Actualizando...' : 'Actualizar Administrador'}
              </button>
            </form>
          )}

          {errorMessage && <div className="error text-sm">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default Aadmin;
