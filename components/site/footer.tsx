import Link from "next/link";
import { brand, contact, owner } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/80">
      <div className="container-wide grid gap-6 py-10 text-sm md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <p className="font-semibold text-foreground">{owner.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">{brand.name}</p>
          <p className="mt-2 max-w-sm text-muted-foreground">
            A calm, editorial brand website for counselling, sexuality education, guided support, and practical
            digital resources.
          </p>
          <p className="mt-3 text-muted-foreground">{contact.location}</p>
          <Link className="mt-1 block text-foreground underline-offset-4 hover:underline" href={`mailto:${contact.email}`}>
            {contact.email}
          </Link>
        </div>
        <div className="space-y-2 text-muted-foreground">
          <p className="font-medium text-foreground">Pages</p>
          <Link className="block" href="/">Home</Link>
          <Link className="block" href="/about">About</Link>
          <Link className="block" href="/portfolio">Portfolio</Link>
          <Link className="block" href="/practice">Practice</Link>
          <Link className="block" href="/book">Book</Link>
          <Link className="block" href="/store">Store</Link>
        </div>
        <div className="space-y-2 text-muted-foreground">
          <p className="font-medium text-foreground">Resources</p>
          <Link className="block" href="/intake">Client Intake</Link>
          <Link className="block" href="/terms">Terms</Link>
          <Link className="block" href={contact.resumeUrl} target="_blank">
            Resume
          </Link>
          <Link className="block" href="/store">Playbooks</Link>
        </div>
      </div>
    </footer>
  );
}
