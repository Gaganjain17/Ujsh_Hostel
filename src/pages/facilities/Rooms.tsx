import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function Rooms() {
  return (
    <>
      <PageHero title="Rooms" subtitle="Your comfortable home away from home" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed">
            Our hostel rooms are designed for comfort and productivity, featuring four beds, separate cupboards for each resident, and a large central writing table. Well-lit and ventilated, these rooms provide an ideal environment for academic focus and group collaboration.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
