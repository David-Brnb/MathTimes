import './style.css'
import { useNavigate } from "react-router-dom";


function Registrar() {
  const navigate = useNavigate();

  return (
    <div className="background2">
    <div className="content">
    <div>
      <img src="/logo.PNG" className="w-16 h-16" alt="Escuela Metropolitana la Luz" />
      <div className="text-6xl font-extrabold text-gray-900 mb-10" style={{ color: '#3D3B52' }}>REGISTRAR</div>
    </div>

    <div class="flex justify-center items-center mb-8 mt-18 space-x-3">
      <button type="submit" onClick={() => navigate("/registrar/alumno")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Alumno</button>
      <button type="submit" onClick={() => navigate("/registrar/profesor")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Profesor</button>
      <button type="submit" onClick={() => navigate("/registrar/admin")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Administrador</button>
    </div>

    </div></div>
  )
}


export default Registrar
