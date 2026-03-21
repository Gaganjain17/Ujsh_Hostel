# Memory: index.md
Updated: now

UJSH hostel website rebuild - design system and architecture decisions

## Design System
- Fonts: Playfair Display (display), Source Sans 3 (body)
- Primary: warm orange hsl(18, 85%, 46%)
- Secondary: golden yellow hsl(45, 90%, 48%)
- Background: warm cream hsl(36, 40%, 97%)
- Foreground: warm dark hsl(15, 30%, 12%)

## Architecture
- React + Vite + Tailwind + React Router
- Supabase for backend (user connects externally)
- SQL schema in supabase/schema.sql
- Admin panel at /admin with protected routes
- AuthContext with has_role() RPC for admin check
- Contact form saves to contact_submissions table
- All management pages fetch from members table by category
- Notices, Gallery fetch from respective tables

## Key Components
- PageHero: title/subtitle with dark overlay
- MemberCard: reusable across 7 management pages
- SectionWrapper: consistent section spacing
- FacilityCard: linked cards with icons
- Layout: Header + Footer + Outlet
- AdminLayout: sidebar nav + outlet for admin pages
- ProtectedRoute: auth guard for admin routes

## Admin Pages
- /admin/login — email/password auth
- /admin — dashboard with counts
- /admin/notices — CRUD notices
- /admin/gallery — upload/delete images (storage bucket)
- /admin/members — CRUD all member categories
- /admin/contacts — view/manage contact submissions

## DB Tables
- user_roles (app_role enum: admin, user)
- notices (title, content)
- gallery (image_url, caption)
- contact_submissions (name, email, subject, message, is_read)
- members (name, position, role, details, category enum, photo_url, display_order)

## Admin Credentials
- gaganjain1717@gmail.com
- ujshsion1@gmail.com

## Contact Info
- Phone: +91 82918 29191
- Email: ujshsion1@gmail.com
- Address: 64 United Jain Student Home Rd, Jain Society, Sion, Mumbai, Maharashtra 400022
