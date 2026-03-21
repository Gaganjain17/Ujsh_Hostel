import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import FacilityCard from "@/components/shared/FacilityCard";
import { UtensilsCrossed, BookOpen, Dumbbell, BedDouble, Coffee, Trophy } from "lucide-react";

const facilities = [
  { to: "/facilities/mess", title: "Mess", description: "The Mess exclusively serves Jain cuisine. Communal dining with Tiffin services and guest meals.", icon: UtensilsCrossed },
  { to: "/facilities/canteen", title: "Canteen", description: "Nutritious Jain snacks, breakfast, and beverages available throughout the day.", icon: Coffee },
  { to: "/facilities/gymnasium", title: "Gymnasium", description: "Dedicated space with exercise machines, weights, and fitness equipment.", icon: Dumbbell },
  { to: "/facilities/library", title: "Library", description: "24/7 air-conditioned library with electricity at every table for focused study.", icon: BookOpen },
  { to: "/facilities/sports", title: "Sports Room", description: "Pool, table tennis, carrom, and other indoor games for recreation.", icon: Trophy },
  { to: "/facilities/rooms", title: "Rooms", description: "Comfortable rooms with four beds, cupboards, and large writing tables.", icon: BedDouble },
];

export default function Facilities() {
  return (
    <>
      <PageHero title="Our Facilities" subtitle="Modern amenities for every aspect of student life" />
      <SectionWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {facilities.map((f) => (
            <FacilityCard key={f.to} {...f} />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
