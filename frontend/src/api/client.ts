import axios from 'axios'

// Dev-də Vite proxy işləyir (/api/v1 → localhost:8000).
// Production-da VITE_API_URL=https://coreapex.onrender.com təyin edin.
const baseURL = import.meta.env.VITE_API_URL ?? '/api/v1'

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use(config => {
  const token = localStorage.getItem('apexcore_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  res => res.data,
  err => {
    const isAuthRoute = err.config?.url?.includes('/auth/login') || err.config?.url?.includes('/auth/register');
    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('apexcore_token')
      localStorage.removeItem('apexcore_role')
      if (window.location.pathname !== '/auth') {
        window.location.href = '/'
      }
    }
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Xəta baş verdi'
    return Promise.reject(new Error(msg))
  }
)

export default client
