import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@componentes/layout/MainLayout'
import { ProtectedRoute } from '@componentes/auth/ProtectedRoute'
import Login from '@paginas/Login'
import Dashboard from '@paginas/Dashboard'
import Evaluaciones from '@paginas/Evaluaciones/Evaluaciones'
import Estudiantes from '@paginas/Estudiantes/Estudiantes'
import Asistencias from '@paginas/Asistencias/Asistencias'
import Clases from '@paginas/Clases/Clases'
import Periodos from '@paginas/Periodos/Periodos'
import Parciales from '@paginas/Parciales/Parciales'
import Secciones from '@paginas/Secciones/Secciones'
import Aulas from '@paginas/Aulas/Aulas'
import Usuarios from '@paginas/Usuarios/Usuarios'
import Perfil from '@paginas/Perfil/Perfil'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="evaluaciones" element={<Evaluaciones />} />
        <Route path="estudiantes" element={<Estudiantes />} />
        <Route path="clases" element={<Clases />} />
        <Route path="secciones" element={<Secciones />} />
        <Route path="periodos" element={<Periodos />} />
        <Route path="parciales" element={<Parciales />} />
        <Route path="aulas" element={<Aulas />} />
        <Route path="asistencias" element={<Asistencias />} />
        <Route path="proyectos" element={<div>Proyectos (próximamente)</div>} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="analisis" element={<div>Análisis (próximamente)</div>} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
