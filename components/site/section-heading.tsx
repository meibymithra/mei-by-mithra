import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      {eyebrow ? <Badge variant="outline" className="text-xs tracking-[0.28em]">{eyebrow}</Badge> : null}
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}