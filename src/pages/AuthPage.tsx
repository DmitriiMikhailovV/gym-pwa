import { useState } from 'react'
import { Box, Alert, Typography, Container, InputAdornment, IconButton, Link } from '@mui/material'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { supabase } from '../services/supabaseClient'
import { useTranslation } from 'react-i18next'

export const AuthPage = () => {
  const { t } = useTranslation()
  const [view, setView] = useState<'login' | 'signup' | 'forgot_password'>('login')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{
    type: 'error' | 'success' | 'warning'
    text: string
  } | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else if (view === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        })
        if (error) throw error
        if (data.user && data.session === null) {
          setMessage({ type: 'success', text: t('auth.successSignup') })
        }
      } else if (view === 'forgot_password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        })
        if (error) throw error
        setMessage({ type: 'success', text: t('auth.successReset') })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || t('auth.errorGeneric') })
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (view) {
      case 'login':
        return t('auth.loginTitle')
      case 'signup':
        return t('auth.signupTitle')
      case 'forgot_password':
        return t('auth.forgotPasswordTitle')
    }
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
          {t('auth.gymTracker')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {view === 'forgot_password' ? t('auth.restoreAccess') : t('auth.pocketTrainer')}
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleAuth}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Input
          required
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {view !== 'forgot_password' && (
          <Input
            required
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            mt: 1.5,
            height: 50,
          }}
        >
          {loading ? t('auth.loading') : getTitle()}
        </Button>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2 }}>
          {view === 'login' && (
            <>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setView('forgot_password')
                  setMessage(null)
                }}
                type="button"
              >
                {t('auth.forgotPasswordLink')}
              </Link>
              <Typography variant="body2" color="text.secondary">
                {t('auth.noAccount')}{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    setView('signup')
                    setMessage(null)
                  }}
                  type="button"
                  sx={{ fontWeight: 600 }}
                >
                  {t('auth.registerLink')}
                </Link>
              </Typography>
            </>
          )}

          {view === 'signup' && (
            <Typography variant="body2" color="text.secondary">
              {t('auth.hasAccount')}{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setView('login')
                  setMessage(null)
                }}
                type="button"
                sx={{ fontWeight: 600 }}
              >
                {t('auth.loginLink')}
              </Link>
            </Typography>
          )}

          {view === 'forgot_password' && (
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                setView('login')
                setMessage(null)
              }}
              type="button"
            >
              {t('auth.backToLogin')}
            </Link>
          )}
        </Box>
      </Box>
    </Container>
  )
}
