import { Box, Typography, Button, Snackbar, Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { InstallPage } from './InstallPage'
import {
  ProfileHeader,
  ThemeSelector,
  LanguageSelector,
  UserDetailsList,
  ProfileActions,
} from '../components'
import { useProfile } from '../hooks/useProfile'

export const ProfilePage = () => {
  const { t } = useTranslation()
  const {
    user,
    loading,
    syncing,
    snackbar,
    closeSnackbar,
    showInstallPage,
    setShowInstallPage,
    handleLogout,
    handleSync,
  } = useProfile()

  if (showInstallPage) {
    return (
      <Box>
        <Button onClick={() => setShowInstallPage(false)} sx={{ mb: 2 }}>
          ← {t('profile.profile')}
        </Button>
        <InstallPage />
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography>{t('profile.loading')}</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, mt: 1, fontWeight: 800 }}>
        {t('headers.profile')}
      </Typography>

      <ProfileHeader email={user?.email} />

      <ThemeSelector />

      <LanguageSelector />

      <UserDetailsList user={user} />

      <ProfileActions
        onInstallClick={() => setShowInstallPage(true)}
        onSyncClick={handleSync}
        onLogoutClick={handleLogout}
        isSyncing={syncing}
      />

      <Snackbar
        open={!!snackbar?.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar?.severity || 'info'} sx={{ width: '100%' }}>
          {snackbar?.message}
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          GymTracker
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('profile.version')} {__APP_VERSION__}
        </Typography>
      </Box>
    </Box>
  )
}
