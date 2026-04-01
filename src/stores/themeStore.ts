import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggleDark: () => void
}
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false, 

      toggleDark: () => {
        set((state) => {
          const newDark = !state.isDark

          if (newDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          
         localStorage.setItem('theme', newDark ? 'dark' : 'light')

          return { isDark: newDark }
        })
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)