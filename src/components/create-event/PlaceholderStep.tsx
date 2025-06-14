
interface PlaceholderStepProps {
  title: string;
  description: string;
}

export function PlaceholderStep({ title, description }: PlaceholderStepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
