import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const heading = localFont({
  src: [
    { path: "../public/fonts/bantayog/Bantayog-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/bantayog/Bantayog-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/bantayog/Bantayog-Semilight.woff2", weight: "500", style: "normal" }
  ],
  variable: "--font-heading"
});

const body = localFont({
  src: [
    { path: "../public/fonts/playpen-sans/static/PlaypenSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/playpen-sans/static/PlaypenSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/playpen-sans/static/PlaypenSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/playpen-sans/static/PlaypenSans-SemiBold.ttf", weight: "600", style: "normal" }
  ],
  variable: "--font-body"
});

const siteUrl = process.env.SITE_URL ?? "https://meibymithra.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mithra Krishnamoorthy | Mei by Mithra",
    template: "%s | Mithra Krishnamoorthy"
  },
  description:
    "Professional brand website for Mithra Krishnamoorthy, featuring counselling, sexuality education, facilitation work, bookings, intake, and digital playbooks.",
  openGraph: {
    title: "Mithra Krishnamoorthy | Mei by Mithra",
    description:
      "Portfolio, practice, store, and booking experience for Mithra Krishnamoorthy.",
    url: siteUrl,
    siteName: "Mei by Mithra",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mithra Krishnamoorthy | Mei by Mithra",
    description:
      "Portfolio, practice, store, and booking experience for Mithra Krishnamoorthy."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
