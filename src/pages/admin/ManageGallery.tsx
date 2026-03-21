import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, X } from "lucide-react";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export default function ManageGallery() {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleUpload = async () => {
    if (!file) return toast({ title: "Select an image", variant: "destructive" });
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

    const { error } = await supabase.from("gallery").insert({
      image_url: urlData.publicUrl,
      caption: caption || null,
    });

    if (error) {
      toast({ title: "Error saving", variant: "destructive" });
    } else {
      toast({ title: "Image added" });
      setShowForm(false);
      setFile(null);
      setCaption("");
      fetchGallery();
    }
    setUploading(false);
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Delete this image?")) return;
    // Extract filename from URL
    const parts = item.image_url.split("/");
    const fileName = parts[parts.length - 1];
    await supabase.storage.from("gallery").remove([fileName]);
    await supabase.from("gallery").delete().eq("id", item.id);
    toast({ title: "Image deleted" });
    fetchGallery();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Manage Gallery</h1>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-2">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Image"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-2">
              <Label>Caption (optional)</Label>
              <Input value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <Button onClick={handleUpload} disabled={uploading} className="gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No images yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-lg overflow-hidden border border-border">
              <img src={item.image_url} alt={item.caption || "Gallery"} className="aspect-square object-cover w-full" />
              <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="icon" onClick={() => handleDelete(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {item.caption && (
                <p className="absolute bottom-0 left-0 right-0 bg-foreground/70 text-background text-xs p-2 truncate">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
