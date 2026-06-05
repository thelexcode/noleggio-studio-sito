import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: 'public',
    },
    auth: {
        persistSession: true,
        autoRefreshToken: true,          // Auto-refresh token before expiry
        detectSessionInUrl: true,         // Detect session from URL (OAuth)
        flowType: 'pkce',                 // Use PKCE flow (more secure)
        storage: window.localStorage,     // Use localStorage (default)
        storageKey: 'supabase.auth.token', // Custom key to avoid conflicts
        // Bypass the Web Locks API to prevent orphaned locks and AbortError in React 19 Strict Mode
        lock: async (_name, _acquireTimeout, fn) => fn(),
    },
    global: {
        headers: {
            'X-Client-Info': 'noleggio-studio-web'
        }
    }
})
