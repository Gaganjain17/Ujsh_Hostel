

# Admin Panel + Supabase Schema Plan

## Current State
No admin panel, no Supabase integration, no auth. All data is hardcoded/placeholder.

## What We'll Build

### 1. SQL Schema File — `supabase/schema.sql`
One file with all Postgres SQL to run in Supabase SQL Editor:

- **Auth users** — seed two admin users via `auth.users` (gaganjain1717@gmail.com / Gagan@#17, ujshsion1@gmail.com / Ujshsion@#1)
- **`user_roles`** table with `app_role` enum (admin, user) + `has_role()` security definer function
- **`notices`** table — id, event, content, created_at
- **`gallery`** table — id, image_url, caption, created_at
- **`contact_submissions`** table — id, name, email, subject, message, created_at, is_read
- **`members`** table — id, name, role, position, details, category (enum: trust_list, trustee, managing_committee, life_member, patron, honorable_member, student_committee), photo_url, display_order
- **RLS policies** — public read on notices/gallery/members, authenticated admin write, contact_submissions insert for anon + read for admin
- **Storage bucket** — `gallery` bucket for image uploads

### 2. Supabase Client — `src/integrations/supabase/client.ts`
Initialize Supabase client (URL and anon key from env/config — user will connect via Lovable's Supabase connector).

### 3. Auth Context — `src/contexts/AuthContext.tsx`
- AuthProvider wrapping the app
- Login/logout functions using `supabase.auth.signInWithPassword`
- Role check using `has_role()` RPC

### 4. Admin Login Page — `src/pages/admin/Login.tsx`
- Email + password form at `/admin/login`
- Redirects to `/admin` on success

### 5. Protected Route — `src/components/admin/ProtectedRoute.tsx`
- Wraps admin routes, redirects to `/admin/login` if not authenticated admin

### 6. Admin Dashboard — `src/pages/admin/Dashboard.tsx`
- Overview cards: total notices, gallery images, unread contact messages
- Quick links to each section

### 7. Admin CRUD Pages
- **`src/pages/admin/ManageNotices.tsx`** — list, add, edit, delete notices
- **`src/pages/admin/ManageGallery.tsx`** — upload images, add captions, delete
- **`src/pages/admin/ManageMembers.tsx`** — manage all member categories from one page with category filter
- **`src/pages/admin/ContactSubmissions.tsx`** — view contact form submissions, mark as read

### 8. Update Public Pages
- `Notices.tsx`, `Gallery.tsx`, all management pages, `Contact.tsx` — fetch from Supabase instead of placeholder data

### 9. Routes in `App.tsx`
```
/admin/login
/admin          → Dashboard (protected)
/admin/notices  → ManageNotices (protected)
/admin/gallery  → ManageGallery (protected)
/admin/members  → ManageMembers (protected)
/admin/contacts → ContactSubmissions (protected)
```

### 10. Files Created/Modified

| Action | File |
|--------|------|
| Create | `supabase/schema.sql` (all SQL in one file) |
| Create | `src/contexts/AuthContext.tsx` |
| Create | `src/components/admin/ProtectedRoute.tsx` |
| Create | `src/pages/admin/Login.tsx` |
| Create | `src/pages/admin/Dashboard.tsx` |
| Create | `src/pages/admin/ManageNotices.tsx` |
| Create | `src/pages/admin/ManageGallery.tsx` |
| Create | `src/pages/admin/ManageMembers.tsx` |
| Create | `src/pages/admin/ContactSubmissions.tsx` |
| Modify | `src/App.tsx` (add admin routes) |
| Modify | `src/pages/Notices.tsx` (fetch from Supabase) |
| Modify | `src/pages/Gallery.tsx` (fetch from Supabase) |
| Modify | `src/pages/Contact.tsx` (save to Supabase) |
| Modify | All management pages (fetch from `members` table) |

### Important Note
After connecting Supabase through Lovable, you'll need to run the contents of `supabase/schema.sql` in your Supabase SQL Editor to create all tables, policies, and seed the admin users.

