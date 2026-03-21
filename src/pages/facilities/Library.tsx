import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function Library() {
  return (
    <>
      <PageHero title="Library" subtitle="Your quiet space for learning" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed">
            Our hostel library provides an environment for learning and collaboration, offering 24/7 access, air-conditioned comfort, and central study tables. Each table is equipped with electricity for added convenience, fostering an ideal space for focused academic pursuits.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
