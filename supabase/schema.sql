-- ============================================================
-- UJSH Hostel Website - Complete Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- 1. ENUMS
-- ============================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TYPE public.member_category AS ENUM (
  'trust_list',
  'trustee',
  'managing_committee',
  'life_member',
  'patron',
  'honorable_member',
  'student_committee'
);

-- 2. TABLES
-- ============================================================

-- User Roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Notices
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Gallery
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Contact Submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Members (all categories in one table)
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT,
  role TEXT,
  details TEXT,
  category member_category NOT NULL,
  photo_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 3. SECURITY DEFINER FUNCTION (prevents RLS recursion)
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. RLS POLICIES
-- ============================================================

-- user_roles: only admins can read
CREATE POLICY "Admins can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- notices: public read, admin write
CREATE POLICY "Anyone can read notices"
  ON public.notices FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert notices"
  ON public.notices FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update notices"
  ON public.notices FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete notices"
  ON public.notices FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- gallery: public read, admin write
CREATE POLICY "Anyone can read gallery"
  ON public.gallery FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert gallery"
  ON public.gallery FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery"
  ON public.gallery FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- contact_submissions: anyone can insert, admin can read/update
CREATE POLICY "Anyone can submit contact"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read contacts"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contacts"
  ON public.contact_submissions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contacts"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- members: public read, admin write
CREATE POLICY "Anyone can read members"
  ON public.members FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert members"
  ON public.members FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update members"
  ON public.members FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete members"
  ON public.members FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. STORAGE BUCKET
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

CREATE POLICY "Anyone can view gallery images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

-- 6. SEED ADMIN USERS
-- ============================================================
-- IMPORTANT: Create these users via Supabase Dashboard > Authentication > Users
-- Then run the following to assign admin roles:
--
-- After creating users gaganjain1717@gmail.com and ujshsion1@gmail.com
-- via the Auth dashboard, get their UUIDs and run:
--
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES
--   ('<gaganjain-uuid>', 'admin'),
--   ('<ujshsion-uuid>', 'admin');
--
-- Alternatively, sign up via your app's login page, then run:
--
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'gaganjain1717@gmail.com';
--
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'ujshsion1@gmail.com';
