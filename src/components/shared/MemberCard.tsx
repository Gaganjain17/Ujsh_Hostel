import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface MemberCardProps {
  name: string;
  role?: string;
  details?: string;
  imageUrl?: string;
}

export default function MemberCard({ name, role, details, imageUrl }: MemberCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center shrink-0 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-accent-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-foreground">{name}</h3>
          {role && <p className="text-sm text-primary font-medium">{role}</p>}
          {details && <p className="text-sm text-muted-foreground mt-1">{details}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
