import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { PhoneIphone, PhoneAndroid, CheckCircle } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export const InstallPage = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, mt: 1 }}>
        <Box
          component="img"
          src="/pwa-192x192.png"
          alt="GymTracker"
          sx={{
            width: 56,
            height: 56,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {t('install.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('install.subtitle')}
          </Typography>
        </Box>
      </Box>

      {/* iOS Installation */}
      <Card sx={{ bgcolor: 'background.paper', borderRadius: '12px', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PhoneIphone color="primary" sx={{ fontSize: 32, mr: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('install.iosTitle')}
            </Typography>
          </Box>
          <List sx={{ py: 0 }}>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  1
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('install.iosStep1')} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  2
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('install.iosStep2')} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  3
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('install.iosStep3')} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  4
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('install.iosStep4')} />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Android Installation */}
      <Card sx={{ bgcolor: 'background.paper', borderRadius: '12px', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PhoneAndroid color="secondary" sx={{ fontSize: 32, mr: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('install.androidTitle')}
            </Typography>
          </Box>
          <List sx={{ py: 0 }}>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  1
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('install.androidStep1')} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  2
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('install.androidStep2')} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  3
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('install.androidStep3')} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  4
                </Box>
              </ListItemIcon>
              <ListItemText primary={t('install.androidStep4')} />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card sx={{ bgcolor: 'background.paper', borderRadius: '12px', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {t('install.benefits')}
          </Typography>
          <List sx={{ py: 0 }}>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary={t('install.benefit1')} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary={t('install.benefit2')} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary={t('install.benefit3')} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary={t('install.benefit4')} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}
