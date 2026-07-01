import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { buildMetadata } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "./sitemap";
import { ThemeProvider } from "@/components/theme-provider";
import { AccountProvider } from "@/components/account-provider";
import { NavigationBar } from "@/components/navigation-bar";
import { Footer } from "@/components/footer";

// Body text: Inter — a highly legible, neutral workhorse used by Linear/Vercel.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display/headings: Plus Jakarta Sans — geometric, modern, premium character.
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Code/monospace: JetBrains Mono for tool names, code, and technical labels.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Default SEO metadata applied to all routes unless overridden (Req 14.5).
 */
export const metadata: Metadata = {
  ...buildMetadata({}),
  metadataBase: new URL(SITE_URL),
  applicationName: "DevAtlas",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  keywords: [
    "developer roadmaps",
    "free developer tools",
    "learn to code",
    "coding roadmap",
    "free certifications",
    "programming projects",
    "frontend roadmap",
    "backend roadmap",
    "web development",
    "software engineering career",
  ],
  authors: [{ name: "Sarang Kadam" }],
  creator: "Sarang Kadam",
  openGraph: {
    type: "website",
    siteName: "DevAtlas",
    title: "DevAtlas — Master Any Developer Path",
    description:
      "Free developer roadmaps, curated free tools, hands-on projects, free certifications, and learning resources — all in one place.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevAtlas — Master Any Developer Path",
    description:
      "Free developer roadmaps, free tools, projects, and certifications. Build more. Search less. Grow faster.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="SzQ3sLC7UVHNiRLHiWGzLdctWSKiqjAq7YxkOosjDxk" />
        {/* Google AdSense account verification */}
        <meta name="google-adsense-account" content="ca-pub-8613769205254730" />
        {/* Organization + WebSite structured data (schema.org) for rich results */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {/* Google AdSense */}
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8613769205254730"
          crossOrigin="anonymous"
        />
        {/* Microsoft Clarity Analytics */}
        <Script
          id="clarity-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "x9ypxx1p7k");
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {/* Skip link for keyboard accessibility (Req 13.6) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>

        <ThemeProvider>
          <AccountProvider>
            <NavigationBar />
            <main id="main-content" className="page-enter flex-1">
              {children}
            </main>
            <Footer />
          </AccountProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
