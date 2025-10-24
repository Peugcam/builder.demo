'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { CommunityProject } from '@/types/database'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<CommunityProject[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    loadProjects()
  }, [])

  async function checkUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function loadProjects() {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('community_projects')
        .select('*, creator:builder_profiles(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Projetos da Comunidade 🚀</h1>
          <p className="text-gray-400">
            Descubra o que os builders estão construindo
          </p>
        </div>
        {user && (
          <Link
            href="/projects/new"
            className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition"
          >
            + Publicar Projeto
          </Link>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-2xl mb-4">🏗️</p>
          <p className="text-gray-400">
            Nenhum projeto publicado ainda. Seja o primeiro!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="glass-card p-6 block hover:scale-105 transition-transform"
            >
              <h2 className="text-xl font-semibold mb-3 hover:text-primary transition">
                {project.title}
              </h2>

              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_stack.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech_stack.length > 3 && (
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    +{project.tech_stack.length - 3}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm border-t border-gray-700 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    👤 {project.creator?.username || 'Anônimo'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>❤️ {project.likes_count}</span>
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔗
                    </a>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
