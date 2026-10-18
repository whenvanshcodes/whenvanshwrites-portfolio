-- whenvanshwrites: Supabase Database Migration
-- Migrates from Cloudflare D1 (SQLite) to Supabase Postgres

-- 1. Contacts (Private messages from visitors)
CREATE TABLE IF NOT EXISTS public.contacts (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    topic text NOT NULL,
    message text NOT NULL,
    created_at bigint NOT NULL,
    is_read integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS contacts_created_idx ON public.contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON public.contacts (email);

-- 2. Photo Series & Photos
CREATE TABLE IF NOT EXISTS public.photo_series (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    created_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS photo_series_created_idx ON public.photo_series (created_at DESC);

CREATE TABLE IF NOT EXISTS public.photos (
    id text PRIMARY KEY,
    series_id text NOT NULL REFERENCES public.photo_series(id) ON DELETE CASCADE,
    object_key text NOT NULL,
    mime text NOT NULL,
    caption text NOT NULL DEFAULT '',
    sort_order integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS photos_series_idx ON public.photos (series_id, sort_order ASC);

-- 3. Writings (Poem, Story, Essay, Field note)
CREATE TABLE IF NOT EXISTS public.writings (
    id text PRIMARY KEY,
    title text NOT NULL,
    category text NOT NULL,
    excerpt text NOT NULL DEFAULT '',
    body text NOT NULL,
    published integer NOT NULL DEFAULT 0,
    created_at bigint NOT NULL,
    updated_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS writings_created_idx ON public.writings (created_at DESC);
CREATE INDEX IF NOT EXISTS writings_published_idx ON public.writings (published, created_at DESC);

-- 4. Visitor Words (Garden word drops)
CREATE TABLE IF NOT EXISTS public.visitor_words (
    id text PRIMARY KEY,
    word text NOT NULL,
    created_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS visitor_words_created_idx ON public.visitor_words (created_at DESC);

-- 5. Portfolio Content (Profile, project overrides, resume, services, narrative overrides)
CREATE TABLE IF NOT EXISTS public.portfolio_content (
    key text PRIMARY KEY,
    payload text NOT NULL,
    updated_at bigint NOT NULL
);

-- 6. Project Media (Uploaded screenshots for projects)
CREATE TABLE IF NOT EXISTS public.project_media (
    id text PRIMARY KEY,
    project_id text NOT NULL,
    object_key text NOT NULL,
    mime text NOT NULL,
    caption text NOT NULL DEFAULT '',
    created_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS project_media_project_idx ON public.project_media (project_id, created_at ASC);

-- 7. Visitor Experiences (Visitor notebook entries)
CREATE TABLE IF NOT EXISTS public.visitor_experiences (
    id text PRIMARY KEY,
    name text NOT NULL,
    experience text NOT NULL,
    created_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS visitor_experiences_created_idx ON public.visitor_experiences (created_at DESC);

-- 8. Race Times (Car game rally leaderboard)
CREATE TABLE IF NOT EXISTS public.race_times (
    id text PRIMARY KEY,
    name text NOT NULL,
    course text NOT NULL,
    reverse integer NOT NULL DEFAULT 0,
    laps integer NOT NULL DEFAULT 3,
    time_ms integer NOT NULL,
    created_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS race_times_course_idx ON public.race_times (course, reverse, laps, time_ms ASC);

-- -------------------------------------------------------------
-- Enable Row Level Security (RLS) on all tables
-- -------------------------------------------------------------
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.race_times ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view published writings" ON public.writings
    FOR SELECT USING (published = 1);

CREATE POLICY "Public can view photo series" ON public.photo_series
    FOR SELECT USING (true);

CREATE POLICY "Public can view photos" ON public.photos
    FOR SELECT USING (true);

CREATE POLICY "Public can view visitor words" ON public.visitor_words
    FOR SELECT USING (true);

CREATE POLICY "Public can view visitor experiences" ON public.visitor_experiences
    FOR SELECT USING (true);

CREATE POLICY "Public can view race times" ON public.race_times
    FOR SELECT USING (true);

CREATE POLICY "Public can view portfolio content" ON public.portfolio_content
    FOR SELECT USING (true);

CREATE POLICY "Public can view project media" ON public.project_media
    FOR SELECT USING (true);

-- Public insert policies for visitor interactive features
CREATE POLICY "Public can submit contact messages" ON public.contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can leave a word" ON public.visitor_words
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can leave an experience note" ON public.visitor_experiences
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can submit lap times" ON public.race_times
    FOR INSERT WITH CHECK (true);

-- Storage bucket setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-media',
    'portfolio-media',
    true,
    52428800, -- 50 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage bucket public read policy
CREATE POLICY "Public can read portfolio media" ON storage.objects
    FOR SELECT USING (bucket_id = 'portfolio-media');
