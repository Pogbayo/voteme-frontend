import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  requiredRole?: string
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuth()

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  // Logged in but wrong role → redirect to dashboard
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to='/dashboard' replace />
  }

  // All good → render the child routes
  return <Outlet />
}

export default ProtectedRoute