import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Phone, Mail, FileText, CheckCircle2, ChevronRight, AlertCircle, ShieldAlert } from "lucide-react";

export default function Apply() {
  const documents = [
    { title: "Jain Sangh Certificate", desc: "Official proof of being a Jain issued by a recognized Jain Sangh or Trust." },
    { title: "Local Guardian Address & ID Proof", desc: "Government ID (Aadhar/PAN/Passport) of your active guardian residing in Mumbai." },
    { title: "Marksheets of Last 2 Exams", desc: "Academic marksheets of the previous two consecutive semesters/years." },
    { title: "College Enrollment / Fee Receipt", desc: "Official receipt or college admission letter proving current year enrollment." },
    { title: "CA Student Proof (Forms 102/103)", desc: "CA article registration documents and stipend letter (Applicable for CA stream only)." },
    { title: "Passport Size Photo", desc: "Two high-resolution passport size photos in JPG/PNG format for digital ID cards." }
  ];

  const eligibility = [
    "Strictly only for students belonging to the Jain Community.",
    "Grants are merit-based depending on previous academic results.",
    "Must be pursuing full-time graduate, post-graduate, or professional courses (CA, engineering, medical, etc.) in Mumbai.",
    "Agree to strictly observe all religious Jain values, curfew times, and discipline guidelines."
  ];

  return (
    <>
      <PageHero title="Apply to UJSH" subtitle="Join our supportive, academic-focused Sion hostel community" />
      
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Main info & Online Form Link */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Online Form Hero Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden shadow-md">
              <div className="absolute right-0 top-0 w-24 h-24 bg-primary/10 rounded-full translate-x-8 -translate-y-8" />
              <CardContent className="p-6 md:p-8">
                <Badge className="bg-primary/20 text-primary border-transparent uppercase font-bold text-[10px] mb-3 inline-flex">
                  Digitalized Admission
                </Badge>
                <h2 className="font-display font-bold text-2xl text-foreground mb-3 leading-tight">
                  Online Hostel Admission Form (2026 - 2027)
                </h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  We have fully digitalized our admission process! You can now fill out the entire application form, add your academic results, and upload all required documents securely right from our website.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild className="font-semibold shadow-md gap-1">
                    <Link to="/apply/form">
                      Apply Online Now <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" disabled className="gap-2 border-border text-muted-foreground">
                    <Download className="h-4 w-4" /> Download PDF Form (Offline)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admission Guidelines & Eligibility */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" /> Eligibility & Guidelines
                </CardTitle>
                <CardDescription className="text-xs">Please review key admission requirements before starting</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-2.5 text-sm">
                  {eligibility.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-muted-foreground leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

          </div>

          {/* Required Documents checklist column */}
          <div className="space-y-6">
            
            {/* Documents Card */}
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/40 border-b pb-4">
                <CardTitle className="text-base font-display font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-primary" /> Required Documents
                </CardTitle>
                <CardDescription className="text-xs">Scan and prepare these files before filling the form</CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {documents.map((doc) => (
                  <div key={doc.title} className="space-y-1">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {doc.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground pl-3 leading-relaxed">{doc.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Help Support Card */}
            <Card className="border-border bg-card">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-display font-bold text-sm text-foreground">Admission Support Desk</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Have questions about seats availability, trust recomendations, or the online form? Reach out to our Sion hostel office:
                </p>
                <div className="space-y-2.5 pt-1 border-t text-xs">
                  <div className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href="tel:+918291829191" className="font-semibold">+91 82918 29191</a>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href="mailto:ujshsion1@gmail.com" className="font-semibold">ujshsion1@gmail.com</a>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </SectionWrapper>
    </>
  );
}

// Inline badge component replacement helper
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${className}`}>
      {children}
    </div>
  );
}

