import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-6">
          <Link href="/" className="mb-4 inline-block text-2xl font-semibold text-gold">
            Oscar Night Couples
          </Link>
          {children}
        </main>
      </body>
    </html>
  );
}
