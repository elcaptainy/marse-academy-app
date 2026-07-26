import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ContactWidget from "./components/ContactWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marse-academy.com"),
  title: {
    default: "MARSE Academy of Fashion & Arts | Luxury Creative Education",
    template: "%s | MARSE Academy"
  },
  description: "MARSE Academy is a premium creative institution merging high fashion, modeling, performing arts, and photography to nurture the next generation of creative leaders in London & Vienna.",
  keywords: ["fashion academy london", "fashion modeling school", "photography course london", "creative arts school", "modeling class vienna", "luxury acting classes", "Marse Academy"],
  authors: [{ name: "Julia Marse" }],
  creator: "Julia Marse",
  publisher: "MARSE Academy",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://marse-academy.com",
    title: "MARSE Academy of Fashion & Arts | Luxury Creative Education",
    description: "Nurturing future leaders, creative directors, and confident communicators through elite training in fashion, modeling, acting, and photography.",
    siteName: "MARSE Academy of Fashion & Arts",
    images: [
      {
        url: "/about-models.png",
        width: 1200,
        height: 630,
        alt: "MARSE Academy Students",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MARSE Academy of Fashion & Arts | Luxury Creative Education",
    description: "Nurturing future leaders, creative directors, and confident communicators through elite training in fashion, modeling, acting, and photography.",
    images: ["/about-models.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://marse-academy.com/#organization",
        "name": "MARSE Academy of Fashion & Arts",
        "url": "https://marse-academy.com",
        "logo": "https://marse-academy.com/logo.png",
        "description": "London's leading multidisciplinary academy for fashion, modeling, acting, and photography education.",
        "founder": {
          "@type": "Person",
          "name": "Julia Marse",
          "jobTitle": "International Fashion Photographer & Master Creative Director"
        },
        "sameAs": [
          "https://instagram.com/marseacademy",
          "https://tiktok.com/@marseacademy"
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://marse-academy.com/#localbusiness",
        "name": "MARSE Academy London Studio Campus",
        "url": "https://marse-academy.com",
        "telephone": "+442079460912",
        "priceRange": "££££",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Mayfair, Westminster",
          "addressLocality": "London",
          "postalCode": "W1K",
          "addressCountry": "UK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 51.509865,
          "longitude": -0.148032
        }
      },
      {
        "@type": "Course",
        "@id": "https://marse-academy.com/#course",
        "name": "Multidisciplinary Fashion, Acting & Arts Programme",
        "description": "12-week comprehensive curriculum covering runway modeling, camera acting, studio photography, and confidence building for youth in London.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "MARSE Academy of Fashion & Arts",
          "sameAs": "https://marse-academy.com"
        }
      }
    ]
  };

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="en" className={`${inter.variable} ${cormorantGaramond.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Dynamic Google Analytics (GA4) Integration */}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* Dynamic Meta Pixel (Facebook Pixel) Integration */}
        {pixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body>
        {children}
        <ContactWidget />
      </body>
    </html>
  );
}
