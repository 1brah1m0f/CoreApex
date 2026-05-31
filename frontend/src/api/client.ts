import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

interface CustomAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'patch' | 'delete'> {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const client = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
}) as unknown as CustomAxiosInstance

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

const originalPost = client.post;
client.post = async function<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  if (url.includes('/auth/login') || url.includes('/auth/register')) {
    const email = (data?.email || '').toLowerCase();
    
    let role = 'citizen';
    if (email.includes('exec')) {
      role = 'executive';
    } else if (email.includes('inspect')) {
      role = 'inspector';
    }

    await new Promise(r => setTimeout(r, 500)); // Delay simulyasiyası

    return {
      access_token: `mock_token_${role}_${Date.now()}`,
      role: role,
      user: {
        id: `mock_id_${role}`,
        email: email || 'user@test.com',
        name: data?.name || `${role.charAt(0).toUpperCase() + role.slice(1)} (Mock)`
      }
    } as unknown as T;
  }
  return originalPost.call(client, url, data, config) as Promise<T>;
};

export default client
