import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function StudentLife() {
  return (
    <>
      <PageHero title="Student Life" subtitle="Experience the vibrant community at UJSH" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Life at UJSH goes beyond academics. Our hostel is a vibrant community where students from diverse backgrounds come together, forming lifelong bonds. From cultural events to sports competitions, there's always something exciting happening.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Students participate in various activities including festival celebrations, community service, study groups, and recreational events. The hostel fosters an environment of mutual respect, discipline, and personal growth.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our student committee organizes regular events and ensures that every resident feels at home. Whether it's a late-night study session in the library or a game of carrom in the sports room, UJSH offers a well-rounded living experience.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
