import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function Mess() {
  return (
    <>
      <PageHero title="Mess" subtitle="Pure Jain cuisine served with care" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed mb-4">
            The Mess exclusively serves Jain cuisine. It's a communal dining area where individuals gather to enjoy their meals together. Additionally, the Mess provides Tiffin services and accommodates guests for meals.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our kitchen maintains the highest standards of hygiene and quality, ensuring that every meal is nutritious and satisfying. The menu is carefully planned to offer variety while adhering to Jain dietary principles.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
