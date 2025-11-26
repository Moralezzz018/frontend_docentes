import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@componentes/layout/MainLayout'
import { ProtectedRoute } from '@componentes/auth/ProtectedRoute'
import Login from '@paginas/Login'
import Dashboard from '@paginas/Dashboard'
import Evaluaciones from '@paginas/Evaluaciones/Evaluaciones'

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
        <Route path="estudiantes" element={<div>Estudiantes (próximamente)</div>} />
        <Route path="clases" element={<div>Clases (próximamente)</div>} />
        <Route path="periodos" element={<div>Periodos (próximamente)</div>} />
        <Route path="asistencias" element={<div>Asistencias (próximamente)</div>} />
        <Route path="proyectos" element={<div>Proyectos (próximamente)</div>} />
        <Route path="analisis" element={<div>Análisis (próximamente)</div>} />
        <Route path="perfil" element={<div>Perfil (próximamente)</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
