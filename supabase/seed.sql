-- whenvanshwrites: Supabase Database Initial Seeds
-- Default sample data (Initial portfolio content uses bundled defaults from data/*.json)

-- Seed initial visitor words (optional sample words)
INSERT INTO public.visitor_words (id, word, created_at) VALUES
    ('seed-word-1', 'clarity', 1715000000000),
    ('seed-word-2', 'craft', 1715100000000),
    ('seed-word-3', 'curiosity', 1715200000000)
ON CONFLICT (id) DO NOTHING;

-- Seed initial visitor experience notes
INSERT INTO public.visitor_experiences (id, name, experience, created_at) VALUES
    ('seed-exp-1', 'Fellow Builder', 'Loved the village route and the racing minigame!', 1715000000000)
ON CONFLICT (id) DO NOTHING;
