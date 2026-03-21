import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, X } from "lucide-react";

const CATEGORIES = [
  { value: "trust_list", label: "Trust List" },
  { value: "trustee", label: "Trustees" },
  { value: "managing_committee", label: "Managing Committee" },
  { value: "life_member", label: "Life Members" },
  { value: "patron", label: "Patrons" },
  { value: "honorable_member", label: "Honorable Members" },
  { value: "student_committee", label: "Student Committee" },
];

interface Member {
  id: string;
  name: string;
  position: string | null;
  role: string | null;
  details: string | null;
  category: string;
  photo_url: string | null;
  display_order: number;
}

export default function ManageMembers() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: "", position: "", role: "", details: "", category: "trustee", display_order: 0 });

  const fetchMembers = async () => {
    let query = supabase.from("members").select("*").order("display_order");
    if (filter !== "all") query = query.eq("category", filter);
    const { data } = await query;
    setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, [filter]);

  const handleSave = async () => {
    if (!form.name) return toast({ title: "Name is required", variant: "destructive" });

    const payload = {
      name: form.name,
      position: form.position || null,
      role: form.role || null,
      details: form.details || null,
      category: form.category,
      display_order: form.display_order,
    };

    if (editing) {
      const { error } = await supabase.from("members").update(payload).eq("id", editing.id);
      if (error) return toast({ title: "Error updating", variant: "destructive" });
      toast({ title: "Member updated" });
    } else {
      const { error } = await supabase.from("members").insert(payload);
      if (error) return toast({ title: "Error creating", variant: "destructive" });
      toast({ title: "Member added" });
    }
    resetForm();
    fetchMembers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    await supabase.from("members").delete().eq("id", id);
    toast({ title: "Member deleted" });
    fetchMembers();
  };

  const startEdit = (m: Member) => {
    setEditing(m);
    setForm({ name: m.name, position: m.position || "", role: m.role || "", details: m.details || "", category: m.category, display_order: m.display_order });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", position: "", role: "", details: "", category: "trustee", display_order: 0 });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold text-foreground">Manage Members</h1>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => { showForm ? resetForm() : setShowForm(true); }} size="sm" className="gap-2">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add Member"}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Details</Label>
                <Input value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <Button onClick={handleSave}>{editing ? "Update" : "Add Member"}</Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : members.length === 0 ? (
        <p className="text-muted-foreground">No members found.</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-foreground">{m.name}</span>
                  {m.position && <span className="text-sm text-muted-foreground ml-2">— {m.position}</span>}
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {CATEGORIES.find((c) => c.value === m.category)?.label}
                  </span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(m)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
