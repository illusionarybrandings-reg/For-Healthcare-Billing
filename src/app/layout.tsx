import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "For Healthcare — Billing & Invoice System",
  description: "Nursing Home & Home Healthcare Invoice Generator & Patient Billing System for For Healthcare",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print mt-auto">
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-semibold text-slate-700">For Healthcare — Billing &amp; Invoice Management System</p>
            <p className="mt-1">
              3rd, SUKRITHI # 1043, 2nd cross, main, BTM 4th Stage, Bilekahalli, Bengaluru, Karnataka 560076 | +91 81975 26597 | +91 99640 05780 | forhealthcare.forlife@gmail.com
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
