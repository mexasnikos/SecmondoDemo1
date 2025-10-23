import type { Metadata } from "next";
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import "./globals.css";

export const metadata: Metadata = {
  title: "TravelSafe - Travel Insurance",
  description: "Comprehensive travel insurance for your next adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
