"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const photos = [
  "/showcase/portrait-1.jpg",
  "/showcase/portrait-2.jpg",
  "/showcase/portrait-3.jpg",
  "/showcase/portrait-4.jpg"
];

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative"
    >
      <Card className="surface relative overflow-hidden">
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
            <div className="relative min-h-[340px] overflow-hidden rounded-3xl">
              <Image
                src={photos[0]}
                alt="Mithra portrait"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Badge className="mb-3 bg-background/90 text-foreground">Brand portrait</Badge>
                <p className="max-w-[18rem] text-sm text-white/90">
                  A composed visual language for a serious public-facing practice.
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              {photos.slice(1).map((photo, index) => (
                <motion.div
                  key={photo}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 * index, duration: 0.6 }}
                  className="relative min-h-[106px] overflow-hidden rounded-3xl"
                >
                  <Image src={photo} alt={`Gallery ${index + 2}`} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 20vw" />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Practice flow", value: "Booking + intake + follow-up" },
              { label: "Store layer", value: "Guided digital resources" },
              { label: "Brand focus", value: "People, education, and care" }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-background/80 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute -left-3 top-5 hidden w-44 rounded-3xl border border-border bg-card/95 p-4 shadow-soft backdrop-blur md:block"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Brand note</p>
        <p className="mt-2 text-sm font-semibold">Mei by Mithra</p>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          Professional, calm, and designed for trust.
        </p>
      </motion.div>
    </motion.div>
  );
}
