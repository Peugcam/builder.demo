# 🏗️ Arquitetura do Builder Hub

## 📋 Visão Geral

Builder Hub é uma plataforma de comunidade para builders, desenvolvida com Next.js 16, React 19, TypeScript e Supabase.

## 🎯 Stack Tecnológica

### Frontend

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript 5.9** - Tipagem estática
- **Tailwind CSS 4.1** - Estilização utility-first

### Backend

- **Next.js API Routes** - Serverless functions
- **Supabase** - Backend-as-a-Service
  - PostgreSQL (banco de dados)
  - Auth (autenticação)
  - Row Level Security (RLS)

### DevOps

- **Vercel** - Hospedagem e CI/CD
- **GitHub Actions** - Automação
- **ESLint + Prettier** - Qualidade de código
- **Jest + Testing Library** - Testes

## 📁 Estrutura do Projeto

```
builder-hub-demo/
├── .github/
│   ├── workflows/          # GitHub Actions
│   ├── ISSUE_TEMPLATE/     # Templates de issues
│   └── PULL_REQUEST_TEMPLATE.md
│
├── __tests__/             # Testes unitários
│
├── app/                   # Next.js App Router
│   ├── (routes)/         # Páginas
│   │   ├── page.tsx      # Homepage
│   │   ├── aulas/        # Página de aulas
│   │   ├── forum/        # Fórum
│   │   ├── projects/     # Projetos
│   │   ├── dashboard/    # Dashboard
│   │   ├── admin/        # Admin panel
│   │   ├── login/        # Login
│   │   └── signup/       # Cadastro
│   ├── api/              # API Routes
│   ├── globals.css       # Estilos globais
│   └── layout.tsx        # Layout raiz
│
├── components/            # Componentes React
│   ├── Sidebar.tsx       # Navegação lateral
│   └── ...
│
├── lib/                   # Bibliotecas e utilitários
│   ├── supabase.ts       # Cliente Supabase
│   └── env.ts            # Variáveis de ambiente tipadas
│
├── types/                 # Tipos TypeScript
│   └── database.ts       # Tipos do banco
│
├── public/               # Arquivos estáticos
│
├── supabase-schema.sql   # Schema do banco
├── .eslintrc.json        # Config ESLint
├── .prettierrc           # Config Prettier
├── jest.config.js        # Config Jest
├── next.config.js        # Config Next.js
├── tailwind.config.js    # Config Tailwind
├── tsconfig.json         # Config TypeScript
└── package.json          # Dependências
```

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Next.js App   │
│   (React UI)    │
└──────┬──────────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────┐
│  API Routes │  │  Supabase    │
│ (Serverless)│  │   Client     │
└──────┬──────┘  └──────┬───────┘
       │                │
       └────────┬───────┘
                │
                ▼
         ┌─────────────┐
         │  Supabase   │
         │ (PostgreSQL)│
         └─────────────┘
```

## 🗃️ Schema do Banco de Dados

### Tabelas Principais

#### `builder_profiles`

```sql
- id (UUID, PK)
- username (TEXT, UNIQUE)
- display_name (TEXT)
- bio (TEXT)
- level (iniciante | builder | expert)
- role (member | moderator | admin)
- github_username (TEXT)
- points (INTEGER)
```

#### `discussions`

```sql
- id (UUID, PK)
- author_id (UUID, FK → builder_profiles)
- title (TEXT)
- content (TEXT)
- category (projetos | duvidas | ideias)
- status (open | solved | closed)
- upvotes (INTEGER)
- views (INTEGER)
```

#### `community_projects`

```sql
- id (UUID, PK)
- creator_id (UUID, FK → builder_profiles)
- title (TEXT)
- description (TEXT)
- github_url (TEXT)
- demo_url (TEXT)
- tech_stack (TEXT[])
- likes_count (INTEGER)
```

#### `courses`

```sql
- id (UUID, PK)
- title (TEXT)
- instructor (TEXT)
- video_url (TEXT)
- duration (TEXT)
- level (iniciante | intermediario | avancado)
- category (programacao | design | marketing | negocios | ia)
- views (INTEGER)
```

### Relacionamentos

```
builder_profiles
    ├──> discussions (1:N)
    ├──> community_projects (1:N)
    ├──> discussion_replies (1:N)
    └──> course_progress (1:N)

discussions
    └──> discussion_replies (1:N)

courses
    └──> course_progress (1:N)
```

## 🔒 Segurança

### Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado:

```sql
-- Exemplo: Apenas admins podem deletar posts
CREATE POLICY "Apenas admins podem deletar"
ON discussions FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM builder_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Autenticação

- Supabase Auth com JWT
- Session management automático
- OAuth integrado (email/password)

## 🎨 UI/UX

### Design System

- **Cores**: Indigo (primary), Dark backgrounds
- **Componentes**: Glassmorphism cards, Smooth transitions
- **Layout**: Sidebar fixa + Conteúdo responsivo
- **Tipografia**: Inter font

### Responsividade

```
Mobile:  < 768px  (sidebar colapsável)
Tablet:  768-1024px (2 colunas)
Desktop: > 1024px (layout completo)
```

## 🚀 Deploy e CI/CD

### Pipeline CI/CD

```
┌──────────────┐
│  Git Push    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ GitHub       │
│ Actions      │
└──────┬───────┘
       │
       ├──────────┬──────────┬───────────┐
       │          │          │           │
       ▼          ▼          ▼           ▼
   ┌─────┐   ┌──────┐   ┌──────┐   ┌───────┐
   │Lint │   │ Type │   │ Test │   │ Build │
   └─────┘   │Check │   └──────┘   └───────┘
             └──────┘
                │
                ▼
          ┌──────────┐
          │  Deploy  │
          │ (Vercel) │
          └──────────┘
```

### Ambientes

- **Development**: `localhost:3000`
- **Preview**: `*.vercel.app` (PRs)
- **Production**: `builder-hub.vercel.app`

## 📊 Performance

### Otimizações

- **Server-Side Rendering** (SSR) para SEO
- **Static Generation** onde possível
- **Image Optimization** (Next.js Image)
- **Code Splitting** automático
- **CDN** via Vercel Edge Network

### Métricas Alvo

- First Load: < 1s
- Lighthouse Score: 90+
- Database Queries: < 100ms
- API Response: < 200ms

## 🧪 Testes

### Estratégia de Testes

```
┌─────────────────────┐
│  Unit Tests (70%)   │ ← Componentes, utils
├─────────────────────┤
│ Integration (20%)   │ ← API routes, hooks
├─────────────────────┤
│     E2E (10%)       │ ← User flows críticos
└─────────────────────┘
```

### Ferramentas

- **Jest** - Test runner
- **React Testing Library** - Testes de componentes
- **Cypress** (futuro) - Testes E2E

## 🔮 Roadmap Técnico

### Fase 1 (MVP) ✅

- [x] Autenticação
- [x] Fórum
- [x] Projetos
- [x] Aulas
- [x] Dashboard
- [x] Admin Panel

### Fase 2 (Q2 2025)

- [ ] Real-time updates (WebSockets)
- [ ] Notificações push
- [ ] Upload de imagens/vídeos
- [ ] Busca full-text
- [ ] Markdown editor

### Fase 3 (Q3 2025)

- [ ] Gamificação (badges, levels)
- [ ] Direct messages
- [ ] Events/Hackathons
- [ ] Mobile app (React Native)

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para guidelines de desenvolvimento.

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

---

**Builder Hub** - Construindo o futuro, juntos 🏗️
