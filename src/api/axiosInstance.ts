import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7251/api',
})

// ✅ Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    console.log('Attaching token to request:', token) // Debug log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ FIXED: safer 401 handling (NO reload loop)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState()

      // Avoid redirect loop if already on auth pages
      const isAuthPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register'

      if (!isAuthPage) {
        logout() // clears Zustand properly
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance