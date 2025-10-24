'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    checkUser()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-gray-800 bg-background-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">🏗️</span>
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Builder Hub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/forum" isActive={isActive('/forum')}>
              Fórum
            </NavLink>
            <NavLink href="/projects" isActive={isActive('/projects')}>
              Projetos
            </NavLink>
            <NavLink href="/dashboard" isActive={isActive('/dashboard')}>
              Dashboard
            </NavLink>
            {user && (
              <NavLink href="/admin" isActive={isActive('/admin')}>
                Admin
              </NavLink>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-8 bg-gray-700 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  {user.email}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm px-4 py-2 hover:text-primary transition"
                >
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className="text-sm px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition font-semibold"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string
  isActive: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition ${
        isActive
          ? 'text-primary'
          : 'text-gray-300 hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}
