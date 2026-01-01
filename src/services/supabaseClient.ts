import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasCredentials = supabaseUrl && supabaseAnonKey

if (!hasCredentials) {
  console.warn('⚠️ Supabase credentials not configured. App will work in offline-only mode.')
  console.warn('To enable authentication, create .env file with:')
  console.warn('VITE_SUPABASE_URL=your-project-url')
  console.warn('VITE_SUPABASE_ANON_KEY=your-anon-key')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const isSupabaseConfigured = hasCredentials
