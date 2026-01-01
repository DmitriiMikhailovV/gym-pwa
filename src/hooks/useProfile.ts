import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { syncWithSupabase } from '../services/dataSync'
import { useTranslation } from 'react-i18next'

export const useProfile = () => {
  const { t } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info'
  } | null>(null)
  const [showInstallPage, setShowInstallPage] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleSync = async () => {
    if (!user) return

    setSyncing(true)
    try {
      await syncWithSupabase(user.id)
      setSnackbar({ open: true, message: t('profile.syncSuccess'), severity: 'success' })
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: t('profile.syncError'), severity: 'error' })
    } finally {
      setSyncing(false)
    }
  }

  const closeSnackbar = () => setSnackbar(null)

  return {
    user,
    loading,
    syncing,
    snackbar,
    closeSnackbar,
    showInstallPage,
    setShowInstallPage,
    handleLogout,
    handleSync,
  }
}
