"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 backdrop-blur-md backdrop-saturate-150">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6">
        <div className="text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Next step</p>
          <p className="font-semibold text-lg text-foreground">Ready to begin?</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-3 w-full sm:w-auto">
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/store">Browse Resources</Link>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/book">Book a Session</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}