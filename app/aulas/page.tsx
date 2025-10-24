'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  thumbnail_url: string
  video_url: string
  duration: string
  level: 'iniciante' | 'intermediario' | 'avancado'
  category: string
  views: number
  created_at: string
}

export default function AulasPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('todas')

  useEffect(() => {
    loadCourses()
  }, [])

  async function loadCourses() {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading courses:', error)
        // Usar dados mock se não tiver tabela ainda
        setCourses(mockCourses)
      } else {
        setCourses(data || mockCourses)
      }
    } catch (error) {
      console.error('Error:', error)
      setCourses(mockCourses)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'todas', label: 'Todas', icon: '📚' },
    { value: 'programacao', label: 'Programação', icon: '💻' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'negocios', label: 'Negócios', icon: '💼' },
    { value: 'ia', label: 'IA & ML', icon: '🤖' },
  ]

  const filteredCourses = selectedCategory === 'todas'
    ? courses
    : courses.filter(c => c.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-400">Carregando aulas...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Aprenda 📚</h1>
        <p className="text-gray-400">
          Continue assistindo às aulas ou comece uma nova
        </p>
      </div>

      {/* Filtros de Categoria */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`
              px-4 py-2 rounded-lg transition flex items-center gap-2
              ${selectedCategory === cat.value
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            <span>{cat.icon}</span>
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Nenhuma aula encontrada nesta categoria
          </p>
        </div>
      )}
    </div>
  )
}

function CourseCard({ course }: { course: Course }) {
  const levelColors = {
    iniciante: 'bg-green-500/20 text-green-300',
    intermediario: 'bg-yellow-500/20 text-yellow-300',
    avancado: 'bg-red-500/20 text-red-300',
  }

  return (
    <Link
      href={`/aulas/${course.id}`}
      className="glass-card overflow-hidden group hover:scale-105 transition-transform"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-50">🎥</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
          {course.duration}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-1 rounded ${levelColors[course.level]}`}>
            {course.level}
          </span>
          <span className="text-xs text-gray-500">{course.views} visualizações</span>
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition line-clamp-2">
          {course.title}
        </h3>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">👨‍🏫 {course.instructor}</span>
        </div>
      </div>
    </Link>
  )
}

// Mock data para desenvolvimento
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introdução ao Next.js 15',
    description: 'Aprenda os fundamentos do Next.js e construa aplicações modernas',
    instructor: 'Paulo Eugênio',
    thumbnail_url: '',
    video_url: 'https://youtube.com/watch?v=example',
    duration: '45:30',
    level: 'iniciante',
    category: 'programacao',
    views: 1234,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'TypeScript do Zero ao Avançado',
    description: 'Domine TypeScript e escreva código mais seguro e escalável',
    instructor: 'Ana Silva',
    thumbnail_url: '',
    video_url: 'https://youtube.com/watch?v=example',
    duration: '1:20:15',
    level: 'intermediario',
    category: 'programacao',
    views: 890,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Design System com Tailwind CSS',
    description: 'Crie componentes reutilizáveis e consistentes com Tailwind',
    instructor: 'Carlos Oliveira',
    thumbnail_url: '',
    video_url: 'https://youtube.com/watch?v=example',
    duration: '55:00',
    level: 'iniciante',
    category: 'design',
    views: 567,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Marketing Digital para Desenvolvedores',
    description: 'Aprenda a divulgar seus projetos e construir sua marca',
    instructor: 'Marina Costa',
    thumbnail_url: '',
    video_url: 'https://youtube.com/watch?v=example',
    duration: '40:20',
    level: 'iniciante',
    category: 'marketing',
    views: 432,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Inteligência Artificial com Python',
    description: 'Introdução prática ao Machine Learning e IA',
    instructor: 'Roberto Santos',
    thumbnail_url: '',
    video_url: 'https://youtube.com/watch?v=example',
    duration: '2:15:00',
    level: 'avancado',
    category: 'ia',
    views: 2341,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Empreendedorismo Tech',
    description: 'Como transformar sua ideia em um negócio de sucesso',
    instructor: 'Júlia Mendes',
    thumbnail_url: '',
    video_url: 'https://youtube.com/watch?v=example',
    duration: '1:05:30',
    level: 'intermediario',
    category: 'negocios',
    views: 789,
    created_at: new Date().toISOString(),
  },
]
