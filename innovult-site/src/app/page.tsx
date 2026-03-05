import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="rounded-2xl border border-slate-200 bg-white p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">Federal technology partner</p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Mission-focused modernization for agencies and prime contractors.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-700">
          Innovult LLC helps federal teams deliver ERP, business intelligence, financial process modernization,
          and IT PMO execution with speed, clarity, and accountability.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/contact" className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            Book a call
          </Link>
          <Link href="/services" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
            Explore services
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["ERP & Financial Modernization", "Modernize finance operations with practical implementation support and integration."],
          ["Business Intelligence & Reporting", "Turn operational data into decisions with dashboards, reporting, and analytics."],
          ["IT PMO Delivery", "Drive outcomes with disciplined governance, schedules, and risk-managed execution."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-slate-700">{body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
