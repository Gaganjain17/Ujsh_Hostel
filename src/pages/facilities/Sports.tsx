import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function Sports() {
  return (
    <>
      <PageHero title="Sports Room" subtitle="Recreation and indoor games" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed">
            The sports room is where students can engage in various physical activities and sports. It is equipped with equipment for activities like Pool, table tennis, carrom, and other indoor games, providing students with opportunities for recreation and exercise.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
