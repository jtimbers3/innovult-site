import Image from "next/image";
import Link from "next/link";
import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function HomePage() {
  const cards = [
    {
      title: "ERP & Financial Systems Implementation",
      body: "Support ERP implementations including financial management, procurement integration, and system transition planning.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "ERP Modernization Readiness Assessment",
      body: "Evaluate your organization’s readiness for financial system modernization. Identify potential risks in governance, integration, data conversion, and change management before implementation begins.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
      href: "/federal-erp-modernization-readiness-assessment",
    },
    {
      title: "Business Intelligence & Data Platforms",
      body: "Build reporting and analytics environments that support federal financial operations, program management, and executive oversight.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "IT PMO & Program Delivery",
      body: "Provide PMO leadership for large federal IT programs, including governance, scheduling, stakeholder coordination, and delivery oversight.",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "AI-Enabled Analysis & Decision Support",
      body: "Use modern artificial intelligence tools to support analysis, insight generation, and informed decision-making across complex federal technology and financial modernization programs.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <div className="space-y-12">
      <FadeInOnScroll>
        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-10">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              Federal ERP & Financial Systems Consulting
            </p>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[#0A3A66] sm:text-5xl">
              Federal ERP and Financial Modernization Delivered by Practitioners
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              innovult supports federal agencies and prime contractors delivering ERP, financial systems, and data
              modernization programs across Oracle, SAP, and enterprise analytics platforms.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="rounded-xl border border-[#0A3A66]/20 bg-[#0A3A66]/5 p-5 text-sm text-slate-700">
          Experience supporting large federal ERP modernization programs including Oracle and SAP S/4HANA financial
          transformations.
        </section>
      </FadeInOnScroll>

      <div className="section-divider" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <FadeInOnScroll key={card.title} delayMs={index * 90}>
            <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-950">{card.title}</h2>
                <p className="mt-2 leading-7 text-slate-700">{card.body}</p>
                {card.href ? (
                  <div className="mt-4">
                    <Link href={card.href} className="btn-outline px-4 py-2 text-sm">
                      Open Assessment
                    </Link>
                  </div>
                ) : null}
              </div>
            </article>
          </FadeInOnScroll>
        ))}
      </section>
    </div>
  );
}
