# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Builder Hub! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)

## 📜 Código de Conduta

Este projeto adota um Código de Conduta. Ao participar, você concorda em manter um ambiente respeitoso e acolhedor.

## 🚀 Como Contribuir

### Reportar Bugs

- Use o template de issue "Bug Report"
- Inclua passos para reproduzir
- Forneça screenshots se possível
- Descreva o comportamento esperado vs atual

### Sugerir Features

- Use o template de issue "Feature Request"
- Explique o problema que a feature resolve
- Descreva a solução proposta
- Considere alternativas

### Contribuir com Código

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Faça suas mudanças
4. Execute os testes (`npm test`)
5. Commit suas mudanças (veja [Commits](#commits))
6. Push para a branch (`git push origin feature/minha-feature`)
7. Abra um Pull Request

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 20+
- npm ou yarn
- Conta no Supabase

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/builder-hub-demo.git
cd builder-hub-demo

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute o servidor de desenvolvimento
npm run dev
```

## 🔄 Workflow de Desenvolvimento

### Branches

- `main` - Produção (protegida)
- `develop` - Desenvolvimento (opcional)
- `feature/nome` - Novas features
- `fix/nome` - Correções
- `refactor/nome` - Refatorações
- `docs/nome` - Documentação

### Antes de Commitar

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Testes
npm test

# Format
npm run format
```

## 🎨 Padrões de Código

### TypeScript

- Use TypeScript para todo código
- Evite `any`, use tipos específicos
- Prefira `interface` para objetos públicos
- Use `type` para unions/intersections

### Componentes React

```typescript
// ✅ Bom
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}

// ❌ Evitar
export function Button(props: any) {
  return <button>{props.children}</button>
}
```

### Nomenclatura

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Types/Interfaces**: PascalCase (`User`, `ProfileData`)

### Estrutura de Arquivos

```
app/
├── (auth)/         # Route groups
├── api/           # API routes
├── [dynamic]/     # Dynamic routes
components/
├── ui/            # Componentes reutilizáveis
├── forms/         # Formulários
lib/
├── utils/         # Utilidades
├── hooks/         # Custom hooks
types/
├── database.ts    # Tipos do banco
```

## 📝 Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos

- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta lógica)
- `refactor`: Refatoração
- `perf`: Melhoria de performance
- `test`: Testes
- `chore`: Tarefas de build/config

### Exemplos

```bash
feat(auth): adicionar login com Google

Implementa autenticação OAuth com Google usando NextAuth.js

Closes #123

fix(forum): corrigir ordenação de posts

refactor(components): extrair Button para ui/

docs: atualizar README com instruções de deploy

test(api): adicionar testes para /api/users
```

## 🔍 Pull Requests

### Checklist

- [ ] Código segue os padrões do projeto
- [ ] Testes passam (`npm test`)
- [ ] Build funciona (`npm run build`)
- [ ] Lint passa (`npm run lint`)
- [ ] Type check passa (`npm run type-check`)
- [ ] Documentação atualizada
- [ ] Screenshots adicionados (se UI)
- [ ] PR template preenchido

### Review

- PRs precisam de 1 aprovação
- CI deve passar
- Sem conflitos com `main`

### Após Merge

- Delete a branch
- Atualize seu fork

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Escrever Testes

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button onClick={() => {}}>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## 🆘 Precisa de Ajuda?

- Abra uma issue com a tag `question`
- Entre em contato via Discord/Slack (se houver)

---

**Obrigado por contribuir! 🎉**
