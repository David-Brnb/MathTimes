import React from 'react';

function AlumnoCard({ alumno, onClick }) {
  return (
    <button
      onClick={() => onClick(alumno.id_alumno)}
      className="cuadro_verde hover:scale-110 text-xl transition-transform duration-300 ease-in-out !flex !items-center !justify-center !flex-col !w-full !h-full "
    >
      <span>{`${alumno.no_lista} - ${alumno.nombre_grupo}`}</span>
      <span className="text-sm mt-2 text-center">{alumno.username}</span>
    </button>
  );
}

export default AlumnoCard;

