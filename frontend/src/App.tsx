import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { APIProvider } from '@vis.gl/react-google-maps'
import Landing from './pages/Landing'
import CitizenPage from './pages/CitizenPage'
import InspectorPage from './pages/inspector/InspectorPage'
import ExecutivePage from './pages/executive/ExecutivePage'

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/citizen', element: <CitizenPage /> },
  { path: '/inspector', element: <InspectorPage /> },
  { path: '/executive', element: <ExecutivePage /> },
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
