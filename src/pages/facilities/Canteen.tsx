import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function Canteen() {
  return (
    <>
      <PageHero title="Canteen" subtitle="Snacks, beverages, and light meals" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our hostel canteen offers a variety of nutritious Jain meals, including delicious breakfast and snacks. With a focus on quality and hygiene, it provides wholesome food that caters to the unique dietary preferences of our residents.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            A canteen is similar to a mess but offers additional food and beverage options beyond regular meals. It's a convenient spot for students to grab snacks, drinks, or light meals throughout the day, especially outside of regular meal times.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
