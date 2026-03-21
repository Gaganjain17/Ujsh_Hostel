interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section
      className="relative py-20 md:py-28 flex items-center justify-center text-center bg-cover bg-center"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <div className="absolute inset-0 bg-foreground/75" />
      <div className="relative z-10 container px-4">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
