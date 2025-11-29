import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@componentes/layout/MainLayout'
import { ProtectedRoute } from '@componentes/auth/ProtectedRoute'
import { RoleProtectedRoute } from '@componentes/auth/RoleProtectedRoute'
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
        
        {/* Evaluaciones: ADMIN, DOCENTE, ESTUDIANTE */}
        <Route 
          path="evaluaciones" 
          element={
            <RoleProtectedRoute moduloRequerido="evaluaciones">
              <Evaluaciones />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Asistencias: ADMIN, DOCENTE, ESTUDIANTE */}
        <Route 
          path="asistencias" 
          element={
            <RoleProtectedRoute moduloRequerido="asistencias">
              <Asistencias />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Estudiantes: ADMIN, DOCENTE */}
        <Route 
          path="estudiantes" 
          element={
            <RoleProtectedRoute moduloRequerido="estudiantes">
              <Estudiantes />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Clases: ADMIN, DOCENTE */}
        <Route 
          path="clases" 
          element={
            <RoleProtectedRoute moduloRequerido="clases">
              <Clases />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Secciones: ADMIN, DOCENTE */}
        <Route 
          path="secciones" 
          element={
            <RoleProtectedRoute moduloRequerido="secciones">
              <Secciones />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Periodos: ADMIN, DOCENTE */}
        <Route 
          path="periodos" 
          element={
            <RoleProtectedRoute moduloRequerido="periodos">
              <Periodos />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Parciales: ADMIN, DOCENTE */}
        <Route 
          path="parciales" 
          element={
            <RoleProtectedRoute moduloRequerido="parciales">
              <Parciales />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Aulas: ADMIN, DOCENTE */}
        <Route 
          path="aulas" 
          element={
            <RoleProtectedRoute moduloRequerido="aulas">
              <Aulas />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Proyectos: ADMIN, DOCENTE */}
        <Route 
          path="proyectos" 
          element={
            <RoleProtectedRoute moduloRequerido="proyectos">
              <div>Proyectos (próximamente)</div>
            </RoleProtectedRoute>
          } 
        />
        
        {/* Usuarios: SOLO ADMIN */}
        <Route 
          path="usuarios" 
          element={
            <RoleProtectedRoute moduloRequerido="usuarios">
              <Usuarios />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Análisis: ADMIN, DOCENTE */}
        <Route 
          path="analisis" 
          element={
            <RoleProtectedRoute moduloRequerido="analisis">
              <div>Análisis (próximamente)</div>
            </RoleProtectedRoute>
          } 
        />
        
        {/* Perfil: Todos los roles */}
        <Route path="perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
