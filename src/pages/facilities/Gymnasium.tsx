import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function Gymnasium() {
  return (
    <>
      <PageHero title="Gymnasium" subtitle="Stay fit and healthy" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed">
            The gym is a dedicated space for hostellers to engage in physical fitness activities and workouts. It's equipped with exercise machines, weights, and other equipment, allowing residents to maintain their health through regular exercise.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
