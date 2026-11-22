import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { themeInitScript } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Juegos Digitales Chile · Rediseño",
  description: "Mockup interactivo del rediseño de Juegos Digitales Chile",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" data-theme="dark" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
