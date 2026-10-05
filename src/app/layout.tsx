import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OP LIFE SOLUTIONS | SECURE TODAY | BRIGHTER TOMORROW",
  description:
    "OP Life Solutions — Insurance advisory services by Om Prakash Sahu. Customized Motor, Health, Life, Travel, Home, and Commercial Business insurance solutions with personalized claims advocacy.",
  keywords: [
    "OP Life Solutions",
    "Om Prakash Sahu",
    "Insurance Services",
    "Health Insurance",
    "Motor Insurance",
    "Term Life Insurance Advisor",
    "Life Solutions",
  ],
  icons: {
    icon: "/images/op-life-solutions-logo.jpg",
    apple: "/images/op-life-solutions-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 selection:bg-[#D9A441]/30 selection:text-[#06223B]">
        {children}
      </body>
    </html>
  );
}
