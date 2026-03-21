import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Image, Users, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ notices: 0, gallery: 0, members: 0, unreadMessages: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [n, g, m, c] = await Promise.all([
        supabase.from("notices").select("id", { count: "exact", head: true }),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
      ]);
      setCounts({
        notices: n.count || 0,
        gallery: g.count || 0,
        members: m.count || 0,
        unreadMessages: c.count || 0,
      });
    };
    fetchCounts();
  }, []);

  const cards = [
    { title: "Notices", count: counts.notices, icon: FileText, to: "/admin/notices", color: "text-primary" },
    { title: "Gallery", count: counts.gallery, icon: Image, to: "/admin/gallery", color: "text-secondary" },
    { title: "Members", count: counts.members, icon: Users, to: "/admin/members", color: "text-accent-foreground" },
    { title: "Unread Messages", count: counts.unreadMessages, icon: Mail, to: "/admin/contacts", color: "text-destructive" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.title} to={card.to}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{card.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
