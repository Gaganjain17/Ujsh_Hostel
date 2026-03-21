import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import hostelLogo from "@/assets/hostel_logo.png";

const quickLinks = [
  { to: "/about", label: "About Us" },
  { to: "/facilities", label: "Facilities" },
  { to: "/admission_procedure", label: "Admissions" },
  { to: "/notices", label: "Notices" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

const managementLinks = [
  { to: "/trust_list", label: "Trust List" },
  { to: "/trustee", label: "Trustees" },
  { to: "/managing_committee", label: "Managing Committee" },
  { to: "/student_committee", label: "Student Committee" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={hostelLogo} alt="UJSH" className="h-10 w-10" />
              <span className="font-display font-bold text-lg">United Jain Students Home</span>
            </div>
            <div className="text-sm opacity-80 leading-relaxed space-y-1">
              <p>64 United Jain Student Home Rd,</p>
              <p>Jain Society,</p>
              <p>Sion, Mumbai, Maharashtra 400022</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Management */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Management</h4>
            <ul className="space-y-2">
              {managementLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm opacity-80">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Sion, Mumbai, Maharashtra, India</span>
              </li>
              <li>
                <a href="tel:+918291829191" className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                  <Phone className="h-4 w-4 shrink-0" />
                  +91 82918 29191
                </a>
              </li>
              <li>
                <a href="mailto:ujshsion1@gmail.com" className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                  <Mail className="h-4 w-4 shrink-0" />
                  ujshsion1@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6">
          <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider opacity-70 text-center">Developed By</h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80">
            <div className="text-center">
              <p className="font-semibold">Gagan Jain</p>
              <p className="text-xs opacity-70">Batch 2022-2025</p>
            </div>
            <span className="hidden sm:inline opacity-40">•</span>
            <div className="text-center">
              <p className="font-semibold">Devansh Shah</p>
              <p className="text-xs opacity-70">Batch 2021-2024</p>
            </div>
          </div>
          <div className="text-center mt-2">
            <Link to="/developer" className="text-xs opacity-60 hover:opacity-100 transition-opacity underline">View Developer Profiles</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-60">
          <p>&copy; {new Date().getFullYear()} United Jain Students Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
