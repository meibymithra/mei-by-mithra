"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/98 p-3 backdrop-blur-md">
      <div className="grid grid-cols-2 gap-2">
        <Button asChild variant="outline" size="sm" className="h-11">
          <Link href="/store">Browse Resources</Link>
        </Button>
        <Button asChild size="sm" className="h-11">
          <Link href="/book">Book a Session</Link>
        </Button>
      </div>
    </div>
  );
}