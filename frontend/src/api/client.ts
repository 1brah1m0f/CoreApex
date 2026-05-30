import axios from 'axios'

const client = axios.create({
  baseURL: '/api/v1',
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
    if (err.response?.status === 401) {
      localStorage.removeItem('apexcore_token')
      localStorage.removeItem('apexcore_role')
      window.location.href = '/'
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
