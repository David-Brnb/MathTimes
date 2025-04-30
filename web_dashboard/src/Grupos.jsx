import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ListaGrupos() {
  const [grupos, setGrupos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/grupo');
        const data = await response.json();

        const grupoMap = new Map();

        data.grupo.forEach(grupo => {
          if (grupoMap.has(grupo.nombre_grupo)) {
            grupoMap.get(grupo.nombre_grupo).count++;
          } else {
            grupoMap.set(grupo.nombre_grupo, {
              nombre_grupo: grupo.nombre_grupo,
              count: 1,
              id_profesor: grupo.id_profesor
            });
          }
        });

        const gruposUnicos = Array.from(grupoMap.values());
        setGrupos(gruposUnicos);
      } catch (error) {
        console.error('Error al cargar los grupos:', error);
      }
    };

    fetchGrupos();
  }, []);

  const handleGrupoClick = (id_profesor) => {
    navigate(`/dashboard/${id_profesor}`);
  };

  return (
     <div className="background2">
    <div className="content">
      <div>
        <img src="/logo.PNG" className="w-16 h-16" alt="Escuela Metropolitana la Luz" />
        <div className="text-6xl font-extrabold text-gray-900 mb-10" style={{ color: '#3D3B52' }}>
          Grupos
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-6 p-6">
        {grupos.map((grupo, index) => (
          <button
            key={index}
            onClick={() => handleGrupoClick(grupo.id_profesor)} 
            className="cuadro_azul hover:scale-110 text-xl transition-transform duration-300 ease-in-out !m-5 !p-10 text-center text-black"
          >
            <div>
              <span className="font-bold">{grupo.nombre_grupo}</span>
              <div>Integrantes: {grupo.count}</div>
            </div>
          </button>
        ))}
      </div>
    </div></div>
  );
}

export default ListaGrupos;
