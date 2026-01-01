import { supabase } from './supabaseClient'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

if (!VAPID_PUBLIC_KEY) {
  console.error('⚠️ VITE_VAPID_PUBLIC_KEY is missing in .env')
}

// Helper: Convert VAPID key
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const subscribeToPushNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription && VAPID_PUBLIC_KEY) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
    }

    // Always update subscription in DB to ensure it's fresh
    if (subscription) {
      await saveSubscriptionToSupabase(subscription)
    }

    return subscription
  } catch (error) {
    console.error('❌ Failed to subscribe:', error)
    return null
  }
}

const saveSubscriptionToSupabase = async (subscription: PushSubscription) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: user.id,
      subscription: subscription.toJSON(),
      user_agent: navigator.userAgent,
    },
    { onConflict: 'user_id, user_agent' }
  )

  if (error) console.error('Error saving subscription:', error)
}

export const scheduleServerNotification = async (
  delaySeconds: number,
  title: string,
  body: string
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.warn('No session for push scheduling')
    return
  }

  try {
    // Call the Edge Function directly
    const { data, error } = await supabase.functions.invoke('push-timer', {
      body: {
        action: 'SCHEDULE',
        delay: delaySeconds,
        title,
        body,
        // We pass the user agent to help identifying the correct subscription on server
        userAgent: navigator.userAgent,
      },
    })

    if (error) throw error
    console.log('✅ Notification scheduled via Edge Function:', data)
  } catch (error) {
    console.error('❌ Failed to schedule server notification:', error)
  }
}

export const cancelServerNotification = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return

  // Optional: If we implement cancellation logic (requires storing task ID from QStash)
  // For now, simple fire-and-forget is implemented.
  // QStash supports cancellation if we store the message ID.
}
