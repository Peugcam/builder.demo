import { createClient } from '@/lib/supabase'

describe('Supabase Client', () => {
  it('creates a client instance', () => {
    const client = createClient()
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
    expect(client.from).toBeDefined()
  })

  it('has auth methods', () => {
    const client = createClient()
    expect(typeof client.auth.signInWithPassword).toBe('function')
    expect(typeof client.auth.signUp).toBe('function')
    expect(typeof client.auth.signOut).toBe('function')
    expect(typeof client.auth.getUser).toBe('function')
  })

  it('can query tables', () => {
    const client = createClient()
    const query = client.from('builder_profiles').select('*')
    expect(query).toBeDefined()
  })
})
