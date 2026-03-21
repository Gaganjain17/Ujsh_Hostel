import { useEffect, useState } from "react";
import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("gallery").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHero title="Gallery" subtitle="Glimpses of life at UJSH" />
      <SectionWrapper>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading gallery...</p>
        ) : items.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative rounded-lg overflow-hidden group">
                <img src={item.image_url} alt={item.caption || "Gallery"} className="aspect-square object-cover w-full" />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-foreground/70 text-background text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
