import { useState } from "react";
import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.name.length < 3) return toast({ title: "Name must be at least 3 characters", variant: "destructive" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast({ title: "Invalid email address", variant: "destructive" });
    if (form.subject.length < 4) return toast({ title: "Subject must be at least 4 characters", variant: "destructive" });
    if (form.message.length < 10) return toast({ title: "Message must be at least 10 characters", variant: "destructive" });

    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });

    if (error) {
      toast({ title: "Error sending message", description: "Please try again later.", variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "Thank you for contacting us. We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <>
      <PageHero title="Contact Us" subtitle="Get in touch with UJSH" />
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-display font-semibold mb-1">Address</h3>
                <p className="text-sm text-muted-foreground">64 United Jain Student Home Rd, Jain Society, Sion, Mumbai, Maharashtra 400022</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-display font-semibold mb-1">Phone</h3>
                <a href="tel:+918291829191" className="text-sm text-muted-foreground hover:text-primary">+91 82918 29191</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-display font-semibold mb-1">Email</h3>
                <a href="mailto:ujshsion1@gmail.com" className="text-sm text-muted-foreground hover:text-primary">ujshsion1@gmail.com</a>
              </div>
            </div>
          </div>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." rows={5} required />
                </div>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
                  <Send className="h-4 w-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </>
  );
}
