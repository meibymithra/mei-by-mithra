"use client";

import { motion } from "framer-motion";

export function BrandScene({ variant = "home" }: { variant?: "home" | "about" | "practice" }) {
  const palette =
    variant === "about"
      ? { fillA: "#84A18F", fillB: "#F4DDA7", stroke: "#896C68" }
      : variant === "practice"
        ? { fillA: "#ED8D75", fillB: "#84A18F", stroke: "#B72E09" }
        : { fillA: "#B72E09", fillB: "#EAC9AA", stroke: "#84A18F" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="surface section-frame overflow-hidden rounded-[2rem] p-4"
    >
      <svg viewBox="0 0 720 520" className="h-full w-full" fill="none" aria-hidden>
        <defs>
          <linearGradient id={`wash-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.fillA} stopOpacity="0.22" />
            <stop offset="100%" stopColor={palette.fillB} stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <rect x="18" y="18" width="684" height="484" rx="36" fill={`url(#wash-${variant})`} />

        <motion.path
          d="M88 350C130 253 222 200 298 200C381 200 445 257 472 335C488 381 521 401 577 404"
          stroke={palette.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M141 162C173 126 215 110 268 110C338 110 392 142 438 197"
          stroke={palette.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: 0.12 }}
        />

        <motion.circle
          cx="236"
          cy="149"
          r="60"
          fill={palette.fillB}
          fillOpacity="0.46"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="495"
          cy="246"
          r="90"
          fill={palette.fillA}
          fillOpacity="0.18"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M192 382C247 329 298 304 368 304C442 304 501 337 559 395"
          stroke={palette.fillA}
          strokeWidth="18"
          strokeLinecap="round"
          strokeOpacity="0.18"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.18 }}
        />
        <path
          d="M117 423C207 450 322 463 430 445C499 434 561 411 612 380"
          stroke={palette.stroke}
          strokeWidth="1.2"
          strokeDasharray="6 12"
          strokeOpacity="0.48"
        />

        <g opacity="0.84">
          <circle cx="127" cy="126" r="6" fill={palette.stroke} />
          <circle cx="577" cy="132" r="5" fill={palette.fillA} />
          <circle cx="594" cy="356" r="6" fill={palette.fillB} />
          <circle cx="169" cy="343" r="5" fill={palette.fillA} />
        </g>
      </svg>
    </motion.div>
  );
}
