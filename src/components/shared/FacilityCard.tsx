import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FacilityCardProps {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function FacilityCard({ to, title, description, icon: Icon }: FacilityCardProps) {
  return (
    <Link to={to}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
        <CardContent className="p-6 text-center">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
