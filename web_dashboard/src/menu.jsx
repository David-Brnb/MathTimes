import './style.css'
import { useNavigate } from "react-router-dom";


function Menu() {
  const navigate = useNavigate();

  return (
     <div className="background2">
     <div className="content">
    <div>
      <img src="/logo.PNG" className="w-16 h-16" alt="Escuela Metropolitana la Luz" />
      <div className="text-6xl font-extrabold text-gray-900 mb-10" style={{ color: '#3D3B52' }}>MENÚ</div>
    </div>

    <div className="flex justify-center items-center mb-8 mt-18 space-x-3">
      <button type="submit" onClick={() => navigate("/alumnos")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Alumnos</button>
      <button type="submit" onClick={() => navigate("/grupos")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Grupos</button>    
    </div>
    <div className="flex justify-center items-center mb-8 mt-18 space-x-3">
      <button type="submit" onClick={() => navigate("/actualizar")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Actualizar</button>
      <button type="submit" onClick={() => navigate("/eliminar")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Eliminar</button>
      <button type="submit" onClick={() => navigate("/registrar")} className="cuadro_verde hover:scale-110 text-4xl px-10 py-6 transition-transform duration-300 ease-in-out">Registrar</button>
      
    </div>

    </div></div>
  )
}


export default Menu
