import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'
import { Client } from 'npm:@upstash/qstash@2'

// Node/Deno compatibility polyfills if needed are handled by the runtime usually,
// but let's stick to simple npm imports supported by Supabase.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')
    const qstashToken = Deno.env.get('QSTASH_TOKEN')
    const authorizedEmail = Deno.env.get('CONTACT_EMAIL') || 'mailto:admin@example.com'
    const functionPublicUrl = Deno.env.get('FUNCTION_PUBLIC_URL')

    if (
      !supabaseUrl ||
      !supabaseServiceKey ||
      !vapidPublicKey ||
      !vapidPrivateKey ||
      !qstashToken ||
      !functionPublicUrl
    ) {
      throw new Error('Server misconfiguration: Missing env vars')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const qstash = new Client({ token: qstashToken })

    webpush.setVapidDetails(authorizedEmail, vapidPublicKey, vapidPrivateKey)

    const payload = await req.json()
    const { action } = payload

    if (action === 'SCHEDULE') {
      const { delay, title, body, userAgent } = payload

      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Invalid Token' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      console.log(`[SCHEDULE] Scheduling push for user ${user.id} in ${delay}s`)

      const result = await qstash.publishJSON({
        url: functionPublicUrl,
        body: {
          action: 'SEND',
          userId: user.id,
          userAgent,
          title,
          body,
        },
        delay: delay,
      })

      return new Response(JSON.stringify({ message: 'Scheduled', messageId: result.messageId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'SEND') {
      console.log('[SEND] QStash triggered send.')

      const { userId, userAgent, title, body } = payload

      let query = supabase.from('push_subscriptions').select('subscription').eq('user_id', userId)

      if (userAgent) {
        query = query.eq('user_agent', userAgent)
      }

      const { data: subs, error } = await query

      if (error || !subs || subs.length === 0) {
        return new Response(JSON.stringify({ error: 'No subscription' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      for (const subRecord of subs) {
        const subscription = subRecord.subscription
        try {
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              title,
              body,
              icon: '/pwa-192x192.png',
            })
          )
        } catch (err) {
          console.error('[SEND] Error sending push', err)
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .match({ user_id: userId, subscription: subscription })
          }
        }
      }

      return new Response(JSON.stringify({ status: 'Sent' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Global Error', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
