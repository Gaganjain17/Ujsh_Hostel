import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";

const milestones = [
  { year: "1917", text: "Foundation of UJSH at Princess Street, Mumbai, graced by Mahatma Gandhi." },
  { year: "1949", text: "Adoption of a new constitution, enabling inclusivity for all students." },
  { year: "1954", text: "Inauguration of the Sion building, accommodating 74 students." },
  { year: "1971", text: "Completion of the second building at Sion, expanding capacity and facilities." },
];

const chronicles = [
  { date: "24th June 1917", text: "Inauguration of UJSH by HH Zalawar Naresh Sir Bhawansinhji in the presence of Mahatma Gandhi, Shri Kanaiyalal Munshi, and other luminaries." },
  { date: "21st May 1952", text: "Foundation stone laying ceremony of the new building at Sion by Shri Manilal Mohakamchand Shah." },
  { date: "25th July 1954", text: "Inauguration of the Sion building by Shri Kanaiyalal Munshi, a prominent scholar of Gujarat." },
  { date: "11th July 1971", text: "Inauguration of the second building at Sion by Shri C. U. Shah, an ex-student and distinguished philanthropist." },
];

const personalities = [
  { name: "Mahatma Gandhi", text: "Attended the inaugural ceremony, endorsing UJSH's vision for inclusivity and education." },
  { name: "Shri Kanaiyalal Munshi", text: "Instrumental in UJSH's development, inaugurated the Sion building in 1954." },
  { name: "Shri C. U. Shah", text: "Philanthropist and ex-student, contributed significantly to the institution's expansion in 1971." },
];

const esteemedTrustees = [
  { name: "Shri Kapurchand Nemchand Mehta", text: "A resident of Vadaal Village, Jetpur, Shri Mehta's humble beginnings shaped his dedication to education. Overcoming financial struggles, he became a successful entrepreneur and philanthropist. He established the \"Shri Nemchand Kachrabhai and Bai Laadkibai Charitable Trust\" to support students and the community." },
  { name: "Shri Dipchand Savraj Gardi", text: "A barrister and philanthropist, Shri Gardi devoted his life to education and social welfare. He supported numerous institutions and established schools and nurseries in memory of his family. His belief in equality and harmony continues to inspire UJSH's values." },
  { name: "Shri Vadilal Motilal Shah", text: "The visionary founder of UJSH, Shri Shah's life was a testament to resilience and social commitment. From his humble student days to his efforts to unite Jain sects, his legacy defines UJSH's mission to foster brotherhood and educational excellence." },
  { name: "Shri Manilal Mohakamchand Shah", text: "A co-founder of UJSH, Shri Shah was known for his relentless dedication to unity and service. He championed the cause of supporting middle-class students and laid the foundation for a legacy of inclusivity at UJSH." },
  { name: "Shri Chimanlal Chakubhai Shah", text: "An accomplished solicitor and freedom fighter, Shri Shah's contributions spanned social, cultural, and educational domains. His fearless voice during the Quit India Movement and his leadership at UJSH symbolize his commitment to societal betterment." },
  { name: "Shri C. U. Shah", text: "A distinguished industrialist and philanthropist, Shri Shah dedicated his resources to uplift disadvantaged communities. As a former student of UJSH, his contributions ensured the institute's growth and self-sufficiency for future generations." },
];

export default function About() {
  return (
    <>
      <PageHero title="About Us" subtitle="Discover the Legacy of United Jain Students' Home" />

      {/* Introduction */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Welcome to United Jain Students' Home
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The United Jain Students' Home (UJSH), established in 1917, is a landmark institution dedicated to fostering education, community, and values. It was inaugurated by His Highness Zalawar Naresh Shri Bhawansinhji, graced by Mahatma Gandhi, and envisioned by reformers like Shri Vadilal Motilal Shah and Shri Manilal Mohakamchand Shah.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over the decades, UJSH has evolved into a holistic living experience for students, regardless of caste, creed, or background. Guided by Jain principles of Ahimsa, Aparigraha, and Anekantavada, UJSH continues to empower students for a brighter future.
              </p>
            </div>
            <div className="bg-muted rounded-xl aspect-[4/3] flex items-center justify-center text-muted-foreground text-sm">
              {/* Placeholder for hostel building image */}
              <span>Image coming soon</span>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Milestones */}
      <SectionWrapper muted title="Milestones">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {milestones.map((m) => (
            <div key={m.year} className="bg-background rounded-xl p-6 shadow-sm border text-center">
              <h3 className="text-3xl font-display font-bold text-primary mb-2">{m.year}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Chronicles */}
      <SectionWrapper title="Chronicles of Special Events">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {chronicles.map((c) => (
            <div key={c.date} className="bg-background rounded-xl p-6 shadow-sm border">
              <h4 className="font-display font-semibold text-primary mb-2">{c.date}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Historical Contributions */}
      <SectionWrapper muted title="Historical Contributions">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            UJSH owes its foundation and growth to the tireless efforts of visionaries like Shri Vadilal Motilal Shah, who observed the need for a unified space for Jain students across sects, and Shri Manilal Mohakamchand Shah, whose leadership and generosity laid the groundwork for UJSH's enduring legacy.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The institution has been supported by renowned trustees and donors, including Shri Kapurchand Nemchand Mehta and Shri Shreyanshprasad Jain, whose contributions enabled the expansion of facilities and scholarships for students in need.
          </p>
        </div>
      </SectionWrapper>

      {/* Our Rich Legacy */}
      <SectionWrapper title="Our Rich Legacy">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            UJSH was born during a time of societal divisions, when caste and sub-caste distinctions often hindered education. Recognizing this, Shri Vadilal Motilal Shah and Shri Manilal Mohakamchand Shah envisioned a space where tolerance, brotherhood, and mutual cooperation could flourish.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            From its humble beginnings on Princess Street in 1917 to the inauguration of its iconic building in Sion in 1954, UJSH has stood as a beacon of hope and excellence. Over the decades, it has been graced by luminaries like Mahatma Gandhi and Shri Kanaiyalal Munshi, and has nurtured countless leaders who have contributed to nation-building.
          </p>
        </div>
      </SectionWrapper>

      {/* Distinguished Personalities */}
      <SectionWrapper muted title="Distinguished Personalities">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {personalities.map((p) => (
            <div key={p.name} className="bg-background rounded-xl p-6 shadow-sm border text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-display font-bold text-xl">{p.name[0]}</span>
              </div>
              <h4 className="font-display font-semibold text-foreground mb-2">{p.name}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Esteemed Trustees */}
      <SectionWrapper title="Our Esteemed Trustees">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {esteemedTrustees.map((t) => (
            <div key={t.name} className="bg-background rounded-xl p-6 shadow-sm border">
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground text-xs">
                Photo
              </div>
              <h4 className="font-display font-semibold text-foreground text-center mb-3">{t.name}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
