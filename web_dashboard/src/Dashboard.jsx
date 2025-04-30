import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
  const { id_grupo } = useParams();
  const [alumnos, setAlumnos] = useState([]);
  const [promedioExito, setPromedioExito] = useState(0);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState('global');
  const [selectedTop, setSelectedTop] = useState('global');
  const [topGlobal, setTopGlobal] = useState([]);
  const [topMasculino, setTopMasculino] = useState([]);
  const [topFemenino, setTopFemenino] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id_grupo) {
      fetchData();
    }
  }, [id_grupo]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/${id_grupo}/estadisticas_dashboard`);
      const data = await res.json();

      setAlumnos(data.alumnos);
      setPromedioExito(data.promedio_exito);

      setTopGlobal(data.alumnos);
      setTopMasculino(data.alumnos.filter((a) => a.genero === 'M'));
      setTopFemenino(data.alumnos.filter((a) => a.genero === 'F'));
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopAlumnos = (group, type) => {
    const sortedGroup = [...group].sort((a, b) => b.porcentaje_exito - a.porcentaje_exito);
    return type === 'high' ? sortedGroup.slice(0, 5) : sortedGroup.slice(-5);
  };

  const alumnoSeleccionado =
    selectedAlumnoId === 'global'
      ? null
      : alumnos.find((a) => a.id_alumno === parseInt(selectedAlumnoId));

  const getDonaSeries = () => {
    const porcentaje = alumnoSeleccionado ? alumnoSeleccionado.porcentaje_exito : promedioExito;
    return [porcentaje, 100 - porcentaje];
  };

  const getRadialSeries = () => {
    if (alumnoSeleccionado) {
      return [
        alumnoSeleccionado.radar?.nivel_1 / 100 || 0, 
        alumnoSeleccionado.radar?.nivel_2 / 100 || 0, 
        alumnoSeleccionado.radar?.nivel_3 / 100 || 0,
      ];
    } else {
      const sumRadar = (nivel) => alumnos.reduce((acc, a) => acc + (a.radar?.[nivel] || 0), 0);
      const count = alumnos.length || 1;
  
      return [
        sumRadar('nivel_1') / (count * 100), 
        sumRadar('nivel_2') / (count * 100), 
        sumRadar('nivel_3') / (count * 100), 
      ];
    }
  };
  

  const donaData = {
    series: getDonaSeries(),
    options: {
      chart: { type: 'donut' },
      labels: ['Éxitos', 'Fallos'],
      colors: ['#36A2EB', '#FF6384'],
    },
  };

  const radialData = {
    series: [{ name: 'Porcentaje', data: getRadialSeries() }],
    options: {
      chart: { type: 'radar' },
      xaxis: { categories: ['Nivel 1', 'Nivel 2', 'Nivel 3'] },
      stroke: { width: 2, colors: ['#FF9F40'] },
      fill: { opacity: 0.4, colors: ['#FF9F40'] },
      markers: {
        size: 4,
        colors: ['#FF9F40'],
        strokeColor: '#fff',
        strokeWidth: 2,
      },
      yaxis: {
        min: 0, 
        max: 1,  
      },
      title: { text: 'Porcentaje de Éxito por Nivel' },
    },
  };
  

  const topAlumnos =
    selectedTop === 'global' ? topGlobal : selectedTop === 'masculino' ? topMasculino : topFemenino;

  const topAlumnosAltos = getTopAlumnos(topAlumnos, 'high');
  const topAlumnosBajos = getTopAlumnos(topAlumnos, 'low').reverse();


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">
          Cargando datos ...
        </div>
      </div>
    );
  }

  return (
    <div className="background">
    <div className="content">
      <div className="flex justify-between items-center p-4">
        <img src="/logo.PNG" className="w-16 h-16" alt="Escuela Metropolitana la Luz" />
        <div className="text-6xl font-extrabold text-gray-900 text-center" style={{ color: '#3D3B52' }}>
          Dashboard
        </div>
        <a href="/alumnos">
          <button className="button py-2 px-4 rounded-lg shadow-none">Alumnos</button>
        </a>
      </div>

      <div className="flex space-x-8 p-8">
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Seleccionar Top</h3>
          <select
            onChange={(e) => setSelectedTop(e.target.value)}
            className="mb-6 p-2 border rounded-md w-full"
          >
            <option value="global">Grupo Completo</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>

          <h3 className="text-xl font-semibold mb-4">Top de Alumnos</h3>
          <h4 className="font-semibold mb-2">Top Más Altos</h4>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Intentos</th>
                <th className="p-2">Errores</th>
                <th className="p-2">Éxito</th>
              </tr>
            </thead>
            <tbody>
              {topAlumnosAltos.map((a) => (
                <tr key={a.id_alumno}>
                  <td className="p-2">{a.username}</td>
                  <td className="p-2">{a.intentos}</td>
                  <td className="p-2">{a.errores}</td>
                  <td className="p-2">{a.porcentaje_exito}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="font-semibold mb-2">Top Más Bajos</h4>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Intentos</th>
                <th className="p-2">Errores</th>
                <th className="p-2">Éxito</th>
              </tr>
            </thead>
            <tbody>
              {topAlumnosBajos.map((a) => (
                <tr key={a.id_alumno}>
                  <td className="p-2">{a.username}</td>
                  <td className="p-2">{a.intentos}</td>
                  <td className="p-2">{a.errores}</td>
                  <td className="p-2">{a.porcentaje_exito}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div className="w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Seleccionar Alumno para Gráficas</h4>
              <select
                onChange={(e) => setSelectedAlumnoId(e.target.value)}
                className="p-2 border rounded-md w-full"
              >
                <option value="global">Grupo Completo</option>
                {alumnos.map((a) => (
                  <option key={a.id_alumno} value={a.id_alumno}>
                    {a.no_lista} - {a.username}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="text-xl font-semibold text-center">
              Promedio de Éxito: {alumnoSeleccionado ? alumnoSeleccionado.porcentaje_exito : promedioExito}%
            </h3>

            <div className="flex flex-col items-center">
              <h4 className="text-lg font-semibold mb-4">Gráfico de Dona - Fallos vs Éxitos</h4>
              <ReactApexChart
                options={donaData.options}
                series={donaData.series}
                type="donut"
                width="380"
              />
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-lg font-semibold mb-4">Gráfico Radial - Por Nivel</h4>
              <ReactApexChart
                options={radialData.options}
                series={radialData.series}
                type="radar"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
    </div></div>
  );
};

export default Dashboard;
