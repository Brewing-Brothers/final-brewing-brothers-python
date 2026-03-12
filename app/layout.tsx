import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brewing Brothers — Organic Juice",
  description: "Farm-fresh cold-pressed organic juice. Small-batch crafted daily in Northern California.",
  openGraph: { title:"Brewing Brothers — Organic Juice", description:"Cold-pressed. USDA Organic. Local CA farm sourced.", type:"website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
