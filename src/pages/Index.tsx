import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SectionWrapper from "@/components/shared/SectionWrapper";
import FacilityCard from "@/components/shared/FacilityCard";
import { UtensilsCrossed, BookOpen, Dumbbell, BedDouble, Coffee, Trophy, ArrowRight, Quote } from "lucide-react";

const facilities = [
  { to: "/facilities/rooms", title: "Sharing Rooms", description: "Comfortable rooms with four beds, separate cupboards, and large writing tables.", icon: BedDouble },
  { to: "/facilities/mess", title: "Best Mess", description: "Exclusively Jain cuisine with communal dining, Tiffin services, and guest meals.", icon: UtensilsCrossed },
  { to: "/facilities/canteen", title: "Canteen", description: "Variety of nutritious Jain snacks and meals throughout the day.", icon: Coffee },
  { to: "/facilities/library", title: "Library", description: "24/7 AC library with electricity at every table for focused academic study.", icon: BookOpen },
  { to: "/facilities/gymnasium", title: "Gymnasium", description: "Dedicated fitness space with modern equipment for regular exercise.", icon: Dumbbell },
  { to: "/facilities/sports", title: "Sports Room", description: "Pool, table tennis, carrom, and indoor games for recreation.", icon: Trophy },
];

const testimonials = [
  {
    name: "Ayush Manohar Bhandari",
    role: "Master Data Manager at Roche Diagnostics Mumbai",
    quote: "Who I am and where I stand today is all thanks to my beloved UJSH. It has played a crucial part in shaping me as a person, offering comfort when I felt lost in the city, helping me make lifelong friends.",
  },
  {
    name: "Devansh Shah",
    role: "Master in Data Science",
    quote: "UJSH provided a nurturing environment that felt like a second home during my academic years in Mumbai.",
  },
  {
    name: "Shreyash Sisodiya",
    role: "Self-Employed",
    quote: "The community at UJSH helped me grow both personally and professionally. The friendships made here are for life.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center bg-foreground text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground/70" />
        <div className="relative z-10 container text-center px-4 py-20">
          <p className="text-sm md:text-base uppercase tracking-[0.2em] text-primary-foreground/70 mb-4 font-medium">
            Welcome to UJSH
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            United Jain<br />Students Home
          </h1>
          <p className="max-w-xl mx-auto text-primary-foreground/80 mb-8 text-base md:text-lg leading-relaxed">
            A premier hostel for Jain students in Sion, Mumbai — fostering academic excellence and personal growth since inception.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="font-semibold">
              <Link to="/about">Learn More</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/admission_procedure">Admissions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About preview */}
      <SectionWrapper title="Welcome to UJSH, Sion" subtitle="A community-focused hostel providing a safe, comfortable, and enriching stay.">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed mb-6">
            UJSH Hostel is a premier accommodation facility exclusively for Jain students, offering a serene and supportive environment that fosters academic excellence and personal growth. Designed with modern amenities and a community-centric ethos, we ensure an optimal living experience for students pursuing their academic dreams.
          </p>
          <Button asChild variant="outline">
            <Link to="/about" className="gap-2">
              Read More <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SectionWrapper>

      {/* Facilities */}
      <SectionWrapper muted title="Explore Our Hostel" subtitle="State-of-the-art facilities for every aspect of student life.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {facilities.map((f) => (
            <FacilityCard key={f.to} {...f} />
          ))}
        </div>
      </SectionWrapper>

      {/* Testimonials */}
      <SectionWrapper title="Our Alumni Love Us">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <Quote className="h-8 w-8 text-primary/30 mb-3" />
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 italic">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-display font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Ready to Join UJSH?</h2>
          <p className="opacity-80 mb-6 max-w-lg mx-auto">Start your journey at our premier Jain hostel in Mumbai.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/apply">Apply Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
