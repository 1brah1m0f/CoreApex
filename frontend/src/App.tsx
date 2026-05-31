import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { APIProvider } from '@vis.gl/react-google-maps'
import Landing from './pages/Landing'
import AuthPage from './pages/AuthPage'
import CitizenPage from './pages/CitizenPage'
import NewReport from './pages/citizen/NewReport'
import InspectorPage from './pages/inspector/InspectorPage'
import ExecutivePage from './pages/executive/ExecutivePage'
import InstallBanner from './components/InstallBanner'

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function ProtectedRoute({ role, children }: { role: string; children: React.ReactElement }): React.ReactElement {
  const token = localStorage.getItem('apexcore_token')
  const storedRole = localStorage.getItem('apexcore_role')
  if (!token || token === 'undefined') return <Navigate to="/auth" replace />
  if (storedRole && storedRole !== role) return <Navigate to={`/${storedRole}`} replace />
  return children
}

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/citizen', element: <ProtectedRoute role="citizen"><CitizenPage /></ProtectedRoute> },
  { path: '/citizen/reports/new', element: <ProtectedRoute role="citizen"><NewReport /></ProtectedRoute> },
  { path: '/inspector', element: <ProtectedRoute role="inspector"><InspectorPage /></ProtectedRoute> },
  { path: '/inspector/*', element: <ProtectedRoute role="inspector"><InspectorPage /></ProtectedRoute> },
  { path: '/executive', element: <ProtectedRoute role="executive"><ExecutivePage /></ProtectedRoute> },
  { path: '/executive/*', element: <ProtectedRoute role="executive"><ExecutivePage /></ProtectedRoute> },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return (
    <APIProvider apiKey={MAPS_API_KEY}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
      <InstallBanner />
    </APIProvider>
  )
}
