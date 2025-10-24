/**
 * Validação e tipagem de variáveis de ambiente
 * Garante que todas as variáveis necessárias estão definidas em build time
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

type EnvVarKey = (typeof requiredEnvVars)[number]

function getEnvVar(key: EnvVarKey): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

// Validar todas as variáveis de ambiente no build
if (typeof window === 'undefined') {
  requiredEnvVars.forEach((key) => {
    try {
      getEnvVar(key)
    } catch (error) {
      console.error(error)
      // Em desenvolvimento, mostrar warning mas não falhar
      if (process.env.NODE_ENV === 'production') {
        throw error
      }
    }
  })
}

export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const

// Type-safe access
export type Env = typeof env
