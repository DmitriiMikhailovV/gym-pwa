import { Button } from '../atoms/Button'
import { CircularProgress } from '@mui/material'
import { Sync, Logout, PhoneIphone } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'

interface ProfileActionsProps {
  onInstallClick: () => void
  onSyncClick: () => void
  onLogoutClick: () => void
  isSyncing: boolean
}

export const ProfileActions = ({
  onInstallClick,
  onSyncClick,
  onLogoutClick,
  isSyncing,
}: ProfileActionsProps) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        size="large"
        startIcon={<PhoneIphone />}
        onClick={onInstallClick}
        sx={{ mb: 2 }}
      >
        {t('profile.howToInstall')}
      </Button>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        startIcon={isSyncing ? <CircularProgress size={20} color="inherit" /> : <Sync />}
        onClick={onSyncClick}
        disabled={isSyncing}
      >
        {isSyncing ? t('profile.syncing') : t('profile.sync')}
      </Button>

      <Button
        fullWidth
        variant="outlined"
        color="error"
        size="large"
        startIcon={<Logout />}
        onClick={onLogoutClick}
        sx={{ mt: 2 }}
      >
        {t('profile.logout')}
      </Button>
    </Box>
  )
}
