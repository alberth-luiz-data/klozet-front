import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  refresh: (refresh) => api.post('/auth/refresh/', { refresh }),
}

export const clientesService = {
  listar: () => api.get('/clientes/'),
  buscar: (id) => api.get(`/clientes/${id}/`),
  criar: (dados) => api.post('/clientes/', dados),
  atualizar: (id, dados) => api.put(`/clientes/${id}/`, dados),
  deletar: (id) => api.delete(`/clientes/${id}/`),
}

export const pecasService = {
  listar: () => api.get('/pecas/'),
  buscar: (id) => api.get(`/pecas/${id}/`),
  criar: (dados) => api.post('/pecas/', dados),
  atualizar: (id, dados) => api.put(`/pecas/${id}/`, dados),
  deletar: (id) => api.delete(`/pecas/${id}/`),
}

export const reservasService = {
  listar: () => api.get('/reservas/'),
  buscar: (id) => api.get(`/reservas/${id}/`),
  criar: (dados) => api.post('/reservas/', dados),
  atualizar: (id, dados) => api.put(`/reservas/${id}/`, dados),
  deletar: (id) => api.delete(`/reservas/${id}/`),
}

export default api