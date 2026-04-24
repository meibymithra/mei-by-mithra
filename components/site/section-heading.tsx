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
    <div className="max-w-2xl space-y-3">
      {eyebrow ? <Badge variant="outline">{eyebrow}</Badge> : null}
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {description ? <p className="text-sm leading-7 text-muted-foreground sm:text-base">{description}</p> : null}
    </div>
  );
}
