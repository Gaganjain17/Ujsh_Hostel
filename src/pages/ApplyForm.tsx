/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight, Upload, Plus, Trash2, CheckCircle2, User, Shield, FileText } from "lucide-react";

interface ExamRow {
  examName: string;
  passingDate: string;
  marksObtained: string;
  totalMarks: string;
  institution: string;
  attempts: string;
  percentage: string;
}

export default function ApplyForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [applicationNo, setApplicationNo] = useState(() => Math.floor(100000 + Math.random() * 90000).toString());

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Admission & Personal Info
    studentType: "new",
    studyCourse: "",
    isTrustSeat: false,
    trustName: "",
    fullName: "",
    dateOfBirth: "",
    isJain: true,
    gnyatiGotra: "",
    nativePlace: "",
    birthPlace: "",
    isMarried: false,

    // Step 2: Student Address & Family Info
    studentAddress: "",
    studentMobile: "",
    studentEmail: "",
    nativeAddress: "",
    fatherName: "",
    fatherAddress: "",
    fatherPhone: "",
    fatherOccupation: "",
    fatherJobAddress: "",
    familyIncome: "",
    localGuardianName: "",
    localGuardianAddress: "",
    localGuardianPhone: "",

    // Step 3: History & Financial Details
    financialAidDetails: "",
    appliedBefore: false,
    appliedBeforeDetails: "",
    stayedBefore: false,
    stayedBeforeDetails: "",
    wasTrustSeat: false,
    wasTrustSeatName: "",

    // Step 3: Academic Details
    lastExamDetails: "",
    currentCollegeDetails: "",
  });

  // Step 3: Academic Results Table State
  const [academicResults, setAcademicResults] = useState<ExamRow[]>([
    { examName: "", passingDate: "", marksObtained: "", totalMarks: "", institution: "", attempts: "1", percentage: "" },
  ]);

  // Step 4: Documents Upload State
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    studentPhoto: null,
    aadharCard: null,
    jainCertificate: null,
    guardianId: null,
    marksheetLatest: null,
    marksheetPrevious: null,
    feeReceipt: null,
    caDocuments: null,
    studentSignature: null,
    guardianSignature: null,
    guardianUndertaking: null,
  });

  // Step 5: Declarations State
  const [declarations, setDeclarations] = useState({
    studentAgreed: false,
    parentAgreed: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddExamRow = () => {
    setAcademicResults((prev) => [
      ...prev,
      { examName: "", passingDate: "", marksObtained: "", totalMarks: "", institution: "", attempts: "1", percentage: "" },
    ]);
  };

  const handleRemoveExamRow = (index: number) => {
    if (academicResults.length === 1) return;
    setAcademicResults((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExamRowChange = (index: number, field: keyof ExamRow, value: string) => {
    setAcademicResults((prev) =>
      prev.map((row, i) => {
        if (i === index) {
          const updatedRow = { ...row, [field]: value };
          // Calculate percentage automatically if marks and total are provided
          if (field === "marksObtained" || field === "totalMarks") {
            const marks = parseFloat(field === "marksObtained" ? value : row.marksObtained);
            const total = parseFloat(field === "totalMarks" ? value : row.totalMarks);
            if (!isNaN(marks) && !isNaN(total) && total > 0) {
              updatedRow.percentage = ((marks / total) * 100).toFixed(2);
            }
          }
          return updatedRow;
        }
        return row;
      })
    );
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
    if (file) {
      toast({
        title: "File uploaded successfully",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      });
    }
  };

  const renderDocCard = (
      label: string,
      desc: string,
      fieldKey: string,
      icon: React.ComponentType<any>,
      accept: string = ".pdf,image/*"
    ) => {
      const file = files[fieldKey];
      const Icon = icon;

      return (
        <Card className="border bg-card hover:bg-card/75 transition-colors">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  {label}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{desc}</p>
            </div>
            <div className="flex items-center justify-between gap-4 mt-auto">
              {file ? (
                <div className="flex items-center justify-between w-full bg-muted/40 p-2.5 rounded-lg border border-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {file.type.includes("pdf") ? "PDF" : "IMG"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate max-w-[140px]" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                      className="h-8 px-2 text-xs font-medium"
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFileChange(fieldKey, null)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Input
                    type="file"
                    accept={accept}
                    id={`${fieldKey}-upload`}
                    className="hidden"
                    onChange={(e) => handleFileChange(fieldKey, e.target.files?.[0] || null)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                    className="cursor-pointer gap-1 text-xs shrink-0"
                  >
                    <label htmlFor={`${fieldKey}-upload`}>
                      <Upload className="h-3 w-3" /> Select File
                    </label>
                  </Button>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    No file chosen
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      );
    };

    const validateStep = () => {
      if (step === 1) {
        if (!formData.studyCourse) return "Please enter your Study Course/Stream.";
        if (formData.isTrustSeat && !formData.trustName) return "Please enter the recommending Trust Name.";
        if (!formData.fullName) return "Please enter your Full Name.";
        if (!formData.dateOfBirth) return "Please enter your Date of Birth.";
        if (!formData.gnyatiGotra) return "Please enter your Gnyati / Gotra / Sampradaay.";
        if (!formData.nativePlace) return "Please enter your Native Place.";
        if (!formData.birthPlace) return "Please enter your Birth Place.";
      } else if (step === 2) {
        if (!formData.studentMobile) return "Please enter your Mobile Number.";
        if (!formData.studentEmail) return "Please enter your Email Address.";
        if (!formData.studentAddress) return "Please enter your current Address.";
        if (!formData.nativeAddress) return "Please enter your Native Address.";
        if (!formData.fatherName) return "Please enter your Father's/Guardian's Full Name.";
        if (!formData.fatherPhone) return "Please enter your Father's/Guardian's Phone.";
        if (!formData.fatherAddress) return "Please enter your Father's/Guardian's Address.";
        if (!formData.fatherOccupation) return "Please enter your Father's Occupation.";
        if (!formData.fatherJobAddress) return "Please enter your Father's Job/Business Address.";
        if (!formData.familyIncome) return "Please enter your Family Annual Income.";
        if (!formData.localGuardianName) return "Please enter your Local Guardian's Full Name.";
        if (!formData.localGuardianPhone) return "Please enter your Local Guardian's Contact Number.";
        if (!formData.localGuardianAddress) return "Please enter your Local Guardian's Address.";
      } else if (step === 3) {
        if (formData.appliedBefore && !formData.appliedBeforeDetails) return "Please specify your prior application details.";
        if (formData.stayedBefore && !formData.stayedBeforeDetails) return "Please specify your prior stay details.";
        if (formData.stayedBefore && formData.wasTrustSeat && !formData.wasTrustSeatName) return "Please specify the recommended Trust Name for your prior stay.";
        if (!formData.financialAidDetails) return "Please enter your Financial Aid/Loan details (type 'No' or 'None' if not applicable).";
        if (!formData.lastExamDetails) return "Please enter your Last Exam Details.";
        if (!formData.currentCollegeDetails) return "Please enter the details of the College you have applied in.";

        const incompleteRow = academicResults.some(r => !r.examName || !r.passingDate || !r.percentage || !r.institution);
        if (incompleteRow) return "Please fill out Exam, Passing Date, Institution, and Percentage/CGPA columns in your Academic Results table.";
      } else if (step === 4) {
        if (!files.studentPhoto) return "Student Passport Photo is required.";
        if (!files.aadharCard) return "Student Aadhar Card Photo is required.";
        if (!files.jainCertificate) return "Jain Sangh Certificate is required.";
        if (!files.guardianId) return "Local Guardian ID & Address Proof is required.";
        if (!files.marksheetLatest) return "Mark Sheet of the Latest Exam is required.";
        if (!files.marksheetPrevious) return "Mark Sheet of the Previous Exam is required.";
        if (!files.feeReceipt) return "Fees Receipt of College / Institution is required.";
        if (!files.studentSignature) return "Student's Signature is required.";
        if (!files.guardianSignature) return "Father/Guardian's Signature is required.";
        if (!files.guardianUndertaking) return "Guardian's Undertaking Form is required.";

        const isCaStudent = formData.studyCourse.toLowerCase().includes("ca") || formData.studyCourse.toLowerCase().includes("chartered");
        if (isCaStudent && !files.caDocuments) return "Form 102/103 CA Documents are required for CA stream students.";
      }
      return null;
    };

    const handleNext = () => {
      const errorMsg = validateStep();
      if (errorMsg) {
        toast({ title: "Validation Error", description: errorMsg, variant: "destructive" });
        return;
      }
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBack = () => {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!declarations.studentAgreed || !declarations.parentAgreed) {
        toast({
          title: "Agreement Required",
          description: "Both student and father/guardian must agree to the rules and declarations before submitting.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);

      // Prepare payload
      const payload = {
        application_no: applicationNo,
        student_type: formData.studentType,
        study_course: formData.studyCourse,
        is_trust_seat: formData.isTrustSeat,
        trust_name: formData.trustName,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        is_jain: formData.isJain,
        gnyati_gotra: formData.gnyatiGotra,
        native_place: formData.nativePlace,
        birth_place: formData.birthPlace,
        is_married: formData.isMarried,
        student_address: formData.studentAddress,
        student_mobile: formData.studentMobile,
        student_email: formData.studentEmail,
        native_address: formData.nativeAddress || formData.nativePlace,
        father_name: formData.fatherName,
        father_address: formData.fatherAddress,
        father_phone: formData.fatherPhone,
        father_occupation: formData.fatherOccupation
          ? `${formData.fatherOccupation} (Family Income: Rs. ${formData.familyIncome})`
          : `Family Income: Rs. ${formData.familyIncome}`,
        father_job_address: formData.fatherJobAddress,
        local_guardian_name: formData.localGuardianName,
        local_guardian_address: formData.localGuardianAddress,
        local_guardian_phone: formData.localGuardianPhone,
        financial_aid_details: formData.financialAidDetails,
        applied_before: formData.appliedBefore,
        applied_before_details: formData.appliedBeforeDetails,
        stayed_before: formData.stayedBefore,
        stayed_before_details: formData.wasTrustSeat
          ? `${formData.stayedBeforeDetails} (Trust: ${formData.wasTrustSeatName})`
          : formData.stayedBeforeDetails,
        was_trust_seat: formData.wasTrustSeat,
        last_exam_details: formData.lastExamDetails,
        current_college_details: formData.currentCollegeDetails,
        academic_results: academicResults,
        // Store mock files urls
        student_photo_url: files.studentPhoto ? URL.createObjectURL(files.studentPhoto) : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        jain_certificate_url: files.jainCertificate ? "Uploaded Jain Certificate" : null,
        guardian_id_url: files.guardianId ? "Uploaded Guardian ID Proof" : null,
        aadhar_card_url: files.aadharCard ? "Uploaded Aadhar Card Proof" : null,
        marksheets_url: (files.marksheetLatest || files.marksheetPrevious)
          ? `Latest: ${files.marksheetLatest ? "Uploaded" : "None"}, Previous: ${files.marksheetPrevious ? "Uploaded" : "None"}`
          : null,
        fee_receipt_url: files.feeReceipt ? "Uploaded College Fee Receipt" : null,
        ca_documents_url: files.caDocuments ? "Uploaded CA Documents" : null,
        student_signature_url: files.studentSignature ? "Uploaded Student Signature" : null,
        guardian_signature_url: files.guardianSignature ? "Uploaded Guardian Signature" : null,
        guardian_undertaking_url: files.guardianUndertaking ? "Uploaded Guardian Undertaking Form" : null,
        status: "pending",
      };

      // Safe appending for local mock storage
      const isMock = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (isMock) {
        (payload as any).family_income = formData.familyIncome;
      }

      try {
        const { error } = await supabase.from("admission_submissions").insert(payload);
        if (error) throw error;
        setSuccess(true);
        toast({ title: "Form Submitted Successfully!", description: "Your digitalized admission form has been received." });
      } catch (err: any) {
        toast({
          title: "Submission Failed",
          description: err.message || "An error occurred while submitting your application.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const stepsList = ["Personal Details", "Contact & Family", "Academic History", "Documents", "Agreements & Submit"];

    if (success) {
      return (
        <>
          <PageHero title="Application Submitted!" subtitle="Thank you for applying to UJSH Sion" />
          <SectionWrapper>
            <div className="max-w-xl mx-auto text-center py-8">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 mb-6 animate-bounce">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">Admission Form Received!</h2>
              <p className="text-muted-foreground mb-8">
                Your online application has been digitally received. An administrator will review your academic record, verify your uploaded documents, and update your status.
              </p>

              <Card className="border border-border bg-card/50 text-left mb-8">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between border-b pb-2 text-sm">
                    <span className="font-semibold text-muted-foreground">Digital Application No:</span>
                    <span className="font-bold text-foreground text-primary">#UJSH-{applicationNo}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 text-sm">
                    <span className="font-semibold text-muted-foreground">Applicant Name:</span>
                    <span className="font-medium text-foreground">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 text-sm">
                    <span className="font-semibold text-muted-foreground">Study Course/Stream:</span>
                    <span className="font-medium text-foreground">{formData.studyCourse}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-muted-foreground">Submission Date:</span>
                    <span className="font-medium text-foreground">{new Date().toLocaleDateString("en-IN")}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/">Go to Home</Link>
                </Button>
                <Button asChild>
                  <Link to="/about">Explore Hostel Life</Link>
                </Button>
              </div>
            </div>
          </SectionWrapper>
        </>
      );
    }

    return (
      <>
        <PageHero title="Admission Application" subtitle="Fill out the digitalized admission form of UJSH Sion" />
        <SectionWrapper>
          <div className="max-w-4xl mx-auto">
            {/* Step indicator bar */}
            <div className="mb-10">
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 right-0 h-0.5 bg-muted top-1/2 -translate-y-1/2 z-0" />
                <div
                  className="absolute left-0 h-0.5 bg-primary top-1/2 -translate-y-1/2 transition-all duration-300 z-0"
                  style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
                />
                {stepsList.map((label, idx) => {
                  const sNum = idx + 1;
                  const isCompleted = step > sNum;
                  const isActive = step === sNum;
                  return (
                    <div key={label} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold text-xs border-2 transition-all duration-300 ${isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                            ? "bg-background border-primary text-primary ring-4 ring-primary/10 scale-110"
                            : "bg-background border-muted text-muted-foreground"
                          }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : sNum}
                      </div>
                      <span
                        className={`hidden md:block text-[10px] uppercase font-bold tracking-wider mt-2 transition-all duration-300 ${isActive ? "text-primary font-extrabold" : "text-muted-foreground"
                          }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Card */}
            <Card className="shadow-lg border-border">
              <CardContent className="p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* STEP 1: Admission & Personal Info */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="border-b pb-3">
                        <h2 className="text-xl font-display font-bold text-foreground">1. Application & Personal Details</h2>
                        <p className="text-xs text-muted-foreground">Digitalize hard copy of admission forms</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="applicationNo" className="text-sm font-semibold">Application No (Preallocated)</Label>
                          <Input id="applicationNo" value={`#UJSH-${applicationNo}`} disabled className="bg-muted text-foreground font-bold" />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Student Category</Label>
                          <RadioGroup value={formData.studentType} onValueChange={(val) => handleInputChange("studentType", val)} className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="new" id="cat-new" />
                              <Label htmlFor="cat-new" className="font-normal cursor-pointer">New Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="old" id="cat-old" />
                              <Label htmlFor="cat-old" className="font-normal cursor-pointer">Old (Returning) Student</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="studyCourse" className="text-sm font-semibold">Study Course/Stream <span className="text-destructive">*</span></Label>
                          <Input id="studyCourse" placeholder="e.g. Chartered Accountancy (CA), Engineering, Commerce" value={formData.studyCourse} onChange={(e) => handleInputChange("studyCourse", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Seat Option</Label>
                          <div className="flex items-center space-x-2 mt-2.5">
                            <Checkbox id="isTrustSeat" checked={formData.isTrustSeat} onCheckedChange={(val) => handleInputChange("isTrustSeat", !!val)} />
                            <Label htmlFor="isTrustSeat" className="text-sm font-normal cursor-pointer">Apply as a Trust Seat Student</Label>
                          </div>
                        </div>
                      </div>

                      {formData.isTrustSeat && (
                        <div className="space-y-2 animate-fade-in">
                          <Label htmlFor="trustName" className="text-sm font-semibold">Trust Name <span className="text-destructive">*</span></Label>
                          <Input id="trustName" placeholder="Enter full name of the recommending Trust" value={formData.trustName} onChange={(e) => handleInputChange("trustName", e.target.value)} required />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-semibold">Student's Full Name <span className="text-destructive">*</span></Label>
                        <Input id="fullName" placeholder="Surname First Name Father'sName" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth" className="text-sm font-semibold">Date of Birth <span className="text-destructive">*</span></Label>
                          <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Community (Religion)</Label>
                          <RadioGroup value={formData.isJain ? "jain" : "non-jain"} onValueChange={(val) => handleInputChange("isJain", val === "jain")} className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="jain" id="rel-jain" />
                              <Label htmlFor="rel-jain" className="font-normal cursor-pointer">Jain</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="non-jain" id="rel-non-jain" />
                              <Label htmlFor="rel-non-jain" className="font-normal cursor-pointer">Non-Jain</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="gnyatiGotra" className="text-sm font-semibold">Gnyati / Gotra / Related Group (Sampradaay) <span className="text-destructive">*</span></Label>
                          <Input id="gnyatiGotra" placeholder="e.g. Dasha Oshwal, Halari, Murti Pujak" value={formData.gnyatiGotra} onChange={(e) => handleInputChange("gnyatiGotra", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Marital Status</Label>
                          <RadioGroup value={formData.isMarried ? "married" : "unmarried"} onValueChange={(val) => handleInputChange("isMarried", val === "married")} className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="unmarried" id="mar-unmarried" />
                              <Label htmlFor="mar-unmarried" className="font-normal cursor-pointer">Unmarried</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="married" id="mar-married" />
                              <Label htmlFor="mar-married" className="font-normal cursor-pointer">Married</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="nativePlace" className="text-sm font-semibold">Native Place <span className="text-destructive">*</span></Label>
                          <Input id="nativePlace" placeholder="Town & State" value={formData.nativePlace} onChange={(e) => handleInputChange("nativePlace", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="birthPlace" className="text-sm font-semibold">Birth Place <span className="text-destructive">*</span></Label>
                          <Input id="birthPlace" placeholder="City & State" value={formData.birthPlace} onChange={(e) => handleInputChange("birthPlace", e.target.value)} required />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Address & Family Details */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="border-b pb-3">
                        <h2 className="text-xl font-display font-bold text-foreground">2. Student Address, Family & Guardian Details</h2>
                        <p className="text-xs text-muted-foreground">Digitalize contact and parent/guardian profiles</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-display font-bold text-base text-primary">Student Contacts</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="studentMobile" className="text-sm font-semibold">Student's Mobile No <span className="text-destructive">*</span></Label>
                            <Input id="studentMobile" placeholder="10-digit number" value={formData.studentMobile} onChange={(e) => handleInputChange("studentMobile", e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="studentEmail" className="text-sm font-semibold">Student's Email Address <span className="text-destructive">*</span></Label>
                            <Input id="studentEmail" type="email" placeholder="example@gmail.com" value={formData.studentEmail} onChange={(e) => handleInputChange("studentEmail", e.target.value)} required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="studentAddress" className="text-sm font-semibold">Student's Full Address (Current residing) <span className="text-destructive">*</span></Label>
                            {formData.nativeAddress && (
                              <Button
                                type="button"
                                variant="link"
                                className="text-xs h-auto p-0 font-normal text-primary hover:no-underline"
                                onClick={() => handleInputChange("studentAddress", formData.nativeAddress)}
                              >
                                Same as Native Address
                              </Button>
                            )}
                          </div>
                          <Input id="studentAddress" placeholder="Apartment name, Street, City, Pincode" value={formData.studentAddress} onChange={(e) => handleInputChange("studentAddress", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="nativeAddress" className="text-sm font-semibold">Native Place Full Address <span className="text-destructive">*</span></Label>
                            {formData.studentAddress && (
                              <Button
                                type="button"
                                variant="link"
                                className="text-xs h-auto p-0 font-normal text-primary hover:no-underline"
                                onClick={() => handleInputChange("nativeAddress", formData.studentAddress)}
                              >
                                Same as Current Address
                              </Button>
                            )}
                          </div>
                          <Input id="nativeAddress" placeholder="Enter native address" value={formData.nativeAddress} onChange={(e) => handleInputChange("nativeAddress", e.target.value)} required />
                        </div>
                      </div>

                      <hr className="my-6" />

                      <div className="space-y-4">
                        <h3 className="font-display font-bold text-base text-primary">Father's or Guardian's Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="fatherName" className="text-sm font-semibold">Father's/Guardian's Full Name <span className="text-destructive">*</span></Label>
                            <Input id="fatherName" placeholder="Full name of Father/Guardian" value={formData.fatherName} onChange={(e) => handleInputChange("fatherName", e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fatherPhone" className="text-sm font-semibold">Father's Mobile/Phone Number <span className="text-destructive">*</span></Label>
                            <Input id="fatherPhone" placeholder="Mobile or landline number" value={formData.fatherPhone} onChange={(e) => handleInputChange("fatherPhone", e.target.value)} required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fatherAddress" className="text-sm font-semibold">Father's/Guardian's Address <span className="text-destructive">*</span></Label>
                          <Input id="fatherAddress" placeholder="Address of father/guardian" value={formData.fatherAddress} onChange={(e) => handleInputChange("fatherAddress", e.target.value)} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="fatherOccupation" className="text-sm font-semibold">Father's Occupation / Profession <span className="text-destructive">*</span></Label>
                            <Input id="fatherOccupation" placeholder="e.g. Business, Salaried, Doctor" value={formData.fatherOccupation} onChange={(e) => handleInputChange("fatherOccupation", e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fatherJobAddress" className="text-sm font-semibold">Father's Business/Job Address <span className="text-destructive">*</span></Label>
                            <Input id="fatherJobAddress" placeholder="Address of office/shop" value={formData.fatherJobAddress} onChange={(e) => handleInputChange("fatherJobAddress", e.target.value)} required />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="familyIncome" className="text-sm font-semibold">Family Annual Income (in Rs.) <span className="text-destructive">*</span></Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₹</span>
                              <Input id="familyIncome" placeholder="e.g. 6,00,000" className="pl-7 text-foreground bg-background" value={formData.familyIncome} onChange={(e) => handleInputChange("familyIncome", e.target.value)} required />
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr className="my-6" />

                      <div className="space-y-4">
                        <h3 className="font-display font-bold text-base text-primary">Local Guardian Details (Mumbai)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="localGuardianName" className="text-sm font-semibold">Local Guardian's Full Name <span className="text-destructive">*</span></Label>
                            <Input id="localGuardianName" placeholder="Full name of Local Guardian in Mumbai" value={formData.localGuardianName} onChange={(e) => handleInputChange("localGuardianName", e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="localGuardianPhone" className="text-sm font-semibold">Local Guardian's Contact No <span className="text-destructive">*</span></Label>
                            <Input id="localGuardianPhone" placeholder="Mobile/Phone number" value={formData.localGuardianPhone} onChange={(e) => handleInputChange("localGuardianPhone", e.target.value)} required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="localGuardianAddress" className="text-sm font-semibold">Local Guardian's Address <span className="text-destructive">*</span></Label>
                          <Input id="localGuardianAddress" placeholder="Address of local guardian in Mumbai" value={formData.localGuardianAddress} onChange={(e) => handleInputChange("localGuardianAddress", e.target.value)} required />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: History & Academic Records */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="border-b pb-3">
                        <h2 className="text-xl font-display font-bold text-foreground">3. Academic Details & History</h2>
                        <p className="text-xs text-muted-foreground">Digitalize scholastic records and previous applications</p>
                      </div>

                      {/* Previous history details */}
                      <div className="space-y-4 p-4 bg-muted/40 rounded-lg border border-border">
                        <h3 className="font-display font-semibold text-sm text-foreground">Prior Hostel Stays / Application History</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Have you applied for admission in this hostel before?</Label>
                            <div className="flex gap-4">
                              <Button type="button" variant={formData.appliedBefore ? "default" : "outline"} size="sm" onClick={() => handleInputChange("appliedBefore", true)}>Yes</Button>
                              <Button type="button" variant={!formData.appliedBefore ? "default" : "outline"} size="sm" onClick={() => handleInputChange("appliedBefore", false)}>No</Button>
                            </div>
                            {formData.appliedBefore && (
                              <Input placeholder="Specify year and application details" value={formData.appliedBeforeDetails} onChange={(e) => handleInputChange("appliedBeforeDetails", e.target.value)} className="mt-2 text-xs" required />
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Have you stayed in this hostel before?</Label>
                            <div className="flex gap-4">
                              <Button type="button" variant={formData.stayedBefore ? "default" : "outline"} size="sm" onClick={() => handleInputChange("stayedBefore", true)}>Yes</Button>
                              <Button type="button" variant={!formData.stayedBefore ? "default" : "outline"} size="sm" onClick={() => handleInputChange("stayedBefore", false)}>No</Button>
                            </div>
                            {formData.stayedBefore && (
                              <div className="space-y-2 mt-2">
                                <Input placeholder="Period of stay and whether left" value={formData.stayedBeforeDetails} onChange={(e) => handleInputChange("stayedBeforeDetails", e.target.value)} className="text-xs" required />
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="wasTrustSeat" checked={formData.wasTrustSeat} onCheckedChange={(val) => handleInputChange("wasTrustSeat", !!val)} />
                                  <Label htmlFor="wasTrustSeat" className="text-xs font-normal cursor-pointer">Was it under a Trust Seat?</Label>
                                </div>
                                {formData.wasTrustSeat && (
                                  <Input placeholder="Specify Trust Name *" value={formData.wasTrustSeatName} onChange={(e) => handleInputChange("wasTrustSeatName", e.target.value)} className="mt-2 text-xs" required />
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mt-3 pt-3 border-t">
                          <Label htmlFor="financialAid" className="text-sm font-medium">Are you in receipt of any Financial Aid/Loan from any Institution? <span className="text-destructive">*</span></Label>
                          <Input id="financialAid" placeholder="Write 'No' or specify details" value={formData.financialAidDetails} onChange={(e) => handleInputChange("financialAidDetails", e.target.value)} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="lastExam" className="text-sm font-semibold">Which is the Last Exam Appeared & Whether Cleared <span className="text-destructive">*</span></Label>
                          <Input id="lastExam" placeholder="e.g. HSC (Commerce) - Cleared (92%)" value={formData.lastExamDetails} onChange={(e) => handleInputChange("lastExamDetails", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentCollege" className="text-sm font-semibold">College / Institution Applied in & For Which Year <span className="text-destructive">*</span></Label>
                          <Input id="currentCollege" placeholder="e.g. HR College of Commerce, FYBCOM" value={formData.currentCollegeDetails} onChange={(e) => handleInputChange("currentCollegeDetails", e.target.value)} required />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-semibold text-primary">Information & Results of the exams appeared in the last 2 years (Latest-First) *</Label>
                          <Button type="button" variant="outline" size="sm" onClick={handleAddExamRow} className="gap-1 text-xs">
                            <Plus className="h-3 w-3" /> Add Exam
                          </Button>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/50">
                                <TableHead className="w-[18%] text-xs font-bold">Exam Appeared</TableHead>
                                <TableHead className="w-[18%] text-xs font-bold">Date & Year of Passing</TableHead>
                                <TableHead className="w-[12%] text-xs font-bold">Marks Obtained (Optional)</TableHead>
                                <TableHead className="w-[12%] text-xs font-bold">Total Marks (Optional)</TableHead>
                                <TableHead className="w-[20%] text-xs font-bold">Institution & Board</TableHead>
                                <TableHead className="w-[10%] text-xs font-bold">Attempts</TableHead>
                                <TableHead className="w-[10%] text-xs font-bold">Percentage / CGPA <span className="text-destructive">*</span></TableHead>
                                <TableHead className="w-[8%]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {academicResults.map((row, index) => (
                                <TableRow key={index} className="hover:bg-transparent">
                                  <TableCell className="p-2">
                                    <Input placeholder="e.g. HSC" value={row.examName} onChange={(e) => handleExamRowChange(index, "examName", e.target.value)} className="h-8 text-xs" required />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Input placeholder="e.g. March 2026" value={row.passingDate} onChange={(e) => handleExamRowChange(index, "passingDate", e.target.value)} className="h-8 text-xs" required />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Input placeholder="e.g. 552" value={row.marksObtained} onChange={(e) => handleExamRowChange(index, "marksObtained", e.target.value)} className="h-8 text-xs" />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Input placeholder="e.g. 600" value={row.totalMarks} onChange={(e) => handleExamRowChange(index, "totalMarks", e.target.value)} className="h-8 text-xs" />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Input placeholder="e.g. Mithibai College" value={row.institution} onChange={(e) => handleExamRowChange(index, "institution", e.target.value)} className="h-8 text-xs" required />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Input type="number" min="1" value={row.attempts} onChange={(e) => handleExamRowChange(index, "attempts", e.target.value)} className="h-8 text-xs" required />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Input placeholder="e.g. 92% or 9.5 CGPA" value={row.percentage} onChange={(e) => handleExamRowChange(index, "percentage", e.target.value)} className="h-8 text-xs font-semibold" required />
                                  </TableCell>
                                  <TableCell className="p-2 text-center">
                                    <Button type="button" variant="ghost" size="icon" disabled={academicResults.length === 1} onClick={() => handleRemoveExamRow(index)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Document Uploads */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="border-b pb-3">
                        <h2 className="text-xl font-display font-bold text-foreground">4. Document Attachments</h2>
                        <p className="text-xs text-muted-foreground">Attach required certificates and proofs in digital formats</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Document Card: Passport Photo */}
                        <Card className="border bg-card hover:bg-card/75 transition-colors">
                          <CardContent className="p-5 flex flex-col justify-between h-full">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-semibold text-foreground">Student's Passport Size Photo <span className="text-destructive">*</span></h3>
                              </div>
                              <p className="text-xs text-muted-foreground mb-4">Required for issuing local hostel identity card. Max size 2MB (JPG/PNG).</p>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              {files.studentPhoto ? (
                                <div className="flex items-center justify-between w-full bg-muted/40 p-2.5 rounded-lg border border-border">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={URL.createObjectURL(files.studentPhoto)}
                                      alt="Student Passport Photo"
                                      className="h-14 w-14 rounded object-cover border border-border"
                                    />
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                                        {files.studentPhoto.name}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground">
                                        {(files.studentPhoto.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(URL.createObjectURL(files.studentPhoto!), "_blank")}
                                      className="h-8 text-xs font-medium"
                                    >
                                      View
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleFileChange("studentPhoto", null)}
                                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <Input type="file" accept="image/*" id="photo-upload" className="hidden" onChange={(e) => handleFileChange("studentPhoto", e.target.files?.[0] || null)} />
                                  <Button type="button" variant="outline" size="sm" asChild className="cursor-pointer gap-1 text-xs">
                                    <label htmlFor="photo-upload">
                                      <Upload className="h-3 w-3" /> Select Photo
                                    </label>
                                  </Button>
                                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    No file chosen
                                  </span>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Document Card: Aadhar Card */}
                        {renderDocCard(
                          "Student's Aadhar Card *",
                          "Required for government identity and address verification. Max size 2MB (JPG/PNG).",
                          "aadharCard",
                          FileText,
                          "image/*,.pdf"
                        )}

                        {/* Document Card: Student Signature */}
                        {renderDocCard(
                          "Student's Signature *",
                          "Scanned signature image or photo of the student. Max size 2MB (JPG/PNG).",
                          "studentSignature",
                          FileText,
                          "image/*"
                        )}

                        {/* Document Card: Guardian Signature */}
                        {renderDocCard(
                          "Father/Guardian's Signature *",
                          "Scanned signature image or photo of the father/guardian. Max size 2MB (JPG/PNG).",
                          "guardianSignature",
                          FileText,
                          "image/*"
                        )}

                        {/* Document Card: Guardian Undertaking Form */}
                        {renderDocCard(
                          "Guardian's Undertaking Form *",
                          "Signed copy of the Guardian's Undertaking document. Max size 5MB (PDF/JPG).",
                          "guardianUndertaking",
                          FileText,
                          ".pdf,image/*"
                        )}

                        {/* Document Card: Jain Certificate */}
                        {renderDocCard(
                          "Jain Sangh (Community) Certificate *",
                          "Proof of being a Jain issued by Jain Sangh / Trust. Max size 5MB (PDF/JPG).",
                          "jainCertificate",
                          Shield,
                          ".pdf,image/*"
                        )}

                        {/* Document Card: LG Address & ID Proof */}
                        {renderDocCard(
                          "Local Guardian ID & Address Proof *",
                          "Government ID (Aadhar Card, PAN Card, or Passport). Max size 5MB.",
                          "guardianId",
                          FileText,
                          ".pdf,image/*"
                        )}

                        {/* Document Card: Marksheet Latest */}
                        {renderDocCard(
                          "Mark Sheet I *",
                          "Academic marksheet of the most recently cleared examination. Max size 5MB (PDF/JPG).",
                          "marksheetLatest",
                          FileText,
                          ".pdf,image/*"
                        )}

                        {/* Document Card: Marksheet Previous */}
                        {renderDocCard(
                          "Mark Sheet II *",
                          "Academic marksheet of the examination prior to the latest one. Max size 5MB (PDF/JPG).",
                          "marksheetPrevious",
                          FileText,
                          ".pdf,image/*"
                        )}

                        {/* Document Card: Fee Receipt */}
                        {renderDocCard(
                          "Fees Receipt of College / Bonafide Certificate *",
                          "Proof of active enrollment in the college/course. Max size 5MB (PDF/JPG).",
                          "feeReceipt",
                          FileText,
                          ".pdf,image/*"
                        )}

                        {/* Document Card: CA Documents */}
                        {renderDocCard(
                          `CA Students Documents (Form 102/103) ${(formData.studyCourse.toLowerCase().includes("ca") ||
                            formData.studyCourse.toLowerCase().includes("chartered"))
                            ? "*"
                            : ""
                          }`,
                          "Form 102, 103, and Stipend Letter. Only required for CA Students.",
                          "caDocuments",
                          FileText,
                          ".pdf,image/*"
                        )}

                      </div>
                    </div>
                  )}

                  {/* STEP 5: Rules, Declarations & Submit */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="border-b pb-3">
                        <h2 className="text-xl font-display font-bold text-foreground">5. Hostel Rules, Regulations & Declarations</h2>
                        <p className="text-xs text-muted-foreground">Read instructions carefully and submit the digitized application</p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-primary">UJSH Hostel Rules & Regulations</Label>

                        <div className="border rounded-lg bg-card text-card-foreground p-6 md:p-8 space-y-6 text-sm leading-relaxed border-border">
                          <p className="font-bold text-base text-foreground mb-4">Please read the following 40 rules and regulations carefully:</p>

                          <ol className="list-decimal list-outside pl-5 space-y-4 text-muted-foreground">
                            <li>Students who wish to pursue higher education and have successfully passed Secondary School Certificate (SSC) or Equivalent will be considered for admission in the hostel. Admission to the students is on Merit basis. Graduation Degree/ Diploma students would have first preference during the admission process.</li>
                            <li>Those students who have successfully secured an admission with any college/institution only will be eligible for admission in the hostel.</li>
                            <li>Those students who have been admitted in the hostel must get themselves medically tested from the doctors approved by the hostel. Students who have been admitted have to provide a physical fitness certificate and medical reports from the doctor and on it being satisfactory the student shall be finally admitted to the hostel.</li>
                            <li>
                              a) Students will be informed about their admission in the hostel by the concerned authorities.
                              <br />b) Students who are successfully admitted to the hostel will have to pay the Fees in full which includes Term Fee, General and Mess Deposit, Development Fund, Establishment charges and Students Union Fee.
                              <br />c) General and Mess Deposit will be refunded to the students only after they leave the hostel and after deduction of any Fine/Penalty/Pending Dues.
                              <br />d) If an admitted student does not come to stay in the hostel due to any reason then the fees paid will not be refunded under any circumstances.
                              <br />e) Students would not be refunded the deposits unless he submits the leave form along with the deposit receipts to the Superintendent while leaving the hostel.
                              <br />f) If any student leaves the institution during the year without informing the Superintendent he will not be eligible for refund of deposits.
                            </li>
                            <li>Two passport size photos to be submitted along with the admission form for issuance of Identity card. Students without the Identity card shall not be allowed to enter the hostel and the same shall be verified by the security guard in charge at the gate.</li>
                            <li>New Admission form has been filled in every year by the students for continuation of admission in the hostel. Admission shall be on the basis of Merit, any student found not obeying any of the rules and regulations of the institution may not be readmitted to the institution and the right to refuse admission will be with the Managing Committee.</li>
                            <li>
                              The Academic Year of the hostel is divided into 2 Terms:
                              <br />a) 1st Term starting from 20th June and ending on 15th October.
                              <br />b) 2nd Term starting from 15th November and ending on 31st May.
                              <br />The right to alter the dates of the respective terms rests with the Managing Committee.
                            </li>
                            <li>Students have to stay in the rooms allotted by the authority in charge.</li>
                            <li>The hostel will provide the students with a cupboard, study table, chairs, and bed with mattress. Pillows, bed-sheets will not be provided by the hostel and the students have to manage on their own.</li>
                            <li>Hostel premises, walls, furniture, gymnasium, sports room facility, library etc, shall be well maintained by the students. The rooms shall be compulsorily kept clean by the students. Also a proper dress code is a must for the students of the hostel.</li>
                            <li>The furniture, rooms, electrical fittings, or any facility provided by the hostel should be properly maintained by the students and damage caused to any of the properties of the hostel will be reimbursed from the respective student. If no student is taking up responsibility for the damage then all the students of the concerned room shall be held responsible and penalised appropriately.</li>
                            <li>Any damage caused to the property of the hostel due to negligence of the student shall be recovered from the parent/ guardian of the student.</li>
                            <li>The students shall turn off the lights, fans, geysers, or any other electrical appliances when not required and save the electrical energy of the hostel.</li>
                            <li>Students have to pay for the mess charges every month which includes lunch, dinner and standing charges. Canteen charges for breakfast/refreshments have to be paid separately.</li>
                            <li>Mess will remain closed from 1st June to 30th June every year. The decision for changes in the dates rests with the Managing Committee.</li>
                            <li>Dinner has to be completed by all the students by 9.30 pm. No late dish facility will be allowed. All the students should be present inside the hostel by 11 pm. No students shall be allowed to leave the hostel premises without the permission of the Superintendent after 11 pm.</li>
                            <li>Students can meet their Guests/Friends in the visitor room. No outsiders shall be allowed in the hostel after 10pm.</li>
                            <li>Jain Religion rules to be strictly followed by each and every student. Non-Jain (onion, garlic, potato etc) and Non Veg food is strictly prohibited in the hostel. During Paryushan Parv, Chaitry, Asomas, Oly and Monthly Tithi's no green vegetables will be prepared in the mess. During Paryushan Parv Chovihar will be compulsory for all the students. Playing cards, consumption of alcohol, any kind of smoking activities including hookah, drug abuse etc. are totally prohibited. Admission of the student found doing any of the above activities shall be terminated.</li>
                            <li>Students must follow and take part in all the Religious activities including group prayers, bhakti etc.</li>
                            <li>Any kind of mischief, fights/quarrels, damage to property, absenteeism while taking attendance in the hostel, absenteeism during religious activities etc. shall be checked by the Superintendent and reported to the Managing Committee (Trustees of the hostel).</li>
                            <li>Playing loud music, or any other activity, which disturbs fellow roommates, students, and neighbouring premises shall not be allowed.</li>
                            <li>Students shall not be allowed to take books, belonging to the hostel library, outside the hostel premises.</li>
                            <li>Leave application to be filled in and an entry to be made in the register book if any student goes on leave for a few days. Entry to be made in the same register book on return. Any student for any reason has to go home or leave the institution has to make an application in writing giving reasons for the same including duration of the leave to the Superintendent. If the student leaves the hostel on medical grounds then he has to bring a medical/fitness certificate from the doctor on his return. He will be allowed to return on the approval of the Superintendent.</li>
                            <li>Once the exams are over, the student needs to inform the Superintendent of the same. Hostel premises need to be vacated by the student within 2 days after the completion of their college/university exams.</li>
                            <li>If any student remains absent without prior permission his admission may stand cancelled and a new student can be admitted in his place.</li>
                            <li>Admission of students found physically unfit or having some serious health issues like contagious disease shall be discontinued on medical grounds.</li>
                            <li>Students who fail in their respective exams will not be allowed to keep the term.</li>
                            <li>Any student found being employed on a job, doing any business activity, neglecting college attendance, or having any kind of objectionable character and breaches any rules and regulations of the hostel shall have his admission terminated by the concerned authority of the hostel.</li>
                            <li>Any misinformation in the documents submitted, undue alteration of mark sheets, fake mark sheets, fake medical reports, etc. if detected shall be considered as a serious breach of rules and regulations and the admission of the student shall be terminated.</li>
                            <li>Parents/Local Guardian of the students who are fined/punished shall be informed and might be called to the hostel by the concerned authorities.</li>
                            <li>Parents/Local Guardian of the student who have made a breach of rules and regulations of the hostel shall have to remain present as and when called by the Managing Committee.</li>
                            <li>The students shall be required to handover all the properties of the hostel in an undamaged condition to the Superintendent before leaving and clear their pending accounts if any.</li>
                            <li>While leaving the hostel the students have to take their belongings with them and hand over the keys of the cupboard to the Superintendent. Management has the right to break open the lock of the cupboard if necessary. Management shall not be held responsible for any loss caused to the student.</li>

                            <div className="pt-4 border-t border-muted">
                              <h4 className="font-bold text-sm text-foreground underline mb-2">Rules and Regulations with respect to Trust Seat Students</h4>
                            </div>

                            <li>Trust seat students shall be admitted to the hostel based on the rules and regulations of the hostel.</li>
                            <li>Once trust seat students exams get over/trust seat student leaves the hostel, a new student shall be admitted in his place in the hostel.</li>
                            <li>Trust seat student shall fill in his admission form within the due date of the admission process. Seats will be allotted as per vacancies in the respective trust seats.</li>
                            <li>No other student shall be admitted in the place of a student who is allotted a trust seat until and unless there is a vacancy in the number of trust seats.</li>
                            <li>Rules and regulations as decided by the Managing committee of the hostel shall be applicable to the trust seat students as are applicable to the non-trust seat students of the hostel.</li>
                            <li>Addition/Deletion of any rules and regulations shall be applicable to all the students of the hostel.</li>
                            <li>Action shall be taken on students found breaching any of the rules and regulations of the hostel which are applicable to all the students of the hostel.</li>
                          </ol>

                          <div className="pt-4 border-t border-muted text-right italic text-muted-foreground">
                            Trustees<br />United Jain Students Home
                          </div>

                          <p className="font-bold text-foreground mt-4">
                            I have read all the above rules and regulations and the rules and regulations which shall be hereby added shall be followed and abided by me.
                          </p>
                        </div>
                      </div>

                      <hr className="my-6" />

                      <div className="space-y-4 bg-muted/30 p-5 rounded-lg border border-border">
                        <h3 className="font-display font-bold text-sm text-foreground">Legal Declarations</h3>

                        <div className="space-y-4 mt-3">
                          <div className="flex items-start space-x-3">
                            <Checkbox id="dec-student" checked={declarations.studentAgreed} onCheckedChange={(val) => setDeclarations(prev => ({ ...prev, studentAgreed: !!val }))} className="mt-1" />
                            <div className="grid gap-1.5 leading-none">
                              <Label htmlFor="dec-student" className="text-sm font-semibold text-foreground cursor-pointer">
                                Student's Declaration
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                I, <span className="underline font-medium text-foreground">{formData.fullName || "[Student's Full Name]"}</span>, hereby request you to give me admission in the said hostel. I agree to follow and abide by all rules and regulations of the hostel. I further state that all information provided in this admission form is true and correct.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 pt-3 border-t border-muted">
                            <Checkbox id="dec-parent" checked={declarations.parentAgreed} onCheckedChange={(val) => setDeclarations(prev => ({ ...prev, parentAgreed: !!val }))} className="mt-1" />
                            <div className="grid gap-1.5 leading-none">
                              <Label htmlFor="dec-parent" className="text-sm font-semibold text-foreground cursor-pointer">
                                Father's / Guardian's Declaration
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                I, <span className="underline font-medium text-foreground">{formData.fatherName || "[Father/Guardian's Full Name]"}</span>, hereby state that my son/relative wishes to apply for admission in your esteemed hostel. I declare that the information filled is true and correct. My son/relative will follow and abide by all rules and regulations.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step buttons */}
                  <div className="flex justify-between pt-6 border-t border-border">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                      </Button>
                    ) : (
                      <Button type="button" variant="ghost" asChild>
                        <Link to="/apply">Cancel</Link>
                      </Button>
                    )}

                    {step < 5 ? (
                      <Button type="button" onClick={handleNext}>
                        Next <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                        {loading ? "Submitting Application..." : "Submit Admission Form"}
                      </Button>
                    )}
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>
        </SectionWrapper>
      </>
    );
  }
