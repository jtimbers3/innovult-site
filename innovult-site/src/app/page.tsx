import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2 md:p-10">
        <div>
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
        </div>

        <div className="relative min-h-[260px] overflow-hidden rounded-xl border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
            alt="Team reviewing project strategy"
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [
            "ERP & Financial Modernization",
            "Modernize finance operations with practical implementation support and integration.",
            "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=900&q=80",
          ],
          [
            "Business Intelligence & Reporting",
            "Turn operational data into decisions with dashboards, reporting, and analytics.",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
          ],
          [
            "IT PMO Delivery",
            "Drive outcomes with disciplined governance, schedules, and risk-managed execution.",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
          ],
        ].map(([title, body, image]) => (
          <article key={title} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="relative h-40">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-slate-700">{body}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
