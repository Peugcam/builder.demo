import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Helper functions
export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string, username: string) {
  const supabase = createClient()

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('No user returned')

  // Create profile
  const { error: profileError } = await supabase
    .from('builder_profiles')
    .insert({
      id: authData.user.id,
      username,
      display_name: username,
      email,
    })

  if (profileError) throw profileError

  return authData
}
