import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, Instagram, Phone } from "lucide-react";

const developers = [
  {
    name: "Gagan Jain",
    batch: "Batch 2022-2025",
    native: "Jamner, Jalgaon, Maharashtra",
    contact: "7249413017",
    bio: "An Engineering student and passionate full-stack developer, Gagan specializes in creating robust, user-friendly web solutions.",
    email: "gaganjain1717@gmail.com",
    links: {
      linkedin: "https://www.linkedin.com/in/gagan-jain01",
      github: "https://github.com/gaganjain",
      instagram: "https://www.instagram.com/gagan_jain",
    },
  },
  {
    name: "Devansh Shah",
    batch: "Batch 2021-2024",
    native: "Ahmedabad, Gujarat",
    contact: "6353338281",
    bio: "A creative and skilled developer with a focus on front-end technologies, loves building aesthetically pleasing and high-performing applications with modern frameworks like Angular and Vue.js.",
    email: "devanshshah3007@gmail.com",
    links: {
      linkedin: "https://www.linkedin.com/in/devansh-shah-794b49257",
      github: "https://github.com/3007devansh",
      instagram: "https://www.instagram.com/devansh_shah",
    },
  },
];

export default function Developer() {
  return (
    <>
      <PageHero title="Meet Our Developers" subtitle="We are passionate about technology and strive to create impactful digital solutions." />
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {developers.map((dev) => (
            <Card key={dev.name} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-display font-bold text-3xl">{dev.name[0]}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-1">{dev.name}</h3>
                <p className="text-primary text-sm font-medium mb-1">{dev.batch}</p>
                <p className="text-muted-foreground text-sm mb-1">Native Place: {dev.native}</p>
                <p className="text-muted-foreground text-sm mb-3 flex items-center justify-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {dev.contact}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{dev.bio}</p>
                <div className="flex items-center justify-center gap-3">
                  <a href={dev.links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href={dev.links.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Github className="h-4 w-4" />
                  </a>
                  <a href={`mailto:${dev.email}`} className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Mail className="h-4 w-4" />
                  </a>
                  <a href={dev.links.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
