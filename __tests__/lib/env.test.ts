import { env } from '@/lib/env'

describe('Environment Variables', () => {
  it('exports env object', () => {
    expect(env).toBeDefined()
    expect(env.supabase).toBeDefined()
  })

  it('has supabase configuration', () => {
    expect(env.supabase.url).toBeDefined()
    expect(env.supabase.anonKey).toBeDefined()
  })

  it('has environment flags', () => {
    expect(typeof env.isDevelopment).toBe('boolean')
    expect(typeof env.isProduction).toBe('boolean')
    expect(typeof env.isTest).toBe('boolean')
  })

  it('correctly identifies test environment', () => {
    expect(env.isTest).toBe(true)
    expect(env.isDevelopment).toBe(false)
    expect(env.isProduction).toBe(false)
  })
})
