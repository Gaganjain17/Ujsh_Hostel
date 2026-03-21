import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, X } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function ManageNotices() {
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [showForm, setShowForm] = useState(false);

  const fetchNotices = async () => {
    const { data } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
    setNotices(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.content) return toast({ title: "Fill all fields", variant: "destructive" });

    if (editing) {
      const { error } = await supabase.from("notices").update({ title: form.title, content: form.content, updated_at: new Date().toISOString() }).eq("id", editing.id);
      if (error) return toast({ title: "Error updating", variant: "destructive" });
      toast({ title: "Notice updated" });
    } else {
      const { error } = await supabase.from("notices").insert({ title: form.title, content: form.content });
      if (error) return toast({ title: "Error creating", variant: "destructive" });
      toast({ title: "Notice created" });
    }
    setForm({ title: "", content: "" });
    setEditing(null);
    setShowForm(false);
    fetchNotices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    await supabase.from("notices").delete().eq("id", id);
    toast({ title: "Notice deleted" });
    fetchNotices();
  };

  const startEdit = (notice: Notice) => {
    setEditing(notice);
    setForm({ title: notice.title, content: notice.content });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Manage Notices</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: "", content: "" }); }} size="sm" className="gap-2">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Notice"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} />
            </div>
            <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : notices.length === 0 ? (
        <p className="text-muted-foreground">No notices yet.</p>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <Card key={n.id}>
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">{n.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{n.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(n)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
