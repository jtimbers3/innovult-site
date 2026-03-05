import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innovult LLC",
  description: "Federal-friendly technology and modernization services.",
};

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Innovult LLC
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-slate-700">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-slate-950">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-sm text-slate-600">
            <p>© {new Date().getFullYear()} Innovult LLC</p>
            <Link href="/contact" className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
              Book a call
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
