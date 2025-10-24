export interface BuilderProfile {
  id: string
  username: string
  display_name: string | null
  email: string | null
  bio: string | null
  level: 'iniciante' | 'builder' | 'expert'
  role: 'member' | 'moderator' | 'admin'
  github_username: string | null
  avatar_url: string | null
  points: number
  created_at: string
}

export interface Discussion {
  id: string
  author_id: string
  title: string
  content: string
  category: 'projetos' | 'duvidas' | 'ideias'
  tags: string[]
  status: 'open' | 'solved' | 'closed'
  upvotes: number
  views: number
  is_pinned: boolean
  created_at: string
  updated_at: string
  author?: BuilderProfile
  reply_count?: number
}

export interface DiscussionReply {
  id: string
  discussion_id: string
  author_id: string
  content: string
  is_solution: boolean
  upvotes: number
  created_at: string
  author?: BuilderProfile
}

export interface CommunityProject {
  id: string
  creator_id: string
  title: string
  description: string
  github_url: string | null
  demo_url: string | null
  tech_stack: string[]
  likes_count: number
  status: 'draft' | 'published'
  created_at: string
  creator?: BuilderProfile
}

export interface Badge {
  id: string
  name: string
  description: string | null
  icon: string | null
  criteria: Record<string, any>
}

export interface UserBadge {
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface CommunityStats {
  total_members: number
  active_today: number
  total_discussions: number
  total_projects: number
  discussions_today: number
  projects_this_week: number
}
