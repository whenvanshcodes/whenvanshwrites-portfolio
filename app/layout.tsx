import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "whenvanshwrites",
  description: "Data analysis, business analysis and practical solutions for startups. Explore Vansh Bhati’s work and illustrated village.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'https://whenvanshwrites.is-a.dev')
  ),
  openGraph: {title:'whenvanshwrites',description:'Data analysis, business analysis and practical solutions for startups.',type:'website',images:[{url:'/portfolio-preview.png',width:1200,height:630,alt:'Vansh Bhati’s illustrated portfolio village'}]},
  twitter: {card:'summary_large_image',title:'whenvanshwrites',description:'Data analysis, business analysis and practical solutions for startups.',images:['/portfolio-preview.png']},
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/><link rel="stylesheet" href="/portfolio-theme.css"/><link rel="stylesheet" href="/entry-editorial.css"/></head><body className="antialiased">{children}</body>
    </html>
  );
}
