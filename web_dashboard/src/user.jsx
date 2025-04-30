import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './style.css'


function User() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate();

  return (
    <div className="background2">
    <div className="content">
    <div>
      <img src="/logo.PNG" className="w-16 h-16" alt="Escuela Metropolitana la Luz" />
      <div className="text-6xl font-extrabold text-gray-900 mb-10" style={{ color: '#3D3B52' }}>USUARIO</div>
    </div>

    <div className="flex justify-center items-center mb-8 mt-18 space-x-3">
      <button onClick={() => navigate("/login")}
      type="submit" className="cuadro_verde hover:scale-110 text-4xl px-12 py-8 transition-transform duration-300 ease-in-out">Administrador</button>
      <button onClick={() => navigate("/login")}
      type="submit" className="cuadro_verde hover:scale-110 text-4xl px-12 py-8 transition-transform duration-300 ease-in-out">Profesor</button>
    </div>
    <div className="flex justify-center items-center mb-8 mt-18 space-x-3">
      <a 
      href='/game/MathTimes.zip'
      download
      className="cuadro_verde hover:scale-110 text-4xl px-12 py-8 transition-transform duration-300 ease-in-out">
        Descargar
      </a>
    </div>

    </div> </div>
  )
}


export default User