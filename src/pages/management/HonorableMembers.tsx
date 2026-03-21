import { useEffect, useState } from "react";
import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import MemberCard from "@/components/shared/MemberCard";
import { supabase } from "@/integrations/supabase/client";

interface Member { id: string; name: string; position: string | null; role: string | null; details: string | null; photo_url: string | null; }

export default function HonorableMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("members").select("*").eq("category", "honorable_member").order("display_order").then(({ data }) => {
      setMembers(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHero title="Honorable Members" subtitle="Distinguished members of our community" />
      <SectionWrapper>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-muted-foreground">No honorable members added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <MemberCard key={m.id} name={m.name} role={m.position || m.role || "Honorable Member"} details={m.details || undefined} imageUrl={m.photo_url || undefined} />
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
