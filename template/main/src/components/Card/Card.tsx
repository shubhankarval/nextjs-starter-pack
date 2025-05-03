interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Feature card component
export function Card({ icon, title, description }: CardProps) {
  return (
    <div className="border-border flex flex-col items-center rounded-lg border p-3 text-center">
      <div className="mb-2">{icon}</div>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="text-muted-foreground text-xs">{description}</p>
    </div>
  );
}
