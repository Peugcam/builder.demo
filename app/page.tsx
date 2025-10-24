'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Discussion, CommunityProject } from '@/types/database'

interface BuilderProfile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [totalMembers, setTotalMembers] = useState(0)
  const [builders, setBuilders] = useState<BuilderProfile[]>([])
  const [recentDiscussions, setRecentDiscussions] = useState<Discussion[]>([])
  const [recentProjects, setRecentProjects] = useState<CommunityProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()

    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      // Load builders count
      const { count: membersCount } = await supabase
        .from('builder_profiles')
        .select('*', { count: 'exact', head: true })

      setTotalMembers(membersCount || 0)

      // Load recent builders (for avatars)
      const { data: buildersData } = await supabase
        .from('builder_profiles')
        .select('id, username, display_name, avatar_url')
        .order('created_at', { ascending: false })
        .limit(12)

      setBuilders(buildersData || [])

      // Load recent discussions
      const { data: discussions } = await supabase
        .from('discussions')
        .select('*, author:builder_profiles(*)')
        .order('created_at', { ascending: false })
        .limit(3)

      setRecentDiscussions(discussions || [])

      // Load recent projects
      const { data: projects } = await supabase
        .from('community_projects')
        .select('*, creator:builder_profiles(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4)

      setRecentProjects(projects || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-400">Carregando...</div>
      </div>
    )
  }

  const userName = user?.email?.split('@')[0] || 'Builder'

  return (
    <div className="max-w-7xl mx-auto">
      {/* Saudação */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
          Olá, {userName.charAt(0).toUpperCase() + userName.slice(1)}
        </h1>
        <p className="text-gray-400">
          Continue sua jornada de construção e aprendizado.
        </p>
      </section>

      {/* Estatística de Builders */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">
          {totalMembers.toLocaleString('pt-BR')} Builders
        </h2>
        <p className="text-gray-400 mb-6">na comunidade</p>

        {/* Avatares dos Builders */}
        <div className="flex flex-wrap gap-3 mb-8">
          {builders.map((builder, idx) => (
            <div
              key={builder.id}
              className="relative group"
              title={builder.display_name || builder.username}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-xl border-2 border-gray-700 hover:border-primary transition cursor-pointer">
                {builder.display_name?.[0]?.toUpperCase() || builder.username[0]?.toUpperCase()}
              </div>
            </div>
          ))}
          {totalMembers > builders.length && (
            <Link
              href="/dashboard"
              className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer"
            >
              <span className="text-xs font-semibold">+{totalMembers - builders.length}</span>
            </Link>
          )}
        </div>
      </section>

      {/* Seção Explore */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Explore</h2>
          <p className="text-gray-400">
            Continue participando da comunidade ou comece algo novo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Aulas */}
          <Link
            href="/aulas"
            className="glass-card p-6 group hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Aulas</h3>
            <p className="text-gray-400 text-sm mb-4">
              Assista vídeos e aprenda novas habilidades
            </p>
            <div className="text-primary text-sm font-medium">
              Ver cursos disponíveis →
            </div>
          </Link>

          {/* Card Fórum */}
          <Link
            href="/forum"
            className="glass-card p-6 group hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fórum</h3>
            <p className="text-gray-400 text-sm mb-4">
              Participe das discussões, tire dúvidas e compartilhe ideias
            </p>
            <div className="text-primary text-sm font-medium">
              {recentDiscussions.length} discussões recentes →
            </div>
          </Link>

          {/* Card Projetos */}
          <Link
            href="/projects"
            className="glass-card p-6 group hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Projetos</h3>
            <p className="text-gray-400 text-sm mb-4">
              Explore projetos da comunidade e compartilhe os seus
            </p>
            <div className="text-primary text-sm font-medium">
              {recentProjects.length} projetos publicados →
            </div>
          </Link>

          {/* Card Dashboard */}
          <Link
            href="/dashboard"
            className="glass-card p-6 group hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
            <p className="text-gray-400 text-sm mb-4">
              Veja estatísticas e métricas da comunidade
            </p>
            <div className="text-primary text-sm font-medium">
              Ver métricas completas →
            </div>
          </Link>
        </div>
      </section>

      {/* Seção Atividade Recente */}
      {recentDiscussions.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Atividade Recente</h2>
            <Link href="/forum" className="text-primary hover:text-primary-light text-sm">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-4">
            {recentDiscussions.map((discussion) => (
              <Link
                key={discussion.id}
                href={`/forum`}
                className="glass-card p-6 block group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {discussion.author?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-300">
                        {discussion.author?.username || 'Anônimo'}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(discussion.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition">
                      {discussion.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {discussion.content}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

