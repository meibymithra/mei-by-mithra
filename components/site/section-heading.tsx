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
    <div className="max-w-2xl space-y-2.5">
      {eyebrow ? <Badge variant="outline" className="text-xs">{eyebrow}</Badge> : null}
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}