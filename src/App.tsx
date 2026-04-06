import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import { useOrganizationStore } from './stores/organizationStore'
import { useAuthStore } from './stores/authStore'

const App = () => {
  const getUserOrganizations = useOrganizationStore((s) => s.getUserOrganizations)
  const resetOrganizationSession = useOrganizationStore((s) => s.resetOrganizationSession)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      getUserOrganizations().catch(() => {})
    } else {
      resetOrganizationSession()
    }
  }, [getUserOrganizations, isAuthenticated, resetOrganizationSession])

  return <AppRouter />
}

export default App
