import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation()

  return (
    <Card sx={{ bgcolor: 'background.paper', borderRadius: '12px', mb: 3 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {t('profile.language')}
        </Typography>
        <ToggleButtonGroup
          value={i18n.language.split('-')[0]}
          exclusive
          onChange={(_, newLang) => {
            if (newLang) i18n.changeLanguage(newLang)
          }}
          fullWidth
          color="primary"
          sx={{ mb: 1 }}
        >
          <ToggleButton value="en" sx={{ overflow: 'hidden' }}>
            <Box
              component="span"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              English
            </Box>
          </ToggleButton>
          <ToggleButton value="ru" sx={{ overflow: 'hidden' }}>
            <Box
              component="span"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              Русский
            </Box>
          </ToggleButton>
          <ToggleButton value="cs" sx={{ overflow: 'hidden' }}>
            <Box
              component="span"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              Čeština
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  )
}
