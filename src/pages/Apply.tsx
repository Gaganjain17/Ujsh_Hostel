import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Apply() {
  return (
    <>
      <PageHero title="Apply to UJSH" subtitle="Start your application today" />
      <SectionWrapper>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 md:p-8 text-center">
              <Download className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-display font-semibold text-xl mb-2">Download Application Form</h2>
              <p className="text-muted-foreground mb-6">
                Download the application form, fill it out, and submit it to the hostel office along with the required documents.
              </p>
              <Button size="lg" disabled>
                Download Form (Coming Soon)
              </Button>
              <div className="mt-8 pt-6 border-t text-left space-y-3">
                <h3 className="font-display font-semibold">Need Help?</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+918291829191" className="hover:text-primary">+91 82918 29191</a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:ujshsion1@gmail.com" className="hover:text-primary">ujshsion1@gmail.com</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </>
  );
}
