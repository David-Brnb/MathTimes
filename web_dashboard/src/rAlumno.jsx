import { useState } from 'react';
import './style.css';

function Ralumno() {
  const [profesorName, setProfesorName] = useState('');
  const [noLista, setNoLista] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [genero, setGenero] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
  
    try {
      const profesorResponse = await fetch('http://127.0.0.1:8000/api/profesor/read');
      const profesorData = await profesorResponse.json();
  
      if (!profesorData || !profesorData.profesores) {
        setErrorMessage("No se encontraron datos de profesores.");
        return;
      }
  
      const profesorName = document.getElementById("username_profesor").value;
      const profesor = profesorData.profesores.find(prof => prof.username === profesorName);
  
      if (!profesor) {
        setErrorMessage("Profesor no encontrado");
        return;
      }
  
      const idProfesor = profesor.id_profesor;
  
      const alumnoResponse = await fetch('http://127.0.0.1:8000/api/registra/alumno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          no_lista: noLista,
          username: username,
          password: password,
          genero: genero,
          monedas: 0,
          nivel: 0,
        }),
      });
  
      const alumnoData = await alumnoResponse.json();
  
      if (alumnoResponse.ok) {
        alert(`Alumno registrado exitosamente. ID: ${alumnoData.id_alumno}`);
          setTimeout(() => {
          window.location.reload();
        }, 100);
  
        const idAlumno = alumnoData.id_alumno; 

        const grupoResponse = await fetch('http://127.0.0.1:8000/api/grupo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_profesor: idProfesor,
            id_alumno: idAlumno,
            nombre: profesor.username,
          }),
        });
  
        const grupoData = await grupoResponse.json();
        if (grupoData.message) {
          setErrorMessage(grupoData.message);
          return;
        }
  
        setTimeout(() => {
          window.location.reload();
        }, 100);
  
      } else {
        if (alumnoData.message) {
          setErrorMessage(alumnoData.message);
          return;
        }
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
        <div className="text-6xl font-extrabold text-gray-900 mb-10" style={{ color: '#3D3B52' }}>Alumno</div>
      </div>

      <div className="form_login">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">

          <div className="flex items-center mb-5">
            <label htmlFor="username_profesor" className="label text-xl h-8 w-1/2 !p-0">Profesor</label>
            <input type="text" id="username_profesor" className="input text-xl h-8.5 w-full p-4" placeholder='Nombre de su profesor'
              value={profesorName} onChange={(e) => setProfesorName(e.target.value)} required/>
          </div>

          <div className="flex items-center mb-5">
            <label htmlFor="no_lista" className="label text-xl h-8 w-1/2 !p-0">No. Lista</label>
            <input type="number" id="no_lista" className="input text-xl h-8.5 w-full p-4" placeholder='No. lista' 
            value={noLista} onChange={(e) => setNoLista(e.target.value)} required />
          </div>

          <div className="flex items-center mb-5">
            <label htmlFor="username" className="label text-xl h-8 w-1/2 !p-0">Nickname</label>
            <input type="text" id="username" className="input text-xl h-8.5 w-full p-4"  placeholder='Usuario'
              value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="flex items-center mb-5">
            <label htmlFor="password" className="label text-xl h-8 w-1/2 !p-0">Contraseña</label>
            <input type="password" id="password" className="input text-xl h-8.5 w-full p-4" placeholder='Contraseña'  
            value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>

          <div className="flex items-center mb-5">
            <label htmlFor="genero" className="label text-xl h-8 w-5/16 !p-0">Género</label>
            <div className="flex items-center space-x-8 w-1/2 ml-9">
              <div className="flex flex-col items-center">
                <label htmlFor="masculino" className="text-base mb-0.3 text-xs">Masculino</label>
                <input type="radio" id="masculino" name="genero" value="M" className="hidden peer"
                  onChange={(e) => setGenero(e.target.value)}  required />
                <label
                  htmlFor="masculino"
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-[#D9D9D9] peer-checked:bg-[#00DB4E] peer-checked:border-[#00DB4E] border-4"
                />
              </div>

              <div className="flex flex-col items-center">
                <label htmlFor="femenino" className="text-base mb-0.3 text-xs">Femenino</label>
                <input type="radio" id="femenino"  name="genero" value="F" className="hidden peer"
                  onChange={(e) => setGenero(e.target.value)}  required
                />
                <label
                  htmlFor="femenino"
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-[#D9D9D9] peer-checked:bg-[#00DB4E] peer-checked:border-[#00DB4E] border-4"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="button text-xl h-12 w-full p-4"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>

          {errorMessage && <div className="error">{errorMessage}</div>}
        </form>
      </div>
    </div></div>
  );
}

export default Ralumno;
