import './style.css'
import { useNavigate } from "react-router-dom";


function Actualizar() {
  const navigate = useNavigate();

  return (
    <div className="background2">
    <div className="content">
    <div>
      <img src="/logo.PNG" className="w-16 h-16" alt="Escuela Metropolitana la Luz" />
      <div className="text-6xl font-extrabold text-gray-900 mb-10" style={{ color: '#3D3B52' }}>ACTUALIZAR</div>
    </div>

    <div class="flex justify-center items-center mb-8 mt-18 space-x-3">
      <button type="submit" onClick={() => navigate("/actualizar/alumno")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Alumno</button>
      <button type="submit" onClick={() => navigate("/actualizar/profesor")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Profesor</button>
      <button type="submit" onClick={() => navigate("/actualizar/admin")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Administrador</button>
    </div>

    </div></div>
  )
}


export default Actualizar
