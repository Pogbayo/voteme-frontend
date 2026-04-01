import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import { useOrganizationStore } from './stores/organizationStore'
import { useAuthStore } from './stores/authStore'

const App = () => {
  const hydrateOrganization = useOrganizationStore((s) => s.hydrateOrganization)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      hydrateOrganization()
    }
  }, [isAuthenticated])

  return <AppRouter />
}

export default App