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
  title: "OM PRAKASH SAHU INSURANCE SERVICES | Your Protection. Our Priority.",
  description:
    "Leading insurance advisory firm in Raipur, Chhattisgarh. Customized Motor, Health, Life, Travel, Home, and Commercial Business insurance solutions with personalized claims advocacy.",
  keywords: [
    "Om Prakash Sahu Insurance",
    "Insurance Services Raipur",
    "Health Insurance Chhattisgarh",
    "Motor Insurance Raipur",
    "Term Life Insurance Advisor",
    "Star Health Insurance Raipur",
    "HDFC ERGO Raipur",
  ],
  icons: {
    icon: "/images/ops-logo.jpg",
    apple: "/images/ops-logo.jpg",
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
