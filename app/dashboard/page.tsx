'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { CommunityStats } from '@/types/database'

export default function DashboardPage() {
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const supabase = createClient()

    try {
      // Total counts
      const [
        { count: totalMembers },
        { count: totalDiscussions },
        { count: totalProjects },
      ] = await Promise.all([
        supabase.from('builder_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('discussions').select('*', { count: 'exact', head: true }),
        supabase.from('community_projects').select('*', { count: 'exact', head: true }),
      ])

      // Active today (simplified - would need timestamp filtering in production)
      const { count: activeToday } = await supabase
        .from('builder_profiles')
        .select('*', { count: 'exact', head: true })
        .limit(10)

      setStats({
        total_members: totalMembers || 0,
        active_today: Math.min(activeToday || 0, 5), // Simplified
        total_discussions: totalDiscussions || 0,
        total_projects: totalProjects || 0,
        discussions_today: 0,
        projects_this_week: 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-400">Carregando estatísticas...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Dashboard 📊</h1>
      <p className="text-gray-400 mb-8">Estatísticas da comunidade Builder Hub</p>

      {/* Main Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total de Builders"
            value={stats.total_members}
            icon="👥"
            trend="+12%"
            trendPositive={true}
          />
          <StatCard
            title="Discussões"
            value={stats.total_discussions}
            icon="💬"
            trend="+8%"
            trendPositive={true}
          />
          <StatCard
            title="Projetos Publicados"
            value={stats.total_projects}
            icon="🚀"
            trend="+25%"
            trendPositive={true}
          />
          <StatCard
            title="Ativos Hoje"
            value={stats.active_today}
            icon="⚡"
            trend="↔"
            trendPositive={null}
          />
        </div>
      )}

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4">Atividade por Categoria</h2>
          <div className="space-y-4">
            <CategoryBar label="Projetos" value={45} color="bg-blue-500" />
            <CategoryBar label="Dúvidas" value={30} color="bg-yellow-500" />
            <CategoryBar label="Ideias" value={25} color="bg-purple-500" />
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4">Builders por Nível</h2>
          <div className="space-y-4">
            <LevelBar label="🌱 Iniciantes" value={60} />
            <LevelBar label="🌿 Builders" value={30} />
            <LevelBar label="🌳 Experts" value={10} />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-primary mb-1">156</div>
          <div className="text-gray-400 text-sm">Badges Conquistados</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-2">💡</div>
          <div className="text-2xl font-bold text-primary mb-1">1.2K</div>
          <div className="text-gray-400 text-sm">Upvotes Dados</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-primary mb-1">89%</div>
          <div className="text-gray-400 text-sm">Taxa de Engajamento</div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  trend,
  trendPositive,
}: {
  title: string
  value: number
  icon: string
  trend: string
  trendPositive: boolean | null
}) {
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="text-3xl">{icon}</div>
        {trendPositive !== null && (
          <span
            className={`text-sm ${
              trendPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-primary mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </div>
  )
}

function CategoryBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span className="text-gray-400">{value}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  )
}

function LevelBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span className="text-gray-400">{value}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  )
}
