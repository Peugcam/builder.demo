'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Discussion } from '@/types/database'

export default function ForumPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    loadDiscussions()
  }, [filter])

  async function checkUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function loadDiscussions() {
    const supabase = createClient()
    setLoading(true)

    try {
      let query = supabase
        .from('discussions')
        .select('*, author:builder_profiles(*)')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('category', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setDiscussions(data || [])
    } catch (error) {
      console.error('Error loading discussions:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'all', label: 'Todas', icon: '📚' },
    { value: 'projetos', label: 'Projetos', icon: '🚀' },
    { value: 'duvidas', label: 'Dúvidas', icon: '❓' },
    { value: 'ideias', label: 'Ideias', icon: '💡' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Fórum da Comunidade 💬</h1>
          <p className="text-gray-400">
            Discuta projetos, tire dúvidas e compartilhe ideias
          </p>
        </div>
        {user && (
          <Link
            href="/forum/new"
            className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition"
          >
            + Nova Discussão
          </Link>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filter === cat.value
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Discussions List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : discussions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-2xl mb-4">📭</p>
          <p className="text-gray-400">
            Nenhuma discussão ainda. Seja o primeiro a iniciar uma!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Link
              key={discussion.id}
              href={`/forum/${discussion.id}`}
              className="glass-card p-6 block"
            >
              <div className="flex gap-4">
                {/* Votes */}
                <div className="flex flex-col items-center gap-1 text-sm">
                  <button className="text-gray-400 hover:text-primary transition">
                    ▲
                  </button>
                  <span className="font-semibold">{discussion.upvotes}</span>
                  <button className="text-gray-400 hover:text-primary transition">
                    ▼
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${getCategoryColor(
                        discussion.category
                      )}`}
                    >
                      {discussion.category}
                    </span>
                    {discussion.is_pinned && <span>📌</span>}
                    {discussion.status === 'solved' && (
                      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300">
                        ✓ Resolvido
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold mb-2 hover:text-primary transition">
                    {discussion.title}
                  </h2>

                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {discussion.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>👤 {discussion.author?.username || 'Anônimo'}</span>
                    <span>👁️ {discussion.views} visualizações</span>
                    <span>💬 {discussion.reply_count || 0} respostas</span>
                    <span>
                      {new Date(discussion.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
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
