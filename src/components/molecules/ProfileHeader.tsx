import { Avatar, Card, CardContent, Typography } from '@mui/material'

interface ProfileHeaderProps {
  email: string | undefined
}

export const ProfileHeader = ({ email }: ProfileHeaderProps) => {
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <Card sx={{ bgcolor: 'background.paper', borderRadius: '12px', mb: 3 }}>
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            fontSize: 32,
            fontWeight: 700,
            mx: 'auto',
            mb: 2,
          }}
        >
          {email ? getInitials(email) : '?'}
        </Avatar>
        <Typography variant="body2" color="text.secondary">
          {email || 'email@example.com'}
        </Typography>
      </CardContent>
    </Card>
  )
}
