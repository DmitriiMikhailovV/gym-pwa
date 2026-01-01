import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { DarkMode, LightMode, SettingsBrightness } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useThemeContext } from '../../context/ThemeContext'

export const ThemeSelector = () => {
  const { t } = useTranslation()
  const { themeMode, setThemeMode } = useThemeContext()

  return (
    <Card sx={{ bgcolor: 'background.paper', borderRadius: '12px', mb: 3 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {t('profile.appearance')}
        </Typography>
        <ToggleButtonGroup
          value={themeMode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode) setThemeMode(newMode)
          }}
          fullWidth
          color="primary"
          sx={{ mb: 1 }}
        >
          <ToggleButton value="light" sx={{ overflow: 'hidden' }}>
            <LightMode sx={{ mr: 0.5, fontSize: 20, flexShrink: 0 }} />
            <Box
              component="span"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {t('profile.theme.light')}
            </Box>
          </ToggleButton>
          <ToggleButton value="dark" sx={{ overflow: 'hidden' }}>
            <DarkMode sx={{ mr: 0.5, fontSize: 20, flexShrink: 0 }} />
            <Box
              component="span"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {t('profile.theme.dark')}
            </Box>
          </ToggleButton>
          <ToggleButton value="system" sx={{ overflow: 'hidden' }}>
            <SettingsBrightness sx={{ mr: 0.5, fontSize: 20, flexShrink: 0 }} />
            <Box
              component="span"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {t('profile.theme.system')}
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  )
}
