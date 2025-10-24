-- Builder Hub - Database Schema
-- Execute este script no Supabase SQL Editor

-- Tabela de perfis dos builders (complementa auth.users)
CREATE TABLE IF NOT EXISTS builder_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  level TEXT DEFAULT 'iniciante' CHECK (level IN ('iniciante', 'builder', 'expert')),
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  github_username TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussões do fórum
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('projetos', 'duvidas', 'ideias')),
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'solved', 'closed')),
  upvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Respostas às discussões
CREATE TABLE IF NOT EXISTS discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projetos da comunidade
CREATE TABLE IF NOT EXISTS community_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  github_url TEXT,
  demo_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Upvotes (discussões, respostas e projetos)
CREATE TABLE IF NOT EXISTS upvotes (
  user_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('discussion', 'reply', 'project')),
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, target_type, target_id)
);

-- Badges/Conquistas
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  criteria JSONB DEFAULT '{}'::jsonb
);

-- Badges dos usuários
CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category);
CREATE INDEX IF NOT EXISTS idx_discussions_created ON discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_author ON discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_discussion ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_replies_author ON discussion_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_creator ON community_projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_created ON community_projects(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE builder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

-- Policies para builder_profiles
CREATE POLICY "Profiles são públicos" ON builder_profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem atualizar próprio perfil" ON builder_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuários podem inserir próprio perfil" ON builder_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies para discussions
CREATE POLICY "Discussões publicadas são públicas" ON discussions
  FOR SELECT USING (true);
CREATE POLICY "Usuários autenticados podem criar discussões" ON discussions
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Autores podem atualizar próprias discussões" ON discussions
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Autores e admins podem deletar discussões" ON discussions
  FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM builder_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policies para discussion_replies
CREATE POLICY "Respostas são públicas" ON discussion_replies
  FOR SELECT USING (true);
CREATE POLICY "Usuários autenticados podem responder" ON discussion_replies
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Autores podem atualizar próprias respostas" ON discussion_replies
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Autores podem deletar próprias respostas" ON discussion_replies
  FOR DELETE USING (auth.uid() = author_id);

-- Policies para community_projects
CREATE POLICY "Projetos publicados são públicos" ON community_projects
  FOR SELECT USING (status = 'published' OR creator_id = auth.uid());
CREATE POLICY "Usuários podem criar projetos" ON community_projects
  FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Criadores podem atualizar próprios projetos" ON community_projects
  FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Criadores podem deletar próprios projetos" ON community_projects
  FOR DELETE USING (auth.uid() = creator_id);

-- Policies para upvotes
CREATE POLICY "Upvotes são públicos" ON upvotes
  FOR SELECT USING (true);
CREATE POLICY "Usuários podem dar upvote" ON upvotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem remover próprio upvote" ON upvotes
  FOR DELETE USING (auth.uid() = user_id);

-- Function para incrementar views
CREATE OR REPLACE FUNCTION increment_discussion_views(discussion_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE discussions
  SET views = views + 1
  WHERE id = discussion_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function para contar replies
CREATE OR REPLACE FUNCTION count_discussion_replies(discussion_id_param UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM discussion_replies
  WHERE discussion_id = discussion_id_param;
$$ LANGUAGE sql STABLE;

-- Inserir badges iniciais
INSERT INTO badges (name, description, icon, criteria) VALUES
('🌱 Novo Builder', 'Bem-vindo à comunidade!', '🌱', '{"posts": 0}'),
('🌿 Builder Ativo', 'Criou sua primeira discussão', '🌿', '{"discussions": 1}'),
('🌳 Builder Experiente', 'Participou de 10+ discussões', '🌳', '{"discussions": 10}'),
('🚀 Lançador', 'Publicou seu primeiro projeto', '🚀', '{"projects": 1}'),
('⭐ Estrela da Comunidade', 'Recebeu 50+ upvotes', '⭐', '{"upvotes": 50}'),
('👑 Builder Master', 'Membro ativo há 3+ meses', '👑', '{"days": 90}')
ON CONFLICT DO NOTHING;

-- =============================================
-- TABELA: courses (Cursos/Aulas)
-- =============================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT NOT NULL,
  instructor_id UUID REFERENCES builder_profiles(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  duration TEXT, -- Ex: "45:30" (45 minutos e 30 segundos)
  level TEXT CHECK (level IN ('iniciante', 'intermediario', 'avancado')) DEFAULT 'iniciante',
  category TEXT NOT NULL, -- programacao, design, marketing, negocios, ia
  views INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Policy: Todos podem ler cursos publicados
CREATE POLICY "Cursos publicados são visíveis para todos"
ON courses FOR SELECT
TO authenticated
USING (status = 'published');

-- Policy: Apenas admins podem inserir cursos
CREATE POLICY "Apenas admins podem criar cursos"
ON courses FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM builder_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'moderator')
  )
);

-- Policy: Apenas admins podem atualizar cursos
CREATE POLICY "Apenas admins podem editar cursos"
ON courses FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM builder_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'moderator')
  )
);

-- Policy: Apenas admins podem deletar cursos
CREATE POLICY "Apenas admins podem deletar cursos"
ON courses FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM builder_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- =============================================
-- TABELA: course_progress (Progresso do aluno)
-- =============================================

CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0, -- 0-100
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course ON course_progress(course_id);

-- RLS
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seu próprio progresso
CREATE POLICY "Usuários veem apenas seu progresso"
ON course_progress FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Usuários podem atualizar apenas seu próprio progresso
CREATE POLICY "Usuários atualizam apenas seu progresso"
ON course_progress FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =============================================
-- Inserir cursos de exemplo
-- =============================================

INSERT INTO courses (title, description, instructor, video_url, duration, level, category, views) VALUES
('Introdução ao Next.js 15', 'Aprenda os fundamentos do Next.js e construa aplicações modernas', 'Paulo Eugênio', 'https://youtube.com/watch?v=example1', '45:30', 'iniciante', 'programacao', 1234),
('TypeScript do Zero ao Avançado', 'Domine TypeScript e escreva código mais seguro e escalável', 'Ana Silva', 'https://youtube.com/watch?v=example2', '1:20:15', 'intermediario', 'programacao', 890),
('Design System com Tailwind CSS', 'Crie componentes reutilizáveis e consistentes com Tailwind', 'Carlos Oliveira', 'https://youtube.com/watch?v=example3', '55:00', 'iniciante', 'design', 567),
('Marketing Digital para Desenvolvedores', 'Aprenda a divulgar seus projetos e construir sua marca', 'Marina Costa', 'https://youtube.com/watch?v=example4', '40:20', 'iniciante', 'marketing', 432),
('Inteligência Artificial com Python', 'Introdução prática ao Machine Learning e IA', 'Roberto Santos', 'https://youtube.com/watch?v=example5', '2:15:00', 'avancado', 'ia', 2341),
('Empreendedorismo Tech', 'Como transformar sua ideia em um negócio de sucesso', 'Júlia Mendes', 'https://youtube.com/watch?v=example6', '1:05:30', 'intermediario', 'negocios', 789)
ON CONFLICT DO NOTHING;
