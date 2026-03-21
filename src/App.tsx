import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

import Index from "@/pages/Index";
import About from "@/pages/About";
import TrustList from "@/pages/management/TrustList";
import Trustees from "@/pages/management/Trustees";
import ManagingCommittee from "@/pages/management/ManagingCommittee";
import LifeMembers from "@/pages/management/LifeMembers";
import Patrons from "@/pages/management/Patrons";
import HonorableMembers from "@/pages/management/HonorableMembers";
import StudentCommittee from "@/pages/management/StudentCommittee";
import Facilities from "@/pages/Facilities";
import Mess from "@/pages/facilities/Mess";
import Canteen from "@/pages/facilities/Canteen";
import Gymnasium from "@/pages/facilities/Gymnasium";
import Library from "@/pages/facilities/Library";
import Sports from "@/pages/facilities/Sports";
import Rooms from "@/pages/facilities/Rooms";
import Notices from "@/pages/Notices";
import Gallery from "@/pages/Gallery";
import AdmissionProcedure from "@/pages/AdmissionProcedure";
import Apply from "@/pages/Apply";
import StudentLife from "@/pages/StudentLife";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Developer from "@/pages/Developer";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import ManageNotices from "@/pages/admin/ManageNotices";
import ManageGallery from "@/pages/admin/ManageGallery";
import ManageMembers from "@/pages/admin/ManageMembers";
import ContactSubmissions from "@/pages/admin/ContactSubmissions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/trust_list" element={<TrustList />} />
              <Route path="/trustee" element={<Trustees />} />
              <Route path="/managing_committee" element={<ManagingCommittee />} />
              <Route path="/life_members" element={<LifeMembers />} />
              <Route path="/patrons" element={<Patrons />} />
              <Route path="/honorable_members" element={<HonorableMembers />} />
              <Route path="/student_committee" element={<StudentCommittee />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/facilities/mess" element={<Mess />} />
              <Route path="/facilities/canteen" element={<Canteen />} />
              <Route path="/facilities/gymnasium" element={<Gymnasium />} />
              <Route path="/facilities/library" element={<Library />} />
              <Route path="/facilities/sports" element={<Sports />} />
              <Route path="/facilities/rooms" element={<Rooms />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/admission_procedure" element={<AdmissionProcedure />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/student_life" element={<StudentLife />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/developer" element={<Developer />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="notices" element={<ManageNotices />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="members" element={<ManageMembers />} />
              <Route path="contacts" element={<ContactSubmissions />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
