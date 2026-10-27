-- =========================================================================
-- IELTS CAMP — SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- Joylashtirish: Supabase loyihangizdagi "SQL Editor" bo'limiga nusxalang va Run bosing
-- =========================================================================

-- 1. Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  grade_or_age TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'yangi' CHECK (status IN ('yangi', 'boglanildi', 'qabul_qilindi', 'rad_etildi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  admin_comment TEXT DEFAULT ''
);

-- Indexing for fast queries
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_course_id ON public.applications(course_id);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);

-- 2. Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 200000,
  price_period TEXT NOT NULL DEFAULT 'oyiga',
  description TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  badge TEXT,
  duration TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  schedule TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial courses if empty
INSERT INTO public.courses (id, title, category, price, price_period, description, features, badge, duration, active, schedule)
VALUES 
(
  'english-cefr',
  'Ingliz tili / CEFR',
  'Chet tili',
  200000,
  'oyiga',
  'Ingliz tilini noldan C1 darajagacha o''rganish, CEFR va IELTS imtihonlariga tizimli tayyorgarlik. Grammatika, so''z boyligi, listening va speaking darslari.',
  '["Haftada 3 kun, 2 soatdan to''liq amaliy darslar", "Speaking club va munozara darslari bepul", "C1 darajadagi malakali o''qituvchidan individual nazorat", "Haftalik mock testlar va progress tahlili", "Maxsus konspektlar va audio materiallar bilan ta''minlash"]'::jsonb,
  'Eng ommabop',
  '3 - 6 oy',
  true,
  'Dushanba, Chorshanba, Juma'
),
(
  'history',
  'Tarix',
  'Gumanitar fan',
  200000,
  'oyiga',
  'O''zbekiston tarixi va Jahon tarixi fanlaridan DTM va oliy ta''lim muassasalariga kirish imtihonlariga chuqurlashtirilgan intensiv tayyorgarlik.',
  '["Haftada 3 kun, 2 soatdan darslar", "Yillik xronologiya va voqealarni yodda saqlash mnemonikasi", "DTM standartidagi minglab blok testlar tahlili", "Mavzulashtirilgan konspektlar va xaritalar bilan ishlash", "Oylik sinov imtihonlari va reyting tizimi"]'::jsonb,
  'DTM / Imtihon',
  '6 - 9 oy',
  true,
  'Seshanba, Payshanba, Shanba'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Anonymous users (public) can insert new applications (students applying)
CREATE POLICY "Public students can submit applications" 
ON public.applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Anonymous users CANNOT read all applications (protect student privacy)
-- Only service role / backend administrator can view or update applications
CREATE POLICY "Service role full access to applications" 
ON public.applications 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Courses are publicly readable by everyone
CREATE POLICY "Public can view active courses" 
ON public.courses 
FOR SELECT 
TO anon, authenticated
USING (active = true);

-- Only service role / admin can modify courses
CREATE POLICY "Service role can modify courses" 
ON public.courses 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
