import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  muted?: boolean;
}

export default function SectionWrapper({ children, className, title, subtitle, muted }: SectionWrapperProps) {
  return (
    <section className={cn("py-12 md:py-16", muted && "bg-muted/50", className)}>
      <div className="container">
        {title && (
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
