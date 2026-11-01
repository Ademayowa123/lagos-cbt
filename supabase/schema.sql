-- =========================================================================
-- LAGOS STATE CIVIL SERVICE COMMISSION (CSC) - YEAR 2027 PROMOTION CBT
-- Supabase PostgreSQL Database Schema
-- =========================================================================

-- 1. Users Table (Administrators and Registered / Demo Candidates)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  pass_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'candidate',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at BIGINT NOT NULL
);

-- Case-insensitive index for fast login searches
CREATE INDEX IF NOT EXISTS idx_users_username_lower ON public.users (LOWER(username));

-- 2. Tokens / Sessions Table (Single-Active-Session Security Enforcement)
CREATE TABLE IF NOT EXISTS public.tokens (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at BIGINT NOT NULL,
  revoked TEXT
);

CREATE INDEX IF NOT EXISTS idx_tokens_user ON public.tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_tokens_expires ON public.tokens (expires_at);

-- 3. Grade Level Groups / Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 4. Question Bank Table (Prescribed PSR, FR & Cadre Syllabus Items)
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 5. Study Resources Repository Table
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 6. Exam Sessions Table (Server-Authoritative Clock, Autosaves & Results)
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  started_at BIGINT NOT NULL,
  ends_at BIGINT NOT NULL,
  snapshot JSONB NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  flagged JSONB NOT NULL DEFAULT '{}'::jsonb,
  strikes INTEGER NOT NULL DEFAULT 0,
  submitted_at BIGINT,
  result JSONB
);

CREATE INDEX IF NOT EXISTS idx_exams_user_status ON public.exams (user_id, status);
CREATE INDEX IF NOT EXISTS idx_exams_status ON public.exams (status);

-- Disable Row Level Security (RLS) since authentication & authorization 
-- are strictly handled by the CBT API backend using the service_role key.
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;

-- Note: When your server runs for the first time, it will automatically populate
-- the seed categories, 100 questions, study documents, and demo users!
