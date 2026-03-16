import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="card bg-gradient-to-r from-velvet to-slate-900">
        <h1 className="text-3xl font-bold">Predict the Oscars. Beat your friends.</h1>
        <p className="mt-2 text-slate-200">Build couple teams, lock picks, score live, and keep annual bragging rights.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/signup" className="rounded-full bg-gold px-5 py-2 text-black">Get started</Link>
          <Link href="/login" className="rounded-full border border-slate-600 px-5 py-2">Sign in</Link>
        </div>
      </section>
    </div>
  );
}
