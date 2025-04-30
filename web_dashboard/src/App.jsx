import { StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User from "./user";
import Login from "./login";
import Menu from "./menu";

import Ralumno from "./rAlumno";
import Radmin from "./rAdmin";
import Rprofesor from "./rProfesor";
import Registrar from "./registrar";

import Ealumno from "./eAlumno";
import Eadmin from "./eAdmin";
import Eprofesor from "./eProfesor";
import Eliminar from "./Eliminar";

import Aalumno from "./aAlumno";
import Aadmin from "./aAdmin";
import Aprofesor from "./aProfesor";
import Actualizar from "./Actualizar";

import ListaAlumnos from "./Alumnos";
import ListaGrupos from "./Grupos";
import Dashboard from "./Dashboard"

function App() {
  return (
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />

          <Route path="/registrar" element={<Registrar />} />
          <Route path="/registrar/alumno" element={<Ralumno />} />
          <Route path="/registrar/admin" element={<Radmin />} />
          <Route path="/registrar/profesor" element={<Rprofesor />} />

          <Route path="/actualizar" element={<Actualizar />} />
          <Route path="/actualizar/alumno" element={<Aalumno />} />
          <Route path="/actualizar/admin" element={<Aadmin />} />
          <Route path="/actualizar/profesor" element={<Aprofesor />} />

          <Route path="/eliminar" element={<Eliminar />} />
          <Route path="/eliminar/alumno" element={<Ealumno />} />
          <Route path="/eliminar/admin" element={<Eadmin />} />
          <Route path="/eliminar/profesor" element={<Eprofesor />} />


          <Route path="/alumnos" element={<ListaAlumnos />} />
          <Route path="/grupos" element={<ListaGrupos />} />
          <Route path="/dashboard/:id_grupo" element={<Dashboard />} />
          
        </Routes>
      </Router>
    </StrictMode>
  );
}

export default App;