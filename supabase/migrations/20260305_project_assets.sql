-- === Project Assets Binding ===

-- 1. Project Characters Relationship
CREATE TABLE IF NOT EXISTS public.project_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.global_characters(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, character_id)
);

-- 2. Project Locations Relationship
CREATE TABLE IF NOT EXISTS public.project_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.global_locations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, location_id)
);

-- 3. Enable RLS
ALTER TABLE public.project_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_locations ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users can manage own project characters" ON public.project_characters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_characters.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own project locations" ON public.project_locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_locations.project_id 
      AND projects.user_id = auth.uid()
    )
  );
