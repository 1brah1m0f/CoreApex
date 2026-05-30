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

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function guard(role: string, element: React.ReactElement): React.ReactElement {
  const token = localStorage.getItem('apexcore_token')
  const storedRole = localStorage.getItem('apexcore_role')
  if (!token || token === 'undefined') return <Navigate to="/auth" replace />
  if (storedRole && storedRole !== role) return <Navigate to={`/${storedRole}`} replace />
  return element
}

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/citizen', element: guard('citizen', <CitizenPage />) },
  { path: '/citizen/reports/new', element: guard('citizen', <NewReport />) },
  { path: '/inspector', element: guard('inspector', <InspectorPage />) },
  { path: '/inspector/*', element: guard('inspector', <InspectorPage />) },
  { path: '/executive', element: guard('executive', <ExecutivePage />) },
  { path: '/executive/*', element: guard('executive', <ExecutivePage />) },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return (
    <APIProvider apiKey={MAPS_API_KEY}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </APIProvider>
  )
}
