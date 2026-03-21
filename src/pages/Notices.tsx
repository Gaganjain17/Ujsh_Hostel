import { useEffect, useState } from "react";
import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("notices").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setNotices(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHero title="Notices" subtitle="Stay updated with the latest announcements" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading notices...</p>
          ) : notices.length === 0 ? (
            <p className="text-center text-muted-foreground">No notices available.</p>
          ) : (
            notices.map((notice) => (
              <Card key={notice.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">{notice.title}</h3>
                      <p className="text-sm text-muted-foreground">{notice.content}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(notice.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SectionWrapper>
    </>
  );
}
