-- === AI Background Tasks ===

-- 1. AI Tasks Table: Track status and results of long-running AI operations
CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  
  -- Task Identity
  type TEXT NOT NULL, -- image-gen, video-gen, tts, text-analysis
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
  
  -- Progress tracking
  progress INTEGER DEFAULT 0, -- 0-100
  message TEXT, -- Status message for the UI
  
  -- Data
  payload JSONB DEFAULT '{}'::jsonb, -- Input data for the AI model
  result JSONB DEFAULT '{}'::jsonb,  -- Output data/URLs from the AI model
  
  -- Timing
  error TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can manage own AI tasks" ON public.ai_tasks
  FOR ALL USING (
    auth.uid() = user_id
  );

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_ai_tasks_user_id ON public.ai_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON public.ai_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_project_id ON public.ai_tasks(project_id);
