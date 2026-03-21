import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Trash2, Mail } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ContactSubmissions() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    setSubmissions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    toast({ title: "Marked as read" });
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Contact Submissions</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <Card key={s.id} className={s.is_read ? "opacity-70" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{s.name}</span>
                      {!s.is_read && <Badge variant="destructive" className="text-xs">New</Badge>}
                    </div>
                    <a href={`mailto:${s.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {s.email}
                    </a>
                    <p className="text-sm font-medium text-foreground mt-2">{s.subject}</p>
                    <p className="text-sm text-muted-foreground mt-1">{s.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(s.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!s.is_read && (
                      <Button variant="ghost" size="icon" onClick={() => markRead(s.id)} title="Mark as read">
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
