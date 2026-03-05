-- === Storyboard & Panels ===

-- 1. Storyboard Panels: Individual frames for each clip
CREATE TABLE IF NOT EXISTS public.storyboard_panels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clip_id UUID NOT NULL REFERENCES public.clips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  
  -- AI Generation Content
  image_prompt TEXT,
  image_url TEXT,
  video_prompt TEXT,
  video_url TEXT,
  
  -- Cinematic Rules
  photography_rules TEXT, -- e.g., "Close-up, high angle"
  acting_notes TEXT,      -- e.g., "Main character looks surprised"
  
  -- Metadata
  candidate_images JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft', -- draft, generating, completed, error
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.storyboard_panels ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can manage own storyboard panels" ON public.storyboard_panels
  FOR ALL USING (
    auth.uid() = user_id
  );

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_storyboard_panels_clip_id ON public.storyboard_panels(clip_id);
CREATE INDEX IF NOT EXISTS idx_storyboard_panels_user_id ON public.storyboard_panels(user_id);
