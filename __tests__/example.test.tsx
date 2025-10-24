import { render, screen } from '@testing-library/react'

// Exemplo de teste simples
describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})

// Descomente quando tiver componentes para testar
// describe('HomePage', () => {
//   it('renders homepage', () => {
//     render(<HomePage />)
//     expect(screen.getByText('Builder Hub')).toBeInTheDocument()
//   })
// })
