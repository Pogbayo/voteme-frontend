import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  collapsed: boolean
  mobileOpen: boolean
  toggleCollapsed: () => void
  setMobileOpen: (v: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      collapsed: false,
      mobileOpen: false,
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
      setMobileOpen: (v) => set({ mobileOpen: v }),
    }),
    { name: 'ui-storage' }
  )
)