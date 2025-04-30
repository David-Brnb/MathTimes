import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './style.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/staff', {
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

        localStorage.setItem('user', JSON.stringify({ id_usuario: data.id_usuario, tipo: data.tipo }));

        if (data.tipo === 'administrador') {
          navigate('/menu'); 
        } else if (data.tipo === 'profesor') {
          if (data.tipo === 'profesor') {
            navigate('/dashboard/' + data.id_usuario);
          }
          
        }


        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setErrorMessage(data.detail || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setErrorMessage('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="background1">
     <div className="content">
      <div>
        <img src="/logo.PNG" className="w-16 h-16" alt="Escuela Metropolitana la Luz" />
        <div className="text-6xl font-extrabold text-gray-900 mb-10" style={{ color: '#3D3B52' }}>LOGIN</div>
      </div>

      <div className="form_login">
        <form className="max-w-lg mx-auto" onSubmit={handleLogin}>

          <div className="flex items-center mb-5">
            <label htmlFor="usuario" className="label text-xl h-12 w-1/2">Usuario</label>
            <input type="text" id="usuario" className="input text-xl h-12 w-full p-4" placeholder="Usuario" 
            value={username} onChange={(e) => setUsername(e.target.value)} required/>
          </div>

          <div className="flex items-center mb-5">
            <label htmlFor="password" className="label text-xl h-12 w-1/2">Contraseña</label>
            <input type="password" id="password" className="input text-xl h-12 w-full p-4" placeholder="Contraseña"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}

          <button type="submit" className="button text-xl h-12 w-full p-4" disabled={loading}>
            {loading ? 'Cargando...' : 'INGRESAR'}
          </button>
        </form>
      </div>
    </div></div>
  );
}

export default Login;
