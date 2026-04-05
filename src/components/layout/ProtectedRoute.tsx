import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useOrganizationMember } from '../../hooks/useOrganizationMember'

interface ProtectedRouteProps {
  requiredRoles?: number[]
}

const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()
  const { memberShip } = useOrganizationMember()

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  // Logged in but wrong role → redirect to dashboard
  if (requiredRoles && !requiredRoles.includes(memberShip?.role ?? 0)) {
    return <Navigate to='/dashboard' replace />
  }

  // All good → render the child routes
  return <Outlet />
}

export default ProtectedRoute