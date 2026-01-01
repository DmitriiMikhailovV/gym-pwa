export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  vibrate?: number[]
  tag?: string
  requireInteraction?: boolean
}

export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
}

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported')
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  const permission = await Notification.requestPermission()
  return permission
}

export const checkServiceWorkerStatus = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    return registration.active !== null
  } catch (error) {
    console.error('❌ Failed to check Service Worker:', error)
    return false
  }
}

// Fallback checking for local notifications (only works when app is open)
export const showLocalNotification = async (title: string, options: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    const registration = await navigator.serviceWorker.ready
    return registration.showNotification(title, options)
  }
}
