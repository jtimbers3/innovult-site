import Image from "next/image";

export default function ServicesPage() {
  const services = [
    {
      title: "ERP Implementation & Modernization",
      detail:
        "Support ERP modernization programs including planning, design validation, implementation coordination, and transition to operations across federal financial and procurement systems.",
    },
    {
      title: "Federal Financial Operations & Process Modernization",
      detail:
        "Improve financial operations including reconciliations, internal controls, reporting processes, and audit readiness across federal financial management environments.",
    },
    {
      title: "Data & Business Intelligence Platforms",
      detail:
        "Design reporting and analytics environments that support federal financial operations, program performance monitoring, and executive decision-making.",
    },
    {
      title: "Program & PMO Delivery Support",
      detail:
        "Provide PMO leadership across complex federal IT programs including governance structures, integrated master schedules, risk management, and stakeholder coordination.",
    },
    {
      title: "AI-Enabled Analysis & Program Insights",
      detail:
        "Leverage modern AI tools to accelerate analysis, synthesize complex information, and generate insights that support decision-making across ERP modernization and federal financial management programs.",
    },
    {
      title: "ERP Program Strategy & Planning",
      detail:
        "Support early-stage ERP modernization efforts including implementation planning, governance design, and program readiness assessments.",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A3A66] sm:text-4xl">Services</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
            innovult provides specialized support for federal ERP modernization, financial system transformation,
            and data platforms. We partner with agencies and prime contractors to strengthen program delivery
            across complex IT initiatives.
          </p>
        </div>
        <div className="relative h-64 overflow-hidden rounded-xl border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
            alt="Digital services dashboard"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {services.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-slate-700">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-[#0A3A66]">Working With Prime Contractors</h2>
        <p className="mt-2 text-slate-700">
          innovult partners with prime contractors delivering federal ERP and financial modernization programs.
          We provide experienced support across ERP implementation, analytics, financial operations, and program
          delivery to strengthen teams executing complex IT initiatives.
        </p>
      </section>
    </div>
  );
}
