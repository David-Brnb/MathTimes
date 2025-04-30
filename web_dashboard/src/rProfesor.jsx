import { useState } from 'react'
import './style.css'


function Rprofesor() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/profesor/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Profesor registrado exitosamente. ID: ${data.id_profesor}`);
        
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setErrorMessage(data.detail || 'Error al registrar');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setErrorMessage('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
       <div className="background3">
       <div className="content">
      <div>
        <img src="/logo.PNG" className="w-16 h-16" alt="Escuela Metropolitana la Luz" />
        <div className="text-6xl font-extrabold text-gray-900 mb-10" style={{ color: '#3D3B52' }}>Profesor</div>
      </div>

      <div className="form_login">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex items-center mb-5">
            <label htmlFor="usuario" className="label text-xl h-12 w-1/2">Usuario</label>
            <input type="text" id="usuario" className="input text-xl h-12 w-full p-4"  placeholder="Usuario"  value={username} 
              onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="flex items-center mb-5">
            <label htmlFor="password" className="label text-xl h-12 w-1/2">Contraseña</label>
            <input type="password" id="password" className="input text-xl h-12 w-full p-4" placeholder="Contraseña"  value={password} 
              onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="button text-xl h-12 w-full p-4" disabled={loading} >
            {loading ? 'Cargando...' : 'Registrar'}
          </button>

          {errorMessage && <div className="error">{errorMessage}</div>}
        </form>
      </div>
    </div></div>
  );
}


export default Rprofesor
