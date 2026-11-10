import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./onboarding.css";
import "./buddy.css";
import "./responsive.css";

export const metadata: Metadata = {
  title: "Study Buddy",
  description:
    "Find your people and study smarter at QUT.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "only light",
  themeColor: "#F1F6FF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Plus+Jakarta+Sans:wght@700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
