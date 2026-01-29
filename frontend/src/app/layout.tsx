import { QueryProvider } from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { Inria_Serif, Inter } from "next/font/google";
import "./globals.css";

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-inria-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Note Taking App",
  description: "A beautiful, distraction-free note taking app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inriaSerif.variable} ${inter.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
