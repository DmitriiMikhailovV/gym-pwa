import { createTheme, PaletteMode } from '@mui/material/styles'

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          // Dark Mode
          primary: { main: '#0A84FF' },
          secondary: { main: '#30D158' },
          error: { main: '#FF453A' },
          background: { default: '#000000', paper: '#1C1C1E' },
          text: { primary: '#FFFFFF', secondary: 'rgba(235, 235, 245, 0.6)' },
        }
      : {
          // Light Mode
          primary: { main: '#007AFF' },
          secondary: { main: '#34C759' },
          error: { main: '#FF3B30' },
          background: { default: '#F2F2F7', paper: '#FFFFFF' },
          text: { primary: '#000000', secondary: 'rgba(60, 60, 67, 0.6)' },
        }),
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h3: { fontWeight: 700, fontSize: '34px', lineHeight: 1.2, letterSpacing: '-0.5px' },
    h4: { fontWeight: 700, fontSize: '28px', lineHeight: 1.2, letterSpacing: '-0.4px' },
    h5: { fontWeight: 600, fontSize: '22px', lineHeight: 1.3, letterSpacing: '-0.3px' },
    h6: { fontWeight: 600, fontSize: '17px', lineHeight: 1.4 },
    body1: { fontSize: '17px', lineHeight: 1.5, letterSpacing: '-0.4px' },
    body2: { fontSize: '15px', lineHeight: 1.4, letterSpacing: '-0.2px' },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '17px', letterSpacing: '-0.4px' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '14px 20px',
          boxShadow: 'none',
          fontWeight: 600,
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        outlined: {
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
          '&:hover': {
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#1C1C1E' : '#FFFFFF',
        },
        elevation0: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(249, 249, 249, 0.8)',
          backdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: `0.5px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: 'none',
          color: mode === 'dark' ? '#fff' : '#000',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(249, 249, 249, 0.8)',
          backdropFilter: 'saturate(180%) blur(20px)',
          borderTop: `0.5px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          height: '83px',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)',
          minWidth: '60px',
          padding: '6px 0 2px',
          '&.Mui-selected': {
            color: mode === 'dark' ? '#0A84FF' : '#007AFF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: mode === 'dark' ? '#1C1C1E' : '#FFFFFF',
          boxShadow: 'none',
          border: `0.5px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            borderRadius: '10px',
            backgroundColor:
              mode === 'dark' ? 'rgba(118, 118, 128, 0.24)' : 'rgba(118, 118, 128, 0.12)',
            border: 'none',
            '&:hover': {
              backgroundColor:
                mode === 'dark' ? 'rgba(118, 118, 128, 0.3)' : 'rgba(118, 118, 128, 0.18)',
            },
            '&.Mui-focused': {
              backgroundColor:
                mode === 'dark' ? 'rgba(118, 118, 128, 0.32)' : 'rgba(118, 118, 128, 0.2)',
            },
            '&:before, &:after': { display: 'none' },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `0.5px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
          padding: '12px 8px',
          color: mode === 'dark' ? '#fff' : '#000',
        },
        head: {
          color: mode === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)',
        },
      },
    },
  },
})

export const getTheme = (mode: PaletteMode) => createTheme(getDesignTokens(mode))
export default getTheme('dark') // Default fallback
