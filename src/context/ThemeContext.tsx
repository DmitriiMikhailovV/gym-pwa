import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { getTheme } from '../styles/theme'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextType {
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
})

export const useThemeContext = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme-preference')
    return (savedMode as ThemeMode) || 'system'
  })

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    localStorage.setItem('theme-preference', themeMode)
  }, [themeMode])

  const theme = useMemo(() => {
    let mode: 'light' | 'dark'

    if (themeMode === 'system') {
      mode = prefersDarkMode ? 'dark' : 'light'
    } else {
      mode = themeMode
    }

    return getTheme(mode)
  }, [themeMode, prefersDarkMode])

  // Update meta theme-color for iOS status bar
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.palette.background.default)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}
