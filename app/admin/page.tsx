'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Discussion, BuilderProfile } from '@/types/database'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<BuilderProfile | null>(null)
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [users, setUsers] = useState<BuilderProfile[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {
    const supabase = createClient()

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('builder_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(profile)

    // For demo purposes, allow all logged users
    // In production, check: if (profile?.role !== 'admin') router.push('/')

    loadData()
  }

  async function loadData() {
    const supabase = createClient()

    try {
      // Load recent discussions
      const { data: discussions } = await supabase
        .from('discussions')
        .select('*, author:builder_profiles(*)')
        .order('created_at', { ascending: false })
        .limit(10)

      setDiscussions(discussions || [])

      // Load recent users
      const { data: users } = await supabase
        .from('builder_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setUsers(users || [])
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteDiscussion(id: string) {
    if (!confirm('Tem certeza que deseja deletar esta discussão?')) return

    const supabase = createClient()

    try {
      await supabase.from('discussions').delete().eq('id', id)
      setDiscussions(discussions.filter((d) => d.id !== id))
      alert('Discussão deletada com sucesso!')
    } catch (error) {
      console.error('Error deleting discussion:', error)
      alert('Erro ao deletar discussão')
    }
  }

  async function togglePin(discussion: Discussion) {
    const supabase = createClient()

    try {
      await supabase
        .from('discussions')
        .update({ is_pinned: !discussion.is_pinned })
        .eq('id', discussion.id)

      setDiscussions(
        discussions.map((d) =>
          d.id === discussion.id ? { ...d, is_pinned: !d.is_pinned } : d
        )
      )
    } catch (error) {
      console.error('Error toggling pin:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-400">Carregando painel admin...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Painel Admin 👑</h1>
        <p className="text-gray-400">
          Gerenciamento da comunidade Builder Hub
        </p>
        {profile && (
          <p className="text-sm text-primary mt-2">
            Logado como: {profile.username} ({profile.role})
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-card p-6">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-2xl font-bold text-primary">{users.length}</div>
          <div className="text-gray-400 text-sm">Usuários Recentes</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-2xl mb-2">💬</div>
          <div className="text-2xl font-bold text-primary">
            {discussions.length}
          </div>
          <div className="text-gray-400 text-sm">Discussões Recentes</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-2xl mb-2">📌</div>
          <div className="text-2xl font-bold text-primary">
            {discussions.filter((d) => d.is_pinned).length}
          </div>
          <div className="text-gray-400 text-sm">Discussões Fixadas</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-2xl font-bold text-primary">0</div>
          <div className="text-gray-400 text-sm">Reportes Pendentes</div>
        </div>
      </div>

      {/* Recent Discussions Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Gerenciar Discussões</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {discussions.map((discussion) => (
                  <tr key={discussion.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {discussion.is_pinned && <span>📌</span>}
                        <span className="font-medium">{discussion.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {discussion.author?.username || 'Anônimo'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getCategoryColor(
                          discussion.category
                        )}`}
                      >
                        {discussion.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getStatusColor(
                          discussion.status
                        )}`}
                      >
                        {discussion.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => togglePin(discussion)}
                          className="text-xs px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded transition"
                        >
                          {discussion.is_pinned ? 'Desafixar' : 'Fixar'}
                        </button>
                        <button
                          onClick={() => deleteDiscussion(discussion.id)}
                          className="text-xs px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded transition"
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recent Users */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Usuários Recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div key={user.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-gray-400">{user.email}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${getLevelColor(user.level)}`}
                >
                  {user.level}
                </span>
                <span className="text-xs text-gray-500">{user.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function getCategoryColor(category: string) {
  const colors = {
    projetos: 'bg-blue-500/20 text-blue-300',
    duvidas: 'bg-yellow-500/20 text-yellow-300',
    ideias: 'bg-purple-500/20 text-purple-300',
  }
  return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-300'
}

function getStatusColor(status: string) {
  const colors = {
    open: 'bg-green-500/20 text-green-300',
    solved: 'bg-blue-500/20 text-blue-300',
    closed: 'bg-gray-500/20 text-gray-300',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-300'
}

function getLevelColor(level: string) {
  const colors = {
    iniciante: 'bg-green-500/20 text-green-300',
    builder: 'bg-blue-500/20 text-blue-300',
    expert: 'bg-purple-500/20 text-purple-300',
  }
  return colors[level as keyof typeof colors] || 'bg-gray-500/20 text-gray-300'
}
