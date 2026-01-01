import { Card, CardContent, Divider, List, ListItem, ListItemText } from '@mui/material'
import { Email, CalendarToday, Person as PersonIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { User } from '@supabase/supabase-js'

interface UserDetailsListProps {
  user: User | null
}

export const UserDetailsList = ({ user }: UserDetailsListProps) => {
  const { t, i18n } = useTranslation()

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('profile.notSpecified')
    const date = new Date(dateString)
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card sx={{ bgcolor: 'background.paper', borderRadius: '12px', mb: 3 }}>
      <CardContent sx={{ p: 0 }}>
        <List sx={{ py: 0 }}>
          <ListItem sx={{ py: 2, px: 3 }}>
            <Email sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
              primary={t('profile.email')}
              secondary={user?.email || t('profile.notSpecified')}
              primaryTypographyProps={{ fontWeight: 600, fontSize: 15 }}
              secondaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItem>

          <Divider sx={{ mx: 2 }} />

          <ListItem sx={{ py: 2, px: 3 }}>
            <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
              primary={t('profile.registrationDate')}
              secondary={formatDate(user?.created_at)}
              primaryTypographyProps={{ fontWeight: 600, fontSize: 15 }}
              secondaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItem>

          <Divider sx={{ mx: 2 }} />

          <ListItem sx={{ py: 2, px: 3 }}>
            <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
              primary={t('profile.userId')}
              secondary={user?.id?.substring(0, 8) + '...' || t('profile.unknown')}
              primaryTypographyProps={{ fontWeight: 600, fontSize: 15 }}
              secondaryTypographyProps={{ fontSize: 14, fontFamily: 'monospace' }}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
}
