import { useEffect } from 'react'
import { useUiStore } from '@app/store/uiStore.js'

export default function ThemeProvider({ children }) {
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return children
}
