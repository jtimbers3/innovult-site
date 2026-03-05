import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2 md:p-10">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">Federal technology partner</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[#0A3A66] sm:text-5xl">
            Mission-focused modernization for agencies and prime contractors.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-700">
            Innovult LLC helps federal teams deliver ERP, business intelligence, financial process modernization,
            and IT PMO execution with speed, clarity, and accountability.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/contact" className="rounded-md bg-[#0A3A66] px-5 py-3 text-sm font-semibold text-white hover:bg-[#072A4A]">
              Book a call
            </Link>
            <Link href="/services" className="rounded-md border border-[#0A3A66]/30 px-5 py-3 text-sm font-semibold text-[#0A3A66] hover:bg-[#0A3A66]/5">
              Explore services
            </Link>
          </div>
        </div>

        <div className="relative min-h-[260px] overflow-hidden rounded-xl border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1617581629397-a72507c3de9e?auto=format&fit=crop&w=1400&q=80"
            alt="Washington DC government district skyline"
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
            "https://images.unsplash.com/photo-1638913662252-70efce1e60a7?auto=format&fit=crop&w=900&q=80",
          ],
          [
            "Business Intelligence & Reporting",
            "Turn operational data into decisions with dashboards, reporting, and analytics.",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
          ],
          [
            "IT PMO Delivery",
            "Drive outcomes with disciplined governance, schedules, and risk-managed execution.",
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
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
