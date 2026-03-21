import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Download, FileText, ClipboardCheck, Clock, CheckCircle2, CreditCard } from "lucide-react";
import { ReactNode } from "react";

interface Step {
  icon: typeof Download;
  title: string;
  description: string;
  note?: string;
  list?: string[];
  extra?: ReactNode;
}

const steps: Step[] = [
  {
    icon: Download,
    title: "Step 1: Download Application Form",
    description: "Download and fill out the admission application form carefully.",
  },
  {
    icon: FileText,
    title: "Step 2: Documents to be submitted along with the admission form",
    description: "Gather all required documents including:",
    list: [
      "Aadhar Card",
      "Jain Sangh (Community) Certificate (Proof of being a Jain)",
      "Local Guardian's Letter",
      "Local Guardian's address and ID Proof (Aadhar / PAN / Passport)",
      "Mark sheets of last 2 exams appeared (Original as well as attested photocopy)",
      "Fees receipt of College / Institution applied in",
      "Form 102, 103 and Stipend Letter (Applicable only to CA Students)",
      "Trustee Letter (For Trustee Seat)",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Step 3: Submit Application",
    description: "Submit your completed application form along with all required documents to our office.",
    note: "The applications are accepted offline only.",
  },
  {
    icon: Clock,
    title: "Step 4: Application Review",
    description: "Your application will be reviewed by our admission committee.",
  },
  {
    icon: CheckCircle2,
    title: "Step 5: Acceptance of Application",
    description: "Acceptance of Application is sent on the given email.",
  },
  {
    icon: CreditCard,
    title: "Step 6: Fees Payment & Documents Verification",
    description: "Payment should be done on the given account number.",
  },
];

export default function AdmissionProcedure() {
  return (
    <>
      <PageHero title="Admission Procedure" subtitle="How to Apply for UJSH" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative flex gap-4 md:gap-6">
                {i < steps.length - 1 && (
                  <div className="absolute left-5 md:left-6 top-12 bottom-0 w-px bg-border" />
                )}
                <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center z-10">
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  {step.note && <p className="text-muted-foreground text-sm mt-1 font-medium">{step.note}</p>}
                  {step.list && (
                    <ul className="list-disc ml-5 mt-2 space-y-1 text-sm text-muted-foreground">
                      {step.list.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  )}

                  {/* Step 1: Download button */}
                  {i === 0 && (
                    <a
                      href="/forms/Admission_form.pdf"
                      download
                      className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download Application Form
                    </a>
                  )}

                  {/* Step 4: Terms info */}
                  {i === 3 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p className="mb-1">The Academic Year of the hostel is divided into 2 Terms:</p>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>1st Term: 1<sup>st</sup> July to 31<sup>st</sup> December</li>
                        <li>2nd Term: 1<sup>st</sup> January to 30<sup>th</sup> June</li>
                      </ul>
                    </div>
                  )}

                  {/* Step 6: Bank details */}
                  {i === 5 && (
                    <div className="mt-3 space-y-3">
                      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
                        <p><span className="font-semibold text-foreground">Account Number:</span> 1234567890</p>
                        <p><span className="font-semibold text-foreground">Account Name:</span> UJSH</p>
                        <p><span className="font-semibold text-foreground">IFSC Code:</span> UJSH0000000</p>
                        <p><span className="font-semibold text-foreground">Branch:</span> Mumbai</p>
                      </div>
                      <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                        <li>Submit the proof of payment done at the time of verification</li>
                        <li>Documents should be verified by the hostel authority</li>
                        <li>If found any discrepancy in documents then application will be rejected and no refund of fees will be done</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>
    </>
  );
}
