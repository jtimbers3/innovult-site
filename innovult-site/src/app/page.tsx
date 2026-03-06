import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="fade-up grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
            Federal ERP & Financial Systems Consulting
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[#0A3A66] sm:text-5xl">
            Federal ERP and Financial Modernization Delivered by Practitioners
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            innovult supports federal agencies and prime contractors delivering ERP, financial systems, and data
            modernization programs across SAP, Oracle, and enterprise analytics platforms.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary px-5 py-3 text-sm">
              Book a call
            </Link>
            <Link href="/services" className="btn-outline px-5 py-3 text-sm">
              Explore services
            </Link>
          </div>
        </div>

        <div className="group relative min-h-[260px] overflow-hidden rounded-xl border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1617581629397-a72507c3de9e?auto=format&fit=crop&w=1400&q=80"
            alt="Washington DC government district skyline"
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A3A66]/15 via-transparent to-transparent" />
        </div>
      </section>

      <section className="fade-up fade-up-delay-1 rounded-xl border border-[#0A3A66]/20 bg-[#0A3A66]/5 p-5 text-sm text-slate-700">
        Experience supporting large federal ERP modernization programs including SAP S/4HANA financial
        transformations.
      </section>

      <div className="section-divider" />

      <section className="fade-up fade-up-delay-1 grid gap-4 md:grid-cols-3">
        {[
          [
            "ERP & Financial Systems Implementation",
            "Support ERP implementations including financial management, procurement integration, and system transition planning.",
            "https://images.unsplash.com/photo-1638913662252-70efce1e60a7?auto=format&fit=crop&w=900&q=80",
          ],
          [
            "Business Intelligence & Data Platforms",
            "Build reporting and analytics environments that support federal financial operations, program management, and executive oversight.",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
          ],
          [
            "IT PMO & Program Delivery",
            "Provide PMO leadership for large federal IT programs, including governance, scheduling, stakeholder coordination, and delivery oversight.",
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
          ],
        ].map(([title, body, image]) => (
          <article
            key={title}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 leading-7 text-slate-700">{body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="fade-up fade-up-delay-2 rounded-xl border border-slate-200 bg-white p-6 text-slate-700">
        innovult partners with prime contractors to strengthen teams delivering federal ERP and financial
        modernization programs.
      </section>
    </div>
  );
}
