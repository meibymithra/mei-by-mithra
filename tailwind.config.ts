import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./server/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      colors: {
        rust: "#B72E09",
        cream: "#F5EEDC",
        sage: "#84A18F",
        brown: "#896C68",
        sand: "#F4DDA7",
        coral: "#ED8D75",
        beige: "#EAC9AA",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(183,46,9,0.14), transparent 34%), radial-gradient(circle at top right, rgba(132,161,143,0.16), transparent 28%), linear-gradient(180deg, rgba(245,238,220,0.9), rgba(245,238,220,0.96))"
      },
      boxShadow: {
        soft: "0 16px 40px -20px rgba(55, 45, 36, 0.32)",
        glow: "0 24px 80px -24px rgba(183, 46, 9, 0.38)"
      }
    }
  },
  plugins: []
};

export default config;
