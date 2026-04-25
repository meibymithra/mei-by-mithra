import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="w-full">
          <Link href="/store">Browse Resources</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/book">Book a Session</Link>
        </Button>
      </div>
    </div>
  );
}
