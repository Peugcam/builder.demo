import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '@/components/Sidebar'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      signOut: jest.fn(),
    },
  }),
}))

describe('Sidebar', () => {
  it('renders logo correctly', () => {
    render(<Sidebar />)
    expect(screen.getByText('Builder Hub')).toBeInTheDocument()
  })

  it('renders navigation menu items', () => {
    render(<Sidebar />)
    expect(screen.getByText('Aulas')).toBeInTheDocument()
    expect(screen.getByText('Comunidade')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('expands Comunidade menu when clicked', () => {
    render(<Sidebar />)

    const comunidadeButton = screen.getByText('Comunidade')
    fireEvent.click(comunidadeButton)

    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.getByText('Fórum')).toBeInTheDocument()
    expect(screen.getByText('Projetos')).toBeInTheDocument()
  })

  it('shows login buttons when user is not authenticated', async () => {
    render(<Sidebar />)

    // Wait for auth check
    await screen.findByText('Entrar')
    expect(screen.getByText('Cadastrar')).toBeInTheDocument()
  })
})
