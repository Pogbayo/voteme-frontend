import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    // console.log('Attaching token to request:', token) 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState()

      const isAuthPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register'

      if (!isAuthPage) {
        logout() 
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance