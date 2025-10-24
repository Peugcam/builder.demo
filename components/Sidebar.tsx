'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['comunidade'])
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

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(m => m !== menuName)
        : [...prev, menuName]
    )
  }

  const isActive = (path: string) => pathname === path
  const isMenuExpanded = (menuName: string) => expandedMenus.includes(menuName)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0a0a0a] border-r border-gray-800
          flex flex-col z-40 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">🏗️</span>
            </div>
            <span className="font-bold text-lg text-white">Builder Hub</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Aulas */}
          <SidebarMenuItem
            href="/aulas"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            isActive={isActive('/aulas')}
            onClick={() => setIsOpen(false)}
          >
            Aulas
          </SidebarMenuItem>

          {/* Comunidade Section */}
          <div className="mb-2">
            <button
              onClick={() => toggleMenu('comunidade')}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition group"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium">Comunidade</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isMenuExpanded('comunidade') ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {isMenuExpanded('comunidade') && (
              <div className="ml-6 mt-1 space-y-1">
                <SidebarLink
                  href="/"
                  isActive={isActive('/')}
                  onClick={() => setIsOpen(false)}
                >
                  Feed
                </SidebarLink>
                <SidebarLink
                  href="/forum"
                  isActive={isActive('/forum')}
                  onClick={() => setIsOpen(false)}
                >
                  Fórum
                </SidebarLink>
                <SidebarLink
                  href="/projects"
                  isActive={isActive('/projects')}
                  onClick={() => setIsOpen(false)}
                >
                  Projetos
                </SidebarLink>
              </div>
            )}
          </div>

          {/* Dashboard */}
          <SidebarMenuItem
            href="/dashboard"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            isActive={isActive('/dashboard')}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </SidebarMenuItem>

          {/* Admin (apenas se logado) */}
          {user && (
            <SidebarMenuItem
              href="/admin"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
              isActive={isActive('/admin')}
              onClick={() => setIsOpen(false)}
            >
              Admin
            </SidebarMenuItem>
          )}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-800 p-4">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center font-bold text-white">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
                title="Sair"
              >
                <svg
                  className="w-4 h-4 text-gray-400 hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="block w-full text-center px-4 py-2 text-sm bg-primary hover:bg-primary-dark rounded-lg font-semibold transition"
                onClick={() => setIsOpen(false)}
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function SidebarMenuItem({
  href,
  icon,
  isActive,
  children,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  isActive: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition mb-1
        ${isActive
          ? 'bg-primary/20 text-primary'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }
      `}
    >
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </Link>
  )
}

function SidebarLink({
  href,
  isActive,
  children,
  onClick,
}: {
  href: string
  isActive: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        block px-3 py-2 rounded-lg text-sm transition
        ${isActive
          ? 'bg-primary/20 text-primary font-medium'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }
      `}
    >
      {children}
    </Link>
  )
}
