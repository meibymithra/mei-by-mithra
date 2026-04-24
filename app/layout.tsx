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

export const metadata: Metadata = {
  title: "Mithra Krishnamoorthy | Mei by Mithra",
  description:
    "Mei by Mithra is the public brand and support practice for Mithra Krishnamoorthy, with calm booking, intake, and digital resources."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
