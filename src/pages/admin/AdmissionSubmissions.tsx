/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Trash2, Eye, Search, Phone, Mail, User, BookOpen, GraduationCap, ShieldCheck, MapPin, Calendar, FileText, RotateCcw } from "lucide-react";

interface Submission {
  id: string;
  application_no: string;
  student_type: string;
  study_course: string;
  is_trust_seat: boolean;
  trust_name?: string;
  full_name: string;
  date_of_birth: string;
  is_jain: boolean;
  gnyati_gotra?: string;
  native_place: string;
  birth_place: string;
  is_married: boolean;
  student_address: string;
  student_mobile: string;
  student_email: string;
  native_address: string;
  father_name: string;
  father_address: string;
  father_phone: string;
  father_occupation?: string;
  father_job_address?: string;
  family_income?: string;
  local_guardian_name?: string;
  local_guardian_address?: string;
  local_guardian_phone?: string;
  financial_aid_details?: string;
  applied_before: boolean;
  applied_before_details?: string;
  stayed_before: boolean;
  stayed_before_details?: string;
  was_trust_seat: boolean;
  last_exam_details: string;
  current_college_details: string;
  academic_results: any[];
  student_photo_url?: string;
  jain_certificate_url?: string;
  guardian_id_url?: string;
  aadhar_card_url?: string;
  marksheets_url?: string;
  fee_receipt_url?: string;
  ca_documents_url?: string;
  student_signature_url?: string;
  guardian_signature_url?: string;
  guardian_undertaking_url?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function AdmissionSubmissions() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admission_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubmissions((data as Submission[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const sendApprovalEmail = async (student: Submission) => {
    const isMock = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    // Always print dynamic email layout to Developer Console during local development testing
    if (isLocal) {
      console.log(
        `%c📧 UJSH HOSTEL - ADMISSION CONFIRMATION LETTER (LOCAL LOG)%c\n` +
        `To: ${student.student_email}\n` +
        `Subject: 🎉 Admission Approved - UJSH Sion Hostel (App No: #UJSH-${student.application_no})\n\n` +
        `Dear ${student.full_name},\n\n` +
        `Congratulations! We are delighted to inform you that your application for admission at United Jain Students Home, Sion, Mumbai has been APPROVED.\n\n` +
        `--- APPLICATION DETAILS ---\n` +
        `• Application Number: #UJSH-${student.application_no}\n` +
        `• Course/Stream: ${student.study_course}\n` +
        `• Category: ${student.student_type.toUpperCase()} Student\n` +
        `• Allotment Date: ${new Date().toLocaleDateString("en-IN")}\n\n` +
        `--- NEXT STEPS TO SECURE ROOM ---\n` +
        `1. Bring physical copies of your uploaded documents (Jain Certificate, Marksheets, and Guardian ID proof).\n` +
        `2. Bring 2 physical passport-size photographs to the hostel office.\n` +
        `3. Complete your Term Fee payment at the UJSH Sion office within 5 working days.\n\n` +
        `We look forward to welcoming you into our community!\n\n` +
        `Warm regards,\n` +
        `Hostel Managing Committee\n` +
        `United Jain Students Home, Sion, Mumbai`,
        "color: #059669; font-weight: bold; font-size: 14px;",
        "color: inherit; font-size: 12px;"
      );
    }

    if (isMock) {
      toast({
        title: "📧 Confirmation Email Sent! (Simulated)",
        description: `Admission approval email dispatched to ${student.student_email}. View Developer Console (F12) for the log.`,
      });
      return;
    }

    try {
      // In production mode, invoke the Supabase Edge Function to send email!
      const { error } = await supabase.functions.invoke("send-approval-email", {
        body: {
          to: student.student_email,
          fullName: student.full_name,
          applicationNo: student.application_no,
          studyCourse: student.study_course,
          studentType: student.student_type,
        },
      });

      if (error) throw error;

      toast({
        title: "📧 Confirmation Email Sent!",
        description: `Admission approval email has been successfully sent to ${student.student_email}.`,
      });
    } catch (err: any) {
      console.error("Failed to send approval email via Supabase Edge Function:", err);
      toast({
        title: "Email Dispatch Failed",
        description: `Database status updated, but email sending failed: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("admission_submissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: `Application ${newStatus}`,
        description: `Successfully marked admission form #${id.substring(0, 5)} as ${newStatus}.`,
      });

      // Update local state and trigger email if approved
      const student = submissions.find((s) => s.id === id);
      if (newStatus === "approved" && student) {
        await sendApprovalEmail(student);
      }

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this admission application? This action is irreversible.")) return;

    try {
      const { error } = await supabase
        .from("admission_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Admission form has been deleted from records.",
      });

      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err: any) {
      toast({
        title: "Deletion Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.study_course.toLowerCase().includes(search.toLowerCase()) ||
      s.student_email.toLowerCase().includes(search.toLowerCase()) ||
      (s.application_no && s.application_no.includes(search));

    const matchesTab = activeTab === "all" || s.status === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Admission Applications</h1>
          <p className="text-sm text-muted-foreground">Manage and review digitalized student applications</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, course, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-px overflow-x-auto">
        {(["all", "pending", "approved", "rejected"] as const).map((tab) => {
          const count = submissions.filter((s) => tab === "all" || s.status === tab).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab} <span className="text-xs opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading applications...</p>
      ) : filteredSubmissions.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No applications found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSubmissions.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={s.student_photo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"}
                      alt={s.full_name}
                      className="h-12 w-12 rounded-full object-cover border"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-semibold text-base text-foreground">{s.full_name}</span>
                        {s.application_no && (
                          <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                            #UJSH-{s.application_no}
                          </span>
                        )}
                        <Badge
                          variant={
                            s.status === "approved"
                              ? "default"
                              : s.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs uppercase"
                        >
                          {s.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" /> {s.study_course}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Submitted: {new Date(s.created_at).toLocaleDateString("en-IN")}
                        </span>
                        {s.is_trust_seat && (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <ShieldCheck className="h-3.5 w-3.5" /> Trust Seat ({s.trust_name})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto justify-end">
                    <Button variant="outline" size="sm" onClick={() => setSelected(s)} className="gap-1.5 text-xs">
                      <Eye className="h-4 w-4" /> Review
                    </Button>

                    {s.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(s.id, "approved")}
                          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs"
                        >
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(s.id, "rejected")}
                          className="border-destructive text-destructive hover:bg-destructive/10 text-xs"
                        >
                          <X className="h-4 w-4" /> Reject
                        </Button>
                      </>
                    )}

                    {s.status !== "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(s.id, "pending")}
                        className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs gap-1"
                        title="Undo Decision"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Undo
                      </Button>
                    )}

                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader className="border-b pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selected.student_photo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"}
                      alt={selected.full_name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <DialogTitle className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                        {selected.full_name}
                        {selected.application_no && (
                          <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            #UJSH-{selected.application_no}
                          </span>
                        )}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                        Category: <span className="font-semibold uppercase">{selected.student_type} Student</span> | Course: <span className="font-semibold">{selected.study_course}</span>
                      </DialogDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={selected.status === "approved" ? "default" : selected.status === "rejected" ? "destructive" : "secondary"} className="uppercase font-bold px-3 py-1">
                      {selected.status}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-6 space-y-8 text-sm">

                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-base text-primary border-b pb-1.5 flex items-center gap-1.5">
                    <User className="h-4.5 w-4.5" /> 1. Personal & Contact Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground block">Date of Birth</span>
                      <span className="font-medium text-foreground">{selected.date_of_birth}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Religion/Community</span>
                      <span className="font-medium text-foreground">{selected.is_jain ? "Jain" : "Non-Jain"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Gotra / Sampradaay</span>
                      <span className="font-medium text-foreground">{selected.gnyati_gotra || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Marital Status</span>
                      <span className="font-medium text-foreground">{selected.is_married ? "Married" : "Unmarried"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Birth Place</span>
                      <span className="font-medium text-foreground">{selected.birth_place}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Native Place</span>
                      <span className="font-medium text-foreground">{selected.native_place}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Mobile Number</span>
                      <a href={`tel:${selected.student_mobile}`} className="font-semibold text-primary hover:underline flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" /> {selected.student_mobile}
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Email Address</span>
                      <a href={`mailto:${selected.student_email}`} className="font-semibold text-primary hover:underline flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" /> {selected.student_email}
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-xs text-muted-foreground block">Current Residential Address</span>
                      <span className="font-medium text-foreground flex items-start gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" /> {selected.student_address}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Native Address</span>
                      <span className="font-medium text-foreground flex items-start gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" /> {selected.native_address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parent & Local Guardian Details */}
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-base text-primary border-b pb-1.5 flex items-center gap-1.5">
                    <User className="h-4.5 w-4.5" /> 2. Parent & Local Guardian Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 p-3 bg-muted/40 rounded-lg border">
                      <p className="font-semibold text-sm text-foreground">Father / Primary Guardian</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground block">Name</span>
                          <span className="font-medium text-foreground">{selected.father_name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Phone</span>
                          <span className="font-medium text-foreground">{selected.father_phone}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground block">Address</span>
                          <span className="font-medium text-foreground">{selected.father_address}</span>
                        </div>
                        {selected.father_occupation && (
                          <div>
                            <span className="text-muted-foreground block">Occupation</span>
                            <span className="font-medium text-foreground">{selected.father_occupation}</span>
                          </div>
                        )}
                        {selected.family_income && (
                          <div>
                            <span className="text-muted-foreground block">Family Annual Income</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{selected.family_income}</span>
                          </div>
                        )}
                        {selected.father_job_address && (
                          <div>
                            <span className="text-muted-foreground block">Office/Shop Address</span>
                            <span className="font-medium text-foreground">{selected.father_job_address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 p-3 bg-muted/40 rounded-lg border">
                      <p className="font-semibold text-sm text-foreground">Local Guardian (Mumbai)</p>
                      {selected.local_guardian_name ? (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block">Name</span>
                            <span className="font-medium text-foreground">{selected.local_guardian_name}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Phone</span>
                            <span className="font-medium text-foreground">{selected.local_guardian_phone || "N/A"}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground block">Address</span>
                            <span className="font-medium text-foreground">{selected.local_guardian_address || "N/A"}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No local guardian information provided.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Records */}
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-base text-primary border-b pb-1.5 flex items-center gap-1.5">
                    <BookOpen className="h-4.5 w-4.5" /> 3. Academic Details & Results History
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground block">Last Exam Appeared & Cleared</span>
                      <span className="font-medium text-foreground">{selected.last_exam_details}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">College Applied in & Year</span>
                      <span className="font-medium text-foreground">{selected.current_college_details}</span>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden mt-3">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="text-xs font-bold">Exam</TableHead>
                          <TableHead className="text-xs font-bold">Date of Passing</TableHead>
                          <TableHead className="text-xs font-bold">Marks</TableHead>
                          <TableHead className="text-xs font-bold">Total</TableHead>
                          <TableHead className="text-xs font-bold">Institution / Board</TableHead>
                          <TableHead className="text-xs font-bold">Attempts</TableHead>
                          <TableHead className="text-xs font-bold">Percentage (%)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.academic_results && selected.academic_results.length > 0 ? (
                          selected.academic_results.map((row, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{row.examName}</TableCell>
                              <TableCell>{row.passingDate}</TableCell>
                              <TableCell>{row.marksObtained}</TableCell>
                              <TableCell>{row.totalMarks}</TableCell>
                              <TableCell>{row.institution}</TableCell>
                              <TableCell>{row.attempts}</TableCell>
                              <TableCell className="font-semibold text-primary">{row.percentage}%</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-xs text-muted-foreground italic py-3">
                              No passing details table rows available.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Prior History */}
                <div className="space-y-2 p-4 bg-muted/20 rounded-lg border">
                  <h4 className="font-semibold text-sm text-foreground">Hostel Stays & Financials History</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-2">
                    <div>
                      <span className="text-muted-foreground block">Applied to UJSH before?</span>
                      <span className="font-semibold text-foreground">{selected.applied_before ? `Yes (${selected.applied_before_details})` : "No"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Stayed at UJSH before?</span>
                      <span className="font-semibold text-foreground">
                        {selected.stayed_before ? `Yes (${selected.stayed_before_details})` : "No"}
                        {selected.stayed_before && selected.was_trust_seat && " - Trust Seat"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Received Financial Aid/Loans?</span>
                      <span className="font-semibold text-foreground">{selected.financial_aid_details || "No"}</span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-base text-primary border-b pb-1.5 flex items-center gap-1.5">
                    <FileText className="h-4.5 w-4.5" /> 4. Digital Uploaded Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">Passport Size Photo</span>
                        <span className="text-[10px] text-muted-foreground">Required</span>
                      </div>
                      {selected.student_photo_url ? (
                        <a href={selected.student_photo_url} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">View</a>
                      ) : <span className="text-muted-foreground italic">Missing</span>}
                    </div>

                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">Jain Certificate</span>
                        <span className="text-[10px] text-muted-foreground">Sangh Proof</span>
                      </div>
                      {selected.jain_certificate_url ? (
                        <span className="text-emerald-600 font-semibold">Attached</span>
                      ) : <span className="text-muted-foreground italic">Not uploaded</span>}
                    </div>

                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">Local Guardian Proof</span>
                        <span className="text-[10px] text-muted-foreground">Aadhar/ID</span>
                      </div>
                      {selected.guardian_id_url ? (
                        <span className="text-emerald-600 font-semibold">Attached</span>
                      ) : <span className="text-muted-foreground italic">Not uploaded</span>}
                    </div>

                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">Student Aadhar Card</span>
                        <span className="text-[10px] text-muted-foreground">Address/ID Proof</span>
                      </div>
                      {selected.aadhar_card_url ? (
                        <span className="text-emerald-600 font-semibold">Attached</span>
                      ) : <span className="text-muted-foreground italic">Not uploaded</span>}
                    </div>

                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">Marksheets (Last 2 Years)</span>
                        <span className="text-[10px] text-muted-foreground">{selected.marksheets_url || "Last 2 Exams PDFs"}</span>
                      </div>
                      {selected.marksheets_url ? (
                        <span className="text-emerald-600 font-semibold">Attached</span>
                      ) : <span className="text-muted-foreground italic">Not uploaded</span>}
                    </div>

                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">College Fee Receipt</span>
                        <span className="text-[10px] text-muted-foreground">Admission Proof</span>
                      </div>
                      {selected.fee_receipt_url ? (
                        <span className="text-emerald-600 font-semibold">Attached</span>
                      ) : <span className="text-muted-foreground italic">Not uploaded</span>}
                    </div>

                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">CA Documents (Form 102)</span>
                        <span className="text-[10px] text-muted-foreground">CA Students only</span>
                      </div>
                      {selected.ca_documents_url ? (
                        <span className="text-emerald-600 font-semibold">Attached</span>
                      ) : <span className="text-muted-foreground italic">Not uploaded</span>}
                    </div>

                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">Student's Signature</span>
                        <span className="text-[10px] text-muted-foreground">Scanned Sign</span>
                      </div>
                      {selected.student_signature_url ? (
                        <span className="text-emerald-600 font-semibold">Attached</span>
                      ) : <span className="text-muted-foreground italic">Not uploaded</span>}
                    </div>

                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">Father/Guardian's Signature</span>
                        <span className="text-[10px] text-muted-foreground">Scanned Sign</span>
                      </div>
                      {selected.guardian_signature_url ? (
                        <span className="text-emerald-600 font-semibold">Attached</span>
                      ) : <span className="text-muted-foreground italic">Not uploaded</span>}
                    </div>

                    <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-semibold text-foreground block">Guardian Undertaking</span>
                        <span className="text-[10px] text-muted-foreground">Signed Form</span>
                      </div>
                      {selected.guardian_undertaking_url ? (
                        <span className="text-emerald-600 font-semibold">Attached</span>
                      ) : <span className="text-muted-foreground italic">Not uploaded</span>}
                    </div>
                  </div>
                </div>

              </div>

              {/* Administrative Footer Actions */}
              <div className="flex justify-between items-center border-t pt-4 mt-4">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>

                <div className="flex gap-2">
                  {selected.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleUpdateStatus(selected.id, "approved")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
                      >
                        <Check className="h-4 w-4" /> Approve Application
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleUpdateStatus(selected.id, "rejected")}
                        className="font-semibold gap-1.5"
                      >
                        <X className="h-4 w-4" /> Reject Application
                      </Button>
                    </>
                  )}

                  {selected.status !== "pending" && (
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-muted-foreground italic self-center">
                        Application has been finalized as <span className="font-bold uppercase text-foreground">{selected.status}</span>.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(selected.id, "pending")}
                        className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-semibold gap-1.5"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Undo Decision
                      </Button>
                    </div>
                  )}

                  <Button variant="ghost" size="icon" onClick={() => handleDelete(selected.id)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
