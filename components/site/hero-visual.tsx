"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { homeHeroFallback } from "@/lib/constants";

const photos = [
  "/showcase/portrait-1.jpg",
  "/showcase/portrait-2.jpg",
  "/showcase/portrait-3.jpg",
  "/showcase/portrait-4.jpg"
];

type HomeHeroCopy = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export function HeroVisual({ content }: { content: HomeHeroCopy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <div className="relative min-h-[520px] overflow-hidden rounded-[2rem]">
        <Image
          src={photos[0]}
          alt="Mithra portrait"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-rust/10 to-rust/30" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">{content.eyebrow}</p>
            <h2 className="font-heading text-3xl font-bold text-white/90 sm:text-4xl">
              {content.title}
            </h2>
            <p className="text-base leading-relaxed text-white/80 max-w-[32rem]">
              {content.description}
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg" className="px-8 py-3">
                <Link href={content.primaryCtaHref ?? homeHeroFallback.primaryCtaHref}>
                  {content.primaryCtaLabel ?? homeHeroFallback.primaryCtaLabel}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3 border border-white/20 hover:border-white/30">
                <Link href={content.secondaryCtaHref ?? homeHeroFallback.secondaryCtaHref}>
                  {content.secondaryCtaLabel ?? homeHeroFallback.secondaryCtaLabel}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute -left-3 top-5 hidden w-44 rounded-3xl border border-border bg-card/95 p-4 shadow-soft backdrop-blur md:block"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Brand note</p>
        <p className="mt-2 text-sm font-semibold">Mei by Mithra</p>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          Distinctive, composed, and designed for trust.
        </p>
      </motion.div>
    </motion.div>
  );
}
