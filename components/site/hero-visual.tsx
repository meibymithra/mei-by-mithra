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
          <div className="grid gap-3 sm:grid-cols-[1.08fr_.92fr]">
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl">
              <Image
                src={photos[0]}
                alt="Mithra portrait"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Badge className="mb-3 bg-background/90 text-foreground">Editorial portrait</Badge>
                <p className="max-w-[18rem] text-sm leading-6 text-white/90">
                  Built to feel calm, credible, and unmistakably human from the first screen.
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {photos.slice(1, 3).map((photo, index) => (
                  <motion.div
                    key={photo}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 * index, duration: 0.6 }}
                    className="relative min-h-[180px] overflow-hidden rounded-3xl"
                  >
                    <Image src={photo} alt={`Gallery ${index + 2}`} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 20vw" />
                  </motion.div>
                ))}
              </div>
              <div className="rounded-3xl border border-border bg-background/80 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-primary">How the brand reads</p>
                <p className="mt-3 text-lg font-semibold">Professional enough for institutions, gentle enough for sensitive work</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  The visual direction stays warm and soft, but it still carries seriousness, authorship, and a clear point of view.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.24, duration: 0.6 }}
                className="relative min-h-[120px] overflow-hidden rounded-3xl"
              >
                <Image src={photos[3]} alt="Gallery 4" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 20vw" />
              </motion.div>
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Session flow", value: "Book, complete intake, then begin with context" },
              { label: "Resource layer", value: "Playbooks for parents, teachers, and children" },
              { label: "Practice stance", value: "Rights, respect, responsibility, and education" }
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
          Distinctive, composed, and designed for trust.
        </p>
      </motion.div>
    </motion.div>
  );
}
